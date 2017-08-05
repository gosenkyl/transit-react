/* global google */
import React, { Component } from 'react';
import './Map.css';

import moment from 'moment';

import { getRouteById } from '../services/Routes';
import { getStops } from '../services/Stops';
import { getTimes } from '../services/Times';

import RouteHeader from '../components/route-header/RouteHeader';

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
        selectedStopTimes: null
    };

    this.onMarkerClicked = this.onMarkerClicked.bind(this);
    this.onCloseSelectedStop = this.onCloseSelectedStop.bind(this);
  }

  componentDidMount(){
      getRouteById(this.state.routeId).then(route => {
          this.setState({route: route});
      });

      getStops(this.state.routeId).then(routeToStops => {
          let markers = this.state.markers;

          routeToStops.forEach(routeToStop => {
              let stop = routeToStop.stop;
              markers.push(this.createMarker(stop, stop.stopLat, stop.stopLon, routeToStop.id, 2));
          });

          this.setState({markers: markers});
      });

      Geolocation.getCurrentPosition((err, position) => {
          if(err == null && position != null && position.coords != null) {
              let coords = position.coords;
              let lat = coords.latitude;
              let lon = coords.longitude;
              //let accuracy = coords.accuracy;

              let markers = this.state.markers;

              markers.push(this.createMarker({id: null}, lat, lon, "Me", 2, "my-location"));

              this.setState({markers: markers});
          }
      });
  }

  createMarker(stop, lat, lon, key, animation, className){
      return {
        stop: stop,
        defaultPosition: new google.maps.LatLng(lat, lon),
        key: key,
        animation: animation,
        className: className || ""
      };
  }

    onMarkerClicked(marker){
        console.log(marker.stop);
        this.setState({selectedStop: marker.stop});

        //let date = moment().add(2, 'd').format("YYYY-MM-DD");
        let date = moment().format("YYYY-MM-DD");

        getTimes(this.state.routeId, marker.stop.id, date).then(times => {
            this.setState({selectedStopTimes: times});
        });
    }

    onCloseSelectedStop(){
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

              <div className="selected-stop">
                  {selectedStop &&
                    <div className="selected-stop-map">
                        <div className="selected-stop-description">{selectedStop.stopDesc}</div>
                        <StreetViewPanorama
                            containerElement={
                                <div style={{ width: `500px`, height: `300px` }} />
                            }
                            defaultPosition={{lat: selectedStop.stopLat, lng: selectedStop.stopLon}}
                          />
                        <div className="close-button" onClick={this.onCloseSelectedStop}>Close</div>
                    </div>
                  }
                  {selectedStopTimes &&
                      <div className="selected-stop-times">
                          <div className="selected-stop-times-header">Stop Times</div>
                          {
                              selectedStopTimes.length === 0 ? <div>NO TIMES TODAY YO</div> :
                              selectedStopTimes.map((time, index) =>
                                <div className="selected-stop-time" key={index}>{moment(time.arrivalTime, "H:mm:ss").format("h:mm a")}</div>
                              )
                          }
                      </div>
                  }
              </div>
          </div>
      </div>
    );
  }
}

const TransitMap = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={13}
        defaultCenter={{ lat: 40.098966, lng: -83.105230 }}
        >
      {props.markers.map((marker, index) => (
          <InfoBox {...marker}
              options={{ closeBoxURL: ``, enableEventPropagation: true }}
          >
              <i className={`material-icons marker ${marker.className} ${props.selectedStopId === marker.stop.id ? "selected" : ""}`}
                 onClick={() => props.onMarkerClicked(marker)}>
                  place
              </i>
          </InfoBox>
      ))}
    </GoogleMap>
));

export default Map;
