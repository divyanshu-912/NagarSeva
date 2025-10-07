// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// import { getComplaintsByDepartment } from '../../services/complaintsService';
// import { getTasksByManager, assignTask } from '../../services/taskService';
// import { FaBell, FaUser } from 'react-icons/fa';
// import { Megaphone, AlertTriangle, SearchCheck } from "lucide-react";
// import Caffiene from '../../assets/Caffiene.png'

// export default function ManagerDashboard() {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [workers, setWorkers] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [assignModalOpen, setAssignModalOpen] = useState(false);
//   const [stats, setStats] = useState({
//     totalWorkers: 0,
//     totalComplaints: 0,
//     pendingComplaints: 0,
//     totalTasks: 0,
//     pendingTasks: 0,
//     completedTasks: 0
//   });

//   useEffect(() => {
//     loadDashboardData();
//     const refreshInterval = setInterval(() => {
//       console.log('🔄 Auto-refreshing manager dashboard...');
//       loadDashboardData();
//     }, 30000);
//     return () => clearInterval(refreshInterval);
//   }, []);

//   const loadDashboardData = async () => {
//     try {
    
//       const { user, profile: userProfile } = await getCurrentUser();
      
    
//       setProfile(userProfile);

//       const [workersData, complaintsData, tasksData] = await Promise.all([
//         getWorkersByDepartment(userProfile.id, userProfile.department_id),
//         getComplaintsByDepartment(userProfile.department_id),
//         getTasksByManager(userProfile.id)
//       ]);

//       const safeWorkers = workersData || [];
//       const safeComplaints = complaintsData || [];
//       const safeTasks = tasksData || [];

//       setWorkers(safeWorkers);
//       setComplaints(safeComplaints);
//       setTasks(safeTasks);

//       const pendingComplaints = safeComplaints.filter(c => c.status === 'pending').length;
//       const pendingTasks = safeTasks.filter(t => t.status === 'pending').length;
//       const completedTasks = safeTasks.filter(t => t.status === 'completed').length;

//       setStats({
//         totalWorkers: safeWorkers.length,
//         totalComplaints: safeComplaints.length,
//         pendingComplaints,
//         totalTasks: safeTasks.length,
//         pendingTasks,
//         completedTasks
//       });

//     } catch (error) {
//       console.error('Error loading dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logoutUser();
//     navigate('/admin/login');
//   };

//   const handleAssignTask = async (complaintId, workerId) => {
//     const complaint = complaints.find(c => c.id === complaintId);
//     if (!complaint || !profile) return;

//     const taskData = {
//       complaint_id: complaintId,
//       assigned_by: profile.id,
//       assigned_to: workerId,
//       department_id: profile.department_id,
//       title: `Complaint: ${complaint.description.substring(0, 40)}...`,
//       description: complaint.description,
//       priority: 'medium',
//       status: 'pending'
//     };

//     await assignTask(taskData);
//     await loadDashboardData(); 
//     setAssignModalOpen(false);
//     setSelectedComplaint(null);
//   };

//   const tabsData = [
//     { id: 'overview', name: 'Overview', count: null },
//     { id: 'workers', name: 'My Workers', count: workers.length },
//     { id: 'complaints', name: 'Pending Complaints', count: complaints.filter(c => c.status === 'pending').length },
//     { id: 'tasks', name: 'Assigned Tasks',count: tasks.length }
//   ];

//   if (loading && !profile) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800"></div>
//       </div>
//     );
//   }

//   return (
//     <> 
//     <div className="bg-gradient-to-r from-orange-500 via-white to-green text-white py-0 md:py-0 relative overflow-hidden">
//             <div className="absolute inset-0 bg-black bg-opacity-10"></div>
//             <div className="max-w-7xl mx-auto mt-1 mb-1 px-4 relative z-10">
//                 <div className="flex items-center justify-center space-x-4 text-center">
                   
//                     <span className="text-xs text-blue-700 md:text-xs font-medium tracking-wide">
//                         भारत सरकार | Government of India | Digital India 
//                     </span>
                    
//                 </div>
//             </div>
//         </div>
//     <div className="flex h-screen bg-gray-100">
      
     
//       <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
//         <div className="p-5 px-4 border-b border-gray-700 flex flex-row">
//           <img src={Caffiene} className='h-20 w-20' />
//         <div className='py-4 px-3'>
//           <h1 className="text-2xl font-bold text-white">NagarSeva</h1>
//           <p className="text-xs text-gray-400 capitalize">{profile?.department_name || 'Department'} Dept.</p>
//         </div>
//         </div>

