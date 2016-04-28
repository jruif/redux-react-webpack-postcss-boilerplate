/**
 * Overview.jsx
 *
 * @Author: jruif
 * @Date: 16/3/29 下午4:17
 */

import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../css/modules/Overview.scss';

@CSSModules(styles, {
    allowMultiple: true
})
class Overview extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let { }=this.props;
        return (
            <div>Overview
            </div>
        )
    }
}
Overview.propTypes = {

};

export default Overview;