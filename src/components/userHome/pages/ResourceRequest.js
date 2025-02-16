import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Header from '../components/Header';

export default function ResourceRequest() {
  const navigate = useNavigate();
  const [resourceId, setResourceId] = useState('');
  const [location, setLocation] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState('');
  const [resources, setResources] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState({
    userId: '',
    userName: '',
    phoneNumber: '',
    userRole: ''
  });

  // Check for session and fetch initial data
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

    // Fetch resources and user's past requests
    const fetchData = async () => {
      try {
        const [resourcesResponse, requestsResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/resource-requests/resources'),
          axios.get(`http://localhost:8080/api/resource-requests/user/${userId}`)
        ]);
        setResources(resourcesResponse.data);
        setUserRequests(requestsResponse.data);
      } catch (error) {
        setError('Failed to load data: ' + error.message);
      }
    };

    fetchData();
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestPayload = {
        userId: parseInt(userInfo.userId),
        resourceId,
        location,
        requestedQuantity: parseInt(requestedQuantity, 10),
      };
      const response = await axios.post('http://localhost:8080/api/resource-requests/request', requestPayload);
      alert(response.data);
      
      // Refresh user requests after submission
      const updatedRequests = await axios.get(`http://localhost:8080/api/resource-requests/user/${userInfo.userId}`);
      setUserRequests(updatedRequests.data);
      
      // Clear form
      setResourceId('');
      setLocation('');
      setRequestedQuantity('');
    } catch (error) {
      setError('Failed to create resource request: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-screen px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Resource Request Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Request Resources</h1>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="userId" value={userInfo.userId} />

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
                <label htmlFor="resourceId" className="block text-sm font-medium text-gray-700 mb-1">
                  Resource
                </label>
                <select
                  id="resourceId"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                  required
                >
                  <option value="">Select a resource</option>
                  {resources.map((resource) => (
                    <option key={resource.resourceId} value={resource.resourceId}>
                      {resource.name} ({resource.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  id="location"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                >
                  <option value="" disabled>Select your location</option>
                  <option value="Changanasserry">Changanasserry</option>
                  <option value="Chinganavanam">Chinganavanam</option>
                  <option value="Kumarakom">Kumarakom</option>
                  <option value="Mundakayam">Mundakayam</option>
                  <option value="Kanjirappally">Kanjirappally</option>
                  <option value="Karukachal">Karukachal</option>
                </select>
              </div>

              <div>
                <label htmlFor="requestedQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Requested Quantity
                </label>
                <input
                  type="number"
                  id="requestedQuantity"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>

          {/* Past Requests Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Past Requests</h2>
            
            <div className="space-y-4">
              {userRequests.length > 0 ? (
                userRequests.map((request) => (
                  <div key={request.requestId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{request.resourceName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {request.requestedQuantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Location: {request.location}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                        request.status === 'ALLOCATED' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No previous requests found</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}