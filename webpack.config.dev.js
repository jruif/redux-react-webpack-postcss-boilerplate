var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		'eventsource-polyfill', // necessary for hot reloading with IE
		'webpack-hot-middleware/client',
		'./app/js/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'js/bundle.js',
		chunkFilename: 'js/[id].bundle.js',
		publicPath: '/static/',
		pathinfo: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			DEBUG: true
		}),
		new ExtractTextPlugin('css/app.css', {
			allChunks: false
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
