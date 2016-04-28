/**
 * NotFoundView.jsx
 *
 * @Author: jruif
 * @Date: 16/3/24 下午3:50
 */

import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
//import styles from '../../css/modules/NotFoundView.scss';
//
//@CSSModules(styles, {
//    allowMultiple: true
//})
class NotFoundView extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div>404</div>
        )
    }
}
//NotFoundView.propTypes = {};

export default NotFoundView;