import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import AdminLogin from './pages/admin/Login';
import ManagerDashboard from './pages/admin/ManagerDashboard';
import WorkerDashboard from './pages/admin/WorkerDashboard';
import PublicComplaintForm from './pages/admin/PublicComplaintForm';
import AdminProtectedRoute from './components/admin/ProtectedRoute';


import UserLandingPage from './pages/user/LandingPage';
import UserNavbar from './components/user/Navbar';
import UserFooter from './components/user/Footer';
import UserLogin from './components/user/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={
            <>
              <UserNavbar />
              <UserLandingPage cityName="Prayagraj" />
              <UserFooter />
            </>
          } />
          <Route path="/user" element={
            <>
              <UserNavbar />
              <UserLandingPage cityName="Prayagraj" />
              <UserFooter />
            </>
          } />
          <Route path="/user/login" element={<UserLogin />} />
          
       
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/complaint" element={<PublicComplaintForm />} />
          
          <Route 
            path="/admin/manager" 
            element={
              <AdminProtectedRoute requiredRole="manager">
                <ManagerDashboard />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/worker" 
            element={
              <AdminProtectedRoute requiredRole="worker">
                <WorkerDashboard />
              </AdminProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;