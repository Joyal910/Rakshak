import React, { useState } from 'react';
import { Shield, Bell, Menu, Settings, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Fetch the logged-in email from cookies or session
    const loggedEmail = Cookies.get('loggedInEmail') || sessionStorage.getItem('loggedInEmail');
    
    if (loggedEmail) {
      // Make an API request to fetch the user details based on the logged-in email
      axios.get(`http://localhost:8080/api/users?email=${loggedEmail}`)
        .then(response => {
          const user = response.data;
          // Check if the email from cookies/session matches the fetched user's email
          if (user.email === loggedEmail) {
            console.log('User ID:', user.id);  // Log user ID if needed
          } else {
            console.error('Email does not match the logged-in email');
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
    
    // Clear session storage and cookies on logout
    sessionStorage.removeItem('loggedInEmail');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
    Cookies.remove('loggedInEmail');
    Cookies.remove('userRole');
    Cookies.remove('userId');
    
    // Redirect the user to the login page after logout
    navigate('/login');
  };

  const handleBellClick = () => {
    navigate('/usernotifications'); // Redirect to the /usernotifications page
  };


  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Rakshak</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/Home" className="text-blue-700 hover:text-blue-600">Home</Link>
            <Link to="/SubmitRequest" className="text-gray-700 hover:text-blue-600">Submit Request</Link>
            <Link to="/ResourceRequest" className="text-gray-700 hover:text-blue-600">Resource Requests</Link>
            <Link to="/Volunteer" className="text-gray-700 hover:text-blue-600">Volunteer</Link>
            <Link to="/DisasterUpdates" className="text-gray-700 hover:text-blue-600">Disaster Updates</Link>
            <Link to="/EmergencyInfo" className="text-gray-700 hover:text-blue-600">Emergency Info</Link>
            <Link to="/Contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
      {/* Bell Icon with Redirection */}
      <button
        onClick={handleBellClick} // Add onClick handler
        className="text-gray-600 hover:text-blue-600 relative"
      >
        <Bell className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {/* Notification count */}
        </span>
      </button>
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <User className="h-6 w-6" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                  <Link to="/usernotifications" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-blue-600 font-bold py-2">Home</Link>
              <Link to="/request" className="text-gray-700 hover:text-blue-600 py-2">Submit Request</Link>
              <Link to="/resources" className="text-gray-700 hover:text-blue-600 py-2">Resource Requests</Link>
              <Link to="/volunteer" className="text-gray-700 hover:text-blue-600 py-2">Volunteer</Link>
              <Link to="/updates" className="text-gray-700 hover:text-blue-600 py-2">Disaster Updates</Link>
              <Link to="/emergency" className="text-gray-700 hover:text-blue-600 py-2">Emergency Info</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 py-2">Contact</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}