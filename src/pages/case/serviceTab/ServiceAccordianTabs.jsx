import React, { useState, useEffect } from "react";
import { TabPanel, TabView } from "primereact/tabview";
import { TabMenu } from "primereact/tabmenu";
import TabMenuItem from "../../../components/common/TabMenuItem";
import {
  ChatTimeLineIcon,
  CollapseIcon,
  CollapseMinusIcon,
  CollapsePlusIcon,
  ContactImage,
  ExpandIcon,
  InfoDarkIcon,
  InteractionImage,
  MobileTimeLineIcon,
  NoInventoryImage,
  ReminderImage,
  EditGreyIcon,
  SystemTimeLineIcon,
  UpdatePencilIcon,
  NotificationButtonIcon,
  greyUpdateIcon,
} from "../../../utills/imgConstants";
import { Button } from "primereact/button";
import ViewGrid from "../../../components/common/ViewGrid";
import TimelineAccordian from "../TimelineAccordian";
import AttachmentsTab from "./AttachmentsTab";
import NoDataComponent from "../../../components/common/NoDataComponent";
import { useNavigate } from "react-router";
import ServiceCostTab from "./ServiceCostTab";
import { CurrentUser } from "../../../../store/slices/userSlice";
import { useSelector } from "react-redux";
import { Accordion, AccordionTab } from "primereact/accordion";
import SelectableButtons from "./SelectableButtons";
import SendNotificationSidebar from "../../../components/common/SendNotificationSidebar";
import SendNotificationSidebarCrm from "../../../components/common/SendNotificationSidebarCrm";
import ReimbursementTab from "./ReimbursementTab";
import ReimbursementUpdateDialog from "./ReimbursementUpdateDialog";
import TransactionsTab from "./TransactionsTab";

