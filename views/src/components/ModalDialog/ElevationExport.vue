<template>
	<Modal
		title="导出高程点数据"
		:maskClosable="false"
		:visible="show"
		:width="900"
		centered
		:bodyStyle="{height: '492px', overflow: 'auto'}"
		@cancel="handleClose"
	>
		<section class="modal_body">
			<Descriptions layout="vertical" :column="2">
				<DescriptionsItem :span="2">
					<template #label>选择的坐标图层</template>
					{{ elevationPoint.title }}
				</DescriptionsItem>
				<DescriptionsItem :span="1">
					<template #label>坐标类型</template>
					<Select v-model:value="coordinateType" style="width: 205px">
						<SelectOption value="WGS84">WGS 84 / UTM zone 51N</SelectOption>
						<SelectOption value="EPSG:32650">EPSG:32650</SelectOption>
						<SelectOption value="EPSG:3857">本地坐标</SelectOption>
					</Select>
				</DescriptionsItem>
				<DescriptionsItem :span="1">
					<template #label>导出的文件格式</template>
					<Select v-model:value="fileFormat" style="width: 205px">
						<SelectOption value="elevation" v-if="coordinateType !== 'EPSG:32650'">CASS 高程</SelectOption>
						<SelectOption value="line" v-if="coordinateType !== 'EPSG:32650'">CASS 线段</SelectOption>
						<SelectOption value="json" v-if="coordinateType === 'EPSG:32650'">json</SelectOption>
						<SelectOption value="csv">csv</SelectOption>
					</Select>
				</DescriptionsItem>
				<DescriptionsItem :span="2">
					<template #label>坐标点列表</template>
					<Table :columns="ElevationListColumn" :data-source="elevationList"></Table>
				</DescriptionsItem>
			</Descriptions>
		</section>
		<template #footer>
			<Space>
				<Button @click="handleDownload">下载数据文件</Button>
				<Button type="primary" @click="handleCopy">复制到粘贴板</Button>
			</Space>
		</template>
	</Modal>
</template>

