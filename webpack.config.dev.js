var path = require('path');
var webpack = require('webpack');
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: 4 });
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function makeExtract(){
	var loader = 'css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]';
	var param = [].slice.call(arguments).join('!');
	return ExtractTextPlugin.extract('style', loader + (param[0] === '!' ? param : ('!' + param) ) );
	// return ['style',loader,...[].slice.call(arguments)].join('!');
}
module.exports = {
	devtool: 'eval-source-map',
	entry: [
		'babel-polyfill',
		'eventsource-polyfill', // necessary for hot reloading with IE
		'webpack-hot-middleware/client',
		'./app/js/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'js/bundle.js',
		chunkFilename: 'js/[id].bundle.js',
		publicPath: '/dist/',
		pathinfo: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			DEBUG: true
		}),
		new ExtractTextPlugin('css/app.css', {
			allChunks: true
		}),
		//new HappyPack({
		//    id: 'scss',
		//    threadPool: happyThreadPool
		//})
	],
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				loaders: ['babel'],
				include: path.join(__dirname, 'app/js'),
				exclude: path.join(__dirname, 'app/js/plugins')
			}, {
				test: /\.css$/,
				loader: makeExtract(),
				include: path.join(__dirname, 'app/css')
			}, {
				test: /\.scss$/,
				loader: makeExtract('postcss','sass'),
				include: path.join(__dirname, 'app/css')
			}, {
				test: /\.png|jpe?g|gif$/,
				loader: 'url-loader?limit=2000&name=img/[hash].[ext]',
				include: path.join(__dirname, 'app/img')
			},{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&minetype=application/font-woff",
				include: path.join(__dirname, 'app/css')
			},{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader",
				include: path.join(__dirname, 'app/css')
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		alias: {
			js: path.join(__dirname, "app/js")
		}
	},
	postcss: function() {
		return [
			require('postcss-original-path'),
			require('postcss-assets')({
				loadPaths: ['./app/img/'],
				relative: true
			}),
			require('autoprefixer')({
				browsers: ['> 1%', 'last 2 version', 'Android >= 4.0']
			}),
			require('postcss-sprites').default({
				stylesheetPath: './app/css',
				spritePath: './app/img/sprite.png',
				filterBy: function(img) {
					return /\/sp\-/.test(img.url) ? Promise.resolve(): Promise.reject() ;
				},
				groupBy: function(img) {
					var match = img.url.match(/\/(sp\-[^\/]+)\//);
					return match ? Promise.resolve(match[1]): Promise.reject();
				},
				hooks: {
					onUpdateRule: function(rule, token, image) {
						// Use built-in logic for background-image & background-position
						updateRule(rule, token, image);

						['width', 'height'].forEach(function(prop) {
							rule.insertAfter(rule.last, postcss.decl({
								prop: prop,
								value: image.coords[prop] + 'px'
							}));
						});
					},
					onSaveSpritesheet: function(opts, groups) {
						// We assume that the groups is not an empty array
						var filenameChunks = groups.slice().push('png');
						return path.join(opts.spritePath, filenameChunks.join('.'));
					}
				}
			})
		];
	}
};
