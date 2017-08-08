import axios from 'axios';

export function getStops(routeId) {
    return new Promise((resolve, reject) => {
        return axios.get(`http://localhost:8081/api/routetostops/${routeId}`).then(response => {
            resolve(response.data);
        });
    });
}

export function getStopById(id) {
    return new Promise((resolve, reject) => {
        return axios.get(`http://localhost:8081/api/stops/${id}`).then(response => {
            resolve(response.data);
        });
    });
}