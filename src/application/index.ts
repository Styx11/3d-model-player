import { app, BrowserWindow } from 'electron'

function createWindow(): BrowserWindow
{
	const win = new BrowserWindow({
		minWidth: 1280,
		minHeight: 800,
		center: true,
		titleBarStyle: 'hiddenInset',
		webPreferences: {
			nodeIntegration: true,
			devTools: true,
		}
	})
	win.loadURL('http://localhost:8080')
	win.maximize()
	if (process.env.NODE_ENV === 'development')
	{
		win.webContents.openDevTools()
	}
	return win
}

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

	public initApplication()
	{
		app.whenReady().then(() =>
		{
			this._win = createWindow()
		})

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
				this._win = createWindow()
			}
		})
	}
}