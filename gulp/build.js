/**
 * Created by jruif on 16/3/19.
 */

'use strict';
var gulp = require('gulp');
var fs = require('fs');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});

module.exports = function (options) {
	// 生产环境
    gulp.task('build:dist',['assets','ftp']);
    // 测试环境
    gulp.task('build:dev',['assets'], () => {
        gulp.start('f2e');
    });
};
