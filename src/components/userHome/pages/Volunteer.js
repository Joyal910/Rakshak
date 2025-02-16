import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { HandHeart, Users, Award, Loader2 } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Volunteer() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [existingApplication, setExistingApplication] = useState(null);
  const [userInfo, setUserInfo] = useState({
    userId: '',
    userName: '',
    phoneNumber: '',
    userRole: ''
  });

  useEffect(() => {
    // Get user info from session storage or cookies
    const userId = sessionStorage.getItem('userId') || Cookies.get('userId') || '';
    const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole') || '';
    const userName = sessionStorage.getItem('userName') || Cookies.get('userName') || '';
    const phoneNumber = sessionStorage.getItem('phoneNumber') || Cookies.get('phoneNumber') || '';

    if (!userId || !userRole) {
      navigate('/login', { state: { from: '/volunteer' } });
      return;
    }

    setUserInfo({ userId, userName, phoneNumber, userRole });

    // Check if user has an existing application
    const checkExistingApplication = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/volunteer-applications/user/${userId}`);
        if (response.data) {
          setExistingApplication(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch application:', error);
        // Only set error if it's not a 404 (no application found)
        if (error.response?.status !== 404) {
          setError('Failed to check application status: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    checkExistingApplication();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const requestPayload = {
        user: {
          userId: parseInt(userInfo.userId, 10),
        },
        description,
      };
  
      const response = await axios.post('http://localhost:8080/volunteer-applications', requestPayload);
      setSuccess(response.data.message || 'Volunteer application submitted successfully!');
      setExistingApplication(response.data.application);
      setDescription('');
    } catch (error) {
      console.error(error);
      setError('Failed to create volunteer application: ' + (error.response?.data?.error || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const ApplicationStatus = () => (
    <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Status</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={userInfo.userName}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 focus:ring-0"
          />
        </div>
        <div>
          <p className="text-gray-600">Application Date:</p>
          <p className="font-medium">{new Date(existingApplication.applicationDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Status:</p>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(existingApplication.status)}`}>
            {existingApplication.status}
          </span>
        </div>
        <div>
          <p className="text-gray-600">Description:</p>
          <p className="font-medium">{existingApplication.description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Volunteer Network</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make a difference in your community by joining our network of dedicated volunteers.
            Together, we can help those in need during critical times.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[{
            icon: HandHeart,
            title: 'Make an Impact',
            description: 'Help communities recover and rebuild after disasters',
          }, {
            icon: Users,
            title: 'Join a Community',
            description: 'Connect with like-minded individuals dedicated to helping others',
          }, {
            icon: Award,
            title: 'Gain Experience',
            description: 'Receive training and develop valuable emergency response skills',
          }].map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {existingApplication ? (
          <ApplicationStatus />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Application</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userInfo.userName}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 focus:ring-0"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you want to volunteer?
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Please provide a brief description of your interest and how you can contribute as a volunteer"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}