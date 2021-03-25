import { VcFile } from 'ant-design-vue/lib/upload/interface'

// 模型上传表单
export interface IModelFormState
{
	title: string;
	tag: string;
	desc: string;
	location: string;
}

// 模型文件信息
export interface ModelFileState extends VcFile, IModelFormState
{
}
