import React, { useState } from "react";
import Accounts from "./Accounts";
import { TabMenu } from "primereact/tabmenu";
import Customers from "./Customers";

const Clients = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const TabItems = [
    { label: "Accounts", content: <Accounts /> },
    //  { label: "Customers", content: <Customers /> }, 
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

export default Clients;