//         <nav className="flex-grow p-4 space-y-2">
//           {tabsData.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`w-full flex items-center p-2 py-3 rounded-md font-medium text-sm transition-colors ${
//                 activeTab === tab.id
//                   ? 'bg-orange-400 text-white'
//                   : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//               }`}
//             >
//               <span className="mr-3 text-lg">{tab.icon}</span>
//               <span className="flex-grow text- text-left">{tab.name}</span>
//               {tab.count !== null && (
//                 <span className={`px-2 py-0.5 text-xs rounded-full ${
//                   activeTab === tab.id ? 'bg-white text-orange-600' : 'bg-gray-600 text-gray-200'
//                 }`}>
//                   {tab.count}
//                 </span>
//               )}
//             </button>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-gray-700">
//                   <div className="flex justify-center items-center space-x-3 bg-black opacity-70 px-3 py-1 rounded-md border border-gray-200 hover:shadow-lg transition-all duration-300">

//                           <p className="px-2 py-1 rounded-md text-md font-medium text-white">{profile?.name || 'Manager'}</p>
                                        
//                         </div>
          
//           <button
//             onClick={handleLogout}
//             className="w-full mt-2 bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       <main className="flex-grow flex flex-col overflow-y-auto">
//         <header className="bg-white shadow-sm border-b p-4">
//           <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
             
//                 <button
//                 onClick={() => {
//                   console.log('🔄 Manual refresh triggered');
//                   loadDashboardData();
//                 }}
//                 className="bg-orange-400 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
//                 disabled={loading}
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
//               </button>
//           </div>
//         </header>

        
//         <div className="p-6 space-y-6">
//           {/* Overview Tab */}
//           {activeTab === 'overview' && (
//             <div className="space-y-6">
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {/* Total Workers */}
//               <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
//                 <div className="p-6">
//                   <div className="flex items-center">

//                     <div className="ml-4">
//                       <p className="text-md font-medium text-gray-500">My Workers</p>
//                       <p className="text-2xl font-bold text-gray-900">{stats.totalWorkers}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Total Complaints */}
//               <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
//                 <div className="p-6">
//                   <div className="flex items-center">

//                     <div className="ml-4">
//                       <p className="text-md font-medium text-gray-500">Total Complaints</p>
//                       <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Pending Complaints */}
//               <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
//                 <div className="p-6">
//                   <div className="flex items-center">
    
//                     <div className="ml-4">
//                       <p className="text-md font-medium text-gray-500">Pending Complaints</p>
//                       <p className="text-2xl font-bold text-gray-900">{stats.pendingComplaints}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Total Tasks */}
//               <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
//                 <div className="p-6">
//                   <div className="flex items-center">

//                     <div className="ml-4">
//                       <p className="text-md font-medium text-gray-500">Total Tasks</p>
//                       <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Pending Tasks */}
//               <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
//                 <div className="p-6">
//                   <div className="flex items-center">

//                     <div className="ml-4">
//                       <p className="text-md font-medium text-gray-500">Pending Tasks</p>
//                       <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Completed Tasks */}
//               <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
//                 <div className="p-6">
//                   <div className="flex items-center">

//                     <div className="ml-4">
//                       <p className="text-md font-medium text-gray-500">Completed Tasks</p>
//                       <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           )}

//           {/* Workers Tab */}
//           {activeTab === 'workers' && (
//             <div className="bg-white rounded-lg shadow-sm border">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-xl font-bold text-gray-900 capitalize">
//                 My Workers - {profile?.department_name || 'Department '  } Department
//               </h2>
//               <p className="text-sm text-gray-600 mt-1">Manage your department workers</p>
//             </div>
//             <div className="p-6">
//               {workers.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {workers.map((worker) => (
//                     <div key={worker.id} className="border rounded-lg p-4 bg-gray-50">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold">
//                           {worker.name?.charAt(0) || 'W'}
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="font-medium text-gray-900">{worker.name}</h3>
//                           <p className="text-sm text-gray-600">{worker.phone}</p>
//                           {worker.workers?.[0] && (
//                             <p className="text-xs text-blue-600">{worker.workers[0].specialization}</p>
//                           )}
//                         </div>
//                         <div className="text-right">
//                           <span className={`px-2 py-1 text-xs rounded-full ${
//                             worker.workers?.[0]?.status === 'active' 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-gray-100 text-gray-800'
//                           }`}>
//                             {worker.workers?.[0]?.status || 'active'}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <div className="text-gray-400 text-4xl mb-4">👥</div>
//                   <p className="text-gray-600">No workers found in your department</p>
//                 </div>
//               )}
//             </div>
//           </div>
//           )}

