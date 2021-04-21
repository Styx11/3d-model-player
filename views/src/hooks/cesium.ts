import { Ref, computed, toRaw, watch } from 'vue'
import * as Cesium from 'cesium'
import { uid } from 'uid'

import { throttle, calcDistanceCartesian3 } from '../hooks/util'
import { Store } from 'vuex';
import { AllState } from '../store';
import { ToolType, EntityTreeChild, EntityColor, ToolTitle } from '../interface/Types';
import { CesiumEntityMutation } from '../store/entity';

let _viewer: Cesium.Viewer;

let _vision: 'ortho' | '3d' = '3d';

// 保存还在创建中的 polygon 面积的点信息
const _tempPolygon: { id: string; positions: PositionMaker[] } = {
	id: '',
	positions: []
}

// 保存还在创建状态中的 polyline 点信息
const _tempPolyline: { id: string; positions: PositionMaker[] } = {
	id: '',
	positions: []
}

// 保存临时点，用于测量工具和面积工具的创建，创建中和查看时会将临时点保存在这里，并借助这些点信息销毁他们
const _tempPoint: Array<{ id: string; position: PositionMaker }> = []

// 位置指示器数据
export interface PositionMaker
{
	x: number;
	y: number;
	z: number;
	cartesian: Cesium.Cartesian3;
}

// 鼠标位置，放置绘制提示
export interface ScreenPosition
{
	x: number;
	y: number;
	tip: string;
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

