'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var ftp = require('vinyl-ftp');
var fs = require('fs');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});

function readFile(path){
    return JSON.parse(fs.readFileSync(path));
}

var options = {
    html: './app/index.html',
    src: './app/',
    dist: './dist/',
    project: readFile('./package.json'),
    webpackConfig: function () {
        // 设置 环境变量: babel编译使用
        // 设置使用的webpack配置文件
        if (gutil.env._.indexOf('build:dist') > -1){
            process.env.NODE_ENV = 'production';
            return require('./webpack.config.dist');
        }
        process.env.NODE_ENV = 'development';
        return require('./webpack.config.dev');
    },
    uploadConfig: function () {
        var config = readFile(__dirname + '/.custom.config');
        var obj = {};
        Object.keys(config).map( elm => {
            if(elm.type === 'ftp'){
                config[elm] = ftp.create(_.extend({
                    host: '',
                    port: '',
                    user: '',
                    password: '',
                    parallel: 5,
                    log: $.util.log,
                    secure: true
                }, config.ftp, {
                    secureOptions: config.ftp.secure ? {
                        requestCert: true,  //请求证书
                        rejectUnauthorized: false   //拒绝未经授权
                    } : {
                        requestCert: false,  //请求证书
                        rejectUnauthorized: false   //拒绝未经授权
                    }
                }));
            }
        });
        return config;
    },
    errorHandler: function (title) {
        return function (err) {
            gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
            this.emit('end');
        };
    }
};

wrench.readdirSyncRecursive('./gulp').filter(function (file) {
    return (/\.(js|coffee)$/i).test(file);
}).map(function (file) {
    require('./gulp/' + file)(options);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build:dev');
});
