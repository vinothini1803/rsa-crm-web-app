import React from "react";
import AuthLayout from "../components/layout/AuthLayout";
import { getToken } from "../utills/auth";
import { Navigate, Outlet } from "react-router";

const UnauthenticatedRoute = () => {
  const validUser = getToken();

  return !validUser ? <AuthLayout /> : <Navigate to="/delivery-request" />;
  //return <AuthLayout />;
};

export default UnauthenticatedRoute;
