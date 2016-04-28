/**
 * AppList.jsx
 *
 * @Author: jruif
 * @Date: 16/3/24 下午3:51
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import CSSModules from 'react-css-modules';
import styles from '../../css/modules/AppList.scss';

import * as AppListAction from '../action/AppListAction';

@CSSModules(styles, {
    allowMultiple: true
})
class AppList extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let { testPromise } = this.props.actions;
        return (
            <div>
                content,得到饿的呃的<br/>啊实打实大
                <button className="button tiny" onClick={ () => testPromise() }>测试Promise</button>
            </div>
        )
    }
}

// Api: https://facebook.github.io/react/docs/reusable-components.html
AppList.propTypes = {
    applist: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    routerPush: PropTypes.func
};

export default connect(
    (state) => ({ applist: state.applyList }),
    (dispatch) => ({
        actions: bindActionCreators(AppListAction, dispatch),
        routerPush: bindActionCreators(push, dispatch)
    })
)(AppList);
