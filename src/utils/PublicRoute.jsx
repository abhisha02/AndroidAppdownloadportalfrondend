import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import isAuthUser from "./isAuthUser";
import Loader from "./Loader";

const PublicRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const authStatus = await isAuthUser();
      setIsAuthenticated(authStatus.isAuthenticated);
      
      // Get user details from localStorage
      const tokens = localStorage.getItem('tokens');
      if (tokens) {
        const userData = JSON.parse(tokens);
        setIsManager(userData.is_manager);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    authenticate();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isManager ? "/manager/home" : "/dashboard"} />;
  }

  return children;
};

export default PublicRoute;