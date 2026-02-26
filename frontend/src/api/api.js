import axios from "axios";

const API_URL = import.meta.env.VITE_API

const api = axios.create({
    baseURL: API_URL,
});

// ----- Injectable auth callbacks (set by AuthProvider) -----
let _onTokenRefreshed = null;
let _onLogout = null;

/**
 * Called once by AuthProvider so the interceptor can update
 * context state and trigger a logout without importing hooks.
 */
export const setApiCallbacks = ({ onTokenRefreshed, onLogout }) => {
    _onTokenRefreshed = onTokenRefreshed;
    _onLogout = onLogout;
};

// ----- Request interceptor: attach access token -----
api.interceptors.request.use(
    (config) => {
        const stored = JSON.parse(localStorage.getItem("auth") || "null");
        const token = stored?.tokens?.access_token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ----- Refresh queue helpers -----
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    failedQueue = [];
};

// ----- Response interceptor: handle 401 → refresh -----
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh on 401 and only once per request
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // If a refresh is already in flight, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const stored = JSON.parse(localStorage.getItem("auth") || "null");
        const refreshToken = stored?.tokens?.refresh_token;

        if (!refreshToken) {
            isRefreshing = false;
            if (_onLogout) _onLogout();
            return Promise.reject(error);
        }

        try {
            // Use a plain axios call (not `api`) to avoid interceptor loops
            const { data: newTokens } = await axios.post(
                `${API_URL}/api/v1/auth/refresh`,
                { refresh_token: refreshToken }
            );

            // Persist new tokens to localStorage
            const current = JSON.parse(localStorage.getItem("auth") || "null");
            if (current) {
                current.tokens = newTokens;
                localStorage.setItem("auth", JSON.stringify(current));
            }

            // Notify AuthContext so React state stays in sync
            if (_onTokenRefreshed) _onTokenRefreshed(newTokens);

            processQueue(null, newTokens.access_token);
            originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            if (_onLogout) _onLogout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
