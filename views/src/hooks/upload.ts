import { VcFile } from 'ant-design-vue/lib/upload/interface'
import { message } from 'ant-design-vue'
import { UnwrapNestedRefs } from './index'
import { reactive } from 'vue'

/* 
	表单中模型文件上传的思路是：
	自定义上传删除函数拦截上传请求，并获取文件信息，其中包括文件名和文件地址
	在 Vuex 中保存文件信息并向 electron 发送事件，由 electron 写入文件到本地数据库中
	写入完成后 electron 完成事件回调
	(每次只能上传一个文件，由 setUploadDisabled 控制)
 */

// 内部维护的，待上传的文件列表
// 每次只能上传一个文件
const _fileList: UnwrapNestedRefs<VcFile[]> = reactive([])

// 自定义上传地址
export const useModelAction = (): (file: VcFile) => Promise<boolean> =>
{
	return (file: VcFile) =>
	{
		console.log('upload file =>', file)
		return Promise.resolve(true)
	}
}

// 自定义模型文件上传函数
export interface UploadParams
{
	onSuccess: (...args: any[]) => any;  // 上传完成回调
	onError: (...args: any[]) => any;    // 上传失败回调
	onProgress: (...args: any[]) => any; // 正在上传回调
	file: VcFile;
}

export const useModelUpload = (): (u: UploadParams) => any =>
{
	return (u: UploadParams) =>
	{
		const { onSuccess, onError, onProgress, file } = u
		setTimeout(() =>
		{
			if (!_fileList.length)
			{
				_fileList.push(file)
				onSuccess(null, file)
			}
			else
			{
				message.error({ content: '每次只能上传一个文件！', key: 'one_file' });
				onError()
			}
		})
	}
};

// 确认上传
export const useUploadConfirm = (): () => Promise<void> =>
{
	return async () => { }
}

// 自定义模型文件删除函数
export const useModelRemove = (): (file: VcFile) => Promise<boolean> =>
{
	return (file: VcFile) =>
	{
		for (let i = 0; i < _fileList.length; i++)
		{
			if (_fileList[i].uid === file.uid)
			{
				_fileList.splice(i, 1)
				console.log(_fileList)
			}
		}
		console.log('remove file =>', file)
		return Promise.resolve(true)
	}
}