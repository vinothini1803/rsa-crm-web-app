import React, { useEffect, useRef, useState } from "react";
import {
  DialogCloseSmallIcon,
  LocationPointIcon,
  PhoneGrayIcon,
  GoogleMapAPIKey,
  DefaultLoactionMarker,
  MechanicLocation,
} from "../../../utills/imgConstants";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import GoogleMapReact from "google-map-react";
import CaseInfoCard from "./CaseInfoCard";
import ASPCard from "../../../components/common/ASPCard";
import EmptyComponent from "../../../components/common/TableWrapper/EmptyComponent";
import Loader from "../../../components/common/Loader";
import TravelledKM from "../../../components/common/TravelledKM";
import StatusBadge from "../../../components/common/StatusBadge";
import { caseDetail } from "../../../../services/deliveryRequestViewService";
import {
  aspCancelReason,
  aspRejectionReason,
  nspFilter,
  subService,
} from "../../../../services/masterServices";
import {
  assginAsp,
  rejectActivity,
  nearASP,
  asprequestActivities,
  aspCancel,
  aspData,
  assignDriver,
} from "../../../../services/assignServiceProvider";
import {
  getCaseInfo,
  getNspLocations,
  assignCaseAsp,
} from "../../../../services/caseService";
import { CurrentUser } from "../../../../store/slices/userSlice";

const Marker = ({ lat, lng, icon }) => (
  <div lat={lat} lang={lng}>
    <img src={icon} />
  </div>
);

