import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Filter,
  FileText,
  X,
  Search,
  ChevronDown,
  Loader,
  Eye
} from 'lucide-react';

// Simple Alert components since @/components/ui/alert is not available
const Alert = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-blue-50 text-blue-800 border-blue-200',
    destructive: 'bg-red-50 text-red-800 border-red-200'
  };
  
  return (
    <div className={`p-4 rounded-lg border ${styles[variant]}`}>
      {children}
    </div>
  );
};

const AlertTitle = ({ children }) => (
  <h5 className="font-medium mb-1">{children}</h5>
);

const AlertDescription = ({ children }) => (
  <p>{children}</p>
);

export default function AdminTaskManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    dateRange: 'all',
    location: 'all',
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const userRole = sessionStorage.getItem('userRole');

    if (!userId || !userRole) {
      navigate('/login');
      return;
    }

    if (userRole !== 'Admin') {
      navigate('/unauthorized');
      return;
    }
  }, [navigate]);

  const getCurrentData = useCallback(() => {
    switch (activeTab) {
      case 'pending':
        return pendingRequests;
      case 'approved':
        return approvedTasks;
      case 'rejected':
        return rejectedRequests;
      default:
        return [];
    }
  }, [activeTab, pendingRequests, approvedTasks, rejectedRequests]);

  const fetchData = useCallback(async (retryCount = 0) => {
    setLoading(true);
    setError('');
    try {
      const endpoint = `http://localhost:8080/api/task-requests/status/${activeTab.toUpperCase()}`;
      const response = await axios.get(endpoint);
      const sortedData = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      switch (activeTab) {
        case 'pending':
          setPendingRequests(sortedData);
          break;
        case 'approved':
          setApprovedTasks(sortedData);
          break;
        case 'rejected':
          setRejectedRequests(sortedData);
          break;
        default:
          console.warn('Unknown tab:', activeTab);
      }
    } catch (err) {
      if (retryCount < 3) {
        setTimeout(() => fetchData(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        setError('Failed to fetch data: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = useMemo(() => {
    let data = getCurrentData();
    
    if (searchTerm) {
      data = data.filter(item => 
        item.requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterOptions.location !== 'all') {
      data = data.filter(item => item.location === filterOptions.location);
    }

    if (filterOptions.dateRange !== 'all') {
      const now = new Date();
      const past = new Date();
      switch(filterOptions.dateRange) {
        case 'week':
          past.setDate(past.getDate() - 7);
          break;
        case 'month':
          past.setMonth(past.getMonth() - 1);
          break;
        case 'quarter':
          past.setMonth(past.getMonth() - 3);
          break;
        default:
          console.warn('Unknown date range:', filterOptions.dateRange);
      }
      data = data.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= past && itemDate <= now;
      });
    }

    return data;
  }, [getCurrentData, searchTerm, filterOptions]);

  const handleActionWithOptimisticUpdate = async (action, requestId) => {
    const originalData = getCurrentData();
    try {
      const updatedData = originalData.filter(item => item.requestId !== requestId);
      switch (activeTab) {
        case 'pending':
          setPendingRequests(updatedData);
          break;
        case 'approved':
          setApprovedTasks(updatedData);
          break;
        case 'rejected':
          setRejectedRequests(updatedData);
          break;
        default:
          console.warn('Unknown tab:', activeTab);
      }

      await axios.post(`http://localhost:8080/api/task-requests/${requestId}/${action}`);
      fetchData();
    } catch (err) {
      switch (activeTab) {
        case 'pending':
          setPendingRequests(originalData);
          break;
        case 'approved':
          setApprovedTasks(originalData);
          break;
        case 'rejected':
          setRejectedRequests(originalData);
          break;
        default:
          console.warn('Unknown tab:', activeTab);
      }
      setError(`Failed to ${action} request: ${err.message}`);
    }
  };

  const handleAdminRemarkSubmit = async () => {
    if (!selectedRequest || !adminRemarks.trim()) return;

    try {
      await axios.post(`http://localhost:8080/api/task-requests/${selectedRequest.requestId}/admin-remarks`, {
        remarks: adminRemarks
      });
      setAdminRemarks('');
      setShowRemarksModal(false);
      fetchData();
    } catch (err) {
      setError('Failed to submit remarks: ' + err.message);
    }
  };

  const renderStatusBadge = (status) => {
    const statusStyles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-purple-100 text-purple-800',
      REJECTED: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const DetailModal = ({ request, onClose }) => {
    if (!request) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Request Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Task Information</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Title:</span> {request.requestTitle}</p>
                <p><span className="font-medium">Description:</span> {request.requestDescription}</p>
                <p><span className="font-medium">Location:</span> {request.location}</p>
                <p><span className="font-medium">Status:</span> {renderStatusBadge(request.status)}</p>
                <p><span className="font-medium">Created:</span> {new Date(request.createdAt).toLocaleString()}</p>
                {request.updatedAt && (
                  <p><span className="font-medium">Last Updated:</span> {new Date(request.updatedAt).toLocaleString()}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Requester Information</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Name:</span> {request.user.name}</p>
                <p><span className="font-medium">Email:</span> {request.user.email}</p>
                <p><span className="font-medium">Phone:</span> {request.user.phoneNumber}</p>
              </div>
            </div>

            {request.task?.volunteer && (
              <div>
                <h3 className="font-semibold text-gray-900">Volunteer Information</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Name:</span> {request.task.volunteer.name}</p>
                  <p><span className="font-medium">Email:</span> {request.task.volunteer.email}</p>
                  <p><span className="font-medium">Phone:</span> {request.task.volunteer.phoneNumber}</p>
                </div>
              </div>
            )}

            {(request.adminRemarks || request.task?.volunteerRemarks) && (
              <div>
                <h3 className="font-semibold text-gray-900">Remarks</h3>
                <div className="mt-2 space-y-2">
                  {request.adminRemarks && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Admin Remarks:</p>
                      <p className="text-gray-600">{request.adminRemarks}</p>
                    </div>
                  )}
                  {request.task?.volunteerRemarks && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Volunteer Remarks:</p>
                      <p className="text-gray-600">{request.task.volunteerRemarks}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {request.status === 'PENDING' && (
              <>
                <button
                  onClick={() => {
                    handleActionWithOptimisticUpdate('approve', request.requestId);
                    onClose();
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleActionWithOptimisticUpdate('reject', request.requestId);
                    onClose();
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => {
                setSelectedRequest(request);
                setShowRemarksModal(true);
                onClose();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Remarks
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RemarksModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Admin Remarks</h2>
          <button onClick={() => setShowRemarksModal(false)} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <textarea
          value={adminRemarks}
          onChange={(e) => setAdminRemarks(e.target.value)}
          className="w-full h-32 p-2 border rounded-lg resize-none"
          placeholder="Enter your remarks..."
        />
        
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={() => setShowRemarksModal(false)}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdminRemarkSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Request Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={20} className="mr-2" />
              Filter
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Range</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      value={filterOptions.dateRange}
                      onChange={(e) => setFilterOptions(prev => ({...prev, dateRange: e.target.value}))}
                    >
                      <option value="all">All Time</option>
                      <option value="week">Past Week</option>
                      <option value="month">Past Month</option>
                      <option value="quarter">Past Quarter</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      value={filterOptions.location}
                      onChange={(e) => setFilterOptions(prev => ({...prev, location: e.target.value}))}
                    >
                      <option value="all">All Locations</option>
                      <option value="Kumarakom">Kumarakom</option>
                      <option value="Kanjirappally">Kanjirappally</option>
                      <option value="Mundakayam">Mundakayam</option>
                      <option value="Changanasserry">Changanasserry</option>
                      <option value="Karukachal">Karukachal</option>
                    </select>
                  </div>

                  {activeTab === 'approved' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Task Status</label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={filterOptions.status}
                        onChange={(e) => setFilterOptions(prev => ({...prev, status: e.target.value}))}
                      >
                        <option value="all">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-6 border-b-2 text-sm font-medium ${
                activeTab === 'pending'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={20} className="inline-block mr-2" />
              Pending Requests
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`py-4 px-6 border-b-2 text-sm font-medium ${
                activeTab === 'approved'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CheckCircle size={20} className="inline-block mr-2" />
              Approved Tasks
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`py-4 px-6 border-b-2 text-sm font-medium ${
                activeTab === 'rejected'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <XCircle size={20} className="inline-block mr-2" />
              Rejected Requests
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="animate-spin mr-2" size={24} />
                <span>Loading requests...</span>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No requests found
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  {activeTab === 'approved' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volunteer
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {activeTab === 'pending' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                  {activeTab === 'approved' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((request) => (
                  <tr key={request.requestId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {request.requestTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{request.user.name}</p>
                        <p className="text-gray-500">{request.user.email}</p>
                        <p className="text-gray-500">{request.user.phoneNumber}</p>
                      </div>
                    </td>
                    {activeTab === 'approved' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {request.task?.volunteer ? (
                            <>
                              <p className="font-medium text-gray-900">{request.task.volunteer.name}</p>
                              <p className="text-gray-500">{request.task.volunteer.email}</p>
                              <p className="text-gray-500">{request.task.volunteer.phoneNumber}</p>
                            </>
                          ) : (
                            <span className="text-gray-500">Not assigned</span>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={16} className="mr-1" />
                        {request.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-1" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activeTab === 'approved' ? (
                        renderStatusBadge(request.task?.status || 'PENDING')
                      ) : (
                        renderStatusBadge(request.status)
                      )}
                    </td>
                    {activeTab === 'pending' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleActionWithOptimisticUpdate('approve', request.requestId)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleActionWithOptimisticUpdate('reject', request.requestId)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                    {activeTab === 'approved' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRemarksModal(true);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Add Remarks
                        </button>
                        {request.adminRemarks && (
                          <div className="mt-2 text-sm text-gray-500">
                            <p className="font-medium">Admin: {request.adminRemarks}</p>
                          </div>
                        )}
                        {request.task?.volunteerRemarks && (
                          <div className="mt-2 text-sm text-gray-500">
                            <p className="font-medium">Volunteer: {request.task.volunteerRemarks}</p>
                          </div>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        className="flex items-center text-indigo-600 hover:text-indigo-900"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailModal(true);
                        }}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>

      {showDetailModal && (
        <DetailModal 
          request={selectedRequest} 
          onClose={() => {
            setShowDetailModal(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {showRemarksModal && <RemarksModal />}
    </div>
  );
}