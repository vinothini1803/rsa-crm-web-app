import React from "react";
import { MenuList } from "../../utills/menuList";
import DashBoardMenuItem from "../../components/common/DashBoardMenuItem";
const  AdminHome =()=> {
  const Allmenu = MenuList?.map((el) => el.menus);
  const AdminSubmenu = Allmenu?.flat()?.find(
    (el) => el.code == "admin"
  ).submenus;
  console.log("AdminSubmenu", AdminSubmenu);
  return (
    <div className="page-wrap">
      <div className="page-body">
        <div className="border-box bg-white border-transparent">
          <div className="dashboard-content-scroll">
            <div className="row gy-4">
              {AdminSubmenu?.map(({ label, description, icon, url },i) => (
                <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6" key={i}>
                  <DashBoardMenuItem
                    title={label}
                    description={description}
                    icon={icon}
                    link={url}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
