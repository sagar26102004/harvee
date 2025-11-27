import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';

const NotFound = () => {
    return (
        <div className="w-screen min-h-screen bg-gray-50">
            <Header />
            <div className="flex flex-col items-center justify-center pt-20 h-[calc(100vh-80px)]"> 
                <h1 className="text-[12rem] font-extrabold text-indigo-700 tracking-widest leading-none">404</h1>
                <div className="text-3xl font-semibold text-gray-800 mb-6">
                    Oops! Page Not Found
                </div>
                
                <Link
                    to="/"
                    className="relative inline-block text-lg font-medium text-white group"
                >
                    <span className="absolute inset-0 transition-transform translate-x-1.5 translate-y-1.5 bg-indigo-600 group-hover:translate-y-0 group-hover:translate-x-0 rounded-lg"></span>
                    <span className="relative block px-8 py-4 bg-indigo-500 border-2 border-indigo-600 rounded-lg hover:bg-indigo-600 transition duration-200 font-bold shadow-lg">
                        Go To Home Page
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;