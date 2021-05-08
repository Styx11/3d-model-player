<template>
	<div class="body_tree">
		<Tree :tree-data="treeData" blockNode :selectable="false" defaultExpandAll>
			<template #title="titleData">
				<Icon
					v-if="!titleData.isLeaf"
					:name="`ic-${titleData.key}-${titleData.expanded? 'selected' :'regular'}`"
					:width="26"
					:height="26"
				/>
				<Badge v-else :color="titleData.color" />
				<span class="tree_title">{{titleData.title}}</span>
				<div class="tree_icons" v-if="titleData.isLeaf">
					<Icon
						name="ic-trash"
						:width="18"
						:height="18"
						@click="handleEntityDel(titleData.type, titleData.key)"
						:interactive="true"
					/>
					<EyeFilled
						:style="{cursor: 'pointer'}"
						@click.prevent="handleEntityCheck(titleData)"
						v-if="selectedEntity.key !== titleData.key"
					/>
					<EyeInvisibleOutlined
						v-else
						:style="{cursor: 'pointer'}"
						@click.prevent="handleEntityCheck(titleData, true)"
					/>
				</div>
			</template>
		</Tree>
	</div>
</template>

<script lang="ts">
	import { defineComponent, computed, createVNode } from 'vue'
	import { Tree, Badge, Modal } from 'ant-design-vue'
	import { RightOutlined, EyeFilled, EyeInvisibleOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'

	import { useStore } from '@/store'
	import EntityInfo from '../EntityInfo.vue'
	import ElevationTool from '../ElevationTool.vue'
	import ElevationInner from '../Inner/Elevation.vue'
	import { removeEntity, removeTempPoint, removeTempPolyline, updateSelectedEntity } from '@/hooks/cesium'
	import { CesiumEntityMutation } from '@/store/entity'
	import { EntityTreeChild, ToolType } from '@/interface/Types'

	export default defineComponent({
		name: 'MeasureInner',
		components: {
			RightOutlined,
			EyeInvisibleOutlined,
			EntityInfo,
			ElevationTool,
			EyeFilled,
			ElevationInner,
			Badge,
			Tree,
		},
		setup()
		{
			const store = useStore()
			const selectedEntity = computed(() => store.state.cesiumEntity.selectedEntity)
			const treeData = computed(() => store.state.cesiumEntity.entityList)

			const handleEntityDel = (type: ToolType, key: string) =>
			{
				Modal.confirm({
					title: '确认删除该测量实体？',
					icon: createVNode(ExclamationCircleOutlined),
					content: '该操作是无法撤销的',
					onOk()
					{
						store.commit(CesiumEntityMutation.REMOVE_ENTITY, { type, key })
						removeEntity(key)
						if (type === ToolType.LINE)
						{
							removeTempPoint()
						}
						else if (type === ToolType.AREA)
						{
							removeTempPolyline()
						}
					},
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					onCancel() { },
				});
			}
			const handleEntityCheck = (titleData: EntityTreeChild, uncheck?: boolean) =>
			{
				// 切换至另一个实体
				if (!uncheck)
				{
					// 取消选中旧实体
					if (selectedEntity.value.key)
					{
						updateSelectedEntity(selectedEntity.value.type, selectedEntity.value, false)
					}
					store.commit(CesiumEntityMutation.SEL_ENTITY, titleData)
					updateSelectedEntity(titleData.type, titleData, true)
				}
				// 取消选中
				else
				{
					store.commit(CesiumEntityMutation.UNSEL_ENTITY, selectedEntity.value.type)
					updateSelectedEntity(titleData.type, titleData, false)
				}
			}

			return {
				treeData,
				selectedEntity,

				handleEntityDel,
				handleEntityCheck,
			}
		},
	})
</script>

<style lang="less" scoped>
	@import "@/styles/colors.less";
	@import "@/styles/common.less";
	@import "@/styles/layout.less";

	.body_tree {
		width: 100%;
		height: 100%;
		padding: 6px 8px;
		flex: 1 1 auto;
		overflow: auto;
		.scrollBar(6px);

		.tree_title {
			margin-left: 8px;
			flex: 1 1 auto;
		}

		.tree_icons {
			display: inline-flex;
			height: 100%;
			width: 40px;
			.flexContainer(row, space-between);
		}

		::v-deep(.ant-tree) {
			color: @WHITE_COLOR;
			cursor: pointer;

			.ant-tree-switcher {
				display: inline-block;

				.ant-tree-switcher-icon {
					margin-top: 8px;
				}
			}

			.ant-tree-node-content-wrapper {
				height: 30px;
				color: @WHITE_COLOR;
				position: relative;
				.label(14px, @WHITE_COLOR);

				&:hover {
					background: rgba(34, 52, 71, 0.9);
				}

				svg:hover {
					path {
						fill: @PRIMARY_COlOR;
					}
				}

				.ant-tree-title {
					height: 100%;
					.flexContainer(row);

					.ant-badge {
						width: 16px;
						height: 16px;
						.flexContainer(column, center);

						.ant-badge-status-dot {
							width: 8px;
							height: 8px;
						}
					}
				}
			}
		}
	}
</style>
