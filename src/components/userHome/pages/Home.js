import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../components/Header';
import DisasterUpdates from '../components/DisasterUpdates';
import QuickActions from '../components/QuickActions';
import VolunteerActivities from '../components/VolunteerActivities';
import EmergencyInfo from '../components/EmergencyInfo';
import LocalDisasterAlert from '../components/LocalDisasterAlert';

function Home() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    userId: null,
    userRole: null
  });

  useEffect(() => {
    // Check for existing session
    const userId = sessionStorage.getItem('userId') || Cookies.get('userId');
    const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole');

    // Redirect to login if no session exists
    if (!userId || !userRole) {
      navigate('/login');
      return;
    }

    // Set user information
    setUserInfo({ userId, userRole });
  }, [navigate]);

  const stats = [
    { label: 'Lives Impacted', value: '48' },
    { label: 'Successful Relief Operations', value: '5' },
    { label: 'Active Volunteers', value: '0' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <LocalDisasterAlert />



      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Empowering Communities Through Crisis
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
            Join Rakshak's network of volunteers and help communities recover from disasters.
            Every action counts in making a difference.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a
              href="/request"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Request Assistance
            </a>
            <a
              href="/volunteer"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Volunteer Now
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Statistics */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm p-8 text-center transform hover:scale-105 transition-transform duration-200">
                <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Actions</h2>
          <QuickActions />
        </section>

        {/* Updates and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Relief Operations</h2>
            <DisasterUpdates />
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Impact</h2>
            <VolunteerActivities />
          </section>
        </div>

        {/* Emergency Information */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Emergency Resources</h2>
          <EmergencyInfo />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Rakshak</h3>
              <p className="text-gray-400">
                Empowering communities through effective disaster management and relief operations.
                Together, we build resilience and hope.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/impact" className="text-gray-400 hover:text-white transition-colors">Our Impact</a></li>
                <li><a href="/news" className="text-gray-400 hover:text-white transition-colors">Latest News</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="space-y-4">
                <p className="text-gray-400">Follow us for updates and news</p>
                <div className="flex space-x-4">
                  <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                  <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
                  <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Rakshak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
