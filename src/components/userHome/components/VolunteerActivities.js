import React from 'react';
import { Users, Award, ArrowRight } from 'lucide-react';

const activities = []; // Replace with your activities data

export default function VolunteerActivities() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Activities</h3>
      
      <div className="space-y-4 mb-6">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900">
                <span className="font-medium">{activity.team}</span> {activity.activity}
              </p>
              <p className="text-sm text-gray-500">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Award className="h-6 w-6 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Volunteer applications are open</p>
            <p className="text-sm text-blue-700">Join our team and make a difference</p>
          </div>
        </div>
      </div>

      <a
        href="/volunteer"
        className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Join as a Volunteer
        <ArrowRight className="ml-2 h-4 w-4" />
      </a>
    </div>
  );
}