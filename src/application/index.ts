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

	// 初始化窗口
	private initWin()
	{
		// 预加载窗口
		const loadingWin = WindowManager.getInstance().createLoadingWindow()

		// 主应用窗口
		this._win = WindowManager.getInstance().createMainWindow()

		// 主窗口准备完毕后销毁加载窗口，显示主窗口
		this._win.on('ready-to-show', () =>
		{
			setTimeout(() =>
			{
				loadingWin.destroy()
				this._win.show()
			}, 1500)
		})
	}

	// 初始化应用
	public async initApplication()
	{
		// 等待应用准备
		await app.whenReady()

		// 初始化模型文件管理器，其中包括扫描本地文件
		await ModelManager.getInstance().init()

		// 初始化 ipc-main 管理器
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