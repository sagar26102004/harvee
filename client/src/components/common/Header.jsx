import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext'; 

const Header = () => {
    // const { user, logout } = useContext(AuthContext); 
    // Mock user context for now
    const user = JSON.parse(localStorage.getItem('user')); 
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload(); 
    };

    return (
        <header className="bg-gray-800 text-white shadow-xl sticky top-0 z-10">
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

                
                {/* Logo / Home Link */}
                <Link to="/" className="text-2xl font-extrabold tracking-widest text-indigo-400 hover:text-indigo-300 transition duration-200">
                    <span className="text-white">Harvee</span> Manager
                </Link>

                {/* Navigation Links */}
                <nav>
                    <ul className="flex space-x-6 items-center">
                        {user ? (
                            <>
                                <li className="text-sm md:text-base text-gray-300">
                                    Welcome, <span className="font-bold text-white">{user.name || user.email}</span>
                                </li>
                                
                                {user.role === 'admin' && (
                                    <li>
                                        <Link 
                                            to="/dashboard" 
                                            className="text-white hover:text-indigo-400 font-medium transition duration-150 border-b-2 border-transparent hover:border-indigo-400 py-1"
                                        >
                                            Admin Dashboard 🚀
                                        </Link>
                                    </li>
                                )}

                                <li>
                                    <button 
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150 transform hover:scale-105"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="hover:text-indigo-400 transition duration-150">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/register" 
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150 transform hover:scale-105"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;