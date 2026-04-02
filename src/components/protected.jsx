import React from 'react';
import { Navigate, Outlet} from 'react-router-dom';

function ProtectedRoute() {
 
  
  const user_token = localStorage.getItem("user_token");
  
  return user_token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;