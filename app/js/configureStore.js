/*
 * @Author: jruif
 * @Date:   2016-03-21 11:30:12
 * @Last Modified by:   jruif
 * @Last Modified time: 2016-03-21 11:31:55
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from './reducer';
import thunkMiddleware from 'redux-thunk';

export default function configureStore(initialState) {
    if (module.hot) {
        var store = compose(
            applyMiddleware(
                routerMiddleware(hashHistory),
                thunkMiddleware
            )
        )(createStore)(rootReducer, initialState);
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducer', () => {
            const nextReducer = require('./reducer');
            store.replaceReducer(nextReducer);
        });
    }
    return store;
}
