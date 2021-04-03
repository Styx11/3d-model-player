import { createApp, App } from 'vue'
import { Store } from 'vuex'

import AppComponent from './App.vue'
import Icon from './components/Icon.vue'
import store, { key, RootStateMutation, RootState } from './store'
import router from './router'
import { ModelFileMutation } from './store/file'
import IPCRendererManager from './ipc/IPCRendererManager'

const initVueApp = async () =>
{
	const app = createApp(AppComponent)
		.use(store, key)
		.use(router)

	registerSvg(app)

	app.mount('#app')

	await initStore(store)
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

async function initStore(store: Store<RootState>)
{
	store.commit(RootStateMutation.SET_SPINNING, true)
	const models = await IPCRendererManager.getInstance().invokeInitStore()
	store.commit(ModelFileMutation.INIT_FILE, models)
	store.commit(RootStateMutation.SET_SPINNING, false)
}