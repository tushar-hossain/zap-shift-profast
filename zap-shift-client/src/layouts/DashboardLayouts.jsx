import React from "react";
import { NavLink, Outlet } from "react-router";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import ProFastLogo from "../pages/shared/ProfastLogo";
import {
  MdDashboard,
  MdLocalShipping,
  MdPayment,
  MdTrackChanges,
  MdPerson,
  MdCheckCircle,
  MdHourglassEmpty,
  MdPending,
} from "react-icons/md";
import { FaUserShield, FaMotorcycle } from "react-icons/fa";
import useUserRole from "../hooks/useUserRole";

const DashboardLayouts = () => {
  const { role, authLoading } = useUserRole();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Page content here */}
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">Dashboard</div>
        </div>
        {/* Page content here */}
        <div className="ms-5">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <ProFastLogo />
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-primary font-bold" : ""
              }
            >
              <MdDashboard className="inline mr-2" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/myParcels"
              className={({ isActive }) =>
                isActive ? "text-primary font-bold" : ""
              }
            >
              <MdLocalShipping className="inline mr-2" /> My Parcels
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/paymentHistory"
              className={({ isActive }) =>
                isActive ? "text-primary font-bold" : ""
              }
            >
              <MdPayment className="inline mr-2" /> Payment History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/track"
              className={({ isActive }) =>
                isActive ? "text-primary font-bold" : ""
              }
            >
              <MdTrackChanges className="inline mr-2" /> Track a Package
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                isActive ? "text-primary font-bold" : ""
              }
            >
              <MdPerson className="inline mr-2" /> Update Profile
            </NavLink>
          </li>

          {/* rider role */}
          {!authLoading && role === "rider" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/pendingDeliveries"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  <MdPending className="inline mr-2" /> Pending Deliveries
                </NavLink>
              </li>
            </>
          )}

          {/* admin role */}
          {!authLoading && role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/activeRiders"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  <MdCheckCircle className="inline mr-2" /> Active Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/pendingRiders"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  <MdHourglassEmpty className="inline mr-2" /> Pending Riders
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/makeAdmin"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  <FaUserShield className="inline mr-2" /> Make Admin
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/assignRider"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  <FaMotorcycle className="inline mr-2" /> Assign Rider
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayouts;
