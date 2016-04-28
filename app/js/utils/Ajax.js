/**
 * Ajax.js
 *
 * @Author: jruif
 * @Date: 16/3/25 下午12:24
 */
import extend from 'lodash/extend';
import merge from 'lodash/merge';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';

function transformRequest(obj) {
    let str = [];
    obj && Object.keys(obj).forEach((key) => {
        str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    });
    return str.join('&');
}

function stringifyJSON(obj) {
    let _obj = obj;
    Object.keys(_obj).forEach((key) => {
        let param = _obj[key];
        if (isObject(param) || isArray(param)) {
            param = JSON.stringify(param);
            _obj[key] = param;
        }
    });
    return JSON.stringify(_obj);
}

export default function (url,opt,callback) {
    let DEFAULT = {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    let options = merge({}, DEFAULT, opt);

    if (options.method === 'GET'){
        options.body = extend({}, options.body, { _: Date.now() });
        url = `${url}?${transformRequest(options.body)}`;
        options.body = void(0);
    }else if(options.headers['Content-Type'] === 'application/x-www-form-urlencoded'){
        options.body = transformRequest(options.body);
    }else if(options.headers['Content-Type'] === 'application/json'){
        options.body = stringifyJSON(options.body);
    }

    return fetch(url,options)
        .then((response) => {
            if (response.status >= 200 && response.status < 300 || response.status === 302) {
                return response.json();
            } else {
                return Promise.reject({
                    status: false,
                    msg: '网络错误'
                });
            }
        })
        .then(callback && callback.bind(this) || function (rs) {return rs;})
        .catch((fail) => Promise.reject(fail) );
}
