import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import isAuthUser from './isAuthUser';
import Loader from "./Loader";

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const authStatus = await isAuthUser();

        setIsAuthenticated(authStatus.isAuthenticated);
      } catch (error) {
        console.log("Error during authentication:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;