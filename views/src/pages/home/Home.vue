<template>
	<div class="project_home_container">hello</div>
</template>

<script lang='ts'>
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: 'project-home',
		components: {
		},
		computed: {
		},
		methods: {
		},
		mounted()
		{
		},
	})
</script>

<style lang='less' scoped>
	@import "@/styles/layout.less";

	.project_home_container {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		background-color: #f5f5f5;
	}
</style>
