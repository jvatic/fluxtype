var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');

var extractCSS = new ExtractTextPlugin({filename: '[name].[contenthash].css'});

module.exports = {
	entry: {
		'main': ['./src/index.js', './src/index.sass'],
		'test': ['./test/index.js', './vendor/qunit.css']
	},
	output: {
		filename: '[name].[hash].js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'FluxType',
			template: 'src/index.ejs',
			chunks: ['main'],
			inject: false
		}),
		new HtmlWebpackPlugin({
			title: 'FluxType Test',
			template: 'test/index.ejs',
			filename: 'test.html',
			chunks: ['test'],
			inject: false
		}),
		extractCSS,
		new ManifestPlugin({})
	],
	devtool: 'source-map',
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				include: [
					path.resolve(__dirname, 'src')
				],
				test: /\.js$/,
				query: {
					presets: ['es2015'],
					plugins: ['transform-runtime']
				}
			},
			{
				test: /\.(png)$/,
				include: [
					path.resolve(__dirname, 'src')
				],
				loader: 'file-loader?name=[name].[ext]'
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				include: [
					path.resolve(__dirname, 'vendor')
				],
				loader: 'file-loader?name=[name].[ext]'
			},
			{
				loader: extractCSS.extract({ use: [
					{ loader: 'css-loader', options: { sourceMap: true } }
				]}),
				include: [
					path.resolve(__dirname, 'vendor')
				],
				test: /\.css$/
			},
			{
				loader: extractCSS.extract({ use: [
					{ loader: 'css-loader', options: { sourceMap: true } },
					{ loader: 'sass-loader', options: { sourceMap: true } }
				]}),
				include: [
					path.resolve(__dirname, 'src')
				],
				test: /\.sass/
			},
		]
	}
};
