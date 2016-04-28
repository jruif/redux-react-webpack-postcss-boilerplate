/**
 * ajax.js
 *
 * @Author: jruif
 * @Date: 16/3/25 下午12:43
 *
 *
 * @example
 *
 * ajax('/user', {
 *      method:'GET',
 *      body:function(state){
 *          // state = { info:{ name:'Jruif', age: 25} }
 *          return merge({}, state.info);
 *      }
 * },rs => {
 *      //处理返回的数据
 * });
 *
 */
import merge from 'lodash/merge';
import Ajax from '../utils/Ajax';
import errorHandle from './errorHandle';

export function ajax(url,opt,callback){
    return (dispatch, getState) => {
        if(typeof opt.body === 'function'){
            opt.body = opt.body.call(null, merge({},getState()));
        }

        //业务控制
        let cb = rs =>{
            let status = {
                'true' : () => callback( rs ),
                'false' : () => Promise.reject(rs),
                'timeout' : () => {
                    rs.msg = '登录超时，请点击确定完成登陆';
                    return Promise.reject(rs);
                }
            };
            return status[rs.status] !== void 0 ? status[rs.status]() : status.false();
        };

        return Ajax(url,opt,cb)
            .catch( error =>{
                if( error.status === 'timeout' ){
                    //需要登陆
                    error.onOk = () => {
                        location.href = error.datas;
                    }
                }else{
                    error.status = 'alert';
                    if(error.stack){
                        error.msg = error.stack;
                    }
                }
                dispatch(errorHandle(error));
            });
    }
}

export function get(url,opt,callback){
    return ajax(url, extend({},opt,{method:"GET"}), callback);
}
export function post(url,opt,callback){
    return ajax(url, extend({},opt,{method:"POST"}), callback);
}