import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function AdminSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    userId: '',
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    role: '',
    userStatus: '',
    language: 'English',
    timezone: 'UTC+0 (GMT)',
    emailNotifications: true,
    smsNotifications: false
  });
  const [editFormData, setEditFormData] = useState({});
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
          language: 'English',
          timezone: 'UTC+0 (GMT)',
          emailNotifications: true,
          smsNotifications: false
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

  const handleToggleChange = (field) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async () => {
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

        setSuccess('Settings updated successfully!');
        setIsEditing(false);
        setError('');
      }
    } catch (error) {
      setError('Failed to update settings: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    setEditFormData(user);
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      {error && <div className="mb-4 text-red-600 p-2 bg-red-50 rounded">{error}</div>}
      {success && <div className="mb-4 text-green-600 p-2 bg-green-50 rounded">{success}</div>}

      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {/* Profile Settings */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Profile Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={isEditing ? editFormData.name : user.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={isEditing ? editFormData.email : user.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={isEditing ? editFormData.phoneNumber : user.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <select
                name="location"
                value={isEditing ? editFormData.location : user.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                value={user.role}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <input
                type="text"
                value={user.userStatus}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Email Notifications
                </p>
                <p className="text-sm text-gray-500">
                  Receive email updates for new emergencies
                </p>
              </div>
              <button
                type="button"
                disabled={!isEditing}
                onClick={() => handleToggleChange('emailNotifications')}
                className={`${
                  (isEditing ? editFormData : user).emailNotifications 
                    ? 'bg-indigo-600' 
                    : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                role="switch"
                aria-checked={(isEditing ? editFormData : user).emailNotifications}
              >
                <span 
                  className={`${
                    (isEditing ? editFormData : user).emailNotifications 
                      ? 'translate-x-5' 
                      : 'translate-x-0'
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`} 
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  SMS Notifications
                </p>
                <p className="text-sm text-gray-500">
                  Receive SMS alerts for critical updates
                </p>
              </div>
              <button
                type="button"
                disabled={!isEditing}
                onClick={() => handleToggleChange('smsNotifications')}
                className={`${
                  (isEditing ? editFormData : user).smsNotifications 
                    ? 'bg-indigo-600' 
                    : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                role="switch"
                aria-checked={(isEditing ? editFormData : user).smsNotifications}
              >
                <span 
                  className={`${
                    (isEditing ? editFormData : user).smsNotifications 
                      ? 'translate-x-5' 
                      : 'translate-x-0'
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`} 
                />
              </button>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            System Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                name="timezone"
                value={isEditing ? editFormData.timezone : user.timezone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC+1 (Central European Time)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                name="language"
                value={isEditing ? editFormData.language : user.language}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {isEditing ? (
          <>
            <button 
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Edit Settings
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminSettings;