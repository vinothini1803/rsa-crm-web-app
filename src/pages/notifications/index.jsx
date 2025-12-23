import React, { useState } from "react";
import { CloseIcon } from "../../utills/imgConstants";
import { Button } from "primereact/button";
import NotificationSidebar from "../../components/layout/NotificationSidebar";
import { TabMenu } from "primereact/tabmenu";
import TabMenuItem from "../../components/common/TabMenuItem";
import CaseDetail from "../../components/common/CaseDetail";
import ReminderItem from "../../components/common/ReminderItem";
import { TabPanel, TabView } from "primereact/tabview";
import Loader from "../../components/common/Loader";
import { useSelector } from "react-redux";
import { noticationList } from "../../../services/notificationService";
import { useMutation, useQuery } from "react-query";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router";
import moment from "moment";
import { getReminderList, updateReminder } from "../../../services/reminderService";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

const Notification = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [remainderId,setRemainderId] = useState(null);
  const { id } = useSelector(CurrentUser);
  const user = useSelector(CurrentUser);
  const navigate = useNavigate();
  // Web notifications query (sourceFrom = 1)
  const { data, isFetching } = useQuery(["webNotificationList"], () =>
    noticationList({
      userId: id,
      sourceFrom: 1, //Web
    })
  );
  // Mobile notifications query (sourceFrom = 2)
  const { data: mobileData, isFetching: mobileFetching } = useQuery(
    ["mobileNotificationList"],
    () =>
      noticationList({
        userId: id,
        sourceFrom: 2, //Mobile
      })
  );
 // List API Calling
 const { data: reminderData, isFetching: reminderFetching, refetch: remainderRefetching } = useQuery(["reminderList", activeIndex], () => getReminderList() );
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
  const handleClose = () => {
    navigate("/delivery-request");
  };
  // Calculate web notifications count
  const webNotificationsCount = data?.data?.data?.reduce(
    (total, item) => total + (item?.list?.length || 0),
    0
  ) || 0;
  
  // Calculate mobile notifications count
  const mobileNotificationsCount = mobileData?.data?.data?.reduce(
    (total, item) => total + (item?.list?.length || 0),
    0
  ) || 0;
  
  const items = [
    { label: <TabMenuItem label="Web" badge={webNotificationsCount} /> },
    ![14,15,16,21,22,23,24,25,26,27].includes(user?.role?.id) && { label: <TabMenuItem label="Reminders" badge={reminderData?.data?.data?.filter((item) => item?.dismiss == false)?.length} /> },
    { label: <TabMenuItem label="Mobile" badge={mobileNotificationsCount} /> },
  ];

  const handleSnooze = (id) => {
    // console.log("snooze clicked", id);
    setRemainderId(id)
    const currentDate = moment();
    reminderMutate({
      reminderId: id,
      scheduleTime: moment(currentDate).add(10, "minutes").format("YYYY-MM-DD HH:mm:ss"),
      dismiss: false,
    });
  };

  const handleDismiss = (id) => {
    // console.log("dismiss clicked", id);
    setRemainderId(id)
    reminderMutate({
      reminderId: id,
      scheduleTime: "",
      dismiss: true,
    });
  };
  return (
    <div className="page-wrap">
      <div className="page-body">
        <div className="page-content-wrap form-page without-step">
          <div className="page-content-header pb-0 flex-row">
            {" "}
            {/* add pb-0 to add padding bottom0 to  */}
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="d-flex gap-1_2 flex-column">
                  <h5 className="page-content-title text-caps">
                    Notifications
                  </h5>{" "}
                  {true && (
                    <TabMenu
                      model={items}
                      activeIndex={activeIndex}
                      onTabChange={(e) => setActiveIndex(e.index)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="page-content-header-right ms-auto">
              <button className="btn btn-close" onClick={handleClose}>
                <img className="img-fluid" src={CloseIcon} alt="Close" />
              </button>
            </div>
          </div>
          <div className="page-content-body">
            {/* {isFetching ? (
              <Loader />
            ) : (
              data?.data?.data?.map((item) => {
                return (
                  <div className="case-detail-list-wrap">
                    <div className="case-detail-list-caption-wrap">
                      <span className="case-detail-list-caption bg-color">
                        {item?.label}
                      </span>
                    </div>
                    <ul className="case-detail-list">
                      {item?.list?.map((notification) => {
                        return (
                          <li>
                            <CaseDetail
                              title={notification?.title}
                              content={notification?.body}
                              date={notification?.createdAt}
                              caseActions={false}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })
            )} */}
            {isFetching || mobileFetching ? (
              <div className="d-flex align-items-center justify-content-center h-100">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
              </div>
            ) : (
              <TabView
                className="tab-header-hidden p-0"
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
                            {/* <CaseDetail
                              reminderId={reminder?.reminderId}
                              title={reminder?.subject}
                              content={reminder?.description}
                              caseStatus={reminder?.status?.name}
                              caseStatusId={reminder?.status?.id}
                              casePriority={reminder?.priority?.name}
                              caseType={reminder?.type?.name}
                              date={moment(reminder?.scheduleTime).format(
                                "DD/MM/YYYY hh:mm A"
                              )}
                              caseChips={true}
                              caseActions={reminder?.dismiss ? false : true}
                              btn1text="Snooze"
                              btn2text="Dismiss"
                              btn1Click={() => handleSnooze(reminder?.id)}
                              btn2Click={() => handleDismiss(reminder?.id)}
                              btn1Loading={reminder?.id == remainderId && reminderMutateLoading}
                              btn2Loading={reminder?.id == remainderId &&reminderMutateLoading}
                            /> */}
                            <ReminderItem 
                              reminderId={reminder?.reminderId}
                              title={reminder?.subject}
                              content={reminder?.description}
                              date={moment(reminder?.scheduleTime).format('DD/MM/YYYY hh:mm A')}
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
                              btn1Loading={reminder?.id == remainderId && reminderMutateLoading}
                              btn2Loading={reminder?.id == remainderId && reminderMutateLoading}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
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
              </TabView>
            )}
            {/*  <NotificationSidebar /> */}
          </div>
          {/* <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-center">
              <div className="d-flex gap-2">
                <Button
                  className="btn btn-link"
                  // loading={}
                >
                  View Previous Notifications
                </Button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Notification;
