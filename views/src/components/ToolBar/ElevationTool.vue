<template>
	<div class="elevation_tool">
		<Tooltip placement="bottom">
			<template #title>
				<span>保存</span>
			</template>
			<span class="operation_item">
				<Icon name="ic-store" :width="20" :height="20" interactive />
			</span>
		</Tooltip>
		<Divider type="vertical" style="{{ margin: 0 }}" />
		<Tooltip placement="bottom">
			<template #title>
				<span>撤销</span>
			</template>
			<span class="operation_item">
				<Icon name="ic-revoke" :width="20" :height="20" interactive />
			</span>
		</Tooltip>
		<Divider type="vertical" style="{{ margin: 0 }}" />
		<Tooltip placement="bottom">
			<template #title>
				<span>隐藏标签</span>
			</template>
			<span class="operation_item">
				<Icon name="ic-coordinate-display" :width="20" :height="20" interactive />
			</span>
		</Tooltip>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue'
	import { Tooltip, Divider } from 'ant-design-vue'

	export default defineComponent({
		components: {
			Divider,
			Tooltip,
		},
		setup()
		{

		},
	})
</script>

<style lang="less" scoped>
	@import "@/styles/colors.less";
	@import "@/styles/common.less";
	@import "@/styles/layout.less";

	.elevation_tool {
		width: 110px;
		height: 32px;
		padding: 0;
		border-radius: 2px;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
		background-color: #ffffff;
		.flexContainer(row);
		justify-content: space-between;

		.ant-divider-vertical {
			margin: 2px 0 0 0;
			height: 60%;
		}

		::v-deep(.meshIcon) {
			display: inline-block;
			width: 20px;
			height: 20px;
		}

		.operation_item {
			height: 100%;
			cursor: pointer;
			flex: 1 1 auto;
			.flexContainer(column, center);
		}
	}
</style>
