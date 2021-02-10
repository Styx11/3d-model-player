const { resolve } = require('./utils');
const merge = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const baseConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseConfig, {
	mode: "production",
	devtool: '#source-map',
	output: {
		path: resolve('dist/'),
		filename: 'static/js/[name].[chunkhash].js',
		chunkFilename: 'static/js/[id].[chunkhash].js',
		publicPath: process.env.PUBLIC_URL,
	},
	optimization: {

		// runtimeChunks 相当于 CommonsChunkPlugins 中的 'runtime'
		// 这将 runtime chunk 抽离出来公用
		runtimeChunk: {
			name: 'runtime'
		},

		splitChunks: {
			cacheGroups: {
				manifest: {
					name: "manifest",
					minChunks: Infinity,
				},
				app: {
					name: "app",
					minChunks: 3,
				}
			}
		},
		minimize: true,

		// 更改为路径命名规则
		namedModules: true,
		namedChunks: true,

		// 相当于 webpack.DefinePlugins 中设置 'process.env.NODE_ENV: JSON.stringifiy(...)'
		// issue: cross-env 设置环境变量不起作用
		nodeEnv: 'production',
	},
	plugins: [
		// 自动注入 html 文件依赖
		new HtmlWebpackPlugin({
			title: '日志客户端',
			filename: resolve('dist/index.html'),
			template: resolve('public/template.html'),
			inject: true,
		}),
		// copy custom static assets
		new CopyWebpackPlugin({
			patterns: [
				{
					from: resolve('public'),
					to: resolve('dist'),
					globOptions: {
						ignore: ['*.html']
					}
				}
			]
		}),
		new Dotenv({
			path: resolve('env/production:test.env'),
		}),
	]
});
