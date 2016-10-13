/**
 * Created by jruif on 16/3/19.
 */

'use strict';
var gulp = require('gulp');
var fs = require('fs');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});
var webpackStream = require('webpack-stream');

// 对 Javascript & css 的合并压缩等
module.exports = function (options) {
    var webpackConfig = options.webpackConfig();
    gulp.task('assets', ['clean'], function (cb) {
        var webpackStats = null;
        var hash = null;
        return gulp.src(options.src + '/js/index.jsx')
            .pipe(webpackStream(webpackConfig, null, function (err, stats) {
                // Show your modules tree
                // http://webpack.github.io/analyse/#modules
                webpackStats = stats.toJson({
                    chunks: true,
                    modules: true,
                    chunkModules: true,
                    reasons: true,
                    cached: true,
                    cachedAssets: true
                });

                webpackStats && webpackStats.assets.forEach(item => {
                    //hash = hash || item.name.replace(/(.+\.)(\w+)\.(js|css)$/g,'$2');
                    $.util.log(
                        $.util.colors.cyan( format(item.size)),
                        $.util.colors.yellow('\t' + item.name)
                    );
                });
                $.util.log($.util.colors.cyan( 'hash: '),$.util.colors.red('\t' + webpackStats.hash));
                $.util.log($.util.colors.cyan( 'time: '),$.util.colors.red('\t' + webpackStats.time + 'ms'));
                $.util.log($.util.colors.cyan( 'publicPath: '),$.util.colors.red(webpackStats.publicPath));
                return fs.writeFile('./analyse.log', JSON.stringify(webpackStats), null, 2);
            }))
            .on('error', options.errorHandler('webpack'))
            .pipe(gulp.dest(options.dist));
    });

    function format(number, flag) {
        flag = flag || 0;
        if (number < 1024){
            return `${number} ${['', 'K', 'M'][flag]}b`;
        }
        return format(Math.ceil(number / 10.24) / 100, flag + 1);
    }
};
