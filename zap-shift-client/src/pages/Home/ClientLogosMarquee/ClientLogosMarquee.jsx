import React from "react";
import Marquee from "react-fast-marquee";

import logo1 from "../../../assets/brands/amazon.png";
import logo2 from "../../../assets/brands/amazon_vector.png";
import logo3 from "../../../assets/brands/casio.png";
import logo4 from "../../../assets/brands/moonstar.png";
import logo5 from "../../../assets/brands/randstad.png";
import logo6 from "../../../assets/brands/start-people 1.png";
import logo7 from "../../../assets/brands/start.png";

const brands = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

const ClientbrandsMarquee = () => {
  return (
    <section className="bg-white py-12 my-5 rounded-lg">
      <div className="max-w-7xl mx-auto text-center mb-6 px-4">
        <h2 className="text-2xl font-bold text-primary mb-12">
          We've helped thousands of sales teams
        </h2>
      </div>

      <Marquee
        speed={50}
        pauseOnHover={true}
        gradient={false}
        direction="left"
        className="overflow-hidden"
      >
        {brands.map((logo, index) => (
          <div
            key={index}
            className="mx-24 flex items-center justify-center min-w-[100px]"
          >
            <img
              src={logo}
              alt={`Client logo ${index + 1}`}
              className="h-6 object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ClientbrandsMarquee;
