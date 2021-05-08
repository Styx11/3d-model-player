import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { ToolType } from '@/interface/Types'
import { ModelFile, file } from './file/index'
import { CesiumEntity, entity } from './entity/index'
import { ElevationPointList, elevation } from './elevation/index'

// typing vuex
// https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
export interface RootState
{
	spinning: boolean;
	selectedTab: 'ortho' | '3d';
	selectedTool: ToolType | '';
}

export enum RootStateMutation
{
	SET_SPINNING = 'setSpinning',
	SEL_TAB = 'selectTab',
	SEL_TOOL = 'selectTool',
}

// vuex 模块化 typescript 支持
// https://blog.csdn.net/fanweilin0123/article/details/109903447
export interface AllState extends RootState
{
	selectedTool: ToolType | '';
	selectedTab: 'ortho' | '3d';
	spinning: boolean;
	modelFile: ModelFile;
	cesiumEntity: CesiumEntity;
	elevationPoint: ElevationPointList;
}

export const key: InjectionKey<Store<RootState>> = Symbol('vue-store')

// define your own `useStore` composition function
// 只能在 setup 函数的最顶级使用
export function useStore()
{
	return baseUseStore<AllState>(key)
}


export default createStore<RootState>({
	modules: {
		modelFile: file,
		cesiumEntity: entity,
		elevationPoint: elevation,
	},
	state: {
		selectedTool: '',
		spinning: false,
		selectedTab: '3d',
	},
	mutations: {
		setSpinning(state: RootState, spinning: boolean)
		{
			state.spinning = spinning
		},
		selectTab(state: RootState, tab: 'ortho' | '3d')
		{
			state.selectedTab = tab
		},
		selectTool(state: RootState, tool: ToolType | '')
		{
			state.selectedTool = tool
			console.log('select tool =>', tool)
		},
	},
	actions: {
	},
})
