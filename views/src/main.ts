import { createApp, App } from 'vue'

import AppComponent from './App.vue'
import Icon from './components/Icon.vue'
import store from './store'
import router from './router'

const initVueApp = () =>
{
	const app = createApp(AppComponent)
		.use(store)
		.use(router)

	registerSvg(app)

	app.mount('#app')
}
initVueApp()

function registerSvg(app: App)
{
	app.component('Icon', Icon)
	// 使用require.context自动导入svg文件
	const requireAll = requireContext => requireContext.keys().map(requireContext)
	const req = require.context('./static/svg/', true, /\.svg$/)
	requireAll(req)
}