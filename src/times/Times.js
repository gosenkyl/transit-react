import React, { Component } from 'react';
import './Times.css';
import moment from 'moment';

import { getTimes } from '../services/Times';

class Times extends Component {

    constructor(props) {
        super(props);

        this.state = {
            routeId: props.match.params.routeId,
            stopId: props.match.params.stopId,
            times: null
        };
    }

    componentDidMount() {
        let date = moment().format("YYYY-MM-DD");

        console.log(date);

        getTimes(this.state.routeId, this.state.stopId, date).then(times => {
            this.setState({times: times});
        });
    }

    render() {
        const times = this.state.times;

        return (
            <div className="times">
                {
                    times != null && times.map(time =>
                        <Time key={time.id} time={time}/>
                    )
                }
            </div>
        );
    }
}

function Time(props) {
    let timeFormatted = moment(props.time.arrivalTime, "H:mm:ss").format("h:mm a");

    return (
        <div className="time">
            {timeFormatted}
        </div>
    )
}

export default Times;