import React from "react";

const BenefitCard = ({ benefit }) => {
  const { title, description, image } = benefit || {};

  return (
    <div className="card md:card-side shadow border border-gray-500 p-8 items-center justify-center bg-gray-200 text-black hover:shadow-amber-100">
      <figure className="w-24 h-24">
        <img
          src={`${image}`}
          alt={title}
          className="object-contain w-full h-full"
        />
      </figure>

      {/* Vertical Divider */}
      <div className="hidden md:block h-20 w-px border border-dashed border-gray-400 mx-4" />

      <div className="card-body p-0">
        <h2 className="card-title text-lg text-[#03373D]">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default BenefitCard;
