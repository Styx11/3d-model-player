<template>
	<div class="toolBar">
		<div
			v-for="t in tools"
			:key="t"
			:class="['tool_item', selectedTool && selectedTool === t ? 'selected_tool' : '']"
			@click="selectTool(t)"
		>
			<Icon :name="`ic-${t}`" :width="20" :height="20" />
		</div>
		<Divider style="{{ margin: 0 }}" />
		<div
			:class="['tool_item', selectedTool && selectedTool === 'elevation' ? 'selected_tool' : '']"
			@click="selectTool('elevation')"
		>
			<Icon name="ic-elevation" :width="20" :height="20" />
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive, computed } from 'vue'
	import { Divider } from 'ant-design-vue'

	import { useStore } from '../../store'
	import { RootStateMutation } from '../../store'
	import { ToolType } from '../../interface/Types'

	export default defineComponent({
		name: 'Toolbar',
		components: {
			Divider,
		},
		props: {
		},
		setup(props)
		{
			const store = useStore()

			// 选中的工具
			const selectedTool = computed(() => store.state.selectedTool)

			// 工具名列表
			const tools = reactive<ToolType[]>([ToolType.NOTATION, ToolType.LINE, ToolType.AREA])

			// 选择工具
			const setSelected = (t: ToolType | '') => store.commit(RootStateMutation.SEL_TOOL, t)
			const selectTool = (t: ToolType) => selectedTool.value && selectedTool.value === t ? setSelected('') : setSelected(t)

			return {
				tools,
				selectedTool,
				selectTool,
			}
		},
	})
</script>

<style lang="less" scoped>
	@import "@/styles/colors.less";
	@import "@/styles/layout.less";
	@import "@/styles/common.less";

	.toolBar {
		.noselect();
		z-index: 1000;
		width: @TRAFFIC_LIGHT_HEIGHT;
		height: 100%;
		background: @BLUE2;
		padding: 12px 6px;
		border-right: 1px solid @BLUE0;
		border-top: 1px solid @BLUE0;
		.flexContainer(column, flex-start);

		::v-deep(.ant-divider-horizontal) {
			background: @BLUE0;
		}

		.tool_item {
			display: inline-block;
			cursor: pointer;
			width: 28px;
			height: 28px;
			margin: 8px 0;
			color: @WHITE_COLOR;
			transition: all 0.2s ease;
			border-radius: 2px;
			.flexContainer(row, center);

			&:hover {
				background: rgba(34, 52, 71, 1);
			}

			&.selected_tool {
				background: @PRIMARY_COlOR !important;
			}
		}
	}
</style>