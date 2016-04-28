/**
 * Header.jsx
 *
 * @Author: jruif
 * @Date: 16/3/24 下午3:45
 */

import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../css/modules/Header.scss';

@CSSModules(styles, {
    allowMultiple: true
})
class Header extends Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        let { info } = this.props;
        return (
            <header>
                <h2 styleName="logo">J.ruiF</h2>
                <ul styleName="system">
                    <li>{info.name}</li>
                    <li><a href="#">退出</a></li>
                </ul>
            </header>
        );
    }
}
Header.propTypes = {
    info: PropTypes.object.isRequired
};

export default Header;