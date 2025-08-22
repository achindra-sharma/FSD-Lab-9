import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Trash2, BookOpen, GraduationCap, Search, Filter } from 'lucide-react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/api/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch students.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || (user.status && user.status === filterStatus);
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      try {
        await axios.delete(`/api/users/${userId}`);

        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        alert('Failed to delete student.');
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status] || styles.active}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600">Loading students...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="p-8 border-b border-slate-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-sm">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Enrolled Students</h2>
            <p className="text-slate-700 text-base">{users.length} students registered</p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-12 pr-8 py-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white appearance-none min-w-36"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-8">
        {filteredUsers.length > 0 ? (
          <div className="space-y-6">
            {filteredUsers.map(user => (
              <div key={user.id} className="group p-7 border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="relative flex-shrink-0">
                      <img
                        src={`/${user.profile_picture.replace(/\\/g, '/')}`}
                        alt={user.name}
                        className="w-18 h-18 rounded-2xl object-cover ring-2 ring-slate-100"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
                        }}
                      />
                      <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-bold text-slate-900 truncate">{user.name}</h3>
                        {getStatusBadge(user.status)}
                      </div>
                      
                      <div className="flex items-center gap-6 text-base text-slate-700 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-600" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-600" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      {user.courses && user.courses.length > 0 ? (
                        <div className="flex items-center gap-3 flex-wrap">
                          <BookOpen className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-700">Courses:</span>
                          {user.courses.map((course, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-800 text-sm font-medium rounded-lg border border-blue-200">
                              {course}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-600">No courses enrolled</span>
                        </div>
                      )}
                      

                      {user.created_at && (
                        <div className="mt-3 text-sm text-slate-600">
                          <span className="font-medium">Joined:</span> {formatDate(user.created_at)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                      title="Remove student"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">
              {users.length === 0 ? 'No students registered yet' : 'No students found'}
            </h3>
            <p className="text-slate-600 text-base">
              {users.length === 0 
                ? 'Add your first student using the registration form'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;