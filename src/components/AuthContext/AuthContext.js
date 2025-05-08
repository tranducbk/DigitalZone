import React, { createContext, useState, useEffect } from 'react';
import apiService from '../../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');
        const userData = JSON.parse(localStorage.getItem('user'));
        if (token && userId && role && userData) {
            setUser(userData);
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    const login = (role, token, userData) => {
        setUser(userData);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userData.role);
        localStorage.setItem('userId', userData._id);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
