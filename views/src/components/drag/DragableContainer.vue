<template>
	<div class="dragable_container">
		<slot></slot>
	</div>
</template>

<script lang="ts">
	// 可拖拽容器（应用界面的拖拽）
	// https://www.electronjs.org/docs/api/frameless-window#%E5%8F%AF%E6%8B%96%E6%8B%BD%E5%8C%BA
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: 'DragableContainer',
	})
</script>

<style lang="less" scoped>
	.dragable_container {
		-webkit-app-region: drag;
	}
</style>