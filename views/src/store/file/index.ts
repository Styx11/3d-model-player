// 存放所有上传的模型文件信息
import { toRaw } from 'vue'
import { Module } from 'vuex'
import { RootState } from '../index'
import { ModelFileState } from '../../interface/Types'

export interface ModelFile
{
	fileList: Array<ModelFileState>
}

export enum ModelFileMutation
{
	INIT_FILE = 'modelFile/initFile',
	UPLOAD_FILE = 'modelFile/uploadFile',
	REMOVE_FILE = 'modelFile/removeFile',
	UPDATE_FILE = 'modelFile/updateFile',
}

export const file: Module<ModelFile, RootState> = {
	namespaced: true,
	state: {
		fileList: []
	},
	mutations: {
		initFile(state: ModelFile, payload: Array<ModelFileState>)
		{
			state.fileList.push(...payload)
			console.log('init fileList =>', toRaw(state.fileList))
		},
		uploadFile(state: ModelFile, payload: ModelFileState)
		{
			state.fileList.push(payload)
			console.log('state fileList =>', toRaw(state.fileList))
		},
		removeFile(state: ModelFile, uid: string)
		{
			const matchIndex = state.fileList.findIndex(f => f.uid === uid)

			if (matchIndex > -1)
			{
				state.fileList.splice(matchIndex, 1)
			}
		},
		updateFile(state: ModelFile, payload: ModelFileState)
		{
			const matchIndex = state.fileList.findIndex(f => f.uid === payload.uid)

			if (matchIndex > -1)
			{
				state.fileList.splice(matchIndex, 1, payload)
				console.log('update fileList =>', payload)
			}
		},
	}
}