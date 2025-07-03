import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    isPending,
    isError,
    data: payments = [],
    error,
  } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Parcel ID</th>            
            <th>Amount (৳)</th>
            <th>Payment Method</th>
            <th>Transaction ID</th>
            <th>Status</th>
            <th>Paid At</th>
          </tr>
        </thead>
        <tbody>
          {payments && payments.length > 0 ? (
            payments.map((payment, idx) => (
              <tr key={idx}>
                <td>{payment.parcelId}</td>
                <td>{payment.amount}</td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.transactionId}</td>
                <td>
                  <span
                    className={
                      payment.status === "paid"
                        ? "badge badge-success"
                        : "badge badge-warning"
                    }
                  >
                    {payment.status}
                  </span>
                </td>
                <td>{new Date(payment.paid_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No payment history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
