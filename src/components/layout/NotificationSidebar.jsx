import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { TabMenu } from "primereact/tabmenu";
import { TabView, TabPanel } from "primereact/tabview";
import TabMenuItem from "../common/TabMenuItem";
import CaseDetail from "../common/CaseDetail";
import ReminderItem from "../common/ReminderItem";
import NoDataComponent from "../common/NoDataComponent";
import { useQuery, useMutation } from "react-query";
import { noticationList } from "../../../services/notificationService";
import {
  getReminderList,
  updateReminder,
} from "../../../services/reminderService";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import { EmptyListImage } from "../../utills/imgConstants";
import moment from "moment";
import { io } from "socket.io-client";
import { useEffect } from "react";


const NotificationSidebar = ({ onClick, visible }) => {
  const { id } = useSelector(CurrentUser);
  const user = useSelector(CurrentUser);
  const [activeIndex, setActiveIndex] = useState(0);
  const [remainderId, setRemainderId] = useState(null);
  const [socketNotifications, setSocketNotifications] = useState([]);
const [liveReminder, setLiveReminder] = useState(null);
  useEffect(() => {
  if (!id) return;

  const socket = io("http://localhost:9203", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("🔌 Socket connected:", socket.id);
    socket.emit("joinRoom", `user_${id}`);
   
  });

  // 🔔 LISTEN TO BACKEND EMIT
  
 socket.on("aspStartReminder", (data) => {
    console.log("🔔 Socket reminder received:", data);

    setSocketNotifications((prev) => [
      {
        title: data.title,
        body: data.message,
        createdAt: data.time,
      },
      ...prev,
    ]);
  });
  // socket.on("serviceReminder", (data) => {
  //   console.log("🔔 Socket reminder received:", data);
  // });
}, [id]);

  // Web notifications query (sourceFrom = 1)
  const { data, isFetching } = useQuery(
    ["webNotificationList", visible],
    () =>
      noticationList({
        userId: id,
        sourceFrom: 1, //Web
      }),
    {
      enabled: visible,
    }
  );

  // Mobile notifications query (sourceFrom = 2)
  const { data: mobileData, isFetching: mobileFetching } = useQuery(
    ["mobileNotificationList", visible],
    () =>
      noticationList({
        userId: id,
        sourceFrom: 2, //Mobile
      }),
    {
      enabled: visible,
    }
  );

  // List API Calling
  const { data: reminderData, refetch: remainderRefetching } = useQuery(
    ["reminderList", visible, activeIndex],
    () => getReminderList(),
    {
      enabled: visible,
    }
  );

  // Update API
  const { mutate: reminderMutate, isLoading: reminderMutateLoading } =
    useMutation(updateReminder, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          remainderRefetching();
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });

  // Calculate web notifications count
  const webNotificationsCount =
    data?.data?.data?.reduce(
      (total, item) => total + (item?.list?.length || 0),
      0
    ) || 0;

  // Calculate mobile notifications count
  const mobileNotificationsCount =
    mobileData?.data?.data?.reduce(
      (total, item) => total + (item?.list?.length || 0),
      0
    ) || 0;

  const items = [
    {
      label: <TabMenuItem label="Web" badge={webNotificationsCount} />,
    },
    ![14, 15, 16, 21, 22, 23, 24, 25, 26, 27].includes(user?.role?.id) && {
      label: (
        <TabMenuItem
          label="Reminders"
          badge={
            reminderData?.data?.data?.length > 0
              ? reminderData?.data?.data?.filter(
                  (item) => item?.dismiss == false
                )?.length
              : "0"
          }
        />
      ),
    },
    {
      label: <TabMenuItem label="Mobile" badge={mobileNotificationsCount} />,
    },
    {
  label: (
    <TabMenuItem
      label="Live"
      badge={socketNotifications.length}
    />
  ),
    }, 
  ];
  const itemContent = [
    {
      data: "genenral",
    },
    {
      data: "Reminders",
    },
  ];
  console.log("notification data", data?.data?.data);

  const handleSnooze = (id) => {
    // console.log("snooze clicked", id);

    setRemainderId(id);
    const currentDate = moment();
    // console.log("date",moment(currentDate).format("hh:mm:ss"),moment(currentDate).add(10, 'minutes').format("hh:mm:ss"))
    reminderMutate({
      reminderId: id,
      scheduleTime: moment(currentDate)
        .add(10, "minutes")
        .format("YYYY-MM-DD HH:mm:ss"),
      dismiss: false,
    });
  };

  const handleDismiss = (id) => {
    console.log("dismiss clicked", id);
    setRemainderId(id);
    reminderMutate({
      reminderId: id,
      scheduleTime: "",
      dismiss: true,
    });
  };

  return (
    <div className="sidebar-content-wrap">
      <div className="sidebar-content-header">
        <TabMenu
          model={items}
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        />
      </div>
      {/* Sidebar Content Header */}

      <div className="sidebar-content-body">
        {isFetching || mobileFetching ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          </div>
        ) : (
          <TabView
            className="tab-header-hidden notification-sidebar-tab"
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            <TabPanel>
              {data?.data?.data?.map((item, index) => {
                return (
                  <div className="case-detail-list-wrap" key={index}>
                    <div className="case-detail-list-caption-wrap">
                      <span className="case-detail-list-caption bg-color">
                        {item?.label}
                      </span>
                    </div>
                    <ul className="case-detail-list">
                      {item?.list?.map((notification, i) => {
                        return (
                          <li key={i}>
                            <CaseDetail
                              title={notification?.title}
                              content={notification?.body}
                              date={notification?.createdAt}
                              caseChips={false}
                              caseActions={false}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </TabPanel>
            <TabPanel>
              {reminderData?.data?.data?.length > 0 ? (
                <div className="case-detail-list-wrap">
                  <div className="case-detail-list-caption-wrap">
                    <span className="case-detail-list-caption bg-color">
                      Today
                    </span>
                  </div>
                  <ul className="case-detail-list">
                    {reminderData?.data?.data?.map((reminder, i) => {
                      return (
                        <li key={i}>
                          <ReminderItem
                            reminderId={reminder?.id}
                            title={reminder?.subject}
                            content={reminder?.description}
                            date={moment(reminder?.scheduleTime).format(
                              "DD/MM/YYYY hh:mm A"
                            )}
                            scheduleTime={reminder?.scheduleTime}
                            reminderStatus={reminder?.status?.name}
                            reminderStatusId={reminder?.status?.id}
                            reminderPriority={reminder?.priority?.name}
                            reminderPriorityId={reminder?.priorityId}
                            reminderType={reminder?.type?.name}
                            reminderChips={true}
                            btn1text="Snooze"
                            btn2text="Dismiss"
                            btn1Click={() => handleSnooze(reminder?.id)}
                            btn2Click={() => handleDismiss(reminder?.id)}
                            btn1Loading={
                              reminder?.id == remainderId &&
                              reminderMutateLoading
                            }
                            btn2Loading={
                              reminder?.id == remainderId &&
                              reminderMutateLoading
                            }
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NoDataComponent
                    image={EmptyListImage}
                    text="There are no reminders at the moment."
                    addbtn={false}
                  />
                </div>
              )}
            </TabPanel>
            <TabPanel>
              {mobileData?.data?.data?.map((item, index) => {
                return (
                  <div className="case-detail-list-wrap" key={index}>
                    <div className="case-detail-list-caption-wrap">
                      <span className="case-detail-list-caption bg-color">
                        {item?.label}
                      </span>
                    </div>
                    <ul className="case-detail-list">
                      {item?.list?.map((notification, i) => {
                        return (
                          <li key={i}>
                            <CaseDetail
                              title={notification?.title}
                              content={notification?.body}
                              date={notification?.createdAt}
                              caseChips={false}
                              caseActions={false}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </TabPanel>
            <TabPanel>
  {socketNotifications.length > 0 ? (
    <div className="case-detail-list-wrap">
      <div className="case-detail-list-caption-wrap">
        <span className="case-detail-list-caption bg-color">
          Live Notifications
        </span>
      </div>

      <ul className="case-detail-list">
        {socketNotifications.map((notification, i) => (
          <li key={i}>
            <CaseDetail
              title={notification.title}
              content={notification.body}
              date={notification.createdAt}
              caseChips={false}
              caseActions={false}
            />
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <NoDataComponent
        image={EmptyListImage}
        text="No live notifications yet."
        addbtn={false}
      />
    </div>
  )}
</TabPanel>

          </TabView>
        )}
      </div>

      {/* Sidebar Content Body */}
      <div className="sidebar-content-footer">
        <div className="d-flex align-items-center justify-content-center">
          <Link
            className="notification-sidebar-footer-link"
            to={"/notifications"}
            onClick={onClick}
          >
            View All Notifications
          </Link>
        </div>
      </div>
      {/* Sidebar Content Footer */}
    </div>
  );
};

export default NotificationSidebar;
