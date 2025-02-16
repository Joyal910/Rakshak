import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function UserRequests() {
  const isLoggedIn = false; // Replace with your auth logic
  const requests = []; // Replace with your requests data

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <AlertCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Your Requests</h3>
        <p className="text-gray-600 mb-4">You need to log in to track your requests.</p>
        <a
          href="/login"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Log in here
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Requests</h3>
        <a
          href="/requests"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View All Requests
        </a>
      </div>
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="border-l-4 border-blue-500 pl-4 py-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    Request ID: #{request.id}
                  </span>
                  {request.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                  ) : (
                    <Clock className="h-4 w-4 text-blue-500 ml-2" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{request.type}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  request.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {request.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
                {request.assignedTo && (
                  <p className="text-xs text-gray-500 mt-1">
                    Assigned to: {request.assignedTo}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}