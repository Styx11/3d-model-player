<template>
	<div class="upload_card" @click="showModal">
		<div class="upload_img">
			<img src="@/static/image/pic-jiance-bg.jpg" />
		</div>
		<div class="upload_mask">
			<Icon name="ic-upload" :width="44" :height="44" class-name="upload_icon" />
			<p style="margin-top: 18px">点此上传模型文件和相关信息</p>
		</div>
		<Modal
			v-model:visible="modalVisible"
			title="上传模型文件和相关信息"
			:maskClosable="false"
			:confirm-loading="confirmLoading"
			:closable="cancelable"
			:cancelButtonProps="{ disabled: !cancelable}"
			okText="上传"
			@ok="handleModalOk"
			:width="860"
		>
			<section class="modal_body">
				<Row :gutter="[24, 24]">
					<Col :span="12" style="overflow: auto;">
						<UploadDragger
							name="modelFile"
							:action="customAction"
							:customRequest="customUpload"
							:remove="customRemove"
							accept=".obj, .fbx, .dae, .gltf, .glb"
						>
							<p class="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
							<p class="ant-upload-hint">每次只能上传一个文件，支持 .obj .fbx .dae .gltf .glb 文件格式</p>
						</UploadDragger>
					</Col>
					<Col :span="12">
						<Form
							:model="formState"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 16 }"
							:rules="formRules"
							ref="formRef"
						>
							<FormItem label="Model CreatedAt" name="createAt">
								<DatePicker v-model:value="formState.createAt" />
							</FormItem>
							<FormItem label="Model Name" name="name">
								<Input v-model:value="formState.name" placeholder="模型名称" />
							</FormItem>
							<FormItem label="Model Tag" name="tag">
								<Input v-model:value="formState.tag" placeholder="模型分类" />
							</FormItem>
							<FormItem label="Model Desc" name="desc">
								<TextArea
									v-model:value="formState.desc"
									:autoSize="{ minRows: 2, maxRows: 4 }"
									placeholder="模型信息描述"
									allow-clear
								/>
							</FormItem>
						</Form>
					</Col>
				</Row>
			</section>
		</Modal>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, toRaw } from 'vue'
	import { InboxOutlined } from '@ant-design/icons-vue'
	import { Modal, Row, Col, Button, Form, Input, DatePicker, Upload } from 'ant-design-vue'
	import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
	import { ValidationRule } from 'ant-design-vue/lib/form/Form'

	import '@/static/image/pic-jiance-bg.jpg'
	import { IModelFormState } from '../../../interface/Types'
	import { useModelAction, useModelUpload, useModelRemove } from '../../../hooks/upload'
	import { useState, useCollectionState, UnwrapNestedRefs } from '../../../hooks/index'

	const { Dragger: UploadDragger } = Upload
	const { Item: FormItem } = Form
	const { TextArea } = Input
	interface FormRules
	{
		[k: string]: ValidationRule[];
	}

	export default defineComponent({
		name: 'UploadCard',
		components: {
			Modal,
			Row,
			Col,
			Button,
			Form,
			FormItem,
			Input,
			TextArea,
			DatePicker,
			UploadDragger,
			InboxOutlined,
		},
		setup()
		{
			// Form 相关
			const formRef = ref()
			const [formState, setFormState] = useCollectionState<IModelFormState>({
				name: '',
				tag: '',
				desc: '',
				createdAt: '',
			})
			const [formRules, setFormRules] = useCollectionState<FormRules>({
				name: [
					{ required: true, message: '请输入模型名称', trigger: 'blur' },
					{ min: 2, max: 10, message: '模型名称的长度应当大于 2 且小于 10', trigger: 'blur' },
				],
				tag: [{ required: true, message: '请输入模型分属的类别', trigger: 'blur' }],
				desc: [{ required: true, message: '请输入模型的描述信息', trigger: 'blur' }],
				createAt: [{ required: true, message: '请选择模型的创建时间', trigger: 'change', type: 'object' }],
			})

			// Upload 相关
			const customAction = useModelAction()
			const customUpload = useModelUpload()
			const customRemove = useModelRemove()

			// Modal 相关
			const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
			const [modalVisible, setModalVisible] = useState<boolean>(false)
			const [cancelable, setCancelable] = useState<boolean>(true)
			const showModal = () =>
			{
				setModalVisible(true)
			}
			const hideModal = () =>
			{
				setModalVisible(false)
			}
			const handleModalOk = () =>
			{
				// 上传过程中不可关闭
				setCancelable(false)
				setConfirmLoading(true)
				formRef.value.validate()
					.then(() =>
					{
						console.log('form values =>', formState);
						setTimeout(() =>
						{
							setCancelable(true)
							setConfirmLoading(false)
							hideModal()
						}, 2000)
					})
					.catch((error: ValidateErrorEntity<IModelFormState>) =>
					{
						setCancelable(true)
						setConfirmLoading(false)
						console.log('error', error)
					})
			}

			return {
				formRef,
				formRules,
				formState,
				customAction,
				customUpload,
				customRemove,
				modalVisible,
				showModal,
				hideModal,
				handleModalOk,
				confirmLoading,
				cancelable,
			}
		},
	})
</script>

<style lang="less" scoped>
	@import "@/styles/colors.less";
	@import "@/styles/common.less";

	.upload_card {
		width: 100%;
		height: 100%;
		position: relative;
		background-color: rgba(222, 225, 238, 1);
		border-radius: 2px;
		cursor: pointer;
		overflow: hidden;

		.upload_img {
			position: absolute;
			bottom: -8px;
			left: 0;
			width: 100%;
			height: 178px;
			& img {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}

		.upload_mask {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 99;
			.label(16px, @FONT_SUB);
			.flexContainer(column, center);
			width: 100%;
			height: 100%;
			text-align: center;
			vertical-align: top;
			transition: all 0.3s ease;

			&:hover {
				background: @MASK_COLOR;
				color: @WHITE_COLOR;
				::v-deep(svg) {
					stroke: @WHITE_COLOR;
				}
			}
		}

		.modal_body {
			width: 100%;
			height: 100%;
			.flexContainer(row);
		}
	}
</style>