const ServiceAccordianTabs = ({
  setVisible,
  setActivityDialogVisible,
  setInteractionDialogeVisible,
  setReminderDialogeVisible,
  serviceDetailsTabData,
  activityTabData,
  inventoryTabData,
  aspResultData,
  caseData,
  aspRefetch,
  activeServiceIndex,
  caseDetailrefetch,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inventoryActiveIndex, setInventoryActiveIndex] = useState(0);
  const [towingAccordinActiveIndex, setTowingAccordinActiveIndex] = useState(0);
  const [inventoryActiveTypeId, setInventoryActiveTypeId] = useState(162);
  const [activeAccordians, setActiveAccordians] = useState([]);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [reimbursementUpdateVisible, setReimbursementUpdateVisible] =
    useState(false);
  const [conditionMet, setConditionMet] = useState(false);
  const navigate = useNavigate();
  const { userTypeId, role, entityId, id, levelId } = useSelector(CurrentUser);
  const { user } = useSelector(CurrentUser);
  const permissions = role?.permissions?.map((perm) => perm.name) || [];
  // const tabs = [
  //   { label: <TabMenuItem label="Service Details" /> },
  //   { label: <TabMenuItem label="Service Cost" /> },
  //   { label: <TabMenuItem label="Attachments" /> },
  //   { label: <TabMenuItem label="Inventory" /> },
  //   { label: <TabMenuItem label="Activity" /> },
  // ];
  useEffect(() => {
    const isReimbursement = aspResultData[activeServiceIndex]?.isReimbursement;
    const serviceId = aspResultData[activeServiceIndex]?.serviceId;
    const subServiceId = aspResultData[activeServiceIndex]?.subServiceId;

    // Check the condition only after the value changes
    const condition =
      isReimbursement || (serviceId === 3 && subServiceId !== 24);

    setConditionMet(condition); // Update the state based on condition
  }, [aspResultData, activeServiceIndex]);
  useEffect(() => {
    aspRefetch[activeServiceIndex]?.refetch();
    caseDetailrefetch();
  }, [activeServiceIndex, tabIndex]);
  // Check if activity has non-membership transactions (paymentTypeId: 174)
  const hasNonMembershipTransactions =
    aspResultData[activeServiceIndex]?.transactions?.some(
      (txn) => txn?.paymentTypeId === 174
    ) || false;

  const tabs = [
    { label: <TabMenuItem label="Service Details" /> },
    hasNonMembershipTransactions
      ? { label: <TabMenuItem label="Transactions" /> }
      : null,
    aspResultData[activeServiceIndex]?.isReimbursement ||
    (aspResultData[activeServiceIndex]?.serviceId == 3 &&
      aspResultData[activeServiceIndex]?.subServiceId != 24)
      ? null
      : { label: <TabMenuItem label="Service Cost" /> },
    aspResultData[activeServiceIndex]?.isReimbursement ||
    (aspResultData[activeServiceIndex]?.serviceId == 3 &&
      aspResultData[activeServiceIndex]?.subServiceId != 24)
      ? null
      : { label: <TabMenuItem label="Attachments" /> },
    // aspResultData[activeServiceIndex]?.isReimbursement ||
    // (aspResultData[activeServiceIndex]?.serviceId == 3 &&
    //   aspResultData[activeServiceIndex]?.subServiceId != 24)
    //   ? null
    //   : { label: <TabMenuItem label="Inventory" /> },
    { label: <TabMenuItem label="Activity" /> },
    aspResultData[activeServiceIndex]?.isReimbursement &&
    aspResultData[activeServiceIndex]?.activityStatusId == 7 &&
    !aspResultData[activeServiceIndex]?.customerNeedToPay
      ? { label: <TabMenuItem label="Reimbursement" /> }
      : null,
  ].filter((tab) => tab !== null);
  const handleInventory = () => {
    // console.log(
    //   "Active service => ",
    //   aspResultData[activeServiceIndex]?.serviceId
    // );
    if (aspResultData[activeServiceIndex]?.serviceId == 2) {
      navigate(
        `/cases/inventory/${aspResultData[activeServiceIndex]?.activityId}/162`
      );
    } else {
      navigate(
        `/cases/towing-inventory/${
          aspResultData[activeServiceIndex]?.activityId
        }/${inventoryActiveIndex == 0 ? "162" : "161"}`
      );
    }
  };

  const handleInventoryUpdate = () => {
    if (aspResultData[activeServiceIndex]?.serviceId == 2) {
      navigate(
        `/cases/inventory/update/${aspResultData[activeServiceIndex]?.activityId}/162`
      );
    } else {
      navigate(
        `/cases/towing-inventory/update/${
          aspResultData[activeServiceIndex]?.activityId
        }/${inventoryActiveIndex == 0 ? "162" : "161"}`
      );
    }
  };

  // console.log("inventoryTabData ", aspResultData);
  // console.log(
  //   "aspResultData[activeServiceIndex]?.isReimbursement",
  //   aspResultData[activeServiceIndex]?.isReimbursement
  // );

  // Helper function to get tab label text
  const getTabLabel = (tab) => {
    if (tab?.label?.props?.label) {
      return tab.label.props.label;
    }
    return null;
  };

  // Helper function to render TabPanels in the correct order
  const renderTabPanels = () => {
    return tabs.map((tab, index) => {
      const label = getTabLabel(tab);

      if (label === "Service Details") {
        return (
          <TabPanel key={index} className="service-detail-tabpanel">
            <div className="border-box bg-white border-transparent">
              <ViewGrid items={serviceDetailsTabData} className="grid-3" />
            </div>
          </TabPanel>
        );
      }

      if (label === "Transactions") {
        return (
          <TabPanel key={index} className="service-detail-tabpanel">
            <TransactionsTab
              activityId={aspResultData[activeServiceIndex]?.activityId}
              aspRefetch={aspRefetch[activeServiceIndex]}
              caseData={caseData}
              activityData={aspResultData[activeServiceIndex]}
            />
          </TabPanel>
        );
      }

      if (label === "Service Cost") {
        return (
          <TabPanel key={index} className="service-detail-tabpanel">
            <div className="border-box bg-white border-transparent">
              <ServiceCostTab
                caseData={caseData}
                activityDetail={aspResultData[activeServiceIndex]}
                aspRefetch={aspRefetch[activeServiceIndex]}
                caseStatusId={caseData?.caseStatusId}
                caseDetailrefetch={caseDetailrefetch}
                advancePay={
                  aspResultData?.some((activity) =>
                    activity?.transactions?.some(
                      (transactions) =>
                        transactions?.paymentTypeId == 170 &&
                        transactions?.paymentStatusId == 191
                    )
                  )
                    ? aspResultData
                        ?.find((activity) =>
                          activity?.transactions?.some(
                            (transactions) =>
                              transactions?.paymentTypeId == 170 &&
                              transactions?.paymentStatusId == 191
                          )
                        )
                        ?.transactions?.find(
                          (transactions) =>
                            transactions?.paymentTypeId == 170 &&
                            transactions?.paymentStatusId == 191
                        )?.paidByDealerId == entityId
                      ? true
                      : false
                    : true
                }
              />
            </div>
          </TabPanel>
        );
      }

      if (label === "Attachments") {
        return (
          <TabPanel key={index} className="service-detail-tabpanel">
            <AttachmentsTab
              activityId={aspResultData[activeServiceIndex]?.activityId}
              serviceId={aspResultData[activeServiceIndex]?.serviceId}
            />
          </TabPanel>
        );
      }

      if (label === "Activity") {
        return (
          <TabPanel key={index} className="service-detail-tabpanel">
            <div className="service-activity-tab">
              {![3, 4].includes(caseData?.caseStatusId) &&
                levelId != 1045 &&
                id == caseData?.agentId && (
                  <>
                    {permissions?.includes("activity-add-interaction-web") && (
                      <button
                        className="btn-white  btn-with-icon activity-btn"
                        onClick={() => setInteractionDialogeVisible(true)}
                        disabled={
                          aspResultData[activeServiceIndex]?.agentPickedAt ==
                          null
                            ? true
                            : false
                        }
                      >
                        <img src={InteractionImage} />
                        Add Interaction
                      </button>
                    )}
                    {permissions?.includes("add-reminder-web") && (
                      <button
                        className="btn-white btn-with-icon activity-btn"
                        onClick={() => setReminderDialogeVisible(true)}
                        disabled={
                          aspResultData[activeServiceIndex]?.agentPickedAt ==
                          null
                            ? true
                            : false
                        }
                      >
                        <img src={ReminderImage} />
                        Add Reminder
                      </button>
                    )}
                    {permissions?.includes("send-notification-web") && (
                      <button
                        className="btn-white btn-with-icon activity-btn"
                        onClick={() => setNotificationVisible(true)}
                        disabled={
                          aspResultData[activeServiceIndex]?.agentPickedAt ==
                          null
                            ? true
                            : false
                        }
                      >
                        <img src={NotificationButtonIcon} />
                        Add Notification
                      </button>
                    )}
                  </>
                )}
            </div>
            <div className="timeline-container">
              <div className="service-activity-timeline-container">
                <TimelineAccordian
                  events={activityTabData}
                  activeAccordians={activeAccordians}
                  setActiveAccordians={setActiveAccordians}
                />
              </div>
            </div>
          </TabPanel>
        );
      }

      if (label === "Reimbursement") {
        return (
          <TabPanel key={index} className="service-detail-tabpanel">
            <>
              {aspResultData[activeServiceIndex]?.reimbursementDetails
                ?.paymentStatus == "Pending" &&
                permissions?.includes(
                  "activity-reimbursement-update-detail-web"
                ) &&
                levelId != 1045 &&
                id == caseData?.agentId && (
                  <div className="d-flex justify-content-end mb-2">
                    <button
                      type="button"
                      className="btn-white btn-with-icon activity-btn"
                      onClick={() => setReimbursementUpdateVisible(true)}
                    >
                      <img src={greyUpdateIcon} />
                      Update
                    </button>
                  </div>
                )}
              <div className="border-box bg-white border-transparent">
                <ReimbursementTab
                  aspResultData={aspResultData}
                  activeServiceIndex={activeServiceIndex}
                  aspRefetch={aspRefetch}
                  caseData={caseData}
                />
              </div>
            </>
          </TabPanel>
        );
      }

      return null;
    });
  };

  return (
    <>
      <TabMenu
        model={tabs}
        activeIndex={tabIndex}
        onTabChange={(e) => setTabIndex(e?.index)}
        className="accordian-tabmenu"
      ></TabMenu>
      <TabView
        activeIndex={tabIndex}
        onTabChange={(e) => setTabIndex(e?.index)}
      >
        {renderTabPanels()}
      </TabView>
      {reimbursementUpdateVisible && (
        <ReimbursementUpdateDialog
          visible={reimbursementUpdateVisible}
          setVisible={setReimbursementUpdateVisible}
          aspResultData={aspResultData}
          activeServiceIndex={activeServiceIndex}
          aspRefetch={aspRefetch}
        />
      )}
      {notificationVisible && (
        <SendNotificationSidebarCrm
          visible={notificationVisible}
          setVisible={setNotificationVisible}
          Details={caseData}
          activityId={aspResultData[activeServiceIndex]?.activityId}
          activeServiceIndex={activeServiceIndex}
          aspRefetch={aspRefetch}
        />
      )}
    </>
  );
};

export default ServiceAccordianTabs;
