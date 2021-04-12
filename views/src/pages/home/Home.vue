<template>
	<div class="project_home_container">
		<TitleBar />
		<main class="container_main">
			<ToolBar />
			<ToolDrawer />
			<Model />
		</main>
	</div>
</template>

<script lang='ts'>
	import { defineComponent, defineAsyncComponent } from 'vue'
	import TitleBar from '@/components/TitleBar'
	import ToolBar from '@/components/ToolBar'
	import ToolDrawer from '@/components/ToolBar/ToolDrawer'
	import { Spin } from 'ant-design-vue'

	export default defineComponent({
		name: 'project-home',
		components: {
			TitleBar,
			ToolBar,
			ToolDrawer,
			Model: defineAsyncComponent({
				loader: () => import('./components/Model.vue'),
				loadingComponent: Spin,
				delay: 100,
			})
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
		::v-deep(.ant-spin) {
			width: 100%;
			height: 100%;
			position: absolute;
			.flexContainer(column, center);
			background: rgba(233, 246, 254, 0.5);
		}
	}
</style>
