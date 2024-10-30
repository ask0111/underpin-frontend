import { Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { isAuthenticated, isAdminAuthenticated } from "./auth";

export const PrivateRoute = ({ element }) => {
    const [isVerified, setIsVerified] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const result = await isAuthenticated();
            setIsVerified(result);
        };
        verifyToken();
    }, []);

    if (isVerified === null) return <div>Loading...</div>; // Show loading while verifying

    return isVerified ? React.cloneElement(element, { playerId:isVerified }) : <Navigate to="/login" replace />;
};

export const PrivateAdminRoute = ({ element }) => {
    const [isVerified, setIsVerified] = useState(null);

    useEffect(() => {
        const verifyAdmin = async () => {
            const result = await isAdminAuthenticated();
            setIsVerified(result);
        };
        verifyAdmin();
    }, []);

    if (isVerified === null) return <div>Loading...</div>; // Show loading while verifying

    return isVerified ? React.cloneElement(element, { isVerified }) : <Navigate to="/login" replace />;
};
