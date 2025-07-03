import React from "react";
import CoverageMap from "./CoverageMap";
import { useLoaderData } from "react-router";

const Coverage = () => {
  const districtData = useLoaderData();

  return (
    <div className="py-10 px-4 lg:px-20">
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        We are available in 64 districts
      </h1>

      {/* Map */}
      <CoverageMap districtData={districtData} />

      {/* Search box will be added later */}
      <div className="mt-8 text-center">
        <p className="text-gray-500">Search functionality coming soon...</p>
      </div>
    </div>
  );
};

export default Coverage;
