import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      // Filter only users with role "Volunteer"
      const volunteerUsers = response.data.filter(user => user.role === "Volunteer");
      setVolunteers(volunteerUsers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch volunteers');
      setLoading(false);
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      const userToUpdate = volunteers.find(v => v.userId === userId);
      const updatedUser = {
        ...userToUpdate,
        role: 'User'
      };
      
      await axios.put(`http://localhost:8080/api/users/${userId}`, updatedUser);
      fetchVolunteers(); // Refresh the list
    } catch (err) {
      setError('Failed to deactivate volunteer');
    }
  };

  const handleBlock = async (userId) => {
    try {
      const userToUpdate = volunteers.find(v => v.userId === userId);
      const updatedUser = {
        ...userToUpdate,
        userStatus: 'blocked'
      };
      
      await axios.put(`http://localhost:8080/api/users/${userId}`, updatedUser);
      fetchVolunteers(); // Refresh the list
    } catch (err) {
      setError('Failed to block volunteer');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Volunteer Management</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Add Volunteer
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {volunteers.map((volunteer) => (
                <tr key={volunteer.userId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {volunteer.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{volunteer.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{volunteer.phoneNumber}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        volunteer.userStatus === 'active'
                          ? 'bg-green-100 text-green-800'
                          : volunteer.userStatus === 'blocked'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {volunteer.userStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{volunteer.location}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => handleDeactivate(volunteer.userId)}
                    >
                      Deactivate
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleBlock(volunteer.userId)}
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Volunteers;