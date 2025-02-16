import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import axios from 'axios';

export default function DisasterUpdates() {
  const [updates, setUpdates] = useState([]);

  // Fetch active disasters from the backend
  useEffect(() => {
    const fetchActiveDisasters = async () => {
      try {
        // Assuming your backend endpoint for fetching active disasters is this
        const response = await axios.get('http://localhost:8080/api/disasters?status=ACTIVE');
        setUpdates(response.data);
      } catch (error) {
        console.error('Error fetching active disasters:', error);
      }
    };

    fetchActiveDisasters();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Disasters</h2>
      <div className="space-y-4">
        {updates.length === 0 ? (
          <div className="text-center text-gray-600">No active disasters at the moment. Please check back later.</div>
        ) : (
          updates.map((update) => (
            <div key={update.disasterId} className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{update.disasterType || 'Unknown Type'}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{update.location || 'Location not available'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Affected: <span className="font-semibold">{update.affected ? update.affected.toLocaleString() : 'Data not available'}</span>
                  </p>
                  {update.volunteers && (
                    <p className="text-sm text-gray-600">
                      Volunteers: <span className="font-semibold">{update.volunteers}</span>
                    </p>
                  )}
                </div>
              </div>
              {update.status && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {update.status}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
