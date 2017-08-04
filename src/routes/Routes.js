import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Routes.css';
import '../common.css';

import { getRoutes } from '../services/Routes';

class Routes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      routes: []
    };
  }

  componentDidMount(){
    getRoutes().then(routes => {
      this.setState({routes: routes});
    });
  }

  render() {
    const routes = this.state.routes;

    return (
      <div className="routes">
        {
          routes.map((route) =>
            <Route key={route.id} route={route}/>
          )
        }
      </div>
    );
  }
}

function Route(props){
  return (
      <Link to={`/routes/${props.route.id}`} className="route">
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
