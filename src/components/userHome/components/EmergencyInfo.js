import React from 'react';
import { Phone, Heart, AlertTriangle, ChevronRight } from 'lucide-react';

const emergencyNumbers = [
  { service: 'Police', number: '100' },
  { service: 'Fire', number: '101' },
  { service: 'Medical', number: '102' }
];

const firstAidTips = [
  {
    title: 'CPR Basics',
    description: 'Check breathing, start chest compressions, give rescue breaths'
  },
  {
    title: 'Treating Burns',
    description: 'Cool the burn under running water, cover with sterile dressing'
  }
];

export default function EmergencyInfo() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Information</h3>

      {/* Emergency Numbers */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Phone className="h-5 w-5 text-red-600" />
          <h4 className="font-medium text-gray-900">Emergency Numbers</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {emergencyNumbers.map((item) => (
            <div
              key={item.service}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <span className="text-gray-600">{item.service}</span>
              <span className="font-bold text-gray-900">{item.number}</span>
            </div>
          ))}
        </div>
        <a
          href="/EmergencyInfo"
          className="inline-flex items-center text-sm text-blue-600 mt-2 hover:text-blue-800"
        >
          View More Numbers
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>

      {/* First Aid Tips */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Heart className="h-5 w-5 text-red-600" />
          <h4 className="font-medium text-gray-900">Quick First Aid Tips</h4>
        </div>
        <div className="space-y-3">
          {firstAidTips.map((tip) => (
            <div key={tip.title} className="bg-gray-50 p-3 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-1">{tip.title}</h5>
              <p className="text-sm text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>
        <a
          href="/EmergencyInfo"
          className="inline-flex items-center text-sm text-blue-600 mt-3 hover:text-blue-800"
        >
          View Complete First Aid Guide
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>

      {/* Emergency Alert */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-red-800 font-medium">In case of emergency</h5>
            <p className="text-sm text-red-700 mt-1">
              Stay calm and dial the appropriate emergency number immediately. Every second counts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}