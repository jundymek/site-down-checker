import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers/RootReducer';
import Login from './components/Login/Login';
import SiteDetail from './components/SiteDetail/SiteDetail';
import Error404 from './components/404/404';

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
    <BrowserRouter>
    <Switch>
        <Route exact path='/' component={App} />
        <Route path='/login' component={Login} />
        <Route exact path='/site/:id/' component={SiteDetail} />
        <Route path='*' component={Error404} />
    </Switch>
    </BrowserRouter>
    </Provider>,
document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
