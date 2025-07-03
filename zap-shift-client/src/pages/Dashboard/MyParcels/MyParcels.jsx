import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Loading from "../../shared/Loading";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: parcels,
    isError,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myParcel", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/parcels?email=${user.email}`);
      return data;
    },
  });

  if (isPending) return <Loading />;
  if (isError) return <span>Error: {error.message}</span>;

  // delete parcels
  const handleDelete = async (parcel) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the parcel (${parcel.title})!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/parcels/${parcel._id}`);
        if (res.data.deletedCount) {
          Swal.fire("Deleted!", "Parcel has been deleted.", "success");
        }
        refetch();
      } catch (err) {
        Swal.fire("Error!", "Something went wrong.", err);
      }
    }
  };

  // payment handel
  const handelPay = (id) => {
    navigate(`/dashboard/payment/${id}`);
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📦 All Parcels</h2>
      <table className="table table-zebra w-full">
        <thead className="bg-base-200 text-base font-semibold">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Type</th>
            <th>Created</th>
            <th>Cost</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>
              <td>{parcel.title}</td>
              <td className="capitalize">
                {parcel.type === "document" ? "Document" : "Non-Document"}
              </td>
              <td>{new Date(parcel.creation_date).toLocaleString()}</td>
              <td>৳{parcel.cost}</td>
              <td>
                <span
                  className={`badge ${
                    parcel.payment_status === "paid"
                      ? "badge-success"
                      : "badge-error"
                  } badge-sm`}
                >
                  {parcel.payment_status}
                </span>
              </td>
              <td className="flex gap-2">
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => onView(parcel)}
                >
                  <Eye size={16} />
                </button>
                {parcel.payment_status === "unpaid" && (
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handelPay(parcel._id)}
                  >
                    Pay
                  </button>
                )}
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(parcel)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {parcels.length === 0 && (
            <tr>
              <td className="text-center py-6 text-gray-600">
                No parcels found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcels;