//           {/* Complaints Tab */}
//           {activeTab === 'complaints' && (
//             <div className="bg-white relative shadow-sm border  ">
//             <div className="px-6 py-4 border-b border-gray-200  ">
//               <h2 className="text-xl font-bold text-gray-900 capitalize">
//                 Department Complaints - {profile?.department_name || 'Department'}
//               </h2>
//               <p className="text-sm text-gray-600 mt-1">Assign complaints to workers</p>
//             </div>
//             <div className="p-6">
//               {complaints.length > 0 ? (
//                 <div className="space-y-4">
//                   {complaints.map((complaint) => (
//                     <div key={complaint.id} className="border rounded-lg p-4">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <h3 className="font-medium text-gray-900">{complaint.citizen_name}</h3>
//                           <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
//                           <p className="text-xs text-gray-500 mt-2">
//                              {complaint.address} |  {complaint.citizen_phone}
//                           </p>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <span className={`px-2 py-1 text-xs rounded-half ${
//                             complaint.status === 'pending' 
//                               ? 'bg-red-100 text-red-800' 
//                               : 'bg-green-100 text-green-800'
//                           }`}>
//                             {complaint.status}
//                           </span>
//                           {complaint.status === 'pending' && (
//                             <button
//                               onClick={() => {
//                                 setSelectedComplaint(complaint);
//                                 setAssignModalOpen(true);
//                               }}
//                               className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
//                             >
//                               Assign
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className=" relative text-center flex-col justify-center items-center ">
//                   <div className="text-gray-400 text-4xl mb-4">

//                   </div>
//                   <p className="text-gray-600">No complaints found for your department</p>
//                 </div>
//               )}
//             </div>
//           </div>
//           )}

//           {/* Tasks Tab */}
//           {activeTab === 'tasks' && (
//            <div className="bg-white rounded-lg shadow-sm border">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-xl font-bold text-gray-900">Tasks Assigned by Me</h2>
//               <p className="text-sm text-gray-600 mt-1">Track tasks you've assigned to workers</p>
//             </div>
//             <div className="p-6">
//               {tasks.length > 0 ? (
//                 <div className="space-y-4">
//                   {tasks.map((task) => (
//                     <div key={task.id} className="border rounded-lg p-4">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <h3 className="font-medium text-gray-900">{task.title}</h3>
//                           <p className="text-sm text-gray-600 mt-1">{task.description}</p>
//                           <p className="text-xs text-gray-500 mt-2">
//                             Assigned to: {task.assigned_to_name || 'Worker'} | 
//                             Priority: {task.priority}
//                           </p>
//                         </div>
//                         <span className={`px-2 py-1 text-xs rounded-full ${
//                           task.status === 'pending' 
//                             ? 'bg-yellow-100 text-yellow-800' 
//                             : task.status === 'completed'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-blue-100 text-blue-800'
//                         }`}>
//                           {task.status}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <div className="text-gray-400 text-4xl mb-4">📝</div>
//                   <p className="text-gray-600">No tasks assigned yet</p>
//                 </div>
//               )}
//             </div>
//           </div>
//           )}
//         </div>

//       </main>

