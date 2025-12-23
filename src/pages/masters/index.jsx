import React from "react";
import DashBoardMenuItem from "../../components/common/DashBoardMenuItem";
import { MenuList } from "../../utills/menuList";
import { LocationsIcon } from "../../utills/imgConstants";

const MasterHome = () => {
  const allMenus = MenuList.map((el) => el.menus);
  const MasterSubMenus = allMenus
    .flat()
    ?.find((ele) => ele.code == "master")?.submenus;

  return (
    <div className="page-wrap">
      <div className="page-body">
        <div className="border-box bg-white border-transparent">
          <div className="dashboard-content-scroll">
            <div className="row gy-4">
              {MasterSubMenus?.map(({ label, description, icon, url }, i) => (
                <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6" key={i}>
                  <DashBoardMenuItem
                    title={label}
                    description={description}
                    icon={icon}
                    link={url}
                  />
                </div>
              ))}
              {/* {Array.from({ length: 10 }, (e, i) => (
                <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
                  <DashBoardMenuItem
                    title={"Locations"}
                    description={
                      "Specific places, regions, or areas that can be identified."
                    }
                    icon={LocationsIcon}
                    link={""}
                  />
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterHome;