const AspAssignment = () => {
  const [notifyPopup, setNotifyPopup] = useState(true);
  const dispatch = useDispatch();
  const { id, caseActivityId } = useParams(); // case Id
  const [visible, setVisible] = useState(false);
  const [mapRefresh, setMapRefresh] = useState(false);
  const [rejcetVisible, setRejectVisible] = useState(false);
  const [aspId, setAspId] = useState(null);
  const [activityId, setActivityId] = useState();
  const [cancelVisible, setCancelVisible] = useState(false);
  const [filterId, setFilterId] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [thirdPartyAsp, setThirdPartyAsp] = useState(false);
  const { role, userTypeId } = useSelector(CurrentUser);
  const [searchKM, setSearchKM] = useState(50);
  const [breakdownStatusFilter, setBreakdownStatusFilter] = useState("all");
  const [dropStatusFilter, setDropStatusFilter] = useState("all");
  const [driverModalVisible, setDriverModalVisible] = useState(false);
  const [selectedAspForDriver, setSelectedAspForDriver] = useState(null);
  const queryClient = useQueryClient();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subServiceId = queryParams.get("subservice");
  const serviceId = queryParams.get("service");

  /* const aspMarkerIcon = {
    url: DefaultLoactionMarker, // Path to your custom icon
    scaledSize: new window.google.maps.Size(40, 40), // Size of the icon
    origin: new window.google.maps.Point(0, 0), // Position of the icon's origin
    anchor: new window.google.maps.Point(20, 40) // Position of the icon's anchor
  }; */

  /* const breakdownMarkerIcon = {
    url: MechanicLocation, // Path to your custom icon
    scaledSize: new window.google.maps.Size(40, 40), // Size of the icon
    origin: new window.google.maps.Point(0, 0), // Position of the icon's origin
    anchor: new window.google.maps.Point(20, 40) // Position of the icon's anchor
  } */

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      rejectReasonId: "",
    },
  });

  const {
    handleSubmit: handleCancelSubmit,
    control: controlCancel,
    reset: cancelReset,
    formState: { errors: cancelErrors },
  } = useForm({});

  // Form for driver selection modal
  const {
    handleSubmit: handleDriverSubmit,
    control: driverFormControl,
    reset: driverFormReset,
    formState: { errors: driverFormErrors },
  } = useForm({
    defaultValues: {
      aspMechanicId: "",
    },
  });

  // Reset status filters when main filters change
  useEffect(() => {
    setBreakdownStatusFilter("all");
    setDropStatusFilter("all");
  }, [filterId, searchKey, thirdPartyAsp]);

  // Get Case Info
  const {
    data: caseDetailData,
    refetch: refetchCaseDetails,
    isLoading: caseIsLoading,
  } = useQuery(["caseAsplocationDetails"], () =>
    getCaseInfo({
      caseId: id,
    })
  );

  // Current Activity Data
  const { data: activityViewData, refetch: activityViewRefetch } = useQuery(
    ["getAssignmentCaseActivity"],
    () => aspData({ activityId: caseActivityId }),
    {
      enabled: caseActivityId ? true : false,
      refetchOnWindowFocus: false,
    }
  );
  // console.log(
  //   "Current ASP Activity =>",
  //   activityViewData?.data?.data,
  //   caseDetailData
  // );

  // Get Filter Data
  const { data: nspFilterData } = useQuery(["aspCasedistance"], () =>
    nspFilter({
      typeId: 31,
    })
  );

  //This is for send Requset Restriction Logic
  const { data: sendRequestData, refetch: aspRequestRefetch } = useQuery(
    ["aspRequestActivities"],
    () =>
      asprequestActivities({
        caseDetailId: id,
      })
  );
  //console.log("sendRequestData", sendRequestData);
  // Filter subservice request data by subservice id
  const filteredSubServiceRequestData = sendRequestData?.data?.data?.filter(
    (subservice) =>
      activityViewData?.data?.data?.[0]?.subServiceId ==
      subservice?.subServiceId
  );
  // Assign ASP
  const { mutate: assignAspMutate, isLoading: assignAspIsLoading } =
    useMutation(assignCaseAsp);
  // ASP Rejection Reason
  const { data: aspRejectionReasonData } = useQuery(
    ["aspRejectionReason"],
    () =>
      aspRejectionReason({
        apiType: "dropdown",
      })
  );
  // Reject Activity
  const { mutate: rejectActivityMutate, isLoading: rejectionLoading } =
    useMutation(rejectActivity);
  // ASP Cancel Reason
  const { data: aspCancelReasons } = useQuery(["aspCancelReasonsList"], () =>
    aspCancelReason({
      apiType: "dropdown",
    })
  );
  // Cancel ASP requests
  const { mutate: cancelASPMutate, isLoading: aspCancelIsLoading } =
    useMutation(aspCancel);

  // Assign Driver
  const { mutate: assignDriverMutate, isLoading: assignDriverLoading } =
    useMutation(assignDriver);

  //Calling Nearby Service Provider API
  const {
    data: nearASPData,
    refetch: nearASPRefetch,
    isLoading: nearASPLoading,
  } = useQuery(
    ["getNspLocations", id, filterId, thirdPartyAsp, searchKey],
    () =>
      getNspLocations({
        caseDetailId: id,
        activityId: activityViewData?.data?.data[0]?.activityId,
        serviceId: activityViewData?.data?.data[0]?.serviceId,
        subServiceId: activityViewData?.data?.data[0]?.subServiceId,
        isOwnPatrol: thirdPartyAsp ? 0 : 1,
        search: searchKey,
        ...(filterId && { filterId: filterId?.toString() }),
        ...(caseDetailData?.data?.data[0]?.clientId && {
          clientId: caseDetailData?.data?.data[0]?.clientId,
        }),
      }),
    {
      enabled:
        activityViewData?.data?.success &&
        activityViewData?.data?.data[0]?.serviceId &&
        caseDetailData?.data?.success
          ? true
          : false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (!res?.data?.success) {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors?.forEach((err) => toast.error(err));
          }
        }
      },
      onError: (err) => {
        toast.error(err?.response?.data?.error || err?.message);
      },
    }
  );
  const activityIdReimbursement = activityViewData?.data?.data[0]?.activityId;
  // console.log("Near ASP => ", activityIdReimbursement);
  // console.log("Near ASP => ", nearASPData?.data?.data);

  // Handle ASP Cancel
  const handleAspCancel = (values) => {
    // console.log("handleAspCancel", values);
    cancelASPMutate(
      {
        activityId: activityId,
        ...values,
        logTypeId: 240,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setCancelVisible(false);
            cancelReset();

            aspRequestRefetch();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  //Reject Handle Function
  const handleFormSubmit = (value) => {
    // console.log("value", value);
    rejectActivityMutate(
      {
        activityId: activityId,
        ...value,
        logTypeId: 240,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setRejectVisible(false);
            reset();
            nearASPRefetch();
            aspRequestRefetch(); //refetch for Request Restriction logic
          } else {
            toast.error(res?.data?.error);
          }
        },
      }
    );
  };

  //Handle Send Req func
  const handleSendRequest = (
    e,
    aspId,
    isOwnPatrol,
    ownPatrolVehicle,
    aspMechanics
  ) => {
    setAspId(aspId);
    assignAspMutate(
      {
        caseDetailId: id,
        aspId: aspId,
        activityId: caseActivityId,
        activityStatusId: 1, //Now only its static
        serviceId: activityViewData?.data?.data[0]?.serviceId,
        subServiceId: activityViewData?.data?.data[0]?.subServiceId,
        isOwnPatrol: isOwnPatrol,
        ownPatrolVehicleExists: ownPatrolVehicle ? true : false,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            // If COCO ASP and CRM case, show driver selection modal after successful request
            if (isOwnPatrol) {
              setSelectedAspForDriver({
                aspId,
                isOwnPatrol,
                ownPatrolVehicle,
                aspMechanics: aspMechanics || [],
              });
              setDriverModalVisible(true);
            } else {
              // For non-COCO ASPs, show success toast
              toast.success(res?.data?.message);
            }
            nearASPRefetch();
            aspRequestRefetch(); //refetch for Request Restriction logic
            activityViewRefetch(); //refetch activity data to get updated customerNeedToPay
          } else {
            toast.error(res?.data?.error);
          }
        },
      }
    );
  };

  // Helper function to get work status text from workStatusId
  const getWorkStatusText = (workStatusId) => {
    // 11 = Offline, 12 = Available, 13 = Busy
    const statusMap = {
      11: "Offline",
      12: "Available",
      13: "Busy",
    };
    return statusMap[workStatusId] || "Unknown";
  };

  // Helper function to get work status color from workStatusId
  const getWorkStatusColor = (workStatusId) => {
    // 11 = Offline (gray), 12 = Available (green), 13 = Busy (red)
    const colorMap = {
      11: "#949494", // Gray for Offline
      12: "#4db86b", // Light green for Available
      13: "#ea4335", // Light red for Busy
    };
    return colorMap[workStatusId] || "#949494";
  };

  // Handle driver selection modal submit
  const handleDriverFormSubmit = (values) => {
    if (!selectedAspForDriver || !values.aspMechanicId) {
      toast.error("Please select a driver");
      return;
    }

    // Get activityId from filteredSubServiceRequestData for the selected ASP
    const activityData = filteredSubServiceRequestData?.find(
      (activity) => activity?.aspId === selectedAspForDriver.aspId
    );

    if (!activityData || !activityData.activityId) {
      toast.error("Activity not found for this ASP");
      return;
    }

    assignDriverMutate(
      {
        activityId: activityData.activityId,
        aspId: selectedAspForDriver.aspId,
        aspMechanicId: values.aspMechanicId,
        logTypeId: 240,
      },
      {
        onSuccess: async (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message || "Driver assigned successfully");
            setDriverModalVisible(false);
            driverFormReset();
            setSelectedAspForDriver(null);
            // Invalidate and refetch queries to ensure UI is updated
            // await queryClient.invalidateQueries(["aspRequestActivities"]);
            // await queryClient.invalidateQueries(["getAssignmentCaseActivity"]);
            aspRequestRefetch();
            activityViewRefetch();
            nearASPRefetch();
          } else {
            toast.error(res?.data?.error || "Failed to assign driver");
          }
        },
        onError: (error) => {
          toast.error(error?.response?.data?.error || "Error assigning driver");
        },
      }
    );
  };

  const calculateRadius = (distance) => {
    const parsedDistance = parseFloat(distance);
    if (!isNaN(parsedDistance) && parsedDistance >= 0) {
      // Convert kilometers to meters
      const radiusInMeters = parsedDistance * 1000;
      return radiusInMeters;
    } else {
      alert("Please enter a valid non-negative number");
    }
  };

  const handleApiLoaded = (map, maps) => {
    // console.log("direction called", map);
    if (map && maps) {
      const breakdownLocation = {
        lat: Number(
          nearASPData?.data?.data?.breakdownProviders?.breakdownPoints?.lat
        ),
        lng: Number(
          nearASPData?.data?.data?.breakdownProviders?.breakdownPoints?.long
        ),
      };

      const BreakdownWindow = new google.maps.InfoWindow({
        content: `<div class="asp-location"><div class="location-title">Breakdown Location</div><div class="location-detail">${
          nearASPData?.data?.data?.breakdownProviders?.breakdownLocation || "--"
        } </div></div>`,
        ariaLabel: "Breakdown Location",
      });

      // Store all InfoWindows for click-outside functionality
      const infoWindows = [BreakdownWindow];
      let currentOpenWindow = null;

      // Track when a marker was clicked to prevent map click from closing immediately
      let markerClickTime = 0;

      // Function to close all InfoWindows
      const closeAllInfoWindows = () => {
        // Don't close if a marker was just clicked (within 100ms)
        const timeSinceMarkerClick = Date.now() - markerClickTime;
        if (timeSinceMarkerClick < 100) {
          return;
        }
        infoWindows.forEach((window) => {
          if (window) {
            window.close();
          }
        });
        if (currentOpenWindow) {
          currentOpenWindow.close();
          currentOpenWindow = null;
        }
      };

      // Add click listener to map to close InfoWindows when clicking outside
      map.addListener("click", () => {
        closeAllInfoWindows();
      });

      const breakdownMarker = new google.maps.Marker({
        position: breakdownLocation,
        icon: MechanicLocation,
        map: map,
        title: "Breakdown Location",
      });
      breakdownMarker.addListener("click", () => {
        markerClickTime = Date.now();
        BreakdownWindow.open({
          anchor: breakdownMarker,
          map,
        });
        // Close any other open window
        if (currentOpenWindow) {
          currentOpenWindow.close();
          currentOpenWindow = null;
        }
      });

      const aspMarkerArray =
        nearASPData?.data?.data?.breakdownProviders?.nearByProviders?.map(
          (location) => {
            const aspMarker = new google.maps.Marker({
              position: {
                lat: Number(location?.latitude),
                lng: Number(location?.longitude),
              },
              icon: DefaultLoactionMarker,
              map: map,
              title: location?.name,
            });

            return aspMarker;
          }
        );
      // console.log('aspMarkerArray', aspMarkerArray)
      aspMarkerArray?.map((marker, i) => {
        marker.addListener("click", () => {
          markerClickTime = Date.now();
          // Close any previously open window
          if (currentOpenWindow) {
            currentOpenWindow.close();
          }
          BreakdownWindow.close();
          // Create and store the InfoWindow
          const aspWindow = new google.maps.InfoWindow({
            content: `<div class="asp-location"><div class="location-title">${
              nearASPData?.data?.data?.breakdownProviders?.nearByProviders[i]
                ?.name || "--"
            }</div><div class="location-detail">${
              nearASPData?.data?.data?.breakdownProviders?.nearByProviders[i]
                ?.addressLineOne || ""
            }${
              nearASPData?.data?.data?.breakdownProviders?.nearByProviders[i]
                ?.addressLineTwo || ""
            }</div></div>`,
            ariaLabel: "ASP Location",
          });
          aspWindow.open({
            anchor: marker,
            map,
          });
          currentOpenWindow = aspWindow;
        });
      });

      const filteredData = nspFilterData?.data?.data?.find(
        (data) => data?.id == filterId
      );
      // const radius = filterId == 225 ? 500000 : filterId == 224 ? 200000 : filterId == 223 ? 100000 : 50000; // Radius in meters (50 kilometers)
      const radius = filteredData
        ? calculateRadius(filteredData?.kmLimit)
        : 50000;
      // setSearchKM(filterId == 225 ? 500 : filterId == 224 ? 200 : filterId == 223 ? 100 : 50)
      setSearchKM(filteredData ? parseFloat(filteredData?.kmLimit) : 50);

      const searchRadiusCircle = new google.maps.Circle({
        strokeColor: "#4DB86B",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#4DB86B",
        fillOpacity: 0.3,
        map,
        center: breakdownLocation,
        radius: radius,
        clickable: true,
      });

      // Add click listener to the circle to close InfoWindows when clicking within the radius
      searchRadiusCircle.addListener("click", () => {
        closeAllInfoWindows();
      });

      if (map) {
        if (filteredData) {
          if (parseFloat(filteredData?.kmLimit) == 500) {
            map.setZoom(6);
          } else if (parseFloat(filteredData?.kmLimit) == 200) {
            map.setZoom(7);
          } else if (parseFloat(filteredData?.kmLimit) == 100) {
            map.setZoom(8);
          } else {
            map.setZoom(9);
          }
        } else {
          map.setZoom(9);
        }
      }

      // console.log("Circle added.");
    }
  };

  // console.log("caseDetailData", caseDetailData?.data);

  // Calculate ASP status counts
  const calculateAspStatusCounts = (aspList) => {
    if (!aspList || !Array.isArray(aspList) || aspList.length === 0) {
      return { available: 0, busy: 0, offline: 0, all: 0 };
    }

    let available = 0;
    let busy = 0;
    let offline = 0;

    aspList.forEach((asp) => {
      // Check if offline: isOwnPatrol && !cocoTechnicianInShift
      if (asp?.isOwnPatrol && !asp?.cocoTechnicianInShift) {
        offline++;
      } else if (asp?.aspAvailable === true) {
        available++;
      } else {
        busy++;
      }
    });

    const all = available + busy + offline;

    return { available, busy, offline, all };
  };

  // Filter ASPs based on status
  const filterASPsByStatus = (aspList, statusFilter) => {
    if (!aspList || !Array.isArray(aspList) || statusFilter === "all") {
      return aspList || [];
    }

    return aspList.filter((asp) => {
      if (statusFilter === "offline") {
        return asp?.isOwnPatrol && !asp?.cocoTechnicianInShift;
      } else if (statusFilter === "available") {
        return (
          !(asp?.isOwnPatrol && !asp?.cocoTechnicianInShift) &&
          asp?.aspAvailable === true
        );
      } else if (statusFilter === "busy") {
        return (
          !(asp?.isOwnPatrol && !asp?.cocoTechnicianInShift) &&
          asp?.aspAvailable !== true
        );
      }
      return true;
    });
  };

  const handleSendRequestButton = (asp) => {
    // console.log('asp ******', asp);
    if (asp?.isOwnPatrol) {
      if (filteredSubServiceRequestData?.length > 0) {
        let activityStatusCheck = filteredSubServiceRequestData?.some(
          (activityStatus) =>
            activityStatus.aspId != null &&
            (activityStatus.activityStatusId == 1 || //open
              activityStatus.activityStatusId == 2 || //assigned
              activityStatus.activityStatusId == 3 || //Inprogress
              activityStatus.activityStatusId == 9 || //Waiting for dealer approval
              activityStatus.activityStatusId == 10 || //Advance payment Paid
              activityStatus.activityStatusId == 14) //advance paylater
        );

        //ActivityStatus Ids belongs to open,assigned,Inprogress,cancelled,successful,rejected,waiting for dealer pproval,
        //advance payment paid, balance pending,excess amount credit pending, payment not needed
        let aspCheck = [1, 2, 3, 7, 9, 10, 11, 12, 13, 14].includes(
          filteredSubServiceRequestData?.find(
            (activity) => activity?.aspId == asp?.id
          )?.activityStatusId
        );

        let caseActivityCheck =
          ![4, 8].includes(
            filteredSubServiceRequestData?.find(
              (activity) => activity?.activityId == caseActivityId
            )?.activityStatusId
          ) &&
          filteredSubServiceRequestData?.find(
            (activity) => activity?.activityId == caseActivityId
          )?.aspId !== null;

        if (activityStatusCheck || aspCheck || caseActivityCheck) {
          // add new technician will not come
          // disable send request button
          return {
            tech: false,
            send: true,
          };
        } else if (asp.aspMechanics.length == 0) {
          // add new technician button will come
          // disable send request button
          return {
            tech: true,
            send: true,
          };
        } else {
          // add new technician will not come
          // enable send request button
          return {
            tech: false,
            send: false,
          };
        }
      } else if (asp.aspMechanics.length == 0) {
        // add new technician button will come
        // disable send request button
        return {
          tech: true,
          send: true,
        };
      } else {
        // add new technician will not come
        // enable send request button
        return {
          tech: false,
          send: false,
        };
      }
    } else {
      // default add new technician will not come third party asp
      return {
        tech: false,

        send: !asp?.displaySendRequestBtn
          ? true
          : filteredSubServiceRequestData?.length > 0
          ? filteredSubServiceRequestData?.some(
              (activity) =>
                activity.aspId != null &&
                (activity.activityStatusId == 1 ||
                  activity.activityStatusId == 2 ||
                  activity.activityStatusId == 3 ||
                  activity.activityStatusId == 9 ||
                  activity.activityStatusId == 10 ||
                  activity.activityStatusId == 14) //advance paylater
            ) ||
            //open,assigned,cancelled,rejected,waiting for dealer approval,advance paid,balance pending,excess amount credit pending,payment not needed

            // [1, 2, 4, 8, 9, 10, 11, 12, 13].includes(
            [1, 2, 3, 7, 9, 10, 11, 12, 13, 14].includes(
              filteredSubServiceRequestData?.find(
                (activity) => activity?.aspId == asp?.id
              )?.activityStatusId
            ) ||
            //cancelled,rejected
            (![4, 8].includes(
              filteredSubServiceRequestData?.find(
                (activity) => activity?.activityId == caseActivityId
              )?.activityStatusId
            ) &&
              filteredSubServiceRequestData?.find(
                (activity) => activity?.activityId == caseActivityId
              )?.aspId !== null)
            ? true
            : false
          : false,
      };
    }
  };

  return (
    <div className="page-wrap bg-white">
      <div className="delivery-request-page-body">
        <CaseInfoCard
          caseDetail={caseDetailData?.data?.data[0]}
          activityData={activityViewData?.data?.data[0]}
          setFilterId={setFilterId}
          thirdPartyAsp={thirdPartyAsp}
          setThirdPartyAsp={setThirdPartyAsp}
          setSearchKey={setSearchKey}
          activityIdReimbursement={activityIdReimbursement}
          refetchCaseDetails={refetchCaseDetails}
          nearASPRefetch={nearASPRefetch}
          activityViewRefetch={activityViewRefetch}
        />
      </div>
      <div className="request-card-container">
        {nearASPLoading ? (
          <Loader />
        ) : (
          <div className="row row-gap-3_4 h-100 ">
            <div className="col-md-12 col-xl-6 border-right">
              <div className="request-card-header">
                <img
                  className="request-title-icon"
                  src={LocationPointIcon}
                  alt="locaion_icon"
                />

                <div className="d-flex flex-column gap-2">
                  <h4 className="request-card-title">
                    Nearest Service Provider from Breakdown Location
                  </h4>
                  {nearASPData?.data?.data?.breakdownProviders
                    ?.nearByProviders && (
                    <div className="d-flex gap-2 align-items-center">
                      {(() => {
                        const counts = calculateAspStatusCounts(
                          nearASPData?.data?.data?.breakdownProviders
                            ?.nearByProviders
                        );
                        return (
                          <>
                            <span
                              onClick={() => setBreakdownStatusFilter("all")}
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#1a2e35",
                                cursor: "pointer",
                                textDecoration:
                                  breakdownStatusFilter === "all"
                                    ? "underline"
                                    : "none",
                                opacity:
                                  breakdownStatusFilter === "all" ? 1 : 0.7,
                              }}
                            >
                              All: {counts.all}
                            </span>
                            <span
                              onClick={() =>
                                setBreakdownStatusFilter("available")
                              }
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#4db86b",
                                cursor: "pointer",
                                textDecoration:
                                  breakdownStatusFilter === "available"
                                    ? "underline"
                                    : "none",
                                opacity:
                                  breakdownStatusFilter === "available"
                                    ? 1
                                    : 0.7,
                              }}
                            >
                              Available: {counts.available}
                            </span>
                            <span
                              onClick={() => setBreakdownStatusFilter("busy")}
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#ea4335",
                                cursor: "pointer",
                                textDecoration:
                                  breakdownStatusFilter === "busy"
                                    ? "underline"
                                    : "none",
                                opacity:
                                  breakdownStatusFilter === "busy" ? 1 : 0.7,
                              }}
                            >
                              Busy: {counts.busy}
                            </span>
                            <span
                              onClick={() =>
                                setBreakdownStatusFilter("offline")
                              }
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#949494",
                                cursor: "pointer",
                                textDecoration:
                                  breakdownStatusFilter === "offline"
                                    ? "underline"
                                    : "none",
                                opacity:
                                  breakdownStatusFilter === "offline" ? 1 : 0.7,
                              }}
                            >
                              Offline: {counts.offline}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
              {/* {notifyPopup && <ASPNote />} */}
              <div className="request-card-content">
                {(() => {
                  const allASPs =
                    nearASPData?.data?.data?.breakdownProviders
                      ?.nearByProviders || [];
                  const filteredASPs = filterASPsByStatus(
                    allASPs,
                    breakdownStatusFilter
                  );
                  return filteredASPs && filteredASPs.length > 0 ? (
                    filteredASPs.map((data, i) => (
                      <div key={i}>
                        <ASPCard
                          subServiceId={
                            caseDetailData?.data?.data[0]?.subServiceId
                          }
                          caseId={caseDetailData?.data?.data[0]?.caseDetailId}
                          caseData={caseDetailData?.data?.data[0]}
                          aspId={data?.id}
                          mainsplitdisabled={data?.activityId ? true : false}
                          setAspId={setAspId}
                          onSendRequest={(e) =>
                            handleSendRequest(
                              e,
                              data.id,
                              data.isOwnPatrol,
                              data.ownPatrolVehicle,
                              data.aspMechanics
                            )
                          }
                          sendRequestLoading={
                            data.id == aspId ? assignAspIsLoading : false
                          }
                          companyName={data.name}
                          companyCode={data.code}
                          ownPatrolVehicleRegistrationNumber={
                            data?.ownPatrolVehicle?.vehicleRegistrationNumber ||
                            ""
                          }
                          point={"4.5"}
                          status={data.status ?? "--"}
                          addressLineOne={data.addressLineOne ?? "--"}
                          addressLineTwo={data?.addressLineTwo ?? "--"}
                          state={data?.state?.name ?? "--"}
                          city={data?.city?.name ?? "--"}
                          whatsappContact={data?.whatsAppNumber}
                          contactNumber={data.contactNumber}
                          distance={data?.distance}
                          duration={data?.duration}
                          reginalManager={data.rmName}
                          reginalContact={data?.rmContactNumber}
                          zonalManager={data?.zmName}
                          zonalContact={data?.zmContactNumber}
                          nationalManager={data?.nmName}
                          nationalContact={data?.nmContactNumber}
                          aspMechanics={data?.aspMechanics}
                          activityId={data?.activityId}
                          setActivityId={setActivityId}
                          setRejectVisible={setRejectVisible}
                          mapLocation={{
                            aspLocation: {
                              lat: Number(data?.latitude),
                              lng: Number(data?.longitude),
                            },
                            pickupLocation: {
                              lat: Number(
                                nearASPData?.data?.data?.breakdownProviders
                                  ?.breakdownPoints?.lat
                              ),
                              lng: Number(
                                nearASPData?.data?.data?.breakdownProviders
                                  ?.breakdownPoints?.long
                              ),
                            },
                            ...(nearASPData?.data?.data?.dropProviders && {
                              dropLocation: {
                                lat: Number(
                                  nearASPData?.data?.data?.dropProviders
                                    ?.dropLocationPoints?.lat
                                ),
                                lng: Number(
                                  nearASPData?.data?.data?.dropProviders
                                    ?.dropLocationPoints?.long
                                ),
                              },
                            }),
                          }}
                          disabled={{
                            sendRequest: handleSendRequestButton(data),
                            acceptReject:
                              filteredSubServiceRequestData?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityStatusId == 1 ||
                              filteredSubServiceRequestData?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityStatusId == 2
                                ? false
                                : true,
                          }}
                          activityStatusId={
                            filteredSubServiceRequestData?.find(
                              (activity) => activity?.aspId == data?.id
                            )?.activityStatusId == 1
                              ? true
                              : false
                          }
                          approvalbtn={
                            filteredSubServiceRequestData?.find(
                              (activity) => activity?.aspId == data?.id
                            )?.activityStatusId == 2
                              ? true
                              : false
                          }
                          cancelbtn={
                            [2, 3, 9, 10, 14].includes(
                              filteredSubServiceRequestData?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityStatusId
                            ) &&
                            [1, 2, 3, 4, 5].includes(
                              filteredSubServiceRequestData?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityAppStatusId
                            )
                              ? true
                              : false
                          }
                          setCancelVisible={setCancelVisible}
                          aspRequestRefetch={aspRequestRefetch}
                          g2gKM={data?.estimatedTotalKm ?? "--"}
                          available={data?.aspAvailable}
                          rsaCase={true}
                          caseActivityId={caseActivityId}
                          serviceId={activityViewData?.data?.data[0]?.serviceId}
                          activityData={activityViewData?.data?.data[0]}
                          isOwnPatrol={data?.isOwnPatrol}
                          nearASPRefetch={nearASPRefetch}
                          aspActivityStatusId={
                            filteredSubServiceRequestData?.find(
                              (activity) => activity?.aspId == data?.id
                            )?.aspActivityStatusId
                          }
                          activityViewRefetch={activityViewRefetch}
                          cocoTechnicianInShift={data?.cocoTechnicianInShift}
                          rejectedActivityExists={data?.rejectedActivityExists}
                          caseAssignedCount={data?.caseAssignedCount || 0}
                          ownPatrolVehicle={data?.ownPatrolVehicle}
                          isTechnicianAssigned={
                            data?.isTechnicianAssigned || false
                          }
                          onOpenDriverModal={(aspData) => {
                            // Show driver modal only for CRM cases with own patrol ASPs
                            // This page is specifically for CRM cases (rsaCase is always true)
                            if (aspData.isOwnPatrol) {
                              setSelectedAspForDriver({
                                aspId: aspData.aspId,
                                isOwnPatrol: aspData.isOwnPatrol,
                                ownPatrolVehicle: aspData.ownPatrolVehicle,
                                aspMechanics: aspData.aspMechanics || [],
                              });
                              setDriverModalVisible(true);
                            }
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <EmptyComponent />
                  );
                })()}
              </div>
            </div>
            {nearASPData?.data?.data?.dropProviders ? (
              <div className="col-md-12 col-xl-6">
                <div className="request-card-header">
                  <img
                    className="request-title-icon"
                    src={LocationPointIcon}
                    alt="locaion_icon"
                  />

                  <div className="d-flex flex-column gap-2">
                    <h4 className="request-card-title">
                      Nearest Service Provider from Drop Location
                    </h4>
                    {nearASPData?.data?.data?.dropProviders
                      ?.nearByProviders && (
                      <div className="d-flex gap-2 align-items-center">
                        {(() => {
                          const counts = calculateAspStatusCounts(
                            nearASPData?.data?.data?.dropProviders
                              ?.nearByProviders
                          );
                          return (
                            <>
                              <span
                                onClick={() => setDropStatusFilter("all")}
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "#1a2e35",
                                  cursor: "pointer",
                                  textDecoration:
                                    dropStatusFilter === "all"
                                      ? "underline"
                                      : "none",
                                  opacity: dropStatusFilter === "all" ? 1 : 0.7,
                                }}
                              >
                                All: {counts.all}
                              </span>
                              <span
                                onClick={() => setDropStatusFilter("available")}
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "#4db86b",
                                  cursor: "pointer",
                                  textDecoration:
                                    dropStatusFilter === "available"
                                      ? "underline"
                                      : "none",
                                  opacity:
                                    dropStatusFilter === "available" ? 1 : 0.7,
                                }}
                              >
                                Available: {counts.available}
                              </span>
                              <span
                                onClick={() => setDropStatusFilter("busy")}
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "#ea4335",
                                  cursor: "pointer",
                                  textDecoration:
                                    dropStatusFilter === "busy"
                                      ? "underline"
                                      : "none",
                                  opacity:
                                    dropStatusFilter === "busy" ? 1 : 0.7,
                                }}
                              >
                                Busy: {counts.busy}
                              </span>
                              <span
                                onClick={() => setDropStatusFilter("offline")}
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "#949494",
                                  cursor: "pointer",
                                  textDecoration:
                                    dropStatusFilter === "offline"
                                      ? "underline"
                                      : "none",
                                  opacity:
                                    dropStatusFilter === "offline" ? 1 : 0.7,
                                }}
                              >
                                Offline: {counts.offline}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="request-card-content">
                  {(() => {
                    const allASPs =
                      nearASPData?.data?.data?.dropProviders?.nearByProviders ||
                      [];
                    const filteredASPs = filterASPsByStatus(
                      allASPs,
                      dropStatusFilter
                    );
                    return filteredASPs && filteredASPs.length > 0 ? (
                      filteredASPs.map((data, i) => (
                        <div key={i}>
                          <ASPCard
                            subServiceId={
                              caseDetailData?.data?.data[0]?.subServiceId
                            }
                            caseId={caseDetailData?.data?.data[0]?.caseDetailId}
                            caseData={caseDetailData?.data?.data[0]}
                            aspId={data?.id}
                            setAspId={setAspId}
                            onSendRequest={(e) =>
                              handleSendRequest(
                                e,
                                data.id,
                                data.isOwnPatrol,
                                data.ownPatrolVehicle,
                                data.aspMechanics
                              )
                            }
                            sendRequestLoading={
                              data.id == aspId ? assignAspIsLoading : false
                            }
                            companyName={data.name}
                            companyCode={data.code}
                            ownPatrolVehicleRegistrationNumber={
                              data?.ownPatrolVehicle
                                ?.vehicleRegistrationNumber || ""
                            }
                            point={"4.5"}
                            status={data.status ?? "--"}
                            addressLineOne={data.addressLineOne ?? "--"}
                            addressLineTwo={data?.addressLineTwo ?? "--"}
                            state={data?.state?.name ?? "--"}
                            city={data?.city?.name ?? "--"}
                            whatsappContact={data?.whatsAppNumber}
                            contactNumber={data.contactNumber}
                            distance={data?.distance}
                            duration={data?.duration}
                            reginalManager={data.rmName}
                            reginalContact={data?.rmContactNumber}
                            zonalManager={data?.zmName}
                            zonalContact={data?.zmContactNumber}
                            nationalManager={data?.nmName}
                            nationalContact={data?.nmContactNumber}
                            aspMechanics={data?.aspMechanics}
                            activityId={data?.activityId}
                            setActivityId={setActivityId}
                            setRejectVisible={setRejectVisible}
                            mapLocation={{
                              aspLocation: {
                                lat: Number(data?.latitude),
                                lng: Number(data?.longitude),
                              },
                              pickupLocation: {
                                lat: Number(
                                  nearASPData?.data?.data?.breakdownProviders
                                    ?.breakdownPoints?.lat
                                ),
                                lng: Number(
                                  nearASPData?.data?.data?.breakdownProviders
                                    ?.breakdownPoints?.long
                                ),
                              },
                              ...(nearASPData?.data?.data?.dropProviders && {
                                dropLocation: {
                                  lat: Number(
                                    nearASPData?.data?.data?.dropProviders
                                      ?.dropLocationPoints?.lat
                                  ),
                                  lng: Number(
                                    nearASPData?.data?.data?.dropProviders
                                      ?.dropLocationPoints?.long
                                  ),
                                },
                              }),
                            }}
                            disabled={{
                              sendRequest: handleSendRequestButton(data),
                              acceptReject:
                                filteredSubServiceRequestData?.find(
                                  (activity) => activity?.aspId == data?.id
                                )?.activityStatusId == 1 ||
                                filteredSubServiceRequestData?.find(
                                  (activity) => activity?.aspId == data?.id
                                )?.activityStatusId == 2
                                  ? false
                                  : true,
                            }}
                            approvalbtn={
                              filteredSubServiceRequestData?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityStatusId == 2
                                ? true
                                : false
                            }
                            activityStatusId={
                              filteredSubServiceRequestData?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityStatusId == 1
                                ? true
                                : false
                            }
                            cancelbtn={
                              [2, 3, 9, 10, 14].includes(
                                filteredSubServiceRequestData?.find(
                                  (activity) => activity?.aspId == data?.id
                                )?.activityStatusId
                              ) &&
                              [1, 2, 3, 4, 5].includes(
                                filteredSubServiceRequestData?.find(
                                  (activity) => activity?.aspId == data?.id
                                )?.activityAppStatusId
                              )
                                ? true
                                : false
                            }
                            setCancelVisible={setCancelVisible}
                            aspRequestRefetch={aspRequestRefetch}
                            g2gKM={data?.estimatedTotalKm ?? "--"}
                            available={data?.aspAvailable}
                            rsaCase={true}
                            caseActivityId={caseActivityId}
                            serviceId={
                              activityViewData?.data?.data[0]?.serviceId
                            }
                            activityData={activityViewData?.data?.data[0]}
                            isOwnPatrol={data?.isOwnPatrol}
                            nearASPRefetch={nearASPRefetch}
                            aspActivityStatusId={
                              filteredSubServiceRequestData?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.aspActivityStatusId
                            }
                            activityViewRefetch={activityViewRefetch}
                            cocoTechnicianInShift={data?.cocoTechnicianInShift}
                            rejectedActivityExists={
                              data?.rejectedActivityExists
                            }
                            caseAssignedCount={data?.caseAssignedCount || 0}
                            ownPatrolVehicle={data?.ownPatrolVehicle}
                            isTechnicianAssigned={
                              data?.isTechnicianAssigned || false
                            }
                            onOpenDriverModal={(aspData) => {
                              // Show driver modal only for CRM cases with own patrol ASPs
                              // This page is specifically for CRM cases (rsaCase is always true)
                              if (aspData.isOwnPatrol) {
                                setSelectedAspForDriver({
                                  aspId: aspData.aspId,
                                  isOwnPatrol: aspData.isOwnPatrol,
                                  ownPatrolVehicle: aspData.ownPatrolVehicle,
                                  aspMechanics: aspData.aspMechanics || [],
                                });
                                setDriverModalVisible(true);
                              }
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <EmptyComponent />
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="col-md-12 col-xl-6">
                <div className="asp-mechanic-map">
                  {nearASPData?.data?.data?.breakdownProviders
                    ?.breakdownPoints && (
                    <div className="map-container mt-3_4">
                      <div className="travelldkm">
                        <div className="travelledkm-container">
                          Searching {searchKM} kms radius
                        </div>
                      </div>
                      <GoogleMapReact
                        key={filterId || thirdPartyAsp || searchKey}
                        defaultCenter={{
                          lat: Number(
                            nearASPData?.data?.data?.breakdownProviders
                              ?.breakdownPoints?.lat
                          ),
                          lng: Number(
                            nearASPData?.data?.data?.breakdownProviders
                              ?.breakdownPoints?.long
                          ),
                        }}
                        defaultZoom={9}
                        bootstrapURLKeys={{
                          key: GoogleMapAPIKey,
                        }}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) =>
                          handleApiLoaded(map, maps)
                        }
                      ></GoogleMapReact>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title"> Reject Reason</div>
          </div>
        }
        visible={rejcetVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => setRejectVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          id={"reject-reason-form"}
        >
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Reject Reason</label>
                <Controller
                  name="rejectReasonId"
                  control={control}
                  rules={{ required: "Reject Reason is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={aspRejectionReasonData?.data?.data?.map(
                          ({ name, id }) => {
                            return {
                              label: name,
                              value: id,
                            };
                          }
                        )}
                        optionLabel="label"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {/* {errors[field.name]?.message} */}
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
          <Button
            className="btn form-submit-btn mt-4"
            type="submit"
            form="reject-reason-form"
            loading={rejectionLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title"> Cancel Reason</div>
          </div>
        }
        visible={cancelVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => setCancelVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form
          onSubmit={handleCancelSubmit(handleAspCancel)}
          id={"reject-reason-form"}
        >
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Cancel Reason</label>
                <Controller
                  name="cancelReasonId"
                  control={controlCancel}
                  rules={{ required: "Cancel Reason is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={aspCancelReasons?.data?.data?.map(
                          ({ name, id }) => {
                            return {
                              label: name,
                              value: id,
                            };
                          }
                        )}
                        optionLabel="label"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {/* {errors[field.name]?.message} */}
                        {cancelErrors && cancelErrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            {userTypeId == 141 &&
              [3, 10, 14].includes(
                activityViewData?.data?.data[0]?.activityStatusId
              ) && (
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label required">
                      Activity Finance Status
                    </label>
                    <Controller
                      name="activityFinanceStatusId"
                      control={controlCancel}
                      rules={{
                        required: "Activity Finance Status is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select"
                            filter
                            options={activityViewData?.data?.data[0].extras?.activityFinanceStatuses?.map(
                              ({ name, id }) => {
                                return {
                                  label: name,
                                  value: id,
                                };
                              }
                            )}
                            optionLabel="label"
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {cancelErrors && cancelErrors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              )}
          </div>
          <Button
            className="btn form-submit-btn mt-4"
            type="submit"
            form="reject-reason-form"
            loading={aspCancelIsLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>

      {/* Driver Selection Modal for COCO ASPs */}
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Select Driver</div>
          </div>
        }
        visible={driverModalVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setDriverModalVisible(false);
          driverFormReset();
          setSelectedAspForDriver(null);
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form
          onSubmit={handleDriverSubmit(handleDriverFormSubmit)}
          id={"driver-selection-form"}
        >
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Driver</label>
                <Controller
                  name="aspMechanicId"
                  control={driverFormControl}
                  rules={{
                    required: "Driver is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Driver"
                        filter
                        options={
                          selectedAspForDriver?.aspMechanics?.map(
                            ({
                              name,
                              id,
                              code,
                              contactNumber,
                              workStatusId,
                              assignedCount,
                            }) => {
                              const statusText =
                                getWorkStatusText(workStatusId);
                              return {
                                label: `${name} / ${
                                  contactNumber || "N/A"
                                } / ${statusText}`,
                                value: id,
                                name: name,
                                contactNumber: contactNumber,
                                workStatus: statusText,
                                workStatusId: workStatusId,
                                assignedCount: assignedCount || 0,
                              };
                            }
                          ) || []
                        }
                        optionLabel="label"
                        onChange={(e) => field.onChange(e.value)}
                        disabled={
                          !selectedAspForDriver?.aspMechanics ||
                          selectedAspForDriver?.aspMechanics?.length === 0
                        }
                        itemTemplate={(option) => {
                          if (!option) return null;
                          const statusColor = getWorkStatusColor(
                            option.workStatusId
                          );
                          return (
                            <div className="d-flex flex-row align-items-center gap-2 p-2">
                              <div className="fw-bold">{option.name}</div>
                              <div className="text-muted small">
                                {option.contactNumber || "N/A"}
                              </div>
                              <div
                                className="small"
                                style={{ color: statusColor }}
                              >
                                {option.workStatus}
                              </div>
                              <div className="text-muted small">
                                Assigned: {option.assignedCount || 0}
                              </div>
                            </div>
                          );
                        }}
                      />
                      <div className="p-error">
                        {driverFormErrors &&
                          driverFormErrors[field.name]?.message}
                      </div>
                      {selectedAspForDriver?.aspMechanics?.length === 0 && (
                        <div className="p-error mt-2">
                          No drivers available for this ASP.
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            {/* <Button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setDriverModalVisible(false);
                driverFormReset();
                setSelectedAspForDriver(null);
              }}
            >
              Cancel
            </Button> */}
            <Button
              className="btn btn-primary"
              type="submit"
              form="driver-selection-form"
              loading={assignDriverLoading}
              disabled={
                !selectedAspForDriver?.aspMechanics ||
                selectedAspForDriver?.aspMechanics?.length === 0 ||
                assignDriverLoading
              }
            >
              Submit
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default AspAssignment;
