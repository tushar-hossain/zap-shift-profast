import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaUserShield, FaUserAltSlash } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading";

export default function MakeAdmin() {
  const { register, handleSubmit } = useForm();
  const axiosSecure = useAxiosSecure();
  const [emailToSearch, setEmailToSearch] = useState("");

  const {
    data: users,
    refetch,
    isError,
    isFetching,
  } = useQuery({
    enabled: !!emailToSearch,
    queryKey: ["search-user", emailToSearch],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${emailToSearch}`);
      return res.data;
    },
    retry: false,
  });

  const makeAdminMutation = useMutation({
    mutationFn: async (id) => {
      //   /users/:id/role
      return axiosSecure.patch(`/users/${id}/role`, { role: "admin" });
    },
    onSuccess: () => {
      Swal.fire("Success", `${emailToSearch} is now an Admin!`, "success");
      refetch();
    },
    onError: () => {
      Swal.fire("Error", "Could not make admin", "error");
    },
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (id) => {
      //   /users/:id/role
      return axiosSecure.patch(`/users/${id}/role`, { role: "user" });
    },
    onSuccess: () => {
      Swal.fire("Success", `${emailToSearch} is no longer an Admin.`, "info");
      refetch();
    },
    onError: () => {
      Swal.fire("Error", "Could not remove admin", "error");
    },
  });

  const onSubmit = (data) => {
    setEmailToSearch(data.email);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Make or Remove Admin</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-6">
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Enter user email"
          className="input input-bordered flex-grow"
        />
        <button className="btn btn-primary">Search</button>
      </form>

      {/*  */}
      {isFetching && <Loading />}
      {isError && <p className="text-red-500">User not found</p>}

      {users &&
        users.map((user) => {
          return (
            <div
              key={user._id}
              className="border rounded p-4 shadow space-y-2 bg-base-100 mb-5"
            >
              <p>
                <strong>Id:</strong> {user._id}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.create_at).toLocaleDateString()}
              </p>

              {user.role !== "admin" ? (
                <button
                  onClick={() => makeAdminMutation.mutate(user?._id)}
                  className="btn btn-success mt-2"
                  disabled={makeAdminMutation.isPending}
                >
                  <FaUserShield className="inline mr-2" /> Make Admin
                </button>
              ) : (
                <button
                  onClick={() => removeAdminMutation.mutate(user?._id)}
                  className="btn btn-warning mt-2"
                  disabled={removeAdminMutation.isPending}
                >
                  <FaUserAltSlash className="inline mr-2" /> Remove Admin
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
}
