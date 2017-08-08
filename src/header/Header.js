import React, { Component } from 'react';
import './Header.css';
import { getAgency } from '../services/Agency';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            agency: {agencyName: ""}
        };
    }

    componentDidMount() {
        getAgency().then(agency => {
            this.setState({agency: agency});
        });
    }

    render() {
        const agency = this.state.agency;

        return (
            <div className="header">
                {
                    agency != null && agency.agencyName
                }
            </div>
        );
    }
}

export default Home;
