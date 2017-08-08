import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Routes.css';
import '../common.css';

import { getRoutes } from '../services/Routes';

class Routes extends Component {

    constructor(props) {
        super(props);

        let isMapRoute = props.location.query && props.location.query.isMapRoute === true;

        this.state = {
            routes: [],
            isMapRoute: isMapRoute
        };
    }

    componentDidMount() {
        getRoutes().then(routes => {
            this.setState({routes: routes});
        });
    }

    render() {
        const routes = this.state.routes;
        const isMapRoute = this.state.isMapRoute;

        return (
            <div className="routes">
                {
                    routes.map((route) =>
                        <Route key={route.id} route={route} isMapRoute={isMapRoute}/>
                    )
                }
            </div>
        );
    }
}

function Route(props) {
    const routeTo = props.isMapRoute ? "/map" : "";

    return (
        <Link to={`/routes/${props.route.id}${routeTo}`} className="route">
            <div className="short-name">
                {props.route.routeShortName}
            </div>
            <div className="long-name">
                {props.route.routeLongName}
            </div>
        </Link>
    )
}

export default Routes;
