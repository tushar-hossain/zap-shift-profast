import React from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../pages/shared/Loading";

const useUserRole = () => {
  const { user, isLoading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role = "user",
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRoll", user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role;
    },
  });

  if (isLoading) return <Loading />;

  return { role, authLoading: authLoading || isLoading, refetch };
};

export default useUserRole;
