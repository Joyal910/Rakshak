import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import axios from 'axios';

function VolunteerApplications() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch and sort applications from backend
  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/volunteer-applications');
      // Sort applications by status (PENDING first) and then by ID (newest first)
      const sortedApplications = response.data.sort((a, b) => {
        // First prioritize PENDING status
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (b.status === 'PENDING' && a.status !== 'PENDING') return 1;
        
        // Then sort by applicationId in descending order (newer first)
        return b.applicationId - a.applicationId;
      });
      setApplications(sortedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle application approval
  const handleApprove = async (applicationId) => {
    try {
      await axios.put(`http://localhost:8080/volunteer-applications/${applicationId}/accept`);
      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  // Handle application rejection
  const handleReject = async (applicationId) => {
    try {
      await axios.put(`http://localhost:8080/volunteer-applications/${applicationId}/reject`);
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group and filter applications
  const getGroupedAndFilteredApplications = () => {
    const filtered = applications.filter((application) => {
      if (filter === 'all') return true;
      return application.status.toLowerCase() === filter.toLowerCase();
    });

    return {
      pending: filtered.filter(app => app.status === 'PENDING'),
      others: filtered.filter(app => app.status !== 'PENDING')
    };
  };

  // View application details
  const handleViewDetails = async (applicationId) => {
    try {
      const response = await axios.get(`http://localhost:8080/volunteer-applications/${applicationId}`);
      setSelectedApplication(response.data);
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
  };

  const groupedApplications = getGroupedAndFilteredApplications();

  const renderApplicationGroup = (applications, title) => (
    applications.length > 0 && (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {applications.map((application) => (
          <div
            key={application.applicationId}
            className="bg-white shadow-sm rounded-lg p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {application.username}
                </h3>
                <p className="text-sm text-gray-500">{application.email}</p>
                <p className="text-sm text-gray-500">{application.phoneNumber}</p>
                <p className="text-sm text-gray-500">Location: {application.location}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Applied on: {formatDate(application.applicationDate)}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  application.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : application.status === 'APPROVED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {application.status}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Application Details</h4>
              <p className="mt-1 text-sm text-gray-500">{application.description}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => handleViewDetails(application.applicationId)}
                  className="flex items-center text-indigo-600 hover:text-indigo-900"
                >
                  <Eye size={16} className="mr-1" />
                  View Details
                </button>
                {application.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleApprove(application.applicationId)}
                      className="flex items-center text-green-600 hover:text-green-900"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(application.applicationId)}
                      className="flex items-center text-red-600 hover:text-red-900"
                    >
                      <XCircle size={16} className="mr-1" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Volunteer Applications</h2>
        <div className="flex space-x-4">
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-8">
        {renderApplicationGroup(groupedApplications.pending, "New Applications")}
        {renderApplicationGroup(groupedApplications.others, "Other Applications")}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Application Details</h2>
            <div className="space-y-3">
              <p><strong>Name:</strong> {selectedApplication.username}</p>
              <p><strong>Email:</strong> {selectedApplication.email}</p>
              <p><strong>Phone:</strong> {selectedApplication.phoneNumber}</p>
              <p><strong>Location:</strong> {selectedApplication.location}</p>
              <p><strong>Status:</strong> {selectedApplication.status}</p>
              <p><strong>Applied on:</strong> {formatDate(selectedApplication.applicationDate)}</p>
              <p><strong>Description:</strong> {selectedApplication.description}</p>
            </div>
            <button
              onClick={() => setSelectedApplication(null)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VolunteerApplications;