import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Bell, AlertTriangle, Clock, MapPin } from 'lucide-react';

export default function VolunteerNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState({
    userId: null,
    userRole: null,
    userName: '',
  });

  // User authentication check
  useEffect(() => {
    const userId = sessionStorage.getItem('userId') || Cookies.get('userId');
    const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole');
    const userName = sessionStorage.getItem('userName') || Cookies.get('userName');

    if (!userId || !userRole) {
      navigate('/login');
      return;
    }

    setUserInfo({ userId, userRole, userName });
  }, [navigate]);

  // Fetch notifications for the logged-in user (Volunteer)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/notifications/user/Volunteer`
        );
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Calculate relative time for notifications
  const getRelativeTime = (timestamp) => {
    const minutes = Math.floor((new Date() - new Date(timestamp)) / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  // Get severity color based on notification type
  const getSeverityColor = (type) => {
    switch (type) {
      case 'Emergency':
        return 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300';
      case 'Important':
        return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="flex-1 w-full mx-auto px-4 bg-gray-900 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Bell className="h-5 w-5 text-indigo-500 mr-2" />
              Notifications
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-6">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No notifications available.
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            notification.type === 'Emergency'
                              ? 'text-red-500'
                              : notification.type === 'Important'
                              ? 'text-yellow-500'
                              : 'text-blue-500'
                          }`}
                        />
                        <h3 className="font-semibold text-white">
                          {notification.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                            notification.type
                          )}`}
                        >
                          {notification.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center text-gray-400 text-sm mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Target: {notification.targetRole}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {getRelativeTime(notification.scheduledFor)}
                        </span>
                      </div>
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