import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { FaTrash, FaEdit, FaSearch, FaTimesCircle, FaPlusCircle } from 'react-icons/fa';
import UserEditModal from './UserEditModal';
import { toast } from 'react-toastify';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get(`/users?search=${searchTerm}`);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error(error.response?.data?.message || 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleDelete = async (userId, name) => {
        if (window.confirm(`Are you sure you want to delete user: ${name}? This action cannot be undone.`)) {
            try {
                await axiosInstance.delete(`/users/${userId}`);
                toast.success(`User ${name} deleted successfully!`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error(error.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleUpdateSuccess = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
    };
    
    // Function to clear search bar
    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800 border-b-2 pb-2">User Management Console</h2>
            
            {/* Search and Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md border">
                
                <div className="relative w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search by Name, Email, State, or City..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                    />
                    <FaSearch className="absolute left-3 top-4 text-gray-400" />
                    {searchTerm && (
                        <FaTimesCircle 
                            className="absolute right-3 top-4 text-red-500 hover:text-red-700 cursor-pointer transition" 
                            onClick={clearSearch}
                            title="Clear Search"
                        />
                    )}
                </div>

                <button
                    // In a real app, this would open a create user modal
                    onClick={() => toast.info('Create User feature coming soon!')}
                    className="w-full md:w-auto mt-3 md:mt-0 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center space-x-2 transform hover:scale-[1.01]"
                >
                    <FaPlusCircle className="text-lg" /> <span>Add New User</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-lg text-gray-600">Loading users data... ⏳</p>
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-red-500">No users found matching your criteria. 😔</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-2xl rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-indigo-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.city}, {user.state}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.profile_image ? (
                                            <img 
                                                src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${user.profile_image}`} 
                                                alt="Profile" 
                                                className="h-10 w-10 rounded-full object-cover border-2 border-indigo-500 shadow-md" 
                                            />
                                        ) : (
                                            <span className="text-gray-400">👤 N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center space-x-3">
                                        <button 
                                            onClick={() => handleEdit(user)}
                                            className="text-indigo-600 hover:text-white bg-indigo-100 hover:bg-indigo-600 p-3 rounded-full transition duration-200 shadow-sm"
                                            title="Edit User"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user._id, user.name)}
                                            className="text-red-600 hover:text-white bg-red-100 hover:bg-red-600 p-3 rounded-full transition duration-200 shadow-sm"
                                            title="Delete User"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* User Edit Modal */}
            {selectedUser && (
                <UserEditModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={selectedUser}
                    onUpdate={handleUpdateSuccess}
                />
            )}
        </div>
    );
};

export default UserTable;