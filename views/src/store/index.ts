import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

// typing vuex
// https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
export interface State
{
	[params: string]: any;
}

export const key: InjectionKey<Store<State>> = Symbol()

// define your own `useStore` composition function
export function useStore()
{
	return baseUseStore(key)
}


export default createStore<State>({
	modules: {
	},
	state: {
	},
	mutations: {
	},
	actions: {
	},
})
