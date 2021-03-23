<template>
	<div class="list_home_container">
		<TitleBar />
		<section class="list_main_container">
			<section class="list_main">
				<header class="main_header">
					<Tags :tags="tags" v-model:checkedTag="checkedTag" />
				</header>
				<main class="main_content">
					<Cards />
				</main>
			</section>
		</section>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, watch } from 'vue'
	import { Button } from 'ant-design-vue'

	import Tags from './components/Tags.vue'
	import Cards from './components/Cards.vue'
	import TitleBar from '@/components/TitleBar'

	export default defineComponent({
		name: 'List',
		components: {
			Tags,
			Cards,
			Button,
			TitleBar,
		},
		setup()
		{
			const checkedTag = ref<string>('')
			const tags = ref<Array<string>>([...new Set(['sdasd', 'taasasf', 'asd', 'sdad', 'sda', 'tasasf', 'asdsd'])])

			watch(checkedTag, newVal => console.log(newVal))

			return {
				tags,
				checkedTag,
			}
		}
	})
</script>

<!-- 
	somehow css modules just doesn't work
	so we just use scoped css
-->
<style lang='less' scoped>
	@import "@/styles/colors.less";
	@import "@/styles/layout.less";
	@import "@/styles/common.less";

	.list_home_container {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		.list_main_container {
			height: 100%;
			flex: 1 0 auto;
			border-top: 1px solid @BLUE0;
			background: @BLUE1;
			.flexContainer(row, center);
			.list_main {
				height: 100%;
				width: @MAIN_CONTENT_WIDTH;
				.flexContainer(column);
				.main_header {
					width: 100%;
					height: 141px;
					flex: 1 0 auto;
					overflow: auto;
					.scrollBar(6px);
				}
				.main_content {
					height: 100%;
					width: 100%;
					overflow: hidden;
				}
			}
		}
	}
</style>