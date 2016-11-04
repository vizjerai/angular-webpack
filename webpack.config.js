"use strict";

let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');


let ENV = process.env.npm_lifecycle_event;
let isTest = ENV === 'test' || ENV === 'test-watch';
let isProd = ENV === 'build';


module.exports = (() => {
	let config = {};

	config.entry = isTest ? {} : {
		app: './src/app/app.js'
	};

	config.output = isTest ? {} : {
		path: __dirname + '/dist',

		publicPath: isProd ? '/' : 'http://localhost:8080/',

		// Only adds hash in build env
		filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

		// Only adds hash in build env
		chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
	};

	if (isTest) {
		config.devtool = 'inline-source-map';
	} else if (isProd) {
		config.devtool = 'source-map';
	} else {
		config.devtool = 'eval-source-map';
	}

	config.module = {
		preLoaders: [],
		loaders: [
			// {
			// 	test: /\.scss$/,
			// 	loader: 'style!css!sass'
			// },
			{
				// JS Loader
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/
			},
			{
				// CSS Loader
				test: /\.css$/,
				loader: isTest ? 'null' : ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader')
			},
			{
				// Asset Loader
				test: /\.(png|jpg|svg)$/,
				loader: 'file'
			},
			{
				// HTML Loader
				test: /\.html$/,
				loader: 'raw'
			}
		]

	};

	// Plugins
	config.plugins = [];


	if (!isTest) {
		config.plugins.push(
			new HtmlWebpackPlugin({
				template: './src/public/index.html',
				inject: 'body'
			}),

			new ExtractTextPlugin('[name].[hash].css', { disable: !isProd })
		);
	}

	return config;
})();
