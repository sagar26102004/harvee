import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../components/common/Header';
import UserTable from '../components/admin/UserTable';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    // Note: The file path to AuthContext is fixed to '../context/AuthContext'
    const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-2xl font-semibold text-indigo-600">Loading Authentication Status...</div>;
    }

    // 1. Check if authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. Check if admin
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="w-screen min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto py-12 px-4">
                <UserTable />
            </main>
        </div>
    );
};

export default AdminDashboard;