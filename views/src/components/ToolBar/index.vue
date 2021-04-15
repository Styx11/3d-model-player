<template>
	<div class="toolBar">
		<div
			v-for="t in tools"
			:key="t"
			:class="['tool_item', selected && selected === t ? 'selected_tool' : '']"
			@click="selectTool(t)"
		>
			<Icon :name="`ic-${t}`" :width="20" :height="20" />
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive, computed } from 'vue'

	import { useStore } from '../../store'
	import { CesiumEntityMutation } from '../../store/entity'
	import { ToolType } from '../../interface/Types'

	export default defineComponent({
		name: 'Toolbar',
		components: {
		},
		props: {
		},
		setup(props)
		{
			const store = useStore()

			// 选中的工具
			const selected = computed(() => store.state.cesiumEntity.selectedTool)

			// 工具名列表
			const tools = computed(() => store.state.cesiumEntity.entityList.map(e => e.key))

			// 选择工具
			const setSelected = (t: ToolType | '') => store.commit(CesiumEntityMutation.SEL_TOOL, t)
			const selectTool = (t: ToolType) => selected.value && selected.value === t ? setSelected('') : setSelected(t)

			return {
				tools,
				selected,
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