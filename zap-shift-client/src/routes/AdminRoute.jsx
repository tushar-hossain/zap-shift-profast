import React from "react";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import Loading from "../pages/shared/Loading";
import { Navigate, useLocation } from "react-router";

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { role, authLoading } = useUserRole();
  const location = useLocation();

  if (isLoading || authLoading) return <Loading />;

  if (!user || role !== "admin") {
    return <Navigate state={location.pathname} to="/forbidden" />;
  }
  return children;
};

export default AdminRoute;
