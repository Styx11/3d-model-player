<template>
	<div class="model_container">
		<main class="model_main" id="model_main" ref="viewerRef"></main>
		<section
			class="model_position"
		>WGS84 E: {{position.y.toFixed(5)}} N: {{position.x.toFixed(5)}} 高度: {{position.z.toFixed(3)}} m</section>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, onBeforeUnmount, ref, reactive, watch } from 'vue'
	import * as Cesium from 'cesium'

	import { initViewer, initTileset, initHandler, zoomToTileset, usePosition, HEIGHT_OFFSET, PositionMaker } from '../../../hooks/cesium'

	Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZjc1MGI5NC0wYTcyLTQ3YWYtYTNiMi03YmU5MjQ0ZTE1MDkiLCJpZCI6NDk1NjIsImlhdCI6MTYxNzQxNjIzMH0.OKpUIs85S_LatHupyCtso-ZtcpMjdrYVmSf61N93Ihg'

	export default defineComponent({
		name: 'Model',
		components: {
		},
		setup()
		{
			const viewerRef = ref(null)
			let tileset: Cesium.Cesium3DTileset = null
			let viewer: Cesium.Viewer = null
			let handler: Cesium.ScreenSpaceEventHandler = null

			const position = reactive<PositionMaker>({
				x: 0,
				y: 0,
				z: 0,
				cartesian: null,
			})

			onMounted(() =>
			{

				viewer = initViewer(viewerRef)
				tileset = initTileset(viewer)
				handler = initHandler(viewer)

				tileset.readyPromise.then(tileset =>
				{
					viewer.scene.primitives.add(tileset);

					// 调整高度误差
					const boundingSphere = tileset.boundingSphere;
					// Adjust a tileset's height from the globe's surface.
					const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
					const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
					const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, HEIGHT_OFFSET);
					const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());

					tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

					viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, 0));

					// 绑定事件
					handler.setInputAction(usePosition(viewer, position), Cesium.ScreenSpaceEventType.MOUSE_MOVE)

					zoomToTileset(viewer, tileset)
				})
			})

			onBeforeUnmount(() =>
			{
				viewer.destroy()
			})

			return {
				viewerRef,
				position,
			}
		},
	})
</script>

<style lang="less" scoped>
	@import "@/styles/colors.less";
	@import "@/styles/layout.less";
	@import "@/styles/common.less";

	.model_container {
		width: 100%;
		height: 100%;
		z-index: 1;
		background: black;
		position: relative;
		overflow: hidden;
		.flexContainer(row, center);

		::v-deep(.ant-spin) {
			width: 100%;
			height: 100%;
			position: absolute;
			.flexContainer(column, center);
			background: rgba(233, 246, 254, 0.5);
		}

		.model_position {
			position: fixed;
			bottom: 0;
			right: 0;
			width: auto;
			height: 28px;
			margin: 19.9px 0 0;
			padding: 6px 24px;
			border-radius: 2px;
			background-color: rgba(0, 0, 0, 0.6);
			.flexContainer(row, center);
			.label(12px, @WHITE_COLOR);
		}

		.model_main {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			cursor: grab;

			&:active {
				cursor: grabbing;
			}

			canvas {
				max-width: 100%;
				max-height: 100%;
			}

			::v-deep(.cesium-viewer-bottom) {
				display: none !important;
				position: absolute;
			}
		}
	}
</style>