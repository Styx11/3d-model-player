import Application from './application'
import { Paths } from './constants/path'

const isDev = process.argv.some(a => a === '--dev')

if (isDev)
{
	process.env.NODE_ENV = 'development'

	// soft reset, it will only refresh webContents
	require('electron-reload')(Paths.PROJECT_ROOT, {})
}

try
{
	Application.getInstance().initApplication()
}
catch (err)
{
	console.error(err.message)
}