import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Mail, Bell, Clock } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function UserProfile() {
  const [user, setUser] = useState({
    userId: '',
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    role: '',
    userStatus: '',
    tasksCompleted: 15,
    totalHours: 45,
    isAvailable: true,
    notifications: {
      email: true,
      emergencyAlerts: true
    }
  });

  const [editFormData, setEditFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userId = sessionStorage.getItem('userId') || Cookies.get('userId');
    if (userId) {
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
      if (response.data) {
        const userData = {
          ...response.data,
          tasksCompleted: 15,
          totalHours: 45,
          isAvailable: true,
          notifications: {
            email: true,
            emergencyAlerts: true
          }
        };
        setUser(userData);
        setEditFormData(userData);
      }
    } catch (error) {
      setError('Failed to fetch user data: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (notificationType) => {
    setEditFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [notificationType]: !prev.notifications[notificationType]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/api/users/${user.userId}`, {
        ...editFormData,
        userId: user.userId,
        role: user.role,
        userStatus: user.userStatus
      });

      if (response.data) {
        setUser(prev => ({
          ...prev,
          ...editFormData
        }));
        
        sessionStorage.setItem('userName', editFormData.name);
        Cookies.set('userName', editFormData.name, { expires: 1, path: '/' });

        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setError('');
      }
    } catch (error) {
      setError('Failed to update profile: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    setEditFormData(user);
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && <div className="max-w-3xl mx-auto mb-4 text-red-600 p-2 bg-red-50 rounded">{error}</div>}
        {success && <div className="max-w-3xl mx-auto mb-4 text-green-600 p-2 bg-green-50 rounded">{success}</div>}
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="px-8 pb-8">
              <div className="flex items-center justify-between pt-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? editFormData.name : user.name}
                  </h1>
                  <p className="text-gray-600">{user.role}</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={isEditing ? editFormData.name : user.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={isEditing ? editFormData.email : user.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={isEditing ? editFormData.phoneNumber : user.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    name="location"
                    value={isEditing ? editFormData.location : user.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select location</option>
                    <option value="Changanasserry">Changanasserry</option>
                    <option value="Chinganavanam">Chinganavanam</option>
                    <option value="Kumarakom">Kumarakom</option>
                    <option value="Mundakayam">Mundakayam</option>
                    <option value="Kanjirappally">Kanjirappally</option>
                    <option value="Karukachal">Karukachal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={user.role}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <input
                    type="text"
                    value={user.userStatus}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isEditing ? editFormData.notifications.email : user.notifications.email}
                      onChange={() => handleNotificationChange('email')}
                      disabled={!isEditing}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Emergency Alerts</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isEditing ? editFormData.notifications.emergencyAlerts : user.notifications.emergencyAlerts}
                      onChange={() => handleNotificationChange('emergencyAlerts')}
                      disabled={!isEditing}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Available for tasks</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isEditing ? editFormData.isAvailable : user.isAvailable}
                      onChange={() => setEditFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                      disabled={!isEditing}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}