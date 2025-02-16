import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, AlertCircle, Package, AlertTriangle, Clock, UserPlus, MapPin,Phone } from 'lucide-react';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    userId: null,
    userRole: null
  });
  
  // State for different data sections
  const [disasters, setDisasters] = useState([]);
  const [assistanceRequests, setAssistanceRequests] = useState([]);
  const [resourceRequests, setResourceRequests] = useState([]);
  const [volunteerApplications, setVolunteerApplications] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing session
    const userId = sessionStorage.getItem('userId') || Cookies.get('userId');
    const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole');

    if (!userId || !userRole) {
      navigate('/login');
      return;
    }

    setUserInfo({ userId, userRole });
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const [
        disastersRes,
        taskRequestsRes,
        resourceRequestsRes,
        volunteerRes,
        volunteersRes
      ] = await Promise.all([
        axios.get('http://localhost:8080/api/disasters'),
        axios.get('http://localhost:8080/api/task-requests'),
        axios.get('http://localhost:8080/api/resource-requests/admin'),
        axios.get('http://localhost:8080/volunteer-applications'),
        axios.get('http://localhost:8080/api/users')
      ]);

      // Store full data for stats calculations
      const allDisasters = disastersRes.data;
      const allAssistanceRequests = taskRequestsRes.data;
      const allResourceRequests = resourceRequestsRes.data;
      const allVolunteerApplications = volunteerRes.data;
      
      // Sort by date and get recent items
      const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
      
      setDisasters(allDisasters.slice(0, 2)); // Keep only 2 most recent disasters
      setAssistanceRequests(allAssistanceRequests
        .filter(r => r.status === 'PENDING')
        .sort(sortByDate)
        .slice(0, 3)); // 3 most recent pending requests
      setResourceRequests(allResourceRequests
        .filter(r => r.status === 'PENDING')
        .sort(sortByDate)
        .slice(0, 3)); // 3 most recent pending resources
      setVolunteerApplications(allVolunteerApplications.slice(0, 2));
      setVolunteers(volunteersRes.data.filter(user => 
        user.role === 'Volunteer' && user.userStatus === 'active'
      ));

      // Store full data for stats calculations
      setStats([
        {
          id: 1,
          name: 'Active Emergencies',
          value: allDisasters.filter(d => d.status === 'ACTIVE').length.toString(),
          icon: AlertTriangle,
          change: `+${allDisasters.filter(d => 
            d.status === 'ACTIVE' && 
            new Date(d.createdAt) > new Date(Date.now() - 24*60*60*1000)
          ).length}`,
          changeType: 'increase',
        },
        {
          id: 2,
          name: 'Pending Requests',
          value: allAssistanceRequests.filter(r => r.status === 'PENDING').length.toString(),
          icon: AlertCircle,
          change: `+${allAssistanceRequests.filter(r => 
            r.status === 'PENDING' && 
            new Date(r.createdAt) > new Date(Date.now() - 24*60*60*1000)
          ).length}`,
          changeType: 'increase',
        },
        {
          id: 3,
          name: 'Available Volunteers',
          value: volunteersRes.data.filter(user => 
            user.role === 'Volunteer' && user.userStatus === 'active'
          ).length.toString(),
          icon: Users,
          change: `+${volunteersRes.data.filter(v => 
            v.role === 'Volunteer' && 
            v.userStatus === 'active' &&
            new Date(v.createdAt) > new Date(Date.now() - 24*60*60*1000)
          ).length}`,
          changeType: 'increase',
        },
        {
          id: 4,
          name: 'Resource Requests',
          value: allResourceRequests.filter(r => r.status === 'PENDING').length.toString(),
          icon: Package,
          change: `+${allResourceRequests.filter(r => 
            r.status === 'PENDING' && 
            new Date(r.createdAt) > new Date(Date.now() - 24*60*60*1000)
          ).length}`,
          changeType: 'increase',
        },
      ]);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  // State for stats
  const [stats, setStats] = useState([]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  const getFirstFourWords = (description) => {
    if (!description) return 'No description available';
    return description.split(' ').slice(0, 4).join(' ') + '...';
  };

  return (
    <div className="min-h-screen w-full p-6 bg-gray-100 space-y-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Rakshak Dashboard</h2>
          <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
        </div>

        {/* User Info Display */}
        <div className="bg-blue-100 p-4 text-center">
          <p className="text-blue-800">
            Logged in as: <span className="font-bold">{userInfo.userId}</span> 
            {' | '}
            Role: <span className="font-bold">{userInfo.userRole}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className="h-12 w-12 text-indigo-600" />
                </div>
                <div className="mt-4">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'increase'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change} in last 24h
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Disasters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              Active Disasters
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {disasters.map((disaster) => (
              <div
                key={disaster.disasterId}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {disaster.name}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      disaster.severity === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {disaster.severity}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {disaster.location}
                  </p>
                  <p>{disaster.description}</p>
                  <p>Status: {disaster.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assistance and Resource Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                Recent Assistance Requests
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {assistanceRequests.map((request) => (
                <div key={request.requestId} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {request.requestTitle}
                      </p>
                      <p className="text-sm text-gray-500">{request.location}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 text-indigo-600 mr-2" />
                Recent Resource Requests
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {resourceRequests.map((request) => (
                <div key={request.requestId} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {request.resourceName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {request.requestedQuantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {request.Location}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Volunteer Applications */}
       {/* Volunteer Applications */}
<div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
      <UserPlus className="h-5 w-5 text-green-600 mr-2" />
      Recent Volunteer Applications
    </h3>
  </div>
  <div className="p-6 space-y-4">
    {volunteerApplications.map((volunteer) => (
      <div 
        key={volunteer.applicationId} 
        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors duration-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                {volunteer.username} {/* Changed from volunteer.name to volunteer.username */}
              </h4>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                volunteer.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : volunteer.status === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {volunteer.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              {volunteer.phoneNumber}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              {volunteer.location}
            </p>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-sm text-gray-600 italic">
              "{getFirstFourWords(volunteer.description)}"
            </p>
            <div className="flex justify-end mt-2">
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  );
}