//       {assignModalOpen && selectedComplaint && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Assign Complaint to Worker</h3>
//             <div className="mb-4">
//               <p className="text-sm text-gray-600 mb-2">Complaint:</p>
//               <p className="text-sm font-medium">{selectedComplaint.description}</p>
//             </div>
//             <div className="mb-4">
//               <p className="text-sm text-gray-600 mb-2">Select Worker:</p>
//               <div className="space-y-2">
//                 {workers.map((worker) => (
//                   <button
//                     key={worker.id}
//                     onClick={() => handleAssignTask(selectedComplaint.id, worker.id)}
//                     className="w-full text-left p-3 border rounded hover:bg-blue-50 hover:border-blue-300"
//                   >
//                     <div className="font-medium">{worker.name}</div>
//                     <div className="text-sm text-gray-600">{worker.workers?.[0]?.specialization}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => {
//                   setAssignModalOpen(false);
//                   setSelectedComplaint(null);
//                 }}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//         </div>
//       )}
//     </div>
//     </>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { getComplaintsByDepartment } from '../../services/complaintsService';
import { getTasksByManager, assignTask } from '../../services/taskService';
import { FaBell, FaUser } from 'react-icons/fa';
import { Megaphone, AlertTriangle, SearchCheck } from "lucide-react";
import Caffiene from '../../assets/Caffiene.png';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
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
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing manager dashboard...');
      loadDashboardData();
    }, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const loadDashboardData = async () => {
    try {
      if (!user) {
        navigate('/admin/login');
        return;
      }

      // Fetch user profile from EmployeeProfile table
      const { data: userProfile, error: profileError } = await supabase
        .from('EmployeeProfile')
        .select('*')
        .eq('Eid', user.id)
        .single();

      if (profileError || !userProfile) {
        console.error('Error fetching profile:', profileError);
        await signOut();
        navigate('/admin/login');
        return;
      }

      setProfile(userProfile);

      // Fetch workers by department
      const { data: workersData, error: workersError } = await supabase
        .from('EmployeeProfile')
        .select('*')
        .eq('department_id', userProfile.department_id)
        .eq('role', 'employee');

      const [complaintsData, tasksData] = await Promise.all([
        getComplaintsByDepartment(userProfile.department_id),
        getTasksByManager(userProfile.id)
      ]);

      const safeWorkers = workersData || [];
      const safeComplaints = complaintsData || [];
      const safeTasks = tasksData || [];

      setWorkers(safeWorkers);
      setComplaints(safeComplaints);
      setTasks(safeTasks);

      const pendingComplaints = safeComplaints.filter(c => c.status === 'pending').length;
      const pendingTasks = safeTasks.filter(t => t.status === 'pending').length;
      const completedTasks = safeTasks.filter(t => t.status === 'completed').length;

      setStats({
        totalWorkers: safeWorkers.length,
        totalComplaints: safeComplaints.length,
        pendingComplaints,
        totalTasks: safeTasks.length,
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
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/admin/login');
    }
  };

  const handleAssignTask = async (complaintId, workerId) => {
    const complaint = complaints.find(c => c.id === complaintId);
    if (!complaint || !profile) return;

    const taskData = {
      complaint_id: complaintId,
      assigned_by: profile.id,
      assigned_to: workerId,
      department_id: profile.department_id,
      title: `Complaint: ${complaint.description.substring(0, 40)}...`,
      description: complaint.description,
      priority: 'medium',
      status: 'pending'
    };

    await assignTask(taskData);
    await loadDashboardData(); 
    setAssignModalOpen(false);
    setSelectedComplaint(null);
  };

  const tabsData = [
    { id: 'overview', name: 'Overview', count: null },
    { id: 'workers', name: 'My Workers', count: workers.length },
    { id: 'complaints', name: 'Pending Complaints', count: complaints.filter(c => c.status === 'pending').length },
    { id: 'tasks', name: 'Assigned Tasks', count: tasks.length }
  ];

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800"></div>
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
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
        <div className="p-5 px-4 border-b border-gray-700 flex flex-row">
          <img src={Caffiene} className='h-20 w-20' alt="Logo" />
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
              <span className="mr-3 text-lg">{tab.icon}</span>
              <span className="flex-grow text- text-left">{tab.name}</span>
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
            <p className="px-2 py-1 rounded-md text-md font-medium text-white">{profile?.name || 'Manager'}</p>
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
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
            
            <button
              onClick={() => {
                console.log('🔄 Manual refresh triggered');
                loadDashboardData();
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

        <div className="p-6 space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Workers */}
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <p className="text-md font-medium text-gray-500">My Workers</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalWorkers}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Complaints */}
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <p className="text-md font-medium text-gray-500">Total Complaints</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Complaints */}
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <p className="text-md font-medium text-gray-500">Pending Complaints</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingComplaints}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Tasks */}
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

                {/* Pending Tasks */}
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <p className="text-md font-medium text-gray-500">Pending Tasks</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completed Tasks */}
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <p className="text-md font-medium text-gray-500">Completed Tasks</p>
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
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                  My Workers - {profile?.department_name || 'Department'} Department
                </h2>
                <p className="text-sm text-gray-600 mt-1">Manage your department workers</p>
              </div>
              <div className="p-6">
                {workers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workers.map((worker) => (
                      <div key={worker.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                            {worker.name?.charAt(0) || 'W'}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{worker.name}</h3>
                            <p className="text-sm text-gray-600">{worker.phone}</p>
                            {worker.specialization && (
                              <p className="text-xs text-blue-600">{worker.specialization}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              active
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
            <div className="bg-white relative shadow-sm border">
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
                              {complaint.address} | {complaint.citizen_phone}
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
                  <div className="relative text-center flex-col justify-center items-center">
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
      </main>

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
                    <div className="text-sm text-gray-600">{worker.specialization || 'Worker'}</div>
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
    </>
  );
}