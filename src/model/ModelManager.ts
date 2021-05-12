const { writeFileSync } = require('fs')
const fs = require('fs/promises')
const rimraf = require('rimraf')
const path = require('path')

import AdmZip from 'adm-zip'
import { Paths } from '@main/constants/path'
import { ModelFileState } from '@views/interface/Types'

export default class ModelManager
{
	private static _manager: ModelManager

	private _folderPath: string

	constructor()
	{
	}

	public async init()
	{
		this._folderPath = path.resolve(Paths.PROJECT_ROOT, 'dist/models')
		try
		{
			return await fs.access(this._folderPath)
		}
		catch (e)
		{
			return await fs.mkdir(this._folderPath, { recursive: true })
		}
	}

	public static getInstance()
	{
		if (!this._manager)
		{
			this._manager = new ModelManager()
		}
		return this._manager
	}

	/**
	 * 查找模型文件
	 * 
	 * @param uid - string 模型文件 uid
	 */
	public async find(uid: string): Promise<ModelFileState>
	{
		if (typeof uid !== 'string' || !uid) return

		const descPath = path.resolve(this._folderPath, `${uid}`, 'desc.json')
		const modelJSON = await fs.readFile(descPath)
		return JSON.parse(modelJSON) as ModelFileState
	}

	/**
	 * 查找有模型文件，初始化 vuex
	 */
	public async findAll(): Promise<Array<ModelFileState>>
	{
		const files = await fs.readdir(this._folderPath)
		const models = await Promise.all<ModelFileState>(files.map(async (uid: string) =>
		{
			const descPath = path.resolve(this._folderPath, `${uid}`, 'desc.json')
			const modelJSON = await fs.readFile(descPath)
			return JSON.parse(modelJSON) as ModelFileState
		}))
		return models
	}

	/**
	 * 上传模型文件
	 * 
	 * @param model - ModelFileState 模型文件 uid
	 */
	public async insert(model: ModelFileState): Promise<ModelFileState>
	{
		if (!model) return
		console.log('model inserted =>', model)

		const modelFolderPath = path.resolve(this._folderPath, `${model.uid}`)

		const modelDescPath = path.resolve(modelFolderPath, 'desc.json')
		const extname = path.extname(model.path)
		if (extname === '.zip')
		{
			const file = new AdmZip(model.path)
			await file.extractAllToAsync(modelFolderPath)

			await fs.writeFile(modelDescPath, JSON.stringify(Object.assign(model, {
				path: `/models/${model.uid}/Production.json`,
				previewPath: `/models/${model.uid}/preview.png`,
			})))
		}
		else
		{
			// const modelPath = path.resolve(modelFolderPath, `${model.name}`)
			// // 以 uid 创建文件夹
			// await fs.mkdir(modelFolderPath)

			// // 拷贝源文件
			// await fs.copyFile(model.path, modelPath)

			// // 创建描述文件
			// await fs.writeFile(modelDescPath, JSON.stringify(Object.assign(model, { path: modelPath })))
		}

		return Object.assign({}, model)
	}

	/**
	 * 删除模型文件
	 * 
	 * @param uid - string 模型文件 uid
	 */
	public async remove(uid: string): Promise<void>
	{
		if (typeof uid !== 'string' || !uid) return

		const modelFolderPath = path.resolve(this._folderPath, `${uid}`)
		return new Promise((resolve, reject) =>
		{
			rimraf(modelFolderPath, { disableGlob: true }, err =>
			{
				if (err) reject(err)
				console.log('model removed =>', uid)
				resolve()
			})
		})
	}

	// 更新描述文件信息，只要用于存储测量工具数据
	public updateDesc(model: ModelFileState)
	{
		if (!model) return

		const modelFolderPath = path.resolve(this._folderPath, `${model.uid}`)
		const modelDescPath = path.resolve(modelFolderPath, 'desc.json')

		try
		{
			writeFileSync(modelDescPath, JSON.stringify(model))
		}
		catch (e)
		{
			console.error(e)
		}
	}
}