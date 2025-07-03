import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import "./CheckoutForm.css";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [payError, setPayError] = useState(null);
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    isPending,
    isError,
    data: parcelInfo,
    error,
  } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/parcels/${parcelId}`);
      return data;
    },
  });
  if (isPending) return <Loading />;
  if (isError) return toast.error(error.message);

  const amountInCent = parcelInfo?.cost * 100;

  const handelSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setPayError(error.message);
    } else {
      setPayError(null);
      console.log("[paymentMethod]", paymentMethod);

      // step-2 create payment intent
      const { data } = await axiosSecure.post(`/create-payment-intent`, {
        amountInCent,
        parcelId,
      });

      // step-3 create payment intent
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      });

      if (result.error) {
        payError(result.error?.message);
      } else {
        if (result.paymentIntent?.status === "succeeded") {
          // console.log(result.paymentIntent);
          // toast.success("Payment succeeded!");
          const transactionId = result.paymentIntent.id;

          // step- 4: mark parcel paid also create history
          const paymentsData = {
            parcelId,
            email: user?.email,
            amount: amountInCent,
            paymentMethod: result.paymentIntent.payment_method_types,
            transactionId,
          };

          const paymentRes = await axiosSecure.post(`/payments`, paymentsData);

          if (paymentRes.data.insertedId) {
            // SweetAlert2 payment success
            Swal.fire({
              title: "🎉 Payment Successful!",
              html: `<strong>Transaction ID:</strong><br><code>${transactionId}</code>`,
              icon: "success",
              confirmButtonText: "Go to My Parcels",
              allowOutsideClick: false,
            }).then(() => {
              navigate("/dashboard/myParcels"); // redirect after user clicks confirm
            });
          }
        }
      }
    }
  };

  return (
    <div>
      <form onSubmit={handelSubmit}>
        <CardElement />
        {payError && <p className="text-red-500 mb-2 text-sm">{payError}</p>}
        <button className="btn btn-primary" type="submit" disabled={!stripe}>
          Pay ${parcelInfo?.cost}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
