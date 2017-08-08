import axios from 'axios';

export function getRoutes() {
    return new Promise((resolve, reject) => {
        return axios.get("http://localhost:8081/api/routes").then(response => {
            resolve(response.data);
        });
    });
}

export function getRouteById(id) {
    return new Promise((resolve, reject) => {
        return axios.get(`http://localhost:8081/api/routes/${id}`).then(response => {
            resolve(response.data);
        });
    });
}