import React from "react";
import { Outlet } from "react-router";
import authImg from "../assets/authImage.png";
import ProFastLogo from "../pages/shared/ProfastLogo";

const AuthLauouts = () => {
  return (
    <div className="p-12 bg-base-200">
      <div>
        <ProFastLogo />
      </div>
      <div className="hero-content gap-10 flex-col lg:flex-row-reverse">
        <div className="flex-1 ">
          <img src={authImg} className="max-w-sm rounded-lg shadow-2xl" />
        </div>
        <div className="flex-1 px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLauouts;
