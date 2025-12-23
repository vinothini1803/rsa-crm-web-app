import Routes from "./routes/Routes";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "react-query";
import "../services/apiInterceptor";
import { useLocation } from "react-router-dom";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  checkSupport,
  firebaseToken,
  onMessageListener,
} from "../services/firebaseService";
import {
  login,
  logout,
  trackStatus,
  updateFcmToken,
  updateUserStatus,
} from "../services/authService";
import { useSelector } from "react-redux";
import { CurrentUser } from "../store/slices/userSlice";
import { Dialog } from "primereact/dialog";
import Cookies from "js-cookie";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import "../src/pages/home/style.less";
import {
  DialogCloseSmallIcon,
  ReminderDialogIcon,
  UserShieldIcon,
  GoogleMapAPIKey,
} from "../src/utills/imgConstants";
import ReminderDialog from "./components/common/ReminderDialog";
import { toast } from "react-toastify";
import {
  updateReminder,
  getsinglerReminder,
} from "../services/reminderService";
import moment from "moment";
import { useNavigate } from "react-router";
import debounce from "lodash/debounce";
import { setSearch } from "../store/slices/searchSlice";
import { useDispatch } from "react-redux";
import { updateStatus } from "../store/slices/statusSlice";
import Modal from "./components/common/Popup";
import Popup from "./components/common/Popup";
import { loadGoogleMaps } from "./utills/loadGoogleMaps";

