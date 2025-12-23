import React, { Suspense } from "react";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import { Navigate } from "react-router";

const Loadable = (Component, roles) => (props) => {
  const user = useSelector(CurrentUser);

  return (
    <Suspense fallback={<Loader />}>
      {!roles || roles?.includes(user?.role?.id) ? (
        <Component {...props} />
      ) : (
        <Navigate to={"/page/403"} />
      )}
    </Suspense>
  );
};

export default Loadable;
