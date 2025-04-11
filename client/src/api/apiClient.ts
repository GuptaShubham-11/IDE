import axios, { AxiosError, AxiosRequestConfig } from 'axios';

axios.defaults.withCredentials = true;

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_API_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 5000,
});

let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
}[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        const isUnauthorized = error.response?.status === 401;
        const isNotRetrying = !originalRequest._retry;
        const isNotRefreshEndpoint = !originalRequest.url?.includes('/users/refresh-access-token');

        if (isUnauthorized && isNotRetrying && isNotRefreshEndpoint) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            }
                            resolve(apiClient(originalRequest));
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_SERVER_API_URL}/api/v1/users/refresh-access-token`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = res.data?.data;

                console.log('newAccessToken', newAccessToken);


                if (newAccessToken) {
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);

                    if (originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    }

                    return apiClient(originalRequest);
                }
            } catch (err) {
                processQueue(err as AxiosError, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;