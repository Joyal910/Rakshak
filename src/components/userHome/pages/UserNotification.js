import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, ArrowUpRight, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import Cookies from 'js-cookie';
import Header from '../components/Header';

const API_BASE_URL = 'http://localhost:8080/api/notifications';

export default function UserNotification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    userId: '',
    userName: '',
    userRole: ''
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Check for session
    const userId = sessionStorage.getItem('userId') || Cookies.get('userId') || '';
    const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole') || '';
    const userName = sessionStorage.getItem('userName') || Cookies.get('userName') || '';

    if (!userId || !userRole) {
      navigate('/login');
      return;
    }

    setUserInfo({ userId, userName, userRole });
    fetchNotifications(userRole);
  }, [navigate]);

  const fetchNotifications = async (role) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${role}`);
      setNotifications(response.data);
    } catch (error) {
      setError('Failed to load notifications. Please try again later.');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Emergency':
        return <AlertTriangle className="text-red-500" size={20} />;
      case 'Important':
        return <Info className="text-yellow-500" size={20} />;
      default:
        return <CheckCircle2 className="text-blue-500" size={20} />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Bell className="text-blue-600" size={28} />
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Notifications</option>
                <option value="emergency">Emergency</option>
                <option value="important">Important</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 text-lg">{error}</div>
              <button
                onClick={() => fetchNotifications(userInfo.userRole)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-gray-500 text-lg">No notifications available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="group border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-white hover:border-blue-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getNotificationIcon(notification.type)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-gray-600">{notification.message}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                        notification.type === 'Emergency'
                          ? 'bg-red-100 text-red-800'
                          : notification.type === 'Important'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {notification.type}
                      <ArrowUpRight size={16} className="ml-1" />
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-gray-500">
                      <span>For: {notification.targetRole}</span>
                      <span>•</span>
                      <span>{new Date(notification.scheduledFor).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}