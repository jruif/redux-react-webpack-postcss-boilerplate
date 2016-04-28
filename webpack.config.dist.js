var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// Init configs
var publishConfig = global.publish || {
        hash:true
    };
var revision = publishConfig.revision ? publishConfig.revision + '/' : '';
var publicPath = publishConfig.assetPath || '/static/';
var hash = publishConfig.hash ? '.[hash]' : '';
var packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));


module.exports = {
	devtool: 'source-map-hidden',
	entry: {
		app: './app/js/index',
		vendor: Object.keys(packageJson.dependencies)
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: revision + 'js/bundle.[hash].js',
		chunkFilename: revision + 'js/[hash].bundle.js',
		publicPath: publicPath
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor'],
			filename: 'js/[name].js',
			minChunks: Infinity
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		}),
		new ExtractTextPlugin(revision + 'css/app.css', {
			allChunks: false
		}),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.NoErrorsPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
	      	template: './app/index.html'
	    })
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
				loader: ExtractTextPlugin.extract('style', 'css'),
				include: path.join(__dirname, 'app/css')
			}, {
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss!sass'),
				include: path.join(__dirname, 'app/css')
			}, {
				test: /\.png|jpe?g|gif$/,
				loader: 'url-loader?limit=2000&name=img/[hash].[ext]',
				include: path.join(__dirname, 'app/img')
			}, {
				test: /\.html/,
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
					return /\/sp\-/.test(img.url);
				},
				groupBy: function(img) {
					var match = img.url.match(/\/(sp\-[^\/]+)\//);
					return match ? match[1] : null;
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
