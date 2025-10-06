import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../../services/userService';
import { getTasksByWorker, updateTaskStatus } from '../../services/taskService';
import Caffiene from '../../assets/Caffiene.png';

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
      
      setProfile(userProfile);

      const tasksData = await getTasksByWorker(userProfile.id);
      setTasks(tasksData || []);

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
    navigate('/admin/login');
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      setUpdatingTask(taskId);
      const result = await updateTaskStatus(taskId, newStatus, profile.id);
      
      await loadWorkerData();
      
      const statusMessages = {
        'in-progress': 'Work started successfully! Task moved to In Progress.',
        'completed': ' Task completed successfully! Great work!'
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

  const tabsData = [
    { id: 'pending', name: 'Pending Tasks', count: stats.pendingTasks },
    { id: 'in-progress', name: 'In Progress', count: stats.inProgressTasks },
    { id: 'completed', name: 'Completed', count: stats.completedTasks }
  ];

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-orange-500 via-white to-green text-white py-0 md:py-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="max-w-7xl mx-auto mt-1 mb-1 px-4 relative z-10">
          <div className="flex items-center justify-center space-x-4 text-center">
            <span className="text-xs text-blue-700 md:text-xs font-medium tracking-wide">
              भारत सरकार | Government of India | Digital India 
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-screen bg-gray-100">
       
        <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
          <div className="p-5 px-4 border-b border-gray-700 flex flex-row">
            <img src={Caffiene} className='h-20 w-20' />
            <div className='py-4 px-3'>
              <h1 className="text-2xl font-bold text-white">NagarSeva</h1>
              <p className="text-xs text-gray-400 capitalize">{profile?.department_name || 'Department'} Dept.</p>
            </div>
          </div>

          <nav className="flex-grow p-4 space-y-2">
            {tabsData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center p-2 py-3 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-400 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="flex-grow text-left">{tab.name}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-white text-orange-600' : 'bg-gray-600 text-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <div className="flex justify-center items-center space-x-3 bg-black opacity-70 px-3 py-1 rounded-md border border-gray-200 hover:shadow-lg transition-all duration-300">
              <p className="px-2 py-1 rounded-md text-md font-medium text-white">{profile?.name || 'Worker'}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full mt-2 bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-grow flex flex-col overflow-y-auto">
       
          <header className="bg-white shadow-sm border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 capitalize">
                {activeTab === 'pending' && 'Pending Tasks'}
                {activeTab === 'in-progress' && 'In Progress'}
                {activeTab === 'completed' && 'Completed'}
              </h2>
              
              <button
                onClick={() => {
                  console.log(' Manual refresh triggered');
                  loadWorkerData();
                }}
                className="bg-orange-400 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="text-md font-medium text-gray-500">Total Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="text-md font-medium text-gray-500">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="text-md font-medium text-gray-500">In Progress</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.inProgressTasks}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="text-md font-medium text-gray-500">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} Tasks
                </h2>
                <p className="text-sm text-gray-600 mt-1">Manage your assigned tasks</p>
              </div>
              
              <div className="p-6">
                {getFilteredTasks().length > 0 ? (
                  <div className="space-y-4">
                    {getFilteredTasks().map((task) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                            
                            <div className="flex space-x-2 mb-3">
                              <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                              <span className={`px-3 py-1 text-xs rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority} priority
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-3">
                               {new Date(task.created_at).toLocaleDateString()} |  Assigned by: {task.assigned_by_name}
                            </p>
                            
                            {task.complaints && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <h4 className="font-medium text-gray-900 text-sm mb-2">Complaint Details:</h4>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <p><strong>Citizen:</strong> {task.complaints.citizen_name}</p>
                                  <p><strong>Phone:</strong> {task.complaints.citizen_phone}</p>
                                  <p><strong>Address:</strong> {task.complaints.address}</p>
                                  <p><strong>Issue:</strong> {task.complaints.description}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-4">
                            {task.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                                disabled={updatingTask === task.id}
                                className="px-4 py-2 bg-green opacity-80 text-white text-xs rounded hover:opacity-100 disabled:opacity-50"
                              >
                                {updatingTask === task.id ? 'Starting...' : 'Start Work'}
                              </button>
                            )}
                            
                            {task.status === 'in-progress' && (
                              <button
                                onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                                disabled={updatingTask === task.id}
                                className="px-4 py-2 bg-orange-400 text-white text-xs rounded hover:bg-orange-700 disabled:opacity-50"
                              >
                                {updatingTask === task.id ? 'Completing...' : 'Mark Complete'}
                              </button>
                            )}
                            
                            {task.status === 'completed' && (
                              <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                 Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {/* <div className="text-gray-400 text-4xl mb-4"></div> */}
                    <p className="text-gray-600">No {activeTab.replace('-', ' ')} tasks found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}