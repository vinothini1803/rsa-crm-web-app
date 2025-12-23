import React, { useEffect, useMemo, useRef, useState } from "react";
import ViewGrid from "../../components/common/ViewGrid";
import NoDataComponent from "../../components/common/NoDataComponent";
import { TabMenu } from "primereact/tabmenu";
import {
  ContactImage,
  DialogCloseSmallIcon,
  EditRequestIcon,
  InteractionImage,
  InteractionSidebarIcon,
  InteractionTimeLineIcon,
  MobileTimeLineIcon,
  NoAspImage,
  SystemTimeLineIcon,
  TowingCarIcon,
  ActivityRemainder,
  NotificationTimelineIcon,
} from "../../utills/imgConstants";
import TimerChip from "../../components/common/TimerChip";
import TabMenuItem from "../../components/common/TabMenuItem";
import { useNavigate, useParams } from "react-router";
import { TabPanel, TabView } from "primereact/tabview";
import ActivityTab from "./ActivityTab";
import { useMutation, useQueries, useQuery } from "react-query";
import moment from "moment/moment";
import ServiceViewTowingDialog from "./ServiceViewTowingDialog";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useSelector } from "react-redux";
import StatusBadge from "../../components/common/StatusBadge";
import { useDispatch } from "react-redux";
import { setInventoryDetails } from "../../../store/slices/inventorySlice";
import ViewInventory from "./AttachmentsTab";
import ServiceCostTab from "./ServiceCostTab";
import InventoryTab from "./InventoryTab";
import {
  chargesAttachments,
  getAspActivityStatuses,
  getLiveLocation,
  getLorryReceiptDetail,
  updateAspActivityStatus,
  updateCaseClose,
  updateDeliveryRequestPickupDateAndTime,
} from "../../../services/deliveryRequestViewService";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import AttachmentsTab from "./AttachmentsTab";
import { attachments } from "../../../services/inventoryViewService";
import { Controller, useForm } from "react-hook-form";
import {
  aspCancelReason,
  vehicleModal,
  vehicleMakes,
  vehicleType,
  slaViolateReasons,
} from "../../../services/masterServices";
import { aspCancel } from "../../../services/assignServiceProvider";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import InterActionSidebar from "../../components/common/InterActionSidebar";
import { Skeleton } from "primereact/skeleton";
import { InputText } from "primereact/inputtext";
import {
  updateActivityVehicleNumber,
  updateCaseVehicleModel,
  updateCaseVehicleNumber,
  updateCaseVehicleType,
  updateCaseVinNumber,
  uploadDealerDocument,
  updateDealerDocumentComments,
} from "../../../services/deliveryRequestService";
import { clickToCall } from "../../../services/callService";
import UploadDocsDialog from "./UploadDocsDialog";
import DealerDocumentAttachmentsDialog from "../../components/common/DealerDocumentAttachmentsDialog";

import { jsPDF } from "jspdf/dist/jspdf.umd.min.js";
import html2canvas from "html2canvas";
import LorryReceiptPDF from "./LorryReceiptPDF";

const TimeLineIcons = {
  240: SystemTimeLineIcon,
  241: MobileTimeLineIcon,
  242: InteractionTimeLineIcon,
  243: ActivityRemainder,
  244: NotificationTimelineIcon,
};

