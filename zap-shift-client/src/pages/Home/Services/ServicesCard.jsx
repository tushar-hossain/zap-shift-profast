import React from "react";

const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service || {};
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg p-4 border border-gray-200 hover:bg-[#CAEB66] transition-all duration-300">
      <div className="flex items-center gap-4 mb-3">
        <div className="text-primary text-3xl mx-auto">
          <Icon />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-center text-primary">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
