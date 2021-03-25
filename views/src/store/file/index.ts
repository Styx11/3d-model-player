// 存放所有上传的模型文件信息

import { Module } from 'vuex'
import { RootState } from '../index'
import { ModelFileState } from '../../interface/Types'

export interface ModelFile
{
	fileList: Array<ModelFileState>
}

export enum ModelFileMutation
{
	UPLOAD_FILE = 'modelFile/uploadFile',
	REMOVE_FILE = 'modelFile/removeFile',
}

export const file: Module<ModelFile, RootState> = {
	namespaced: true,
	state: {
		fileList: []
	},
	mutations: {
		uploadFile(state: ModelFile, payload: ModelFileState)
		{
			state.fileList.push(payload)
			console.log('state fileList =>', state.fileList)
		},
		removeFile(state: ModelFile, uid: string)
		{
			for (let i = 0; i < state.fileList.length; i++)
			{
				if (state.fileList[i].uid === uid)
				{
					state.fileList.splice(i, 1)
				}
			}
		}
	}
}