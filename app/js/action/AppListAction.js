/**
 * AppListAction.js
 *
 * @Author: jruif
 * @Date: 16/3/26 下午5:50
 */

import createActionCreator from '../utils/createActionCreator'

export var rest = createActionCreator('REST');

export function testPromise(){
    return function( dispatch, getState){
        return Promise.resolve('啊哈')
            .then( rs => console.log(rs) );
    }
}