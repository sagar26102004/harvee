import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../common/InputField';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiErrors, setApiErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', 
        address: '', state: '', city: '', country: '', pincode: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setApiErrors({ ...apiErrors, [e.target.name]: '' }); 
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setApiErrors({});

        const dataToSubmit = new FormData();
        
        Object.keys(formData).forEach(key => {
            dataToSubmit.append(key, formData[key]);
        });
        
        if (imageFile) {
            dataToSubmit.append('profile_image', imageFile);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            };
            
            const { data } = await axiosInstance.post('/auth/register', dataToSubmit, config);
            
            localStorage.setItem('user', JSON.stringify({
                _id: data._id, name: data.name, email: data.email, role: data.role, 
                accessToken: data.accessToken, refreshToken: data.refreshToken,
            }));

            toast.success('Registration successful! Redirecting to dashboard...');
            
            navigate('/dashboard'); 
            window.location.reload(); 

        } catch (error) {
            console.error('Registration error:', error);
            
            const responseErrors = error.response?.data?.errors;
            const generalMessage = error.response?.data?.message || 'Registration failed. Please check your inputs.';

            if (responseErrors && Array.isArray(responseErrors)) {
                const validationErrors = {};
                responseErrors.forEach(err => {
                    validationErrors[err.path] = err.msg;
                });
                setApiErrors(validationErrors);
                toast.error('Validation failed. See form for details.');
            } else {
                toast.error(generalMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-10 bg-white shadow-2xl rounded-xl border border-gray-200">
            <h2 className="text-4xl font-extrabold mb-8 text-center text-green-700">📝 Create New Account</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- Personal Details --- */}
                <h3 className="text-2xl font-bold border-b-2 border-indigo-200 pb-2 text-indigo-600">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Full Name" name="name" type="text" value={formData.name} onChange={handleChange} error={apiErrors.name} required />
                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={apiErrors.email} required />
                    <InputField label="Phone Number" name="phone" type="text" value={formData.phone} onChange={handleChange} error={apiErrors.phone} required />
                    <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={apiErrors.password} required />
                </div>
                
                {/* --- Address Details --- */}
                <h3 className="text-2xl font-bold border-b-2 border-indigo-200 pb-2 text-indigo-600 pt-4">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="State" name="state" type="text" value={formData.state} onChange={handleChange} error={apiErrors.state} required />
                    <InputField label="City" name="city" type="text" value={formData.city} onChange={handleChange} error={apiErrors.city} required />
                    <InputField label="Country" name="country" type="text" value={formData.country} onChange={handleChange} error={apiErrors.country} required />
                    <InputField label="Pincode" name="pincode" type="text" value={formData.pincode} onChange={handleChange} error={apiErrors.pincode} required />
                </div>
                
                {/* Address & Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                            Address (Optional, Max 150 chars)
                        </label>
                        <textarea name="address" value={formData.address} onChange={handleChange} maxLength="150" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"></textarea>
                        {apiErrors.address && <p className="text-sm text-red-500 mt-1 font-medium">{apiErrors.address}</p>}
                    </div>

                    <InputField 
                        label="Profile Image (JPG/PNG, Max 2MB)" 
                        name="profile_image" 
                        type="file" 
                        onChange={handleImageChange} 
                        error={apiErrors.profile_image}
                        accept=".jpg,.jpeg,.png"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-green-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-green-700 transition duration-200 disabled:bg-green-400 transform hover:scale-[1.005] mt-8"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register Account'}
                </button>

                <p className="text-center text-sm text-gray-600 pt-2">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold underline transition duration-200">Login now</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterForm;