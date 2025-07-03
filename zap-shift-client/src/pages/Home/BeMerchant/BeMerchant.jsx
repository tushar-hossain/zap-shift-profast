import React from "react";
import location from "../../../assets/location-merchant.png";

const BeMerchant = () => {
  return (
    <div
      data-aos="zoom-in-up"
      className="bg-[#03373D] bg-[url(assets/be-a-merchant-bg.png)] bg-no-repeat my-5 rounded-lg p-15 "
    >
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={location} className="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <h1 className="text-5xl font-bold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <div className="flex items-center gap-5">
            <button className="btn btn-primary rounded-full bg-[#CAEB66] text-black">
              Become a Merchant
            </button>
            <button className="btn bg-[#03373D] border border-[#CAEB66] text-[#CAEB66] rounded-full">
              Earn with Profast Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
