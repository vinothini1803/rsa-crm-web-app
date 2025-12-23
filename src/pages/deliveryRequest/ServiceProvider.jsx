import React, { useState, useEffect } from "react";
import DeliveryInfoCard from "./DeliveryInfoCard";
import {
  DialogCloseSmallIcon,
  LocationPointIcon,
} from "../../utills/imgConstants";
import ASPCard from "../../components/common/ASPCard";
import { Dropdown } from "primereact/dropdown";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
  aspCancelReason,
  aspRejectionReason,
} from "../../../services/masterServices";
import { Navigate, useParams } from "react-router";
import {
  assginAsp,
  rejectActivity,
  nearASP,
  asprequestActivities,
  aspCancel,
} from "../../../services/assignServiceProvider";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { caseDetail } from "../../../services/deliveryRequestViewService";
import EmptyComponent from "../../components/common/TableWrapper/EmptyComponent";

import Loader from "../../components/common/Loader";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";

const ServiceProvider = () => {
  const [notifyPopup, setNotifyPopup] = useState(true);
  const dispatch = useDispatch();
  const { id } = useParams(); // case Id
  const [visible, setVisible] = useState(false);
  const [rejcetVisible, setRejectVisible] = useState(false);
  const [aspId, setAspId] = useState(null);
  const [activityId, setActivityId] = useState();
  const [cancelVisible, setCancelVisible] = useState(false);
  const [filterId, setFilterId] = useState(null);
  const { role } = useSelector(CurrentUser);
  const [pickupStatusFilter, setPickupStatusFilter] = useState("all");
  const [dropStatusFilter, setDropStatusFilter] = useState("all");

  // Reset status filters when main filters change
  useEffect(() => {
    setPickupStatusFilter("all");
    setDropStatusFilter("all");
  }, [filterId]);

  const {
    data: caseDetailData,
    refetch: refetchCaseDetails,
    isLoading: caseIsLoading,
  } = useQuery(["caselocationDetails"], () =>
    caseDetail({
      caseDetailId: id,
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

  const { mutate, isLoading } = useMutation(assginAsp);
  const { data: aspRejectionReasonData } = useQuery(
    ["aspRejectionReason"],
    () =>
      aspRejectionReason({
        apiType: "dropdown",
      })
  );

  const { mutate: rejectActivityMutate, isLoading: rejectionLoading } =
    useMutation(rejectActivity);

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
  const { data: aspCancelReasons } = useQuery(["aspCancelReasonsList"], () =>
    aspCancelReason({
      apiType: "dropdown",
    })
  );
  const { mutate: cancelASPMutate, isLoading: aspCancelIsLoading } =
    useMutation(aspCancel);
  const {
    handleSubmit: handleCancelSubmit,
    control: controlCancel,
    reset: cancelReset,
    formState: { errors: cancelErrors },
  } = useForm({});

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
  //Calling Nearby Service Provider API
  const {
    data: nearASPData,
    refetch: nearASPRefetch,
    isLoading: nearASPLoading,
  } = useQuery(
    ["nearASP", id, filterId],
    () =>
      nearASP({
        caseDetailId: id,
        ...(filterId?.distanceCode && {
          filterId: filterId?.distanceCode?.toString(),
        }),
        ...(filterId?.search && { search: filterId?.search }),
        ...(caseDetailData?.data?.data[0]?.clientId && {
          clientId: caseDetailData?.data?.data[0]?.clientId,
        }),
      }),
    {
      enabled: caseDetailData?.data?.success ? true : false,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: (res) => {
        if (!res?.data?.success) {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors?.forEach((err) => toast.error(err));
          }
        }
      },
    }
  );
  // console.log("Near ASP => ", nearASPData?.data?.data);

  const ASPNote = () => (
    <div className="bg-gray">
      <div className="note-page-content">
        <div className="note-content-contanier">
          <div className="note-title">Note</div>
          <div className="note-content">
            Dial ASPs sequentially from the list, proceeding to the next ASP
            after the first one rejects the call.
          </div>
          <button
            className="bg-transparent  got-it-btn"
            onClick={() => setNotifyPopup(false)}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
  const Carddata = [
    {
      company_name: "TVS A.A Own Patrol",
      company_code: "OWDL46605",
      point: 4.5,
      status: "Available",
      location: "Madiwala Circle, Hosur",
      contact: ["9876543211", "8967543231"],
      // contact_1: "9876543211",
      // contact_2: "8967543231",
      kms: "4.5Kms",
      time: "10 mins",
      regional_manager_name: "Arun Kumar",
      zonal_manager_name: "Vignesh",
    },
    {
      company_name: "TVS A.A Own Patrol",
      company_code: "OWDL46605",
      point: 4.5,
      status: "Available",
      location: "Madiwala Circle, Hosur",
      contact: ["9876543211", "8967543231"],
      kms: "4.5Kms",
      time: "10 mins",
      regional_manager_name: "Arun Kumar",
      zonal_manager_name: "Vignesh",
    },
    {
      company_name: "TVS A.A Own Patrol",
      company_code: "OWDL46605",
      point: 4.5,
      status: "Available",
      location: "Madiwala Circle, Hosur",
      contact: ["9876543211", "8967543231"],
      kms: "4.5Kms",
      time: "10 mins",
      regional_manager_name: "Arun Kumar",
      zonal_manager_name: "Vignesh",
    },
  ];
  //const CardDetail = data?.data?.data;

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

  //Handle Send Req func
  const handleSendRequest = (e, aspId, isOwnPatrol, ownPatrolVehicle) => {
    setAspId(aspId);
    mutate(
      {
        caseDetailId: id,
        aspId: aspId,
        activityStatusId: 1, //Now only its static
        subServiceId: caseDetailData?.data?.data[0]?.subServiceId,
        isOwnPatrol: isOwnPatrol,
        ownPatrolVehicleExists: ownPatrolVehicle ? true : false,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            // console.log("respone send request", res);
            toast.success(res?.data?.message);
            nearASPRefetch();
            aspRequestRefetch(); //refetch for Request Restriction logic
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
  // console.log("caseDetailData", caseDetailData?.data);

  // console.log("sendRequestData", sendRequestData);

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
      if (sendRequestData?.data?.data?.length > 0) {
        if (
          sendRequestData?.data?.data?.some(
            (activity) =>
              activity.activityStatusId == 1 ||
              activity.activityStatusId == 2 ||
              activity.activityStatusId == 3 ||
              activity.activityStatusId == 9 ||
              activity.activityStatusId == 10 ||
              activity.activityStatusId == 14
          ) ||
          [1, 2, 3, 7, 9, 10, 11, 12, 13, 14].includes(
            sendRequestData?.data?.data?.find(
              (activity) => activity?.aspId == asp?.id
            )?.activityStatusId
          )
        ) {
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
      // default add new technician will not come
      return {
        tech: false,
        // send: !asp?.displaySendRequestBtn
        //   ? true
        //   : sendRequestData?.data?.data?.length > 0
        //   ? sendRequestData?.data?.data?.some(
        //       (activity) =>
        //         activity.activityStatusId == 1 ||
        //         activity.activityStatusId == 2 ||
        //         activity.activityStatusId == 3 ||
        //         activity.activityStatusId == 9 ||
        //         activity.activityStatusId == 10 ||
        //         activity.activityStatusId == 14
        //     ) ||
        //     [1, 2, 3, 7, 9, 10, 11, 12, 13, 14].includes(
        //       sendRequestData?.data?.data?.find(
        //         (activity) => activity?.aspId == asp?.id
        //       )?.activityStatusId
        //     )
        //     ? true
        //     : false
        //   : false,
        send:
          sendRequestData?.data?.data?.length > 0
            ? sendRequestData?.data?.data?.some(
                (activity) =>
                  activity.activityStatusId == 1 ||
                  activity.activityStatusId == 2 ||
                  activity.activityStatusId == 3 ||
                  activity.activityStatusId == 9 ||
                  activity.activityStatusId == 10 ||
                  activity.activityStatusId == 14
              ) ||
              [1, 2, 3, 7, 9, 10, 11, 12, 13, 14].includes(
                sendRequestData?.data?.data?.find(
                  (activity) => activity?.aspId == asp?.id
                )?.activityStatusId
              )
              ? true
              : false
            : false,
      };
    }
  };

  return (
    <div className="page-wrap bg-white">
      <div className="delivery-request-page-body">
        <DeliveryInfoCard
          caseDetail={caseDetailData?.data?.data[0]}
          setFilterId={setFilterId}
          nearASPRefetch={nearASPRefetch}
          refetchCaseDetails={refetchCaseDetails}
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
                    Nearest Service Provider from Pickup Location
                  </h4>
                  {nearASPData?.data?.data?.pickupProviders
                    ?.nearByProviders && (
                    <div className="d-flex gap-2 align-items-center">
                      {(() => {
                        const counts = calculateAspStatusCounts(
                          nearASPData?.data?.data?.pickupProviders
                            ?.nearByProviders
                        );
                        return (
                          <>
                            <span
                              onClick={() => setPickupStatusFilter("all")}
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#1a2e35",
                                cursor: "pointer",
                                textDecoration:
                                  pickupStatusFilter === "all"
                                    ? "underline"
                                    : "none",
                                opacity: pickupStatusFilter === "all" ? 1 : 0.7,
                              }}
                            >
                              All: {counts.all}
                            </span>
                            <span
                              onClick={() => setPickupStatusFilter("available")}
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#4db86b",
                                cursor: "pointer",
                                textDecoration:
                                  pickupStatusFilter === "available"
                                    ? "underline"
                                    : "none",
                                opacity:
                                  pickupStatusFilter === "available" ? 1 : 0.7,
                              }}
                            >
                              Available: {counts.available}
                            </span>
                            <span
                              onClick={() => setPickupStatusFilter("busy")}
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#ea4335",
                                cursor: "pointer",
                                textDecoration:
                                  pickupStatusFilter === "busy"
                                    ? "underline"
                                    : "none",
                                opacity:
                                  pickupStatusFilter === "busy" ? 1 : 0.7,
                              }}
                            >
                              Busy: {counts.busy}
                            </span>
                            <span
                              onClick={() => setPickupStatusFilter("offline")}
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#949494",
                                cursor: "pointer",
                                textDecoration:
                                  pickupStatusFilter === "offline"
                                    ? "underline"
                                    : "none",
                                opacity:
                                  pickupStatusFilter === "offline" ? 1 : 0.7,
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
                    nearASPData?.data?.data?.pickupProviders?.nearByProviders ||
                    [];
                  const filteredASPs = filterASPsByStatus(
                    allASPs,
                    pickupStatusFilter
                  );
                  return filteredASPs && filteredASPs.length > 0 ? (
                    filteredASPs.map((data, i) => (
                      <div key={i}>
                        <ASPCard
                          subServiceId={
                            caseDetailData?.data?.data[0]?.subServiceId
                          }
                          caseId={caseDetailData?.data?.data[0]?.caseDetailId}
                          aspId={data?.id}
                          mainsplitdisabled={data?.activityId ? true : false}
                          setAspId={setAspId}
                          onSendRequest={(e) =>
                            handleSendRequest(
                              e,
                              data.id,
                              data.isOwnPatrol,
                              data.ownPatrolVehicle
                            )
                          }
                          sendRequestLoading={
                            data.id == aspId ? isLoading : false
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
                          activityId={data?.activityId}
                          setActivityId={setActivityId}
                          setRejectVisible={setRejectVisible}
                          agentAssignedAt={
                            caseDetailData?.data?.data[0]
                              ?.agentAssignedAtInMilliSeconds
                          }
                          slaTime={
                            caseDetailData?.data?.data[0]?.extras?.slaSettings
                          }
                          mapLocation={{
                            aspLocation: {
                              lat: Number(data?.latitude),
                              lng: Number(data?.longitude),
                            },
                            pickupLocation: {
                              lat: Number(
                                nearASPData?.data?.data?.pickupProviders
                                  ?.pickupDealerPoints?.lat
                              ),
                              lng: Number(
                                nearASPData?.data?.data?.pickupProviders
                                  ?.pickupDealerPoints?.long
                              ),
                            },
                            dropLocation: {
                              lat: Number(
                                nearASPData?.data?.data?.dropProviders
                                  ?.dropDealerPoints?.lat
                              ),
                              lng: Number(
                                nearASPData?.data?.data?.dropProviders
                                  ?.dropDealerPoints?.long
                              ),
                            },
                          }}
                          disabled={{
                            sendRequest: handleSendRequestButton(data),
                            acceptReject:
                              sendRequestData?.data?.data?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityStatusId == 1 ||
                              sendRequestData?.data?.data?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityStatusId == 2
                                ? false
                                : true,
                          }}
                          activityStatusId={
                            sendRequestData?.data?.data?.find(
                              (activity) => activity?.aspId == data?.id
                            )?.activityStatusId == 1
                              ? true
                              : false
                          }
                          approvalbtn={
                            sendRequestData?.data?.data?.find(
                              (activity) => activity?.aspId == data?.id
                            )?.activityStatusId == 2
                              ? true
                              : false
                          }
                          cancelbtn={
                            [2, 3, 9, 10, 14].includes(
                              sendRequestData?.data?.data?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityStatusId
                            ) &&
                            [1, 2, 3, 4, 5].includes(
                              sendRequestData?.data?.data?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityAppStatusId
                            )
                              ? true
                              : false
                          }
                          setCancelVisible={setCancelVisible}
                          aspRequestRefetch={aspRequestRefetch}
                          nearASPRefetch={nearASPRefetch}
                          g2gKM={data?.estimatedTotalKm ?? "--"}
                          available={data?.aspAvailable}
                          rsaCase={false}
                          isOwnPatrol={data?.isOwnPatrol}
                          aspMechanics={data?.aspMechanics}
                          cocoTechnicianInShift={data?.cocoTechnicianInShift}
                          rejectedActivityExists={data?.rejectedActivityExists}
                          caseAssignedCount={data?.caseAssignedCount || 0}
                        />
                      </div>
                    ))
                  ) : (
                    <EmptyComponent />
                  );
                })()}
              </div>
            </div>
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
                  {nearASPData?.data?.data?.dropProviders?.nearByProviders && (
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
                                opacity: dropStatusFilter === "busy" ? 1 : 0.7,
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
                          aspId={data?.id}
                          setAspId={setAspId}
                          onSendRequest={(e) =>
                            handleSendRequest(
                              e,
                              data.id,
                              data.isOwnPatrol,
                              data.ownPatrolVehicle
                            )
                          }
                          sendRequestLoading={
                            data.id == aspId ? isLoading : false
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
                          activityId={data?.activityId}
                          setActivityId={setActivityId}
                          setRejectVisible={setRejectVisible}
                          agentAssignedAt={
                            caseDetailData?.data?.data[0]
                              ?.agentAssignedAtInMilliSeconds
                          }
                          slaTime={
                            caseDetailData?.data?.data[0]?.extras?.slaSettings
                          }
                          mapLocation={{
                            aspLocation: {
                              lat: Number(data?.latitude),
                              lng: Number(data?.longitude),
                            },
                            pickupLocation: {
                              lat: Number(
                                nearASPData?.data?.data?.pickupProviders
                                  ?.pickupDealerPoints?.lat
                              ),
                              lng: Number(
                                nearASPData?.data?.data?.pickupProviders
                                  ?.pickupDealerPoints?.long
                              ),
                            },
                            dropLocation: {
                              lat: Number(
                                nearASPData?.data?.data?.dropProviders
                                  ?.dropDealerPoints?.lat
                              ),
                              lng: Number(
                                nearASPData?.data?.data?.dropProviders
                                  ?.dropDealerPoints?.long
                              ),
                            },
                          }}
                          disabled={{
                            sendRequest: handleSendRequestButton(data),
                            acceptReject:
                              sendRequestData?.data?.data?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityStatusId == 1 ||
                              sendRequestData?.data?.data?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityStatusId == 2
                                ? false
                                : true,
                          }}
                          approvalbtn={
                            sendRequestData?.data?.data?.find(
                              (activity) => activity?.aspId == data?.id
                            )?.activityStatusId == 2
                              ? true
                              : false
                          }
                          activityStatusId={
                            sendRequestData?.data?.data?.find(
                              (activity) => activity?.aspId == data?.id
                            )?.activityStatusId == 1
                              ? true
                              : false
                          }
                          cancelbtn={
                            [2, 3, 9, 10, 14].includes(
                              sendRequestData?.data?.data?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityStatusId
                            ) &&
                            [1, 2, 3, 4, 5].includes(
                              sendRequestData?.data?.data?.find(
                                (activity) => activity?.aspId == data?.id
                              )?.activityAppStatusId
                            )
                              ? true
                              : false
                          }
                          setCancelVisible={setCancelVisible}
                          aspRequestRefetch={aspRequestRefetch}
                          nearASPRefetch={nearASPRefetch}
                          g2gKM={data?.estimatedTotalKm ?? "--"}
                          available={data?.aspAvailable}
                          rsaCase={false}
                          isOwnPatrol={data?.isOwnPatrol}
                          aspMechanics={data?.aspMechanics}
                          cocoTechnicianInShift={data?.cocoTechnicianInShift}
                          rejectedActivityExists={data?.rejectedActivityExists}
                          caseAssignedCount={data?.caseAssignedCount || 0}
                        />
                      </div>
                    ))
                  ) : (
                    <EmptyComponent />
                  );
                })()}
              </div>
            </div>
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
                        // options={aspRejectionReasonData?.data?.data?.map(
                        //   ({ name, id }) => {
                        //     return {
                        //       label: name,
                        //       value: id,
                        //     };
                        //   }
                        // )}
                        options={aspRejectionReasonData?.data?.data}
                        optionValue="id"
                        optionLabel="name"
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
                <label className="form-label">Cancel Reason</label>
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
    </div>
  );
};

export default ServiceProvider;
