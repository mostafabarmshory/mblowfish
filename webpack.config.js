const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');



const sourcePath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

module.exports = {
	entry: {
		app: sourcePath + '/scripts/app.js',
	},
	output: {
		filename: '[name].bundle.js',
		path: distPath
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist'
	},
	plugins: [
        /**
         * All files inside webpack's output.path directory will be removed once, but the
         * directory itself will not be. If using webpack 4+'s default configuration,
         * everything under <PROJECT_DIR>/dist/ will be removed.
         * Use cleanOnceBeforeBuildPatterns to override this behavior.
         *
         * During rebuilds, all webpack assets that are not used anymore
         * will be removed automatically.
         *
         * See `Options and Defaults` for information
         */
		new CleanWebpackPlugin({
			// Simulate the removal of files
			//
			// default: false
			dry: true,

			// Write Logs to Console
			// (Always enabled when dry is true)
			//
			// default: false
			verbose: true,

			// Automatically remove all unused webpack assets on rebuild
			//
			// default: true
			cleanStaleWebpackAssets: false,

			// Do not allow removal of current webpack assets
			//
			// default: true
			protectWebpackAssets: false,

			// **WARNING**
			//
			// Notes for the below options:
			//
			// They are unsafe...so test initially with dry: true.
			//
			// Relative to webpack's output.path directory.
			// If outside of webpack's output.path directory,
			//    use full path. path.join(process.cwd(), 'build/**/*')
			//
			// These options extend del's pattern matching API.
			// See https://github.com/sindresorhus/del#patterns
			//    for pattern matching documentation

			// Removes files once prior to Webpack compilation
			//   Not included in rebuilds (watch mode)
			//
			// Use !negative patterns to exclude files
			//
			// default: ['**/*']
			cleanOnceBeforeBuildPatterns: ['**/*', '!static-files*'],
			cleanOnceBeforeBuildPatterns: [], // disables cleanOnceBeforeBuildPatterns

			// Removes files after every build (including watch mode) that match this pattern.
			// Used for files that are not created directly by Webpack.
			//
			// Use !negative patterns to exclude files
			//
			// default: []
			cleanAfterEveryBuildPatterns: ['static*.*', '!static1.js'],

			// Allow clean patterns outside of process.cwd()
			//
			// requires dry option to be explicitly set
			//
			// default: false
			dangerouslyAllowCleanPatternsOutsideProject: true,
		}),
		//		new HtmlWebpackPlugin({
		//			title: 'Webpack Starter App',
		//			template: '/templates/index.html'
		//		})
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	}
};