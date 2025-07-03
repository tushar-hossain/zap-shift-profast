import React from "react";
import Banner from "./Banner";
import Services from "./Services/Services";
import ClientbrandsMarquee from "./ClientLogosMarquee/ClientLogosMarquee";
import Benefits from "./Benefits/Benefits";
import BeMerchant from "./BeMerchant/BeMerchant";

const Home = () => {
  return (
    <div>
      <Banner />
      <Services />
      <ClientbrandsMarquee />
      <Benefits />
      <BeMerchant />
    </div>
  );
};

export default Home;
