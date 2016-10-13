/**
 * createReducer.js
 *
 * @Author: jruif
 * @Date: 16/5/16 上午11:22
 *
 * @example
 * createReducer(initState, {
 *   [actionType.xxx](state,action){
 *       return state;
 *   }
 * });
 */

import merge from 'lodash/merge';

export function createReducer(initialState, handlers){
    return (state = initialState, action) => {
        if(handlers.hasOwnProperty(action.type)){
            return merge({},state,handlers[action.type](state, action))
        }
        return state;
    }
}

// 如果使用immutable.js 使用下面的createReducer
//function createReducer(initState = Map({}), handlers) {
//    return (state = initState, action) => {
//        if (handlers.hasOwnProperty(action.type)) {
//
//            return handlers[action.type](state, action)
//        }
//        return state;
//    }
//}

/*
 * state 结构:
 * initState = {
 *   total: 23,
 *   data: {
 *       name:'',
 *       types:[1,2,3],
 *       obj:{
 *           isTrue: true,
 *           hello: world,
 *           array: [1,2,3]
 *       }
 *   }
 *   states: [1,2,3],
 *   prop: [
 *       { name: hua1, age:10},
 *       { name: hua2, age:20},
 *       { name: hua3, age:30}
 *   ]
 * }
 *
 * 可能会有的需求:
 * 1. update('total', 102)
 * 2. update('data name','jruif')
 * 3. update('data obj', {isTrue: false}) //==> { isTrue: false, hello: world }
 * 4. update('data obj array', 4, 1) //==> array: [1,4,3]
 * 5. update('data type','10', 2) // ==> [1,2,'10']
 * 6. update('states', 102, 2 ) // ==> [1,2,102]
 * 7. update('prop', { age: 102 }, 2) // ==> prop第二个元素中的age变为102
 * 8. update('prop', { age: 1 }, 'all') // ==> prop中所有元素变为1
 * 9. update('prop', 1, 1, 1) // ==> 删除prop中1个下标为1的元素
 * 10. 有count参数的调用,等同于数组的splice,支持负数
 * 11. update('prop', () => <i>HaHa</i>, 2) // ==> prop:[..., () => <i>HaHa</i>, ...]
 * 11.1 update('prop', { name: 'E'}, 'all') //不影响增删,影响改
 * 12 update('prop', { age: 78 }, [1,3])
 * 13 update('prop', [], 1, 0) //删除下标为1的值
 *
 * actionCreator 可设计为:
 * key : 用空格/逗号分割的字符串 或 数组
 * value: 任何值
 * index: number / 'all' / 数组
 * count: 0 ( 前提index必须为数字,表示插入,index表示插入的下标) / 任何整数n (从index开始删除n个,包括index)
 * var update = createActionCreator(UPDATE_FB_List, 'key', 'value', 'index', 'count')
 *
 *
 * reducer.js :
 * [actionType.update]: updateReducerCreator()
 *
 * */
import { Map, fromJS } from 'immutable';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';

export function initReducerCreator() {
    return (state, action) => {
        let key = isArray(action.key) ? action.key :
            isString(action.key) ? action.key.split(/[\s/,]+/g) : action.key;
        return state.setIn(key, fromJS(action.value));
    }
}

/*
 * 删除数组中的某几条数据:
 *   update(['data'],[],1,3)  value一定要使用空数组,1是删除数的下标,3是删除的个数
 *
 * */

export function updateReducerCreator(filter = () => false) {
    // 必须引入immutable的 Map
    return (state, action)=> {
        let iterates = isArray(action.key) ? action.key :
            isString(action.key) ? action.key.split(/[\s/,]+/g) : action.key;
        if (action.index === +action.index) {
            if (action.count === void 0) {
                // 处理 4-7 的情况
                return state.updateIn(iterates.concat(action.index), value => Map.isMap(value) ?
                    value.mergeDeep(action.value) : filter(value) ?
                    value : action.value
                )
            } else if (action.count === +action.count) {
                // value 必然为 List, 处理 9/10 的情况
                return state.updateIn(iterates,
                    value =>
                        value.splice(action.index, action.count,
                            ...(!isArray(action.value) ? [action.value] : action.value))
                )
            }
        } else if (isArray(action.index)) {
            if (action.count === void 0) { // 处理 12 的情况
                return state.updateIn(iterates,
                    value =>
                        value.map((item, i) => action.index.includes(i) && (
                                Map.isMap(item) ?
                                    value.get(i).mergeDeep(action.value) :
                                    value.set(i, fromJS(action.value))
                            ) || item
                        )
                )
            } else if (action.count === +action.count) { //批量删除,action.count == 1
                return state.updateIn(iterates,
                    value => value.filter((item, i) => !action.index.includes(i))
                )
            }
        } else if (action.index === void 0) {
            // 处理 1-3 的情况
            return state.updateIn(iterates, value => {
                if (Map.isMap(value)) {
                    return value.mergeDeep(action.value);
                }
                if (filter(value)) {
                    return value;
                }
                return action.value;
            })
        } else if (action.index === 'all') {
            // 处理 8 的情况
            return state.updateIn(iterates, value =>
                value.map(item => Map.isMap(item) ?
                    item.mergeDeep(action.value) : filter(value) ?
                    value : action.value
                )
            )
        }
        return state;
    }
}