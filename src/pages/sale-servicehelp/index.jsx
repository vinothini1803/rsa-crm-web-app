import { TabMenu } from "primereact/tabmenu";
import React, { useState } from "react";
import FieldService from "./FieldService";
import FieldSales from "./FieldSales";

const SaleServiceHelp = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const TabItems = [
    { label: "Field Service", content: <FieldService /> },
    { label: "Field Sales", content: <FieldSales /> },
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

export default SaleServiceHelp;
