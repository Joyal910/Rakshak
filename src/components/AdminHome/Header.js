import React, { useEffect, useState } from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Header() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Retrieve the userName from session storage or cookies
    const storedUserName = sessionStorage.getItem('userName') || Cookies.get('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      setUserName('Admin'); // Fallback in case no userName is available
    }
  }, []);

  const handleLogout = () => {
    // Clear session storage and cookies on logout
    sessionStorage.removeItem('loggedInEmail');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    Cookies.remove('loggedInEmail');
    Cookies.remove('userRole');
    Cookies.remove('userId');
    Cookies.remove('userName');

    // Redirect the user to the login page after logout
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              
            </div>
            <div className="ml-3">
            <h2 className="text-lg font-bold text-gray-900">{userName}</h2>
              <p className="text-sm text-gray-500">Emergency Response Admin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Settings size={20} />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-700"
              onClick={handleLogout}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
