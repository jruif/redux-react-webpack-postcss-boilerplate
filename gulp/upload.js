/**
 * Created by jruif on 16/3/19.
 */

'use strict';
var gulp = require('gulp');
var exec = require('child_process').exec;
var ftp = require('vinyl-ftp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});

// 上传：把 ./dist 下的东西上传至 服务器（ftp）
module.exports = function (options) {
    var t = new Date,
        time = '' + t.getFullYear() +
            (t.getMonth() < 9 ? '0' : '') + (t.getMonth() + 1) +
            (t.getDate() < 10 ? '0' : '') + t.getDate() +
            (t.getHours() < 10 ? '0' : '') + t.getHours() +
            (t.getMinutes() < 10 ? '0' : '') + t.getMinutes();

    //var uploadConfig = options.uploadConfig();

    // 暂时不使用 c.m.163.com 的ftp部署html
    gulp.task('ftp',/*['c.m'],*/ function (cb) {
        var name = options.project.name;
        var uploadConfig = options.uploadConfig('ftp');
        return gulp.src(options.dist+'**/*.{js,css}')
            .pipe(uploadConfig.dest(`/utf8/${options.project.name}/`));
    });
    // 正式环境:html
    gulp.task('c.m', function(){
        var uploadConfig = options.uploadConfig('c.m');
        return gulp.src(options.dist+'/index.html')
            .pipe(uploadConfig.dest(`/${options.project.name}/`));
    });

    gulp.task('f2e',['t.c.m'], function () {
        var f2e = options.uploadConfig('f2e');
        var projectName = options.project.name;
        return exec(`scp -r -P ${f2e.port} dist/* ${f2e.name}@${f2e.host}:/home/${f2e.name}/${projectName}`, function (err) {
            if (err) {
                throw new $.util.PluginError("clean", err);
            }
            $.util.log('Done!');
        });
    });
    // 测试环境:html
    gulp.task('t.c.m', function(){
        var uploadConfig = options.uploadConfig('t.c.m');
        return gulp.src(options.dist+'/index.html')
            .pipe(uploadConfig.dest(`/jruif/${options.project.name}/`));
    });
};
