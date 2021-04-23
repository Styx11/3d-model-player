import { app, BrowserWindow } from 'electron'
import IPCMainManager from '../ipc/IPCMainManager'
import ModelManager from '../model/ModelManager'
import WindowManager from './WindowManager'

export default class Application
{
	private static _app: Application = null

	private _win: BrowserWindow = null

	public static getInstance()
	{
		if (!this._app)
		{
			this._app = new Application()
		}
		return this._app
	}

	private initWin()
	{
		const loadingWin = WindowManager.getInstance().createLoadingWindow()
		this._win = WindowManager.getInstance().createMainWindow()

		this._win.on('ready-to-show', () =>
		{
			setTimeout(() =>
			{
				loadingWin.destroy()
				this._win.show()
			}, 1500)
		})
	}

	public async initApplication()
	{
		await app.whenReady()
		await ModelManager.getInstance().init()
		IPCMainManager.getInstance().init()

		this.initWin()

		app.on('window-all-closed', () =>
		{
			if (process.platform !== 'darwin')
			{
				app.quit()
			}
		})

		app.on('activate', () =>
		{
			if (BrowserWindow.getAllWindows().length === 0)
			{
				this.initWin()
			}
		})
	}
}