import axios from 'axios';

// 1. Define the base URL for the backend API
// Use the URL where your Express server is running (e.g., http://localhost:5000)
// This makes sure you don't have to type the full URL in every request.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Request Interceptor: Automatically attach the Access Token
// This runs before every request leaves the client.
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the token from local storage or wherever you store it (e.g., AuthContext)
        // We look for the 'accessToken' in the browser's localStorage
        const user = localStorage.getItem('user');
        const token = user ? JSON.parse(user).accessToken : null;

        if (token) {
            // Attach the token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// 3. Response Interceptor: Handle Token Expiration/401 Errors (Bonus Points)
// This runs whenever a response is received.
axiosInstance.interceptors.response.use(
    (response) => {
        // If the request was successful, just return the response
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const status = error.response ? error.response.status : null;

        // Check if the error is a 401 Unauthorized AND it hasn't been retried yet
        if (status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // --- IMPLEMENT REFRESH TOKEN LOGIC HERE (For bonus points) ---
            try {
                // For a full implementation, you would send the refreshToken to a 
                // dedicated endpoint (e.g., /api/auth/refresh-token) to get a new accessToken.
                
                // For now, we will just log the user out if the access token is invalid/expired.
                console.log('Access token expired or invalid. Logging out.');
                
                // You would typically dispatch a LOGOUT action here (using AuthContext).
                // Example: window.location.href = '/login'; 
                
                // To avoid immediate logout during development, we'll stop here for now.
                
            } catch (refreshError) {
                // If refresh token also fails, force logout
                console.error('Refresh token failed. Forcing logout.');
                // window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;