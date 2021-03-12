<template>
	<div class="toolBar">
		<div class="tool_item">新</div>
		<div class="tool_item">新</div>
		<div class="tool_item">新</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: 'Toolbar',
	})
</script>

<style lang="less" scoped>
	@import "@/styles/colors.less";
	@import "@/styles/layout.less";
	@import "@/styles/common.less";

	.toolBar {
		.noselect();
		z-index: 1000;
		width: @TRAFFIC_LIGHT_HEIGHT;
		height: 100%;
		background: @BLUE2;
		padding: 12px 6px;
		border-right: 1px solid @BLUE0;
		border-top: 1px solid @BLUE0;
		.flexContainer(column, flex-start);
		.tool_item {
			display: inline-block;
			width: 28px;
			height: 28px;
			margin: 8px 0;
			color: @WHITE_COLOR;
			.flexContainer(row, center);
		}
	}
</style>