const path = require('path');
//const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

var DIST_DIR = path.resolve(__dirname, "./public");
var SRC_DIR = path.resolve(__dirname, "./src");

module.exports = {   
    entry: SRC_DIR + '/app/index.js',
    module: {
		rules : [
			{
				test: /.jsx?$/,
				include: SRC_DIR,
				//exclude: /(node_modules)/,
				use: [{
					loader: "babel-loader",
					query: {
						presets: ["react", "es2015", "stage-3"],
						plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
          				compact: false
					}
				}]
			},
			{
				test: /\.css/,
				use: ['style-loader', 'css-loader']
			}, 
			{
		        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
		        // include: SRC_DIR,
		        use: ['url-loader']
		    },
		    {
			  test: /\.html/,
			  include: SRC_DIR,
			  use: ['html-loader']
			},
			{
				test: /\.svg$/,
				use: ['svg-inline-loader']
			},
		]
	},
    plugins: [
		//new CleanWebpackPlugin(['dist/*.*']),
		new CaseSensitivePathsPlugin(),
        new HtmlWebpackPlugin({
            title: 'Production'
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			"window.jQuery": "jquery", 
			moment: 'moment'
		}),
		new Dotenv({
			//path: './.env',
			// safe: true, load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
			systemvars: true
		})
	],
	resolve: {
		alias: {
			app: path.resolve(__dirname, 'src/app'),
			reduxFiles: path.resolve(__dirname, 'src/app/redux'),
			misc: path.resolve(__dirname, 'src/app/misc'),
			extras: path.resolve(__dirname, 'src/app/extras'),
			components: path.resolve(__dirname, 'src/app/components'),
			views: path.resolve(__dirname, 'src/app/views'),
			actions: path.resolve(__dirname, 'src/app/actions'),
			assets: path.resolve(__dirname, 'src/app/assets'),
			sytles: path.resolve(__dirname, 'src/app/styles'),
			'react-native$': 'react-native-web',
		}
	},
	devServer: {
		historyApiFallback: true,
	},
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		dns: 'empty'
	},
    output : {
		path: DIST_DIR + '/app',
		filename: 'bundle.js', 
		publicPath: '/app'
	},
};