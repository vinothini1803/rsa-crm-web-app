import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utills/auth";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../store/slices/userSlice";

const AuthenticatedRoute = () => {
  const validUser = getToken();

  const user = useSelector(CurrentUser) ;

  return validUser && user?.isNewUser ? (
    <Navigate to="/update-password" />
  ) : validUser && !user?.isNewUser ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default AuthenticatedRoute;
