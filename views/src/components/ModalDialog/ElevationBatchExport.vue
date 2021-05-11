<template>
	<Modal
		title="批量导出高程点数据"
		:maskClosable="false"
		:visible="show"
		centered
		:bodyStyle="{height: '240px', overflow: 'auto'}"
		@cancel="handleClose"
	>
		<section class="modal_body">
			<Descriptions layout="vertical" :column="2">
				<DescriptionsItem :span="2">
					<template #label>选择的坐标图层</template>
					{{ elevationPointList.map(e => e.title).join(', ') }}
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
			</Descriptions>
		</section>
		<template #footer>
			<Button @click="handleDownload" type="primary">下载数据文件</Button>
		</template>
	</Modal>
</template>

<script lang="ts">
	import { defineComponent, PropType, computed, ref, toRefs, watch } from 'vue'
	import { Modal, Descriptions, Button, Select } from 'ant-design-vue'
	import JSZip from 'jszip'
	const { Item: DescriptionsItem } = Descriptions
	const { Option: SelectOption } = Select

	import { dataSrc2Csv, convertPosition } from '@/hooks/util'
	import { ElevationPoint, ProjectionAlias } from '@/interface/Types'

	export default defineComponent({
		name: 'ElevationBatchExportModal',
		components: {
			Modal,
			Descriptions,
			DescriptionsItem,
			Button,
			Select,
			SelectOption,
		},
		props: {
			show: {
				type: Boolean,
				required: true,
			},
			elevationPointList: {
				type: Array as PropType<ElevationPoint[]>,
				required: true,
			}
		},
		emits: ['update:show'],
		setup(props, { emit })
		{
			const { elevationPointList } = toRefs(props)
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

			// 文件拓展名
			const fileExt = computed(() =>
			{
				switch (fileFormat.value)
				{
					case 'elevation':
						return 'dat'
					case 'line':
						return 'txt'
					case 'json':
						return 'json'
					case 'csv':
						return 'csv'
					default:
						break;
				}
			})

			// 获得高程点文本信息
			const data2Str = (ep: ElevationPoint) =>
			{
				switch (fileFormat.value)
				{
					case 'elevation':
						return ep.children.map((e, i) =>
						{
							const point = convertPosition(e.position, coordinateType.value)
							return `${i + 1}, ${point.y.toFixed(5)}, ${point.x.toFixed(5)}, ${point.z.toFixed(5)}\r\n`
						}).join('')
					case 'line':
						return ep.children.map(e =>
						{
							const point = convertPosition(e.position, coordinateType.value)
							return `${point.y.toFixed(5)}, ${point.x.toFixed(5)}\r\n`
						}).join('')
					case 'json':
						return JSON.stringify(
							ep.children.map(e =>
							{
								const point = convertPosition(e.position, coordinateType.value)
								return {
									lat: point.x,
									lng: point.y,
									alt: point.z,
								}
							})
						)
					case 'csv':
						return dataSrc2Csv(ep.children.map(c => convertPosition(c.position, coordinateType.value)), coordinateType.value)
					default:
						return '';
				}
			}

			const handleClose = () =>
			{
				emit('update:show', false)
			}

			// 下载压缩文件
			const handleDownload = () =>
			{
				const zip = new JSZip()
				elevationPointList.value.forEach(ep =>
				{
					const text = data2Str(ep)
					zip.file(`${ep.title}.${fileExt.value}`, text)
				})
				const promise: Promise<any> = zip.generateAsync({
					type: "base64",
				});

				if (promise)
				{
					promise.then((base64) =>
					{
						location.href = "data:application/zip;base64," + base64;
					});
				}
			}

			return {
				handleClose,
				handleDownload,

				coordinateType,
				fileFormat,
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
