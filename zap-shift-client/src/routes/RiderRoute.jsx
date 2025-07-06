import React from "react";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import Loading from "../pages/shared/Loading";
import { Navigate } from "react-router";

const RiderRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { role, authLoading } = useUserRole();

  if (isLoading || authLoading) return <Loading />;

  if (!user || role !== "rider")
    return <Navigate state={location.pathname} to="/forbidden" />;

  return children;
};

export default RiderRoute;
