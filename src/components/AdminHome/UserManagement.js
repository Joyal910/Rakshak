import React, { useEffect, useState } from 'react';
import { Ban, UserX, CheckCircle, Edit, Save } from 'lucide-react';
import axios from 'axios';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === 'all') return true;
    return user.userStatus.toLowerCase() === filter.toLowerCase();
  });

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const user = users.find(u => u.userId === userId);
      const updatedUser = { ...user, userStatus: newStatus };
      await axios.put(`http://localhost:8080/api/users/${userId}`, updatedUser);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdate = (user) => {
    setEditingUser(user.userId);
    setEditFormData(user);
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveUpdate = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/api/users/${userId}`, editFormData);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers
                .filter((user) =>
                  user.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                  <tr key={user.userId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.userId ? (
                        <div className="flex flex-col space-y-2">
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditInputChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleEditInputChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.userId ? (
                        <select
                          name="role"
                          value={editFormData.role}
                          onChange={handleEditInputChange}
                          className="w-full px-2 py-1 border rounded"
                        >
                          <option value="User">User</option>
                          <option value="Volunteer">Volunteer</option>
                        </select>
                      ) : (
                        <span className="text-sm text-gray-500">{user.role}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.userStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.userStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.userId ? (
                        <input
                          type="text"
                          name="phoneNumber"
                          value={editFormData.phoneNumber}
                          onChange={handleEditInputChange}
                          className="w-full px-2 py-1 border rounded"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">
                          {user.phoneNumber}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.userId ? (
                        <input
                          type="text"
                          name="location"
                          value={editFormData.location}
                          onChange={handleEditInputChange}
                          className="w-full px-2 py-1 border rounded"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">
                          {user.location}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        {editingUser === user.userId ? (
                          <>
                            <button
                              onClick={() => handleSaveUpdate(user.userId)}
                              className="text-green-600 hover:text-green-900 flex items-center"
                            >
                              <Save size={16} className="mr-1" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900 flex items-center"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {user.userStatus === 'active' ? (
                              <button
                                onClick={() =>
                                  handleStatusChange(user.userId, 'blocked')
                                }
                                className="text-red-600 hover:text-red-900 flex items-center"
                              >
                                <Ban size={16} className="mr-1" />
                                Block
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleStatusChange(user.userId, 'active')
                                }
                                className="text-green-600 hover:text-green-900 flex items-center"
                              >
                                <CheckCircle size={16} className="mr-1" />
                                Unblock
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(user.userId)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <UserX size={16} className="mr-1" />
                              Delete
                            </button>
                            <button
                              onClick={() => handleUpdate(user)}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <Edit size={16} className="mr-1" />
                              Update
                            </button>
                          </>
                        )}
                      </div>
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

export default UserManagement;