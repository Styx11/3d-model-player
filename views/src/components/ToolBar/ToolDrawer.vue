<template>
	<div class="tool_drawer" :class="{ expanded: drawerVisible }">
		<section class="drawer_wrapper" :class="{ expanded: drawerVisible }">
			<header class="drawer_header">
				<template v-if="drawerType === 'measure'">
					<p class="header_title">浏览测量模式</p>
					<section class="header_watcher">
						<EyeFilled :style="{cursor: 'pointer'}" />
					</section>
				</template>
				<template v-else-if="drawerType === 'elevation'">
					<p class="header_title">高程点提取模式</p>
				</template>
			</header>
			<section class="drawer_body">
				<div v-if="!treeDataEmpty && drawerType === 'measure'">
					<MeasureInner />
				</div>
				<div v-else-if="drawerType === 'elevation' && !elevationDataEmpty">
					<ElevationInner />
				</div>
				<div class="body_empty_message" v-else>
					暂无数据
					<br />点击模型开始测量
				</div>
			</section>
		</section>
		<div class="drawer_handler" :class="{ expanded: drawerVisible }" @click="toggleDrawerVisible">
			<RightOutlined />
		</div>
		<div class="drawer_info" v-if="selectedEntity.key">
			<EntityInfo />
		</div>
		<div class="drawer_info" v-else-if="selectedTool === 'elevation'">
			<ElevationTool />
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, computed, watch } from 'vue'
	import { RightOutlined, EyeFilled } from '@ant-design/icons-vue'

	import { useStore } from '../../store'
	import EntityInfo from './EntityInfo.vue'
	import ElevationTool from './ElevationTool.vue'
	import ElevationInner from './Inner/Elevation.vue'
	import MeasureInner from './Inner/Measure.vue'
	import { updateSelectedEntity } from '../../hooks/cesium'
	import { CesiumEntityMutation } from '../../store/entity'
	import { ToolType } from '../../interface/Types'

	export default defineComponent({
		name: 'ToolDrawer',
		components: {
			RightOutlined,
			EyeFilled,
			EntityInfo,
			ElevationTool,
			ElevationInner,
			MeasureInner,
		},
		props: {
		},
		setup()
		{
			const store = useStore()
			const selectedTool = computed(() => store.state.selectedTool)
			const selectedEntity = computed(() => store.state.cesiumEntity.selectedEntity)
			const treeData = computed(() => store.state.cesiumEntity.entityList)
			const treeDataEmpty = computed(() => treeData.value.every(d => !d.children.length))
			const elevationDataEmpty = computed(() => !store.state.elevationPointList.list.length)

			const drawerType = ref<'measure' | 'elevation'>('measure')
			const drawerVisible = ref<boolean>(false)
			const toggleDrawerVisible = () => drawerVisible.value = !drawerVisible.value

			watch(selectedTool, (tool, prevTool) =>
			{
				// 取消选中旧实体
				if (selectedEntity.value.key)
				{
					updateSelectedEntity(selectedEntity.value.type, selectedEntity.value, false)
				}
				store.commit(CesiumEntityMutation.UNSEL_ENTITY, selectedEntity.value.type)

				// drawer 展示内容
				if (tool)
				{
					if (tool === ToolType.NOTATION || tool === ToolType.LINE || tool === ToolType.AREA)
					{
						drawerType.value = 'measure'
					}
					else if (tool === ToolType.ELEVATION)
					{
						drawerType.value = 'elevation'
					}
				}
			})

			return {
				treeDataEmpty,
				drawerType,
				drawerVisible,
				selectedTool,
				selectedEntity,
				elevationDataEmpty,
				toggleDrawerVisible,
			}
		}
	})
</script>

<style lang="less" scoped>
	@import "@/styles/colors.less";
	@import "@/styles/common.less";
	@import "@/styles/layout.less";

	@drawer-content-width: 260px;
	@drawer-handler-width: 20px;
	@tool-bar-width: 40px;

	.tool_drawer {
		.noselect();
		z-index: 99;
		.flexContainer(row, center);
		position: fixed;
		top: @TRAFFIC_LIGHT_HEIGHT;
		left: @tool-bar-width - @drawer-content-width;
		height: 100%;
		width: @drawer-handler-width + @drawer-content-width;
		transition: all @ease-base-out @animation-duration-slow;
		&.expanded {
			left: @tool-bar-width;
		}
		.drawer_info {
			transition: all @ease-base-out @animation-duration-slow;
			position: absolute;
			top: @drawer-handler-width;
			left: @drawer-handler-width + @drawer-content-width;
		}
		.drawer_handler {
			.flexContainer(row);
			width: 0px;
			height: 77px;
			border-left: @drawer-handler-width solid @BLUE3;
			border-top: 15px solid transparent;
			border-bottom: 15px solid transparent;
			&:hover {
				cursor: pointer;
				border-left: @drawer-handler-width solid @PRIMARY_COlOR;
			}
			& > span {
				cursor: pointer;
				color: @WHITE_COLOR;
				position: relative;
				left: -18px;
				transition: all @ease-base-out @animation-duration-slow;
			}
			&.expanded {
				& > span {
					transform: rotate(180deg);
				}
			}
		}
		.drawer_wrapper {
			height: 100%;
			flex: 0 0 @drawer-content-width;
			background: @BLUE3;
			.flexContainer(column);
			border-top: 1px solid @BLUE0;
			&.expanded {
				box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
			}
			.drawer_header {
				background: @BLUE1;
				padding: 6px 16px;
				height: 30px;
				width: @drawer-content-width;
				.flexContainer(row);
				.header_title {
					.label(12px, @WHITE_COLOR);
					margin: 0;
					height: 100%;
				}
				.header_watcher {
					flex: 1 0 auto;
					.label(12px, @WHITE_COLOR);
					.flexContainer(row, flex-end);
				}
			}
			.drawer_body {
				width: 100%;
				height: 100%;
				flex: 1 1 auto;
				padding: 6px 8px;
				overflow: auto;
				.scrollBar(8px);
				.body_empty_message {
					position: relative;
					.label(14px, rgba(255, 255, 255, 0.6));
					text-align: center;
					top: 106px;
					padding: 0 15px;
				}
				.body_tree {
					width: 100%;
					height: 100%;

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
			}
		}
	}
</style>