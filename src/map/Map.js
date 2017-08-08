/* global google */
import React, { Component } from 'react';
import './Map.css';

import moment from 'moment';

import { getRouteById } from '../services/Routes';
import { getStops } from '../services/Stops';
import { getTimes } from '../services/Times';

import RouteHeader from '../components/route-header/RouteHeader';
import LoadingWidget from '../components/loading-widget/LoadingWidget';

import { withGoogleMap, GoogleMap, StreetViewPanorama } from "react-google-maps";
import InfoBox from 'react-google-maps/lib/addons/InfoBox';
import Geolocation from 'geolocation';

class Map extends Component {

    constructor(props) {
        super(props);

        this.state = {
            routeId: props.match.params.routeId,
            route: null,
            markers: [],
            selectedStop: null,
            isSelectedLoading: false,
            selectedStopTimes: null
        };

        this.onMarkerClicked = this.onMarkerClicked.bind(this);
        this.onCloseSelectedStop = this.onCloseSelectedStop.bind(this);
    }

    async componentDidMount() {
        let route = await getRouteById(this.state.routeId);
        let routeToStops = await getStops(this.state.routeId);

        let markers = [];

        routeToStops.forEach(routeToStop => {
            let stop = routeToStop.stop;
            markers.push(this.createMarker(stop, stop.stopLat, stop.stopLon, routeToStop.id, 2));
        });

        let userPosition = await this.getUserPosition();

        let coords = userPosition.coords;
        let lat = coords.latitude;
        let lon = coords.longitude;
        //let accuracy = coords.accuracy;

        markers.push(this.createMarker({id: null}, lat, lon, "Me", 2, "my-location"));

        this.setState({route: route, markers: markers});
    }

    getUserPosition(){
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition((err, position) => {
                let result = null;
                if (err == null && position != null && position.coords != null) {
                    result = position;
                }
                resolve(result);
                return result;
            });
        });
    }

    createMarker(stop, lat, lon, key, animation, className) {
        return {
            stop: stop,
            defaultPosition: new google.maps.LatLng(lat, lon),
            key: key,
            animation: animation,
            className: className || ""
        };
    }

    async onMarkerClicked(marker) {
        this.setState({isSelectedLoading: true});

        //let date = moment().add(2, 'd').format("YYYY-MM-DD");
        let date = moment().format("YYYY-MM-DD");

        let times = await getTimes(this.state.routeId, marker.stop.id, date);

        this.setState({selectedStop: marker.stop, isSelectedLoading: false, selectedStopTimes: times});
    }

    onCloseSelectedStop() {
        this.setState({selectedStop: null, selectedStopTimes: null});
    }

    render() {
        const route = this.state.route;
        const selectedStop = this.state.selectedStop;

        const selectedStopId = selectedStop != null ? selectedStop.id : null;
        const selectedStopTimes = this.state.selectedStopTimes;

        return (
            <div className="maps">

                {route && <RouteHeader key={route.id} route={route}/>}

                <div className="map">
                    <div className="map-container">

                        <TransitMap
                            containerElement={<div style={{ height: `100%` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            markers={this.state.markers}
                            onMarkerClicked={this.onMarkerClicked}
                            selectedStopId={selectedStopId}
                        />

                    </div>

                    {this.state.isSelectedLoading ? <div className="loading-widget-container"> <LoadingWidget /> </div>
                        : this.state.selectedStop ? <SelectedStop stop={selectedStop} times={selectedStopTimes} onCloseSelectedStop={this.onCloseSelectedStop} />
                        : ""
                    }

                </div>
            </div>
        );
    }
}

function SelectedStop(props){
    return (
        <div className="selected-stop">
            <div className="selected-stop-map">

                <div className="selected-stop-description">{props.stop.stopDesc}</div>

                <StreetViewPanorama
                    containerElement={<div style={{ width: `500px`, height: `300px` }} />}
                    defaultPosition={{lat: props.stop.stopLat, lng: props.stop.stopLon}}
                />

                <div className="close-button" onClick={props.onCloseSelectedStop}>Close</div>
            </div>

            <div className="selected-stop-times">
                <div className="selected-stop-times-header">Stop Times</div>
                {
                    props.times == null || props.times.length === 0 ? <div>NO TIMES TODAY YO</div> :
                        props.times.map((time, index) =>
                            <div className="selected-stop-time" key={index}>
                                {moment(time.arrivalTime, "H:mm:ss").format("h:mm a")}
                            </div>
                        )
                }
            </div>
        </div>
    );
}

const TransitMap = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={13}
        defaultCenter={{ lat: 40.098966, lng: -83.105230 }}>
        {props.markers.map((marker, index) => (
            <InfoBox {...marker} options={{ closeBoxURL: ``, enableEventPropagation: true }}>
                <i className={`material-icons marker ${marker.className} ${props.selectedStopId === marker.stop.id ? "selected" : ""}`}
                   onClick={() => props.onMarkerClicked(marker)}>
                    place
                </i>
            </InfoBox>
        ))}
    </GoogleMap>
));

export default Map;
