/**
 * Created by jruif on 16/3/19.
 *
 */

require('es6-promise').polyfill();
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, Redirect, IndexRedirect, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './configureStore';
import App from './components/App.jsx';
import Overview from './components/Overview.jsx';
import NotFoundView from './components/NotFoundView.jsx';


let store = configureStore({});
render(
	<Provider store={store}>
    	<Router history={ syncHistoryWithStore(hashHistory, store) }>
      		<Route path="/" component={App}>
				<IndexRedirect to="/overview" />
                <Route path="overview" component={Overview}/>
                <Route path="/404" component={NotFoundView} />
                <Redirect from="*" to="/404" />
			</Route>
      	</Router>
    </Provider>,
    document.getElementById('root')
);