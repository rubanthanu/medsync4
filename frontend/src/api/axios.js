import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ──────────────────────────────────────────────────────────
// CSRF Token Management
// ──────────────────────────────────────────────────────────
// Fetches a CSRF token from the server once per session and
// attaches it to every state-changing request (POST/PUT/PATCH/DELETE).

let csrfToken = null;
let csrfPromise = null;

/**
 * Fetch CSRF token from backend (cached — only one request per page load).
 * Uses a shared promise so concurrent requests don't trigger multiple fetches.
 */
async function getCsrfToken() {
    if (csrfToken) return csrfToken;
    if (csrfPromise) return csrfPromise;

    csrfPromise = axios
        .get(`${import.meta.env.VITE_API_URL}/auth/csrf_token`, { withCredentials: true })
        .then((res) => {
            csrfToken = res.data.csrf_token;
            csrfPromise = null;
            return csrfToken;
        })
        .catch((err) => {
            csrfPromise = null;
            console.error('Failed to fetch CSRF token:', err);
            return null;
        });

    return csrfPromise;
}

/**
 * Clear cached CSRF token.
 * Called on logout so the next session gets a fresh token.
 */
export function clearCsrfToken() {
    csrfToken = null;
    csrfPromise = null;
}

// ──────────────────────────────────────────────────────────
// Request Interceptor — attach CSRF token
// ──────────────────────────────────────────────────────────
api.interceptors.request.use(async (config) => {
    const method = config.method?.toLowerCase();

    // Attach CSRF token to every state-changing request
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
        const token = await getCsrfToken();
        if (token) {
            config.headers['X-CSRF-Token'] = token;
        }
    }

    return config;
});

// ──────────────────────────────────────────────────────────
// Response Interceptor — handle 401 and CSRF 403
// ──────────────────────────────────────────────────────────
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/verify_otp', '/auth/resend_otp', '/auth/forgot_password', '/auth/verify_forgot_password_otp', '/auth/reset_password'];

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';

        // If CSRF validation failed (403 with specific message), refresh token and retry once
        if (
            status === 403 &&
            error.response?.data?.message === 'CSRF token validation failed.' &&
            !error.config._csrfRetry
        ) {
            csrfToken = null; // Force refresh
            const newToken = await getCsrfToken();
            if (newToken) {
                error.config._csrfRetry = true;
                error.config.headers['X-CSRF-Token'] = newToken;
                return api.request(error.config);
            }
        }

        // Handle session expiry (401)
        if (
            status === 401 &&
            !AUTH_ROUTES.some(route => url.includes(route))
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
