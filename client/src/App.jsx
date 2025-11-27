import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Import all pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Header from './components/common/Header';

const App = () => {
  return (
    // Note: Header is included in the individual pages for layout flexibility, 
    // but for a simpler app, you could place it outside the <Routes>.
    <Routes>
      <Route path="/" element={<HomePlaceholder />} /> {/* Simple placeholder for the root */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Protected and Role-Based Route */}
      <Route path="/dashboard" element={<AdminDashboard />} /> 
      {/* 404 Catcher */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Placeholder component for the root path (/)
const HomePlaceholder = () => (
    <div className="w-screen min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto py-10 text-center">
            <h2 className="text-3xl font-bold">Welcome!</h2>
            <p className="mt-4 text-gray-600">Please navigate using the links above to Login, Register, or access the Admin Dashboard (if you are an Admin).</p>
        </div>
    </div>
);

export default App;