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
export interface ModelFileState extends IModelFormState
{
	uid: string;
	name: string;         // name 带有文件名及后缀
	path: string;
	size: number;
	uploadAt: number;
	lastModified: number;
}
