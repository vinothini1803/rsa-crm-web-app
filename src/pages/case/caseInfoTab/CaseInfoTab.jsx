import React, { useState } from "react";
import { useNavigate } from "react-router";
import ViewGrid from "../../../components/common/ViewGrid";
import { Chip } from "primereact/chip";
import NoDataComponent from "../../../components/common/NoDataComponent";
import { NoAspImage } from "../../../utills/imgConstants";
import { TabMenu } from "primereact/tabmenu";
import TabMenuItem from "../../../components/common/TabMenuItem";
import "../style.less";

const CaseInfoTab = ({ aspInfo, ticketInfo, caseData, handleAspAssign }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  // const [visible, setVisible] = useState(false);
  const tabItems = aspInfo?.map((asp, index) => {
    return {
      label: <TabMenuItem label={`ASP - ${index + 1}`} />,
    };
  });
  /* const handleAssignASP = () => {
    if(caseData?.caseTypeId == 413 && caseData?.hasAccidentalDocument == false && caseData?.withoutAccidentalDocument == false) {
      setVisible(true);
    } else {
      navigate(`/cases/asp-assignment/${caseData?.caseDetailId}`);
    }
  }; */

  return (
    <div className="tab-body scroll-hidden">
      <div className="asp-info-container">
        {aspInfo.length <= 1 ? (
          <div className="case-info-title">ASP Info</div>
        ) : (
          <div className="asp-tab-header">
            <div className="case-info-title">ASP Info</div>
            <TabMenu
              model={tabItems}
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
              className="spearate-tab-menu min-none"
            />
          </div>
        )}
        <div className="no-assignment-card bg-white border-transparent">
          {aspInfo?.length > 0 ? (
            <ViewGrid items={aspInfo[activeIndex]} className="grid-3" />
          ) : (
            <NoDataComponent
              image={NoAspImage}
              text={"No ASP Assigned"}
              btntext={"Assign ASP"}
              onClick={handleAspAssign}
              disablebtn={caseData?.agentId ? false : true}
            />
          )}
        </div>
      </div>
      <div className="case-info-container">
        <div className="d-flex align-items-center case-info-title gap">
          Ticket Info
          {/* <Chip
            label="One Time Service"
            className="info-chip blue reminder-chip"
          /> */}
          <Chip
            label={caseData?.caseType}
            className="info-chip green reminder-chip"
          />
        </div>
        <div className="border-box bg-white border-transparent">
          <ViewGrid items={ticketInfo} className="grid-3" />
        </div>
      </div>
      
    </div>
  );
};

export default CaseInfoTab;
