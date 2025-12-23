import { lazy } from "react";
import Loadable from "../components/common/Loadable";
import ExpiredPassword from "../pages/auth/ExpiredPassword";

const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const ForgotPassword = Loadable(
  lazy(() => import("../pages/auth/ForgotPassword"))
);
const ResetPassword = Loadable(
  lazy(() => import("../pages/auth/ResetPassword"))
);

const AuthRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path:"/password-expired/reset",
    element:<ExpiredPassword/>
  }
];

export default AuthRoutes;
