import React from 'react';
import { AlertCircle, HandHeart, Phone, FileText, Map } from 'lucide-react';

const actions = [
  {
    icon: FileText,
    title: 'Submit Request',
    description: 'Request assistance or resources',
    href: '/SubmitRequest'
  },
  {
    icon: HandHeart,
    title: 'Volunteer',
    description: 'Join our volunteer network',
    href: '/volunteer'
  },
  {
    icon: Phone,
    title: 'Emergency Contact',
    description: 'Quick access to emergency numbers',
    href: '/EmergencyInfo'
  },
  {
    icon: Map,
    title: 'Disaster Map',
    description: 'View affected areas and updates',
    href: '/map'
  }
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <a
            key={action.title}
            href={action.href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <Icon className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
            <p className="text-gray-600">{action.description}</p>
          </a>
        );
      })}
    </div>
  );
}