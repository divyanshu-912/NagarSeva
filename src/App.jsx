
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/admin/ProtectedRoute';
// import Login from './pages/admin/Login';
// import ManagerDashboard from './pages/admin/ManagerDashboard';
// import WorkerDashboard from './pages/admin/WorkerDashboard';

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/admin/login" element={<Login />} />
//           <Route path="/" element={<Navigate to="/admin/login" replace />} />

//           {/* Protected Routes - Manager only */}
//           <Route 
//             path="/admin/manager" 
//             element={
//               <ProtectedRoute allowedRoles={['manager']}>
//                 <ManagerDashboard />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Protected Routes - Employee only */}
//           <Route 
//             path="/admin/employee" 
//             element={
//               <ProtectedRoute allowedRoles={['employee']}>
//                 <WorkerDashboard />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Catch all - redirect to login */}
//           <Route path="*" element={<Navigate to="/admin/login" replace />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Navbar from "./components/user/Navbar";

// Import Pages
import LandingPage from './pages/user/LandingPage'; // Ya jo bhi naam ho
import AdminLogin from './pages/admin/Login';
import UserLogin from './components/user/Login'; // User ka login page
import ManagerDashboard from './pages/admin/ManagerDashboard';
import WorkerDashboard from './pages/admin/WorkerDashboard';
// Import user dashboard if needed
// import UserDashboard from './pages/user/UserDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          {/* Landing Page - First page when npm run dev */}
          <Route path="/" element={
            <>
            <Navbar/>
            <LandingPage /> </>} />
         
          {/* Admin Login - For Manager/Employee */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* User Login - For Citizens */}
          <Route path="/user/login" element={<UserLogin />} />

          {/* Protected Admin Routes */}
          {/* Manager Dashboard */}
          <Route 
            path="/admin/manager" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Employee/Worker Dashboard */}
          <Route 
            path="/admin/employee" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <WorkerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Protected User Routes */}
          {/* User Dashboard - Agar user ke liye dashboard hai */}
          {/* 
          <Route 
            path="/user/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          */}

          {/* Catch all - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;