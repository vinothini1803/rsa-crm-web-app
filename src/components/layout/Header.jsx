import React, { useRef, useState, useEffect } from "react";
import {
  NotificationImage,
  DropdownIcon,
  DialogCloseIcon,
  ProfileUrl,
  CallInitiateImage,
  SearchIcon,
  SpannerImage,
  CalendarViewIcon,
  VehicleGreyIcon,
  InteractionGreyIcon,
} from "../../utills/imgConstants";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { Dropdown } from "primereact/dropdown";
import Avatar from "../common/Avatar";
import NotificationSidebar from "./NotificationSidebar";
import { useLocation, useNavigate } from "react-router";
import { getPathArray } from "../../utills/pathConversion";
import { removeToken } from "../../utills/auth";
import { CurrentUser, setUser } from "../../../store/slices/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useQuery, useMutation } from "react-query";
import {
  getUserStatus,
  logout,
  resetAccount,
  updateUserStatus,
  trackStatus,
} from "../../../services/authService";
import { getCaseInfo } from "../../../services/caseService";
import { aspData } from "../../../services/assignServiceProvider";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import QuickSearchDialog from "../common/QuickSearchDialog";
import { updateStatus } from "../../../store/slices/statusSlice";
import InterActionSidebar from "../common/InterActionSidebar";
import {
  getInteractiondata,
  addInteraction,
} from "../../../services/deliveryRequestViewService";
import { useMapViewContext } from "../../contexts/MapViewContext";
import EditCaseDetailsDialog from "./EditCaseDetailsDialog";
import EditImage from "../../assets/img/icons/edit-icon.svg";

