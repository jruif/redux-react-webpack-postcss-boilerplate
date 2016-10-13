'use strict';
var gulp = require('gulp');
var wrench = require('wrench');
var ftp = require('vinyl-ftp');
var fs = require('fs');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});

function readFile(path){
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

var options = {
    html: './app/index.html',
    src: './app/',
    dist: './dist/',
    project: readFile('./package.json'),
    webpackConfig: function () {
        var name = this.project.name;
        if( $.util.env._.indexOf('build:dist') > -1 ){
            // 正式环境:  默认使用imgX.cache服务器
            global.publish = {
                hash: true,
                assetPath: 'http://pre.xxx.com/'+name+'/',
                revision: null
            }
        }else if( $.util.env._.indexOf('build:f2e') > -1 ){
            // 测试环境
            global.publish = {
                hash: true,
                assetPath: 'http://dev.xxx.com/'+ name +'/',
                revision: null
            }
        }
        // 设置 环境变量: babel编译使用
        // 设置使用的webpack配置文件
        if ($.util.env._.indexOf('assets') > -1 ||
            $.util.env._.indexOf('build:dist') > -1 ||
            $.util.env._.indexOf('build:f2e') > -1){
            process.env.NODE_ENV = 'production';
            return require('./webpack.config.dist');
        }
        process.env.NODE_ENV = 'development';
        return require('./webpack.config.dev');
    },
    uploadConfig: function (name) {
        var config = readFile(__dirname + '/.custom.config');
        var ftpConfig = config[name];
        if(ftpConfig.type === 'ftp'){
            return ftp.create(_.extend({
                host: '',
                port: '',
                user: '',
                password: '',
                parallel: 5,
                log: $.util.log
            }, ftpConfig, {
                secureOptions: ftpConfig.secure ? {
                    requestCert: true,  //请求证书
                    rejectUnauthorized: false   //拒绝未经授权
                } : {
                    requestCert: false,  //请求证书
                    rejectUnauthorized: false   //拒绝未经授权
                }
            }));
        }
        return ftpConfig;
    },
    errorHandler: function (title) {
        return function (err) {
            $.util.log($.util.colors.red('[' + title + ']'), err.toString());
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
    gulp.start('build:dist');
});
