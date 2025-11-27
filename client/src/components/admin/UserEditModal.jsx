import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const UserEditModal = ({ isOpen, onClose, user, onUpdate }) => {
    // Initialize form state with current user data
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        state: user.state || '',
        city: user.city || '',
        country: user.country || '',
        pincode: user.pincode || '',
        password: '', // Password field is optional/reset
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Update state when the 'user' prop changes
    useEffect(() => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            state: user.state || '',
            city: user.city || '',
            country: user.country || '',
            pincode: user.pincode || '',
            password: '', 
        });
        setImageFile(null);
    }, [user]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dataToSubmit = new FormData();

        Object.keys(formData).forEach(key => {
            if (formData[key] !== '' || key === 'address') {
                dataToSubmit.append(key, formData[key]);
            }
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
            
            await axiosInstance.put(`/users/${user._id}`, dataToSubmit, config);

            toast.success(`User ${user.name} updated successfully!`);
            onUpdate();

        } catch (error) {
            console.error('Update error:', error);
            const message = error.response?.data?.message || 'Update failed.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10" onClick={onClose}>
            <div className="relative bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full mx-4 transform transition-all duration-300 ease-out" onClick={e => e.stopPropagation()}>
                
                <button className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-3xl font-bold transition" onClick={onClose}>
                    &times;
                </button>
                
                <h3 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">✏️ Edit User: {user.name}</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Phone</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        {/* Password (Optional) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">New Password (Optional)</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* State */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        {/* City */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        {/* Country */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Country</label>
                            <input type="text" name="country" value={formData.country} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                         {/* Pincode */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Pincode</label>
                            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>
                    
                    {/* Address */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} maxLength="150" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>

                    {/* Profile Image */}
                    <div className="flex flex-col space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Update Profile Image</label>
                        <div className="flex items-center space-x-4">
                            <input 
                                type="file" 
                                name="profile_image" 
                                accept=".jpg,.png" 
                                onChange={handleImageChange} 
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />
                            {user.profile_image && (
                                <img 
                                    src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${user.profile_image}`} 
                                    alt="Current Profile" 
                                    className="h-12 w-12 rounded-full object-cover border-4 border-indigo-500 shadow-md"
                                />
                            )}
                        </div>
                    </div>
                    

                    <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-6 py-3 text-sm font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;