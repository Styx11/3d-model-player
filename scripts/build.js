const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const chalk = require("chalk");
const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT_PATH = path.join(__dirname, '..');
const BUILD_PATH = ROOT_PATH + '/bld';
const DIST_PATH = ROOT_PATH + '/dist';
const RELEASE_PATH = ROOT_PATH + "/release-builds";

/**
 * Script for prebuilding the entire electron app
 */
function preBuild()
{
	console.log(`Built bundle will be located at ${chalk.blue(RELEASE_PATH)}\n`)
	if (fs.existsSync(RELEASE_PATH))
	{
		console.log(`${chalk.green('Clearing destination folder for built bundle')} 🗑\n`);
		rimraf.sync(RELEASE_PATH);
	}
	console.log(`${chalk.green('Creating destination folder for built bundle')}\n`);
	mkdirp(RELEASE_PATH);


	console.log(`${chalk.yellow('Removing')} ${chalk.bgRed('bld')} folder and ${chalk.bgRed('dist')} folder... 🔥\n`)
	// clean up `bld` folder
	rimraf.sync(BUILD_PATH);
	rimraf.sync(DIST_PATH);

	console.log(`Compiling the Electron project\n`);
	cp.execSync('ttsc');
	cp.execSync(`cp ${ROOT_PATH}/package.json ${BUILD_PATH}/package.json`)
}

/**
 * Build the webview project for electron use
 */
function buildWebview()
{
	console.log(`Building webview bundle for ${chalk.green("production envrionment")}\n`);
	cp.execSync("cd views && yarn build:prod");

	if (!fs.existsSync("./views/dist"))
	{
		console.log(`${chalk.red("Need to build webviews first")}\n`);
	} else
	{
		console.log(`${chalk.green("Copying webview bundle to current directory")}\n`);
		cp.execSync("cp -r ./views/dist ./dist");
		cp.execSync("cp ./views/package.json ./dist")

		console.log(`Moving img resources to ${chalk.blue("./dist/static/css/static")}\n`);
		// then we need to copy the `img` folder to under `css/static`, as now we are using local resources instead of CDN ones
		if (!fs.existsSync("./dist/static/css/static"))
		{
			mkdirp("./dist/static/css/static");
		}
		// cp.execSync("mv ./dist/static/img ./dist/static/css/static/img");
	}
}

function main()
{
	preBuild()
	buildWebview()
}

main()