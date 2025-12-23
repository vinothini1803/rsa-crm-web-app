import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import { useNavigate } from "react-router";
import { Menu } from "primereact/menu";
import moment from "moment";

import {
  CaseMenuDropDownIcon,
  GridIcon,
  ListIcon,
} from "../../utills/imgConstants";
import "./style.less";

import SendNotificationSidebar from "../../components/common/SendNotificationSidebar";
import ReminderSidebar from "../../components/common/ReminderSidebar";
import MyCases from "./MyCases";
import SubServiceList from "./Subservices";
import ReimbursementListTab from "./ReimbursementListTab";
import MyTeamCases from "./MyTeamCases";
import RemindersListTab from "./RemindersListTab";
import RefundCasesListTab from "./RefundCasesListTab";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useSelector } from "react-redux";
import ChipFilter from "./ChipFilter";
import SubChipFilter from "./SubChipFilter";

const CaseList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCase, setSelectedCase] = useState("All");
  const [visible, setVisible] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState("list");
  const casemenu = useRef();
  const { role } = useSelector(CurrentUser);
  const permissions = role?.permissions?.map((perm) => perm.name) || [];
  const isPSFUser = permissions.includes("psf-cases");
  const [selectedFilter, setSelectedFilter] = useState(" ");
  const [subServiceSelectedFilter, setSubServiceSelectedFilter] = useState(" ");
  const dateFiltersRef = useRef({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });
  const [myCasesDateFilters, setMyCasesDateFilters] = useState(
    dateFiltersRef.current
  );
  const [subServiceDateFilters, setSubServiceDateFilters] = useState(
    dateFiltersRef.current
  );
  const [reimbursementDateFilters, setReimbursementDateFilters] = useState(
    dateFiltersRef.current
  );
  const [myTeamCasesDateFilters, setMyTeamCasesDateFilters] = useState(
    dateFiltersRef.current
  );
  const [remindersDateFilters, setRemindersDateFilters] = useState(
    dateFiltersRef.current
  );
  const [refundCasesDateFilters, setRefundCasesDateFilters] = useState(
    dateFiltersRef.current
  );
  const [myCasesFilters, setMyCasesFilters] = useState({
    calendar: [
      moment().startOf("month").toDate(),
      moment().endOf("month").toDate(),
    ],
  });
  const [subServicesFilters, setSubServicesFilters] = useState({
    calendar: [
      moment().startOf("month").toDate(),
      moment().endOf("month").toDate(),
    ],
  });
  const [reimbursementFilters, setReimbursementFilters] = useState({
    calendar: [
      moment().startOf("month").toDate(),
      moment().endOf("month").toDate(),
    ],
  });
  const [myTeamCasesFilters, setMyTeamCasesFilters] = useState({
    calendar: [
      moment().startOf("month").toDate(),
      moment().endOf("month").toDate(),
    ],
  });

  const [remindersFilters, setRemindersFilters] = useState({
    calendar: [
      moment().startOf("month").toDate(),
      moment().endOf("month").toDate(),
    ],
  });
  const [refundCasesFilters, setRefundCasesFilters] = useState({
    calendar: [
      moment().startOf("month").toDate(),
      moment().endOf("month").toDate(),
    ],
  });
  const hasSetDefaultFilter = useRef(false);

  // Separate search state for each tab
  const [myCasesSearch, setMyCasesSearch] = useState("");
  const [subServicesSearch, setSubServicesSearch] = useState("");
  const [reimbursementSearch, setReimbursementSearch] = useState("");
  const [myTeamCasesSearch, setMyTeamCasesSearch] = useState("");
  const [remindersSearch, setRemindersSearch] = useState("");
  const [refundCasesSearch, setRefundCasesSearch] = useState("");

  // Set default filter for PSF users only on initial load
  useEffect(() => {
    if (isPSFUser && !hasSetDefaultFilter.current) {
      setSelectedFilter("psf-not-completed");
      hasSetDefaultFilter.current = true;
    }
  }, [isPSFUser]);

  const handleNotification = () => {
    setVisible(true);
  };

  const handleReminder = () => {
    setReminderVisible(true);
  };

  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);
  };

  const handleSubServiceFilterChange = (filterValue) => {
    setSubServiceSelectedFilter(filterValue);
  };

  const handleMyCasesDateFilterChange = (filterValue) => {
    if (filterValue?.date) {
      setMyCasesDateFilters({
        startDate: moment(filterValue?.date?.value[0]).format("YYYY-MM-DD"),
        endDate: moment(filterValue?.date?.value[1]).format("YYYY-MM-DD"),
      });
    } else {
      setMyCasesDateFilters({});
    }
  };

  const handleSubServiceDateFilterChange = (filterValue) => {
    if (filterValue?.date) {
      setSubServiceDateFilters({
        startDate: moment(filterValue?.date?.value[0]).format("YYYY-MM-DD"),
        endDate: moment(filterValue?.date?.value[1]).format("YYYY-MM-DD"),
      });
    } else {
      setSubServiceDateFilters({});
    }
  };

  const handleReimbursementDateFilterChange = (filterValue) => {
    if (filterValue?.date) {
      setReimbursementDateFilters({
        startDate: moment(filterValue?.date?.value[0]).format("YYYY-MM-DD"),
        endDate: moment(filterValue?.date?.value[1]).format("YYYY-MM-DD"),
      });
    } else {
      setReimbursementDateFilters({});
    }
  };

  const handleMyTeamCasesDateFilterChange = (filterValue) => {
    if (filterValue?.calendar && filterValue.calendar.length > 0) {
      setMyTeamCasesDateFilters({
        startDate: moment(filterValue.calendar[0]).format("YYYY-MM-DD"),
        endDate: moment(filterValue.calendar[1]).format("YYYY-MM-DD"),
      });
    } else {
      setMyTeamCasesDateFilters({});
    }
  };

  const handleRemindersDateFilterChange = (filterValue) => {
    if (filterValue?.date) {
      setRemindersDateFilters({
        startDate: moment(filterValue?.date?.value[0]).format("YYYY-MM-DD"),
        endDate: moment(filterValue?.date?.value[1]).format("YYYY-MM-DD"),
      });
    } else {
      setRemindersDateFilters({});
    }
  };

  const handleRefundCasesDateFilterChange = (filterValue) => {
    if (filterValue?.date) {
      setRefundCasesDateFilters({
        startDate: moment(filterValue?.date?.value[0]).format("YYYY-MM-DD"),
        endDate: moment(filterValue?.date?.value[1]).format("YYYY-MM-DD"),
      });
    } else {
      setRefundCasesDateFilters({});
    }
  };

  const items = [
    {
      label: "Send Notification",
      command: () => handleNotification(),
    },
    {
      label: "Update activity",
    },
    {
      label: "Add Reminder",
      command: () => handleReminder(),
    },
    {
      label: "Add Interaction",
    },
  ];

  // Define conditions for each tab
  const canViewCases =
    permissions.includes("psf-cases") || permissions.includes("case-list-web");
  const canViewSubServices = permissions.includes("sub-service-list-web");
  const canViewReimbursement = permissions.includes("reimbursement-list-web");
  const canViewMyTeamCases = role?.id === 7 || role?.id === 1; // Team Leader or Admin
  const canViewReminders = role?.id === 3 || role?.id === 7 || role?.id === 1; // Agent, Team Leader, or Super Admin
  const canViewRefundCases = permissions.includes("refund-cases-list-web");

  const TabItems = [
    canViewCases
      ? {
          label: "My Cases",
          content: (
            <MyCases
              layout={selectedLayout}
              selectedFilter={selectedFilter}
              myCasesDateFilterChange={handleMyCasesDateFilterChange}
              myCasesDateFilters={myCasesDateFilters}
              newFilters={myCasesFilters}
              onUpdateFilters={setMyCasesFilters}
              searchValue={myCasesSearch}
              onSearchChange={setMyCasesSearch}
            />
          ),
        }
      : null,
    canViewSubServices
      ? {
          label: "Sub Services",
          content: (
            <SubServiceList
              layout={selectedLayout}
              selectedFilter={subServiceSelectedFilter}
              subServiceDateFilterChange={handleSubServiceDateFilterChange}
              subServiceDateFilters={subServiceDateFilters}
              newFilters={subServicesFilters}
              onUpdateFilters={setSubServicesFilters}
              searchValue={subServicesSearch}
              onSearchChange={setSubServicesSearch}
            />
          ),
        }
      : null,
    canViewReimbursement
      ? {
          label: "Reimbursement",
          content: (
            <ReimbursementListTab
              reimbursementDateFilterChange={
                handleReimbursementDateFilterChange
              }
              reimbursementDateFilters={reimbursementDateFilters}
              newFilters={reimbursementFilters}
              onUpdateFilters={setReimbursementFilters}
              searchValue={reimbursementSearch}
              onSearchChange={setReimbursementSearch}
            />
          ),
        }
      : null,
    canViewRefundCases
      ? {
          label: "Refund Cases",
          content: (
            <RefundCasesListTab
              refundCasesDateFilterChange={handleRefundCasesDateFilterChange}
              refundCasesDateFilters={refundCasesDateFilters}
              newFilters={refundCasesFilters}
              onUpdateFilters={setRefundCasesFilters}
              searchValue={refundCasesSearch}
              onSearchChange={setRefundCasesSearch}
            />
          ),
        }
      : null,
    canViewMyTeamCases
      ? {
          label: "My Team Cases",
          content: (
            <MyTeamCases
              myTeamCasesDateFilterChange={handleMyTeamCasesDateFilterChange}
              myTeamCasesDateFilters={myTeamCasesDateFilters}
              newFilters={myTeamCasesFilters}
              onUpdateFilters={setMyTeamCasesFilters}
              searchValue={myTeamCasesSearch}
              onSearchChange={setMyTeamCasesSearch}
            />
          ),
        }
      : null,
    canViewReminders
      ? {
          label: "Reminders",
          content: (
            <RemindersListTab
              remindersDateFilterChange={handleRemindersDateFilterChange}
              remindersDateFilters={remindersDateFilters}
              newFilters={remindersFilters}
              onUpdateFilters={setRemindersFilters}
              searchValue={remindersSearch}
              onSearchChange={setRemindersSearch}
            />
          ),
        }
      : null,
  ].filter((tab) => tab !== null);

  const handleMenu = (e, label) => {
    setSelectedCase(label);
    casemenu.current.hide(e);
  };
  const handleLayout = (e, layout) => {
    setSelectedLayout(layout);
  };

  return (
    <div className="page-wrap">
      <div className="case-header">
        {/* Tab Menu */}
        <TabMenu
          model={TabItems.map((item, index) => ({
            label: item.label,
            command: () => setActiveIndex(index),
          }))}
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          className="case-tab-menu min-65"
          style={{ overflow: "hidden", height: "auto" }}
        />

        {/* Layout Buttons */}
        <div className="layout-btns-container">
          <button
            className={`btn-with-icon layout-btn ${
              "list" === selectedLayout ? "layout-selected" : ""
            }`}
            onClick={(e) => handleLayout(e, "list")}
          >
            <ListIcon />
          </button>
          {/* {TabItems[activeIndex]?.label !== "Reimbursement" && (
            <button
              className={`layout-btn ${
                "grid" === selectedLayout ? "layout-selected" : ""
              }`}
              onClick={(e) => handleLayout(e, "grid")}
            >
              <GridIcon />
            </button>
          )} */}
        </div>
      </div>
      {selectedLayout == "list" &&
        TabItems[activeIndex]?.label == "My Cases" && (
          <ChipFilter
            onFilterChange={handleFilterChange}
            selectedFilter={selectedFilter}
            isPSFUser={isPSFUser}
          />
        )}
      {selectedLayout == "list" &&
        TabItems[activeIndex]?.label == "Sub Services" && (
          <SubChipFilter
            onFilterChange={handleSubServiceFilterChange}
            selectedFilter={subServiceSelectedFilter}
          />
        )}
      {/* TabView to Display Tab Content */}
      <div className="page-body" style={{ overflowY: "auto", height: "auto" }}>
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          className="tab-header-hidden p-0"
        >
          {TabItems.map((item, index) => (
            <TabPanel key={index}>
              {item.content} {/* Render the tab content dynamically */}
            </TabPanel>
          ))}
        </TabView>
      </div>

      {/* Sidebars */}
      <SendNotificationSidebar visible={visible} setVisible={setVisible} />
      <ReminderSidebar
        visible={reminderVisible}
        setVisible={setReminderVisible}
      />
    </div>
  );
};

export default CaseList;
