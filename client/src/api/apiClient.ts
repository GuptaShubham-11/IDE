import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VITE_SERVER_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000
});

export default apiClient;