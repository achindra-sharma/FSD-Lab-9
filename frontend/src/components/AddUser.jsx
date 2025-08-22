import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';

const AddUser = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: null
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (file) => {
    setFormData(prev => ({
      ...prev,
      profilePicture: file
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.profilePicture) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    
    const apiFormData = new FormData();
    apiFormData.append('name', formData.name);
    apiFormData.append('email', formData.email);
    apiFormData.append('phone', formData.phone);
    apiFormData.append('profilePicture', formData.profilePicture);

    try {
      const response = await axios.post('/api/users', apiFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage('Student registered successfully!');
      setFormData({ name: '', email: '', phone: '', profilePicture: null });
      
      const fileInput = document.getElementById('profilePicture');
      if (fileInput) fileInput.value = '';
      
      if (onUserAdded) onUserAdded();
    } catch (error) {
      setMessage('Failed to register student. Email might already exist.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-sm">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Add New Student</h2>
          <p className="text-slate-700 text-base">Register a new student to the course platform</p>
        </div>
      </div>

      <div className="space-y-7">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="Enter student's full name"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="student@email.com"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900">Profile Picture *</label>
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : formData.profilePicture
                ? 'border-green-400 bg-green-50'
                : 'border-slate-300 bg-slate-50 hover:border-slate-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              id="profilePicture"
              type="file"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
            />
            <div className="space-y-3">
              <div className="mx-auto w-14 h-14 bg-slate-300 rounded-full flex items-center justify-center">
                <Plus className="w-7 h-7 text-slate-600" />
              </div>
              <p className="text-base font-medium text-slate-700">
                {formData.profilePicture ? formData.profilePicture.name : 'Drop image here or click to browse'}
              </p>
              <p className="text-sm text-slate-600">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl text-base font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Registering...
            </div>
          ) : (
            'Register Student'
          )}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-4 rounded-xl border ${
          message.includes('successfully') 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
    </div>
  );
};

export default AddUser;