const RequestInfoCard = ({
  setVisibleDialog,
  setCamVisible,
  setAttachmentDialogVisible,
  setActivityVisible,
  ticketInfo,
  serviceproviders,
  aspRefetch,
  requestId,
  caseDetailrefetch,
}) => {
  const [shouldGeneratePDF, setShouldGeneratePDF] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ticketInfoIndex, setTicketIndex] = useState(0);
  const [activeAccordians, setActiveAccordians] = useState([]);
  const [visible, setVisible] = useState(false);
  const [closecaseVisible, setClosecaseVisible] = useState(false);
  const [activityId, setActivityId] = useState();
  const [cancelVisible, setCancelVisible] = useState(false);
  const { userTypeId, role, entityId } = useSelector(CurrentUser);
  const user = useSelector(CurrentUser);
  const [editDateVisible, setEditDateVisible] = useState(false);
  const [editTimeVisible, setEditTimeVisible] = useState(false);
  const [vinNumberVisible, setVinNumberVisible] = useState(false);
  const [vehicleNumberVisible, setVehicleNumberVisible] = useState(false);
  const [vehicleTypeVisible, setVehicleTypeVisible] = useState(false);
  const [vehicleModelVisible, setVehicleModelVisible] = useState(false);
  const [isExceededSla, setIsExceededSla] = useState(null);
  const [serviceVehicleNumberVisible, setServiceVehicleNumberVisible] =
    useState(false);
  const [aspStatusVisible, setAspStatusVisible] = useState(false);
  const [showPrevIcon, setShowPrevIcon] = useState(false);
  const [dealerDocUploadDialogVisible, setDealerDocUploadDialogVisible] =
    useState(false);
  const [dealerAttachmentDialogVisible, setDealerAttachmentDialogVisible] =
    useState(false);
  const receiptRef = useRef();
  const { mutate, isLoading } = useMutation(
    updateDeliveryRequestPickupDateAndTime
  );
  //SLA violate Reasons dropdown

  const { data: reasons = [] } = useQuery(
    ["reasonList", role.id],
    () => slaViolateReasons({ apiType: "dropdown", roleId: role.id }),
    {
      enabled: aspStatusVisible,
    }
  );
  const { mutate: updateVehicleNumber, isLoading: vehicleNumberIsLoading } =
    useMutation(updateCaseVehicleNumber);
  const {
    mutate: updateServiceVehicleNumber,
    isLoading: vehicleServiceIsLoading,
  } = useMutation(updateActivityVehicleNumber);
  const { mutate: updateVinNumber, isLoading: vinNumberIsLoading } =
    useMutation(updateCaseVinNumber);
  const { mutate: updateVehicleType, isLoading: vehicleTypeIsLoading } =
    useMutation(updateCaseVehicleType);
  const { mutate: updateVechicleModel, isLoading: vehicleModelIsLoading } =
    useMutation(updateCaseVehicleModel);

  const { mutate: updateASPStatusMutate, isLoading: aspStatusLoading } =
    useMutation(updateAspActivityStatus);
  // console.log("ticketInfo", ticketInfo);
  const [aspDetails, setAspDetails] = useState();
  let minDate = new Date(moment(ticketInfo?.createdAt, "DD/MM/YYYY").format());
  // minDate.setDate(minDate.getDate() + 2);
  minDate.setHours(0, 0, 0, 0);
  // console.log("aspDetails", aspDetails);
  const dispatch = useDispatch();
  const { mutate: closeCaseMutate, isLoading: closeCaseLoading } =
    useMutation(updateCaseClose);

  const { caseId } = useParams();
  const navigate = useNavigate();
  const handleAssignASP = () => {
    navigate(`/delivery-request/${caseId}/service-provider`);
    setVisible(true);
  };
  // const { data: aspCancelReasons } = useQuery(["aspCancelReasons"], () =>
  //   aspCancelReason()
  // );
  const { data: aspCancelReasons } = useQuery(
    ["cancelReasons"],
    () => aspCancelReason({ apiType: "dropdown" }),
    {}
  );
  const { mutate: cancelASPMutate, isLoading: aspCancelIsLoading } =
    useMutation(aspCancel);

  const { data: aspStatusList, mutate: aspStatusMutate } = useMutation(
    getAspActivityStatuses
  );
  const { mutate: outboundCallMutate, isLoading: outboundCallLoading } =
    useMutation(clickToCall);
  const { mutate: receiptMutate, data: receiptData } = useMutation(
    getLorryReceiptDetail
  );
  const {
    data: uploadDealerDocumentData,
    mutate: uploadDealerDocumentMutate,
    isLoading: uploadDealerDocumentLoading,
  } = useMutation(uploadDealerDocument);
  const {
    mutate: updateDealerDocumentCommentsMutate,
    isLoading: dealerDocumentCommentsLoading,
  } = useMutation(updateDealerDocumentComments);
  const {
    handleSubmit: handleCancelSubmit,
    control: controlCancel,
    reset: cancelReset,
    formState: { errors: cancelErrors },
  } = useForm({});
  const {
    handleSubmit: handleDateSubmit,
    control: controlDate,
    reset: dateReset,
    formState: { errors: dateErrors },
  } = useForm({});
  const {
    handleSubmit: handleTimeSubmit,
    control: controlTime,
    reset: timeReset,
    formState: { errors: timeErrors },
  } = useForm({});
  const {
    handleSubmit: handleVinNumberSubmit,
    control: controlVin,
    reset: vinReset,
    formState: { errors: vinErrors },
  } = useForm({});
  const {
    handleSubmit: handleVehicleNumberSubmit,
    control: controlVehicleNumber,
    reset: vehicleNumberReset,
    formState: { errors: vehicleNumberErrors },
  } = useForm({});
  const {
    handleSubmit: handleVehicleTypeSubmit,
    control: controlVehicleType,
    reset: vehicleTypeReset,
    formState: { errors: vehicleTypeErrors },
  } = useForm({});
  const {
    handleSubmit: handleVehicleModelSubmit,
    control: controlVehicleModel,
    reset: vehicleModelReset,
    formState: { errors: vehicleModelErrors },
  } = useForm({});
  const {
    handleSubmit: handleServiceVehicleNumberSubmit,
    control: controlServiceVehicleNumber,
    reset: serviceVehicleNumberReset,
    setValue: setServiceVehicleNumber,
    formState: { errors: serviceVehicleNumberErrors },
  } = useForm({});

  const {
    handleSubmit: handleASPStatusSubmit,
    control: aspControl,
    reset: aspStatusReset,
    setValue: setASPStatus,
    watch,
    formState: { errors: aspErrors },
  } = useForm({});
  const aspActivityStatusId = watch("aspActivityStatusId");
  const dateTime = watch("dateTime");

  // Handle ASP Cancel
  const handleAspCancel = (values) => {
    // console.log("handleAspCancel", values);
    cancelASPMutate(
      {
        activityId: serviceproviders[activeIndex]?.activityId,
        ...values,
        logTypeId: 240,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setCancelVisible(false);
            cancelReset();
            aspRefetch[activeIndex]?.refetch();
            if (userTypeId == 141) {
              caseDetailrefetch();
            }
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
  // console.log("serviceproviders array", serviceproviders);
  // console.log(
  //   activeIndex,
  //   serviceproviders[activeIndex],
  //   "serviceproviders[activeIndex]"
  // );
  const handleDownloadLorry = (activityId) => {
    receiptMutate(
      { activityId: activityId },
      {
        onSuccess: () => {
          // Once data is ready, trigger PDF generation in useEffect
          setShouldGeneratePDF(true);
        },
      }
    );
  };
  const handleASPStatus = () => {
    aspStatusMutate(
      {
        activityId: serviceproviders[activeIndex]?.activityId,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            setAspStatusVisible(true);
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

  const handleAspStatusDialogClose = () => {
    setAspStatusVisible(false);
    aspStatusReset({
      aspActivityStatusId: "",
      dateTime: "",
    });
  };
  const handleASPStatusChange = (values) => {
    updateASPStatusMutate(
      {
        activityId: serviceproviders[activeIndex]?.activityId,
        aspActivityStatusId: values?.aspActivityStatusId,
        fromLogTypeId: 240,
        dateTime: values?.dateTime
          ? moment(values?.dateTime).format("YYYY-MM-DD HH:mm:ss")
          : "",
        ...(slaExceeded &&
          values?.aspActivityStatusId == 4 && {
            slaViolateReasonId: values.slaViolateReasonId.id,
          }),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            aspRefetch[activeIndex]?.refetch();
            caseDetailrefetch();
            handleAspStatusDialogClose();
            toast.success(res?.data?.message);
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

  const handleDealerDocuments = () => {
    if (serviceproviders[activeIndex]?.dealerAttachments?.length > 0) {
      setDealerAttachmentDialogVisible(true);
    } else {
      setDealerDocUploadDialogVisible(true);
    }
  };

  const handleDealerUploadDocuments = () => {
    setDealerAttachmentDialogVisible(false);
    setDealerDocUploadDialogVisible(true);
  };

  const handleDealerAttachments = (values) => {
    // console.log("AccidentalAttachments => ", values);
    let formData = new FormData();
    formData.append("attachmentTypeId", 612);
    formData.append("attachmentOfId", 102);
    formData.append("entityId", serviceproviders[activeIndex]?.activityId);
    values?.attachments
      ?.filter((file) => file?.id == undefined)
      ?.map((file) => {
        formData.append("files", file);
      });
    values?.attachments
      ?.filter((file) => file?.id !== undefined)
      ?.map((file) => {
        formData.append("attachmentIds[]", file?.id);
      });
    if (
      values?.attachments?.filter((file) => file?.id == undefined)?.length == 0
    ) {
      formData.append("isFileOptional", true);
    }
    uploadDealerDocumentMutate(formData, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setDealerDocUploadDialogVisible(false);
          caseDetailrefetch(); //CASE DETAIL API REFETCH
          aspRefetch[activeIndex]?.refetch(); // ACTIVITY DETAIL API REFETCH
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors?.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };

  const handleDealerDocumentComments = (values) => {
    // console.log("handleDealerDocumentComments => ", values);
    updateDealerDocumentCommentsMutate(
      {
        activityId: serviceproviders[activeIndex]?.activityId,
        dealerDocumentComments: values[`dealerDocumentComments_${activeIndex}`],
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setDealerAttachmentDialogVisible(false);
            caseDetailrefetch(); //CASE DETAIL API REFETCH
            aspRefetch[activeIndex]?.refetch(); // ACTIVITY DETAIL API REFETCH
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

  const dealerAttachmentsFooterContent = (
    <div className="d-flex justify-content-center">
      <Button
        className="btn-link underline"
        label="Upload Documents"
        link
        onClick={handleDealerUploadDocuments}
      />
    </div>
  );

  const ServiceProvider =
    serviceproviders?.length > 0
      ? serviceproviders?.map((asp, i) => {
          // console.log("asp", asp);
          return [
            {
              label: "Activity Status",
              badge: asp?.activityStatus,
              statusId: asp?.activityStatusId,
              statusType: "activityStatus",
              ...((userTypeId == 141 &&
                (ticketInfo?.caseStatusId == 1 ||
                  ticketInfo?.caseStatusId == 2) && //activity cancel---> Agent
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(
                  asp?.activityAppStatusId
                ) &&
                [2, 3, 9, 10, 14].includes(asp?.activityStatusId)) ||
              (userTypeId == 140 &&
                (ticketInfo?.caseStatusId == 1 ||
                  ticketInfo?.caseStatusId == 2) && //activity cancel---> Dealer
                [1, 2, 3].includes(asp?.activityAppStatusId) &&
                [2, 9, 10, 14].includes(asp?.activityStatusId))
                ? {
                    action: <span className="remove-text"> Cancel</span>,
                    actionClick: () => setCancelVisible(true),
                  }
                : {}),
            },
            // ...(userTypeId == 141 &&
            // [1, 2, 3, 4, 5].includes(asp?.activityAppStatusId) &&
            // [2, 3, 9, 10].includes(asp?.activityStatusId)
            //   ? [
            //       {
            //         label: "ASP Cancel",
            //         value: (
            //           <button
            //             className="btn-text-danger btn-link"
            //             onClick={() => {
            //               setCancelVisible(true);
            //             }}
            //           >
            //             Cancel
            //           </button>
            //         ),
            //       },
            //     ]
            //   : []),

            ...(asp?.activityStatusId == 4
              ? [
                  {
                    label: "Cancel Reason",
                    value: asp?.cancelReason,
                  },
                ]
              : []),

            ...(asp?.activityStatusId == 8
              ? [
                  {
                    label: "Rejection Reason",
                    value: asp?.rejectReason ?? "--",
                  },
                ]
              : []),
            {
              label: "ASP Activity Status",
              value: asp?.aspActivityStatus ?? "--",
              ...(userTypeId == 141 &&
                [3, 10, 14]?.includes(asp?.activityStatusId) &&
                [2, 3, 4, 5, 6, 7]?.includes(asp?.aspActivityStatusId) && {
                  action: "Change",
                  actionClick: handleASPStatus,
                }),
            },
            {
              label: "Finance Status ",
              value: asp?.financeStatus,
            },
            { label: "Workshop Name", value: asp?.asp?.workshopName ?? "--" },
            { label: "Delivery Agent Name", value: asp?.asp?.name ?? "--" },

            {
              label: "Service Provide Code",
              value: asp?.asp?.code ?? "--",
              vlaueClassName: "info-badge info-badge-purple",
            },
            {
              label: "Delivery Agent Contact",
              value: asp?.asp?.contactNumber ?? "--",
              vlaueClassName: "info-badge info-badge-yellow",
              btnLink: "Call",
              //actionClick: "",
              btnLinkAction: () => handleOutBoundCall(asp?.asp?.contactNumber),
            },

            {
              label: "Vehicle Number",
              value: asp?.aspVehicleRegistrationNumber ?? "--",
              ...(userTypeId == 141 &&
                !asp?.asp?.isOwnPatrol &&
                ticketInfo?.agentId &&
                ![3, 4].includes(ticketInfo?.caseStatusId) &&
                ![3, 4, 7, 8, 11, 12].includes(
                  serviceproviders[activeIndex]?.["activityStatusId"]
                ) && {
                  // ) //   [3, 4, 7, 8, 11, 12].includes(provider.activityStatusId) // !serviceproviders[activeIndex]['activityStatusId']?.some(provider =>
                  action: "Edit",
                  actionClick: () => setServiceVehicleNumberVisible(true),
                }),
            },
            ...(asp?.aspMechanic
              ? [
                  {
                    label: "Driver Name",
                    value: asp?.aspMechanic?.name,
                  },
                  {
                    label: "Driver Contact",
                    value: asp?.aspMechanic?.contactNumber,
                    vlaueClassName: "info-badge info-badge-yellow",
                    // action: "Call",
                    // actionClick: "",
                  },
                ]
              : []),
            ...(asp?.showLorryReceiptDownloadButton
              ? [
                  {
                    label: "Lorry Receipt",
                    value: (
                      <button
                        className="btn-text btn-link"
                        onClick={() => handleDownloadLorry(asp?.activityId)}
                      >
                        Download
                      </button>
                    ),
                  },
                ]
              : []),
            ...(asp?.hasTrackingLink
              ? [
                  {
                    label: "ASP Live Tracking",
                    value: (
                      <button
                        className="btn-text btn-link"
                        onClick={() => {
                          setActivityId(asp?.activityId);
                          setAspDetails({
                            activityId: asp?.activityId,
                            aspId: asp?.asp?.id,
                            aspName: asp?.asp?.name,
                            pickupDealer: {
                              lat: asp?.caseDetail?.pickupDealer?.lat,
                              long: asp?.caseDetail?.pickupDealer?.long,
                              location:
                                asp?.caseDetail?.pickupDealer
                                  ?.correspondenceAddress,
                            },
                            dropDealer: {
                              lat: asp?.caseDetail?.dropDealer?.lat,
                              long: asp?.caseDetail?.dropDealer?.long,
                              location:
                                asp?.caseDetail?.dropDealer
                                  ?.correspondenceAddress,
                            },
                            asp: {
                              lat: asp?.asp?.latitude,
                              long: asp?.asp?.longitude,
                              location: asp?.asp?.addressLineOne,
                            },
                          });
                          setVisible(true);
                        }}
                      >
                        View
                      </button>
                    ),
                  },
                ]
              : []),
            ...(userTypeId == 140 &&
            (ticketInfo?.caseStatusId == 2 ||
              (asp?.dealerAttachments?.length > 0 &&
                (ticketInfo?.caseStatusId == 3 ||
                  ticketInfo?.caseStatusId == 4))) &&
            (asp?.activityStatusId == 3 ||
              asp?.activityStatusId == 7 ||
              asp?.activityStatusId == 10 ||
              asp?.activityStatusId == 11 ||
              asp?.activityStatusId == 12 ||
              (asp?.dealerAttachments?.length > 0 &&
                (asp?.activityStatusId == 4 || asp?.activityStatusId == 8))) &&
            asp?.transactions?.find(
              (transactions) =>
                transactions?.paymentTypeId == 170 &&
                transactions?.paymentStatusId == 191
            )
              ? [
                  {
                    label: "Dealer Documents",
                    value: (
                      <button
                        className="btn-text btn-link"
                        onClick={handleDealerDocuments}
                      >
                        {asp?.dealerAttachments?.length > 0 ? "View" : "Upload"}
                      </button>
                    ),
                  },
                ]
              : []),
            ...((role?.id == 31 || userTypeId == 141) &&
            asp?.dealerAttachments?.length > 0 &&
            asp?.transactions?.find(
              (transactions) =>
                transactions?.paymentTypeId == 170 &&
                transactions?.paymentStatusId == 191
            )
              ? [
                  {
                    label: "Dealer Documents",
                    value: (
                      <button
                        className="btn-text btn-link"
                        onClick={handleDealerDocuments}
                      >
                        View
                      </button>
                    ),
                  },
                ]
              : []),
            {
              label: "Live Dash cam",
              value: (
                <button
                  className="btn-text btn-link"
                  onClick={() => setCamVisible(!true)}
                  disabled
                >
                  Live View
                </button>
              ),
            },

            // {
            //   label: "Inventory",
            //   value: (
            //     <div
            //       className="request-blue_text"
            //       onClick={() => {
            //         navigate(
            //           `/delivery-request/${asp?.activityId}/inventory-view`
            //         );
            //         dispatch(
            //           setInventoryDetails({
            //             requestId: requestId,
            //             caseId: caseId,
            //           })
            //         );
            //       }}
            //     >
            //       Live View
            //     </div>
            //   ),
            //
            // },
            // {
            //   label: "Inventory",
            //   value: (
            //     <div
            //       className="request-blue_text"
            //       onClick={() => {
            //         navigate(
            //           `/delivery-request/${asp?.activityId}/inventory-view`
            //         );
            //         dispatch(
            //           setInventoryDetails({
            //             requestId: requestId,
            //             caseId: caseId,
            //           })
            //         );
            //       }}
            //     >
            //       Live View
            //     </div>
            //   ),
            //
            // },
            // {
            //   label: "Dealer Approval Status",
            //   badge: asp?.dealerApprovalStatus,
            //   statusId: asp?.dealerApprovalStatusId,
            //
            // },
          ];
        })
      : [];
  // console.log(
  //   "serviceproviders[activeIndex]?.activityId",
  //   serviceproviders[activeIndex]?.activityId
  // );
  // console.log(
  //   "serviceproviders[activeIndex] ***",
  //   serviceproviders[activeIndex]
  // );
  const { data } = useQuery(
    ["Attachments", serviceproviders[activeIndex]?.activityId],
    () =>
      attachments({
        entityId: serviceproviders[activeIndex]?.activityId,
        attachmentOfId: 102,
      }),
    {
      enabled: serviceproviders[activeIndex]?.activityId ? true : false,
    }
  );

  const { data: chargeAttachments } = useQuery(
    ["chargeAttachments", serviceproviders[activeIndex]?.activityId],
    () =>
      chargesAttachments({
        activityId: serviceproviders[activeIndex]?.activityId,
      })
  );

  // console.log("Attachments Data", data);
  const handleCloseCase = () => {
    // console.log("case closed");
    setClosecaseVisible(true);
  };
  const handleConfirmCloseCase = () => {
    closeCaseMutate(
      {
        caseDetailId: ticketInfo?.caseDetailId,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setClosecaseVisible(false);
            caseDetailrefetch();

            aspRefetch[activeIndex]?.refetch();
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

  const handleUpdateVehicleNumber = (data) => {
    updateVehicleNumber(
      {
        caseDetailId: ticketInfo?.caseDetailId,
        vehicleRegistrationNumber: data.registrationNumber,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVehicleNumberVisible(false);
            caseDetailrefetch();

            aspRefetch[activeIndex]?.refetch();
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

  const handleUpdateVinNumber = (data) => {
    updateVinNumber(
      {
        caseDetailId: ticketInfo?.caseDetailId,
        vin: data.vin,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVinNumberVisible(false);
            caseDetailrefetch();

            aspRefetch[activeIndex]?.refetch();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
        onError: () => {
          toast.error("something went wrong");
        },
      }
    );
  };

  const handleUpdateVehicleType = (data) => {
    updateVehicleType(
      {
        caseDetailId: ticketInfo?.caseDetailId,
        vehicleTypeId: data?.vehicleType?.id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVehicleTypeVisible(false);
            caseDetailrefetch();

            aspRefetch[activeIndex]?.refetch();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
        onError: () => {
          toast.error("something went wrong");
        },
      }
    );
  };

  const handleUpdateVehicleModel = (data) => {
    updateVechicleModel(
      {
        caseDetailId: ticketInfo?.caseDetailId,
        vehicleModelId: data?.vehicleModel?.id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVehicleModelVisible(false);
            caseDetailrefetch();

            aspRefetch[activeIndex]?.refetch();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
        onError: () => {
          toast.error("something went wrong");
        },
      }
    );
  };

  const handleUpdateServiceVehicleNumber = (data) => {
    updateServiceVehicleNumber(
      {
        activityId: serviceproviders[activeIndex]?.activityId,
        vehicleNumber: data.serviceregistrationNumber,
        aspId: serviceproviders[activeIndex]?.asp?.id,
        logTypeId: 240,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setServiceVehicleNumberVisible(false);
            caseDetailrefetch();
            aspRefetch[activeIndex]?.refetch();
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

  const [vehicleTypeListData, vehicleMakesListData, vehicleModalListData] =
    useQueries([
      {
        queryKey: ["vehicleType"],
        queryFn: () =>
          vehicleType({
            apiType: "dropdown",
          }),
      },
      {
        queryKey: ["vehicleMakes"],
        queryFn: () => vehicleMakes({ apiType: "dropdown" }),
      },
      {
        queryKey: ["vehicleModal", ticketInfo?.vehicleMakeId],
        queryFn: () =>
          vehicleModal({
            vehicleMakeId: ticketInfo?.vehicleMakeId,
            apiType: "dropdown",
          }),
        enabled:
          ticketInfo?.vehicleMakeId !== "" &&
          ticketInfo?.vehicleMakeId !== undefined
            ? true
            : false,
      },
    ]);

  const vehicleTypeList = useMemo(
    () => vehicleTypeListData?.data?.data?.data,
    [vehicleTypeListData]
  );

  const vehicleModelList = useMemo(
    () => vehicleModalListData?.data?.data?.data,
    [vehicleModalListData]
  );

  const TicketInfo = [
    {
      label: "Account",
      value: ticketInfo?.client,
      vlaueClassName: "info-badge info-badge-blue",
    },
    {
      label: "Vehicle Number",
      value: ticketInfo?.registrationNumber ?? "--",
      ...(userTypeId == 141 &&
        ticketInfo?.agentId &&
        ![3, 4].includes(ticketInfo?.caseStatusId) &&
        !ticketInfo?.activityDetails?.some((activity) =>
          [3, 7, 11, 12].includes(activity.activityStatusId)
        ) && {
          action: "Edit",
          actionClick: () => setVehicleNumberVisible(true),
        }),
    },
    ...(ticketInfo?.deliveryRequestDropDealer && ticketInfo?.dealer
      ? [
          {
            label: "Drop Dealer",
            value: ticketInfo?.deliveryRequestDropDealer,
            //value: ticketInfo?.,
          },
          {
            label: "Pickup Dealer",
            value: ticketInfo?.dealer,
            //value: ticketInfo?.,
          },
        ]
      : []),
    {
      label: "VIN Number",
      value: ticketInfo?.vin,
      ...(userTypeId == 141 &&
        ticketInfo?.agentId &&
        ![3, 4].includes(ticketInfo?.caseStatusId) &&
        !ticketInfo?.activityDetails?.some((activity) =>
          [3, 7, 11, 12].includes(activity.activityStatusId)
        ) && {
          action: "Edit",
          actionClick: () => setVinNumberVisible(true),
        }),
    },
    {
      label: "Vehicle Type",
      value: ticketInfo?.vehicleType,
      ...(userTypeId == 141 &&
        ticketInfo?.agentId &&
        ![3, 4].includes(ticketInfo?.caseStatusId) &&
        !ticketInfo?.activityDetails?.some((activity) =>
          [3, 7, 11, 12].includes(activity.activityStatusId)
        ) && {
          action: "Edit",
          actionClick: () => setVehicleTypeVisible(true),
        }),
    },
    {
      label: "Vehicle Make",
      value: ticketInfo?.vehicleMake,
    },
    {
      label: "Vehicle Model",
      value: ticketInfo?.vehicleModel,
      ...(userTypeId == 141 &&
        ticketInfo?.agentId &&
        ![3, 4].includes(ticketInfo?.caseStatusId) &&
        !ticketInfo?.activityDetails?.some((activity) =>
          [3, 7, 11, 12].includes(activity.activityStatusId)
        ) && {
          action: "Edit",
          actionClick: () => setVehicleModelVisible(true),
        }),
    },
    // {
    //   label: "Vehicle Value",
    //   value: ticketInfo.approximateVehicleValue
    //     ? "₹ " + ticketInfo.approximateVehicleValue
    //     : "--",
    // },
    { label: "Subject", value: ticketInfo?.caseSubject ?? "--" },
    { label: "Sub Service", value: ticketInfo?.subService },
    { label: "Scheme", value: ticketInfo?.scheme },
    ...(ticketInfo?.locationType
      ? [{ label: "Location Type", value: ticketInfo?.locationType }]
      : []),
    {
      label: "Status",
      badge: ticketInfo?.caseStatus,
      ...(userTypeId == 141 &&
        ticketInfo?.agentId &&
        ticketInfo?.caseStatusId !== 4 &&
        ticketInfo?.caseStatusId !== 3 &&
        !ticketInfo?.activityDetails?.some((activity) =>
          [2, 3, 9, 10, 11, 13, 14].includes(activity.activityStatusId)
        ) && {
          action: "Close Case",
          actionClick: handleCloseCase,
        }),
      statusId: ticketInfo?.caseStatusId,
      statusType: "caserequestStatus",
    },
    {
      label: "Pickup Date",
      value: `${ticketInfo?.deliveryRequestPickupDate ?? "--"}`,
      vlaueClassName: "info-badge info-badge-purple",
      ...(userTypeId == 141 &&
        ticketInfo?.agentId &&
        ![3, 4].includes(ticketInfo?.caseStatusId) &&
        !ticketInfo?.activityDetails?.some((activity) =>
          [3, 7, 11, 12].includes(activity.activityStatusId)
        ) && {
          action: "Edit",
          actionClick: () => setEditDateVisible(true),
        }),
    },
    {
      label: "Pickup Time",
      value: ticketInfo?.deliveryRequestPickupTime ?? "--",
      vlaueClassName: "info-badge info-badge-purple",
      ...(userTypeId == 141 &&
        ticketInfo?.agentId &&
        ![3, 4].includes(ticketInfo?.caseStatusId) &&
        !ticketInfo?.activityDetails?.some((activity) =>
          [3, 7, 11, 12].includes(activity.activityStatusId)
        ) && {
          action: "Edit",
          actionClick: () => setEditTimeVisible(true),
        }),
    },
    {
      label: "Pickup Location",
      value: (
        <>
          {`${
            ticketInfo?.deliveryRequestPickUpLocation.charAt(0).toUpperCase() +
            ticketInfo?.deliveryRequestPickUpLocation.slice(1)
          },
            ${
              ticketInfo?.deliveryRequestPickUpCity.charAt(0) +
              ticketInfo?.deliveryRequestPickUpCity.slice(1).toLowerCase()
            },
            ${
              ticketInfo?.deliveryRequestPickUpState.charAt(0) +
              ticketInfo?.deliveryRequestPickUpState.slice(1).toLowerCase()
            }`}{" "}
        </>
      ),
      // action: 'View All'
    },
    {
      label: "Drop Location",
      value: (
        <div>
          {`${ticketInfo?.deliveryRequestDropLocation},
            ${ticketInfo?.deliveryRequestDropCity},
            ${ticketInfo?.deliveryRequestDropState}`}{" "}
          {/* <span className="request-blue_text">View All</span> */}
        </div>
      ),
    },
    {
      label: "Contact name at Pickup",
      value:
        ticketInfo?.contactNameAtPickUp.charAt(0).toUpperCase() +
        ticketInfo?.contactNameAtPickUp.slice(1),
    },
    {
      label: "Contact Number at Pickup",
      value: ticketInfo?.contactNumberAtPickUp,
      vlaueClassName: "info-badge info-badge-yellow",
      btnLink: "Call",
      btnLinkAction: () =>
        handleOutBoundCall(ticketInfo?.contactNumberAtPickUp),
    },
    {
      label: "Contact name at Drop",
      value:
        ticketInfo?.contactNameAtDrop.charAt(0).toUpperCase() +
        ticketInfo?.contactNameAtDrop.slice(1),
    },
    {
      label: "Contact Number at Drop",
      value: ticketInfo?.contactNumberAtDrop,
      vlaueClassName: "info-badge info-badge-yellow",
      btnLink: "Call",
      btnLinkAction: () => handleOutBoundCall(ticketInfo?.contactNumberAtDrop),
    },
    ...(ticketInfo?.hasDocuments
      ? [
          {
            label: "Documents",
            action: "View Documents",
            actionClick: () => setAttachmentDialogVisible(true),
          },
        ]
      : []),
  ];
  // console.log(
  //   "ServiceProvider",
  //   ServiceProvider,
  //   serviceproviders[activeIndex]
  // );
  const tabItems = ServiceProvider?.map((e, index) => {
    return {
      label: <TabMenuItem label={`Service Provider - ${index + 1}`} />,
    };
  });
  const TicketInfoTab = [
    { label: <TabMenuItem label="Ticket Info" /> },

    ...(ticketInfo?.activityDetails?.length > 0
      ? [
          {
            label: <TabMenuItem label="Service Cost" />,
          },

          {
            label: <TabMenuItem label="Attachments" />,
          },
          {
            label: <TabMenuItem label="Inventory" />,
          },
          {
            label: <TabMenuItem label="Activity" />,
          },
        ]
      : []),
  ];

  const TimeRangeOptions = [
    {
      name: "12AM - 2AM",
    },
    {
      name: "2AM - 4AM",
    },
    {
      name: "4AM - 6AM",
    },
    {
      name: "6AM - 8AM",
    },
    {
      name: "8AM - 10AM",
    },
    {
      name: "10AM - 12PM",
    },
    {
      name: "12PM - 2PM",
    },
    {
      name: "2PM - 4PM",
    },
    {
      name: "4PM - 6PM",
    },
    {
      name: "6PM - 8PM",
    },
    {
      name: "8PM - 10PM",
    },
    {
      name: "10PM - 12AM",
    },
  ];
  const handlePickupTimeSubmit = ({ deliveryRequestPickupTime: { name } }) => {
    mutate(
      {
        caseDetailId: caseId,
        deliveryRequestPickupDate: moment(
          ticketInfo?.deliveryRequestPickupDate,
          "DD/MM/YYYY"
        ).format("YYYY-MM-DD"),
        deliveryRequestPickupTime: name,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success("The pickup time updated successfully", {
              autoClose: 1000,
            });
            caseDetailrefetch();
            setEditTimeVisible(false);
            timeReset();
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
  const handlePickupDateSubmit = ({ deliveryRequestPickupDate }) => {
    mutate(
      {
        caseDetailId: caseId,
        deliveryRequestPickupDate: moment(deliveryRequestPickupDate).format(
          "YYYY-MM-DD"
        ),
        deliveryRequestPickupTime: ticketInfo?.deliveryRequestPickupTime,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success("The pickup date updated successfully", {
              autoClose: 1000,
            });
            caseDetailrefetch();
            setEditDateVisible(false);
            dateReset();
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
  // console.log(
  //   "advance pay",
  //   serviceproviders,
  //   serviceproviders
  //     ?.find((activity) =>
  //       activity?.transactions?.some(
  //         (transactions) =>
  //           transactions?.paymentTypeId == 170 &&
  //           transactions?.paymentStatusId == 191
  //       )
  //     )
  //     ?.transactions?.find(
  //       (transactions) =>
  //         transactions?.paymentTypeId == 170 &&
  //         transactions?.paymentStatusId == 191
  //     )?.paidByDealerId == entityId
  // );

  useEffect(() => {
    setServiceVehicleNumber(
      serviceproviders[activeIndex]?.aspVehicleRegistrationNumber
    );
  }, [activeIndex, serviceproviders]);

  const handleOutBoundCall = (value) => {
    // console.log("value", value);
    outboundCallMutate(
      {
        agentId: user?.userName,
        campaignName: ticketInfo?.dialerCampaignName,
        customerNumber: value,
        caseDetailId: ticketInfo?.caseDetailId?.toString(),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast?.success(res?.data?.message);
          } else {
            toast?.error(res?.data?.error);
          }
        },
      }
    );
  };

  const isSlaExceeded = () => {
    const deliveryRequestPickupDate = ticketInfo?.deliveryRequestPickupDate;
    const deliveryRequestPickupTime = ticketInfo?.deliveryRequestPickupTime;

    const endTime = deliveryRequestPickupTime?.split(" - ")[1];

    // Combine the date and time into a single string
    const pickupDateTimeString = `${deliveryRequestPickupDate} ${endTime}`;

    // Parse the pickup date-time
    const pickupDateTime = moment(pickupDateTimeString, "DD/MM/YYYY hA");

    // Normalize by resetting seconds and milliseconds
    const normalizedPickupDateTime = pickupDateTime.seconds(0).milliseconds(0);
    // console.log("pickupDateTime", normalizedPickupDateTime.format());

    // Your selected date and time
    const selectedDateTime = moment(dateTime, "ddd MMM DD YYYY HH:mm:ss ZZ");

    // Normalize selectedDateTime as well
    const normalizedSelectedDateTime = selectedDateTime
      .seconds(0)
      .milliseconds(0);
    // console.log("selectedDateTime", normalizedSelectedDateTime.format());

    // Compare the two normalized date-times
    return normalizedSelectedDateTime > normalizedPickupDateTime;
  };
  const slaExceeded = isSlaExceeded();

  // Wait until the component is updated with new receiptData and the DOM is rendered
  useEffect(() => {
    if (shouldGeneratePDF && receiptData?.data?.data?.[0]) {
      const generatePDF = async () => {
        const input = receiptRef.current;
        if (!input) {
          console.error("Receipt ref is null");
          return;
        }

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${receiptData?.data?.data?.[0]?.vin}.pdf`);

        setShouldGeneratePDF(false); // Reset after generating
      };

      generatePDF();
    }
  }, [shouldGeneratePDF, receiptData]);
  return (
    <div className="request-info-body">
      <div>
        {ServiceProvider?.length <= 1 ? (
          <div className="request-info-title">Service Provider</div>
        ) : (
          <div className="asp-tab-header">
            <div className="request-info-title">Service Provider</div>
            <TabMenu
              model={tabItems}
              activeIndex={activeIndex}
              onTabChange={(e) => {
                setActiveIndex(e.index);
                aspRefetch[e.index]?.refetch();
                serviceVehicleNumberReset();
              }}
              className="spearate-tab-menu min-67"
            />
          </div>
        )}
        <div className="border-box bg-white border-transparent">
          {ServiceProvider?.length > 0 ? (
            <ViewGrid
              items={ServiceProvider[activeIndex]}
              className="grid-4"
              //loading={aspRefetch[activeIndex]?.isFetching}
            />
          ) : (
            <NoDataComponent
              image={TowingCarIcon}
              text={"No Service Provider Assigned"}
              addbtn={
                userTypeId == 141 &&
                ticketInfo?.caseStatusId !== 3 &&
                ticketInfo?.caseStatusId !== 4
                  ? true
                  : false
              }
              btntext={"Assign Service Provider"}
              disablebtn={ticketInfo?.agentId ? false : true}
              onClick={handleAssignASP}
            />
          )}
        </div>
      </div>
      {visible && (
        <ServiceViewTowingDialog
          visible={visible}
          setVisible={setVisible}
          activityId={activityId}
          locationDetails={{
            pickupDealer: aspDetails?.pickupDealer,
            dropDealer: aspDetails?.dropDealer,
            asp: aspDetails?.asp,
          }}
          aspName={aspDetails?.aspName}
          aspId={aspDetails?.aspId}
        />
      )}

      <div className="mt-3 d-flex flex-column flex-shrink-1 flex-grow-1">
        <TabMenu
          model={TicketInfoTab}
          activeIndex={ticketInfoIndex}
          onTabChange={(e) => {
            setTicketIndex(e.index);
            caseDetailrefetch();
          }}
          className="spearate-tab-menu"
        />
        <div className="mt-2 flex-shrink-1 flex-grow-1">
          <TabView
            className={`tab-header-hidden case-view-tab ${"border-box border-transparent"} ${
              ticketInfoIndex !== 4 ? "bg-white" : "bg-transparent"
            }  deleivery-detailstab`}
            activeIndex={ticketInfoIndex}
            onTabChange={(e) => setTicketIndex(e.index)}
          >
            <TabPanel key={`Tab1`}>
              <ViewGrid items={TicketInfo} className="grid-3" />
            </TabPanel>
            <TabPanel key={`Tab2-${activeIndex}`}>
              <ServiceCostTab
                activityDetail={serviceproviders[activeIndex]}
                aspRefetch={aspRefetch[activeIndex]}
                caseStatusId={ticketInfo?.caseStatusId}
                advancePay={
                  serviceproviders?.some((activity) =>
                    activity?.transactions?.some(
                      (transactions) =>
                        transactions?.paymentTypeId == 170 &&
                        transactions?.paymentStatusId == 191
                    )
                  )
                    ? serviceproviders
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
            </TabPanel>

            <TabPanel key={`Tab3-${activeIndex}`}>
              {/* key prop changes, React will treat it as a completely new component and re-render it. at serviceprovider tab change*/}
              <AttachmentsTab
                locationTypeId={
                  serviceproviders[activeIndex]?.caseDetail?.locationTypeId
                }
                data={[
                  ...(data?.data?.success ? data?.data?.data : []),
                  ...(chargeAttachments?.data?.success
                    ? chargeAttachments?.data?.data
                    : []),
                ].flat()}
              />
            </TabPanel>
            <TabPanel key={`Tab-4${activeIndex}`}>
              {/* key prop changes, React will treat it as a completely new component and re-render it. at serviceprovider tab change*/}
              <InventoryTab
                inventoryDetails={
                  serviceproviders[activeIndex]?.inventoryDetail
                }
                data={data?.data?.data?.filter((attachment) =>
                  [62, 79].includes(attachment?.attachmentTypeId)
                )}
              />
            </TabPanel>
            <TabPanel className="bg-transparent">
              <ActivityTab
                events={serviceproviders[activeIndex]?.activityLogs
                  ?.filter(
                    (log) =>
                      !(
                        (role.id === 2 || role.id === 31) &&
                        log?.typeId === 242
                      )
                  )
                  ?.map((log) => {
                    return {
                      icon: TimeLineIcons[log?.typeId],
                      title: (
                        <>
                          {log?.title}
                          <div className="timeline-content">
                            {log?.description}
                          </div>
                          {log?.typeId == 242 && (
                            <div className="interaction-content">
                              <div className="interaction-details-container">
                                <div className="interaction-detail-title">
                                  Channel
                                </div>
                                <div className="interaction-detail-info">
                                  {log?.channel}
                                </div>
                              </div>
                              <div className="interaction-details-container">
                                <div className="interaction-detail-title">
                                  Call Type
                                </div>
                                <div className="interaction-detail-info">
                                  {log?.callType}
                                </div>
                              </div>
                              <div className="interaction-details-container">
                                <div className="interaction-detail-title">
                                  InteractionTo
                                </div>
                                <div className="interaction-detail-info">
                                  {log?.interactionTo}
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="timeline-date">{log?.createdAt}</div>
                        </>
                      ),
                      content: <></>,
                    };
                  })}
                activeAccordians={activeAccordians}
                setActiveAccordians={setActiveAccordians}
                disabled={true}
                activityId={serviceproviders[activeIndex]?.activityId}
                aspRefetch={aspRefetch[activeIndex]}
                caseStatusId={ticketInfo?.caseStatusId}
              />
            </TabPanel>
          </TabView>
        </div>
        {receiptData?.data?.data?.[0] && shouldGeneratePDF && (
          <LorryReceiptPDF
            data={receiptData?.data?.data?.[0]}
            receiptRef={receiptRef}
          />
        )}
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Close Case</div>
          </div>
        }
        visible={closecaseVisible}
        position={"bottom"}
        onHide={() => setClosecaseVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <div className="confirm-title">
          Are you sure you want to close case?{" "}
        </div>
        <div className="d-flex gap mt-3_4">
          <Button
            className="btn btn-white ms-auto"
            onClick={() => setClosecaseVisible(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn-danger"
            onClick={handleConfirmCloseCase}
            loading={closeCaseLoading}
          >
            Close Case
          </Button>
        </div>
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
                serviceproviders[activeIndex]?.activityStatusId
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
                            options={serviceproviders[
                              activeIndex
                            ]?.extras?.activityFinanceStatuses?.map(
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
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Change Pickup Date</div>
          </div>
        }
        visible={editDateVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setEditDateVisible(false);
          dateReset();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleDateSubmit(handlePickupDateSubmit)}>
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Pickup Date</label>
                <Controller
                  name="deliveryRequestPickupDate"
                  control={controlDate}
                  rules={{ required: "Pickup Date is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Calendar
                        id="dateRange"
                        value={field.value}
                        hourFormat="24"
                        dateFormat="dd-mm-yy"
                        {...field}
                        placeholder="Select Pickup Date"
                        showIcon
                        iconPos={"left"}
                        readOnlyInput
                        minDate={minDate}
                        dateTemplate={(date) => {
                          if (date.selectable) {
                            if (date?.year > minDate.getFullYear()) {
                              setShowPrevIcon(true);
                              // console.log(
                              //   "Selectable Year True",
                              //   minDate,
                              //   date?.month,
                              //   minDate.getMonth(),
                              //   showPrevIcon
                              // );
                            } else {
                              if (date?.month > minDate.getMonth()) {
                                setShowPrevIcon(true);
                                // console.log(
                                //   "Selectable Month True",
                                //   minDate,
                                //   date?.month,
                                //   minDate.getMonth(),
                                //   showPrevIcon
                                // );
                              } else {
                                setShowPrevIcon(false);
                                // console.log(
                                //   "Selectable Month False",
                                //   minDate,
                                //   date?.month,
                                //   minDate.getMonth(),
                                //   showPrevIcon
                                // );
                              }
                            }
                          } else {
                            /* if (date?.year == minDate.getFullYear()) {
                              setShowPrevIcon(false);
                              console.log('Selectable Year False', minDate, date?.month, minDate.getMonth(), showPrevIcon);
                            } */
                          }
                          return date.day;
                        }}
                        pt={{
                          previousButton: {
                            className: showPrevIcon ? "" : "hidden",
                          },
                        }}
                      />
                      <div className="p-error">
                        {dateErrors[field.name]?.message}
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
            loading={isLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Change Pickup Time</div>
          </div>
        }
        visible={editTimeVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setEditTimeVisible(false);
          timeReset();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleTimeSubmit(handlePickupTimeSubmit)}>
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Pickup Time</label>
                <Controller
                  name="deliveryRequestPickupTime"
                  control={controlTime}
                  rules={{ required: "Pickup Time is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Pickup Time"
                        className="form-control-select"
                        options={TimeRangeOptions}
                        optionLabel="name"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {timeErrors[field.name]?.message}
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
            loading={isLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Change VIN Number</div>
          </div>
        }
        visible={vinNumberVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setVinNumberVisible(false);
          vinReset();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleVinNumberSubmit(handleUpdateVinNumber)}>
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">VIN Number</label>
                <Controller
                  name="vin"
                  control={controlVin}
                  defaultValue={ticketInfo?.vin}
                  rules={{
                    required: "VIN Number is required.",
                    validate: (value) => {
                      return (
                        value?.length === 17 ||
                        "VIN Number must be exactly 17 characters long."
                      );
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        className={`form-control`}
                        placeholder="Enter VIN Number"
                        maxLength={17}
                      />
                      <div className="p-error">
                        {vinErrors[field.name]?.message}
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
            loading={vinNumberIsLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Change Vehicle Number</div>
          </div>
        }
        visible={vehicleNumberVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setVehicleNumberVisible(false);
          vehicleNumberReset();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleVehicleNumberSubmit(handleUpdateVehicleNumber)}>
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <Controller
                  name="registrationNumber"
                  control={controlVehicleNumber}
                  defaultValue={ticketInfo?.registrationNumber}
                  rules={{
                    required: "Vehicle Number is Required",
                    /*  validate: {
                      matchPattern: (v) => {
                        if (v?.length > 0) {
                          return (
                            /^[AP|AR|AS|BR|GA|GJ|HR|HP|JH|KA|KL|MP|MH|MN|ML|MZ|NL|OD|PB|RJ|SK|TN|TS|TR|UP|UK|WB]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(
                              v
                            ) || "Please enter a valid Vehicle Number"
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }, */
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        value={field?.value?.toUpperCase()}
                        keyfilter={"alphanum"}
                        className={`form-control`}
                        placeholder="Enter Vehicle Number"
                        maxLength={10}
                      />
                      <div className="p-error">
                        {vehicleNumberErrors[field.name]?.message}
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
            loading={vehicleNumberIsLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Change Vehicle Type</div>
          </div>
        }
        visible={vehicleTypeVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setVehicleTypeVisible(false);
          vehicleTypeReset();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleVehicleTypeSubmit(handleUpdateVehicleType)}>
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <Controller
                  name="vehicleType"
                  control={controlVehicleType}
                  rules={{ required: "Vehicle Type is required." }}
                  defaultValue={
                    vehicleTypeList?.find(
                      (type) => type?.name === ticketInfo?.vehicleType
                    ) || null
                  }
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        placeholder="Select Vehicle Type"
                        className="form-control-select"
                        options={vehicleTypeList}
                        optionLabel="name"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {vehicleTypeErrors[field.name]?.message}
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
            loading={vehicleTypeIsLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Change Vehicle Model</div>
          </div>
        }
        visible={vehicleModelVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setVehicleModelVisible(false);
          vehicleModelReset();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleVehicleModelSubmit(handleUpdateVehicleModel)}>
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Vehicle Model</label>
                <Controller
                  name="vehicleModel"
                  control={controlVehicleModel}
                  rules={{ required: "Vehicle Make is required." }}
                  defaultValue={
                    vehicleModelList?.find(
                      (type) => type?.name === ticketInfo?.vehicleModel
                    ) || null
                  }
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        placeholder="Select Vehicle Model"
                        className="form-control-select"
                        options={vehicleModelList}
                        optionLabel="name"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {vehicleModelErrors[field.name]?.message}
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
            loading={vehicleModelIsLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Change Vehicle Number</div>
          </div>
        }
        visible={serviceVehicleNumberVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setServiceVehicleNumberVisible(false);
          serviceVehicleNumberReset();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form
          onSubmit={handleServiceVehicleNumberSubmit(
            handleUpdateServiceVehicleNumber
          )}
        >
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <Controller
                  name="serviceregistrationNumber"
                  control={controlServiceVehicleNumber}
                  defaultValue={
                    serviceproviders[activeIndex]?.aspVehicleRegistrationNumber
                  }
                  rules={{
                    required: "Vehicle Number is Required",
                    /* validate: {
                      matchPattern: (v) => {
                        if (v?.length > 0) {
                          return (
                            /^[AP|AR|AS|BR|GA|GJ|HR|HP|JH|KA|KL|MP|MH|MN|ML|MZ|NL|OD|PB|RJ|SK|TN|TS|TR|UP|UK|WB]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(
                              v
                            ) || "Please enter a valid Vehicle Number"
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }, */
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        value={field?.value?.toUpperCase()}
                        keyfilter={"alphanum"}
                        className={`form-control`}
                        placeholder="Enter Vehicle Number"
                        maxLength={10}
                      />
                      <div className="p-error">
                        {serviceVehicleNumberErrors[field.name]?.message}
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
            loading={vehicleServiceIsLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>

      <Dialog
        header={
          <>
            <div className="dialog-header">
              <div className="dialog-header-title">
                {" "}
                Change ASP Activity Status
              </div>
            </div>
            {aspActivityStatusId == 4 && slaExceeded ? (
              <div>
                {" "}
                <TimerChip label="SLA Violated" type="red" />
              </div>
            ) : null}
          </>
        }
        visible={aspStatusVisible}
        position={"bottom"}
        className="w-372"
        onHide={handleAspStatusDialogClose}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleASPStatusSubmit(handleASPStatusChange)}>
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">
                  ASP Activity Status
                </label>

                <Controller
                  name="aspActivityStatusId"
                  control={aspControl}
                  rules={{ required: "ASP Activity Status is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={aspStatusList?.data?.data?.map(
                          ({ name, id }) => {
                            return {
                              label: name,
                              value: id,
                            };
                          }
                        )}
                        optionLabel="label"
                        onChange={(e) => {
                          field.onChange(e.value);
                          setASPStatus("aspActivityStatusId", e.value);
                        }}
                      />

                      <div className="p-error">
                        {/* {errors[field.name]?.message} */}
                        {aspErrors && aspErrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">
                  Select Date and Time
                </label>
                <Controller
                  name="dateTime"
                  control={aspControl}
                  rules={{ required: "Date and Time is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Calendar
                        id="dateRange"
                        value={field.value}
                        hourFormat="12"
                        dateFormat="dd/mm/yy"
                        {...field}
                        placeholder="Select Date and Time"
                        showIcon
                        showTime
                        hide
                        iconPos={"left"}
                        maxDate={new Date()}
                        onChange={(e) => {
                          field.onChange(e.value); // Update the form field
                          setASPStatus("dateTime", e.value); // Manually set the form value using setASPStatus
                        }}
                      />

                      <div className="p-error">
                        {aspErrors && aspErrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            {aspActivityStatusId == 4 && slaExceeded ? (
              <>
                {/* <div className="dialog-header">
                  <div className="dialog-header-title">SLA Violation</div>
                </div> */}

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label required">
                      SLA Violated Reason
                    </label>
                    <Controller
                      name="slaViolateReasonId"
                      control={aspControl}
                      rules={{ required: "SLA Violation Reason is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select SLA Violation Reason"
                            options={reasons?.data?.data}
                            optionLabel="name"
                            onChange={(e) => {
                              field.onChange(e.value);
                            }}
                          />
                          <div className="p-error">
                            {aspErrors && aspErrors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <Button
            className="btn form-submit-btn mt-4"
            type="submit"
            loading={aspStatusLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>

      <UploadDocsDialog
        visible={dealerDocUploadDialogVisible}
        setVisible={setDealerDocUploadDialogVisible}
        onFormSubmit={handleDealerAttachments}
        submitLoading={uploadDealerDocumentLoading}
        defaultValues={serviceproviders[activeIndex]?.dealerAttachments}
      />
      <DealerDocumentAttachmentsDialog
        visible={dealerAttachmentDialogVisible}
        setVisible={setDealerAttachmentDialogVisible}
        attachments={serviceproviders[activeIndex]?.dealerAttachments?.map(
          (file) => {
            return { ...file };
            // return { ...file, fileName: file?.originalName }; //ENABLE AFTER CRM CODE MOVEMENT SINCE ORIGINAL NAME WORK WAS IMPLEMENTED ONLY IN CRM
          }
        )}
        title={"Dealer Documents"}
        footer={
          userTypeId == 140 &&
          ticketInfo?.caseStatusId == 2 &&
          (serviceproviders[activeIndex]?.activityStatusId == 3 ||
            serviceproviders[activeIndex]?.activityStatusId == 7 ||
            serviceproviders[activeIndex]?.activityStatusId == 10 ||
            serviceproviders[activeIndex]?.activityStatusId == 11 ||
            serviceproviders[activeIndex]?.activityStatusId == 12)
            ? dealerAttachmentsFooterContent
            : null
        }
        userTypeId={userTypeId}
        caseStatusId={ticketInfo?.caseStatusId || null}
        onFormSubmit={handleDealerDocumentComments}
        submitLoading={dealerDocumentCommentsLoading}
        fieldName={`dealerDocumentComments_${activeIndex}`}
        dealerDocumentComments={
          serviceproviders[activeIndex]?.dealerDocumentComments || ""
        }
        activityStatusId={
          serviceproviders[activeIndex]?.activityStatusId || null
        }
        role={role}
      />
    </div>
  );
};

export default RequestInfoCard;
