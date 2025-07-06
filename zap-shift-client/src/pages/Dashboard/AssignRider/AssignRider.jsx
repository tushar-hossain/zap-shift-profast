import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaUserPlus } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";

export default function AssignRider() {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const QueryClient = useQueryClient();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/assignable`);
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading parcels...</div>;
  }

  // Open modal and fetch riders from the same district as senderWarehouse
  const handleOpenModal = async (parcel) => {
    setSelectedParcel(parcel);
    console.log(parcel.senderWarehouse);
    try {
      const res = await axiosSecure.get(
        `/riders?district=${parcel.senderWarehouse}`
      );
      setRiders(res.data);
      document.getElementById("assign_modal").showModal();
    } catch (err) {
      console.error("Error loading riders:", err);
    }
  };

  // Assign rider to parcel
  const handleAssignRider = async (riderId) => {
    try {
      await axiosSecure.patch(`/parcels/${selectedParcel._id}/assign`, {
        riderId,
      });
      Swal.fire("Success", "Rider assigned successfully!", "success");
      document.getElementById("assign_modal").close();
      QueryClient.invalidateQueries(["assignableParcels"]);
      setSelectedParcel(null);
    } catch (err) {
      Swal.fire("Error", "Failed to assign rider.", "error");
      console.log(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Assign Rider to Parcels</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base font-semibold">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Type</th>
              <th>Title</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Cost</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td className="font-mono text-sm">{parcel.trackingId}</td>
                <td>
                  {parcel.type === "document" ? "Document" : "Non-Document"}
                </td>
                <td>{parcel.title}</td>
                <td>{parcel.senderName}</td>
                <td>{parcel.receiverName}</td>
                <td>৳{parcel.cost}</td>
                <td>{new Date(parcel.creation_date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    // implement this later
                    onClick={() => handleOpenModal(parcel)}
                  >
                    <FaUserPlus className="mr-1" />
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for rider selection */}
      <dialog id="assign_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">
            Select Rider from {selectedParcel?.senderWarehouse}
          </h3>
          {riders.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {riders.map((rider) => (
                <div
                  key={rider._id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{rider.name}</p>
                    <p className="text-sm text-gray-500">{rider.phone}</p>
                  </div>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleAssignRider(rider._id)}
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500">
              No riders available in this district.
            </p>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
