/**
 * Created by jruif on 16/3/19.
 */

'use strict';
var gulp = require('gulp');
var exec = require('child_process').exec;
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});

// 上传：把 ./dist 下的东西上传至 服务器（ftp）
module.exports = function (options) {
    var uploadConfig = options.uploadConfig();
    gulp.task('upload', function (cb) {
    	var path = options.project.name + '/';
        var connect = uploadConfig.ftp;
        gulp.src(options.dist+'**/*')
            .pipe(connect.dest('/' + path));
        return cb();
    });

    gulp.task('f2e', function(cb) {
        var f2e = uploadConfig.f2e;
        var projectName = options.profile.name;
        exec( `scp -r -P ${f2e.port} dist/* ${f2e.name}@${f2e.host}:/home/${f2e.name}/${projectName}`, function (err) {
            if (err){
                throw new $.util.PluginError("clean", err);
            }
            $.util.log('Done!');
            return cb();
        });
    });
};
