<template>
	<div class="list_home_container">
		<TitleBar />
		<section class="list_main_container">
			<section class="list_main">
				<header class="main_header">
					<Tags :tags="tags" v-model:checkedTag="checkedTag" />
				</header>
				<main class="main_content">
					<Cards :models="models" :checkedTag="checkedTag" />
				</main>
			</section>
			<Spin :spinning="spinning" size="large" tip="加载中..." :style="{zIndex: spinning ? 99 : -1}" />
		</section>
	</div>
</template>

<script lang="ts">
	import { defineComponent, computed } from 'vue'
	import { Button, Spin } from 'ant-design-vue'

	import { useState } from '../../hooks'
	import { useStore } from '../../store'
	import Tags from './components/Tags.vue'
	import Cards from './components/Cards.vue'
	import TitleBar from '@/components/TitleBar'
	import { ModelFileState } from '@views/interface/Types'

	export default defineComponent({
		name: 'List',
		components: {
			Tags,
			Cards,
			Button,
			Spin,
			TitleBar,
		},
		setup()
		{
			const store = useStore()
			const [checkedTag, setCheckedTag] = useState<string>('')
			const spinning = computed(() => store.state.spinning)

			// 模型文件信息
			const models = computed<Array<ModelFileState>>(() =>
			{
				return store.state.modelFile.fileList
					.sort((a, b) => b.uploadAt - a.uploadAt)
					.filter(m => checkedTag.value === '' || checkedTag.value === m.tag)
			})
			const tags = computed<Array<string>>(() => [...new Set(store.state.modelFile.fileList.map(f => f.tag))])

			return {
				tags,
				models,
				spinning,
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
			position: relative;
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
			::v-deep(.ant-spin) {
				width: 100%;
				height: 100%;
				position: absolute;
				.flexContainer(column, center);
				background: rgba(233, 246, 254, 0.5);
			}
		}
	}
</style>