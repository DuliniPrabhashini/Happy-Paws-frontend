import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>; // spinner or loading message
  if (!user) return <Navigate to="/login" replace />; // redirect if not logged in

  return children;
};

export default ProtectedRoute;
