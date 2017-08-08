import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Stops.css';
import '../common.css';

import RouteHeader from '../components/route-header/RouteHeader';

import { getRouteById } from '../services/Routes';
import { getStops } from '../services/Stops';

class Stops extends Component {

    constructor(props) {
        super(props);

        this.state = {
            routeId: props.match.params.routeId,
            route: null,
            stopsDirection0: null,
            stopsDirection1: null
        };
    }

    componentDidMount() {
        getRouteById(this.state.routeId).then(route => {
            this.setState({route: route});
        });

        getStops(this.state.routeId).then(stops => {

            let stopsDirection0 = stops.filter(stop => {
                return stop.directionId === 0;
            });

            stopsDirection0 = stopsDirection0.sort((a, b) => {
                let aStopSeq = a.stopSequence;
                let bStopSeq = b.stopSequence;

                return aStopSeq > bStopSeq ? -1 : aStopSeq < bStopSeq ? 1 : 0;
            });

            let stopsDirection1 = stops.filter(stop => {
                return stop.directionId === 1;
            });

            stopsDirection1 = stopsDirection1.sort((a, b) => {
                let aStopSeq = a.stopSequence;
                let bStopSeq = b.stopSequence;

                return aStopSeq > bStopSeq ? -1 : aStopSeq < bStopSeq ? 1 : 0;
            });

            this.setState({stopsDirection0: stopsDirection0, stopsDirection1: stopsDirection1});
        });
    }

    render() {
        const route = this.state.route;
        const stopsDirection0 = this.state.stopsDirection0;
        const stopsDirection1 = this.state.stopsDirection1;

        return (
            <div className="stops">
                {route != null && <RouteHeader key={route.id} route={route}/>}
                <div className="stops-content">
                    <div>
                        <div className="direction-header">Direction 0</div>
                        {
                            stopsDirection0 == null ? "LOADING..." : stopsDirection0.map(stop =>
                                <Stop key={stop.id} routeId={route.id} stop={stop.stop}/>
                            )
                        }
                    </div>

                    <div>
                        <div className="direction-header">Direction 1</div>
                        {
                            stopsDirection1 == null ? "LOADING..." : stopsDirection1.map(stop =>
                                <Stop key={stop.id} stop={stop.stop}/>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

function Stop(props) {
    return (
        <Link to={`/routes/${props.routeId}/stops/${props.stop.id}`} className="stop">
            {props.stop.stopName}
        </Link>
    )
}

export default Stops;
