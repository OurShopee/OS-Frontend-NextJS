"use client"
import React from "react";
import Cookies from "js-cookie";
import Notlogin from "./Notlogin";

/**
 * Higher Order Component to protect routes
 * Checks if jwt_token cookie exists
 * If not, shows Notlogin component instead of the wrapped component
 * 
 * Usage:
 * export default withAuth(YourComponent);
 */
const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const isAuthenticated = Cookies.get("jwt_token") !== undefined;

        if (!isAuthenticated) {
            return <Notlogin />;
        }

        return <WrappedComponent {...props} />;
    };

    // Set display name for better debugging
    AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return AuthComponent;
};

export default withAuth;

