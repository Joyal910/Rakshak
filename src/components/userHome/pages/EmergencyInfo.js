import React from 'react';
import Header from '../components/Header';
import { Phone, Heart, MapPin } from 'lucide-react';

export default function EmergencyInfo() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Emergency Information</h1>
          <p className="text-xl text-gray-600">
            Quick access to emergency contacts and critical information
          </p>
        </div>

        {/* Emergency Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { service: 'Police', number: '100', bg: 'bg-blue-50' },
            { service: 'Fire', number: '101', bg: 'bg-red-50' },
            { service: 'Ambulance', number: '102', bg: 'bg-green-50' },
            { service: 'Disaster Management', number: '108', bg: 'bg-purple-50' },
            { service: 'Women Helpline', number: '1091', bg: 'bg-pink-50' },
            { service: 'Child Helpline', number: '1098', bg: 'bg-yellow-50' }
          ].map((item) => (
            <div
              key={item.service}
              className={`${item.bg} rounded-lg p-6 flex flex-col items-start`}
            >
              <Phone className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="text-base font-medium text-gray-900">{item.service}</h3>
              <p className="text-2xl font-bold text-blue-600">{item.number}</p>
            </div>
          ))}
        </div>

        {/* First Aid Guide */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <Heart className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">First Aid Guide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
                title: 'CPR Basics',
                steps: [
                  'Check the scene is safe',
                  'Check responsiveness',
                  'Call for help',
                  'Start chest compressions',
                  'Give rescue breaths'
                ]
              },
              {
                title: 'Treating Burns',
                steps: [
                  'Cool the burn under running water',
                  'Remove jewelry/tight items',
                  'Cover with sterile gauze',
                  "Don't break blisters",
                  'Seek medical attention'
                ]
              },
              {
                title: 'Choking First Aid',
                steps: [
                  'Encourage coughing if the person can cough',
                  'Give back blows between shoulder blades',
                  'Perform abdominal thrusts (Heimlich maneuver) if necessary',
                  'Call for emergency medical help if the airway is not cleared'
                ]
              }
            ].map((guide) => (
              <div key={guide.title} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{guide.title}</h3>
                <ol className="space-y-2">
                  {guide.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="font-medium mr-2">{index + 1}.</span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Facilities */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center mb-6">
            <MapPin className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Nearby Emergency Facilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'City General Hospital', distance: '2.5 km', type: 'Hospital' },
              { name: 'Central Fire Station', distance: '3.1 km', type: 'Fire Station' },
              { name: 'Police HQ', distance: '1.8 km', type: 'Police Station' }
            ].map((facility) => (
              <div key={facility.name} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{facility.type}</p>
                <p className="text-gray-600 text-sm mt-1">{facility.distance} away</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
