import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../services/userService';
import { getTasksByWorker, updateTaskStatus } from '../services/taskService';
import Caffiene from '../assets/Caffiene.png'

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [updatingTask, setUpdatingTask] = useState(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0
  });

  useEffect(() => {
    loadWorkerData();
  }, []);

  const loadWorkerData = async () => {
    try {
      setLoading(true);
      const { user, profile: userProfile } = await getCurrentUser();
      
      // ProtectedRoute already handles authentication check
      // So we just set the profile data directly
      setProfile(userProfile);

      // Load worker's tasks
      const tasksData = await getTasksByWorker(userProfile.id);
      setTasks(tasksData || []);

      // Calculate stats
      const pendingTasks = tasksData?.filter(t => t.status === 'pending').length || 0;
      const inProgressTasks = tasksData?.filter(t => t.status === 'in-progress').length || 0;
      const completedTasks = tasksData?.filter(t => t.status === 'completed').length || 0;

      setStats({
        totalTasks: tasksData?.length || 0,
        pendingTasks,
        inProgressTasks,
        completedTasks
      });

    } catch (error) {
      console.error('Error loading worker data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    
      logoutUser();
      navigate('/login');
    
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      setUpdatingTask(taskId);
      const result = await updateTaskStatus(taskId, newStatus, profile.id);
    
      
      // Refresh tasks
      await loadWorkerData();
      
      // Success message based on status
      const statusMessages = {
        'in-progress': '✅ Work started successfully! Task moved to In Progress.',
        'completed': '🎉 Task completed successfully! Great work!'
      };
      
      alert(statusMessages[newStatus] || `Task status updated to: ${newStatus}`);
    } catch (error) {
      alert('Error updating task status. Please try again.');
    } finally {
      setUpdatingTask(null);
    }
  };

  const getFilteredTasks = () => {
    switch (activeTab) {
      case 'pending':
        return tasks.filter(task => task.status === 'pending');
      case 'in-progress':
        return tasks.filter(task => task.status === 'in-progress');
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      default:
        return tasks;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="bg-white shadow-sm border-b">
       
        <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
        
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nagar Seva Portal</h1>
                <p className="text-sm text-gray-600">
                  {profile?.department || 'Department'} - Worker Dashboard
                </p>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.name || 'Worker'}</p>
                <p className="text-xs text-gray-500 capitalize">{profile?.department_name || 'Department'} Department</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 text-lg">🔄</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'pending', name: 'Pending Tasks', count: stats.pendingTasks },
                { id: 'in-progress', name: 'In Progress', count: stats.inProgressTasks },
                { id: 'completed', name: 'Completed', count: stats.completedTasks }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} Tasks
            </h2>
          </div>
          
          <div className="p-6">
            {getFilteredTasks().length > 0 ? (
              <div className="space-y-4">
                {getFilteredTasks().map((task) => (
                  <div key={task.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                    {/* Main Content */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 pr-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                          <p className="text-gray-600 mb-3">{task.description}</p>
                          
                          {/* Status and Priority Tags */}
                          <div className="flex space-x-2 mb-4">
                            <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <span className={`px-3 py-1 text-sm rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority} priority
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                            <span>📅 {new Date(task.created_at).toLocaleDateString()}</span>
                            <span>👤 Assigned by: {task.assigned_by_name}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Complaint Details */}
                      {task.complaints && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">📋 Complaint Details:</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Citizen:</strong> {task.complaints.citizen_name}</p>
                            <p><strong>Phone:</strong> {task.complaints.citizen_phone}</p>
                            <p><strong>Address:</strong> {task.complaints.address}</p>
                            <p><strong>Issue:</strong> {task.complaints.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons - Prominent Bottom Section */}
                    <div className="border-t pt-4">
                      <div className="flex justify-end">
                        {task.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                            disabled={updatingTask === task.id}
                            className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                          >
                            <span>🚀</span>
                            <span>{updatingTask === task.id ? 'Starting Work...' : 'Start Work'}</span>
                          </button>
                        )}
                        
                        {task.status === 'in-progress' && (
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                            disabled={updatingTask === task.id}
                            className="px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2 shadow-lg"
                          >
                            <span>✅</span>
                            <span>{updatingTask === task.id ? 'Marking Complete...' : 'Mark as Complete'}</span>
                          </button>
                        )}
                        
                        {task.status === 'completed' && (
                          <div className="flex items-center justify-center text-green-600 text-sm font-medium bg-green-50 px-6 py-3 rounded-lg border border-green-200">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Task Completed Successfully!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">📋</div>
                <p className="text-gray-600">No {activeTab.replace('-', ' ')} tasks found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}