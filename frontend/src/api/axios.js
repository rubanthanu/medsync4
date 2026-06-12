import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Global response interceptor for 401 handling
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/verify_otp', '/auth/resend_otp', '/auth/forgot_password', '/auth/verify_forgot_password_otp', '/auth/reset_password'];

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            !AUTH_ROUTES.some(route => error.config?.url?.includes(route))
        ) {
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
