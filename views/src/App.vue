<template>
	<div id="app">
		<ConfigProvider :locale="locale">
			<router-view />
		</ConfigProvider>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted } from 'vue'
	import { useRouter } from 'vue-router'
	import { ConfigProvider } from 'ant-design-vue'
	import zhCN from 'ant-design-vue/es/locale/zh_CN';

	export default defineComponent({
		name: 'App',
		components: {
			ConfigProvider,
		},
		setup()
		{
			// 在模型页面刷新会造成组件加载失败问题，这貌似是 vue 本身的问题
			// 所以我们总是在 初始化/刷新 的时候跳转至首页
			const router = useRouter()
			onMounted(() => router.replace('/'))
		},
		data()
		{
			return {
				locale: zhCN,
			}
		}
	})
</script>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
