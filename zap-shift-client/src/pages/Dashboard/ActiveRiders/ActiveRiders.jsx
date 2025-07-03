import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUserTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function ActiveRiders() {
  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredRiders, setFilteredRiders] = useState([]);
  const axiosSecure = useAxiosSecure();

  const {
    data: riders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/riders/active`);
      return data;
    },
  });

  // useEffect(() => {
  //   const filtered = riders.filter((rider) =>
  //     rider.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredRiders(filtered);
  // }, [searchTerm, riders]);

  const handleDeactivate = async (riderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/riders/${riderId}`, { status: "pending" });
        Swal.fire("Deactivated!", "Rider has been deactivated.", "success");
        refetch();
      } catch (error) {
        Swal.fire("Error", "Failed to deactivate rider.", "error");
      }
    }
  };

  if (isLoading) return <p>Loading riders...</p>;
  if (isError) return <p>Failed to load riders.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

      <input
        type="text"
        placeholder="Search by name..."
        className="input input-bordered mb-4 w-full max-w-xs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {riders.length < 1 ? (
        <p>No active riders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Region</th>
                <th>District</th>
                <th>Phone</th>
                <th>Bike Brand</th>
                <th>Bike Reg. No.</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {riders?.map((rider) => (
                <tr key={rider._id}>
                  <td>{rider.name}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.bikeBrand}</td>
                  <td>{rider.bikeRegNumber}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-error flex items-center gap-1"
                      onClick={() => handleDeactivate(rider._id)}
                      title="Deactivate Rider"
                    >
                      <FaUserTimes /> Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
