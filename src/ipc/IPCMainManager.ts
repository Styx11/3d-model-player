import { ipcMain } from 'electron'
import { IPCMainChannelName } from './IPCChannelName'
import ModelManager from '@main/model/ModelManager'
import { ModelFileState } from '@views/interface/Types'

export default class IPCMainManager
{
	private static _manager: IPCMainManager

	constructor()
	{
	}

	public static getInstance(): IPCMainManager
	{
		if (!this._manager)
		{
			this._manager = new IPCMainManager()
		}
		return this._manager
	}

	/**
	 * Initialize IPCMainManager, here we are registering all events
	 */
	public init()
	{
		// register all IPC Main Channel
		for (let key of Object.keys(IPCMainChannelName))
		{
			const channel = IPCMainChannelName[key];

			ipcMain.handle(channel, this.handleChannelEvent.bind(this, channel));
		}
	}

	/**
	 * Handler for the channel listener. Here for better management, we use this same handler
	 * for all events, and then distribute out based on event type.
	 * 
	 * @param channel - the channel name used to determine actual behavior
	 * @param event - the event type
	 * @param args - args passed along to handler 
	 */
	private async handleChannelEvent(channel: string, event: Event, ...args)
	{
		switch (channel)
		{
			case (IPCMainChannelName.TEST_MAIN_CHANNEL):
				return await this.handleTestChannel(event, ...args)
			case (IPCMainChannelName.INIT_RENDERER_STORE):
				return await this.handleInitStore(event, ...args)
			case (IPCMainChannelName.FIND_MODEL_FILE):
				return await this.handleFindModel(event, ...args)
			case (IPCMainChannelName.UPLOAD_MODEL_FILE):
				return await this.handleUploadModel(event, ...args)
			case (IPCMainChannelName.REMOVE_MODEL_FILE):
				return await this.handleRemoveModel(event, ...args)
			default:
				break
		}
	}

	/**
	 * 以下均为 handle 监听函数
	 */
	private async handleTestChannel(event: Event, ...args)
	{
		console.log('hi this is test main channel', ...args)
		await new Promise(resolve => setTimeout(() => resolve(true), 2000))
		return 'answer'
	}

	// 初始化 vuex
	private async handleInitStore(event: Event, ...args): Promise<Array<ModelFileState>>
	{
		return await ModelManager.getInstance().findAll()
	}

	/**
	 * 查找模型文件
	 * 
	 * @param event - the event type
	 * @param args - uid: string
	 */
	private async handleFindModel(event: Event, ...args): Promise<ModelFileState>
	{
		if (!args[0]) return
		return await ModelManager.getInstance().find(args[0] as string)
	}

	/**
	 * 上传模型文件
	 * 
	 * @param event - the event type
	 * @param args - modelFile: ModelFileState
	 */
	private async handleUploadModel(event: Event, ...args): Promise<ModelFileState>
	{
		if (!args[0]) return
		return await ModelManager.getInstance().insert(args[0] as ModelFileState)
	}

	/**
	 * 删除模型文件
	 * 
	 * @param event - the event type
	 * @param args - uid: string
	 */
	private async handleRemoveModel(event: Event, ...args)
	{
		if (!args[0]) return
		return await ModelManager.getInstance().remove(args[0] as string)
	}
}