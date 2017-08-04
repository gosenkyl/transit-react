import axios from 'axios';

export function getTimes(routeId, stopId, date) {
    return new Promise((resolve, reject) => {
        return axios.get(`http://localhost:8081/api/stoptimes?routeId=${routeId}&stopId=${stopId}&date=${date}`).then(response => {
            resolve(response.data);
        });
    });
}