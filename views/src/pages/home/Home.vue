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
	import { defineComponent, defineAsyncComponent, computed, watch, onBeforeUnmount, toRaw, nextTick } from 'vue'
	import { useRoute } from 'vue-router'

	import { useStore } from '@/store'
	import TitleBar from '@/components/TitleBar/index.vue'
	import ToolBar from '@/components/ToolBar/index.vue'
	import ToolDrawer from '@/components/ToolBar/ToolDrawer.vue'
	import { Spin } from 'ant-design-vue'
	import { RootStateMutation } from '@/store'
	import { ModelFileMutation } from '@/store/file'
	import { CesiumEntityMutation } from '@/store/entity'
	import { ElevationPointMutation } from '@/store/elevation'
	import IPCRendererManager from '@/ipc/IPCRendererManager'

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

			const entityDataList = computed(() => store.state.cesiumEntity.entityList)
			const elevationDataList = computed(() => store.state.elevationPoint.list)

			// 将选中的模型文件信息初始化至 Cesium 相关 store 数据中
			if (model.value.measureData)
			{
				store.commit(CesiumEntityMutation.INIT_ENTITY, [...toRaw(model.value.measureData)])
			}
			if (model.value.elevationData)
			{
				store.commit(ElevationPointMutation.INIT_ELEVATION, [...toRaw(model.value.elevationData)])
			}

			// 监听测绘工具数据，更新至模型文件数据
			const unwatchEntity = watch(entityDataList, (newData) =>
			{
				const newModel = Object.assign({}, toRaw(model.value), { measureData: [...toRaw(newData)] })
				store.commit(ModelFileMutation.UPDATE_FILE, newModel)
				nextTick().then(() => IPCRendererManager.getInstance().invokeUpdateModelDesc(newModel))
			}, { deep: true })

			const unwatchElevation = watch(elevationDataList, (newData) =>
			{
				const newModel = Object.assign({}, toRaw(model.value), { elevationData: [...toRaw(newData)] })
				store.commit(ModelFileMutation.UPDATE_FILE, newModel)
				nextTick().then(() => IPCRendererManager.getInstance().invokeUpdateModelDesc(newModel))
			}, { deep: true })

			onBeforeUnmount(() =>
			{
				unwatchEntity()
				unwatchElevation()

				store.commit(RootStateMutation.INIT_STATE)
				store.commit(CesiumEntityMutation.INIT_ENTITY)
				store.commit(ElevationPointMutation.INIT_ELEVATION, [])
			})

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
