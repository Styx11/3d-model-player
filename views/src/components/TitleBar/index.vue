<template>
	<DragableContainer>
		<div class="title_bar">
			<aside class="title_bar_aside">
				<DragableItem>
					<slot name='titlebarAside'>
						<span>Dashboard</span>
					</slot>
				</DragableItem>
			</aside>
			<Divider type="vertical" style="{{ margin: 0 }}" />
			<main class="title_bar_main">
				<aside class="main_left">
					<slot name='projectName'>项目名称</slot>
				</aside>
				<section class="main_right">
					<slot name='operationSection'>
						<span>其他1</span>
						<span>其他2</span>
						<span>其他3</span>
					</slot>
				</section>
			</main>
		</div>
	</DragableContainer>
</template>

<script lang='ts'>
	import { defineComponent } from 'vue'
	import { Divider } from 'ant-design-vue'

	import DragableContainer from '../Drag/DragableContainer.vue'
	import DragableItem from '../Drag/DragableItem.vue'

	// 简单的 Titlebar 组件，之后可能会有修改
	// 比如全屏后 titlebarAside 位置的变化、右方操作按钮区域的变化
	export default defineComponent({
		name: 'TitleBar',
		components: {
			Divider,
			DragableItem,
			DragableContainer,
		},
	})
</script>

<style lang='less' scoped>
	@import "@/styles/layout.less";
	@import "@/styles/colors.less";
	@import "@/styles/common.less";

	.title_bar {
		.flexContainer(row);
		.noselect();
		width: 100%;
		height: @TRAFFIC_LIGHT_HEIGHT;
		box-shadow: inset 0 -0.5px 0 0 #000000;
		background: @BLUE2;
		padding: 10px 24px;
		.title_bar_aside {
			display: inline-block;
			flex: 0 0 auto;
			height: 100%;
			width: @ASIDE_CONTENT_WIDTH - 24px;
			padding-left: @TRAFFIC_LIGHT_WIDTH;
			color: @WHITE_COLOR;
		}
		.title_bar_main {
			.flexContainer(row);
			padding-left: 24px;
			flex: 1 1 auto;
			height: 100%;
			.main_left {
				height: 100%;
				color: @WHITE_COLOR;
			}
			.main_right {
				height: 100%;
				flex: 1 1 auto;
				color: @WHITE_COLOR;
				.flexContainer(row, flex-end);
				& > * {
					height: 100%;
					margin-left: 24px;
				}
			}
		}
		.ant-divider-vertical {
			margin: 2px 0 0 0;
			height: 100%;
			background: @BLUE0;
		}
	}
</style>