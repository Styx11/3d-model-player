<template>
	<div id="app">
		<ConfigProvider :locale="locale">
			<router-view />
		</ConfigProvider>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN';

export default defineComponent({
	name: 'App',
	components: {
		ConfigProvider,
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
