import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { useLoaderData } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function BeARider() {
  const { user } = useAuth();
  const { register, handleSubmit, watch, reset } = useForm();
  const selectedRegion = watch("region");
  const serviceData = useLoaderData();
  const axiosSecure = useAxiosSecure();

  const districts = serviceData
    .filter((item) => item.region === selectedRegion)
    .map((item) => item.district);

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      name: user.displayName,
      email: user.email,
      status: "pending", // default
      submittedAt: new Date().toISOString(),
    };

    try {
      // replace with your axiosSecure or fetch call
      console.log("Sending rider data:", riderData);
      axiosSecure.post(`/riders`, riderData).then((res) => {
        if (res.data.insertedId) {
          toast.success("Rider application submitted!");
        }
      });

      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit rider application.");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Become a Delivery Rider</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="form-control">
          <label className="label">Full Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={user?.displayName}
            readOnly
          />
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            value={user?.email}
            readOnly
          />
        </div>

        {/* Age */}
        <div className="form-control">
          <label className="label">Age</label>
          <input
            type="number"
            {...register("age", { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter your age"
          />
        </div>

        {/* Region */}
        <div className="form-control">
          <label className="label">Region</label>
          <select
            {...register("region", { required: true })}
            className="select select-bordered w-full"
          >
            <option disabled value="">
              Select region
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

        {/* District */}
        <div className="form-control">
          <label className="label">District</label>
          <select
            {...register("district", { required: true })}
            className="select select-bordered w-full"
          >
            <option disabled value="">
              Select district
            </option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number */}
        <div className="form-control">
          <label className="label">Phone Number</label>
          <input
            type="text"
            {...register("phone", { required: true })}
            className="input input-bordered w-full"
            placeholder="01XXXXXXXXX"
          />
        </div>

        {/* NID */}
        <div className="form-control">
          <label className="label">National ID Card Number</label>
          <input
            type="text"
            {...register("nid", { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter NID number"
          />
        </div>

        {/* Bike Brand */}
        <div className="form-control">
          <label className="label">Bike Brand</label>
          <input
            type="text"
            {...register("bikeBrand", { required: true })}
            className="input input-bordered w-full"
            placeholder="E.g. Yamaha, Honda"
          />
        </div>

        {/* Registration Number */}
        <div className="form-control">
          <label className="label">Bike Registration Number</label>
          <input
            type="text"
            {...register("bikeRegNumber", { required: true })}
            className="input input-bordered w-full"
            placeholder="E.g. DHA-123456"
          />
        </div>

        {/* Additional Notes */}
        <div className="form-control">
          <label className="label">Additional Info</label>
          <textarea
            {...register("notes")}
            className="textarea textarea-bordered w-full"
            placeholder="Optional notes"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Submit Application
        </button>
      </form>
    </div>
  );
}
