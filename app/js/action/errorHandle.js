/**
 * errorHandle.js
 *
 * @Author: jruif
 * @Date: 16/4/20 下午4:19
 */

//import { ERROR } from './actionType';
import createActionCreator from '../utils/createActionCreator';

export default function (error) {
    return {
        type: 'ERROR',
        ...error
    }
}