	// 调整默认分辨率
	if ((Cesium.FeatureDetection as any).supportsImageRenderingPixelated())
	{
		//判断是否支持图像渲染像素化处理
		_viewer.resolutionScale = window.devicePixelRatio;
	}
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

export const flyTo = (tileset: Cesium.Cesium3DTileset | Cesium.Entity): Promise<boolean> =>
{
	if (_vision !== '3d') _vision = '3d'
	return Cesium.defined(tileset) && _viewer.flyTo(tileset, { duration: 1 })
}

export const flyToInOrtho = (tileset: Cesium.Cesium3DTileset | Cesium.Entity): Promise<boolean> =>
{
	if (_vision !== 'ortho') _vision = 'ortho'
	return Cesium.defined(tileset) && _viewer.flyTo(tileset, {
		duration: 1, offset: new Cesium.HeadingPitchRange(
			Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
			Cesium.Math.toRadians(-90),    // default value (looking down)
		)
	})
}

// 获取模型坐标（目前默认为 WGS84 坐标）
export const usePosition = (position: PositionMaker, screenPosition: ScreenPosition): (e) => void =>
{
	return throttle((e) =>
	{
		// Mouse over the 3d tileset to see the cartographic position 
		const pickingEntity = _viewer.scene.pick(e.endPosition);
		Object.assign(screenPosition, {
			x: e.endPosition.x,
			y: e.endPosition.y,
			tip: _tempPoint.length > 1
				? _tempPolygon.id ? '鼠标右键单击起点可结束绘制' : '鼠标右键单击终点可结束绘制'
				: _tempPoint.length === 1 ? '点击继续测绘' : '单击鼠标左键开始测绘'
		})

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
	const selectedTool = computed(() => store.state.cesiumEntity.selectedTool)
	// 未创建完毕就切换工具类型，则不会保存这次的内容
	watch(selectedTool, (newVal, oldVal) =>
	{
		if (newVal !== oldVal)
		{
			switch (oldVal)
			{
				case ToolType.LINE:
					endPolyline(store, true)
					break;
				case ToolType.AREA:
					endPolygon(store, true)
					break;
				default:
					break
			}
		}
	})

	return (e) =>
	{
		const _position = Object.assign({}, toRaw(position))

		const picked = _viewer.scene.pick(e.position)
		// 未选中其他实体时，在 tileset 上创建实体
		if (Cesium.defined(picked) && !(picked.id instanceof Cesium.Entity) && selectedTool.value)
		{
			const key = uid();
			switch (selectedTool.value)
			{
				case ToolType.NOTATION:
					createPoint(_position, key, EntityColor.RED);
					store.commit(CesiumEntityMutation.SEL_TOOL, '');
					store.commit(CesiumEntityMutation.ADD_ENTITY, {
						type: ToolType.NOTATION,
						child: {
							key,
							title: ToolTitle.NOTATION,
							isLeaf: true,
							position: [_position],
							color: EntityColor.RED,
							desc: '',
							type: ToolType.NOTATION,
							slots: { title: 'title' },
						} as EntityTreeChild
					});
					return;
				case ToolType.LINE:
					createPolyline(_position, key, EntityColor.RED);
					return;
				case ToolType.AREA:
					createPolygon(_position, key, EntityColor.RED);
					return;
				default:
					break;
			}
		}

	}
}

// 右击结束绘制
export const useRightClick = (position: PositionMaker, store: Store<AllState>): (e) => void =>
{
	return (e) =>
	{
		const _position = Object.assign({}, toRaw(position))
		const selectedTool = store.state.cesiumEntity.selectedTool
		const picked = _viewer.scene.pick(e.position)
		if (Cesium.defined(picked) && picked.id instanceof Cesium.Entity && selectedTool)
		{
			const key = (picked.id as Cesium.Entity).id
			if (picked.primitive instanceof Cesium.PointPrimitive)
			{
				switch (selectedTool)
				{
					case ToolType.NOTATION:
						return;
					case ToolType.LINE:
						// 右键终点
						if (_tempPoint.length > 1 && key === _tempPoint[_tempPoint.length - 1].id)
						{
							endPolyline(store)
						}
						return;
					case ToolType.AREA:
						// 右键起点
						if (_tempPoint.length > 1 && key === _tempPoint[0].id)
						{
							endPolygon(store)
						}
						return;
					default:
						break;
				}
			}
			// console.log('selected point =>', picked)
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
		position: _vision === 'ortho' ? Object.assign({}, position.cartesian, { z: position.cartesian.z + 0.8 }) : position.cartesian,
		billboard: {
			image: `/static/svg/pic-mark-${color}${active ? '-active' : ''}.svg`,
			width: 19,
			height: 37,
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
		}
	})
	return billboard
}

export const updatePoint = (key: string, color: EntityColor, active?: boolean, nozoom?: boolean) =>
{
	const entity = _viewer.entities.getById(key)
	if (Cesium.defined(entity))
	{
		entity.billboard.image = new Cesium.ConstantProperty(`/static/svg/pic-mark-${color}${active ? '-active' : ''}.svg`);
		if (active)
		{
			!nozoom && (_vision === '3d' ? flyTo(entity) : flyToInOrtho(entity))
		}
	}
}

// 创建距离实体
// 思路是保存临时坐标并创建临时点，polyline 的每段线的起始点对应这些临时点
const createPolyline = (position: PositionMaker, key: string, color: EntityColor) =>
{
	if (!_tempPolyline.id) _tempPolyline.id = key

	// 创建临时点，保存线段位置
	createTempPoint(Object.assign({}, position), color)
	_tempPolyline.positions.push(Object.assign({}, position))

	const polylinePositions = _tempPolyline.positions.map(p => p.cartesian)

	// 第一次绘制创建线段，多次点击则更新线段断点
	const entity = _viewer.entities.getById(_tempPolyline.id)
	if (Cesium.defined(entity))
	{
		entity.polyline.positions = new Cesium.ConstantProperty(polylinePositions)
	}
	else
	{
		const p = _viewer.entities.add({
			id: _tempPolyline.id,
			polyline: {
				positions: polylinePositions,
				width: 2,
				material: new Cesium.PolylineDashMaterialProperty({
					color: Cesium.Color[color.toUpperCase()]
				})
			}
		})
		console.log('polyline =>', p)
	}
}

// 结束线段，销毁临时点，修改 store
const endPolyline = (store: Store<AllState>, dirty?: boolean) =>
{
	// 未创建完毕就切换工具类型，则不会保存这次的内容
	if (dirty)
	{
		removeEntity(_tempPolyline.id)
	}
	else
	{
		store.commit(CesiumEntityMutation.SEL_TOOL, '')
		store.commit(CesiumEntityMutation.ADD_ENTITY, {
			type: ToolType.LINE,
			child: {
				key: _tempPolyline.id,
				title: ToolTitle.LINE,
				isLeaf: true,
				position: [..._tempPolyline.positions],
				color: EntityColor.RED,
				desc: '',
				type: ToolType.LINE,
				slots: { title: 'title' },
			} as EntityTreeChild
		});
		//... 提交 commit
	}

	_tempPolyline.id = ''
	_tempPolyline.positions = []

	removeTempPoint()

	console.log('_tempPolyline =>', _tempPolyline)
}

// 更新线条颜色、聚焦线条、创建/销毁聚焦时的临时点
export const updatePolyline = (key: string, color: EntityColor, positions?: PositionMaker[], active?: boolean, nozoom?: boolean) =>
{
	const entity = _viewer.entities.getById(key)
	if (Cesium.defined(entity))
	{
		entity.polyline.material = new Cesium.PolylineDashMaterialProperty({
			color: Cesium.Color[color.toUpperCase()]
		})
		if (active && Array.isArray(positions))
		{
			// 更新已有临时点
			if (_tempPoint.length)
			{
				updateTempPoint(color)
			}
			else
			{
				positions.forEach(p =>
				{
					createTempPoint(p, color, true)
				})
			}
			!nozoom && (_vision === '3d' ? flyTo(entity) : flyToInOrtho(entity))
		}
		else
		{
			removeTempPoint()
			console.log('_tempPoint removed =>', _tempPoint)
		}
	}
}

// 创建面积实体
// 思路是在创建面积的同时，创建临时线段和临时点，临时点仅在创建时出现，临时线仅在创建和查看时出现并且颜色总为白色
const createPolygon = (position: PositionMaker, key: string, color: EntityColor) =>
{
	if (!_tempPolygon.id) _tempPolygon.id = key

	createTempPoint(position, color)
	_tempPolygon.positions.push(position)
	createTempPolyline(_tempPolygon.positions, _tempPolygon.positions.length > 2)

	const polygonPositions = _tempPolygon.positions.map(p => p.cartesian)
	const entity = _viewer.entities.getById(_tempPolygon.id)

	if (Cesium.defined(entity))
	{
		(entity.polygon.hierarchy as any) = new Cesium.PolygonHierarchy(polygonPositions)
	}
	else
	{
		// 创建中无 outline
		const p = _viewer.entities.add({
			id: _tempPolygon.id,
			polygon: {
				height: 39.8,
				hierarchy: new Cesium.PolygonHierarchy(polygonPositions),
				material: Cesium.Color[color.toUpperCase()].withAlpha(0.3),
			}
		})
		console.log('polygon =>', p)
	}
}

// 结束绘制面积
const endPolygon = (store: Store<AllState>, dirty?: boolean) =>
{
	if (dirty)
	{
		removeEntity(_tempPolygon.id)
	}
	else
	{
		_tempPolygon.positions.push(Object.assign({}, _tempPolygon.positions[0]))
		// 提交commit
		store.commit(CesiumEntityMutation.SEL_TOOL, '')
		store.commit(CesiumEntityMutation.ADD_ENTITY, {
			type: ToolType.AREA,
			child: {
				key: _tempPolygon.id,
				title: ToolTitle.AREA,
				isLeaf: true,
				position: [..._tempPolygon.positions],
				color: EntityColor.RED,
				desc: '',
				type: ToolType.AREA,
				slots: { title: 'title' },
			} as EntityTreeChild
		});
		const entity = _viewer.entities.getById(_tempPolygon.id)
		if (Cesium.defined(entity))
		{
			entity.polygon.outline = new Cesium.ConstantProperty(true)
			entity.polygon.outlineColor = new Cesium.ConstantProperty(Cesium.Color.RED)
		}
	}

	_tempPolygon.id = ''
	_tempPolygon.positions = []

	removeTempPolyline()
	removeTempPoint()

	console.log('_tempPolygon =>', _tempPolygon)
}

export const updatePolygon = (key: string, color: EntityColor, positions?: PositionMaker[], active?: boolean, nozoom?: boolean) =>
{
	const entity = _viewer.entities.getById(key)
	if (!Cesium.defined(entity)) return

	entity.polygon.outlineColor = Cesium.Color[color.toUpperCase()]
	entity.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color[color.toUpperCase()].withAlpha(0.3))

	if (active && Array.isArray(positions))
	{
		createTempPolyline(positions, true)
		!nozoom && (_vision === '3d' ? flyTo(entity) : flyToInOrtho(entity))
	}
	else
	{
		removeTempPolyline()
	}
}

// 创建临时线段，总为白色
export const createTempPolyline = (positions: PositionMaker[], show?: boolean) =>
{
	if (!_tempPolyline.id) _tempPolyline.id = uid(13)

	_tempPolyline.positions = [...positions]

	if (!show) return

	const polylinePositions = _tempPolyline.positions.map(p => p.cartesian)
	const entity = _viewer.entities.getById(_tempPolyline.id)

	if (Cesium.defined(entity))
	{
		entity.polyline.positions = new Cesium.ConstantProperty(polylinePositions)
	}
	else
	{
		const p = _viewer.entities.add({
			id: _tempPolyline.id,
			polyline: {
				positions: polylinePositions,
				width: 1,
				material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE)
			}
		})
		console.log('temporary polyline =>', p)
	}
}

export const removeTempPolyline = () =>
{
	removeEntity(_tempPolyline.id)
	_tempPolyline.id = ''
	_tempPolyline.positions.splice(0, _tempPolyline.positions.length)
}

// dirty 表示改组实体已经算入了高度误差
export const createTempPoint = (position: PositionMaker, color: EntityColor, dirty?: boolean) =>
{
	const key = uid(12)

	_tempPoint.push({
		id: key,
		position: position
	})

	const _position = toRaw(position.cartesian)
	!dirty && (_position.z += 0.8) // point 会被模型遮挡，暂时没有其他解决办法

	const labelText = _tempPoint.length === 1
		? `起点\n东：${_tempPoint[0].position.y.toFixed(3)}\n北：${_tempPoint[0].position.x.toFixed(3)}\n高：${_tempPoint[0].position.z.toFixed(3)} m`
		: `距上一点\n投影距离：${calcDistanceCartesian3(_tempPoint[_tempPoint.length - 2].position, _tempPoint[_tempPoint.length - 1].position).toFixed(3)
		} m\n高差：${(_tempPoint[_tempPoint.length - 1].position.z - _tempPoint[_tempPoint.length - 2].position.z).toFixed(3)} m`

	_viewer.entities.add({
		id: key,
		position: _position,
		point: {
			pixelSize: 8,
			color: Cesium.Color[color.toUpperCase()],
			outlineColor: Cesium.Color.WHITE,
			outlineWidth: 2,
		},
		label: {
			text: labelText,
			style: Cesium.LabelStyle.FILL,
			outlineWidth: 2,
			font: 'normal 32px PingFangSC MicroSoft YaHei',
			verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			pixelOffset: new Cesium.Cartesian2(0, -9),
			backgroundColor: new Cesium.Color(0, 0, 0, 0.8),
			backgroundPadding: new Cesium.Cartesian2(18, 18),
			horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
			showBackground: true,
			outlineColor: Cesium.Color.WHITE,
			scale: 0.4,
			scaleByDistance: new Cesium.NearFarScalar(10000000, 1, 10000001, 0.0)
		}
	});
}

const updateTempPoint = (color: EntityColor) =>
{
	_tempPoint.forEach(p =>
	{
		const entity = _viewer.entities.getById(p.id)
		if (Cesium.defined(entity))
		{
			entity.point.color = new Cesium.ConstantProperty(Cesium.Color[color.toUpperCase()])
		}
	})
}

export const removeTempPoint = () =>
{
	_tempPoint.forEach(p => removeEntity(p.id))
	_tempPoint.splice(0, _tempPoint.length)
}

// 选中/取消选中时更新实体
export const updateSelectedEntity = (type: ToolType, value: EntityTreeChild, select: boolean) =>
{
	switch (type)
	{
		case ToolType.NOTATION:
			updatePoint(value.key, value.color, select);
			break;
		case ToolType.LINE:
			select
				? updatePolyline(value.key, value.color, value.position, true)
				: updatePolyline(value.key, value.color);
			break;
		case ToolType.AREA:
			select
				? updatePolygon(value.key, value.color, value.position, true)
				: updatePolygon(value.key, value.color);
			break;
		default:
			break;
	}
}