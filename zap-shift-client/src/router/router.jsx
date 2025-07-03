import { createBrowserRouter } from "react-router";
import RootLayouts from "../layouts/RootLayouts";
import Home from "../pages/Home/Home";
import AuthLauouts from "../layouts/AuthLauouts";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import CoverAge from "../pages/CoverAge/CoverAge";
import Loading from "../pages/shared/Loading";
import PrivateRoute from "../routes/PrivateRoute";
import SendParcel from "../pages/SendParcel/SendParcel";
import DashboardLayouts from "../layouts/DashboardLayouts";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payments/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../pages/Dashboard/BeARider/BeARider";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayouts,
    children: [
      { index: true, Component: Home },
      {
        path: "coverage",
        Component: CoverAge,
        loader: () => fetch("./warehouses.json"),
        hydrateFallbackElement: <Loading />,
      },
      {
        path: "addParcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
        loader: () => fetch("./warehouses.json"),
        hydrateFallbackElement: <Loading />,
      },
      {
        path: "beARider",
        element: (
          <PrivateRoute>
            <BeARider />
          </PrivateRoute>
        ),
        loader: () => fetch("./warehouses.json"),
        hydrateFallbackElement: <Loading />,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLauouts,
    children: [
      {
        path: "login",
        Component: Login,
      },
      { path: "register", Component: Register },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayouts />
      </PrivateRoute>
    ),
    children: [
      { path: "myParcels", Component: MyParcels },
      { path: "payment/:parcelId", Component: Payment },
      { path: "paymentHistory", Component: PaymentHistory },
      { path: "track", Component: TrackParcel },
      { path: "profile", Component: PaymentHistory },
      { path: "activeRiders", Component: ActiveRiders },
      { path: "pendingRiders", Component: PendingRiders },
    ],
  },
]);
