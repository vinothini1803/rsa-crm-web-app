import React, { useState } from "react";
import PageTabHeader from "../../../components/common/PageTabHeader";
import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import City from "./City";
import Regions from "./Regions";
import State from "./State";
import Taluk from "./Taluk";
import District from "./Districts";
import NearestCity from "./NearestCity";

const Locations = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const TabItems = [
    { label: "City", content: <City /> },
    { label: "Regions", content: <Regions /> },
    { label: "State", content: <State /> },
    { label: "Taluk", content: <Taluk /> },
    { label: "District", content: <District/> },
    { label: "Nearest City", content: <NearestCity/> },
  ];
  return (
    <div className="page-wrap">
      <TabMenu
        model={TabItems}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
        className="spearate-tab-menu min-65"
      />
      <div className="page-body">{TabItems[activeIndex].content}</div>
    </div>
  );
};

export default Locations;
