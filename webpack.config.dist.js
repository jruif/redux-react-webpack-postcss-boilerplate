var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// Init configs
var publishConfig = global.publish || {
		hash: true,
		assetPath: `http://img5.cache.netease.com/utf8/${packageJson.name}/`,
		revision: null
	};
var revision = publishConfig.revision ? publishConfig.revision + '/' : '';
var publicPath = publishConfig.assetPath || '/static/';
var hash = publishConfig.hash ? '.[hash]' : '';	// hash: 所有文件用同一个, chunkhash 每个文件一个hash

module.exports = {
	devtool: false,
	entry: {
		app: './app/js/index.jsx',
		vendor: Object.keys(packageJson.dependencies)
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: revision + 'js/bundle' + hash + '.js',
		chunkFilename: revision + 'js/[hash].bundle.js',
		publicPath: publicPath
	},
	plugins: [
		new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor'],
			filename: 'js/[name]' + hash + '.js',
			minChunks: Infinity
		}),
		new ExtractTextPlugin(revision + 'css/app'+ hash +'.css', {
			allChunks: false
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production') // JSON.stringify ensures it's a quoted quoted string
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'app/index.tmp.html'
		})
	],
	module: {
		loaders: [
			{
				test: /\.jsx?/i,
				loaders: ['babel'],
				include: path.join(__dirname, 'app/js')
			}, {
				test: /\.css$/i,
				loader: ExtractTextPlugin.extract('style', 'css'),
				include: path.join(__dirname, 'app/css')
			}, {
				test: /\.scss$/i,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss!sass'),
				include: path.join(__dirname, 'app/css')
			}, {
				test: /\.png|jpe?g|gif$/i,
				loader: 'url-loader?limit=2000&name=img/[hash].[ext]',
				include: path.join(__dirname, 'app/img')
			}, {
				test: /\.html$/i,
				loader: 'html-loader'
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
				stylesheetPath: './src/css',
				spritePath: './src/img/sprite.png',
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
						require('postcss-sprites').updateRule(rule, token, image);

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
