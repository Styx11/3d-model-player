<template>
	<div class="card_list">
		<Row :gutter="[24, 24]" style="width: 100%; height: 100%">
			<Col :span="6">
				<UploadCard />
			</Col>
			<Col :span="6" v-for="(n, i) in 10" :key="i">
				<Card hoverable style="width: 100%; height: 100%;">
					<template #cover>
						<div class="card_cover" style="width: 100%; height: 327.7px;">
							<router-link to="/home">
								<div class="card_mask">
									<EyeOutlined />
									<p>查看模型</p>
								</div>
							</router-link>
							<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
						</div>
					</template>
					<Meta>
						<template #title>
							Europe Street beat
							<Tag>Tag1</Tag>
						</template>
						<template #description>www.instagram.com</template>
					</Meta>
				</Card>
			</Col>
		</Row>
	</div>
</template>

<script lang="ts">
	import { defineComponent, toRefs } from 'vue'
	import { Card, Col, Row, Tag } from 'ant-design-vue'
	import { EyeOutlined } from '@ant-design/icons-vue'
	const { Meta } = Card

	import UploadCard from './UploadCard.vue'

	export default defineComponent({
		name: 'Cards',
		components: {
			Card,
			Col,
			Row,
			Meta,
			Tag,
			UploadCard,
			EyeOutlined,
		},
		props: {

		},
		setup()
		{

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