<script lang="ts">
	import { clipboard } from 'electron'
	import { defineComponent, PropType, ref, computed, toRefs, watch } from 'vue'
	import { Modal, Button, Space, Descriptions, Table, Select, message } from 'ant-design-vue'
	const { Item: DescriptionsItem } = Descriptions
	const { Option: SelectOption } = Select
	import { ColumnProps } from 'ant-design-vue/lib/table/interface'

	import { dataSrc2Csv, download, convertProjection } from '@/hooks/util'
	import { ElevationPoint, ProjectionAlias } from '@/interface/Types'

	export interface ElevationListItem
	{
		x: number;
		y: number;
		z: number;
		key: string;
		title: string;
	}

	export type ElevationList = Array<ElevationListItem>

	const ElevationListColumn: ColumnProps[] = [
		{ title: '序号', dataIndex: 'title', key: 'title', },
		{ title: '东', dataIndex: 'y', key: 'y' },
		{ title: '北', dataIndex: 'x', key: 'x' },
		{ title: '高', dataIndex: 'z', key: 'z' },
	]

	export default defineComponent({
		name: 'ElevationExportModal',
		components: {
			Modal,
			Button,
			Space,
			Table,
			Descriptions,
			DescriptionsItem,
			Select,
			SelectOption,
			message,
		},
		props: {
			show: {
				type: Boolean,
				required: true,
			},
			elevationPoint: {
				type: Object as PropType<ElevationPoint>,
				required: true,
			}
		},
		emits: ['update:show'],
		setup(props, { emit })
		{
			const { elevationPoint } = toRefs(props)
			const coordinateType = ref<ProjectionAlias>(ProjectionAlias.WGS84)
			const fileFormat = ref<'line' | 'elevation' | 'csv' | 'json'>('elevation')

			watch(coordinateType, (type, oldType) =>
			{
				if (type !== oldType && (type === ProjectionAlias.EPSG_32650 && oldType !== ProjectionAlias.EPSG_32650))
				{
					fileFormat.value = 'json'
				}
				else
				{
					fileFormat.value = 'elevation'
				}
			})

			// table 数据，同时处理坐标转换
			const elevationList = computed<ElevationList>(() =>
			{
				switch (coordinateType.value)
				{
					case ProjectionAlias.WGS84:
						return elevationPoint.value.children.map((p, index) =>
						{
							return {
								key: p.key,
								title: `S${index + 1}`,
								x: Number(p.position.x.toFixed(5)),
								y: Number(p.position.y.toFixed(5)),
								z: Number(p.position.z.toFixed(5)),
							}
						})
					case ProjectionAlias.EPSG_32650:

						return elevationPoint.value.children.map((p, index) =>
						{
							const gpsPoint = convertProjection(ProjectionAlias.WGS84, ProjectionAlias.EPSG_32650, [p.position.y, p.position.x])
							return {
								key: p.key,
								title: `S${index + 1}`,
								x: Number(gpsPoint[1].toFixed(5)),
								y: Number(gpsPoint[0].toFixed(5)),
								z: Number(p.position.z.toFixed(5)),
							}
						})
					case ProjectionAlias.LOCAL:
						return elevationPoint.value.children.map((p, index) =>
						{
							const localPoint = convertProjection(ProjectionAlias.WGS84, ProjectionAlias.LOCAL, [p.position.y, p.position.x])
							return {
								key: p.key,
								title: `S${index + 1}`,
								x: Number(localPoint[1].toFixed(5)),
								y: Number(localPoint[0].toFixed(5)),
								z: Number(p.position.z.toFixed(5)),
							}
						})
					default:
						break;
				}
			})
			// 所选高程点的文本信息
			const elevationText = computed<string>(() =>
			{
				switch (fileFormat.value)
				{
					case 'elevation':
						return elevationList.value.map((e, i) =>
						{
							return `${i + 1}, ${e.y}, ${e.x}, ${e.z}\r\n`
						}).join('')
					case 'line':
						return elevationList.value.map(e =>
						{
							return `${e.y}, ${e.x}\r\n`
						}).join('')
					case 'json':
						return JSON.stringify(
							elevationList.value.map(e =>
							{
								return {
									lat: e.x,
									lng: e.y,
									alt: e.z,
								}
							})
						)
					case 'csv':
						return dataSrc2Csv(elevationList.value, coordinateType.value)
					default:
						break;
				}
			})

			const handleClose = () =>
			{
				emit('update:show', false)
			}

			const handleCopy = () =>
			{
				clipboard.writeText(elevationText.value)
				message.success({
					content: '已复制到粘贴板',
					key: 'copySuccessed',
				})
			}
			// 下载文件
			const handleDownload = () =>
			{
				switch (fileFormat.value)
				{
					case 'elevation':
						download(elevationPoint.value.title + '.dat', elevationText.value, 'dat')
						break;
					case 'line':
						download(elevationPoint.value.title + '.txt', elevationText.value, 'txt')
						break;
					case 'json':
						download(elevationPoint.value.title + '.json', elevationText.value, 'json')
						break;
					case 'csv':
						download(elevationPoint.value.title + '.csv', elevationText.value, 'csv')
						break;
					default:
						break;
				}
			}

			return {
				coordinateType,
				fileFormat,
				elevationList,
				ElevationListColumn,

				handleClose,
				handleCopy,
				handleDownload,
			}
		},
	})
</script>

<style lang="less" scoped>
	@import "@/styles/colors.less";
	@import "@/styles/common.less";
	@import "@/styles/layout.less";

	::v-deep(th.ant-descriptions-item) {
		padding-bottom: 8px;

		.ant-descriptions-item-content {
			.label(14px, @FONT_MAIN);
		}

		.ant-descriptions-item-label {
			.label(12px, #959fa6);
		}
	}
</style>