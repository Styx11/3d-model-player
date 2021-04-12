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
	import { defineComponent, reactive, ref } from 'vue'

	import { useState } from '../../hooks'

	export default defineComponent({
		name: 'Toolbar',
		components: {
		},
		props: {
		},
		setup(props)
		{
			const [selected, setSelected] = useState<string>('')
			const tools = reactive(['note', 'line', 'area'])

			const selectTool = (t: string) => selected.value && selected.value === t ? setSelected('') : setSelected(t)

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