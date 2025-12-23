import React, { useState } from "react";
import { TabMenu } from "primereact/tabmenu";

const PageTabHeader = ({ items, onchange }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleChange = (e) => {
    setActiveIndex(e.index);
    onchange(e.index);
  };
  return (
    <div>
      <TabMenu
        model={items || []}
        activeIndex={activeIndex}
        onTabChange={handleChange}
        className="page-tab-menu"
      />
    </div>
  );
};

export default PageTabHeader;
