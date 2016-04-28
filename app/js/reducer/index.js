/*
* @Author: jruif
* @Date:   2016-03-23 10:27:57
* @Last Modified by:   jruif
* @Last Modified time: 2016-03-23 10:29:16
*
* Reducer
*/

'use strict';

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import appInfo from './appInfo'
import applyList from './applyList'

export default combineReducers({
    routing:routerReducer,
    appInfo,
    applyList
});