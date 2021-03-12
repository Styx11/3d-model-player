<template>
	<div class="tool_drawer" :class="{ expanded: drawerVisible }">
		<section class="drawer_wrapper" :class="{ expanded: drawerVisible }">
			<header class="drawer_header">
				<p class="header_title">浏览测量模式</p>
				<section class="header_watcher">
					<EyeFilled :style="{cursor: 'pointer'}" />
				</section>
			</header>
			<section class="drawer_body">
				<div class="body_empty_message">
					暂无数据
					<br />点击模型开始测量
				</div>
			</section>
		</section>
		<div class="drawer_handler" :class="{ expanded: drawerVisible }" @click="toggleDrawerVisible">
			<RightOutlined />
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref } from 'vue'
	import { Drawer } from 'ant-design-vue'
	import { RightOutlined, EyeFilled } from '@ant-design/icons-vue'

	export default defineComponent({
		name: 'ToolDrawer',
		components: {
			RightOutlined,
			EyeFilled,
			Drawer,
		},
		props: {

		},
		setup(props)
		{
			const drawerVisible = ref<boolean>(false)
			const toggleDrawerVisible = () => drawerVisible.value = !drawerVisible.value

			return {
				drawerVisible,
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
				.body_empty_message {
					position: relative;
					.label(14px, rgba(255, 255, 255, 0.6));
					text-align: center;
					top: 106px;
					padding: 0 15px;
				}
			}
		}
	}
</style>