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
    gulp.task('assets',['clean'], function (cb) {
        return gulp.src( options.src + '/js/index.jsx')
            .pipe(webpackStream(webpackConfig))
            .on('error', options.errorHandler('webpack'))
            .pipe(gulp.dest(options.dist));
    });
};
