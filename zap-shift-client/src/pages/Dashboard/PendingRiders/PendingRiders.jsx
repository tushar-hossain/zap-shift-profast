import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../shared/Loading";

export default function PendingRiders() {
  const [selected, setSelected] = useState(null);
  const axiosSecure = useAxiosSecure();

  const {
    isPending,
    isError,
    data: riders = [],
    error,
    refetch,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/pending`);
      return res.data;
    },
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleApprove = async (riderId, email) => {
    const confirm = await Swal.fire({
      title: "Approve Rider?",
      text: "This rider will be marked as active.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/riders/${riderId}`, {
          status: "active",
          email,
        });
        if (res.data.modifiedCount) {
          Swal.fire("Approved!", "Rider is now active.", "success");
        }

        refetch();
      } catch {
        Swal.fire("Error", "Failed to approve rider.", "error");
      }
    }
  };

  const handleCancel = async (riderId) => {
    const confirm = await Swal.fire({
      title: "Cancel Application?",
      text: "Are you sure you want to reject this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/riders/${riderId}`);
        Swal.fire(
          "Cancelled!",
          "Rider application has been removed.",
          "success"
        );
        refetch();
      } catch {
        Swal.fire("Error", "Failed to cancel rider.", "error");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>District</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>{rider.phone}</td>
                <td>
                  <span className="badge badge-warning">{rider.status}</span>
                </td>
                <td>{new Date(rider.submittedAt).toLocaleDateString()}</td>
                <td className="space-x-2 flex">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelected(rider)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleApprove(rider._id, rider.email)}
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleCancel(rider._id)}
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing full rider info */}
      {selected && (
        <dialog id="rider_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Rider Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <b>Name:</b> {selected.name}
              </p>
              <p>
                <b>Email:</b> {selected.email}
              </p>
              <p>
                <b>Region:</b> {selected.region}
              </p>
              <p>
                <b>District:</b> {selected.district}
              </p>
              <p>
                <b>Phone:</b> {selected.phone}
              </p>
              <p>
                <b>NID:</b> {selected.nid}
              </p>
              <p>
                <b>Bike Brand:</b> {selected.bikeBrand}
              </p>
              <p>
                <b>Bike Reg No:</b> {selected.bikeRegNumber}
              </p>
              {selected.extraInfo && (
                <p className="col-span-2">
                  <b>Other Info:</b> {selected.extraInfo}
                </p>
              )}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
