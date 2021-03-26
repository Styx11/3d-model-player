import { ipcMain } from 'electron'
import { IPCMainChannelName, IPCRendererChannelName } from './IPCChannelName'

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
				break
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
}