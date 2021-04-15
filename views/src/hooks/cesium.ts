import { Ref, computed, ComputedRef, toRaw } from 'vue'
import * as Cesium from 'cesium'

import { throttle } from '../hooks/util'
import { Store } from 'vuex';
import { AllState } from '../store';
import { ToolType, EntityTreeChild, EntityColor, ToolTitle } from '../interface/Types';
import { CesiumEntityMutation } from '../store/entity';

let _viewer: Cesium.Viewer;

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
	_viewer = new Cesium.Viewer(viewerRef.value, {
		animation: false,
		timeline: false,
		homeButton: false,
		geocoder: false,
		navigationHelpButton: false,
		fullscreenButton: false,
	});
	return _viewer;
}

export const initTileset = (source?: string): Cesium.Cesium3DTileset =>
{
	// load tiles constructed by CC
	const tileset = new Cesium.Cesium3DTileset({
		url: source || '../../../data/sample1/Scene/Production_3.json',
		maximumScreenSpaceError: 1,     // Basically we dont allow any error even when zoom out...
	})
	return tileset
}

export const initHandler = (): Cesium.ScreenSpaceEventHandler =>
{
	return new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas)
}

export const zoomToTileset = (tileset: Cesium.Cesium3DTileset) =>
{
	return Cesium.defined(tileset) && _viewer.zoomTo(tileset)
}

// 获取模型坐标（目前默认为 WGS84 坐标）
export const usePosition = (position: PositionMaker): (e) => void =>
{
	return throttle((e) =>
	{
		// Mouse over the 3d tileset to see the cartographic position 
		const pickingEntity = _viewer.scene.pick(e.endPosition);

		if (pickingEntity && pickingEntity.primitive instanceof Cesium.Cesium3DTileset)
		{
			const ellipsoid = (pickingEntity.primitive as Cesium.Cesium3DTileset).ellipsoid;

			// 注意，这里要获取 cartesian3 的坐标
			const cartesian = _viewer.scene.pickPosition(e.endPosition);

			const cartographic = ellipsoid.cartesianToCartographic(cartesian);
			const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10);// 纬度 N/S x
			const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10);// 经度 W/E y
			const height = cartographic.height + HEIGHT_OFFSET;

			Object.assign(position, {
				x: Number(latitudeString),
				y: Number(longitudeString),
				z: height,
				cartesian,
			})
		}
	}, 16)
}

// 处理 handler click 进行创建 entity
export const useClick = (position: PositionMaker, store: Store<AllState>): (e) => void =>
{
	return (e) =>
	{
		const selectedTool = store.state.cesiumEntity.selectedTool
		const picked = _viewer.scene.pick(e.position)
		// 为选中其他实体时，在 tileset 上创建实体
		if (Cesium.defined(picked) && !(picked.id instanceof Cesium.Entity) && selectedTool)
		{
			console.log('entity =>', picked)
			const key = String(Date.now())
			switch (selectedTool)
			{
				case ToolType.NOTATION:
					createPoint(position, key, EntityColor.RED)
					store.commit(CesiumEntityMutation.SEL_TOOL, '')
					store.commit(CesiumEntityMutation.ADD_ENTITY, {
						type: ToolType.NOTATION,
						child: {
							key,
							title: ToolTitle.NOTATION,
							isLeaf: true,
							position: Object.assign({}, toRaw(position)),
							color: EntityColor.RED,
							desc: '',
							type: ToolType.NOTATION,
							slots: { title: 'title' },
						} as EntityTreeChild
					})
					return;
				case ToolType.LINE:
					console.log('we got line')
					store.commit(CesiumEntityMutation.SEL_TOOL, '')
					return;
				case ToolType.AREA:
					console.log('we got area')
					store.commit(CesiumEntityMutation.SEL_TOOL, '')
					return;
				default:
					break;
			}
		}
	}
}

// 根据 id 移除实体
export const removeEntity = (id: string): boolean =>
{
	return _viewer.entities.removeById(id)
}

// 创建标注实体
const createPoint = (position: PositionMaker, key: string, color: EntityColor, active?: boolean): Cesium.Entity =>
{
	const billboard = _viewer.entities.add({
		id: key,
		position: position.cartesian,
		billboard: {
			image: `/static/svg/pic-mark-${color}${active ? '-active' : ''}.svg`,
			width: 19,
			height: 37,
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
		}
	})
	return billboard
}

export const updatePoint = (key: string, color: EntityColor, active?: boolean) =>
{
	const entity = _viewer.entities.getById(key)
	if (Cesium.defined(entity))
	{
		entity.billboard.image = new Cesium.ConstantProperty(`/static/svg/pic-mark-${color}${active ? '-active' : ''}.svg`);
		if (active)
		{
			_viewer.flyTo(entity, { duration: 1 })
		}
	}
}