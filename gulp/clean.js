/**
 * Created by jruif on 16/3/19.
 *
 */
var gulp = require('gulp');
var gutil = require('gulp-util');
var rimraf = require('rimraf');

module.exports = function(options){
    gulp.task('clean', function(cb) {
        rimraf('dist', function(err) {
            if (err) {
                throw new gutil.PluginError("clean", err);
            }
            cb();
        });
    });
};