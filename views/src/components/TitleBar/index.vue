<template>
	<DragableContainer>
		<div class="title_bar">
			<aside class="title_bar_aside">
				<DragableItem>
					<section class="aside_title">
						<p v-if="isHomePage" class="title_item">Keris 三维模型播放器</p>
						<div v-else @click="goBack" class="title_item title_item_back">
							<LeftOutlined />
							<span :style="{ marginLeft: '8px' }">返回</span>
						</div>
					</section>
				</DragableItem>
			</aside>
			<Divider type="vertical" style="{{ margin: 0 }}" />
			<main class="title_bar_main">
				<aside class="main_left">
					<DragableItem>
						<span class="project_name">{{ projectName }}</span>
					</DragableItem>
				</aside>
				<section class="main_right">
					<slot name="operationSection">
						<span class="default_operation_text">其他1</span>
						<span class="default_operation_text">其他2</span>
						<span class="default_operation_text">其他3</span>
					</slot>
				</section>
			</main>
		</div>
	</DragableContainer>
</template>

<script lang='ts'>
	import { defineComponent } from 'vue'
	import { Divider } from 'ant-design-vue'
	import { LeftOutlined } from '@ant-design/icons-vue'

	import DragableContainer from '../Drag/DragableContainer.vue'
	import DragableItem from '../Drag/DragableItem.vue'

	// 简单的 Titlebar 组件，之后可能会有修改
	// 比如全屏后 titlebarAside 位置的变化、右方操作按钮区域的变化
	export default defineComponent({
		name: 'TitleBar',
		components: {
			Divider,
			DragableItem,
			DragableContainer,
			LeftOutlined,
		},
		props: {
			projectName: {
				type: String,
				default: '项目名称',
			}
		},
		computed: {
			isHomePage(): boolean
			{
				return this.$route.path.split('/').filter(r => r !== '').length === 0
			}
		},
		methods: {
			goBack(): void
			{
				if (!this.isHomePage && this.$route.path !== '/')
				{
					this.$router.replace('/')
				}
				else
				{
					this.$router.go(-1)
				}
			}
		}
	})
</script>

<style lang='less' scoped>
	@import "@/styles/layout.less";
	@import "@/styles/colors.less";
	@import "@/styles/common.less";

	.title_bar {
		.flexContainer(row);
		.noselect();
		width: 100%;
		height: @TRAFFIC_LIGHT_HEIGHT;
		box-shadow: inset 0 -0.5px 0 0 #000000;
		background: @BLUE2;
		padding: 10px 24px;
		.title_bar_aside {
			display: inline-block;
			flex: 0 0 auto;
			height: 100%;
			width: @ASIDE_CONTENT_WIDTH - 24px;
			padding-left: @TRAFFIC_LIGHT_WIDTH;
			color: @WHITE_COLOR;
			.aside_title {
				display: inline-block;
				height: 100%;
				.title_item {
					height: 100%;
					margin: 0;
				}
				.title_item_back {
					&:hover {
						color: @PRIMARY_COlOR;
					}
				}
			}
		}
		.title_bar_main {
			.flexContainer(row);
			padding-left: 24px;
			flex: 1 1 auto;
			height: 100%;
			.main_left {
				height: 100%;
				.label(14px, @WHITE_COLOR);
			}
			.main_right {
				height: 100%;
				flex: 1 1 auto;
				.flexContainer(row, flex-end);
				.default_operation_text {
					.label(14px, @WHITE_COLOR);
				}
				& > * {
					height: 100%;
					margin-left: 24px;
				}
			}
		}
		.ant-divider-vertical {
			margin: 2px 0 0 0;
			height: 100%;
			background: @BLUE0;
		}
	}
</style>