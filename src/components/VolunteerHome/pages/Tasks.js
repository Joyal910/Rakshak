import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Clock,
  MapPin,
  Calendar,
  Upload,
  MessageSquare,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function VolunteerTasks() {
  // Keeping all the existing state and functions
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [availableTasks, setAvailableTasks] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [userInfo, setUserInfo] = useState({
    userId: '',
    userName: '',
    phoneNumber: '',
    userRole: ''
  });

 // First, let's properly memoize the fetchTasks function with useCallback
const fetchTasks = React.useCallback(async () => {
  setLoading(true);
  setError('');
  try {
    if (activeTab === 'available') {
      const response = await axios.get('http://localhost:8080/api/tasks/available');
      setAvailableTasks(response.data);
    } else {
      const response = await axios.get(`http://localhost:8080/api/tasks/volunteer/${userInfo.userId}`);
      const tasks = response.data;
      setActiveTasks(tasks.filter(task => task.status === 'IN_PROGRESS'));
      setCompletedTasks(tasks.filter(task => task.status === 'COMPLETED'));
    }
  } catch (err) {
    setError('Failed to fetch tasks: ' + err.message);
  } finally {
    setLoading(false);
  }
}, [activeTab, userInfo.userId]);

// Then modify the useEffect to properly handle the dependencies
useEffect(() => {
  // Check for session and user role
  const userId = sessionStorage.getItem('userId') || Cookies.get('userId');
  const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole');
  const userName = sessionStorage.getItem('userName') || Cookies.get('userName');
  const phoneNumber = sessionStorage.getItem('phoneNumber') || Cookies.get('phoneNumber');

  if (!userId || !userRole) {
    navigate('/login');
    return;
  }

  if (userRole !== 'Volunteer') {
    navigate('/unauthorized');
    return;
  }

  setUserInfo({ userId, userName, phoneNumber, userRole });
}, [navigate]); // Remove fetchTasks from here

// Add a separate useEffect for fetching tasks
useEffect(() => {
  if (userInfo.userId) {
    fetchTasks();
  }
}, [fetchTasks, userInfo.userId]);

// For accepting a task
const handleAcceptTask = async (taskId) => {
  try {
    const volunteerId = parseInt(userInfo.userId, 10);
    
    if (!volunteerId || isNaN(volunteerId)) {
      setError('Invalid volunteer ID. Please log in again.');
      return;
    }

    // Extensive logging for debugging
    console.log('Attempting to accept task:', {
      taskId,
      volunteerId,
      userRole: userInfo.userRole
    });

    const response = await axios.post(
      `http://localhost:8080/api/tasks/${taskId}/accept`,
      null,
      {
        params: { volunteerId }
      }
    );

    await fetchTasks();
    setError('');
    
    alert('Task accepted successfully!');
  } catch (err) {
    console.error('Full error details:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Unable to accept task. Please try again.';
    
    setError(errorMessage);
    
    // More detailed error logging
    if (err.response) {
      console.error('Error Response Data:', err.response.data);
      console.error('Error Response Status:', err.response.status);
      console.error('User Info:', userInfo);
    }
    
    // Specific error scenarios
    switch (err.response?.status) {
      case 403:
        setError('You are not authorized to accept this task. Verify your role.');
        break;
      case 404:
        setError('Task not found. It may have been removed.');
        break;
      case 400:
        setError('Task cannot be accepted at this time.');
        break;
      default:
        setError('An unexpected error occurred. Please try again.');
    }
  }
};

// For updating task progress
const handleUpdateProgress = async (taskId) => {
  try {
    // First update remarks if any
    if (remarks) {
      await axios.post(
        `http://localhost:8080/api/tasks/${taskId}/volunteer-remarks`,
        remarks
      );
    }
    
    // Then update status if needed
    await axios.put(
      `http://localhost:8080/api/tasks/${taskId}/status`,
      null,
      { params: { status: 'IN_PROGRESS' } }
    );
    
    setRemarks('');
    fetchTasks();
  } catch (err) {
    setError('Failed to update progress: ' + err.message);
  }
};

// For completing a task
const handleCompleteTask = async (taskId) => {
  try {
    await axios.put(
      `http://localhost:8080/api/tasks/${taskId}/status`,
      null,
      { params: { status: 'COMPLETED' } }
    );
    fetchTasks();
  } catch (err) {
    setError('Failed to complete task: ' + err.message);
  }
};

 return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Management</h1>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Welcome, {userInfo.userName}
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'available'
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Available Tasks
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'active'
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Active Tasks
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'completed'
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Completed Tasks
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-500"></div>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-16rem)]">
              {activeTab === 'available' && (
                <div className="space-y-4">
                  {availableTasks.map((task) => (
                    <div key={task.taskId} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {task.taskRequest.requestTitle}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mt-2">
                            {task.taskRequest.requestDescription}
                          </p>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{task.taskRequest.location}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAcceptTask(task.taskId)}
                          className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                        >
                          Accept Task
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'active' && (
                <div className="space-y-4">
                  {activeTasks.map((task) => (
                    <div key={task.taskId} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {task.taskRequest.requestTitle}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                          {task.taskRequest.requestDescription}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{task.taskRequest.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <textarea
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Add remarks..."
                          className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          rows={2}
                        />
                        <div className="flex justify-between items-center">
                          <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            className="hidden"
                            id={`photo-upload-${task.taskId}`}
                          />
                          <label
                            htmlFor={`photo-upload-${task.taskId}`}
                            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photos
                          </label>
                          <div className="space-x-2">
                            <button
                              onClick={() => handleUpdateProgress(task.taskId)}
                              className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600"
                            >
                              Update Progress
                            </button>
                            <button
                              onClick={() => handleCompleteTask(task.taskId)}
                              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
                            >
                              Mark Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'completed' && (
                <div className="space-y-4">
                  {completedTasks.map((task) => (
                    <div key={task.taskId} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {task.taskRequest.requestTitle}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {task.taskRequest.requestDescription}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{task.taskRequest.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      {task.volunteerRemarks && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Remarks:</span> {task.volunteerRemarks}
                          </p>
                        </div>
                      )}
                      {task.photo && (
                        <div className="mt-3">
                          <img
                            src={task.photo}
                            alt="Task completion"
                            className="w-32 h-32 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}