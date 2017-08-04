import React, { Component } from 'react';
import './Header.css';
import { getAgency } from '../services/Agency';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            agency: {agencyName: "Loading..."}
        };
    }

    componentDidMount(){
        getAgency().then(agency => {
            this.setState({agency: agency});
        });
    }

    render() {
        return (
            <div className="header">
                {this.state.agency.agencyName}
            </div>
        );
    }
}

export default Home;
