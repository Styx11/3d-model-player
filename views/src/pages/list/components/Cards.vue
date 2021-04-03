<template>
	<div class="card_list">
		<Row :gutter="[24, 24]" style="width: 100%; height: 100%">
			<Col :span="6">
				<UploadCard />
			</Col>
			<Col :span="6" v-for="m in models" :key="m.uid">
				<Card hoverable style="width: 100%;">
					<template #cover>
						<div class="card_cover" style="width: 100%; height: 327.7px;">
							<router-link to="/home">
								<div class="card_mask">
									<Tooltip placement="bottom">
										<template #title>删除模型文件</template>
										<div class="card_delete" @click.prevent="handleDeleteConfirm(m.uid)">
											<CloseCircleFilled />
										</div>
									</Tooltip>
									<EyeOutlined />
									<p>查看模型</p>
								</div>
							</router-link>
							<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
						</div>
					</template>
					<Meta>
						<template #title>
							{{ m.title }}
							<Tag>{{ m.tag }}</Tag>
						</template>
						<template #description>{{ m.desc }}</template>
					</Meta>
				</Card>
			</Col>
		</Row>
	</div>
</template>

<script lang="ts">
	import { defineComponent, PropType, createVNode } from 'vue'
	import { Card, Col, Row, Tag, Tooltip, Modal, message } from 'ant-design-vue'
	import { EyeOutlined, CloseCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons-vue'
	const { Meta } = Card

	import { useStore } from '../../../store'
	import { ModelFileMutation } from '../../../store/file'
	import { useUploadRemove } from '../../../hooks/upload'
	import { ModelFileState } from '../../../interface/Types'
	import UploadCard from './UploadCard.vue'

	export default defineComponent({
		name: 'Cards',
		components: {
			Card,
			Col,
			Row,
			Meta,
			Tag,
			Tooltip,
			UploadCard,
			EyeOutlined,
			CloseCircleFilled,
		},
		props: {
			models: {
				type: Array as PropType<Array<ModelFileState>>,
				required: true,
			},
			checkedTag: {
				type: String,
				required: false,
			}
		},
		setup(props)
		{
			const store = useStore()
			const handleModelRemove = useUploadRemove(store)

			const handleDeleteConfirm = (uid: string) =>
			{
				Modal.confirm({
					title: '确认删除该模型文件？',
					icon: createVNode(ExclamationCircleOutlined),
					content: '该操作是无法撤销的',
					okText: '删除',
					okType: 'danger',
					cancelText: '取消',
					async onOk()
					{
						try
						{
							await new Promise(resolve => setTimeout(() => resolve(true), 1000))
							return await handleModelRemove(uid)
						}
						catch (e)
						{
							console.error(e)
							return message.error({ content: '删除出现错误！', key: 'remove_failed' })
						}

					},
					onCancel()
					{
					},
				});
			}

			return {
				handleDeleteConfirm,
			}
		},
	})
</script>

<style lang="less" scoped>
	@import "@/styles/common.less";
	@import "@/styles/colors.less";

	.card_list {
		width: 100%;
		height: 90%;
		overflow: auto;
		.scrollBar(8px);
		::v-deep(.ant-card-meta-title) {
			overflow: hidden;
			position: relative;
			.ant-tag {
				float: right;
			}
		}
		.card_cover {
			width: 100%;
			height: 328px;
			position: relative;
			background: black;
			.card_mask {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: 99;
				text-align: center;
				vertical-align: top;
				transition: all 0.3s ease;
				color: transparent;
				.flexContainer(column, center);
				.card_delete {
					position: absolute;
					top: 8px;
					left: 10px;
					&:hover {
						color: rgba(237, 105, 94, 1);
					}
				}
				&:hover {
					color: @WHITE_COLOR;
					background: @MASK_COLOR;
				}
			}
			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}
	}
</style>
