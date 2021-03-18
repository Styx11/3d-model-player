<template>
	<div class="project_home_container">
		<TitleBar />
		<main class="container_main">
			<ToolBar />
			<ToolDrawer />
			<div>测试文本</div>
		</main>
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from 'vue'
	import TitleBar from '@/components/TitleBar'
	import ToolBar from '@/components/ToolBar'
	import ToolDrawer from '@/components/ToolBar/ToolDrawer'

	export default defineComponent({
		name: 'project-home',
		components: {
			TitleBar,
			ToolBar,
			ToolDrawer,
		},
		computed: {
		},
		methods: {
		},
		mounted()
		{
		},
	})
</script>

<style lang='less' scoped>
	@import "@/styles/common.less";
	@import "@/styles/layout.less";

	.project_home_container {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		background-color: #f5f5f5;
		.container_main {
			overflow: hidden;
			position: relative;
			.flexContainer(row);
			flex: 1 0 auto;
		}
	}
</style>
