import { TabMenu } from 'primereact/tabmenu';
import React, { useState } from 'react'
import InventoryTab from './InventoryTab';
import VehicleInventoryTab from './VehicleInventoryTab';



const InventoryMaster = () => {
    const [activeIndex, setActiveIndex] = useState(0);
  const TabItems = [
    { label: "Inventory", content: <InventoryTab />},
    { label: "Vehicle Inventory", content: <VehicleInventoryTab />},
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
  )
}

export default InventoryMaster