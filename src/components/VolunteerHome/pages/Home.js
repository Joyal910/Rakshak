import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Users,
  Radio,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [disasterUpdates, setDisasterUpdates] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const [ongoingTasks, setOngoingTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [volunteerStats, setVolunteerStats] = useState({
    tasksCompleted: 0,
    ongoingTasks: 0,
    totalHours: 0
  });
  const [userInfo, setUserInfo] = useState({
    userId: null,
    userRole: null,
    userName: '',
  });

  // User authentication check
  useEffect(() => {
    const userId = sessionStorage.getItem('userId') || Cookies.get('userId');
    const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole');
    const userName = sessionStorage.getItem('userName') || Cookies.get('userName');

    if (!userId || !userRole) {
      navigate('/login');
      return;
    }

    setUserInfo({ userId, userRole, userName });
  }, [navigate]);

  // Fetch volunteer statistics with completed and ongoing tasks
  useEffect(() => {
    const fetchVolunteerStats = async () => {
      if (!userInfo.userId) return;
      
      try {
        // Get all tasks for the volunteer
        const tasksResponse = await axios.get(`http://localhost:8080/api/tasks/volunteer/${userInfo.userId}`);
        const allTasks = tasksResponse.data;
        
        // Calculate stats
        const completed = allTasks.filter(task => task.status === 'COMPLETED').length;
        const ongoing = allTasks.filter(task => task.status === 'IN_PROGRESS').length;
        
        setVolunteerStats({
          tasksCompleted: completed,
          ongoingTasks: ongoing,
          totalHours: allTasks.length * 8 // Assuming 8 hours per task, adjust as needed
        });
      } catch (error) {
        console.error('Error fetching volunteer stats:', error);
      }
    };

    fetchVolunteerStats();
  }, [userInfo.userId]);

  // Fetch disaster updates with proper timestamp
  useEffect(() => {
    const fetchDisasterUpdates = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/disasters?status=ACTIVE');
        const formattedUpdates = response.data.map(disaster => ({
          id: disaster.disasterId,
          type: disaster.disasterType,
          location: disaster.location,
          severity: disaster.severity.toLowerCase(),
          timestamp: calculateDaysAgo(disaster.reportedAt),
          details: disaster.description,
          name: disaster.name
        }));
        setDisasterUpdates(formattedUpdates);
      } catch (error) {
        console.error('Error fetching disaster updates:', error);
      }
    };

    fetchDisasterUpdates();
    const interval = setInterval(fetchDisasterUpdates, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate days ago from reportedAt
  const calculateDaysAgo = (reportedAt) => {
    const reported = new Date(reportedAt);
    const now = new Date();
    const diffTime = Math.abs(now - reported);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    }
    return `${diffDays} days ago`;
  };

  // Handle accepting a task
  const handleAcceptTask = async (taskId) => {
    try {
      setLoading(true);
      console.log('Raw task ID received:', taskId); // Debug log
      
      if (!taskId) {
        console.error('Task ID is undefined');
        setError('Invalid task ID');
        return;
      }

      const volunteerId = parseInt(userInfo.userId, 10);
      
      if (!volunteerId || isNaN(volunteerId)) {
        setError('Invalid volunteer ID. Please log in again.');
        return;
      }

      console.log('Attempting to accept task:', {
        taskId: taskId,
        volunteerId,
        userRole: userInfo.userRole
      });

      const response = await axios.post(
        `http://localhost:8080/api/tasks/${taskId}/accept`,
        {},
        {
          params: { volunteerId: volunteerId }
        }
      );

      console.log('Accept task response:', response);
      await refreshAllData();
      setError('');
      alert('Task accepted successfully!');
      
    } catch (err) {
      console.error('Full error details:', err);
      
      if (err.response) {
        console.error('Error Response Data:', err.response.data);
        console.error('Error Response Status:', err.response.status);
        console.error('Error Response Headers:', err.response.headers);
      }
      
      const errorMessage = err.response?.data?.message || 'Unable to accept task. Please try again.';
      setError(errorMessage);
      
      switch (err.response?.status) {
        case 403:
          setError('You are not authorized to accept this task. Please verify your role.');
          break;
        case 404:
          setError('Task not found. It may have been removed.');
          break;
        case 400:
          setError('Invalid request. Please try again.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Updated task rendering section in the return JSX
  const renderTaskList = () => (
    <div className="space-y-4">
      {newTasks.map(task => (
        <div key={task.taskId} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white flex items-center">
                {task.title}
                {task.urgencyLevel === 'HIGH' && (
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
                    URGENT
                  </span>
                )}
              </h3>
              <div className="flex items-center text-gray-300 mt-2 text-sm space-x-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{task.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Due: {task.deadline}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{task.currentVolunteers}/{task.requiredVolunteers} Volunteers</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleAcceptTask(task.taskId)}
              disabled={loading}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Accepting...' : 'Accept'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );


  const refreshAllData = async () => {
    if (!userInfo.userId) return;

    try {
      const [tasksResponse, statsResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/tasks/volunteer/${userInfo.userId}`),
        axios.get(`http://localhost:8080/api/tasks/available`)
      ]);

      const allTasks = tasksResponse.data;
      setOngoingTasks(allTasks.filter(task => task.status === 'IN_PROGRESS'));
      setNewTasks(statsResponse.data);
      
      // Update stats
      setVolunteerStats({
        tasksCompleted: allTasks.filter(task => task.status === 'COMPLETED').length,
        ongoingTasks: allTasks.filter(task => task.status === 'IN_PROGRESS').length,
        totalHours: allTasks.length * 4
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data');
    }
  };

  // Fetch available tasks
  useEffect(() => {
    const fetchAvailableTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/tasks/available');
        // Keep the original taskId from the API response
        const formattedTasks = response.data.map(task => ({
          taskId: task.taskId, // Keep the original taskId
          title: task.taskRequest.requestTitle,
          location: task.taskRequest.location,
          deadline: new Date(task.deadline).toISOString().split('T')[0],
          urgencyLevel: task.priority,
          requiredVolunteers: task.requiredVolunteers,
          currentVolunteers: task.currentVolunteers
        }));
        setNewTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching available tasks:', error);
      }
    };

    fetchAvailableTasks();
    const interval = setInterval(fetchAvailableTasks, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch ongoing tasks
  useEffect(() => {
    const fetchOngoingTasks = async () => {
      if (!userInfo.userId) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/tasks/volunteer/${userInfo.userId}`);
        const activeTasks = response.data
          .filter(task => task.status === 'IN_PROGRESS')
          .map(task => ({
            id: task.taskId,
            title: task.taskRequest.requestTitle,
            location: task.taskRequest.location,
            status: task.status,
            progress: calculateTaskProgress(task),
            currentStage: task.currentStage || 'STARTED',
            remarks: task.volunteerRemarks || ''
          }));
        setOngoingTasks(activeTasks);
      } catch (error) {
        console.error('Error fetching ongoing tasks:', error);
      }
    };

    if (userInfo.userId) {
      fetchOngoingTasks();
      const interval = setInterval(fetchOngoingTasks, 30000);
      return () => clearInterval(interval);
    }
  }, [userInfo.userId]);

  

  //const handleUpdateProgress = async (taskId) => {
   // setSelectedTask(ongoingTasks.find(task => task.id === taskId));
    //setUpdateModalOpen(true);
 // }

 // const submitProgressUpdate = async () => {
   // if (!selectedTask || !remarks) return;
    //etLoading(true);

    //try {
      // Update remarks
      //await axios.post(
        //`http://localhost:8080/api/tasks/${selectedTask.id}/volunteer-remarks`,
        //{ remarks }
      //);

      // Update task stage and progress
      //const nextStage = getNextStage(selectedTask.currentStage);
      //await axios.put(
        //`http://localhost:8080/api/tasks/${selectedTask.id}/stage`,
        //{ stage: nextStage }
      //);

      // If task is completed, update status
      //if (nextStage === 'COMPLETED') {
        //await axios.put(
          //`http://localhost:8080/api/tasks/${selectedTask.id}/status`,
          //null,
          //{ params: { status: 'COMPLETED' } }
        //);
      //}

      //await refreshAllData();
      //setUpdateModalOpen(false);
      //setRemarks('');
      //setSelectedTask(null);
    //} catch (error) {
      //console.error('Error updating task:', error);
      //alert('Failed to update task. Please try again.');
    //} finally {
      //setLoading(false);
    //}
  //};

 

  // Utility functions
  const calculateSeverity = (affected) => {
    if (affected > 1000) return 'high';
    if (affected > 500) return 'medium';
    return 'low';
  };

  const getRelativeTime = (timestamp) => {
    const minutes = Math.floor((new Date() - new Date(timestamp)) / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const calculateTaskProgress = (task) => {
    const stageProgressMap = {
      'STARTED': 20,
      'MIDWAY': 50,
      'NEAR_COMPLETION': 80,
      'COMPLETED': 100
    };
    return stageProgressMap[task.currentStage] || 0;
  };

  const getNextStage = (currentStage) => {
    const stageProgression = {
      'STARTED': 'MIDWAY',
      'MIDWAY': 'NEAR_COMPLETION',
      'NEAR_COMPLETION': 'COMPLETED'
    };
    return stageProgression[currentStage] || currentStage;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="flex-1 w-full mx-auto px-4 bg-gray-900 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md p-6">
              <h1 className="text-xl font-bold text-white mb-4">
                Welcome, {userInfo.userName || 'User'}
              </h1>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <div className="text-white text-lg font-semibold">{volunteerStats.tasksCompleted}</div>
                  <div className="text-white/80 text-sm">Tasks Completed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <div className="text-white text-lg font-semibold">{volunteerStats.ongoingTasks}</div>
                  <div className="text-white/80 text-sm">Ongoing Tasks</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <div className="text-white text-lg font-semibold">{volunteerStats.totalHours}</div>
                  <div className="text-white/80 text-sm">Hours Contributed</div>
                </div>
              </div>
            </div>

            {/* Disaster Updates Section */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Radio className="h-5 w-5 text-red-500 mr-2" />
                  Live Disaster Updates
                </h2>
                <span className="animate-pulse flex h-3 w-3 rounded-full bg-red-500"></span>
              </div>
              <div className="space-y-4">
                {disasterUpdates.map(update => (
                  <div key={update.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className={`h-5 w-5 ${update.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
                          <h3 className="font-semibold text-white">{update.type}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(update.severity)}`}>
                            {update.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{update.details}</p>
                        <div className="flex items-center text-gray-400 text-sm mt-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{update.location}</span>
                          <span className="mx-2">•</span>
                          <span>{update.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Tasks Section */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Urgent Tasks</h2>
              <div className="space-y-4">
                {newTasks.map(task => (
                  <div key={task.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white flex items-center">
                          {task.title}
                          {task.urgencyLevel === 'high' && (
                            <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
                              URGENT
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center text-gray-300 mt-2 text-sm space-x-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{task.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Due: {task.deadline}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{task.currentVolunteers}/{task.requiredVolunteers} Volunteers</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAcceptTask(task.taskId)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        disabled={loading}
                      >
                        {loading ? 'Accepting...' : 'Accept'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Your Active Tasks</h2>
              <div className="space-y-4">
                {ongoingTasks.map(task => (
                  <div key={task.id} className="border border-gray-700 rounded-lg p-4">
                    <div>
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      <div className="flex items-center text-gray-300 mt-2 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{task.location}</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end space-x-2">
                        <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}