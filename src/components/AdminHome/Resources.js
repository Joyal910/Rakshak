import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Resources() {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    name: '',
    type: '',
    availableQuantity: 0
  });
  const [replenishModal, setReplenishModal] = useState({
    show: false,
    resourceId: null,
    quantity: 0
  });

  const getStockStatus = (quantity) => {
    if (quantity < 10) return { status: 'Low Stock', color: 'bg-red-100 text-red-800' };
    if (quantity >= 10 && quantity <= 40) return { status: 'Medium Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Plenty Stock', color: 'bg-green-100 text-green-800' };
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/resource-requests/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddResource = async () => {
    try {
      await axios.post('http://localhost:8080/api/resource-requests/resources', newResource);
      fetchResources();
      setNewResource({ name: '', type: '', availableQuantity: 0 });
      document.getElementById('add-resource-modal').close();
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  const handleReplenish = async () => {
    try {
      await axios.put(`http://localhost:8080/api/resource-requests/replenish/${replenishModal.resourceId}`, { 
        quantityToAdd: replenishModal.quantity 
      });
      fetchResources();
      setReplenishModal({ show: false, resourceId: null, quantity: 0 });
    } catch (error) {
      console.error('Error replenishing resource:', error);
    }
  };

  const handleDelete = async (resourceId) => {
    try {
      await axios.delete(`http://localhost:8080/api/resource-requests/resources/${resourceId}`);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Resource Inventory</h2>
          <div className="space-x-4">
            <button 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              onClick={() => document.getElementById('add-resource-modal').showModal()}
            >
              Post Resource
            </button>
          </div>
        </div>

        {/* Replenish Modal */}
        {replenishModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-lg font-semibold mb-4">Replenish Resource</h3>
              <input 
                type="number" 
                value={replenishModal.quantity}
                onChange={(e) => setReplenishModal(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                className="input input-bordered w-full mb-4"
                placeholder="Enter quantity to replenish"
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setReplenishModal({ show: false, resourceId: null, quantity: 0 })}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReplenish}
                  className="btn btn-primary"
                >
                  Replenish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Resource Modal */}
        <dialog id="add-resource-modal" className="modal">
          <div className="modal-box w-96">
            <h3 className="font-bold text-lg text-center">Add New Resource</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={newResource.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input 
                  type="text" 
                  name="type"
                  value={newResource.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Available Quantity</label>
                <input 
                  type="number" 
                  name="availableQuantity"
                  value={newResource.availableQuantity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                />
              </div>
            </div>
            <div className="modal-action flex justify-center space-x-4">
              <button 
                onClick={handleAddResource}
                className="btn btn-primary"
              >
                Add Resource
              </button>
              <button 
                onClick={() => document.getElementById('add-resource-modal').close()}
                className="btn btn-ghost"
              >
                Close
              </button>
            </div>
          </div>
        </dialog>

        <div className="bg-white shadow-sm rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => {
                  const stockStatus = getStockStatus(resource.availableQuantity);
                  return (
                    <tr key={resource.resourceId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{resource.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{resource.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${stockStatus.color} px-2 py-1 rounded-full`}>
                          {resource.availableQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-medium ${stockStatus.color} px-2 py-1 rounded-full`}>
                          {stockStatus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => setReplenishModal({ 
                            show: true, 
                            resourceId: resource.resourceId, 
                            quantity: 0 
                          })} 
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Replenish
                        </button>
                        <button 
                          onClick={() => handleDelete(resource.resourceId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;