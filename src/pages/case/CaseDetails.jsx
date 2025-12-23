import React, { useState } from "react";
import CaseInfoTab from "./caseInfoTab/CaseInfoTab";
import ActivityTab from "./activityTab/ActivityTab";
import ServiceTab from "./serviceTab/ServiceTab";
import { TabView, TabPanel } from "primereact/tabview";
import { TabMenu } from "primereact/tabmenu";
import TabMenuItem from "../../components/common/TabMenuItem";

const CaseDetails = ({ caseData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const AspInfo = [
    /* [
      {
        label: "Activity Status",
        value: "Started to Breakdown",
        action: "Change",
      },
      { label: "ASP Workshop Name", value: "Pelican Towing Service" },
      {
        label: "ASP Code",
        value: "TNF020",
        vlaueClassName: "info-badge info-badge-purple",
      },
      { label: "Mechanic Name", value: "Jai Surya Kumar K", action: "Edit" },
      {
        label: "Mechanic Contact",
        value: "9876453234",
        vlaueClassName: "info-badge info-badge-yellow",
        action: (
          <div className="call-action">
            <img src={ContactImage} /> Call
          </div>
        ),
      },
      {
        label: (
          <div className="d-flex align-items-center">
            ETA <img className={"eta-info-image"} src={InfoDarkIcon} />
          </div>
        ),
        value: "10 (min)",
        vlaueClassName: "info-badge info-badge-yellow",
      },
      {
        label: "Comment by ASP",
        value: "Starting to BD in 5 mins",
        
      },
      {
        label: "Service",
        value: "Mechanical",
        
      },
    ],
    [
      {
        label: "Activity Status",
        value: "Breakdown",
        action: "Change",
      },
      { label: "ASP Workshop Name", value: "Pelican Towing Service" },
      {
        label: "ASP Code",
        value: "TNF034",
        vlaueClassName: "info-badge info-badge-purple",
      },
      { label: "Mechanic Name", value: "Jai Surya Kumar K", action: "Edit" },
      {
        label: "Mechanic Contact",
        value: "9876453234",
        vlaueClassName: "info-badge info-badge-yellow",
        action: (
          <div className="call-action">
            <img src={ContactImage} /> Call
          </div>
        ),
      },
      {
        label: (
          <div className="d-flex align-items-center">
            ETA <img className={"eta-info-image"} src={InfoDarkIcon} />
          </div>
        ),
        value: "10 (min)",
        vlaueClassName: "info-badge info-badge-yellow",
      },
      {
        label: "Comment by ASP",
        value: "Starting to BD in 5 mins",
        
      },
      {
        label: "Service",
        value: "Mechanical",
        
      },
    ], */
  ];
  const ticketInfo = [
    { label: "Membership type", value: caseData?.serviceEligibility || "--" },
    {
      label: "Women Assist",
      value: caseData?.womenAssist ? "Yes" : "No",
      vlaueClassName: `info-badge ${
        caseData?.womenAssist ? "info-badge-green" : "info-badge-red"
      }`,
    },
    {
      label: "Irate Customer",
      value: caseData?.irateCustomer ? "Yes" : "No",
      vlaueClassName: `info-badge ${
        caseData?.irateCustomer ? "info-badge-green" : "info-badge-red"
      }`,
    },
    {
      label: "Contact Language",
      value: caseData?.contactLanguage,
    },
    /* {
      label: "Additional Charges",
      value: (
        <div className="additional-charges">
          ₹ 3000
          <div className="view-grid-item-value info-badge info-badge-green">
            Collected
          </div>
        </div>
      ),
    },
    {
      label: "Owner",
      subLabel: "(L2 agent)",
      value: "Arun Sharma",
    }, */
    { label: "Requested By", value: caseData?.createdBy || "--" },
    /* { label: "SLA Category", value: "Location Type" },
    { label: "SLA Sub Category", value: "Highways" },
    { label: "SLA Status", value: "SLA Met" },
    {
      label: "SLA Estimation Time",
      value: "02/03/2022 20:20 AM",
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "SLA End Time",
      value: "03/03/2022 20:20 AM",
      vlaueClassName: "info-badge info-badge-purple",
    }, */
    {
      label: "Status",
      badge: caseData?.caseStatus,
      statusType: "caserequestStatus",
    },
    {
      label: "Breakdown Location",
      value: (
        <div>
          {caseData?.breakdownLocation}{" "}
          {/* <span className="blue_text">View All</span> */}
        </div>
      ),
      // action: "Change",
    },
    { label: "Nearby City", value: caseData?.nearestCity },
    { label: "Location Type", value: caseData?.dropLocationType },
    { label: "(VOC)Voice of Customer", value: caseData?.voiceOfCustomer },
    /* {
      label: "State",
      value: "Karnataka",
      vlaueClassName: "info-badge info-badge-blue",
    }, */
    /* { label: "Service Org", value: "Chennai", itemClassName: "separator-none" },
    { label: "Remarks", value: "Good Work",itemClassName: "separator-none"  },
    {
      label: "Rating",
      value: "5.5",
      
      vlaueClassName: "info-badge info-badge-yellow",
    }, */
  ];

  const tabMenuItems = [
    { label: <TabMenuItem label="Case Info" /> },
    /* {
      label: (
        <TabMenuItem label="Activities" badge={"4"} badgeClassName={"danger"} />
      ),
    },
    { label: <TabMenuItem label="Services" /> }, */
  ];
  return (
    <>
      <TabMenu
        model={tabMenuItems}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
        className="spearate-tab-menu min-168"
      />
      <div className="case-tab-content">
        <TabView
          className="tab-header-hidden case-view-tab bg-transparent"
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel>
            <CaseInfoTab
              caseData={caseData}
              aspInfo={AspInfo}
              ticketInfo={ticketInfo}
            />
          </TabPanel>
          <TabPanel>
            <ActivityTab />
          </TabPanel>
          <TabPanel>
            <ServiceTab />
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default CaseDetails;
