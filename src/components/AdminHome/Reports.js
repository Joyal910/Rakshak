import React from 'react';

function Reports() {
  const reports = [
    {
      id: 1,
      title: 'Monthly Emergency Response Summary',
      type: 'Summary',
      date: '2024-02-01',
      status: 'Generated',
    },
    {
      id: 2,
      title: 'Resource Allocation Analysis',
      type: 'Analysis',
      date: '2024-02-15',
      status: 'Pending',
    },
    {
      id: 3,
      title: 'Volunteer Performance Report',
      type: 'Performance',
      date: '2024-02-20',
      status: 'Generated',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="space-x-4">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Generate Report
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Response Time
          </h3>
          <p className="text-3xl font-bold text-indigo-600">15.5 min</p>
          <p className="text-sm text-gray-500 mt-2">Average response time</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resource Usage
          </h3>
          <p className="text-3xl font-bold text-indigo-600">78%</p>
          <p className="text-sm text-gray-500 mt-2">Resource utilization rate</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Volunteer Activity
          </h3>
          <p className="text-3xl font-bold text-indigo-600">92%</p>
          <p className="text-sm text-gray-500 mt-2">Active volunteer rate</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {report.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Type: {report.type} | Generated: {report.date}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'Generated'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {report.status}
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-900">
                    View
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;