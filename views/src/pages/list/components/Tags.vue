<template>
	<div class="tags_container">
		<section class="tags_header">Tags</section>
		<section class="tags_main">
			<div v-if="tags.length">
				<CheckableTag
					v-for="(tag, index) in tags"
					:key="index"
					:checked="checkedTag === tag"
					@click="checkTag(tag)"
				>{{ tag }}</CheckableTag>
			</div>
			<div v-else class="no_tags">暂无分类</div>
		</section>
	</div>
</template>

<script lang="ts">
	// 该标签展示组件是一个受控组件，通过 v-model:checkedTag 控制当前选中的标签
	import { defineComponent, toRefs, PropType } from 'vue'
	import { Tag } from 'ant-design-vue'
	const { CheckableTag } = Tag

	export default defineComponent({
		name: 'Tags',
		components: {
			CheckableTag,
		},
		props: {
			tags: {
				type: Array as PropType<Array<string>>,
				required: true,
			},
			checkedTag: {
				type: String,
				required: true,
			}
		},
		// v-model
		emits: [
			'update:checkedTag',
		],
		setup(props, { emit })
		{
			const { checkedTag } = toRefs(props)

			const checkTag = (tag: string) =>
			{
				const _tag = checkedTag.value === tag
					? ''
					: tag
				return emit('update:checkedTag', _tag)
			}

			return {
				checkTag,
			}
		}
	})
</script>

<style lang="less" scoped>
	@import "@/styles/common.less";
	@import "@/styles/colors.less";

	.tags_container {
		width: 100%;
		height: 100%;
		.flexContainer(column, center);
		.tags_header {
			width: 100%;
			height: 44px;
			flex-shrink: 0;
			padding: 8px 0;
			.label(16px, @FONT_SUB);
			.flexContainer(row);
		}
		.tags_main {
			width: 100%;
			height: 100%;
			flex: 1 1 auto;
			padding: 8px 0;
			.flexContainer(row, flex-start, flex-start, wrap, space-between);
			overflow: auto;
			.scrollBar(6px);
			.ant-tag.ant-tag-checkable {
				color: @WHITE_COLOR;
				padding: 2px 12px;
				margin-right: 12px;
				background: @TAG_UNCHECKED;
				.label(14px, @WHITE_COLOR);
				&.ant-tag-checkable-checked {
					background: @PRIMARY_COlOR;
				}
			}
			.no_tags {
				width: 100%;
				height: 44px;
				flex-shrink: 0;
				padding: 8px 0;
				.label(16px, @FONT_SUB);
				.flexContainer(row);
			}
		}
	}
</style>