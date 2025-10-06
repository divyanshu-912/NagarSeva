import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/userService';


const ProtectedRoute = ({ children, requiredRole = null, redirectToRole = false }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);


  const checkAuthentication = async () => {
    try {
    
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const { user, profile } = await getCurrentUser();
      
      if (user && profile) {
        setIsAuthenticated(true);
        setUserRole(profile.role);
        console.log('✅ User authenticated:', profile.username, 'Role:', profile.role);
      } else {
        setIsAuthenticated(false);
        console.log('❌ Authentication failed - invalid user/profile');
      }
    } catch (error) {
      console.error('❌ Authentication check error:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

 
  if (!isAuthenticated) {
    console.log('🔄 Redirecting to login - user not authenticated');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log(`🔄 Redirecting - user role '${userRole}' doesn't match required '${requiredRole}'`);
    

    if (redirectToRole) {
      const targetRoute = userRole === 'manager' ? '/manager' : '/worker';
      return <Navigate to={targetRoute} replace />;
    } else {
   
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            {/* <div className="text-6xl mb-4"></div> */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required role: {requiredRole} | Your role: {userRole}
            </p>
            <button 
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  console.log('✅ Access granted to protected route');
  return children;
};

export default ProtectedRoute;