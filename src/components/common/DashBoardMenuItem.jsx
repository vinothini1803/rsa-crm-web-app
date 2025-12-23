import React from "react";
import { NavLink } from "react-router-dom";

const DashBoardMenuItem = ({ icon, title, description ,link ,onClick}) => {

  return (
    <NavLink  className="dashboard-menu-item" to={link} onClick={onClick}>
      <img src={icon} className="menu-icon" />
      <div className="menu-content">
        <div className="menu-name">{title}</div>
        <div className="menu-description">{description}</div>
      </div>
    </NavLink>
  );
};

export default DashBoardMenuItem;
