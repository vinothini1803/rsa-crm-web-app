import { lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";

import Loadable from "../components/common/Loadable";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import UserRoutes from "./UserRoutes";
import AuthRoutes from "./AuthRoutes";
import AuthLayout from "../components/layout/AuthLayout";
import PolicyLayout from "../components/layout/PolicyLayout";
//import ErrorPage from "../pages/error-pages/ErrorPage"
const ErrorPage = Loadable(
  lazy(() => import("../pages/error-pages/ErrorPage"))
);
// import MainLayout from "../components/layout/MainLayout";
const MainLayout = Loadable(
  lazy(() => import("../components/layout/MainLayout"))
);
const UpdatePassword = Loadable(lazy(() => import("../pages/update-password")));
const DeleteAccount = Loadable(lazy(() => import("../pages/delete-account")));
const TermsConditions = Loadable(
  lazy(() => import("../pages/terms-conditions"))
);
const PrivacyPolicy = Loadable(lazy(() => import("../pages/privacy-policy")));
const RoadLocation = Loadable(lazy(() => import("../pages/road-location")));
const AspLiveLocation = Loadable(lazy(() => import("../pages/live-location")));
const IdCard = Loadable(lazy(() => import("../pages/id-card")));
const CustomerLayout = Loadable(lazy(() => import("../pages/customers")));
const AccidentalAttachmentContent = Loadable(
  lazy(() => import("../pages/customers/AccidentalAttachmentContent"))
);
const AccidentalAttachmentSucces = Loadable(
  lazy(() => import("../pages/customers/AccidentalAttachmentSucces"))
);

const routes = [
  {
    path: "/",
    element: <AuthenticatedRoute />,
    children: [...UserRoutes],
  },

  /* New User Route */
  {
    path: "/update-password",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <UpdatePassword />,
      },
    ],
  },
  /*Login Route*/
  {
    path: "",
    element: <UnauthenticatedRoute />,
    children: [...AuthRoutes],
  },
  /* Capture Location */
  {
    path: "capture-location",
    element: <RoadLocation />,
  },
  /*Asp Live Location */
  {
    path: "service-provider/live-location",
    element: <AspLiveLocation />,
  },
  /*Id Card*/
  {
    path: "service-provider/id-card",
    element: <IdCard />,
  },
  /* Customer Layout */
  {
    path: "customers",
    element: <CustomerLayout />,
    children: [
      {
        path: "accidental-attachments",
        element: <AccidentalAttachmentContent />,
      },
      {
        path: "accidental-attachments-success",
        element: <AccidentalAttachmentSucces />,
      },
    ],
  },
  /* Error Pages */
  {
    path: "*",
    element: <Navigate to="/page/404" />,
  },
  {
    path: "/delete-account",
    element: <AuthLayout layout={"deleteaccount"} />,
    children: [
      {
        index: true,
        element: <DeleteAccount />,
      },
    ],
  },

  {
    path: "/page",
    children: [
      {
        path: ":id",
        element: <ErrorPage />,
      },
    ],
  },

  {
    path: "",
    element: <PolicyLayout />,
    children: [
      {
        path: "terms",
        element: <TermsConditions />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />,
      },
    ],
  },
];

export default function Routes() {
  return useRoutes(routes);
}
