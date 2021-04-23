import { BrowserWindow } from 'electron'
import { Paths } from '../constants/path'

const path = require('path')

export default class WindowManager
{
	private static _manager: WindowManager = null

	public static getInstance()
	{
		if (!this._manager)
		{
			this._manager = new WindowManager()
		}
		return this._manager
	}

	public createMainWindow()
	{
		const win = new BrowserWindow({
			minWidth: 1280,
			minHeight: 800,
			center: true,
			show: false,
			titleBarStyle: 'hiddenInset',
			backgroundColor: '#1d3449',
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				devTools: true,
				webSecurity: false,
			},
		})

		win.loadURL('http://localhost:8080')
		win.maximize()

		return win
	}

	public createLoadingWindow()
	{
		const win = new BrowserWindow({
			minWidth: 1280,
			minHeight: 800,
			center: true,
			titleBarStyle: 'hiddenInset',
			backgroundColor: '#1d3449',
			webPreferences: {
				webSecurity: false,
			},
		})

		win.loadURL(`file://${path.resolve(Paths.PROJECT_ROOT, 'src/static/LoadingScreen/zh-cn.html')}`)
		win.maximize()

		return win
	}
}