const Header = () => {
  const menu = useRef(null);
  const filterDropdownRef = useRef(null);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(CurrentUser);
  const [expandedFilterType, setExpandedFilterType] = useState(null); // 'asp', 'case', or null
  const mapViewContext = useMapViewContext(); // Will be null if used outside provider
  // Check for map route - the route path is "map"
  // Match patterns like /map, /map/, /something/map, etc. but not /map-something
  const isMapView = /\/map(\/|$)/.test(pathname);

  // console.log("pathurl", pathname);
  const pathTitle = getPathArray(pathname);
  // console.log("pathTitle", pathTitle);
  document.title = `${pathTitle} | RSA CRM`;
  const navigate = useNavigate();
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [callInitiateVisible, setCallInitiateVisible] = useState(false);
  const [interactionDialogVisible, setInteractionDialogVisible] =
    useState(false);
  const [caseAspAssignment, setCaseAspAssignment] = useState(false);
  const { mutate } = useMutation(resetAccount);
  const { mutate: logoutMutate } = useMutation(logout);
  // const firebaseToken = Cookies.get("firebaseToken");
  const firebaseToken = localStorage.getItem("firebaseToken");
  const [status, setStatus] = useState("Active");
  const userStatus = useSelector((state) => state.statusReducer.status);
  const { mutate: statusMutate } = useMutation(updateUserStatus);
  const permissions = user?.role?.permissions?.map((perm) => perm.name) || [];
  const { data: statusOptions, refetch: refetchUserStatus } = useQuery(
    "getUserStatus",
    getUserStatus,
    {
      enabled: user?.role?.id === 3, // Prevent automatic fetching on component mount
    }
  );
  const { mutate: trackMutate, refetch: refetchTrackStatus } =
    useMutation(trackStatus);

  const statusTrack = () => {
    trackMutate(
      {
        userId: user?.id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            dispatch(updateStatus(res?.data?.data?.userStatusName));
          } else {
            toast?.error(res?.data?.error);
          }
        },
      }
    );
  };
  useEffect(() => {
    if (user?.id && user?.role?.id == 3) {
      statusTrack();
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setExpandedFilterType(null);
      } 
    };

    if (expandedFilterType) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedFilterType]);

  const handleStatusChange = (e) => {
    // console.log("e.value", e.value);
    e.preventDefault();
    if (user?.id && user?.role?.id == 3) {
      // Store previous status before updating
      const previousStatusName = userStatus;
      setStatus(e?.value?.name);
      dispatch(updateStatus(e?.value?.name));
      handleUserStatus(e?.value?.id, previousStatusName);
    }
  };

  const handleUserStatus = (selectedStatus, previousStatusName) => {
    statusMutate(
      {
        userId: user?.id,
        status: selectedStatus,
        userStatusMode: 0,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            // refetchTrackStatus();
            statusTrack();
          } else {
            // Revert UI state on error
            if (previousStatusName) {
              setStatus(previousStatusName);
              dispatch(updateStatus(previousStatusName));
            }
            // Refetch status to sync with backend
            statusTrack();
            // Show error message
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((err) => toast.error(err));
            }
          }
        },
        onError: (error) => {
          // Revert UI state on network/other errors
          if (previousStatusName) {
            setStatus(previousStatusName);
            dispatch(updateStatus(previousStatusName));
          }
          // Refetch status to sync with backend
          statusTrack();
          // Show error message
          toast.error("Failed to update status. Please try again.");
        },
      }
    );
  };
  // Get Case Info
  const {
    data: caseDetailData,
    refetch: refetchCaseDetails,
    isLoading: caseIsLoading,
  } = useQuery(
    ["caseAspInfoDetails"],
    () =>
      getCaseInfo({
        caseId: pathname?.split("/")[3],
      }),
    {
      enabled: caseAspAssignment,
    }
  );

  // Current Activity Data
  const { data: activityData, refetch: activityInfoRefetch } = useQuery(
    ["getAssignmentInfoCaseActivity"],
    () =>
      aspData({
        activityId: pathname?.split("/")[4],
      }),
    {
      enabled: caseAspAssignment,
    }
  );
  // console.log(activityData,"activitydataaa");

  // Get Interaction Form Data
  const { data: interactionFormData } = useQuery(
    ["headerInteractionFormData"],
    () => getInteractiondata(),
    {
      enabled: interactionDialogVisible,
    }
  );

  // Save Interaction API
  const { mutate: interactionMutate, isLoading: interactionMutateLoading } =
    useMutation(addInteraction);

  // Handle Submit Interaction Form
  const handleSaveInteraction = (values, reset) => {
    interactionMutate(
      {
        caseDetailId: values.caseDetailId,
        typeId: 242,
        ...values,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setInteractionDialogVisible(false);
            reset();
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

  const handleChangePassword = () => {
    navigate("/update-password");
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
    dispatch(setUser({}));
    logoutMutate(
      {
        userId: user?.id,
        fcmToken: firebaseToken,
        srcFrom: "web",
        userLogId: user?.userLogId,
      },
      {
        onSuccess: (res) => {
          if (!res?.data?.success) {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((err) => toast.error(err));
            }
          }
        },
      }
    );
  };
  // const user = {
  //   name: "Arun Kumar R",
  //   code: "098892",
  // };
  const profileDropdownMenu = [
    // {
    //   label: "Account",
    //   command: (e) => {
    //     navigate("/account");
    //   },
    // },
    ...(user?.role?.id == 3
      ? [
          {
            template: (
              <div className="status-menu-item">
                <span className="title">Status:</span>

                <Dropdown
                  value={userStatus}
                  options={statusOptions?.data?.data}
                  onChange={handleStatusChange}
                  optionLabel="name" // Use the "name" field for the display label
                  // optionValue="id"
                  placeholder={userStatus}
                  className="status-dropdown"
                />
              </div>
            ),
          },
        ]
      : []),
    ...(user?.userTypeId == 140 || user?.role?.id == 31
      ? [
          {
            label: "My Wallet",
            command: (e) => {
              navigate("/wallet");
            },
          },
        ]
      : []),

    // {
    //   label: "Help and Support",
    //   url: "",
    // },
    // {
    //   label: "Privacy Policy",
    //   url: "",
    // },

    ...(import.meta.env.VITE_RESET_ACCOUNT == "true"
      ? [
          {
            label: "Reset Account",

            command: (e) => {
              mutate(
                {
                  userId: user?.id,
                },
                {
                  onSuccess: (res) => {
                    if (res?.data?.success) {
                      toast.success(res?.data?.message, {
                        autoClose: 1000,
                      });
                      handleLogout();
                    } else {
                      toast.error(res?.data?.error, {
                        autoClose: 1000,
                      });
                    }
                  },
                }
              );
            },
          },
        ]
      : []),
    {
      label: "Change Password",
      // className: "color-danger",
      command: (e) => {
        handleChangePassword();
      },
    },
    {
      label: "Logout",
      className: "color-danger",
      command: (e) => {
        handleLogout();
      },
    },
  ];

  const handleClose = () => setNotificationVisible(false);

  // console.log('Call Initate => ', callInitiateVisible);

  useEffect(() => {
    if (pathname) {
      if (
        pathname?.split("/")[1] == "cases" &&
        pathname?.split("/")[2] == "asp-assignment"
      ) {
        // console.log("Case ASP Assignmnet");
        setCaseAspAssignment(true);
      }
    }
  }, [pathname]);

  const caseId = pathname?.split("/")[3];
  const isAspAssignmentRoute =
    pathname?.split("/")[1] === "cases" &&
    pathname?.split("/")[2] === "asp-assignment" &&
    caseId;

  const { data: caseDetailDataa } = useQuery(
    ["caseAspInfoDetails", caseId],
    () => getCaseInfo({ caseId }),
    {
      enabled: !!caseId,
    }
  );
  // console.log(caseDetailData, "caseDetailData");

  const caseDetail =
    caseAspAssignment && caseDetailDataa?.data?.success
      ? caseDetailDataa?.data?.data?.[0]
      : null;

  // console.log(caseDetailDataa?.data?.data?.[0], "caseeeee");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedCase, setSelectedCase] = useState({
    caseSubject: "",
    subService: "",
  });
  // console.log(caseDetailData, "caseDetailData");

  return (
    <header>
      <div className="header-wrap">
        <div className="header-title-wrap">
          {pathname.includes("asp-assignment") &&
          caseDetailData?.data?.success ? (
            <>
              <div>
                <b>Case Info </b> -{" "}
                <span className="delivery-request-sub">
                  {caseDetailData?.data?.data[0]?.caseNumber}
                </span>
              </div>
              <div className="delivery-request-detail">
                <div>
                  <div className="delivery-request-label">Case Details</div>

                  <div className="delivery-request-name">
                    {/* <img src={EditImage} alt="spanner_icon" /> */}
                    <span>
                      {caseDetailData?.data?.data[0]?.caseSubject} -{" "}
                      {activityData?.data?.data[0]?.subService}
                    </span>
                  
  {caseDetailData?.data?.data[0]?.service !== "Mechanical" && (
    <img
      src={EditImage}
      alt="edit"
      style={{ cursor: "pointer" }}
      onClick={() => {
        setSelectedCase({
          caseSubject: caseDetailData?.data?.data[0],
          activity: activityData?.data?.data[0],
        });
        setShowEditPopup(true);
      }}
    />
  )}
                    {/* <i 
                      className="pi pi-pencil edit-icon"
                      onClick={() => {
                        setSelectedCase({
                          caseSubject:
                            caseDetailData?.data?.data[0]?.caseSubject,
                          subService: activityData?.data?.data[0]?.subService,
                        });
                        setShowEditPopup(true);
                      }}
                    /> */}
                  </div>
                </div>
                <div>
                  <div className="delivery-request-label">Date and time</div>

                  <div className="delivery-request-name">
                    <img src={CalendarViewIcon} alt={"calendar-icon"} />
                    <span>{caseDetailData?.data?.data[0]?.createdAt} </span>
                  </div>
                </div>
                <div>
                  <div className="delivery-request-label">Vehicle Brand</div>
                  <div className="delivery-request-name">
                    <img src={VehicleGreyIcon} alt={"milestone-icon"} />
                    <span>
                      {caseDetailData?.data?.data[0]?.vehicleMake} ,
                      {caseDetailData?.data?.data[0]?.vehicleModel}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="delivery-request-label">Vin</div>
                  <div className="delivery-request-name">
                    <span className="vehicle-detail">
                      {caseDetailData?.data?.data[0]?.vin}
                    </span>
                  </div>
                </div>
                {/* <div>
                    <div className="delivery-request-label">
    Model
    </div>
  <div className="delivery-request-name">
                    <span className="vehicle-detail">
                      {caseDetailData?.data?.data[0]?.vehicleModel}
                    </span></div></div> */}
                <div>
                  <div className="delivery-request-label">Vehicle Type</div>
                  <div className="delivery-request-name">
                    <span className="vehicle-detail">
                      {caseDetailData?.data?.data[0]?.vehicleType}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h5 className="header-title">{pathTitle}</h5>
              {isMapView && mapViewContext && (
                <div
                  className="header-map-color-filter"
                  ref={filterDropdownRef}
                >
                  {/* Main Filter Row - ASP and Case */}
                  <div className="map-filter-main-row">
                    {/* ASP Filter Item */}
                    <div className="map-filter-item-wrapper">
                      <div
                        className={`map-filter-item ${
                          expandedFilterType === "asp" ? "expanded" : ""
                        } ${
                          mapViewContext.selectedFilterType === "asp"
                            ? "has-filter"
                            : ""
                        }`}
                        onClick={() => {
                          setExpandedFilterType(
                            expandedFilterType === "asp" ? null : "asp"
                          );
                        }}
                      >
                        <span className="filter-item-label">Vehicle</span>
                        <span className="filter-item-count">
                          {(mapViewContext.statusCounts?.asp?.green || 0) +
                            (mapViewContext.statusCounts?.asp?.blue || 0) +
                            (mapViewContext.statusCounts?.asp?.red || 0) +
                            (mapViewContext.statusCounts?.asp?.black || 0)}
                        </span>
                        <span
                          className={`filter-dropdown-icon ${
                            expandedFilterType === "asp" ? "expanded" : ""
                          }`}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 4.5L6 7.5L9 4.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                      {/* ASP Color Code Dropdown */}
                      {expandedFilterType === "asp" && (
                        <div className="map-color-filter-dropdown">
                          <div className="map-color-legend-row">
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter === null &&
                                mapViewContext.selectedFilterType === "asp"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    null,
                                    "asp"
                                  );
                                }
                              }}
                              title="Show All Vehicle"
                            >
                              <div className="legend-color all"></div>
                              <span className="legend-label">All</span>
                              <span className="legend-count">
                                {(mapViewContext.statusCounts?.asp?.green ||
                                  0) +
                                  (mapViewContext.statusCounts?.asp?.blue ||
                                    0) +
                                  (mapViewContext.statusCounts?.asp?.red || 0) +
                                  (mapViewContext.statusCounts?.asp?.black ||
                                    0)}
                              </span>
                            </div>
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter ===
                                  "green" &&
                                mapViewContext.selectedFilterType === "asp"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    "green",
                                    "asp"
                                  );
                                }
                              }}
                              title="Filter by Available"
                            >
                              <div className="legend-color green"></div>
                              <span className="legend-label">Available</span>
                              <span className="legend-count">
                                {mapViewContext.statusCounts?.asp?.green || 0}
                              </span>
                            </div>
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter ===
                                  "blue" &&
                                mapViewContext.selectedFilterType === "asp"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    "blue",
                                    "asp"
                                  );
                                }
                              }}
                              title="Filter by On the Way"
                            >
                              <div className="legend-color blue"></div>
                              <span className="legend-label">On the Way</span>
                              <span className="legend-count">
                                {mapViewContext.statusCounts?.asp?.blue || 0}
                              </span>
                            </div>
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter === "red" &&
                                mapViewContext.selectedFilterType === "asp"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    "red",
                                    "asp"
                                  );
                                }
                              }}
                              title="Filter by Busy"
                            >
                              <div className="legend-color red"></div>
                              <span className="legend-label">Busy</span>
                              <span className="legend-count">
                                {mapViewContext.statusCounts?.asp?.red || 0}
                              </span>
                            </div>
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter ===
                                  "black" &&
                                mapViewContext.selectedFilterType === "asp"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    "black",
                                    "asp"
                                  );
                                }
                              }}
                              title="Filter by Offline"
                            >
                              <div className="legend-color black"></div>
                              <span className="legend-label">Offline</span>
                              <span className="legend-count">
                                {mapViewContext.statusCounts?.asp?.black || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Case Filter Item */}
                    <div className="map-filter-item-wrapper">
                      <div
                        className={`map-filter-item ${
                          expandedFilterType === "case" ? "expanded" : ""
                        } ${
                          mapViewContext.selectedFilterType === "case"
                            ? "has-filter"
                            : ""
                        }`}
                        onClick={() => {
                          setExpandedFilterType(
                            expandedFilterType === "case" ? null : "case"
                          );
                        }}
                      >
                        <span className="filter-item-label">Case</span>
                        <span className="filter-item-count">
                          {(mapViewContext.statusCounts?.case?.green || 0) +
                            (mapViewContext.statusCounts?.case?.yellow || 0) +
                            (mapViewContext.statusCounts?.case?.red || 0)}
                        </span>
                        <span
                          className={`filter-dropdown-icon ${
                            expandedFilterType === "case" ? "expanded" : ""
                          }`}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 4.5L6 7.5L9 4.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                      {/* Case Color Code Dropdown */}
                      {expandedFilterType === "case" && (
                        <div className="map-color-filter-dropdown">
                          <div className="map-color-legend-row">
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter === null &&
                                mapViewContext.selectedFilterType === "case"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    null,
                                    "case"
                                  );
                                }
                              }}
                              title="Show All Cases"
                            >
                              <div className="legend-color all"></div>
                              <span className="legend-label">All</span>
                              <span className="legend-count">
                                {(mapViewContext.statusCounts?.case?.green ||
                                  0) +
                                  (mapViewContext.statusCounts?.case?.yellow ||
                                    0) +
                                  (mapViewContext.statusCounts?.case?.red || 0)}
                              </span>
                            </div>
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter ===
                                  "green" &&
                                mapViewContext.selectedFilterType === "case"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    "green",
                                    "case"
                                  );
                                }
                              }}
                              title="Filter by Inprogress"
                            >
                              <div className="legend-color green"></div>
                              <span className="legend-label">Inprogress</span>
                              <span className="legend-count">
                                {mapViewContext.statusCounts?.case?.green || 0}
                              </span>
                            </div>
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter ===
                                  "yellow" &&
                                mapViewContext.selectedFilterType === "case"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    "yellow",
                                    "case"
                                  );
                                }
                              }}
                              title="Filter by Case Created"
                            >
                              <div className="legend-color yellow"></div>
                              <span className="legend-label">Case Created</span>
                              <span className="legend-count">
                                {mapViewContext.statusCounts?.case?.yellow || 0}
                              </span>
                            </div>
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter === "red" &&
                                mapViewContext.selectedFilterType === "case"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    "red",
                                    "case"
                                  );
                                }
                              }}
                              title="Filter by ASP Unassigned"
                            >
                              <div className="legend-color red"></div>
                              <span className="legend-label">
                                ASP Unassigned
                              </span>
                              <span className="legend-count">
                                {mapViewContext.statusCounts?.case?.red || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Technician Filter Item */}
                    <div className="map-filter-item-wrapper">
                      <div
                        className={`map-filter-item ${
                          expandedFilterType === "technician" ? "expanded" : ""
                        } ${
                          mapViewContext.selectedFilterType === "technician"
                            ? "has-filter"
                            : ""
                        }`}
                        onClick={() => {
                          setExpandedFilterType(
                            expandedFilterType === "technician"
                              ? null
                              : "technician"
                          );
                        }}
                      >
                        <span className="filter-item-label">Technician</span>
                        <span className="filter-item-count">
                          {(mapViewContext.statusCounts?.technician?.green ||
                            0) +
                            (mapViewContext.statusCounts?.technician?.blue ||
                              0) +
                            (mapViewContext.statusCounts?.technician?.red ||
                              0) +
                            (mapViewContext.statusCounts?.technician?.black ||
                              0)}
                        </span>
                        <span
                          className={`filter-dropdown-icon ${
                            expandedFilterType === "technician"
                              ? "expanded"
                              : ""
                          }`}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 4.5L6 7.5L9 4.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                      {/* Technician Color Code Dropdown */}
                      {expandedFilterType === "technician" && (
                        <div className="map-color-filter-dropdown">
                          <div className="map-color-legend-row">
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter === null &&
                                mapViewContext.selectedFilterType ===
                                  "technician"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    null,
                                    "technician"
                                  );
                                }
                              }}
                              title="Show All Technicians"
                            >
                              <div className="legend-color all"></div>
                              <span className="legend-label">All</span>
                              <span className="legend-count">
                                {(mapViewContext.statusCounts?.technician
                                  ?.green || 0) +
                                  (mapViewContext.statusCounts?.technician
                                    ?.blue || 0) +
                                  (mapViewContext.statusCounts?.technician
                                    ?.red || 0) +
                                  (mapViewContext.statusCounts?.technician
                                    ?.black || 0)}
                              </span>
                            </div>
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter ===
                                  "green" &&
                                mapViewContext.selectedFilterType ===
                                  "technician"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    "green",
                                    "technician"
                                  );
                                }
                              }}
                              title="Filter by Available"
                            >
                              <div className="legend-color green"></div>
                              <span className="legend-label">Available</span>
                              <span className="legend-count">
                                {mapViewContext.statusCounts?.technician
                                  ?.green || 0}
                              </span>
                            </div>
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter ===
                                  "blue" &&
                                mapViewContext.selectedFilterType ===
                                  "technician"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    "blue",
                                    "technician"
                                  );
                                }
                              }}
                              title="Filter by Assigned"
                            >
                              <div className="legend-color blue"></div>
                              <span className="legend-label">Assigned</span>
                              <span className="legend-count">
                                {mapViewContext.statusCounts?.technician
                                  ?.blue || 0}
                              </span>
                            </div>
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter === "red" &&
                                mapViewContext.selectedFilterType ===
                                  "technician"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    "red",
                                    "technician"
                                  );
                                }
                              }}
                              title="Filter by Busy"
                            >
                              <div className="legend-color red"></div>
                              <span className="legend-label">Busy</span>
                              <span className="legend-count">
                                {mapViewContext.statusCounts?.technician?.red ||
                                  0}
                              </span>
                            </div>
                            <div
                              className={`legend-item ${
                                mapViewContext.selectedStatusFilter ===
                                  "black" &&
                                mapViewContext.selectedFilterType ===
                                  "technician"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (mapViewContext?.handleStatusFilterClick) {
                                  mapViewContext.handleStatusFilterClick(
                                    "black",
                                    "technician"
                                  );
                                }
                              }}
                              title="Filter by Offline"
                            >
                              <div className="legend-color black"></div>
                              <span className="legend-label">Offline</span>
                              <span className="legend-count">
                                {mapViewContext.statusCounts?.technician
                                  ?.black || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="header-right-wrap">
          {/* Call Initiate Button  agent,admin,TL,SME,NH,call center manager,tvs spoc,network head,customer experience head,command center head,call center head , service head,bo head*/}
          {[3, 8, 1, 7, 14, 15, 16, 21, 22, 23, 24, 25, 26, 27].includes(
            user?.role?.id
          ) &&
            permissions?.includes("quick-search") && (
              <button
                className="header-icon"
                onClick={() => setCallInitiateVisible(true)}
              >
                <img
                  className="img-fluid"
                  src={SearchIcon}
                  alt="Notification Icon"
                />
              </button>
            )}

          {/* Interaction Button - Only for Agent Role */}
          {user?.role?.id == 3 && (
            <button
              className="header-icon"
              onClick={() => setInteractionDialogVisible(true)}
            >
              <img
                className="img-fluid"
                src={InteractionGreyIcon}
                alt="Interaction Icon"
              />
            </button>
          )}

          {/* Notifiction Button */}
          {permissions?.includes("notifications-web") && (
            <button
              className="header-icon"
              onClick={() => setNotificationVisible(true)}
              disabled={user?.role?.id == 1}
            >
              <img
                className="img-fluid"
                src={NotificationImage}
                alt="Notification Icon"
                
              />
              <span className="header-icon-dot"></span>
            </button>
          )}

          {/* Profile Button */}
          <button
            className="header-profile-btn"
            onClick={(e) => menu.current.toggle(e)}
          >
            {user?.profileName ? (
              <div className="profile-image-container">
                <img src={`${ProfileUrl}${user?.profileName}`} />
              </div>
            ) : (
              <div className="header-avatar">
                <Avatar text={user?.name?.charAt(0).toUpperCase()} />
                {user?.role?.id == 3 && (
                  <span className={userStatus} title={userStatus}></span>
                )}
              </div>
            )}
            <div className="header-profile-details">
              <span className="header-profile-value">{user?.name}</span>
              <span className="header-profile-values">
                {user?.code ?? "--"}
              </span>
            </div>
            <img className="img-fluid" src={DropdownIcon} alt="Dropdown" />
          </button>
          <Menu
            className="profile-menu"
            model={profileDropdownMenu}
            popup
            ref={menu}
            onShow={() => {
              if (user?.role?.id === 3) {
                // Call the API when the menu is opened
                refetchUserStatus();
              }
            }}
          />
        </div>
      </div>
      <Sidebar
        visible={notificationVisible}
        position="right"
        closeIcon={<DialogCloseIcon />}
        onHide={handleClose}
        pt={{
          root: { className: "notification-sidebar" },
        }}
        icons={
          <>
            <h5 className="notification-sidebar-title">Notifications</h5>
          </>
        }
      >
        <NotificationSidebar
          onClick={handleClose}
          visible={notificationVisible}
        />
      </Sidebar>
      {callInitiateVisible && (
        <QuickSearchDialog
          callinitiateVisible={callInitiateVisible}
          setCallInitiateVisible={setCallInitiateVisible}
        />
      )}
      <InterActionSidebar
        visible={interactionDialogVisible}
        setVisible={setInteractionDialogVisible}
        data={interactionFormData?.data?.data?.extras}
        onSave={handleSaveInteraction}
        isLoading={interactionMutateLoading}
        isFromHeader={true}
        levelId={user?.levelId}
        caseDetail={caseDetailDataa?.data?.data?.[0]}
      />
      {/* <EditCaseDetailsDialog
        visible={showEditPopup}
        onHide={() => setShowEditPopup(false)}
        selectedCase={selectedCase}
        onSave={(payload) => {
          updateCaseServiceMutation.mutate(payload);
        }}
      /> */}
      <EditCaseDetailsDialog
        visible={showEditPopup}
        selectedCase={selectedCase}
        onHide={() => setShowEditPopup(false)}
        onSave={(payload) => updateCaseServiceMutation.mutate(payload)}
      />
    </header>
  );
};

export default Header;
