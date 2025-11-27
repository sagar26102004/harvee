import React from 'react';
import Header from '../components/common/Header';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col">

            {/* Make Header full width so it doesn't squeeze the page */}
            <div className="w-full">
                <Header />
            </div>

            {/* Center page content properly */}
            <main className="flex flex-1 justify-center items-center px-4 py-8 w-full">
                <div className="w-full flex justify-center">
                    <LoginForm />
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
