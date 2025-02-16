import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function LocalDisasterAlert() {
  // Replace with your location-based alert system
  const activeDisaster = null;

  if (!activeDisaster) return null;

  return (
    <div className="bg-red-50 border-b border-red-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <span className="font-medium text-red-800">
                {activeDisaster.type} - {activeDisaster.location}
              </span>
              <span className="mx-2 text-red-800">|</span>
              <span className="text-red-700">{activeDisaster.instructions}</span>
            </div>
          </div>
          <a 
            href="/updates" 
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            View Details →
          </a>
        </div>
      </div>
    </div>
  );
}