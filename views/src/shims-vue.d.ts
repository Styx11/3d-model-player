import { ComponentCustomProperties, ComponentOptions } from 'vue'
import { Store } from 'vuex'

declare module '*.vue' {
	const component: ComponentOptions
	export default component
}

// vuex.d.ts
declare module '@vue/runtime-core' {
	// declare your own store states
	interface State
	{
		[params: string]: any;
	}

	// provide typings for `this.$store`
	interface ComponentCustomProperties
	{
		$store: Store<State>
	}
}
