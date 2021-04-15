<template>
	<div class="entity_info">
		<section class="info_header">
			<div class="title">
				<span v-if="!editVisible">{{ selectedEntity.title }}</span>
			</div>
			<div class="color">
				<Badge :color="selectedEntity.color" @click="setColorPanelVisible(!colorPanelVisible)" />
			</div>
		</section>
		<section class="info_body">
			<section class="entity_content" :style="{color: `${entityTextColor}`}">
				<div v-if="selectedEntity.type === 'notation' && selectedEntity.position">
					<p>东：{{selectedEntity.position.y.toFixed(5)}}</p>
					<p>北：{{selectedEntity.position.x.toFixed(5)}}</p>
					<p>高：{{selectedEntity.position.z.toFixed(3)}} m</p>
				</div>
			</section>
			<section class="entity_desc" v-if="!editVisible">{{ selectedEntity.desc }}</section>
			<section class="entity_edit" v-else>
				<TextArea
					v-model:value="editTitle"
					showCount
					:maxlength="10"
					:autoSize="{ minRows: 2, maxRows: 2 }"
					placeholder="标题"
				/>
				<TextArea
					v-model:value="editDesc"
					showCount
					:maxlength="100"
					:autoSize="{ minRows: 2, maxRows: 4 }"
					placeholder="描述信息"
				/>
			</section>
		</section>
		<section class="info_footer">
			<Icon
				name="ic-input"
				:width="18"
				:height="18"
				class-name="input"
				:interactive="true"
				@click="setEditVisible(true)"
				v-if="!editVisible"
			/>
			<Space v-else>
				<Button size="small" @click="handleEditCancel">取消</Button>
				<Button type="primary" size="small" @click="handleEditConfirm">确认</Button>
			</Space>
		</section>
		<section class="color_panel" v-show="colorPanelVisible">
			<div
				v-for="c in colors"
				:key="c"
				class="color_dot"
				:class="[selectedEntity.color === c ? 'selected': '']"
				@click="handleSelectColor(c)"
			>
				<Badge :color="c" />
			</div>
		</section>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, toRaw, watch } from 'vue'
	import { Badge, Input, Button, Space } from 'ant-design-vue'

	const { TextArea } = Input

	import { useStore } from '../../store'
	import { useState } from '../../hooks'
	import { updatePoint } from '../../hooks/cesium'
	import { EntityColor, EntityTreeChild, EntityTextColor } from '@views/interface/Types'
	import { CesiumEntityMutation } from '@views/store/entity'

	export default defineComponent({
		name: 'EntityInfo',
		components: {
			Badge,
			Button,
			Space,
			TextArea,
		},
		props: {
		},
		setup(props)
		{
			const store = useStore()
			const selectedEntity = computed(() => store.state.cesiumEntity.selectedEntity)
			const entityTextColor = computed(() => EntityTextColor[selectedEntity.value.color])

			const colors = [EntityColor.RED, EntityColor.ORANGE, EntityColor.YELLOW, EntityColor.GREEN, EntityColor.BLUE, EntityColor.PURPLE]
			const [colorPanelVisible, setColorPanelVisible] = useState<boolean>(false)

			const [editVisible, setEditVisible] = useState<boolean>(false)
			const [editTitle, setEditTitle] = useState<string>(selectedEntity.value.title)
			const [editDesc, setEditDesc] = useState<string>(selectedEntity.value.desc)

			const handleSelectColor = (color: string) =>
			{
				if (selectedEntity.value.color === color)
				{
					return
				}

				store.commit(CesiumEntityMutation.SEL_ENTITY, { color })
				store.commit(CesiumEntityMutation.UPDATE_ENTITY, {
					type: selectedEntity.value.type,
					child: {
						key: selectedEntity.value.key,
						color: selectedEntity.value.color,
						desc: selectedEntity.value.desc,
						type: selectedEntity.value.type,
						title: selectedEntity.value.title,
						position: toRaw(selectedEntity.value.position),
						isLeaf: true,
						slots: { title: 'title' },
					} as EntityTreeChild
				})
				updatePoint(selectedEntity.value.key, selectedEntity.value.color, true)
			}

			const handleEditCancel = () =>
			{
				setEditVisible(false)
				setEditTitle(selectedEntity.value.title)
				setEditDesc(selectedEntity.value.desc)
			}
			const handleEditConfirm = () =>
			{
				setEditVisible(false)
				if (editTitle.value === selectedEntity.value.title && editDesc.value === selectedEntity.value.desc) return
				store.commit(CesiumEntityMutation.SEL_ENTITY, { title: editTitle.value, desc: editDesc.value })
				store.commit(CesiumEntityMutation.UPDATE_ENTITY, {
					type: selectedEntity.value.type,
					child: {
						key: selectedEntity.value.key,
						color: selectedEntity.value.color,
						desc: selectedEntity.value.desc,
						type: selectedEntity.value.type,
						title: selectedEntity.value.title,
						position: toRaw(selectedEntity.value.position),
						isLeaf: true,
						slots: { title: 'title' },
					} as EntityTreeChild
				})
			}

			watch(selectedEntity, (newVal, oldVal) =>
			{
				setEditVisible(false)
				setEditTitle(newVal.title)
				setEditDesc(newVal.desc)
			}, { deep: true })

			return {
				colors,
				editTitle,
				editDesc,
				editVisible,
				entityTextColor,
				selectedEntity,
				colorPanelVisible,
				setColorPanelVisible,
				setEditVisible,

				handleSelectColor,
				handleEditCancel,
				handleEditConfirm,
			}
		},
	})
