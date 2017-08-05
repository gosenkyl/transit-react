import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

import Header from './header/Header';
import Home from './home/Home';
import Map from './map/Map';
import Routes from './routes/Routes';
import Stops from './stops/Stops';
import Times from './times/Times';

import registerServiceWorker from './registerServiceWorker';

import './index.css';

ReactDOM.render(
    <Router>
        <div className="app">
            <Header />

            <div className="content">
                <Route exact path="/" component={Home}/>
                <Route exact path="/routes" component={Routes}/>
                <Route exact path="/routes/:routeId" component={Stops}/>
                <Route exact path="/routes/:routeId/stops/:stopId" component={Times}/>
                <Route exact path="/routes/:routeId/map" component={Map}/>
            </div>

            <div className="footer">Footer</div>
        </div>
    </Router>
    , document.getElementById('root'));
registerServiceWorker();
