import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { MapPin, AlertTriangle, Users, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function DisasterUpdates() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchActiveDisasters = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/disasters?status=ACTIVE');
        setUpdates(response.data);
      } catch (error) {
        console.error('Error fetching active disasters:', error);
      }
    };

    fetchActiveDisasters();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-screen px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Active Disaster Updates</h1>
          <p className="text-xl text-gray-600">
            Stay informed about ongoing disasters and relief operations
          </p>
        </div>

        {updates.length === 0 ? (
          <div className="text-center text-lg text-gray-600">
            No active disasters at the moment. Please check back later.
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {updates.map((update) => (
                <div key={update.disasterId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">{update.disasterType || 'Unknown Type'}</h2>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          update.status === 'Active'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {update.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                          <span>{update.location || 'Location not available'}</span>
                        </div>
                        <p className="text-gray-600">{update.description || 'No description available.'}</p>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-5 w-5 mr-2 flex-shrink-0" />
                          <span>
                            {update.volunteers
                              ? `${update.volunteers} volunteers deployed`
                              : 'Volunteers info not available'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">People Affected</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {update.affected ? update.affected.toLocaleString() : 'Data not available'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Severity Level</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {update.severity || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end items-center pt-4 border-t border-gray-200">
                      <a
                        href={`/updates/${update.disasterId}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
