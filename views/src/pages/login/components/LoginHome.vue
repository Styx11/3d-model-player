<template>
	<div class="login_home_container">
		<TitleBar />
		<p class="link">
			<router-link to="/home">To home</router-link>
		</p>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue'
	import { Button } from 'ant-design-vue';

	import TitleBar from '@/components/TitleBar';

	export default defineComponent({
		name: 'login-home',
		components: {
			Button,
			TitleBar,
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
		.link {
			margin-top: 100px;
		}
	}
</style>