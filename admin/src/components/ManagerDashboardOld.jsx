import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser, getWorkersByDepartment } from '../services/userService';
import { getComplaintsByDepartment } from '../services/complaintsService';
import { getTasksByManager, assignTask } from '../services/taskService';


export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0
  });

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 30 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing manager dashboard...');
      loadDashboardData();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const { user, profile: userProfile } = await getCurrentUser();
      
      if (!user || !userProfile || userProfile.role !== 'manager') {
        navigate('/login');
        return;
      }

      setProfile(userProfile);

      // Load department-specific data
      const [workersData, complaintsData, tasksData] = await Promise.all([
        getWorkersByDepartment(userProfile.id, userProfile.department_id),
        getComplaintsByDepartment(userProfile.department_id),
        getTasksByManager(userProfile.id)
      ]);

      setWorkers(workersData || []);
      setComplaints(complaintsData || []);
      setTasks(tasksData || []);

      // Calculate stats
      const pendingComplaints = complaintsData?.filter(c => c.status === 'pending').length || 0;
      const pendingTasks = tasksData?.filter(t => t.status === 'pending').length || 0;
      const completedTasks = tasksData?.filter(t => t.status === 'completed').length || 0;

      setStats({
        totalWorkers: workersData?.length || 0,
        totalComplaints: complaintsData?.length || 0,
        pendingComplaints,
        totalTasks: tasksData?.length || 0,
        pendingTasks,
        completedTasks
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
   
      logoutUser();
      navigate('/login');
   
  };

  const handleAssignTask = async (complaintId, workerId) => {
    
      console.log('🎯 Manager assigning task:', { complaintId, workerId, managerId: profile.id });
      
      const complaint = complaints.find(c => c.id === complaintId);
      const worker = workers.find(w => w.id === workerId);
      
     

      const taskData = {
        complaint_id: complaintId,
        assigned_by: profile.id,
        assigned_to: workerId,
        department_id: profile.department_id,
        title: `${complaint.description.substring(0, 50)}...`,
        description: complaint.description,
        priority: 'medium',
        status: 'pending'
      };

      

      const result = await assignTask(taskData);
      
      
      // Refresh data to update both complaints and tasks
      await loadDashboardData();
      setAssignModalOpen(false);
      setSelectedComplaint(null);
      
      
    
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800"></div>
         
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
   <div className="bg-white shadow-sm border-b">
        {/* Indian Flag Colors */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              {/* Government Logo */}
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NagarSeva Management</h1>
              
                <p className="text-xs text-gray-500 capitalize">{profile?.department_name || 'Department'} Department</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              {/* Refresh Button */}
              <button
                onClick={() => {
                  console.log('🔄 Manual refresh triggered');
                  loadDashboardData();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.name || 'Manager'}</p>
                 <p className="text-xs text-gray-600">
                   Manager Dashboard
                </p>
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

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-1">
          <nav className="flex flex-col space-x-1">
            {[
              { id: 'overview', name: 'Overview', icon: '📊', count: null },
              { id: 'workers', name: 'My Workers', icon: '👥', count: workers.length },
              { id: 'complaints', name: 'Pending Complaints', icon: '📢', count: complaints.length },
              { id: 'tasks', name: 'Assigned Tasks', icon: '📝', count: tasks.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                } px-6 py-3 rounded-md font-medium text-sm transition-colors flex-1 text-center`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {tab.count !== null && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {/* Total Workers */}
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w- h-8 bg-blue-100 rounded-md flex items-center justify-center">
                        <span className="text-blue-600 text-lg">👥</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">My Workers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalWorkers}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Complaints */}
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                        <span className="text-purple-600 text-lg">📢</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Complaints</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Complaints */}
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                        <span className="text-red-600 text-lg">🚨</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Pending Complaints</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingComplaints}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Tasks */}
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                        <span className="text-yellow-600 text-lg">📋</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Tasks */}
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                        <span className="text-orange-600 text-lg">⏳</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completed Tasks */}
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                        <span className="text-green-600 text-lg">✅</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workers Tab */}
        {activeTab === 'workers' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                My Workers - {profile?.department || 'Department'} Department
              </h2>
              <p className="text-sm text-gray-600 mt-1">Manage your department workers</p>
            </div>
            <div className="p-6">
              {workers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workers.map((worker) => (
                    <div key={worker.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {worker.name?.charAt(0) || 'W'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{worker.name}</h3>
                          <p className="text-sm text-gray-600">{worker.phone}</p>
                          {worker.workers?.[0] && (
                            <p className="text-xs text-blue-600">{worker.workers[0].specialization}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            worker.workers?.[0]?.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {worker.workers?.[0]?.status || 'active'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">👥</div>
                  <p className="text-gray-600">No workers found in your department</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 capitalize">
                Department Complaints - {profile?.department_name || 'Department'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Assign complaints to workers</p>
            </div>
            <div className="p-6">
              {complaints.length > 0 ? (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div key={complaint.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{complaint.citizen_name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            📍 {complaint.address} | 📞 {complaint.citizen_phone}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-half ${
                            complaint.status === 'pending' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {complaint.status}
                          </span>
                          {complaint.status === 'pending' && (
                            <button
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setAssignModalOpen(true);
                              }}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Assign
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📢</div>
                  <p className="text-gray-600">No complaints found for your department</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Tasks Assigned by Me</h2>
              <p className="text-sm text-gray-600 mt-1">Track tasks you've assigned to workers</p>
            </div>
            <div className="p-6">
              {tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Assigned to: {task.assigned_to_name || 'Worker'} | 
                            Priority: {task.priority}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : task.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📝</div>
                  <p className="text-gray-600">No tasks assigned yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {assignModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Assign Complaint to Worker</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Complaint:</p>
              <p className="text-sm font-medium">{selectedComplaint.description}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Select Worker:</p>
              <div className="space-y-2">
                {workers.map((worker) => (
                  <button
                    key={worker.id}
                    onClick={() => handleAssignTask(selectedComplaint.id, worker.id)}
                    className="w-full text-left p-3 border rounded hover:bg-blue-50 hover:border-blue-300"
                  >
                    <div className="font-medium">{worker.name}</div>
                    <div className="text-sm text-gray-600">{worker.workers?.[0]?.specialization}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setAssignModalOpen(false);
                  setSelectedComplaint(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}