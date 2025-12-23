import React, { useState } from "react";
import DeliveryRequestTab from "./DeliveryRequestTab";
import { TabMenu } from "primereact/tabmenu";
import EscalationsTab from "./EscalationsTab";
import InvoicesTab from "./InvoicesTab";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";

const DeliveryRequest = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { userTypeId, role } = useSelector(CurrentUser);

  console.log("role", role);

  const TabItems = [
    { label: "Delivery Requests", content: <DeliveryRequestTab /> },
    /*  {
      label: "Escalations",
      content: <EscalationsTab />,
    },*/
    //1)Admin 2)Agent 7)Team leader 31)Dealer Finance Admin
    ...([1, 2, 7, 31].includes(role?.id)
      ? [
          {
            label: "Invoices",
            content: <InvoicesTab />,
          },
        ]
      : []),
  ];

  return (
    <div className="page-wrap">
      <TabMenu
        model={TabItems}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
        className="spearate-tab-menu min-65"
      />
      <div className="page-body">{TabItems[activeIndex]?.content}</div>
    </div>
  );
};

export default DeliveryRequest;
