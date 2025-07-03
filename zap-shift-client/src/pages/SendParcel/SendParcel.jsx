import { useForm } from "react-hook-form";
// import { useState } from "react";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const generateTrackingId = () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TRK-${timestamp}-${randomStr}`;
};

export default function AddParcelForm() {
  const { register, handleSubmit, watch, reset } = useForm();
  // const [cost, setCost] = useState(null);
  const serviceData = useLoaderData();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const parcelType = watch("type");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const filteredSenderWarehouses = serviceData.filter(
    (entry) => entry.region === senderRegion
  );

  const filteredReceiverWarehouses = serviceData.filter(
    (entry) => entry.region === receiverRegion
  );

  const onSubmit = (data) => {
    const isWithinDistrict = data.senderWarehouse === data.receiverWarehouse;
    const weight = parseFloat(data.weight || 0);
    let baseCost = 0;
    let extraCost = 0;
    let deliveryCost = 0;
    let costDetails = "";

    if (data.type === "document") {
      baseCost = isWithinDistrict ? 60 : 80;
      costDetails = `<li>Base Cost for Document (${
        isWithinDistrict ? "Within District" : "Outside District"
      }): ৳${baseCost}</li>`;
    } else {
      if (weight <= 3) {
        baseCost = isWithinDistrict ? 110 : 150;
        costDetails = `<li>Base Cost for Non-Document (3kg, ${
          isWithinDistrict ? "Within District" : "Outside District"
        }): ৳${baseCost}</li>`;
      } else {
        const extraKg = weight - 3;
        extraCost = extraKg * 40 + (isWithinDistrict ? 0 : 40);
        baseCost = isWithinDistrict ? 110 : 150;
        costDetails = `
          <li>Base Cost for Non-Document (3kg, ${
            isWithinDistrict ? "Within District" : "Outside District"
          }): ৳${baseCost}</li>
          <li>Extra Weight Cost (৳40 × ${extraKg}kg): ৳${extraKg * 40}</li>
          ${
            !isWithinDistrict
              ? "<li>Extra Fee for Outside District: ৳40</li>"
              : ""
          }
        `;
      }
    }

    deliveryCost = baseCost + extraCost;

    Swal.fire({
      title: "Confirm Parcel Booking",
      html: `
        <ul class="text-left list-disc pl-5 space-y-1 text-sm">
          ${costDetails}
        </ul>
        <div class="mt-4 text-lg font-bold text-blue-600">Total Delivery Cost: ৳${deliveryCost}</div>
      `,
      icon: "info",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Proceed to Payment",
      denyButtonText: "Edit Again",
      cancelButtonText: "Cancel",
      customClass: {
        htmlContainer: "text-sm",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const parcelData = {
          ...data,
          cost: deliveryCost,
          created_by: user.email,
          payment_status: "unpaid",
          delivery_status: "not_collected",
          creation_date: new Date().toISOString(),
          trackingId: generateTrackingId(),
        };

        console.log(parcelData);

        // save data to the server
        axiosSecure.post("/parcels", parcelData).then((res) => {
          if (res.data.insertedId) {
            // TODO: redirect to the payment page
          }
        });

        Swal.fire({
          icon: "success",
          title: "Payment Initiated",
          text: "Redirecting to payment gateway...",
        });

        reset();
      } else if (result.isDenied) {
        Swal.fire("You can now edit your form.", "", "info");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-8">
      <div>
        <h2 className="text-xl md:text-3xl font-bold">
          Enter your parcel details
        </h2>
        <div className="form-control space-y-3">
          <label className="label">Parcel Type</label>
          <div className="flex gap-4">
            <label className="cursor-pointer label">
              <input
                type="radio"
                value="document"
                {...register("type")}
                className="radio"
              />
              <span className="label-text ml-2">Document</span>
            </label>
            <label className="cursor-pointer label">
              <input
                type="radio"
                value="non-document"
                {...register("type")}
                className="radio"
              />
              <span className="label-text ml-2">Non-Document</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div className="">
            <label className="label">Parcel Name: </label>
            <input
              {...register("title", { required: true })}
              placeholder="Enter parcel name"
              className="input w-full"
            />
          </div>

          <div>
            {parcelType === "non-document" && (
              <div className="form-control">
                <label className="label">Parcel Weight (kg): </label>
                <input
                  {...register("weight")}
                  type="number"
                  placeholder="Enter weight in kg"
                  className="input w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* sender  */}
        <div>
          <h2 className="text-xl font-bold">Sender Details: </h2>
          <div className=" space-y-2">
            <div className="form-control">
              <label className="label text-sm">Sender Name: </label>
              <input
                {...register("senderName", { required: true })}
                placeholder="Enter sender name"
                className="input input-bordered w-full"
              />
            </div>
            {/*  */}
            <div className="form-control">
              <label className="label">Sender Region: </label>
              <select
                {...register("senderRegion", { required: true })}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select one
                </option>
                {[...new Set(serviceData.map((item) => item.region))].map(
                  (region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-control">
              <label className="label">Sender Address: </label>
              <input
                {...register("senderAddress", { required: true })}
                placeholder="Enter address"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">Sender Contact No: </label>
              <input
                {...register("senderContact", { required: true })}
                placeholder="Enter contact number"
                className="input input-bordered w-full"
              />
            </div>
            {/*  */}
            <div className="form-control">
              <label className="label">Sender Pickup Warehouse: </label>
              <select
                {...register("senderWarehouse", { required: true })}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select one
                </option>
                {filteredSenderWarehouses.map((entry) => (
                  <option key={entry.district} value={entry.district}>
                    {entry.district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-control mt-4">
            <label className="label">Pickup Instruction</label>
            <textarea
              {...register("pickupInstruction", { required: true })}
              placeholder="Add any special instruction"
              className="textarea textarea-bordered w-full"
            />
          </div>
        </div>

        {/* Receiver  */}
        <div>
          <h2 className="text-xl font-bold">Receiver Details</h2>
          <div className=" space-y-2">
            <div className="form-control">
              <label className="label">Receiver Name</label>
              <input
                {...register("receiverName", { required: true })}
                placeholder="Enter receiver name"
                className="input input-bordered w-full"
              />
            </div>
            {/*  */}
            <div className="form-control">
              <label className="label">Receiver Region</label>
              <select
                {...register("receiverRegion", { required: true })}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select one
                </option>
                {[...new Set(serviceData.map((item) => item.region))].map(
                  (region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-control">
              <label className="label">Receiver Address</label>
              <input
                {...register("receiverAddress", { required: true })}
                placeholder="Enter address"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">Receiver Contact No</label>
              <input
                {...register("receiverContact", { required: true })}
                placeholder="Enter contact number"
                className="input input-bordered w-full"
              />
            </div>
            {/*  */}
            <div className="form-control">
              <label className="label">Receiver Delivery Warehouse</label>
              <select
                {...register("receiverWarehouse", { required: true })}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select one
                </option>
                {filteredReceiverWarehouses.map((entry) => (
                  <option key={entry.district} value={entry.district}>
                    {entry.district}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-control mt-4">
            <label className="label">Delivery Instruction</label>
            <textarea
              {...register("deliveryInstruction", { required: true })}
              placeholder="Add any special instruction"
              className="textarea textarea-bordered w-full"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Proceed to Confirm Booking
      </button>
    </form>
  );
}
