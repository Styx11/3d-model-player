import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { ModelFile, file } from './file/index'
import { CesiumEntity, entity } from './entity/index'

// typing vuex
// https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
export interface RootState
{
	spinning: boolean
}

export enum RootStateMutation
{
	SET_SPINNING = 'setSpinning'
}

// vuex 模块化 typescript 支持
// https://blog.csdn.net/fanweilin0123/article/details/109903447
export interface AllState extends RootState
{
	spinning: boolean;
	modelFile: ModelFile;
	cesiumEntity: CesiumEntity;
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
	},
	state: {
		spinning: false,
	},
	mutations: {
		setSpinning(state: RootState, spinning: boolean)
		{
			state.spinning = spinning
		}
	},
	actions: {
	},
})
