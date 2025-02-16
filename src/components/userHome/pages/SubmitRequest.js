import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../components/Header';
import axios from 'axios';

export default function SubmitRequest() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    userId: '',
    userName: '',
    phoneNumber: '',
    userRole: ''
  });

  const [formData, setFormData] = useState({
    requestTitle: '',
    requestDescription: '',
    location: '',
    photo: ''
  });

  const [userRequests, setUserRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const userId = sessionStorage.getItem('userId') || Cookies.get('userId') || '';
    const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole') || '';
    const userName = sessionStorage.getItem('userName') || Cookies.get('userName') || '';
    const phoneNumber = sessionStorage.getItem('phoneNumber') || Cookies.get('phoneNumber') || '';

    if (!userId || !userRole) {
      navigate('/login');
      return;
    }

    setUserInfo({ userId, userName, phoneNumber, userRole });
    fetchUserRequests(userId);
  }, [navigate]);

  const fetchUserRequests = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/task-requests/user/${userId}`);
      setUserRequests(response.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to fetch your requests');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For this example, we'll just store the file name
      // In a real application, you'd want to handle file upload to a server
      setFormData(prev => ({
        ...prev,
        photo: `/path/to/${file.name}` // Simulating a file path
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Create request object in the required format
    const requestData = {
      user: { userId: parseInt(userInfo.userId) }, // Ensure userId is a number
      requestTitle: formData.requestTitle,
      requestDescription: formData.requestDescription,
      location: formData.location,
      photo: formData.photo
    };

    try {
      const response = await axios.post('http://localhost:8080/api/task-requests', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setSuccessMessage('Request submitted successfully!');
      setFormData({
        requestTitle: '',
        requestDescription: '',
        location: '',
        photo: ''
      });
      fetchUserRequests(userInfo.userId);
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

     

      <main className="w-full px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Submit Assistance Request
            </h1>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                {successMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
  <input type="hidden" name="userId" value={userInfo.userId} />

  {/* User's Name Field */}
  <div>
    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
      Your Name
    </label>
    <input
      type="text"
      id="userName"
      name="userName"
      value={userInfo.userName}
      readOnly
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 focus:ring-0"
    />
  </div>
              
              <div>
                <label htmlFor="requestTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Request Title
                </label>
                <input
                  type="text"
                  id="requestTitle"
                  name="requestTitle"
                  value={formData.requestTitle}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Location Dropdown */}
  <div>
    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
      Location
    </label>
    <select
      id="location"
      name="location"
      value={formData.location}
      onChange={handleInputChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      required
    >
      <option value="">Select a location</option>
      <option value="Changanasserry">Changanasserry</option>
      <option value="Chinganavanam">Chinganavanam</option>
      <option value="Kumarakom">Kumarakom</option>
      <option value="Mundakayam">Mundakayam</option>
      <option value="Kanjirappally">Kanjirappally</option>
      <option value="Karukachal">Karukachal</option>
    </select>
  </div>

              <div>
                <label htmlFor="requestDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="requestDescription"
                  name="requestDescription"
                  value={formData.requestDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                  Photo (Optional)
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transition-colors duration-200`}
                >
                  {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Previous Requests</h2>
            
            <div className="space-y-4">
              {userRequests.map((request) => (
                <div 
                  key={request.requestId} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{request.requestTitle}</h3>
                      <p className="text-gray-600 mt-1">{request.requestDescription}</p>
                      <p className="text-sm text-gray-500 mt-2">Location: {request.location}</p>
                      <p className="text-sm text-gray-500">
                        Submitted: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}

              {userRequests.length === 0 && (
                <p className="text-gray-500 text-center py-4">No previous requests found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}