import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function VolunteerProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
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
    isAvailable: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const userId = sessionStorage.getItem('userId') || Cookies.get('userId');
    const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole');
    const userName = sessionStorage.getItem('userName') || Cookies.get('userName');

    if (!userId || !userRole) {
      navigate('/login');
      return;
    }

    setUser(prev => ({
      ...prev,
      userId,
      name: userName,
      role: userRole
    }));

    fetchUserData(userId);
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
      if (response.data) {
        const userData = {
          ...response.data,
          tasksCompleted: 15, // Keeping the hardcoded values as in original
          totalHours: 45,
          isAvailable: true
        };
        setUser(userData);
        setEditFormData(userData); // Initialize edit form data
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

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/users/${user.userId}`, {
        ...editFormData,
        userId: user.userId,
        role: user.role, // Keep the role unchanged
        userStatus: user.userStatus // Keep the status unchanged
      });

      if (response.data) {
        setUser(prev => ({
          ...prev,
          ...editFormData
        }));
        
        // Update storage
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

  const handleCancelEdit = () => {
    setEditFormData(user);
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <div className="space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {error && <div className="mb-4 text-red-600 p-2 bg-red-50 rounded">{error}</div>}
        {success && <div className="mb-4 text-green-600 p-2 bg-green-50 rounded">{success}</div>}

        <div className="space-y-6">
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Details</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                  />
                ) : (
                  <span className="text-gray-800">{user.name}</span>
                )}
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-600 mr-2" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                  />
                ) : (
                  <span className="text-gray-800">{user.email}</span>
                )}
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-600 mr-2" />
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editFormData.phoneNumber}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                  />
                ) : (
                  <span className="text-gray-800">{user.phoneNumber}</span>
                )}
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                {isEditing ? (
                  <select
                    name="location"
                    value={editFormData.location}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                  >
                    <option value="">Select location</option>
                    <option value="Changanasserry">Changanasserry</option>
                    <option value="Chinganavanam">Chinganavanam</option>
                    <option value="Kumarakom">Kumarakom</option>
                    <option value="Mundakayam">Mundakayam</option>
                    <option value="Kanjirappally">Kanjirappally</option>
                    <option value="Karukachal">Karukachal</option>
                  </select>
                ) : (
                  <span className="text-gray-800">{user.location}</span>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Role:</span>
                <span className="text-gray-800">{user.role}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Status:</span>
                <span className="text-gray-800">{user.userStatus}</span>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 text-lg font-semibold">{user.tasksCompleted}</div>
                <div className="text-gray-600">Tasks Completed</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 text-lg font-semibold">{user.totalHours}</div>
                <div className="text-gray-600">Hours Contributed</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Availability</h2>
            <div className="flex items-center space-x-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isEditing ? editFormData.isAvailable : user.isAvailable}
                  onChange={() => {
                    if (isEditing) {
                      setEditFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
                    }
                  }}
                  disabled={!isEditing}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-gray-700">Available for tasks</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}