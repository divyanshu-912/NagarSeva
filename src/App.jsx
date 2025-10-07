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
import UserLogin from './pages/user/UserLogin'; // ✅ Updated to use new UserLogin page
import MyProfile from './pages/user/MyProfile';
import ComplaintForm from './pages/user/ComplaintForm'; // ✅ Complaint form for users

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
          <Route path="/user/my-profile" element={<>
              <UserNavbar />
              <MyProfile />
              <UserFooter />
            </>} />
          <Route path="/Complaint" element={<ComplaintForm />} /> {/* ✅ User complaint form */}
          
       
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