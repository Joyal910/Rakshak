import React, { useState, useEffect } from 'react';
import { Package, Filter } from 'lucide-react';
import axios from 'axios';

function ResourceRequests() {
  const [resourceRequests, setResourceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResourceRequests();
  }, []);

  const fetchResourceRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/resource-requests/admin');
      // Sort requests when fetching - assuming newer requests have higher IDs
      const sortedRequests = response.data.sort((a, b) => {
        // First prioritize PENDING status
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (b.status === 'PENDING' && a.status !== 'PENDING') return 1;
        
        // Then sort by requestId in descending order (assuming newer requests have higher IDs)
        return b.requestId - a.requestId;
      });
      setResourceRequests(sortedRequests);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch resource requests');
      setLoading(false);
    }
  };

  const handleResourceApprove = async (requestId) => {
    try {
      await axios.put(`http://localhost:8080/api/resource-requests/accept-allocate/${requestId}`);
      fetchResourceRequests();
    } catch (err) {
      setError('Failed to approve resource request');
    }
  };

  const handleResourceReject = async (requestId) => {
    try {
      await axios.put(`http://localhost:8080/api/resource-requests/reject/${requestId}`);
      fetchResourceRequests();
    } catch (err) {
      setError('Failed to reject resource request');
    }
  };

  const renderStatusBadge = (status) => {
    const statusStyles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      ALLOCATED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const groupRequestsByPriority = (requests) => {
    const grouped = {
      pending: requests.filter(req => req.status === 'PENDING'),
      other: requests.filter(req => req.status !== 'PENDING')
    };

    // Sort both groups by requestId in descending order
    grouped.pending.sort((a, b) => b.requestId - a.requestId);
    grouped.other.sort((a, b) => b.requestId - a.requestId);

    return grouped;
  };

  const renderRequestsTable = (requests) => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Resource
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Requester
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Quantity
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Location
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {requests.map((request) => (
          <tr key={request.requestId}>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm font-medium text-gray-900">
                {request.resourceName}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm text-gray-500">
                {request.userName}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm text-gray-500">
                {request.requestedQuantity}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm text-gray-500">
                {request.location}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {renderStatusBadge(request.status)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button 
                className="text-indigo-600 hover:text-indigo-900 mr-3"
                onClick={() => {/* Add view details logic */}}
              >
                View
              </button>
              {request.status === 'PENDING' && (
                <>
                  <button 
                    className="text-green-600 hover:text-green-900 mr-3"
                    onClick={() => handleResourceApprove(request.requestId)}
                  >
                    Approve
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleResourceReject(request.requestId)}
                  >
                    Reject
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const groupedRequests = groupRequestsByPriority(resourceRequests);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Resource Requests</h2>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={20} className="mr-2" />
            Filter
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            New Request
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button className="py-4 px-6 border-b-2 border-indigo-500 text-indigo-600 font-medium text-sm">
              <Package size={20} className="inline-block mr-2" />
              Resource Requests
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-4">Loading resource requests...</div>
            ) : error ? (
              <div className="text-red-600 text-center py-4">{error}</div>
            ) : (
              <div className="space-y-8">
                {groupedRequests.pending.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      New Requests
                    </h3>
                    {renderRequestsTable(groupedRequests.pending)}
                  </div>
                )}
                {groupedRequests.other.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Other Requests
                    </h3>
                    {renderRequestsTable(groupedRequests.other)}
                  </div>
                )}
              </div>
            )}
            {!loading && resourceRequests.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No resource requests found
              </div>
            )}
          </div>
          {!loading && error && (
            <div className="text-red-600 text-center py-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResourceRequests;