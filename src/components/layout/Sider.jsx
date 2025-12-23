import React, { useState, useEffect } from "react";
import { MenuList } from "../../utills/menuList";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useSelector } from "react-redux";
import {
  AppSiderIcon,
  LogoImage,
  RoadCareProIcon,
} from "../../utills/imgConstants";

const Sider = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [activeMenu, setActiveMenu] = useState(1);
  const { pathname } = useLocation();
  const { userTypeId, isNewUser, role } = useSelector(CurrentUser) || {};
  // console.log("role", role);

  /* console.log(useLocation()); */
  const pathArray = pathname.split("/");
  let submenu = [];
  let subMenuTitle;
  //console.log('Path => ', pathArray);

  // console.log(
  //   "deliver request menu",
  //   MenuList?.filter((group) => group.group_title == "Settings")
  // );

  useEffect(() => {
    const allMenus = MenuList.map((el) => el.menus);
    // console.log("All Menu => ", allMenus.flat());
    const currentMenu = allMenus
      .flat()
      ?.find((ele) => ele.code == pathArray[1]);
    // console.log("Current Menu => ", currentMenu);
    setActiveMenu(currentMenu?.key);
  });

  MenuList?.forEach((el) => {
    el?.menus?.forEach((data) => {
      // console.log("submenus", data.submenus, pathArray[1], pathArray);
      if (data.submenus && data.code == pathArray[1] && pathArray.length > 2) {
        /* console.log('true'); */
        submenu = data.submenus;
        subMenuTitle = data.label;
      }
    });
  });
  // console.log("SubMenu =>", submenu);
  const permissions = role?.permissions?.map((perm) => perm.name) || [];
  return (
    <>
      <aside
        className={`sider-wrap ${collapsed ? "collapsed" : ""} ${
          submenu.length > 0 ? "submenu-active" : ""
        }`}
      >
        <nav className="sider-content">
          <button
            className="sider-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <i className="pi pi-chevron-left"></i>
          </button>
          <div className="sider-content-wrap">
            <div
              className={`sider-main ${submenu.length > 0 ? "collapsed" : ""}`}
            >
              <div className="sider-logo-wrap">
                <img
                  src={
                    collapsed || submenu?.length > 0
                      ? AppSiderIcon
                      : RoadCareProIcon
                  }
                  alt="logo"
                />
              </div>
              {/* Sider Logo */}
              <div className="sider-list-wrap">
                {/* {MenuList?.map((grp, index) => (
                  <div className="sider-list-group" key={index}>
                    <p className="sider-list-group-title">{grp.group_title}</p>
                    <ul className="sider-list">
                      {grp.menus?.map((menu, i) => (
                        <li
                          className={`sider-list-item ${
                            activeMenu == menu.key ? "active" : ""
                          }`}
                          key={i}
                          onClick={() => setActiveMenu(menu.key)}
                        >
                          {collapsed && (
                            <Tooltip
                              className="white-tooltip"
                              target={`.sider_link_${i}`}
                            />
                          )}
                          <NavLink
                            to={menu?.url}
                            className={`sider-list-link sider_link_${i}`}
                            data-pr-tooltip={menu.label}
                          >
                            <img
                              className="img-fluid sider-list-link-img"
                              src={menu.icon}
                              alt="Hoome"
                            />
                            <span className="sider-list-link-txt">
                              {menu.label}
                            </span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))} */}

                {/* {MenuList?.map((grp, index) => (
                  <div className="sider-list-group" key={index}>
                    {grp?.menus?.filter((menu) =>
                    ["Delivery Requests","TDS","Contact Us"].includes(menu?.label) ? (menu?.accessRoleId?.includes(role?.id))
                     : (!menu?.requiredPermission || permissions?.includes(menu?.requiredPermission))
                    )?.length > 0 && (
                      <p className="sider-list-group-title">
                        {grp.group_title}
                      </p>
                    )}
                    <ul className="sider-list">
                      {grp.menus
                        .filter((menu) =>
                          // menu?.accessRoleId?.includes(role?.id)&&  (!menu?.requiredPermission || permissions?.includes(menu?.requiredPermission))
                        ["Delivery Requests","TDS","Contact Us"].includes(menu?.label) ? (menu?.accessRoleId?.includes(role?.id))
                        : (!menu?.requiredPermission || permissions?.includes(menu?.requiredPermission))
                        )
                        ?.map((menu, i) => (
                          <li
                            className={`sider-list-item ${
                              activeMenu == menu.key ? "active" : ""
                            }`}
                            key={i}
                            onClick={() => setActiveMenu(menu.key)}
                          >
                            {collapsed && (
                              <Tooltip
                                className="white-tooltip"
                                target={`.sider_link_${i}`}
                              />
                            )}
                            <NavLink
                              to={menu?.url}
                              className={`sider-list-link sider_link_${i}`}
                              data-pr-tooltip={menu.label}
                              // onClick={(e) => {
                              //   if (isNewUser) {
                              //     e.preventDefault();
                              //   }
                              // }}
                            >
                              <img
                                className="img-fluid sider-list-link-img"
                                src={menu.icon}
                                alt="Hoome"
                              />
                              <span className="sider-list-link-txt">
                                {menu.label}
                              </span>
                            </NavLink>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))} */}
                {MenuList?.map((grp, index) => {
                  const filteredMenus = grp?.menus?.filter((menu) => {
                    const hasAccessRole = menu?.accessRoleId
                      ? menu?.accessRoleId.includes(role?.id)
                      : true;
                    const hasRequiredPermission =
                      !menu?.requiredPermission ||
                      permissions?.includes(menu?.requiredPermission);

                    return hasAccessRole && hasRequiredPermission;
                  });

                  return filteredMenus.length > 0 ? (
                    <div className="sider-list-group" key={index}>
                      <p className="sider-list-group-title">
                        {grp.group_title}
                      </p>
                      <ul className="sider-list">
                        {filteredMenus.map((menu, i) => (
                          <li
                            className={`sider-list-item ${
                              activeMenu === menu.key ? "active" : ""
                            }`}
                            key={i}
                            onClick={() => setActiveMenu(menu.key)}
                          >
                            {collapsed && (
                              <Tooltip
                                className="white-tooltip"
                                target={`.sider_link_${i}`}
                              />
                            )}
                            <NavLink
                              to={menu?.url}
                              className={`sider-list-link sider_link_${i}`}
                              data-pr-tooltip={menu.label}
                            >
                              <img
                                className="img-fluid sider-list-link-img"
                                src={menu.icon}
                                alt={menu.label}
                              />
                              <span className="sider-list-link-txt">
                                {menu.label}
                              </span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            {/* Sider Main */}
            {submenu.length > 0 && (
              <div className="sider-sub">
                <div className="sider-sub-header">
                  <h5 className="sider-sub-header-title">{subMenuTitle}</h5>
                </div>
                <div className="sider-sub-body">
                  <ul className="sider-sub-list">
                    {submenu?.map((menu, index) => (
                      <li className="sider-sub-list-item" key={index}>
                        <NavLink to={menu?.url} className="sider-sub-list-link">
                          {menu.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </nav>
        {/* Sider Content */}
      </aside>
      {/* Sider Wrap */}
    </>
  );
};

export default Sider;
