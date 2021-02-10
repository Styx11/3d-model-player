'use strict'
process.env.NODE_ENV = 'development'

const path = require('path');
const URI = require('uri-js');
const { resolve } = require('./utils');
const merge = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const baseConfig = require('./webpack.base.conf');
const ESLintPlugin = require('eslint-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = 'localhost';
const PORT = 8080;

module.exports = merge(baseConfig, {
	mode: 'development',
	// cheap-module-eval-source-map is faster for development
	devtool: 'cheap-module-eval-source-map',

	devServer: {
		clientLogLevel: 'warning',
		historyApiFallback: {
			rewrites: [
				{ from: /.*/, to: path.posix.join('/', 'index.html') },
			],
		},
		hot: false,
		contentBase: false, // since we use CopyWebpackPlugin.
		compress: true,
		host: process.env.HOST || HOST,
		port: (process.env.PORT && Number(process.env.PORT)) || PORT,
		overlay: { warnings: false, errors: true },
		publicPath: '/',
		proxy: {},
		open: true,
		// quiet:c true, // necessary for FriendlyErrorsPlugin
		watchOptions: {
			poll: false,
		},
		proxy: {
			'*': {
				bypass: (req, res, proxyOptions) =>
				{
					const reqObj = URI.parse(req.url)
					if (reqObj.path.endsWith('/auth') && req.query && req.query.code)
					{
						req.headers.accept = 'text/html';
					}
					return req.url
				},
			},
		},
		headers: {
			"Access-Control-Allow-Origin": "http://test.account.meshkit.cn",
			"Access-Control-Allow-Credentials": "true",
			"Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
			"Access-Control-Allow-Headers": "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Request-Headers, Content-Type, Accept, x-mesh-access-token",
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: '日志客户端',
			publicPath: './',
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

		new ESLintPlugin({
			files: '../src',
		}),

		new Dotenv({
			path: resolve('env/development.env'),
		}),
	]
})