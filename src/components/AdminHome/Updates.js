import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Updates() {
  const [disasters, setDisasters] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingDisaster, setEditingDisaster] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [disasterToDelete, setDisasterToDelete] = useState(null);
  const [newDisaster, setNewDisaster] = useState({
    name: '',
    description: '',
    location: '',
    disasterType: 'FLOOD',
    severity: 'LOW',
    status: 'ACTIVE'
  });

  // Fetch disasters from backend
  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/disasters');
        // Sort disasters by ID (newest first) within each category
        const sortedDisasters = response.data.sort((a, b) => b.disasterId - a.disasterId);
        setDisasters(sortedDisasters);
      } catch (error) {
        console.error('Error fetching disasters:', error);
      }
    };
    fetchDisasters();
  }, []);

  // Group disasters by priority and status
  const groupedDisasters = {
    highPriorityActive: disasters.filter(d => d.status === 'ACTIVE' && d.severity === 'HIGH'),
    otherActive: disasters.filter(d => d.status === 'ACTIVE' && d.severity !== 'HIGH'),
    resolved: disasters.filter(d => d.status === 'RESOLVED')
  };

  

  // Handle edit button click
  const handleEditClick = (disaster) => {
    setEditingDisaster({ ...disaster });
  };

  // Handle update disaster
  const handleUpdateDisaster = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/disasters/${editingDisaster.disasterId}`, editingDisaster);
      setDisasters(disasters.map(d => 
        d.disasterId === editingDisaster.disasterId ? response.data : d
      ));
      setEditingDisaster(null);
    } catch (error) {
      console.error('Error updating disaster:', error);
    }
  };

  // Handle new disaster submission
  const handlePostDisaster = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/disasters', newDisaster);
      setDisasters([...disasters, response.data]);
      setIsPostModalOpen(false);
      // Reset form
      setNewDisaster({
        name: '',
        description: '',
        location: '',
        disasterType: 'FLOOD',
        severity: 'LOW',
        status: 'ACTIVE'
      });
    } catch (error) {
      console.error('Error posting disaster:', error);
    }
  };

  // Confirm delete disaster
  const confirmDeleteDisaster = (id) => {
    setDisasterToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  // Handle delete disaster
  const handleDeleteDisaster = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/disasters/${disasterToDelete}`);
      setDisasters(disasters.filter(d => d.disasterId !== disasterToDelete));
      setIsDeleteConfirmOpen(false);
      setDisasterToDelete(null);
    } catch (error) {
      console.error('Error deleting disaster:', error);
    }
  };

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
          <p className="text-sm text-gray-500 mt-2">Are you sure you want to delete this disaster record?</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteDisaster}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Disaster Updates</h2>
        <button 
          onClick={() => setIsPostModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Post Disaster
        </button>
      </div>

      {/* Disasters List */}
      <div className="space-y-4">
        {disasters.map((disaster) => (
          <div
            key={disaster.disasterId}
            className="bg-white shadow-sm rounded-lg p-6 border border-gray-200"
          >
            {editingDisaster && editingDisaster.disasterId === disaster.disasterId ? (
              // Edit Mode
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editingDisaster.name}
                    onChange={(e) => setEditingDisaster({...editingDisaster, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editingDisaster.description}
                    onChange={(e) => setEditingDisaster({...editingDisaster, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={editingDisaster.location}
                    onChange={(e) => setEditingDisaster({...editingDisaster, location: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Disaster Type</label>
                  <select
                    value={editingDisaster.disasterType}
                    onChange={(e) => setEditingDisaster({...editingDisaster, disasterType: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="FLOOD">Flood</option>
                    <option value="EARTHQUAKE">Earthquake</option>
                    <option value="FIRE">Fire</option>
                    <option value="CYCLONE">Cyclone</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Severity</label>
                  <select
                    value={editingDisaster.severity}
                    onChange={(e) => setEditingDisaster({...editingDisaster, severity: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editingDisaster.status}
                    onChange={(e) => setEditingDisaster({...editingDisaster, status: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button 
                    onClick={handleUpdateDisaster}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditingDisaster(null)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {disaster.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      disaster.severity === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : disaster.severity === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {disaster.severity} Priority
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{disaster.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{disaster.location}</span>
                  <span>{new Date(disaster.reportedAt).toLocaleString()}</span>
                </div>
                <div className="mt-2 mb-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      disaster.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : disaster.status === 'INACTIVE'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {disaster.status}
                  </span>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <button 
                    onClick={() => handleEditClick(disaster)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => confirmDeleteDisaster(disaster.disasterId)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Post Disaster Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Post New Disaster</h3>
              <div className="mt-4 px-4">
                <input
                  type="text"
                  placeholder="Disaster Name"
                  value={newDisaster.name}
                  onChange={(e) => setNewDisaster({...newDisaster, name: e.target.value})}
                  className="mb-4 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <textarea
                  placeholder="Description"
                  value={newDisaster.description}
                  onChange={(e) => setNewDisaster({...newDisaster, description: e.target.value})}
                  className="mb-4 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newDisaster.location}
                  onChange={(e) => setNewDisaster({...newDisaster, location: e.target.value})}
                  className="mb-4 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <select
                  value={newDisaster.disasterType}
                  onChange={(e) => setNewDisaster({...newDisaster, disasterType: e.target.value})}
                  className="mb-4 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="FLOOD">Flood</option>
                  <option value="EARTHQUAKE">Earthquake</option>
                  <option value="FIRE">Fire</option>
                  <option value="CYCLONE">Cyclone</option>
                  <option value="OTHER">Other</option>
                </select>
                <select
                  value={newDisaster.severity}
                  onChange={(e) => setNewDisaster({...newDisaster, severity: e.target.value})}
                  className="mb-4 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                <select
                  value={newDisaster.status}
                  onChange={(e) => setNewDisaster({...newDisaster, status: e.target.value})}
                  className="mb-4 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
                <div className="flex justify-between">
                  <button
                    onClick={handlePostDisaster}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Submit Disaster
                  </button>
                  <button
                    onClick={() => setIsPostModalOpen(false)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && <DeleteConfirmModal />}
    </div>
  );
}

export default Updates;