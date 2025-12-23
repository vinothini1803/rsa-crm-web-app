import React, { useEffect, useMemo } from "react";
import {
  Navigate,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Sider from "./Sider";
import Header from "./Header";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import { getToken } from "../../utills/auth";
import { MenuList } from "../../utills/menuList";
import FloatingCallButton from "../common/FloatingCallButton";
import NewsBanner from "./NewsBanner";
import { MapViewProvider } from "../../contexts/MapViewContext";

const MainLayout = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValues = {
    mode: queryParams.get("mode"),
  };
  const user = useSelector(CurrentUser);
  // Check for map route - the route path is "map"
  // Match patterns like /map, /map/, /something/map, etc. but not /map-something
  const isMapView = /\/map(\/|$)/.test(location.pathname);
  // console.log("user=>", user?.role?.name == "Agent");
  
  const content = (
    <div className="layout-wrap">
      <Sider />
      <div className="layout-content">
        <NewsBanner /> 
        <Header />
        <main className="layout-main">
          <Outlet />
        </main>
        {/* <Footer /> */}
        {paramValues?.mode=="i" ? null: user?.role?.id == 3 ? <FloatingCallButton/> : null }
      </div>
    </div>
  );

  // Wrap with MapViewProvider only on map page
  // This ensures context is available when MapViewContent renders
  if (isMapView) {
    return <MapViewProvider>{content}</MapViewProvider>;
  }

  return content;
};

export default MainLayout;
