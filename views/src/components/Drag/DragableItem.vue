<template>
	<div class="dragable_item">
		<slot></slot>
	</div>
</template>

<script lang="ts">
	// 项目不可拖拽（否则将无法点击）
	// https://www.electronjs.org/docs/api/frameless-window#%E5%8F%AF%E6%8B%96%E6%8B%BD%E5%8C%BA
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: 'DragableItem',
	})
</script>

<style lang="less" scoped>
	.dragable_item {
		-webkit-app-region: no-drag;
	}
</style>