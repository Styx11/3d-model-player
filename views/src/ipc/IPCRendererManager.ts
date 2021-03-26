const { ipcRenderer } = window.require('electron')
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
}