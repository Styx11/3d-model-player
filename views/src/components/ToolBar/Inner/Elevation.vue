<template>
	<div class="elevation_inner">
		<main class="elevation_main">
			<div class="elevation_item" v-for="ep in elevationPointList" :key="ep.key">
				<span class="item_title">{{ep.title}}</span>
				<span class="item_icons">
					<Icon name="ic-download" :width="18" :height="18" interactive @click="handleExport(ep)" />
					<Icon name="ic-trash" :width="18" :height="18" interactive @click="confirmDel(ep)" />
					<Icon
						name="ic-eye"
						:width="18"
						:height="18"
						interactive
						v-if="ep.show"
						@click="handleHidePoint(ep)"
					/>
					<Icon
						name="ic-hidden-eye"
						:width="18"
						:height="18"
						interactive
						v-else
						@click="handleHidePoint(ep)"
					/>
					<Icon
						name="ic-display-data"
						:width="18"
						:height="18"
						interactive
						v-if="ep.showLabel"
						@click="handleHideLabel(ep)"
					/>
					<Icon
						name="ic-hidden-data"
						:width="18"
						:height="18"
						interactive
						v-else
						@click="handleHideLabel(ep)"
					/>
				</span>
			</div>
		</main>
		<footer class="elevation_footer">
			<span style="margin: 0 6px;">
				<Icon name="ic-batch-export" :width="18" :height="18" />
			</span>
			<span class="batch_export" @click="handleBatchExport">批量导出</span>
		</footer>
		<ElevationExportModal v-model:show="showExportModal" :elevationPoint="exportPoint" />
		<ElevationBatchExportModal
			v-model:show="showBatchExportModal"
			:elevationPointList="elevationPointList"
		/>
	</div>
</template>

<script lang="ts">
	import { defineComponent, createVNode, computed, toRaw, ref, reactive } from 'vue'
	import { Modal } from 'ant-design-vue'
	import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

	import { useStore } from '@/store'
	import ElevationExportModal from '@/components/ModalDialog/ElevationExport.vue'
	import ElevationBatchExportModal from '@/components/ModalDialog/ElevationBatchExport.vue'
	import { ElevationPoint } from '@/interface/Types'
	import { ElevationPointMutation } from '@/store/elevation'
	import { removeEntity, toggleElevationPointLabel, toggleElevationPoint } from '@/hooks/cesium'

	export default defineComponent({
		name: 'ElevationInner',
		components: {
			ElevationExportModal,
			ElevationBatchExportModal,
		},
		setup()
		{
			const store = useStore()
			const elevationPointList = computed(() => store.state.elevationPoint.list)
			const showExportModal = ref<boolean>(false)
			const showBatchExportModal = ref<boolean>(false)
			const exportPoint = reactive({} as ElevationPoint)

			const confirmDel = (point: ElevationPoint) =>
			{
				Modal.confirm({
					title: '确认删除该高程点区域？',
					icon: createVNode(ExclamationCircleOutlined),
					content: '该操作是无法撤销的',
					onOk()
					{
						point.children.forEach(p => removeEntity(p.key))
						return store.commit(ElevationPointMutation.REMOVE_ELEVATION, point.key)
					},
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					onCancel() { },
				});
			}

			const handleHideLabel = (point: ElevationPoint) =>
			{
				if (!point.show) return
				const rawPoint = toRaw(point)
				const _point = Object.assign({}, rawPoint, { showLabel: !rawPoint.showLabel })
				toggleElevationPointLabel(_point.children, _point.showLabel)
				store.commit(ElevationPointMutation.UPDATE_ELEVATION, _point)
			}

			const handleHidePoint = (point: ElevationPoint) =>
			{
				const rawPoint = toRaw(point)
				const _point = Object.assign({}, rawPoint, { show: !rawPoint.show, showLabel: !rawPoint.showLabel })
				toggleElevationPoint(_point.children, _point.show)
				store.commit(ElevationPointMutation.UPDATE_ELEVATION, _point)
			}

			const handleExport = (point: ElevationPoint) =>
			{
				Object.assign(exportPoint, toRaw(point))
				showExportModal.value = !showExportModal.value
			}

			const handleBatchExport = () =>
			{
				showBatchExportModal.value = !showBatchExportModal.value
			}

			return {
				elevationPointList,
				handleHideLabel,
				handleHidePoint,
				handleBatchExport,
				handleExport,

				showBatchExportModal,
				showExportModal,
				exportPoint,
				confirmDel,
			}
		},
	})
</script>

<style lang="less" scoped>
	@import "@/styles/colors.less";
	@import "@/styles/common.less";
	@import "@/styles/layout.less";

	.elevation_inner {
		width: 100%;
		height: 100%;
		.flexContainer(column, flex-start);

		.elevation_main {
			width: 100%;
			height: 91.8%;
			overflow: auto;
			padding: 6px 8px;
			.scrollBar(8px);

			.elevation_item {
				width: 100%;
				height: 48px;
				margin: 4px 0;
				padding: 16px;
				transition: all @ease-base-out @animation-duration-fast;
				background-color: rgba(50, 75, 97, 0.5);
				.flexContainer(row);

				.item_title {
					flex: 1 1 auto;
					line-height: 100%;
					transition: all @ease-base-out @animation-duration-fast;
					.label(12px, rgba(255, 255, 255, 0.5));
				}

				.item_icons {
					flex: 1 1 auto;
					.flexContainer(row);
					justify-content: space-between;

					::v-deep(.meshIcon) {
						cursor: pointer;
						display: inline-block;
						width: 18px;
						height: 18px;
					}
				}

				&:hover {
					background-color: rgba(50, 75, 97, 1);

					.item_title {
						.label(12px, rgba(255, 255, 255, 1));
					}
				}
			}
		}

		.elevation_footer {
			width: 100%;
			height: 41px;
			padding: 6px 16px;
			border-top: 1px solid @BLUE0;
			.flexContainer(row, flex-end);
			.label(12px, @WHITE_COLOR);

			.batch_export {
				cursor: pointer;
				transition: all @ease-base-out @animation-duration-fast;

				&:hover {
					color: @PRIMARY_COlOR;
				}
			}
		}
	}
</style>