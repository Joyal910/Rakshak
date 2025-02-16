import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, CheckSquare, Bell, User, LogOut, Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [notificationCount, setNotificationCount] = useState(0); // State for notification count

  const isActive = (path) => location.pathname === path;
  const activeClass = "bg-indigo-600 dark:bg-indigo-500 text-white";
  const inactiveClass = "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50";

  // Fetch notifications for the logged-in user (Volunteer)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const loggedEmail = Cookies.get('loggedInEmail') || sessionStorage.getItem('loggedInEmail');
        if (loggedEmail) {
          const response = await axios.get(`http://localhost:8080/api/notifications/user/Volunteer`);
          const notifications = response.data;
          setNotificationCount(notifications.length); // Update notification count
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      const loggedEmail = Cookies.get('loggedInEmail') || sessionStorage.getItem('loggedInEmail');
      
      if (loggedEmail) {
        const response = await axios.get(`http://localhost:8080/api/users?email=${loggedEmail}`);
        const user = response.data;
        if (user.email === loggedEmail) {
          console.log('User ID:', user.id);
        } else {
          console.error('Email does not match the logged-in email');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      // Clear all storage regardless of API call success/failure
      sessionStorage.removeItem('loggedInEmail');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userId');
      Cookies.remove('loggedInEmail');
      Cookies.remove('userRole');
      Cookies.remove('userId');
      
      navigate('/login');
    }
  };

  const handleBellClick = () => {
    navigate('/volunteer/volunteernotification'); // Redirect to the notifications page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-gray-800 shadow-lg">
        <div className="px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Rakshak</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/volunteer/home" 
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/volunteer/home') ? activeClass : inactiveClass
                }`}
              >
                <Home className="h-5 w-5 mr-1" />
                Home
              </Link>
              <Link 
                to="/volunteer/tasks" 
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/volunteer/tasks') ? activeClass : inactiveClass
                }`}
              >
                <CheckSquare className="h-5 w-5 mr-1" />
                Tasks
              </Link>
              <Link 
                to="/volunteer/profile" 
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/volunteer/profile') ? activeClass : inactiveClass
                }`}
              >
                <User className="h-5 w-5 mr-1" />
                Profile
              </Link>

              {/* Bell Icon for Notifications */}
              <button
                onClick={handleBellClick}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 relative"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-gray-900">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">© 2025 Rakshak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}