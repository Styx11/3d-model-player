<template>
	<div class="login_home_container">This is login home</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue'
	import { Button } from 'ant-design-vue';

	export default defineComponent({
		name: 'login-home',
		components: {
			Button,
		},
		methods: {
			handleLoginClick()
			{
			}
		}
	})
</script>

<!-- 
	somehow css modules just doesn't work
	so we just use scoped css
-->
<style lang='less' scoped>
	.login_home_container {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
</style>