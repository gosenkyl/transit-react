import React, { Component } from 'react';
import './Map.css';

import { getRouteById } from '../services/Routes';
import RouteHeader from '../components/route-header/RouteHeader';

import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Geolocation from 'geolocation';

class Map extends Component {

  constructor(props) {
    super(props);

    this.state = {
        routeId: props.match.params.routeId,
        route: null,
        markers: []
    };
  }

  componentDidMount(){
      getRouteById(this.state.routeId).then(route => {
          this.setState({route: route});
      });

      let markers = [
          this.createMarker(40.096992, -83.091667, "Sawmill", 2)
      ];

      let userLocation = Geolocation.getCurrentPosition((err, position) => {
          if(err == null && position != null && position.coords != null) {
              let coords = position.coords;
              let lat = coords.latitude;
              let lon = coords.longitude;
              let accuracy = coords.accuracy;

              markers.push(this.createMarker(lat, lon, "Me", 2));
          }

          this.setState({markers: markers});
      });
  }

  createMarker(lat, lon, key, animation){
      return {
        position: {
            lat: lat,
            lng: lon
        },
        key: key,
        animation: animation
      };
  }

  render() {
    const route = this.state.route;

    return (
      <div className="maps">

          {route != null && <RouteHeader key={route.id} route={route}/>}

          <div className="map">
              <div className="map-container">

                    <TransitMap
                        containerElement={<div style={{ height: `100%` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        markers={this.state.markers}
                        />

              </div>
          </div>
      </div>
    );
  }
}

const TransitMap = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 40.098966, lng: -83.105230 }}
        >
      {props.markers.map((marker, index) => (
          <Marker
              {...marker}
              />
      ))}
    </GoogleMap>
));

export default Map;
