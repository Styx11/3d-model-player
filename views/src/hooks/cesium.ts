import { Ref } from 'vue'
import * as Cesium from 'cesium'

import { throttle } from '../hooks/util'

// 位置指示器数据
export interface PositionMaker
{
	x: number;
	y: number;
	z: number;
	cartesian: Cesium.Cartesian3;
}

export const HEIGHT_OFFSET = 20;

export const initViewer = (viewerRef: Ref<any>): Cesium.Viewer =>
{
	// initialize viewer
	return new Cesium.Viewer(viewerRef.value, {
		animation: false,
		timeline: false,
		homeButton: false,
		geocoder: false,
		navigationHelpButton: false,
		fullscreenButton: false,
	});
}

export const initTileset = (viewer: Cesium.Viewer, source?: string): Cesium.Cesium3DTileset =>
{
	// load tiles constructed by CC
	const tileset = new Cesium.Cesium3DTileset({
		url: source || '../../../data/sample1/Scene/Production_3.json',
		maximumScreenSpaceError: 1,     // Basically we dont allow any error even when zoom out...
	})
	return tileset
}

export const initHandler = (viewer: Cesium.Viewer): Cesium.ScreenSpaceEventHandler =>
{
	return new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
}

export const zoomToTileset = (viewer: Cesium.Viewer, tileset: Cesium.Cesium3DTileset) =>
{
	return Cesium.defined(tileset) && viewer.zoomTo(tileset)
}

// 获取模型坐标（目前默认为 WGS84 坐标）
export const usePosition = (viewer: Cesium.Viewer, position: PositionMaker): (e) => void =>
{
	return throttle((e) =>
	{
		// Mouse over the 3d tileset to see the cartographic position 
		const pickingEntity = viewer.scene.pick(e.endPosition);

		if (pickingEntity && pickingEntity.primitive instanceof Cesium.Cesium3DTileset)
		{
			const ellipsoid = (pickingEntity.primitive as Cesium.Cesium3DTileset).ellipsoid;

			// 注意，这里要获取 cartesian3 的坐标
			const cartesian = viewer.scene.pickPosition(e.endPosition);

			const cartographic = ellipsoid.cartesianToCartographic(cartesian);
			const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10);// 纬度 N/S x
			const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10);// 经度 W/E y
			const height = cartographic.height + HEIGHT_OFFSET;
			console.log('longitude =>', longitudeString, 'latitude =>', latitudeString, 'height =>', height)

			const point = viewer.entities.add({
				name: 'p',
				position: cartesian,
				point: {
					pixelSize: 5,
					color: Cesium.Color.RED,
					outlineColor: Cesium.Color.WHITE,
					outlineWidth: 2
				}
			});
			Object.assign(position, {
				x: Number(latitudeString),
				y: Number(longitudeString),
				z: height,
				cartesian,
			})
		}
	}, 16)
}