function App() {
  const { mutate } = useMutation(updateFcmToken);
  const user = useSelector(CurrentUser);
  const [visible, setVisible] = useState(false);
  const [reminderVisible, setRemainderVisible] = useState(false);
  const [notificationData, setNotificationData] = useState({});
  const [reminderData, setReminderData] = useState({});
  const [toastMsgId, setToastMsgId] = useState(null);
  // const accessToken = Cookies.get("token");
  const accessToken = localStorage.getItem("token");
  // const fcmToken = Cookies.get("firebaseToken");
  const fcmToken = localStorage.getItem("firebaseToken");
  const { mutate: logoutMutate } = useMutation(logout);
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const { mutate: statusMutate } = useMutation(updateUserStatus);
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.statusReducer.status);
  const statusRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(null);
  const [dataToSend, setDataToSend] = useState(null);

  useEffect(() => {
    // Only load Google Maps if not already loaded and no script tag exists
    // GoogleMapReact components will load it via bootstrapURLKeys, so we check for existing script
    const existingScript =
      document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]') ||
      document.querySelector('script[src*="maps.googleapis.com"]');
    
    if (
      !existingScript &&
      (typeof window.google === "undefined" ||
        typeof window.google.maps === "undefined")
    ) {
      loadGoogleMaps(GoogleMapAPIKey)
        .then((google) => {
          console.log("Google Maps loaded:", google);
          // Initialize your map or autocomplete here
        })
        .catch((error) => {
          console.error("Error loading Google Maps:", error);
        });
    }
  }, []);

  const {
    data: statusData,
    isFetched,
    refetch: refetchTrackStatus,
  } = useQuery(["trackStatus"], () => trackStatus({ userId: user?.id }), {
    enabled: false, // Disable automatic query execution
    refetchOnWindowFocus: false, // Prevent refetching when window focus changes
  });

  useEffect(() => {
    if (user?.id && user?.role?.id == 3) {
      refetchTrackStatus();
    }
  }, [userStatus]);
  const CloseButton = ({ closeToast }) => (
    <img
      className="reminder-close"
      src={DialogCloseSmallIcon}
      onClick={closeToast}
    />
  );

  const { mutate: reminderMutate, isLoading: reminderMutateLoading } =
    useMutation(updateReminder);
  const { mutate: getRemainderMutate } = useMutation(getsinglerReminder);

  // Handle Snooze Reminder
  const handleSnooze = (id, messageId) => {
    // console.log("snooze clicked", id);
    setToastMsgId(messageId);
    const currentDate = moment();
    // console.log("date",moment(currentDate).format("hh:mm:ss"),moment(currentDate).add(10, 'minutes').format("hh:mm:ss"))
    reminderMutate(
      {
        reminderId: id,
        scheduleTime: moment(currentDate).add(10, "minutes").format("YYYY-MM-DD HH:mm:ss"),
        dismiss: false,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.dismiss(messageId);
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  // Handle Dismiss Reminder
  const handleDismiss = (id, messageId) => {
    // console.log("dismiss clicked", id);
    setToastMsgId(messageId);
    reminderMutate(
      {
        reminderId: id,
        scheduleTime: "",
        dismiss: true,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.dismiss(messageId);
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleNotification = (payload) => {
    // console.log("Notification payload", payload);
    setNotificationData(payload);
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  const handleReminder = (payload) => {
    // console.log(
    //   "Reminder payload",
    //   payload,
    //   JSON.parse(payload?.data?.reminder)
    // );
    setReminderData(payload?.data);
    // setRemainderVisible(true);
    // console.log(
    //   "Remainder Status =>",
    //   payload?.messageId,
    //   toast.isActive(payload?.messageId)
    // );
    if (!toast.isActive(payload?.messageId)) {
      const reminderInfo = JSON.parse(payload?.data?.reminder);
      const toastMsg = (
        <div className="reminder-content">
          <div className="dialog-header">
            <img src={ReminderDialogIcon} />
            <div className="dialog-header-title">Reminder</div>
          </div>
          <div className="dialog-main-content">
            <div className="case-detail-container">
              <div className="case-detail-header">
                <div className="case-title">
                  {reminderInfo?.subject || "--"}
                </div>
                <Chip
                  label={
                    reminderInfo?.priority ? reminderInfo?.priority?.name : "--"
                  }
                  className={`info-chip ${
                    reminderInfo?.priorityId === "552" ? "danger" : "warning"
                  } case-status-chip`}
                />
              </div>
              <div className="case-content">
                {reminderInfo?.description || "--"}
              </div>
            </div>
            <div className="reminder-actions">
              <Button
                className="btn btn-primary"
                loading={
                  payload?.messageId == toastMsgId && reminderMutateLoading
                }
                onClick={() =>
                  handleSnooze(reminderInfo?.id, payload?.messageId)
                }
              >
                Snooze
              </Button>
              <Button
                className="btn btn-white"
                loading={
                  payload?.messageId == toastMsgId && reminderMutateLoading
                }
                onClick={() =>
                  handleDismiss(reminderInfo?.id, payload?.messageId)
                }
              >
                Dismiss
              </Button>
              <button
                className="btn btn-link view-case-btn"
                onClick={() => {
                  navigate(`/cases/view/${reminderInfo?.caseDetailId}`);
                }}
              >
                View Case
              </button>
            </div>
          </div>
        </div>
      );
      toast(toastMsg, {
        position: "bottom-right",
        className: "reminder-toast",
        autoClose: false,
        closeOnClick: false,
        toastId: payload?.messageId,
        // containerId: randomId,
        // containerId: payload?.messageId,
        theme: "light",
        closable: true,
        closeButton: CloseButton,
        style: {
          minWidth: "400px",
        },
      });
    }
  };

  // const handleNavigate = (payload) =>{
  //   const searchCall = JSON.parse(payload?.data?.searchData);
  //   // console.log("navigate", searchCall)
  //   dispatch(setSearch(searchCall));
  //   const url =`/`;
  //   // console.log("Storing searchData in sessionStorage:", searchCall);
  //   const popupFeatures = "width=600,height=400,scrollbars=yes,resizable=yes";
  //   sessionStorage.setItem("searchData", JSON.stringify(searchCall));
  //   // sessionStorage.setItem('formData', JSON.stringify(getFormData));
  //   window.open(url, 'popupWindow', popupFeatures);
  // }

  // const handleNavigate = (payload) => {
  //   const searchCall = JSON.parse(payload?.data?.searchData);
  //   dispatch(setSearch(searchCall));

  //   setIsPopupOpen(true);

  //   // Open the modal
  //   //setIsModalOpen(true);

  //   // Send data to the iframe
  //   // const dataToSend = { searchCall };
  //   // setDataToSend(dataToSend);
  // };

  const handleSocketMessage = (payload) => {
    console.log("Socket Message", payload);
    if (payload?.data?.searchData) {
      handleNavigate(payload);
    } else if (payload?.data) {
      handleReminder(payload);
    } else {
      handleNotification(payload);
    }
  };

  useEffect(() => {
    // Request notification permission

    // Handle incoming messages
    const unSubscribe = onMessageListener(handleSocketMessage);
    // Ensure unSubscribe is a function before attempting to call it
    if (typeof unSubscribe === "function") {
      return () => {
        unSubscribe(); // Call the cleanup function directly
      };
    }

    // If unSubscribe is not a function, log a warning
    // console.warn(
    //   "Unexpected value returned by onMessageListener:",
    //   unSubscribe
    // );
  }, []);

  useEffect(() => {
    checkSupport();
    if (accessToken)
      Notification.requestPermission().then((permission) => {
        // console.log("Request Permission => ", permission);
        if (permission === "granted") {
          // console.log("Notification permission granted.");
          firebaseToken().then((firebaseToken) => {
            if (!fcmToken) {
              mutate(
                {
                  id: user?.id, //userId
                  fcm_token: firebaseToken,
                  srcFrom: "web",
                },
                {
                  onSuccess: (res) => {
                    if (res?.data?.success) {
                      // Cookies.set("firebaseToken", firebaseToken);
                      localStorage.setItem("firebaseToken", firebaseToken);
                      // console.log(res?.data?.message);
                    } else {
                      if (res?.data?.error) {
                        toast.error(res?.data?.error);
                      } else {
                        res?.data?.errors.forEach((err) => toast.error(err));
                      }
                    }
                  },
                }
              );
            }
          });
        } else {
          // console.log("Notification permission denied.");
        }
      });
  }, [accessToken]);

  // useMemo(() => {
  //   if (!accessToken && !fcmToken) {
  //     firebaseToken().then((firebaseToken) => {
  //       logoutMutate(
  //         {
  //           userId: user?.id,
  //           fcmToken: firebaseToken,
  //         },
  //         {
  //           onSuccess: (res) => {
  //             if (!res?.data?.success) {
  //               if (res?.data?.error) {
  //                 toast.error(res?.data?.error);
  //               } else {
  //                 res?.data?.errors.forEach((err) => toast.error(err));
  //               }
  //             }
  //           },
  //         }
  //       );
  //     });
  //   }
  // }, []);
  useEffect(() => {
    if (!isFetched || !statusData) return;
    if (
      (["Active"].includes(userStatus) &&
        [0, 1].includes(statusData?.data?.data?.userStatusMode)) ||
      (["Offline", "Away"].includes(userStatus) &&
        statusData?.data?.data?.userStatusMode === 1)
    ) {
      if (user?.id && user?.role?.id === 3) {
        let idleTimeout;
        const handleUserActivity = () => {
          setStatus(1056);
          dispatch(updateStatus("Active"));

          clearTimeout(idleTimeout);
          //  idleTimeout = setTimeout(() => {setStatus(1059);dispatch(updateStatus("Away"));}, 300000);// 5 minutes away status
          //  idleTimeout = setTimeout(() => {setStatus(1059);dispatch(updateStatus("Away"));}, 60000);
          idleTimeout = setTimeout(() => {
            setStatus(1059); // Set status to Away
            dispatch(updateStatus("Away"));
          }, 240000);
        };

        const handleVisibilityChange = () => {
          if (document.hidden) {
            setStatus(1059); //away status
            dispatch(updateStatus("Away"));
            // refetchTrackStatus();
          } else {
            handleUserActivity();
          }
        };

        const handleOnlineStatus = () => {
          // setStatus(navigator.onLine ? 1056 : 1055); //Active and offline status based on condition

          if (navigator.onLine) {
            setStatus(1056);
            dispatch(updateStatus("Active"));
          } else {
            setStatus(1055);
            dispatch(updateStatus("Offline"));
          }
        };

        window.addEventListener("mousemove", handleUserActivity);
        window.addEventListener("keydown", handleUserActivity);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("online", handleOnlineStatus);
        window.addEventListener("offline", handleOnlineStatus);

        // Set idle timeout initially
        handleUserActivity();

        return () => {
          clearTimeout(idleTimeout);
          window.removeEventListener("mousemove", handleUserActivity);
          window.removeEventListener("keydown", handleUserActivity);
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
          );
          window.removeEventListener("online", handleOnlineStatus);
          window.removeEventListener("offline", handleOnlineStatus);
        };
      }
    }
  }, [userStatus, statusData, isFetched]);

  // Call the debounced API function on status change
  useEffect(() => {
    if (user?.id && user?.role?.id == 3) {
      if (status !== null && user?.id && status !== "") {
        handleUserStatus(status);
      }

      return () => {
        handleUserStatus.cancel();
      };
    }
  }, [status]);

  const handleUserStatus = debounce((status) => {
    statusMutate(
      {
        userId: user?.id,
        status: status,
        userStatusMode: 1,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            refetchTrackStatus();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((err) => toast.error(err));
            }
          }
        },
      }
    );
  }, 5000);
  return (
    <>
      <Routes />
      <Dialog
        header={
          <div className="dialog-header">
            <img src={ReminderDialogIcon} />
            <div className="dialog-header-title">Notification</div>
          </div>
        }
        closeIcon={<img src={DialogCloseSmallIcon} />}
        className="reminder-dialog"
        visible={visible}
        position={"bottom-right"}
        modal={false}
        draggable={false}
        onHide={() => setVisible(false)}
      >
        <div className="dialog-main-content">
          <div>{notificationData && notificationData?.notification?.title}</div>
          <div>{notificationData && notificationData?.notification?.body}</div>
          {/* <div className="reminder-actions">
            <button className="btn btn-primary">Call</button>
            <button className="btn btn-white">Update Status</button>
            <button className="btn btn-link view-case-btn">View Case</button>
          </div> */}
        </div>
      </Dialog>
      <ReminderDialog
        reminderData={reminderData}
        visible={reminderVisible}
        setVisible={setRemainderVisible}
      />
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  );
}

export default App;
