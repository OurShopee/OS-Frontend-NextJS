"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Notlogin from "./Notlogin";

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Get authentication state from Redux store
    const authStatus = useSelector((state) => state.formslice.authstatus);

    useEffect(() => {
      const token = Cookies.get("jwt_token");
      const hasToken = token !== undefined;
      setIsAuthenticated(hasToken);
      setIsChecking(false);
    }, []);

    // Listen to Redux authentication state changes
    useEffect(() => {
      setIsAuthenticated(authStatus);
    }, [authStatus]);

    // Show loading state while checking
    if (isChecking) {
      return <div>Loading...</div>; // Or your loading component
    }

    if (!isAuthenticated) {
      return <Notlogin />;
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthComponent;
};

export default withAuth;
