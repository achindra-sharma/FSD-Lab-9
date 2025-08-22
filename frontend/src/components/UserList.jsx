import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/users');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        }
    };

    // Fetch users when the component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:3001/api/users/${userId}`);
                // Refresh the list after deletion
                setUsers(users.filter(user => user.id !== userId));
            } catch (err) {
                alert('Failed to delete user.');
                console.error(err);
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-slate-700">Registered Users</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-4">
                {users.length > 0 ? (
                    users.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <img
                                    // Construct the full URL for the image
                                    src={`http://localhost:3001/${user.profile_picture.replace(/\\/g, '/')}`}
                                    alt={user.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-bold text-lg">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <p className="text-sm text-gray-500">{user.phone}</p>
                                </div>
                            </div>
                            {/* In a real app, you'd have an Edit button here too */}
                            <button
                                onClick={() => handleDelete(user.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No users registered yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserList;