'use strict';

module.exports = {
	mode: 'development',
	// Don't attempt to continue if there are any errors.
	bail: true,
	devtool: 'source-map',
	// @see https://webpack.js.org/concepts/output/
	entry: {
		options: './src',
		contents: './src/content-script.js',
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				// @see https://github.com/babel/babel-loader
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
};
