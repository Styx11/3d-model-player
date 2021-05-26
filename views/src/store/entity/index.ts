// 存放所有上传的模型文件信息
import { toRaw } from 'vue'
import { Module } from 'vuex'
import { RootState } from '../index'
import { EntityTreeItem, EntityTreeChild, ToolType, ToolTitle, EntityColor } from '../../interface/Types'

export interface CesiumEntity
{
	entityList: Array<EntityTreeItem>;
	selectedEntity: EntityTreeChild;
}

export enum CesiumEntityMutation
{
	SEL_ENTITY = 'cesiumEntity/selectEntity',
	UNSEL_ENTITY = 'cesiumEntity/unselectEntity',
	INIT_ENTITY = 'cesiumEntity/initEntity',
	ADD_ENTITY = 'cesiumEntity/addEntity',
	UPDATE_ENTITY = 'cesiumEntity/updateEntity',
	REMOVE_ENTITY = 'cesiumEntity/removeEntity',
}

export const entity: Module<CesiumEntity, RootState> = {
	namespaced: true,
	state: {
		selectedEntity: {
			key: '',
			title: '标注工具 - 1',
			type: ToolType.NOTATION,
			desc: '',
			color: EntityColor.RED,
			position: [],
		},
		entityList: [{
			title: ToolTitle.NOTATION,
			key: ToolType.NOTATION,
			slots: { title: 'title' },
			children: [],
		},
		{
			title: ToolTitle.LINE,
			key: ToolType.LINE,
			slots: { title: 'title' },
			children: [],
		},
		{
			title: ToolTitle.AREA,
			key: ToolType.AREA,
			slots: { title: 'title' },
			children: [],
		}],
	},
	mutations: {
		selectEntity(state: CesiumEntity, entity: EntityTreeChild)
		{
			Object.assign(state.selectedEntity, entity)
			console.log('selecte entity =>', toRaw(state.selectedEntity))
		},
		unselectEntity(state: CesiumEntity, type: ToolType = ToolType.NOTATION)
		{
			Object.assign(state.selectedEntity, {
				key: '',
				type,
				desc: '',
				color: EntityColor.RED,
				position: [],
			})
			console.log('unselect entity!')
		},
		initEntity(state: CesiumEntity, payload?: Array<EntityTreeItem>)
		{
			if (payload)
			{
				state.entityList = payload
			}
			else
			{
				state.selectedEntity = {
					key: '',
					title: '标注工具 - 1',
					type: ToolType.NOTATION,
					desc: '',
					color: EntityColor.RED,
					position: [],
				}
				state.entityList = [{
					title: ToolTitle.NOTATION,
					key: ToolType.NOTATION,
					slots: { title: 'title' },
					children: [],
				},
				{
					title: ToolTitle.LINE,
					key: ToolType.LINE,
					slots: { title: 'title' },
					children: [],
				},
				{
					title: ToolTitle.AREA,
					key: ToolType.AREA,
					slots: { title: 'title' },
					children: [],
				}]
			}
			console.log('init entityList =>', toRaw(state.entityList))
		},
		addEntity(state: CesiumEntity, payload: { type: ToolType, child: EntityTreeChild })
		{
			state.entityList.forEach(item =>
			{
				if (item.key === payload.type)
				{
					item.children.push(Object.assign(payload.child, { title: payload.child.title + " " + (item.children.length + 1) }))
				}
			})
			console.log('state entityList =>', toRaw(state.entityList))
		},
		updateEntity(state: CesiumEntity, payload: { type: ToolType, child: EntityTreeChild })
		{
			state.entityList.forEach(item =>
			{
				if (item.key === payload.type)
				{
					const matchIndex = item.children.findIndex(e => e.key === payload.child.key)

					if (matchIndex > -1)
					{
						item.children.splice(matchIndex, 1, payload.child)
					}
				}
			})
			console.log('update entity =>', toRaw(state.entityList))
		},
		removeEntity(state: CesiumEntity, payload: { type: ToolType, key: string })
		{
			state.entityList.forEach(item =>
			{
				if (item.key === payload.type)
				{
					const matchIndex = item.children.findIndex(e => e.key === payload.key)

					if (matchIndex > -1)
					{
						item.children.splice(matchIndex, 1)
					}
				}
			})
			if (state.selectedEntity.key === payload.key)
			{
				Object.assign(state.selectedEntity, {
					key: '',
					type: ToolType.NOTATION,
					desc: '',
					color: EntityColor.RED,
					position: [],
				})
			}
		}
	}
}