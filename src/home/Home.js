import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Home.css';
import '../common.css';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="home">
                <div className="selection">
                    Make a selection
                </div>

                <div className="options">
                    <Link className="square" to="/routes">Times</Link>
                    <Link className="square" to={{ pathname: "/routes", query: {isMapRoute: true} }}>Map</Link>
                    <Link className="square" to="/about">About</Link>
                </div>
            </div>
        );
    }
}

export default Home;
