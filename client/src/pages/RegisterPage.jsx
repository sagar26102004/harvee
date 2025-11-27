import React from 'react';
import Header from '../components/common/Header';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="w-screen min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto py-12 px-4">
                <RegisterForm />
            </main>
        </div>
    );
};

export default RegisterPage;