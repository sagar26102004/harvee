import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance'; 
// NOTE: We won't implement the full refresh token rotation here, but 
// the structure is set up to handle login/logout and user state.

// 1. Create the Context
export const AuthContext = createContext();

// 2. Auth Provider Component
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    
    // Function to retrieve user state from local storage
    const getInitialUser = () => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    };
    
    // State to hold the current logged-in user and tokens
    const [user, setUser] = useState(getInitialUser);
    const [isAuthenticated, setIsAuthenticated] = useState(!!getInitialUser());
    const [loading, setLoading] = useState(true);

    // --- Authentication Actions ---

    // Function to handle login success
    const login = useCallback((userData) => {
        // Store the user data (including tokens) securely in local storage
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
        
        // Navigate based on role (optional, but clean)
        if (userData.role === 'admin') {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    }, [navigate]);

    // Function to handle logout
    const logout = useCallback(() => {
        // Clear tokens/data from storage
        localStorage.removeItem('user'); 
        setUser(null);
        setIsAuthenticated(false);
        
        // Optionally, make an API call to blacklist the refresh token (Bonus)
        // try {
        //     await axiosInstance.post('/auth/logout', { refreshToken: user.refreshToken });
        // } catch (err) {
        //     console.error("Logout API failed:", err);
        // }

        toast.info("Logged out successfully.");
        navigate('/login');
    }, [navigate]);

    // --- Initial Check and Loading State ---
    useEffect(() => {
        // On initial load, verify stored user data if any
        if (user) {
            // A more rigorous check might involve calling an API to validate the access token
            // but for simplicity, we assume the token is valid if it exists.
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, [user]);

    // --- Context Value ---
    const contextValue = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
    };

    // Show a loading spinner or component while checking authentication status
    if (loading) {
        return <div>Loading App...</div>; 
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};