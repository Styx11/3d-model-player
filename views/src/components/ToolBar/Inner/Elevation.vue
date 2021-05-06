<template>
	<div class="elevation_inner">
		<main class="elevation_main">
			<div class="elevation_item">
				<span class="item_title">高程点区域 1</span>
				<span class="item_icons">
					<Icon name="ic-download" :width="18" :height="18" interactive />
					<Icon name="ic-trash" :width="18" :height="18" interactive />
					<Icon name="ic-eye" :width="18" :height="18" interactive />
					<Icon name="ic-display-data" :width="18" :height="18" interactive />
				</span>
			</div>
			<div class="elevation_item">
				<span class="item_title">高程点区域 1</span>
				<span class="item_icons">
					<Icon name="ic-download" :width="18" :height="18" interactive />
					<Icon name="ic-trash" :width="18" :height="18" interactive />
					<Icon name="ic-eye" :width="18" :height="18" interactive />
					<Icon name="ic-display-data" :width="18" :height="18" interactive />
				</span>
			</div>
			<div class="elevation_item">
				<span class="item_title">高程点区域 1</span>
				<span class="item_icons">
					<Icon name="ic-download" :width="18" :height="18" interactive />
					<Icon name="ic-trash" :width="18" :height="18" interactive />
					<Icon name="ic-eye" :width="18" :height="18" interactive />
					<Icon name="ic-display-data" :width="18" :height="18" interactive />
				</span>
			</div>
		</main>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue'

	export default defineComponent({
		name: 'ElevationInner',
		components: {
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

	.elevation_inner {
		width: 100%;
		height: 100%;
		.flexContainer(column);

		.elevation_main {
			height: 100%;
			width: 100%;
			flex: 1 1 auto;
			overflow: auto;
			.scrollBar(8px);

			.elevation_item {
				width: 100%;
				height: 48px;
				margin: 4px 0;
				padding: 16px;
				transition: all @ease-base-out @animation-duration-fast;
				background-color: rgba(50, 75, 97, 0.5);
				.flexContainer(row);

				.item_title {
					flex: 1 1 auto;
					line-height: 100%;
					transition: all @ease-base-out @animation-duration-fast;
					.label(12px, rgba(255, 255, 255, 0.5));
				}

				.item_icons {
					flex: 1 1 auto;
					.flexContainer(row);
					justify-content: space-between;

					::v-deep(.meshIcon) {
						cursor: pointer;
						display: inline-block;
						width: 18px;
						height: 18px;
					}
				}

				&:hover {
					background-color: rgba(50, 75, 97, 1);

					.item_title {
						.label(12px, rgba(255, 255, 255, 1));
					}
				}
			}
		}
	}
</style>