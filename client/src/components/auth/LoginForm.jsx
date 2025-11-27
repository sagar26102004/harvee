import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../common/InputField';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        loginId: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        let formErrors = {};
        if (!formData.loginId) formErrors.loginId = 'Email or Phone is required.';
        if (!formData.password) formErrors.password = 'Password is required.';
        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validate();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setLoading(true);
        try {
            const { data } = await axiosInstance.post('/auth/login', formData);

            localStorage.setItem('user', JSON.stringify({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            }));

            toast.success('Login successful!');

            if (data.role === 'admin') navigate('/dashboard');
            else navigate('/');

            window.location.reload();

        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Check your credentials.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-200 backdrop-blur-lg
                        hover:shadow-2xl transition-all duration-300">
            
            <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 tracking-tight">
                Welcome Back 👋
            </h2>

            <p className="text-center text-gray-600 mb-8">
                Sign in to continue to your dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                <InputField
                    label="Email or Phone"
                    name="loginId"
                    type="text"
                    value={formData.loginId}
                    onChange={handleChange}
                    error={errors.loginId}
                    required
                />

                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                />

                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow 
                               hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:bg-indigo-300"
                    disabled={loading}
                >
                    {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                <p className="text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-600 font-semibold hover:text-indigo-800 underline"
                    >
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
