'use strict'

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.resolve = dir =>
{
	return path.join(__dirname, '..', dir)
}

exports.cssLoaders = function (options)
{
	options = options || {}

	const cssLoader = {
		loader: 'css-loader',
		options: {
			sourceMap: options.sourceMap,
			// even without css module
			// this is necessary when using postcss
			modules: {
				compileType: 'module',
				mode: 'local',
				auto: true,
				exportGlobals: true,
				localIdentName: '[path][name]---[local]---[hash:base64:5]',
			},
			importLoaders: 1,
		}
	}

	// generate loader string to be used with extract text plugin
	function generateLoaders(loader, loaderOptions)
	{
		const loaders = [cssLoader]

		if (loader)
		{
			loaders.push({
				loader: loader + '-loader',
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.sourceMap
				})
			})
		}

		// Extract CSS when with MiniCssExtractPlugin
		// (which is the case during production build)
		return ['vue-style-loader', MiniCssExtractPlugin.loader].concat(loaders)
	}

	// https://vue-loader.vuejs.org/en/configurations/extract-css.html
	return {
		css: generateLoaders(),
		less: generateLoaders('less'),
		sass: generateLoaders('sass', { indentedSyntax: true }),
		scss: generateLoaders('sass'),
		stylus: generateLoaders('stylus'),
		styl: generateLoaders('stylus')
	}
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options)
{
	const output = []
	const loaders = exports.cssLoaders(options)

	for (const extension in loaders)
	{
		const loader = loaders[extension]
		output.push({
			test: new RegExp('\\.' + extension + '$'),
			use: loader
		})
	}

	return output
}
