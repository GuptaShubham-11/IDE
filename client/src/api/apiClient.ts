import axios from 'axios';

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_API_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    timeout: 5000
});

export default apiClient;