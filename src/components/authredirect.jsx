import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthRedirect = () => {

  const user_token = localStorage.getItem("user_token");
  
  return user_token ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default AuthRedirect;