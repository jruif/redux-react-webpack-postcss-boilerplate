/**
 * SlideBar.jsx
 *
 * @Author: jruif
 * @Date: 16/3/24 下午3:40
 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from '../../css/modules/SlideBar.scss';

@CSSModules(styles, {
    allowMultiple: true
})
class SlideBar extends Component {
    constructor(props, context) {
        super(props, context);
        this.menu = [
            {
                link: '/overview',
                name: '项目总览',
                other: ['/overview', '/create', '/match', '/modification']
            }
        ];
    }

    render() {
        let { location }=this.props;
        let pathname = location.pathname;
        return (
            <aside styleName="menu">
                <ul>
                    {
                        this.menu.map((elm, index) => (
                            <li styleName={ elm.other.filter((e) => pathname.indexOf(e) === 0).length && 'active'}
                                key={`slideBar-${index}`}>
                                <Link to={elm.link}>{elm.name}</Link>
                            </li>
                        ))
                    }
                </ul>
                <p styleName="copy">@Jruif版权所有<br/>&copy; 20XX-{new Date().getFullYear()}</p>
            </aside>
        )
    }
}
SlideBar.propTypes = {
    location: PropTypes.object.isRequired
};

export default SlideBar;