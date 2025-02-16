import React, { useState, useEffect } from 'react';
import { Bell, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/notifications';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'Emergency',
    targetRole: 'All',
    scheduledFor: '',
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/Admin`);
      console.log('Fetched notifications:', response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'Emergency',
      targetRole: 'All',
      scheduledFor: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (id) => {
    const notificationToEdit = notifications.find(
      (notification) => notification.id === id
    );
    if (notificationToEdit) {
      setFormData({
        title: notificationToEdit.title,
        message: notificationToEdit.message,
        type: notificationToEdit.type,
        targetRole: notificationToEdit.targetRole,
        scheduledFor: new Date(notificationToEdit.scheduledFor)
          .toISOString()
          .slice(0, 16),
      });
      setIsEditing(true);
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        targetRole: formData.targetRole,
        scheduledFor: new Date(formData.scheduledFor).toISOString(),
        active: true,
      };

      let response;
      if (isEditing) {
        response = await axios.put(
          `${API_BASE_URL}/${editingId}`,
          notificationData
        );
      } else {
        response = await axios.post(API_BASE_URL, notificationData);
        console.log('Created notification:', response.data);
      }

      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error('Error saving notification:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        await fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Notification Management</h2>
        <button
          onClick={resetForm}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Bell className="mr-2" size={20} />
          {isEditing ? 'Cancel Editing' : 'Create Notification'}
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isEditing ? 'Edit Notification' : 'Create New Notification'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Emergency">Emergency</option>
                  <option value="Important">Important</option>
                  <option value="Information">Information</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Audience
                </label>
                <select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="All">All Users</option>
                  <option value="User">Users</option>
                  <option value="Volunteer">Volunteers</option>
                  <option value="Admin">Admins</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Schedule For
                </label>
                <input
                  type="datetime-local"
                  name="scheduledFor"
                  value={formData.scheduledFor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : isEditing ? 'Update Notification' : 'Schedule Notification'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Scheduled Notifications
          </h3>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => handleEdit(notification.id)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex space-x-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        notification.type === 'Emergency'
                          ? 'bg-red-100 text-red-800'
                          : notification.type === 'Important'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {notification.type}
                    </span>
                    <span className="text-gray-500">
                      Target: {notification.targetRole}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    Scheduled for: {new Date(notification.scheduledFor).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;