</script>

<style lang="less" scoped>
	@import "@/styles/colors.less";
	@import "@/styles/common.less";
	@import "@/styles/layout.less";

	.entity_info {
		width: 207px;
		height: auto;
		padding: 8px;
		position: relative;
		background-color: rgba(0, 0, 0, 0.8);
		border: solid 0.5px #4c4c4d;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
		min-height: 100px;
		max-height: 300px;
		.flexContainer(column);

		.info_header {
			width: 100%;
			.flexContainer(row, flex-start);

			.title {
				flex: 1 1 auto;
				margin-bottom: 16px;
				height: 100%;
				width: 100%;
				.ellipsis();
				.label(12px, @WHITE_COLOR);
			}

			.color {
				.flexContainer(column, center);
				margin-bottom: 16px;
				height: 100%;

				::v-deep(.ant-badge) {
					.ant-badge-status-dot {
						width: 12px;
						height: 12px;
						cursor: pointer;
						border-radius: 6px;
						border: solid 1px #ffffff;
					}

					.ant-badge-status-text {
						margin: 0;
					}
				}
			}
		}

		.info_body {
			width: 100%;
			height: auto;
			flex: 1 1 auto;
			.flexContainer(column);

			.entity_content {
				width: 100%;
				margin-bottom: 8px;
				p {
					font-size: 12px;
					margin: 0;
				}
			}
			.entity_desc {
				width: 100%;
				max-height: 100px;
				.scrollBar(6px);
				.label(12px, @WHITE_COLOR);
			}
			.entity_edit {
				width: 100%;

				::v-deep(.ant-input-textarea.ant-input-textarea-show-count) {
					.ant-input {
						border: unset;
						background-color: #3d3e3e;
						.scrollBar(6px);
						.label(12px, @WHITE_COLOR);
						&:hover {
							border: unset;
						}
						&:active {
							border: unset;
						}
						&:focus {
							border: unset;
						}
					}

					&::after {
						.label(12px, @FONT_SUB);
					}
				}
			}
		}

		.info_footer {
			width: 100%;
			height: 24px;
			margin-top: 8px;
			.flexContainer(row, flex-end);

			::v-deep(.input) {
				cursor: pointer;
			}
		}

		.color_panel {
			position: absolute;
			top: 0;
			right: -45px;
			width: 37px;
			height: 176px;
			border-radius: 2px;
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
			padding: 8px;
			background-color: #2e2f30;
			.flexContainer(column, center);

			.color_dot {
				width: 28px;
				height: 28px;

				::v-deep(.ant-badge) {
					width: 28px;
					height: 28px;
					cursor: pointer;
					.flexContainer(column, center);

					&:hover {
						.ant-badge-status-dot {
							border: solid 2px #86898d;
						}
					}

					.ant-badge-status-dot {
						width: 12px;
						height: 12px;
						border-radius: 6px;
					}

					.ant-badge-status-text {
						margin: 0;
					}
				}

				&.selected {
					::v-deep(.ant-badge) {
						&:hover {
							.ant-badge-status-dot {
								border: solid 2px @WHITE_COLOR;
							}
						}
						.ant-badge-status-dot {
							border: solid 2px @WHITE_COLOR;
						}
					}
				}
			}
		}
	}
</style>
