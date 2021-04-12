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
		contentBase: path.join('../dist/'),
		compress: true,
		historyApiFallback: true,
		hot: true,
		port: 8080
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: '三维模型播放器',
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