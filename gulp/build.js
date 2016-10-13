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
    gulp.task('build:dist',['assets'],function(){
        gulp.start('ftp'); //todo: start已被移除,官方推荐 https://www.npmjs.com/package/lazypipe
    });
    // f2e 测试环境
    gulp.task('build:f2e',['assets'],function(){
        gulp.start('f2e'); //todo: start已被移除
    });
};
