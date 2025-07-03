import React from "react";
import BenefitCard from "./BenefitCard";
import track from "../../../assets/live-tracking.png";
import delivery from "../../../assets/safe-delivery.png";
// benefits Data
const benefits = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: track,
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: delivery,
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: delivery,
  },
];

const Benefits = () => {
  return (
    <div className="bg-base-300 py-12 px-4 lg:px-20 space-y-6 rounded-lg">
      <div className="text-center mb-6 my-5 rounded-lg">
        <h2 className="text-3xl font-bold text-primary">Why Choose Us?</h2>
        <p className="text-gray-600">
          Discover the key advantages of choosing our delivery services.
        </p>
      </div>

      {benefits.map((benefit) => (
        <BenefitCard key={benefit.id} benefit={benefit} />
      ))}
    </div>
  );
};

export default Benefits;
