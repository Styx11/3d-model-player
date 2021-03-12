<template>
	<div
		:class="[svgClass, 'meshIcon', disabled ? 'meshIcon_disabled' : '', pointer ? 'meshIcon_pointer' : '']"
		:title="title"
		@mouseenter="onHover"
		@mouseleave="onUnhover"
		@mousedown="onActive"
		@mouseup="onUnactive"
	>
		<!-- 在svg上绑定了mousedown的话会导致父组件的click无法触发，所以这里在svg外套一个div来监听鼠标事件，并把svg设置为pointer-events: none; -->
		<!-- 并且除了鼠标移开以外的原因造成的失焦（如点击svg导致弹框使得svg失焦），svg上mouseleave事件不会触发, div不会有这个问题 -->
		<svg class="meshIcon_meshSvg" :style="{width, height}" aria-hidden="true">
			<use :xlink:href="iconName" rel="external nofollow" />
		</svg>
	</div>
</template>

<script lang="ts">
	import { defineComponent, computed, toRefs, ref } from 'vue'
	export default defineComponent({
		name: "Icon",
		props: {
			name: {
				type: String,
				required: true,
			},
			className: {
				type: String,
				default: '',
			},
			disabled: {
				type: Boolean,
				default: false,
			},
			pointer: {
				type: Boolean,
				default: false,
			},
			/**
			 * 是否携带交互，如果为true，则会在相应的交互状态下寻找对应的svg图片，例如：Normal状态:ic-test Hover状态:ic-test-hover Active状态: ic-test-active
			 */
			interactive: {
				type: Boolean,
				default: false,
			},
			width: {
				type: Number,
				default: 12,
			},
			height: {
				type: Number,
				default: 12,
			},
			title: {
				type: String,
				required: false,
			}

		},
		setup(props, { emit })
		{
			const { interactive, disabled, name, className } = toRefs(props)
			const isActive = ref<boolean>(false)
			const isHover = ref<boolean>(false)

			const iconName = computed<string>(() =>
			{
				if (interactive.value && !disabled.value)
				{
					if (isActive.value)
					{
						return `#icon-${name.value}-active`
					}
					else if (isHover.value)
					{
						return `#icon-${name.value}-hover`
					}
				}
				return `#icon-${name.value}`
			})
			const svgClass = computed(() =>
			{
				if (className.value)
				{
					return 'mesh-icon ' + className.value
				} else
				{
					return 'mesh-icon'
				}
			})

			const onHover = () => isHover.value = true;
			const onUnhover = () => { isHover.value = false; isActive.value = false }

			const onActive = () => isActive.value = true;
			const onUnactive = () => { isActive.value = false; emit('click') }

			return {
				svgClass,
				isActive,
				isHover,
				iconName,
				onHover,
				onUnhover,
				onActive,
				onUnactive,
			}
		},
	})
</script>

<style lang="less" scoped>
	@import "@/styles/common.less";

	.meshIcon {
		.flexContainer(row, center, center);
		flex-shrink: 0;
		.meshIcon_meshSvg {
			flex-shrink: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
		}
	}
	.meshIcon_disabled {
		pointer-events: none;
		opacity: 0.4;
	}
	.meshIcon_pointer {
		cursor: pointer;
	}
</style>