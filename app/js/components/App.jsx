/*
*  App.js
*
* */
import React,{ Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from '../../css/main.scss';

import Header from './Header.jsx'
import SlideBar from './SlideBar.jsx'

import * as InfoAction from '../action/info'

@CSSModules(styles, {
    allowMultiple: true
})
class App extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { location, appInfo, children } = this.props;

        return (
            <div styleName="root">
                <Header info={appInfo}/>
                <section styleName="main">
                    <SlideBar location={ location }/>
                    <section styleName="content" onblur="">
                        {children}
                    </section>
                </section>
            </div>
        );
    }
}

App.PropTypes = {
    route: PropTypes.object.isRequired,
    appInfo: PropTypes.object,
    actions: PropTypes.object
};

function mapStateToProps(state) {
    return {
        route: state.routing,
        appInfo: state.appInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(InfoAction, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)