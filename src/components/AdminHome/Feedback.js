import React from 'react';
import { Star, MessageCircle, Flag } from 'lucide-react';

export default function Feedback() {
  const feedbacks = [
    {
      id: 1,
      user: 'James Wilson',
      rating: 5,
      message: 'The emergency response team was incredibly quick and professional.',
      type: 'Service',
      date: '2024-02-20T10:30:00',
      status: 'Unread',
    },
    {
      id: 2,
      user: 'Emily Chen',
      rating: 4,
      message: 'Good communication during the crisis, but could improve on follow-up.',
      type: 'Communication',
      date: '2024-02-19T15:45:00',
      status: 'Read',
    },
    {
      id: 3,
      user: 'Alex Thompson',
      rating: 3,
      message: 'The app is helpful but needs more real-time updates.',
      type: 'Application',
      date: '2024-02-18T09:15:00',
      status: 'Flagged',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Feedback</h2>
        <div className="flex space-x-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
            <option value="all">All Feedback</option>
            <option value="unread">Unread</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Average Rating</h3>
            <Star className="text-yellow-400" size={24} />
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-600">4.5</p>
          <p className="text-sm text-gray-500">From 150 reviews</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Total Feedback</h3>
            <MessageCircle className="text-indigo-600" size={24} />
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-600">324</p>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Flagged Items</h3>
            <Flag className="text-red-600" size={24} />
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-600">12</p>
          <p className="text-sm text-gray-500">Requires attention</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="divide-y divide-gray-200">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">
                      {feedback.user}
                    </span>
                    <span
                      className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${
                        feedback.status === 'Unread'
                          ? 'bg-yellow-100 text-yellow-800'
                          : feedback.status === 'Flagged'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {feedback.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className={`${
                          index < feedback.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {feedback.type}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(feedback.date).toLocaleString()}
                </span>
              </div>
              <p className="mt-4 text-gray-600">{feedback.message}</p>
              <div className="mt-4 flex justify-end space-x-4">
                <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                  Mark as Read
                </button>
                <button className="text-gray-600 hover:text-gray-900 text-sm">
                  Reply
                </button>
                <button className="text-red-600 hover:text-red-900 text-sm">
                  Flag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}