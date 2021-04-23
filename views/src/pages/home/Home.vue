<template>
	<div class="project_home_container">
		<TitleBar :project-name="model.title" />
		<main class="container_main">
			<ToolBar />
			<ToolDrawer />
			<Model :model="model" />
		</main>
	</div>
</template>

<script lang='ts'>
	import { defineComponent, defineAsyncComponent, computed } from 'vue'
	import { useRoute } from 'vue-router'

	import { useStore } from '@/store'
	import TitleBar from '@/components/TitleBar/index.vue'
	import ToolBar from '@/components/ToolBar/index.vue'
	import ToolDrawer from '@/components/ToolBar/ToolDrawer.vue'
	import { Spin } from 'ant-design-vue'

	export default defineComponent({
		name: 'Home',
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
		setup()
		{
			const route = useRoute()
			const store = useStore()

			const uid = computed(() => route.query.uid)
			const model = computed(() => store.state.modelFile.fileList.filter(f => f.uid === uid.value)[0])
			console.log('model =>', model)

			return {
				model,
			}
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
