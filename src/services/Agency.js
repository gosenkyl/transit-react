import axios from 'axios';

export function getAgency() {
    return new Promise((resolve, reject) => {
        return axios.get("http://localhost:8081/api/agencies").then(response => {
            resolve(response.data[0]);
        });
    });
}