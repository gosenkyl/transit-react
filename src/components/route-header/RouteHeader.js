import React from 'react';

import './RouteHeader.css';

export default function RouteHeader(props){
    return (
        <div className="route-header">
            <div className="route-header-title">Route</div>
            <div className="route-header-short-name">{props.route.routeShortName}</div>
            <div className="route-header-long-name">{props.route.routeLongName}</div>
        </div>
    )
}