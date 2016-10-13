/**
 * Created by jruif on 16/3/23.
 *
 */
import createReducer from '../utils/createReducer';
import { updateArray } from '../utils/reduceHandle';
import merge from 'lodash/merge';
import isNumber from 'lodash/isNumber';
const INIT = 'INIT';
const ADD = 'ADD';
const UPDATE = 'UPDATE';
const REMOVE = 'REMOVE';
const info = {
    name: 'jruif'
};

export default appInfo = createReducer(info, {
    [INIT]: (state, action) => state,
    [ADD]: (state, action) => {
        if (state[action.form] && action.index === void 0) {
            return {
                [action.form]: {
                    [action.name]: action.value
                }
            }
        }
        if (isNumber(action.index)) {
            return {
                [action.form]: updateArray(
                    state[action.form].slice(),
                    action.index,
                    {[action.name]: action.value}
                )
            }
        }
    },
    [UPDATE]: (state, action) => {
        // action(form,name,value,index)
        if (state[action.form] && action.index === void 0) {
            return {
                [action.form]: {
                    [action.name]: action.value
                }
            }
        }
        if (isNumber(action.index)) {
            return {
                [action.form]: updateArray(
                    state[action.form].slice(),
                    action.index,
                    {[action.name]: action.value}
                )
            }
        }
    },
    [REMOVE]: (state, action) => state
});
