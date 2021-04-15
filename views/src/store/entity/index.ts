// 存放所有上传的模型文件信息
import { toRaw } from 'vue'
import { Module } from 'vuex'
import { RootState } from '../index'
import { EntityTreeItem, EntityTreeChild, ToolType, ToolTitle, EntityColor } from '../../interface/Types'

export interface CesiumEntity
{
	entityList: Array<EntityTreeItem>;
	selectedTool: ToolType | '';
	selectedEntity: EntityTreeChild;
}

export enum CesiumEntityMutation
{
	SEL_TOOL = 'cesiumEntity/selectTool',
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
		selectedTool: '',
		selectedEntity: {
			key: '',
			title: '标注工具 - 1',
			type: ToolType.NOTATION,
			desc: '',
			color: EntityColor.RED,
			position: {
				x: 0,
				y: 0,
				z: 0,
				cartesian: null,
			}
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
		selectTool(state: CesiumEntity, tool: ToolType | '')
		{
			state.selectedTool = tool
			console.log('select tool =>', tool)
		},
		selectEntity(state: CesiumEntity, entity: EntityTreeChild)
		{
			Object.assign(state.selectedEntity, entity)
			console.log('selecte entity =>', toRaw(state.selectedEntity))
		},
		unselectEntity(state: CesiumEntity)
		{
			Object.assign(state.selectedEntity, {
				key: '',
				type: ToolType.NOTATION,
				desc: '',
				color: EntityColor.RED,
				position: {
					x: 0,
					y: 0,
					z: 0,
					cartesian: null,
				}
			})
			console.log('unselect entity!')
		},
		initEntity(state: CesiumEntity, payload: Array<EntityTreeItem>)
		{
			state.entityList = payload
			console.log('init entityList =>', toRaw(state.entityList))
		},
		addEntity(state: CesiumEntity, payload: { type: ToolType, child: EntityTreeChild })
		{
			state.entityList.forEach(item =>
			{
				if (item.key === payload.type)
				{
					item.children.push(payload.child)
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
					for (let i = 0; i < item.children.length; i++)
					{
						if (item.children[i].key === payload.child.key)
						{
							item.children.splice(i, 1, payload.child)
						}
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
					for (let i = 0; i < item.children.length; i++)
					{
						if (item.children[i].key === payload.key)
						{
							item.children.splice(i, 1)
						}
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
					position: {
						x: 0,
						y: 0,
						z: 0,
						cartesian: null,
					}
				})
			}
		}
	}
}