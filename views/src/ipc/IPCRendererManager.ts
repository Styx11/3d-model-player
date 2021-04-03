const { ipcRenderer } = window.require('electron')
import { ModelFileState } from '@/interface/Types';
import { IPCMainChannelName } from '@main/ipc/IPCChannelName'

export default class IPCRendererManager
{
	private static _manager: IPCRendererManager;

	constructor()
	{
	}

	public static getInstance()
	{
		if (!this._manager)
		{
			this._manager = new IPCRendererManager()
		}
		return this._manager
	}

	/**
	 * Initialize IPCMainManager, here we are registering all events
	 */
	public init()
	{

	}

	/**
	 * 以下均为 invoke 触发函数
	 */
	public async invokeTestMainChannel(...args)
	{
		const answer = await ipcRenderer.invoke(IPCMainChannelName.TEST_MAIN_CHANNEL, ...args)
		console.log(answer)
	}

	// 初始化 vuex
	public async invokeInitStore(): Promise<Array<ModelFileState>>
	{
		return await ipcRenderer.invoke(IPCMainChannelName.INIT_RENDERER_STORE)
	}

	// 查找模型文件
	public async invokeFindModel(uid: string): Promise<ModelFileState>
	{
		return await ipcRenderer.invoke(IPCMainChannelName.FIND_MODEL_FILE, uid)
	}

	// 上传模型文件
	public async invokeUploadModel(model: ModelFileState): Promise<ModelFileState>
	{
		return await ipcRenderer.invoke(IPCMainChannelName.UPLOAD_MODEL_FILE, model)
	}

	// 删除模型文件
	public async invokeRemoveModel(uid: string)
	{
		return await ipcRenderer.invoke(IPCMainChannelName.REMOVE_MODEL_FILE, uid)
	}
}