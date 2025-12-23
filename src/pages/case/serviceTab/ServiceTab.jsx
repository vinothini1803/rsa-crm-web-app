import { Accordion, AccordionTab } from "primereact/accordion";
import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { Link } from "react-router-dom";
import {
  AddBlueIcon,
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
  DashCamImage,
  SystemTimeLineIcon,
  InteractionTimeLineIcon,
  DialogCloseSmallIcon,
  ActivityRemainder,
  NotificationTimelineIcon,
  CallIntegrationIcon,
  GoogleMapAPIKey,
  RedLocationMarker,
  VehicleLocationBlueMarker,
  StartLocation,
  EndLocation,
  FileBaseUrl,
} from "../../../utills/imgConstants";
import { TabPanel, TabView } from "primereact/tabview";
import { TabMenu } from "primereact/tabmenu";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import { Chip } from "primereact/chip";
import { OverlayPanel } from "primereact/overlaypanel";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TabMenuItem from "../../../components/common/TabMenuItem";
import ViewGrid from "../../../components/common/ViewGrid";
import TimelineAccordian from "../TimelineAccordian";
import AttachmentsTab from "./AttachmentsTab";
import ServiceSidebar from "./ServiceSidebar";
import { CurrentUser } from "../../../../store/slices/userSlice";
import NoDataComponent from "../../../components/common/NoDataComponent";
import ServiceDetailCard from "../../home/ServiceDetailCard";
import ServiceAccordianTabs from "./ServiceAccordianTabs";
import ReminderSidebar from "../../../components/common/ReminderSidebar";
import ChangeActivityDialog from "../../../components/common/ChangeActivityDialog";
import InterActionSidebar from "../../../components/common/InterActionSidebar";
import InitiateCancellationDialog from "./InitiateCancellationDialog";
import { Controller, useForm, useWatch } from "react-hook-form";
import SelectableButtons from "./SelectableButtons";
import { clickToCall } from "../../../../services/callService";
import { toast } from "react-toastify";
import SlaReasonDialog, { checkSla } from "../../../components/common/Sla";
import TimerChip from "../../../components/common/TimerChip";

import {
  aspCancelReason,
  slaViolateReasons,
  discountReasons,
  getConfigList,
  aspMechanics,
} from "../../../../services/masterServices";
import {
  getInteractiondata,
  addInteraction,
} from "../../../../services/deliveryRequestViewService";
import {
  getReminderFormData,
  addReminder,
} from "../../../../services/reminderService";
import { aspCancel } from "../../../../services/assignServiceProvider";
import { updateActivityVehicleNumber } from "../../../../services/assignServiceProvider";
import { assignDriver } from "../../../../services/assignServiceProvider";
import {
  getAspActivityStatuses,
  sendCustomerInvoice,
  updateAspActivityStatuses,
  updatePickupTime,
  // paymentLinkExpire,
  resendPaymentLink,
  getServiceProviderLiveLocation,
  activityCheckPaymentStatus,
  checkRefundStatus,
  sendPaymentLinkToCustomer,
  storeAdditionalPaymentDisagreement,
} from "../../../../services/caseService";
import StatusBadge from "../../../components/common/StatusBadge";
import AttachmentsDialog from "../../../components/common/AttachmentsDialog";
import moment from "moment";
import {
  getActivityStatus,
  othersStatusUpdate,
} from "../../../../services/otherService";
import FileChooseUpload from "../../inventory/FileChooseUpload";
import { reimbursementMapping } from "../../../../services/otherService";
import { Calendar } from "primereact/calendar";
import GoogleMapReact from "google-map-react";
import CurrencyFormat from "../../../components/common/CurrencyFormat";

const TimeLineIcons = {
  240: SystemTimeLineIcon,
  241: MobileTimeLineIcon,
  242: InteractionTimeLineIcon,
  243: ActivityRemainder,
  244: NotificationTimelineIcon,
  245: CallIntegrationIcon,
};

const ServiceTab = ({
  aspResultData,
  caseData,
  aspRefetch,
  caseDetailrefetch,
  handleAspAssign,
  setServiceVisible,
  caseViewData,
}) => {
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const user = useSelector(CurrentUser);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [interactionDialogeVisible, setInteractionDialogeVisible] =
    useState(false);
  const [reminderDialogeVisible, setReminderDialogeVisible] = useState(false);
  const [camVisible, setCamVisible] = useState(false);
  const [activityDialogVisible, setActivityDialogVisible] = useState(false);
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [serviceVehicleNumberVisible, setServiceVehicleNumberVisible] =
    useState(false);
  const [attachmentVisible, setAttachmentVisible] = useState(false);
  const [attachementArray, setAttachementArray] = useState([]);
  const [othersStatusVisible, setOthersStatusVisible] = useState(false);
  const [deleteAttachments, setDeleteAttachments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [attachmentDialogVisible, setAttachmentDialogVisible] = useState(false);
  const navigate = useNavigate();
  const statusChangePanel = useRef(null);
  const othersStatusPanel = useRef(null);
  const [initalFlag, setInitalFlag] = useState(true);
  const [reimbursementDialogVisible, setReimbursementDialogVisible] =
    useState(false);
  const [selectedReimbursementOption, setSelectedReimbursementOption] =
    useState([]);
  const [resendLink, setResendLink] = useState(false);
  const [
    initiateCancellationDialogVisible,
    setInitiateCancellationDialogVisible,
  ] = useState(false);
  const [checkRefundStatusLoading, setCheckRefundStatusLoading] =
    useState(false);
  const [pickTimeConfirmDialog, setPickTimeConfirmDialog] = useState(false);
  const [slaReasonVisible, setSlaReasonVisible] = useState(false);
  const [slaBreakdownEnable, setSlaBreakdownEnable] = useState(false);
  const emailPanel = useRef(null);
  const [serviceDetailList, setServiceDetailList] = useState(false);
  const [baseTime, setBaseTime] = useState("");

  const [serviceProviderTrackingVisible, setServiceProviderTrackingVisible] =
    useState(false);
  const [refreshServiceProviderTracking, setRefreshServiceProviderTracking] =
    useState(false);
  const [trackLinkAspName, setTrackLinkAspName] = useState("");
  const [bdLat, setBdLat] = useState();
  const [bdLng, setBdLng] = useState();

  // Additional KM Payment states
  const [
    additionalKmPaymentDialogVisible,
    setAdditionalKmPaymentDialogVisible,
  ] = useState(false);
  const [sendLinkDialogVisible, setSendLinkDialogVisible] = useState(false);
  const [customerAgreedToPayment, setCustomerAgreedToPayment] = useState(null);
  const [customerPaymentComments, setCustomerPaymentComments] = useState("");
  const [selectedDiscountReason, setSelectedDiscountReason] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [legalName, setLegalName] = useState(null);
  const [tradeName, setTradeName] = useState(null);
  const [gstin, setGstin] = useState(null);
  const [assignDriverDialogVisible, setAssignDriverDialogVisible] =
    useState(false);
  const [assignDriverActivity, setAssignDriverActivity] = useState(null);

  // console.log("activeIndex", activeIndex);
  const permissions = role?.permissions?.map((perm) => perm.name) || [];
  const handleChangeActivity = () => {
    setActivityDialogVisible(true);
  };

  const {
    handleSubmit: handleCancelSubmit,
    control: controlCancel,
    reset: cancelReset,
    formState: { errors: cancelErrors },
  } = useForm({});

  const {
    handleSubmit: handleServiceVehicleNumberSubmit,
    control: controlServiceVehicleNumber,
    reset: serviceVehicleNumberReset,
    setValue: setServiceVehicleNumber,
    formState: { errors: serviceVehicleNumberErrors },
  } = useForm({});

  const {
    handleSubmit: handleActivityStatusSubmit,
    control: controlActivityStatus,
    reset: ActivityStatusReset,
    setValue: setActivityStatus,
    formState: { errors: ActivityStatusErrors },
    watch,
  } = useForm({});

  const {
    handleSubmit: handleOthersStatusSubmit,
    control: controlOthersStatus,
    reset: OthersStatusReset,
    setValue: setOthersStatus,
    trigger,

    formState: { errors: OthersStatusErrors },
  } = useForm({});
  const {
    handleSubmit: handleCustomerInvoiceSubmit,
    control: controlCustomerInvoice,
    reset: CustomerInvoiceReset,
    setValue: setCustomerInvoiceValue,
    formState: { errors: CustomerInvoiceErrors },
  } = useForm({});

  const {
    handleSubmit: handleOthersFormSubmit,
    control: controlRemarksStatus,
    reset: RemarksStatusReset,
    resetField: RemarksResetField,
    setValue: setRemarksValue,

    formState: { errors: RemarksStatusErrors },
  } = useForm({});

  const activityStatusId = useWatch({
    control: controlOthersStatus,
    name: "activityStatusId",
  });
  const dateTime = watch("dateTime");
  // console.log("dateTime",dateTime)
  const aspActivityStatusId = watch("aspActivityStatusId");
  // console.log("aspActivityStatusId", aspActivityStatusId);
  const {
    handleSubmit: handleReimbursementSubmit,
    control: controlReimbursement,
    reset: reimbursementReset,
    setValue: setReimbursementValue,
    formState: { errors },
  } = useForm();

  // Form for additional KM payment send link
  const {
    control: payControl,
    formState: { errors: payErrors },
    reset: payReset,
    setValue: setPayvalue,
    trigger: payTrigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      sendPaymentLinkTo: "",
      discountPercentage: null,
      discountReasonId: null,
      discountAmount: null,
      customerTypeId: null,
      legalName: null,
      tradeName: null,
      gstin: null,
    },
  });

  const { data: aspCancelReasons } = useQuery(["aspCancelReasons"], () =>
    aspCancelReason({
      apiType: "dropdown",
    })
  );
  const { mutate: cancelASPMutate, isLoading: aspCancelIsLoading } =
    useMutation(aspCancel);
  const {
    mutate: updateVehicleNumberMutate,
    isLoading: updateVehicleNumberIsLoading,
  } = useMutation(updateActivityVehicleNumber);

  // Get Interaction Form Data
  const { data: interactionFormData } = useQuery(
    ["caseInteractionFormData"],
    () => getInteractiondata(),
    {
      enabled: interactionDialogeVisible,
    }
  );

  const { data: reasons = [] } = useQuery(
    ["reasonList", role.id],
    () => slaViolateReasons({ apiType: "dropdown", roleId: role.id }),
    {}
  );

  // Save Interaction API
  const { mutate: interactionMutate, isLoading: interactionMutateLoading } =
    useMutation(addInteraction);

  // Get Reminder Form Data
  const { data: reminderFormData } = useQuery(
    ["caseReminderFormData"],
    () => getReminderFormData(),
    {
      enabled: reminderDialogeVisible,
    }
  );

  // console.log("reminderFormData", reminderFormData);

  //Payment Link expiry check
  // const { data: paymentLinkData } = useQuery(
  //   ["paymentLinkExpire"],
  //   () =>
  //     paymentLinkExpire({
  //       crmActivityId: aspResultData[activeIndex]?.activityId,
  //     }),
  //   {
  //     //enabled: aspResultData[activeIndex]?.customerNeedToPay == true && aspResultData[activeIndex]?.isCustomerInvoiced == false && aspResultData[activeIndex]?.sendPaymentLinkTo !== null,
  //     onSuccess: (res) => {
  //       if (res?.data?.success) {
  //         if (res?.data?.showResendSmsBtn) {
  //           setResendLink(true);
  //         }
  //       }
  //     },
  //   }
  // );

  //payment resend
  const { mutate: paymentMutate, isLoading: paymentMutateLoading } =
    useMutation(resendPaymentLink);

  // Additional KM Payment queries and mutations
  const { data: discountData } = useQuery(["discountReasons"], () =>
    discountReasons({ refetchOnWindowFocus: false })
  );

  const { data: nonMemberCustomerTypes } = useQuery(
    ["nonMemberCustomerTypeList"],
    () =>
      getConfigList({
        typeId: 85, //Non Member Customer Types
      }),
    {
      enabled: sendLinkDialogVisible ? true : false,
    }
  );

  const { mutate: sendLinkMutate, isLoading: sendLinkMutateLoading } =
    useMutation(sendPaymentLinkToCustomer);
  const { mutate: storeAgreementMutate, isLoading: storeAgreementLoading } =
    useMutation(storeAdditionalPaymentDisagreement);

  // Assign Driver (used only when ASP has mechanic and driver not assigned)
  const {
    control: driverFormControl,
    handleSubmit: handleDriverSubmit,
    reset: driverReset,
    formState: { errors: driverErrors },
  } = useForm({
    defaultValues: {
      aspMechanicId: "",
    },
  });

  const { mutate: assignDriverMutate, isLoading: assignDriverLoading } =
    useMutation(assignDriver);

  const { data: aspMechanicsData } = useQuery(
    ["aspMechanics", assignDriverActivity?.asp?.id],
    () =>
      aspMechanics({
        aspId: assignDriverActivity?.asp?.id,
      }),
    {
      enabled: assignDriverDialogVisible && !!assignDriverActivity?.asp?.id,
    }
  );

  const handleAssignDriver = (activity) => {
    setAssignDriverActivity(activity);
    setAssignDriverDialogVisible(true);
  };

  const handleAssignDriverSubmit = (values) => {
    if (!assignDriverActivity?.activityId || !assignDriverActivity?.asp?.id) {
      toast.error("Activity/ASP not found");
      return;
    }
    assignDriverMutate(
      {
        activityId: assignDriverActivity.activityId,
        aspId: assignDriverActivity.asp.id,
        aspMechanicId: values.aspMechanicId,
        logTypeId: 240,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message || "Driver assigned successfully");
            setAssignDriverDialogVisible(false);
            setAssignDriverActivity(null);
            driverReset();
            caseDetailrefetch();
            aspRefetch[activeIndex]?.refetch();
          } else {
            toast.error(res?.data?.error || "Failed to assign driver");
          }
        },
        onError: (err) => {
          toast.error(err?.response?.data?.error || err?.message);
        },
      }
    );
  };

  const sendPaymentLinkTo = useWatch({
    name: "sendPaymentLinkTo",
    control: payControl,
  });

  const customerTypeId = useWatch({
    name: "customerTypeId",
    control: payControl,
  });

  // Save ASP Activity Status Form
  const {
    mutate: aspActivityStatusMutate,
    isLoading: aspActivityStatusMutateLoading,
  } = useMutation(updateAspActivityStatuses);

  // Get ASP Status Data
  const { data: aspStatusData, mutate: aspStatusMutate } = useMutation(
    getAspActivityStatuses
  );
  //form submit api for status
  const {
    data: updatedStatusData,
    mutate: updatedStatusMutate,
    isLoading: updateStatusLoading,
  } = useMutation(othersStatusUpdate);

  //Get the Status for others
  const { data: othersStatusData } = useQuery(
    ["othersStatusData "],
    () => getActivityStatus(),
    {
      enabled: true,
    }
  );

  //outbound call
  const { mutate: outboundCallMutate, isLoading: outboundCallLoading } =
    useMutation(clickToCall);

  //Customer Invoice Send API
  const { mutate: customerInvoiceMutate, isLoading: customerInvoiceLoading } =
    useMutation(sendCustomerInvoice);

  // Save Reminder API
  const { mutate: reminderMutate, isLoading: reminderMutateLoading } =
    useMutation(addReminder);

  useEffect(() => {
    if (!othersStatusVisible) {
      // Reset when the popup closes
      setDeleteAttachments([]);
    }
  }, [othersStatusVisible]);
  // Update Pickup Time
  const { mutate: updatePickupTimeMutate, isLoading: updatePickupTimeLoading } =
    useMutation(updatePickupTime);
  // Handle ASP Cancel API
  const handleAspCancel = (values) => {
    // console.log("handleAspCancel", values);
    cancelASPMutate(
      {
        activityId: aspResultData[activeIndex]?.activityId,
        ...values,
        logTypeId: 240,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setCancelDialogVisible(false);
            cancelReset();
            aspRefetch[activeIndex]?.refetch();
            if (userTypeId == 141) {
              caseDetailrefetch();
            }
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

  const getBaseTime = (activity) => {
    // console.log("get base time ***", activity);
    //OLD LOGIC
    // if (activity?.isInitiallyCreated && !activity?.isImmediateService) {
    //   return activity?.serviceInitiatingAtInMilliSeconds;
    // } else if (!activity?.isInitiallyCreated) {
    //   return activity?.activityCreatedAtInMilliSeconds;
    // } else {
    //   return activity?.caseDetail?.createdAtInMilliSeconds;
    // }
    //NEW LOGIC
    //WHEN SERVICE IS INITIALLY CREATED AND NOT IMMEDIATE SERVICE, THEN USE SERVICE INITIATING AT ELSE USE CASE CREATED AT FOR BASE DATE
    if (activity?.isInitiallyCreated && !activity?.isImmediateService) {
      return activity?.serviceInitiatingAtInMilliSeconds;
    } else {
      return activity?.caseDetail?.createdAtInMilliSeconds;
    }
  };
  const checkSlaReachedBD = (activity, slaSettings, typeId, locationTypeId) => {
    let baseTime = getBaseTime(activity);
    // console.log("base time ", baseTime, slaSettings);
    let slaSettingTime = slaSettings?.find(
      (sla) => sla.typeId == typeId && sla.locationTypeId == locationTypeId
    );
    // console.log("sla setting time", slaSettingTime);
    let slaTime = baseTime + slaSettingTime?.timeInMilliSeconds;
    setBaseTime(slaTime);
  };

  // const handleResendLink = () => {
  //   paymentMutate(
  //     {
  //       crmActivityId: aspResultData[activeIndex]?.activityId,
  //     },
  //     {
  //       onSuccess: (res) => {
  //         if (res?.data?.success) {
  //           toast.success(res?.data?.message);
  //           setResendLink(false);
  //         }
  //       },
  //     }
  //   );
  // };

  const slaExceeded = () => {
    const selectedDateTime = moment(dateTime, "ddd MMM DD YYYY HH:mm:ss ZZ");
    const timestamp = selectedDateTime?.valueOf();
    return timestamp > baseTime;
  };

  let isSlaExceeded = slaExceeded();

  // Handle Update Vehicle Number
  const handleUpdateServiceVehicleNumber = (data) => {
    updateVehicleNumberMutate(
      {
        activityId: aspResultData[activeIndex]?.activityId,
        vehicleNumber: data.serviceregistrationNumber,
        aspId: aspResultData[activeIndex]?.asp?.id,
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

  // Handle Submit Interaction Form
  const handleSaveInteraction = (values, reset) => {
    interactionMutate(
      {
        activityId: aspResultData[activeIndex]?.activityId,
        typeId: 242,
        ...values,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setInteractionDialogeVisible(false);
            reset();
            caseDetailrefetch();
            aspRefetch[activeIndex]?.refetch();
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

  const formatScheduleTime = (item) => {
    const formatType = item?.name?.split(" ");
    if (formatType[1]?.toLowerCase() == "min") {
      return moment()
        .add(Number(formatType[0]), "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
    } else {
      return moment()
        .add(Number(formatType[0]), "hours")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  };

  // Handle Submit Reminder Form
  const handleSaveReminder = (values, reset) => {
    // console.log("handleSaveReminder Reminder Form Values", values);

    // Validate scheduleTime when reminder ID is 1 (Others)
    if (values?.reminder[0] == 1) {
      if (!values?.scheduleTime || !moment(values?.scheduleTime).isValid()) {
        toast.error("Please select a valid date and time for the reminder");
        return;
      }
    }

    const reminderPayload = {
      slaViolateReasonId: values?.slaViolateReasonId?.id || null,
      slaViolateReasonComments: values?.slaViolateReasonId?.name || null,
      subject: values?.subject,
      description: values?.description,
      caseDetailId: caseData?.caseDetailId,
      activityId: aspResultData[activeIndex]?.activityId,
      reminder: reminderFormData?.data?.data?.reminder?.find(
        (item) => item?.id == values?.reminder[0]
      ),
      scheduleTime:
        values?.reminder[0] == 1
          ? moment(values?.scheduleTime).format("YYYY-MM-DD HH:mm:ss")
          : formatScheduleTime(
              reminderFormData?.data?.data?.reminder?.find(
                (item) => item?.id == values?.reminder[0]
              )
            ),
      priority: reminderFormData?.data?.data?.priority?.find(
        (item) => item?.id == values?.priority[0]
      ),
      type:
        values?.type?.length > 0
          ? reminderFormData?.data?.data?.type?.find(
              (item) => item?.id == values?.type[0]
            )
          : {},
      status:
        values?.status?.length > 0
          ? reminderFormData?.data?.data?.status?.find(
              (item) => item?.id == values?.status[0]
            )
          : {},
    };
    // console.log("Reminder Payload => ", reminderPayload);
    reminderMutate(reminderPayload, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setReminderDialogeVisible(false);
          reset();
          caseDetailrefetch();
          aspRefetch[activeIndex]?.refetch();
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };

  // console.log("Service Tab aspResultData => ", aspResultData[activeIndex]);

  const handleOutBoundCall = (value) => {
    // console.log("value", value);
    outboundCallMutate(
      {
        agentId: user?.userName,
        campaignName: caseData?.client,
        customerNumber: value,
        caseDetailId: caseData?.caseDetailId?.toString(),
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

  const {
    mutate: activityCheckPaymentStatusMutate,
    isLoading: activityCheckPaymentStatusMutateLoading,
  } = useMutation(activityCheckPaymentStatus);

  const handleActivityCheckPaymentStatus = (data) => {
    activityCheckPaymentStatusMutate(
      {
        activityId: aspResultData[activeIndex]?.activityId,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
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

  const {
    mutate: checkRefundStatusMutate,
    isLoading: checkRefundStatusMutateLoading,
  } = useMutation(checkRefundStatus);

  const handleCheckRefundStatus = () => {
    // Get the first non-membership transaction (paymentTypeId: 174)
    const transaction = aspResultData[
      activeIndex
    ]?.data?.data?.transactions?.find((txn) => txn?.paymentTypeId === 174);

    if (!transaction) {
      toast.error("No transaction found for this activity");
      return;
    }

    setCheckRefundStatusLoading(true);
    checkRefundStatusMutate(
      {
        transactionId: transaction.id,
      },
      {
        onSuccess: (res) => {
          setCheckRefundStatusLoading(false);
          if (res?.data?.success) {
            toast.success(
              res?.data?.message || "Refund status checked successfully"
            );
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
        onError: (error) => {
          setCheckRefundStatusLoading(false);
          toast.error(
            error?.response?.data?.error || "Error checking refund status"
          );
        },
      }
    );
  };

  // Handler for opening additional KM payment dialog
  const handleAdditionalKmPaymentClick = () => {
    setAdditionalKmPaymentDialogVisible(true);
  };

  const serviceInfo = aspResultData?.map((activityData) => {
    const digitalInventorAttachment =
      activityData?.digitalInventoryAttachments?.filter(
        (item) => item.attachmentTypeId === 616
      )?.[0];

    return {
      title: activityData?.service,
      id: activityData?.activityId,
      status: activityData?.activityStatus,
      statusId: activityData?.activityStatusId,
      code: activityData?.asp?.code,
      serviceDetailsItems: [
        {
          label: "Service",
          value: activityData?.service ?? "--",
        },
        {
          label: "Sub Service",
          value: activityData?.subService ?? "--",
        },
        {
          label: "Activity Status",
          badge: activityData?.activityStatus,
          statusId: activityData?.activityStatusId,
          statusType: "activityStatus",
          ...((userTypeId == 141 &&
            user?.role?.id == 3 &&
            user?.levelId != 1045 &&
            user?.id == caseData?.agentId &&
            (caseData?.caseStatusId == 1 || caseData?.caseStatusId == 2) && //activity cancel---> Agent
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(
              activityData?.activityAppStatusId
            ) &&
            [2, 3, 9, 10, 14].includes(activityData?.activityStatusId)) ||
          (userTypeId == 140 &&
            (caseData?.caseStatusId == 1 || caseData?.caseStatusId == 2) && //activity cancel---> Dealer
            [1, 2, 3].includes(activityData?.activityAppStatusId) &&
            [2, 9, 10, 14].includes(activityData?.activityStatusId))
            ? {
                action: <span className="remove-text"> Cancel</span>,
                actionClick: () => setCancelDialogVisible(true),
              }
            : {}),
          ...((activityData?.isReimbursement ||
            !activityData?.subServiceHasAspAssignment) &&
          // user?.role?.id==3
          permissions?.includes("activity-status-change-web") &&
          id == caseData?.agentId &&
          user?.levelId != 1045
            ? {
                ...(activityData?.activityStatusId == 7 ||
                activityData?.activityStatusId == 4 ||
                activityData?.activityStatusId == 8 ||
                activityData?.activityStatusId == 14 ||
                !activityData?.agentPickedAt
                  ? {}
                  : {
                      btnLink: "Change",
                      btnLinkAction: (e) => {
                        // aspStatusMutate({activityId: activityData?.activityId});
                        othersStatusPanel?.current?.toggle(e);
                      },
                      btnDisabled: user?.levelId == 1045,
                    }),
              }
            : {}),
        },

        // ...(!activityData?.customerNeedToPay
        //   ?
        // [
        {
          label: "Reimbursement",
          value: activityData?.isReimbursement ? (
            <StatusBadge text="Yes" statusId="1" statusType="roleStatus" />
          ) : (
            <StatusBadge text="No" statusId="0" statusType="roleStatus" />
          ),
          ...(!activityData?.asp ||
          activityData?.activityStatusId == 1 ||
          activityData?.activityStatusId == 4 ||
          activityData?.activityStatusId == 8
            ? {
                btnLink: " Change",
                btnLinkAction: () => {
                  handleReimbursementStatus();
                },
              }
            : {}),
          btnDisabled:
            activityData?.agentPickedAt == null ||
            (activityData?.agentPickedAt != null &&
              caseData?.caseStatusId != 2) ||
            // [1,7,14,15,16,21,22,23,24,25,26,27].includes(user?.role?.id)
            !permissions?.includes("activity-map-reimbursement-web") ||
            user?.levelId == 1045 ||
            id != caseData?.agentId
              ? true
              : false,
        },
        // ],
        // : []),

        ...(activityData?.remarks
          ? [
              {
                label: "Remarks",
                value: activityData?.remarks,
                btnLink: "Edit",
                btnLinkAction: () => handleEditOthersStatus(),
                btnDisabled:
                  activityData?.agentPickedAt == null ||
                  (activityData?.agentPickedAt != null &&
                    caseData?.caseStatusId != 2 &&
                    caseData?.positiveActivityExists) ||
                  // [1,7,14,15,16,21,22,23,24,25,26,27].includes(user?.role?.id)
                  !permissions?.includes(
                    "activity-update-reimbursement-service-detail-web"
                  ) ||
                  user?.levelId == 1045 ||
                  caseData?.caseStatusId == 4 ||
                  id != caseData?.agentId
                    ? true
                    : false,
              },
            ]
          : []),
        ...(activityData?.otherServiceAttachments?.length > 0
          ? [
              {
                label: "Attachments",
                btnLink: "Edit",
                btnLinkAction: () => handleEditOthersStatus(),
                btnDisabled:
                  activityData?.agentPickedAt == null ||
                  (activityData?.agentPickedAt != null &&
                    caseData?.caseStatusId != 2 &&
                    caseData?.positiveActivityExists &&
                    user?.levelId == 1045) ||
                  caseData?.caseStatusId == 4 ||
                  !permissions?.includes(
                    "activity-update-reimbursement-service-detail-web"
                  )
                    ? true
                    : false,
                value: (
                  <>
                    <button
                      onClick={() => handleViewOthersAttachments()} // Assuming you have a view handler function
                      className="btn-link"
                    >
                      View
                    </button>
                  </>
                ),
              },
            ]
          : []),
        ...(activityData?.isReimbursement ||
        !activityData?.subServiceHasAspAssignment
          ? []
          : caseData?.agentId &&
            activityData?.agentPickedAt &&
            [2, 4].includes(caseData?.caseStatusId) &&
            [3, 7].includes(activityData?.activityStatusId)
          ? [
              {
                label: "ASP",
                badge: "Assigned",
                statusId: 2,
                statusType: "activityStatus",
              },
            ]
          : [
              {
                label: "ASP",
                btnLink: "Assign ASP",
                btnLinkAction: () => handleAspAssign(activityData?.activityId),
                btnDisabled:
                  caseData?.agentId &&
                  user?.role?.id == 3 &&
                  id == caseData?.agentId &&
                  activityData?.agentPickedAt &&
                  [1, 2, 4, 8].includes(activityData?.activityStatusId) &&
                  user?.levelId !== 1045 &&
                  caseData?.caseStatusId == 2
                    ? false
                    : activityData?.activityStatusId == 10 &&
                      !activityData?.customerNeedToPay &&
                      activityData?.aspActivityStatusId == 2 &&
                      caseData?.caseStatusId == 2
                    ? false
                    : true,
              },
            ]),
        ...(activityData?.cancelReason &&
        activityData?.activityStatusId == 4 &&
        user?.role?.id == 3
          ? [
              {
                label: "Cancel Reason",
                value: activityData?.cancelReason || "--",
              },
            ]
          : []),
        ...(activityData?.activityStatusId == 8 && user?.role?.id == 3
          ? [
              {
                label: "Rejection Reason",
                value: activityData?.rejectReason ?? "--",
              },
            ]
          : []),
        ...(activityData?.isReimbursement ||
        !activityData?.subServiceHasAspAssignment
          ? []
          : [
              {
                label: "ASP Activity Status",
                value: activityData?.aspActivityStatus ?? "--",
                ...(userTypeId == 141 &&
                  // user?.role?.id==3
                  permissions?.includes("asp-activity-status-change-web") &&
                  user?.levelId != 1045 &&
                  id == caseData?.agentId &&
                  [3, 10, 14]?.includes(activityData?.activityStatusId) &&
                  [2, 3, 4, 5, 6, 7, 14, 15, 16, 17, 18, 13]?.includes(
                    activityData?.aspActivityStatusId
                  ) && {
                    btnLink: " Change",
                    btnLinkAction: (e) => {
                      aspStatusMutate({ activityId: activityData?.activityId });
                      if (activityData?.aspActivityStatusId == 14) {
                        checkSlaReachedBD(
                          activityData,
                          activityData?.extras?.slaSettings,
                          870,
                          caseData?.breakdownAreaLocationTypeId
                        );
                      }

                      statusChangePanel?.current?.toggle(e);
                    },
                  }),
                btnDisabled: activityData?.agentPickedAt == null ? true : false,
              },
            ]),
        ...(activityData?.isReimbursement ||
        !activityData?.subServiceHasAspAssignment
          ? []
          : [
              {
                label: "Finance Status ",
                value: activityData?.financeStatus,
              },
            ]),
        ...(activityData?.isReimbursement ||
        !activityData?.subServiceHasAspAssignment
          ? []
          : [
              {
                label: "Workshop Name",
                value: activityData?.asp?.workshopName ?? "--",
              },
            ]),
        ...(activityData?.isReimbursement ||
        !activityData?.subServiceHasAspAssignment
          ? []
          : [
              {
                label: "Service Details",
                ...{
                  btnLink: "View",
                  btnLinkAction: (e) => {
                    //const navigate = useNavigate();
                    setServiceDetailList(true);

                    // Navigate to the service-details page (you may pass additional data with the state if needed)
                    navigate(`service-details?i=${activeIndex}`);
                  },
                },
              },
            ]),

        ...(activityData?.isReimbursement ||
        !activityData?.subServiceHasAspAssignment
          ? []
          : [
              {
                label: "ASP Code",
                value: activityData?.asp?.code ?? "--",
                vlaueClassName: "info-badge info-badge-purple",
              },
            ]),
        ...(activityData?.isReimbursement ||
        !activityData?.subServiceHasAspAssignment
          ? []
          : [{ label: "ASP Name", value: activityData?.asp?.name ?? "--" }]),
        ...(activityData?.isReimbursement ||
        !activityData?.subServiceHasAspAssignment
          ? []
          : [
              {
                label: "ASP Contact",
                value: activityData?.asp?.contactNumber ?? "--",
                vlaueClassName: "info-badge info-badge-yellow",
                btnLink: "Call",
                //btnLinkAction: () => handleOutBoundCall(activityData?.asp?.contactNumber),
                btnDisabled: activityData?.asp?.code ? false : true,
              },
            ]),
        ...(activityData?.isReimbursement ||
        !activityData?.subServiceHasAspAssignment
          ? []
          : [
              {
                label: "ASP Vehicle Number",
                value: activityData?.aspVehicleRegistrationNumber ?? "--",

                ...(userTypeId == 141 &&
                  caseData?.agentId &&
                  ![3, 4].includes(caseData?.caseStatusId) &&
                  ![3, 4, 7, 8, 11, 12].includes(
                    aspResultData[activeIndex]?.["activityStatusId"]
                  ) &&
                  !activityData?.asp?.isOwnPatrol && {
                    btnLink: "Edit",
                    btnLinkAction: () => setServiceVehicleNumberVisible(true),
                  }),

                btnDisabled:
                  activityData?.asp?.code &&
                  user?.role?.id == 3 &&
                  user?.levelId !== 1045 &&
                  id == caseData?.agentId
                    ? false
                    : true,
              },
              ...(userTypeId == 141 &&
              caseData?.agentId &&
              ![3, 4].includes(caseData?.caseStatusId) &&
              ![3, 4, 7, 8, 11, 12].includes(
                aspResultData[activeIndex]?.["activityStatusId"]
              ) &&
              activityData?.asp?.hasMechanic === true &&
              !activityData?.aspMechanic?.name
                ? [
                    {
                      label: "Assign Driver",
                      value: (
                        <button
                          className="btn-text btn-link"
                          onClick={() => handleAssignDriver(activityData)}
                        >
                          Assign
                        </button>
                      ),
                      btnDisabled: false,
                    },
                  ]
                : []),
            ]),
        ...(activityData?.aspMechanic
          ? [
              {
                label: "Driver Name",
                value: activityData?.aspMechanic?.name,
              },
              {
                label: "Driver Contact",
                value: activityData?.aspMechanic?.contactNumber,
                vlaueClassName: "info-badge info-badge-yellow",
                // action: "Call",
                // actionClick: "",
                btnLink: "Call",
                //btnLinkAction: () => handleOutBoundCall(activityData?.aspMechanic?.contactNumber),
                //btnDisabled: activityData?.aspMechanic?.contactNumber ? false : true,
                // btnLinkAction: () =>
                //   handleOutBoundCall(activityData?.aspMechanic?.contactNumber),
                btnDisabled: activityData?.aspMechanic?.contactNumber
                  ? false
                  : true,
              },
            ]
          : []),

        ...(activityData?.breakdownReachSlaStatus
          ? [
              {
                label: "Breakdown Reach SLA Status",
                value: activityData.breakdownReachSlaStatus,
              },
            ]
          : []),

        /* ...(activityData?.hasTrackingLink ? [
            {
              label: "ASP Live Tracking",
              value: (
                <button
                  className="btn-text btn-link"
                  onClick={() => {
                    setActivityId(activityData?.activityId);
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
          ] : []
        ), */
        ...(activityData?.isReimbursement ||
        !activityData?.subServiceHasAspAssignment
          ? []
          : [
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
            ]),
        // Commented out - Moved to transactions tab
        // ...(activityData?.activityStatusId == 2 &&
        // activityData?.customerNeedToPay == true &&
        // activityData?.isCustomerInvoiced == false &&
        // activityData?.sendPaymentLinkTo !== null &&
        // resendLink
        //   ? [
        //       {
        //         label: "Resend Payment Link",
        //         value: (
        //           <button
        //             className="btn-text btn-link"
        //             onClick={handleResendLink}
        //             disabled={paymentMutateLoading}
        //           >
        //             Send Link
        //           </button>
        //         ),
        //       },
        //     ]
        //   : []),
        // ...(activityData?.customerNeedToPay == true &&
        // activityData?.sendPaymentLinkTo !== null
        //   ? [
        //       {
        //         label: "Customer Invoice Number",
        //         value: activityData?.customerInvoiceNumber ? (
        //           activityData?.customerInvoiceNumber
        //         ) : (
        //           <StatusBadge
        //             text="Not Paid"
        //             statusId="0"
        //             statusType="roleStatus"
        //           />
        //         ),
        //       },
        //     ]
        //   : []),

        // ...(activityData?.activityStatusId == 2 &&
        // activityData?.customerNeedToPay == true &&
        // activityData?.sendPaymentLinkTo !== null &&
        // !activityData?.customerInvoiceNumber
        //   ? [
        //       {
        //         label: "Check Payment Status",
        //         value: (
        //           <button
        //             className="btn-text btn-link"
        //             onClick={handleActivityCheckPaymentStatus}
        //             disabled={activityCheckPaymentStatusMutateLoading}
        //           >
        //             Check
        //           </button>
        //         ),
        //       },
        //     ]
        //   : []),

        // ...(activityData?.isCustomerInvoiced == 1 &&
        // activityData?.customerInvoiceNumber &&
        // activityData?.customerInvoicePath
        //   ? [
        //       {
        //         label: "Send Customer Invoice",
        //         btnLink: "Send Email",
        //         btnLinkAction: (e) => {
        //           emailPanel?.current?.toggle(e);
        //         },
        //         btnDisabled:
        //           user?.role?.id == 3 &&
        //           user?.levelId !== 1045 &&
        //           id == caseData?.agentId
        //             ? false
        //             : true,
        //       },
        //       {
        //         label: "Customer Invoice",
        //         value: (
        //           <a
        //             className="btn-text btn-link"
        //             target="_blank"
        //             href={activityData?.customerInvoicePath}
        //           >
        //             Download
        //           </a>
        //         ),
        //       },
        //     ]
        //   : []),

        ...(activityData?.asp &&
        caseData?.caseStatusId == 2 &&
        (activityData?.activityStatusId == 3 ||
          activityData?.activityStatusId == 7)
          ? [
              {
                label: "Tracking Link",
                value: (
                  <button
                    className="btn-text btn-link"
                    onClick={() => {
                      setServiceProviderTrackingVisible(true);
                      setTrackLinkAspName(activityData?.asp?.name);
                    }}
                  >
                    View
                  </button>
                ),
              },
            ]
          : []),
        ...(activityData?.activityStatusId != 4 &&
        activityData?.hasAdditionalKmForPayment &&
        !activityData?.paymentForAdditionalKmCaptured &&
        (activityData?.customerAgreedToAdditionalPayment == null ||
          activityData?.customerAgreedToAdditionalPayment == 1)
          ? [
              {
                label: "Payment For Additional KM",
                value: (
                  <button
                    className="btn-text btn-link"
                    onClick={handleAdditionalKmPaymentClick}
                  >
                    Send Link
                  </button>
                ),
              },
            ]
          : []),

        // Commented out - Moved to transactions tab
        // ...(caseData?.caseStatusId === 2 &&
        // activityData?.isCustomerInvoiced &&
        // !activityData?.refundStatusId &&
        // activityData?.enableRefund
        //   ? [
        //       {
        //         label: "Cancellation",
        //         ...{
        //           btnLink: "Initiate",
        //           btnLinkAction: () => {
        //             setInitiateCancellationDialogVisible(true);
        //           },
        //         },
        //       },
        //     ]
        //   : []),
        // ...(caseData?.cancellationStatusId
        //   ? [
        //       {
        //         label: "Cancellation Status",
        //         badge: caseData?.cancellationStatus,
        //         statusId: caseData?.cancellationStatusId,
        //         statusType: "cancellationStatus",
        //       },
        //     ]
        //   : []),
        // ...(caseData?.isCancellationInvoiced
        //   ? [
        //       {
        //         label: "Cancellation Invoice Number",
        //         value: caseData?.cancellationInvoiceNumber ?? "--",
        //       },
        //       // {
        //       //   label: "Cancellation Invoice Date",
        //       //   value: caseData?.cancellationInvoiceDate ?? "--",
        //       // },
        //       {
        //         label: "Cancellation Invoice",
        //         value: (
        //           <a
        //             className="btn-text btn-link"
        //             target="_blank"
        //             href={caseData?.cancellationInvoicePath}
        //           >
        //             Download
        //           </a>
        //         ),
        //       },
        //     ]
        //   : []),
        // ...(caseData?.cancellationStatusId === 1312
        //   ? [
        //       {
        //         label: "Cancellation Rejected Reason",
        //         value: caseData?.cancellationRejectedReason ?? "--",
        //       },
        //     ]
        //   : []),
        // ...(activityData?.refundStatusId
        //   ? [
        //       {
        //         label: "Refund Type",
        //         value: activityData?.refundType ?? "--",
        //       },
        //       {
        //         label: "Refund Amount",
        //         value: activityData?.refundAmount
        //           ? new Intl.NumberFormat("en-IN", {
        //               style: "currency",
        //               currency: "INR",
        //             }).format(parseFloat(activityData.refundAmount))
        //           : "--",
        //       },
        //       {
        //         label: "Refund Reason",
        //         value: activityData?.refundReason ?? "--",
        //       },
        //       {
        //         label: "Refund Status",
        //         badge: activityData?.refundStatus,
        //         statusId: activityData?.refundStatusId,
        //         statusType: "refundStatus",
        //       },
        //       ...(activityData?.refundId && activityData?.refundStatusId == 1301
        //         ? [
        //             {
        //               label: "Check Refund Status",
        //               value: (
        //                 <Button
        //                   label="Check Status"
        //                   className="btn-sm btn-primary"
        //                   onClick={handleCheckRefundStatus}
        //                   loading={
        //                     checkRefundStatusLoading ||
        //                     checkRefundStatusMutateLoading
        //                   }
        //                   disabled={
        //                     checkRefundStatusLoading ||
        //                     checkRefundStatusMutateLoading
        //                   }
        //                 />
        //               ),
        //             },
        //           ]
        //         : []),
        //     ]
        //   : []),
        ...(digitalInventorAttachment
          ? [
              {
                label: "Digital Inventory",
                value: (
                  <a
                    className="btn-text btn-link"
                    target="_blank"
                    href={`${FileBaseUrl}${digitalInventorAttachment.fileName}`}
                  >
                    Download
                  </a>
                ),
              },
            ]
          : []),
      ],
    };
  });

  // console.log('serviceInfo', serviceInfo)

  const handleActivityStatusFormSubmit = (values) => {
    // console.log('ASP Activity Form Values', values);
    // if (aspResultData[activeIndex]?.aspActivityStatusId == 14) {
    //   let breakdownSla = checkSlaReachedBD(
    //     aspResultData[activeIndex],
    //     aspResultData[activeIndex]?.extras?.slaSettings,
    //     870,
    //     caseData?.breakdownAreaLocationTypeId
    //   );
    //   if (breakdownSla == "violated") {
    //     setSlaBreakdownEnable(true);
    //   }
    // }
    aspActivityStatusMutate(
      {
        ...values,
        activityId: aspResultData[activeIndex]?.activityId,
        fromLogTypeId: 240,
        slaViolateReasonId: values?.slaViolateReasonId?.id || null,
        slaViolateReasonComments: values?.slaViolateReasonId?.name || null,
        dateTime: values?.dateTime
          ? moment(values?.dateTime).format("YYYY-MM-DD HH:mm:ss")
          : "",
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            statusChangePanel?.current?.hide();
            aspRefetch[activeIndex]?.refetch();
            ActivityStatusReset();
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

  const serviceDetailsItems = [
    {
      label: "Service",
      value: "Towing",
    },
    {
      label: "Sub Service",
      value: "No",
    },
    {
      label: "Service Status",
      value: "Open",
      vlaueClassName: "info-badge info-badge-green",
      action: "Change",
      actionClick: () => console.log("Change Service Status"),
    },
    {
      label: "ASP Workshop Name",
      value: "ARK Automobiles",
    },
    {
      label: "ASP Code",
      value: "TNF020",
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "Activity Status",
      value: "Not Started",
      vlaueClassName: "info-badge info-badge-red",
      action: "Change",
      actionClick: handleChangeActivity,
    },
    {
      label: "ASP",
      action: "Assign ASP",
      actionClick: () => console.log("Assign ASP"),
    },
    {
      label: "ASP Cancelled Reason",
      value: "Long Distance",
    },
    {
      label: "Service Details",
      action: "View",
      actionClick: () => navigate("/cases/view/service-details"),
    },
    {
      label: "Mechanic Contact",
      value: "9876453234",
      vlaueClassName: "info-badge info-badge-yellow",
      action: "Call",
      actionClick: () => console.log("call"),
    },

    {
      label: "ETA",
      labelIcon: InfoDarkIcon,
      value: "10 (min)",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Mechanic Name",
      value: "Jai Surya Kumar K",
      action: "Edit",
      actionClick: () => console.log("Edit Mechanic Name"),
    },
    {
      label: "Assignment Delay Reason",
      value: "Long Distance",
    },
    {
      label: "Comment by ASP",
      value: "Starting to BD in 5 mins",
    },
  ];

  const activityEventsTemp = [
    {
      icon: SystemTimeLineIcon,
      title: "Reminder to call ASP",
      date: "Jan 19 2023 1:35",
      content: (
        <>
          <p className="accordian-short-content">
            Ask the ASP if he reached breakdown location.
          </p>
          <div className="customer-call-content">
            <div className="call-details-container">
              <div className="call-detail-title">Priority</div>
              <div className="call-detail-info danger">High</div>
            </div>
            <div className="call-details-container">
              <div className="call-detail-title">Reminder</div>
              <div className="call-detail-info">02:30:00</div>
            </div>
            <div className="call-details-container">
              <div className="call-detail-title">Customer</div>
              <button className="btn-link btn-text btn-with-icon expand-timeline-btn">
                <img src={ContactImage} />
                Call Asp
              </button>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: ChatTimeLineIcon,
      title: "SMS to Customer",
      date: "Jan 19 2023 1:35",
      content: (
        <p className="accordian-short-content">
          Dear Customer, For ticket no: TN70AM2694 , Our Service person has
          reached near the breakdown location , will need your guidance to reach
          the exact spot. Please call toll free : 9000 0009 for support. Team
          TVS Auto Assist
        </p>
      ),
    },
    {
      icon: MobileTimeLineIcon,
      title: "Start to BD Location",
      date: "Jan 19 2023 1:35",
      content: (
        <p className="accordian-short-content">
          ASP Started to Drop Location, Will be reaching breakdown in 30 mins.
        </p>
      ),
    },
  ];

  const activityEvents = aspResultData[activeIndex]?.activityLogs
    ?.filter((log) => !(role.id === 2 && log?.typeId === 242))
    ?.map((log) => {
      return {
        icon: TimeLineIcons[log?.typeId],
        title: (
          <>
            {log?.title}
            {log?.description && (
              <div
                className="timeline-content"
                dangerouslySetInnerHTML={{ __html: log?.description }}
              />
            )}
          </>
        ),
        date: log?.createdAt,
        content: (
          <>
            {/* <div className="accordian-short-content">
            {log?.description}
          </div> */}
            {log?.typeId == 242 && (
              <div className="interaction-content">
                <div className="interaction-details-container">
                  <div className="interaction-detail-title">Channel</div>
                  <div className="interaction-detail-info">{log?.channel}</div>
                </div>
                <div className="interaction-details-container">
                  <div className="interaction-detail-title">Call Type</div>
                  <div className="interaction-detail-info">{log?.callType}</div>
                </div>
                <div className="interaction-details-container">
                  <div className="interaction-detail-title">InteractionTo</div>
                  <div className="interaction-detail-info">
                    {log?.interactionTo}
                  </div>
                </div>
              </div>
            )}
            {log?.typeId == 243 && (
              <div className="customer-call-content">
                <div className="call-details-container">
                  <div className="call-detail-title">Priority</div>
                  <div className="call-detail-info danger">High</div>
                </div>
                <div className="call-details-container">
                  <div className="call-detail-title">Reminder</div>
                  <div className="call-detail-info">02:30:00</div>
                </div>
                <div className="call-details-container">
                  <div className="call-detail-title">Customer</div>
                  <button className="btn-link btn-text btn-with-icon expand-timeline-btn">
                    <img src={ContactImage} />
                    Call Asp
                  </button>
                </div>
              </div>
            )}
          </>
        ),
      };
    });

  const inventoryItems = [
    {
      label: "Date & Time",
      value: "02/03/2022 20:20 AM",
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "ASP Code",
      value: "29947887",
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "ASP Name",
      value: "Arun Kumar",
    },
    {
      label: "ASP Start Location",
      value: (
        <div>
          Ranganath, Extension, Gopal Gowda,Shivamogga,
          <span className="blue_text">View All</span>
        </div>
      ),
    },
    {
      label: "Call centre Executive Name",
      value: "Gopi Jayabal",
      vlaueClassName: "",
    },
    {
      label: "Breakdown Ticket No",
      value: "29644264726480470",
      vlaueClassName: "",
    },
    {
      label: "Breakdown Ticket Date & Time",
      value: "02/03/2022 20:20 AM",
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "Customer Name",
      value: "Ajay Sharma",
      vlaueClassName: "",
    },
    {
      label: "Vehicle No",
      value: "TN70AM2694",
      vlaueClassName: "",
    },
    {
      label: "Vehicle Make",
      value: "Honda",
    },
    {
      label: "Vehicle Model",
      value: "City",
      vlaueClassName: "",
    },
    {
      label: "Customer Vehicle ODO Reading",
      value: "27436 KM",
      vlaueClassName: "",
    },
    {
      label: "Breakdown Location",
      value: <div className="blue_text">View</div>,
      vlaueClassName: "",
    },
    {
      label: "Reach Time",
      value: "20:20 AM",
      vlaueClassName: "",
    },
    {
      label: "Customer Complaint",
      value: "Starting Problem - battery drained overnight.",
      vlaueClassName: "",
    },
    {
      label: "ASP Observation",
      value: "Battery drained overnight. Need to change Battery",
      vlaueClassName: "",
    },
    {
      label: "Failed Part Name",
      value: "",
      vlaueClassName: "",
    },
    {
      label: "Repair Completed",
      value: "Yes",
      vlaueClassName: "info-badge info-badge-green",
    },
  ];

  const handleAttachmentView = (typeId, activitData) => {
    // console.log('typeId', typeId);
    // console.log('activitData', activitData);
    // console.log('handleAttachmentView', activitData?.rsaActivityInventoryAttachments?.filter(attachment => {return typeId?.includes(attachment?.attachmentTypeId)}))
    setAttachementArray(
      activitData?.rsaActivityInventoryAttachments?.filter((attachment) => {
        return typeId?.includes(attachment?.attachmentTypeId);
      })
    );
    setAttachmentVisible(true);
  };

  const generateInventoryData = (data) => {
    // console.log("Activity Inventory ", data);
    if (data?.serviceId == 2) {
      const inventoryData = data?.rsaActivityInventory?.map((item) => {
        return {
          label: "Breakdown",
          typeId: item?.typeId,
          data: [
            // {
            //   label: "Date & Time",
            //   value: item?.createdAt || "--",
            //   vlaueClassName: "info-badge info-badge-purple",
            // },
            {
              label: "ASP Code",
              value: data?.asp?.code,
              vlaueClassName: "info-badge info-badge-purple",
            },
            {
              label: "ASP Name",
              value: data?.asp?.name,
            },
            {
              label: "ASP Start Location",
              value: data?.asp?.location,
              /* value: (
                <div>
                  Ranganath, Extension, Gopal Gowda,Shivamogga,
                  <span className="blue_text">View All</span>
                </div>
              ), */
            },
            /* {
              label: "Call centre Executive Name",
              value: data?.asp?.location || "--",
              vlaueClassName: "",
            }, */
            {
              label: "Breakdown Ticket No",
              value: data?.caseDetail?.caseNumber,
              vlaueClassName: "",
            },
            {
              label: "Breakdown Ticket Date & Time",
              value: data?.caseDetail?.caseCreatedDateTime,
              vlaueClassName: "info-badge info-badge-purple",
            },
            {
              label: "Customer Name",
              value: data?.caseDetail?.caseInformation?.customerContactName,
              vlaueClassName: "",
            },
            {
              label: "Vehicle No",
              value: data?.caseDetail?.registrationNumber,
              vlaueClassName: "",
            },
            {
              label: "Vehicle Make",
              value: data?.caseDetail?.vehicleMake,
            },
            {
              label: "Vehicle Model",
              value: data?.caseDetail?.vehicleModel,
              vlaueClassName: "",
            },
            {
              label: "Customer Vehicle ODO Reading",
              value: data?.caseDetail?.caseInformation?.runningKm || "--",
              vlaueClassName: "",
            },
            {
              label: "Breakdown Location",
              value: data?.caseDetail?.caseInformation?.breakdownLocation,
              vlaueClassName: "",
            },
            {
              label: "Reach Time",
              value: data?.aspReachedToBreakdownAt,
              vlaueClassName: "info-badge info-badge-purple",
            },
            {
              label: "Customer Complaint",
              value: data?.caseDetail?.caseInformation?.voiceOfCustomer || "--",
              vlaueClassName: "",
            },
            {
              label: "ASP Observation",
              value: data?.issueComments || "--",
              vlaueClassName: "",
            },
            {
              label: "Failed Part Name",
              value: item?.failedPartName,
              vlaueClassName: "",
            },
            {
              label: "Repair Completed",
              value: data?.serviceStatus ? "Yes" : "No",
              vlaueClassName: `info-badge info-badge-${
                data?.serviceStatus ? "green" : "red"
              }`,
            },
            {
              label: "Repair Work",
              value: item?.repairWork,
              vlaueClassName: "",
            },
            {
              label: "Repair Complete Time",
              value: data?.serviceDuration,
              vlaueClassName: "info-badge info-badge-purple",
            },
            {
              label: "Photo of Failed Parts",
              ...(data?.rsaActivityInventoryAttachments?.filter(
                (attachment) => {
                  return [85]?.includes(attachment?.attachmentTypeId);
                }
              )?.length > 0
                ? {
                    btnLink: "View",
                    btnLinkAction: () => handleAttachmentView([85], data),
                  }
                : {
                    value: "--",
                  }),
            },
            {
              label: "Photo of Vehicle",
              ...(data?.rsaActivityInventoryAttachments?.filter(
                (attachment) => {
                  return [86]?.includes(attachment?.attachmentTypeId);
                }
              )?.length > 0
                ? {
                    btnLink: "View",
                    btnLinkAction: () => handleAttachmentView([86], data),
                  }
                : {
                    value: "--",
                  }),
            },
            {
              label: "Signature of ASP & Customer",
              ...(data?.rsaActivityInventoryAttachments?.filter(
                (attachment) => {
                  return [87, 88]?.includes(attachment?.attachmentTypeId);
                }
              )?.length > 0
                ? {
                    btnLink: "View",
                    btnLinkAction: () => handleAttachmentView([87, 88], data),
                  }
                : {
                    value: "--",
                  }),
            },
            /* {
              label: "Signature of Dealer",
              value: item?.requestDealershipSignature ? 'Requested' : 'Not Requested'
            } */
            {
              label: "Terms and Conditions",
              value: item?.termsAndConditions ? "Accepted" : "Not Accepted",
              vlaueClassName: `info-badge info-badge-${
                item?.termsAndConditions ? "green" : "red"
              }`,
            },
          ],
        };
      });
      return inventoryData || [];
    } else {
      const breakdownInventory = data?.rsaActivityInventory
        ?.filter((inventory) => inventory?.typeId == 162)
        ?.map((item) => {
          return {
            label: "Breakdown",
            typeId: item?.typeId,
            data: [
              {
                title: "Towing Inventory",
                accordinData: [
                  // {
                  //   label: "Date & Time",
                  //   value: item?.createdAt || "--",
                  //   vlaueClassName: "info-badge info-badge-purple",
                  // },
                  {
                    label: "ASP Code",
                    value: data?.asp?.code,
                    vlaueClassName: "info-badge info-badge-purple",
                  },
                  {
                    label: "ASP Name",
                    value: data?.asp?.name,
                  },
                  {
                    label: "ASP Start Location",
                    value: data?.asp?.location,
                    /* value: (
                    <div>
                      Ranganath, Extension, Gopal Gowda,Shivamogga,
                      <span className="blue_text">View All</span>
                    </div>
                  ), */
                  },
                  /* {
                  label: "Call centre Executive Name",
                  value: data?.asp?.location || "--",
                  vlaueClassName: "",
                }, */
                  {
                    label: "Breakdown Ticket No",
                    value: data?.caseDetail?.caseNumber,
                    vlaueClassName: "",
                  },
                  {
                    label: "Breakdown Ticket Date & Time",
                    value: data?.caseDetail?.caseCreatedDateTime,
                    vlaueClassName: "info-badge info-badge-purple",
                  },
                  {
                    label: "Customer Name",
                    value:
                      data?.caseDetail?.caseInformation?.customerContactName,
                    vlaueClassName: "",
                  },
                  {
                    label: "Vehicle No",
                    value: data?.caseDetail?.registrationNumber,
                    vlaueClassName: "",
                  },
                  {
                    label: "Vehicle Make",
                    value: data?.caseDetail?.vehicleMake,
                  },
                  {
                    label: "Vehicle Model",
                    value: data?.caseDetail?.vehicleModel,
                    vlaueClassName: "",
                  },
                  {
                    label: "Customer Vehicle ODO Reading",
                    value: data?.caseDetail?.caseInformation?.runningKm || "--",
                    vlaueClassName: "",
                  },
                  {
                    label: "Breakdown Location",
                    value: data?.caseDetail?.caseInformation?.breakdownLocation,
                    vlaueClassName: "",
                  },
                  {
                    label: "Customer Complaint",
                    value:
                      data?.caseDetail?.caseInformation?.voiceOfCustomer ||
                      "--",
                    vlaueClassName: "",
                  },
                  {
                    label: "ASP Observation",
                    value: data?.issueComments || "--",
                    vlaueClassName: "",
                  },
                ],
              },
              {
                title: "Vehicle Inventory",
                accordinData: [
                  {
                    label: "Hub Caps",
                    value: item?.hubCaps,
                    vlaueClassName: "",
                  },
                  {
                    label: "Spare Wheel",
                    value: item?.spareWheel ? "Available" : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.spareWheel ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Jack & Jack Rod",
                    value: item?.jackAndJackRoad
                      ? "Available"
                      : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.jackAndJackRoad ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Audio System",
                    value: item?.audioSystem ? "Available" : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.audioSystem ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Reverse Parking System",
                    value: item?.reverseParkingSystem
                      ? "Available"
                      : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.reverseParkingSystem ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Speakers",
                    value: item?.speakers,
                    // value: item?.speakers ? 'Available' : 'Not Available',
                    // vlaueClassName: `info-badge info-badge-${item?.speakers ? 'green' : 'danger'}`,
                  },
                  {
                    label: "Key With Remote",
                    value: item?.keyWithRemote ? "Available" : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.keyWithRemote ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Aerial",
                    value: item?.aerial ? "Available" : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.aerial ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Floor Mat",
                    value: item?.floorMat,
                    vlaueClassName: "",
                  },
                  {
                    label: "Fixed Idol / Hanging Idol",
                    value: item?.fixedOrHangingIdol
                      ? "Available"
                      : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.fixedOrHangingIdol ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Reached at Breakdown",
                    value: data?.aspReachedToBreakdownAt,
                    vlaueClassName: "info-badge info-badge-purple",
                  },
                  // {
                  //   label: "Signature of ASP & Customer",
                  //   ...(data?.rsaActivityInventoryAttachments?.filter(
                  //     (attachment) => {
                  //       return [87, 88]?.includes(attachment?.attachmentTypeId);
                  //     }
                  //   )?.length > 0
                  //     ? {
                  //         btnLink: "View",
                  //         btnLinkAction: () =>
                  //           handleAttachmentView([87, 88], data),
                  //       }
                  //     : {
                  //         value: "--",
                  //       }),
                  // },
                  {
                    // label: "Image of Car In towing Vehicle",
                    // ...(data?.rsaActivityInventoryAttachments?.filter(
                    //   (attachment) => {
                    //     return [92]?.includes(attachment?.attachmentTypeId);
                    //   }
                    // )?.length > 0
                    //   ? {
                    //       btnLink: "View",
                    //       btnLinkAction: () => handleAttachmentView([92], data),
                    //     }
                    //   : {
                    //       value: "--",
                    //     }),
                    label: "Image of Cluster",
                    ...(data?.rsaActivityInventoryAttachments?.filter(
                      (attachment) => {
                        return [91]?.includes(attachment?.attachmentTypeId);
                      }
                    )?.length > 0
                      ? {
                          btnLink: "View",
                          btnLinkAction: () => handleAttachmentView([91], data),
                        }
                      : {
                          value: "--",
                        }),
                  },
                  {
                    label: "Image of Inner Cabin",
                    ...(data?.rsaActivityInventoryAttachments?.filter(
                      (attachment) => {
                        return [90]?.includes(attachment?.attachmentTypeId);
                      }
                    )?.length > 0
                      ? {
                          btnLink: "View",
                          btnLinkAction: () => handleAttachmentView([90], data),
                        }
                      : {
                          value: "--",
                        }),
                  },

                  {
                    label: "Terms and Conditions",
                    value: item?.termsAndConditions
                      ? "Accepted"
                      : "Not Accepted",
                    vlaueClassName: `info-badge info-badge-${
                      item?.termsAndConditions ? "green" : "red"
                    }`,
                  },
                ],
              },
            ],
          };
        });
      const dropdownInventory = data?.rsaActivityInventory
        ?.filter((inventory) => inventory?.typeId == 161)
        ?.map((item) => {
          return {
            label: "Drop",
            typeId: item?.typeId,
            data: [
              {
                title: "Towing Inventory",
                accordinData: [
                  // {
                  //   label: "Date & Time",
                  //   value: item?.createdAt || "--",
                  //   vlaueClassName: "info-badge info-badge-purple",
                  // },
                  {
                    label: "ASP Code",
                    value: data?.asp?.code,
                    vlaueClassName: "info-badge info-badge-purple",
                  },
                  {
                    label: "ASP Name",
                    value: data?.asp?.name,
                  },
                  {
                    label: "ASP Start Location",
                    value: data?.asp?.location,
                    /* value: (
                    <div>
                      Ranganath, Extension, Gopal Gowda,Shivamogga,
                      <span className="blue_text">View All</span>
                    </div>
                  ), */
                  },
                  /* {
                  label: "Call centre Executive Name",
                  value: data?.asp?.location || "--",
                  vlaueClassName: "",
                }, */
                  {
                    label: "Breakdown Ticket No",
                    value: data?.caseDetail?.caseNumber,
                    vlaueClassName: "",
                  },
                  {
                    label: "Breakdown Ticket Date & Time",
                    value: data?.caseDetail?.caseCreatedDateTime,
                    vlaueClassName: "info-badge info-badge-purple",
                  },
                  {
                    label: "Customer Name",
                    value:
                      data?.caseDetail?.caseInformation?.customerContactName,
                    vlaueClassName: "",
                  },
                  {
                    label: "Vehicle No",
                    value: data?.caseDetail?.registrationNumber,
                    vlaueClassName: "",
                  },
                  {
                    label: "Vehicle Make",
                    value: data?.caseDetail?.vehicleMake,
                  },
                  {
                    label: "Vehicle Model",
                    value: data?.caseDetail?.vehicleModel,
                    vlaueClassName: "",
                  },
                  {
                    label: "Customer Vehicle ODO Reading",
                    value: data?.caseDetail?.caseInformation?.runningKm || "--",
                    vlaueClassName: "",
                  },
                  {
                    label: "Breakdown Location",
                    value: data?.caseDetail?.caseInformation?.breakdownLocation,
                    vlaueClassName: "",
                  },
                  {
                    label: "Customer Complaint",
                    value:
                      data?.caseDetail?.caseInformation?.voiceOfCustomer ||
                      "--",
                    vlaueClassName: "",
                  },
                  {
                    label: "ASP Observation",
                    value: data?.issueComments || "--",
                    vlaueClassName: "",
                  },
                ],
              },
              {
                title: "Vehicle Inventory",
                accordinData: [
                  {
                    label: "Hub Caps",
                    value: item?.hubCaps,
                    vlaueClassName: "",
                  },
                  {
                    label: "Spare Wheel",
                    value: item?.spareWheel ? "Available" : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.spareWheel ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Jack & Jack Rod",
                    value: item?.jackAndJackRoad
                      ? "Available"
                      : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.jackAndJackRoad ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Audio System",
                    value: item?.audioSystem ? "Available" : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.audioSystem ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Reverse Parking System",
                    value: item?.reverseParkingSystem
                      ? "Available"
                      : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.reverseParkingSystem ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Speakers",
                    value: item?.speakers,
                    // value: item?.speakers ? 'Available' : 'Not Available',
                    // vlaueClassName: `info-badge info-badge-${item?.speakers ? 'green' : 'danger'}`,
                  },
                  {
                    label: "Key With Remote",
                    value: item?.keyWithRemote ? "Available" : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.keyWithRemote ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Aerial",
                    value: item?.aerial ? "Available" : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.aerial ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Floor Mat",
                    value: item?.floorMat,
                    vlaueClassName: "",
                  },
                  {
                    label: "Fixed Idol / Hanging Idol",
                    value: item?.fixedOrHangingIdol
                      ? "Available"
                      : "Not Available",
                    vlaueClassName: `info-badge info-badge-${
                      item?.fixedOrHangingIdol ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Reached Dealership Status",
                    value: item?.reachedDealershipStatus ? "Yes" : "No",
                    vlaueClassName: `info-badge info-badge-${
                      item?.reachedDealershipStatus ? "green" : "red"
                    }`,
                  },
                  {
                    label: "Reached at Drop",
                    value: data?.aspReachedToDropAt,
                    vlaueClassName: "info-badge info-badge-purple",
                  },
                  // {
                  //   label: "Signature of ASP & Dealer",
                  //   ...(data?.rsaActivityInventoryAttachments?.filter(
                  //     (attachment) => {
                  //       return [93, 99]?.includes(attachment?.attachmentTypeId);
                  //     }
                  //   )?.length > 0
                  //     ? {
                  //         btnLink: "View",
                  //         btnLinkAction: () =>
                  //           handleAttachmentView([93, 99], data),
                  //       }
                  //     : {
                  //         value: "--",
                  //       }),
                  // },
                  {
                    label: "Vehicle Acknowledged by",
                    value: item?.vehicleAcknowledgedBy,
                    vlaueClassName: "",
                  },
                  {
                    label: "Mobile Number of Receiver",
                    value: item?.mobileNumberOfReceiver,
                    vlaueClassName: "",
                  },
                  {
                    label: "Vehicle with Dealer Background",
                    ...(data?.rsaActivityInventoryAttachments?.filter(
                      (attachment) => {
                        return [95]?.includes(attachment?.attachmentTypeId);
                      }
                    )?.length > 0
                      ? {
                          btnLink: "View",
                          btnLinkAction: () => handleAttachmentView([95], data),
                        }
                      : {
                          value: "--",
                        }),
                  },
                  {
                    // label: "Image of Car In towing Vehicle",
                    // ...(data?.rsaActivityInventoryAttachments?.filter(
                    //   (attachment) => {
                    //     return [98]?.includes(attachment?.attachmentTypeId);
                    //   }
                    // )?.length > 0
                    //   ? {
                    //       btnLink: "View",
                    //       btnLinkAction: () => handleAttachmentView([98], data),
                    //     }
                    //   : {
                    //       value: "--",
                    //     }),
                    label: "Image of Cluster",
                    ...(data?.rsaActivityInventoryAttachments?.filter(
                      (attachment) => {
                        return [97]?.includes(attachment?.attachmentTypeId);
                      }
                    )?.length > 0
                      ? {
                          btnLink: "View",
                          btnLinkAction: () => handleAttachmentView([97], data),
                        }
                      : {
                          value: "--",
                        }),
                  },
                  {
                    label: "Image of Inner Cabin",
                    ...(data?.rsaActivityInventoryAttachments?.filter(
                      (attachment) => {
                        return [96]?.includes(attachment?.attachmentTypeId);
                      }
                    )?.length > 0
                      ? {
                          btnLink: "View",
                          btnLinkAction: () => handleAttachmentView([96], data),
                        }
                      : {
                          value: "--",
                        }),
                  },

                  {
                    label: "Terms and Conditions",
                    value: item?.termsAndConditions
                      ? "Accepted"
                      : "Not Accepted",
                    vlaueClassName: `info-badge info-badge-${
                      item?.termsAndConditions ? "green" : "red"
                    }`,
                  },
                ],
              },
            ],
          };
        });
      return [
        ...(data?.aspReachedToBreakdownAt
          ? [
              {
                label: "Breakdown",
                typeId: 162,
                data:
                  breakdownInventory?.length > 0
                    ? breakdownInventory[0]?.data
                    : [],
              },
            ]
          : []),
        ...(data?.aspReachedToDropAt
          ? [
              {
                label: "Drop",
                typeId: 161,
                data:
                  dropdownInventory?.length > 0
                    ? dropdownInventory[0]?.data
                    : [],
              },
            ]
          : []),
      ];
    }
  };

  const mechanicalInventoryItems = [];

  const handleOtherStatus = () => {
    setOthersStatusVisible(true);
  };
  const handleRemoveFile = (field, files) => {
    setRemarksValue(field, files);
  };

  const handleDeleteFile = (id) => {
    setDeleteAttachments((prevIds) => [...prevIds, id]);
  };
  // console.log({ deleteAttachments });

  const handleStatusChangeOthers = (values) => {
    // console.log("++++++++", values);

    const formValues = new FormData();

    formValues.append("activityId", aspResultData[activeIndex]?.activityId);
    formValues.append("serviceId", aspResultData[activeIndex]?.serviceId);
    formValues.append("isFileOptional", true);
    formValues.append("disableFileMaxSizeCheck", true);
    if (editMode) {
      formValues.append(
        "activityStatusId",
        aspResultData[activeIndex]?.activityStatusId
      );
      formValues.append(
        "activityStatusName",
        aspResultData[activeIndex]?.activityStatus
      );
    } else {
      formValues.append("activityStatusId", activityStatusId?.id);
      formValues.append("activityStatusName", activityStatusId?.name);
    }

    Object.entries(values)?.forEach(([key, value]) => {
      if (key === "files" && Array.isArray(value) && value?.length > 0) {
        // Only append files if the key exists and has at least one file
        value?.forEach((file) => {
          formValues.append(key, file);
        });
      } else if (key !== "files") {
        // Append other values normally
        formValues.append(key, value);
      }
    });

    if (deleteAttachments && deleteAttachments.length > 0) {
      // Filter out attachments that are in the deleteAttachments array
      const remainingAttachments = aspResultData[
        activeIndex
      ]?.otherServiceAttachments.filter(
        (attachment) => !deleteAttachments.includes(attachment.id)
      );

      // Append remaining attachment IDs to formValues
      if (remainingAttachments.length > 0) {
        remainingAttachments.forEach((attachment) => {
          formValues.append("attachmentIds[]", attachment.id);
        });
      } else {
        // If no remaining attachments, append an empty array
        formValues.append("attachmentIds[]", []);
      }
    } else {
      // If deleteAttachments is empty, append all IDs from otherServiceAttachments
      aspResultData[activeIndex]?.otherServiceAttachments?.forEach(
        (attachment) => {
          formValues.append("attachmentIds[]", attachment.id);
        }
      );
    }

    updatedStatusMutate(formValues, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setOthersStatusVisible(false);
          RemarksStatusReset();
          setDeleteAttachments([]);
          aspRefetch[activeIndex]?.refetch();
          setEditMode(false);
          setOthersStatus("activityStatusId", null); // Reset field
          OthersStatusReset();
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
          setEditMode(false);
        }
      },
    });
  };
  const handleEditOthersStatus = () => {
    aspRefetch[activeIndex]?.refetch();
    setEditMode(true);
    setOthersStatusVisible(true);
    setRemarksValue("remarks", aspResultData[activeIndex]?.remarks);
  };

  //Reimbursement API
  const {
    data: reimbursementMappingData,
    mutate: reimbursementMappingMutation,
    isLoading: reimbursementMappingLoading,
  } = useMutation(reimbursementMapping);
  //Reimbursement Options
  const reimbursementOptions = [
    {
      id: 1,
      label: "Yes",
    },
    {
      id: 0,
      label: "No",
    },
  ];
  const handleReimbursementStatus = () => {
    setReimbursementDialogVisible(true);
    setSelectedReimbursementOption([]);
  };
  const handleViewOthersAttachments = () => {
    setAttachmentDialogVisible(true);
  };

  const handleReimbursementOptionSelect = (items) => {
    setSelectedReimbursementOption(items);
    // console.log("items...", selectedReimbursementOption);
    reimbursementReset();
  };

  const onReimbursementSubmit = (data) => {
    reimbursementMappingMutation(
      {
        comments: data?.comments ? data?.comments : null,
        isReimbursement: selectedReimbursementOption?.[0],
        activityId: aspResultData[activeIndex]?.activityId,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setReimbursementDialogVisible(false);
            reimbursementReset();
            aspRefetch[activeIndex]?.refetch();
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

  const updatePickTime = (data) => {
    // console.log("data update pick time", data);
    updatePickupTimeMutate(
      {
        activityId: aspResultData[activeIndex]?.activityId,
        slaViolateReasonId: data?.slaViolateReasonId?.id || null,
        slaViolateReasonComments: data?.slaViolateReasonId?.name || null,
      },
      {
        onSuccess: (res) => {
          // console.log("resssssss    ", res);
          if (res?.data?.success) {
            // console.log("resssssss    ", res);
            toast.success(res?.data?.message);
            setPickTimeConfirmDialog(false);
            setSlaReasonVisible(false);
            aspRefetch[activeIndex]?.refetch();
          } else {
            if (res?.data?.error) {
              setPickTimeConfirmDialog(false);
              setSlaReasonVisible(false);
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleUpdatePickupTime = () => {
    // console.log("data &&&&", aspResultData[activeIndex]);
    // check sla violated or not. if violated, get the sl reason before updating pick time.
    // console.log(
    //   "agent pick time ",
    //   aspResultData[activeIndex]?.extras.slaSettings
    // );
    let agentPickedAt = checkSla(
      aspResultData[activeIndex],
      aspResultData[activeIndex]?.extras?.slaSettings,
      366,
      null
    );
    // console.log("agen picked at", agentPickedAt);
    if (agentPickedAt == "achieved") {
      updatePickTime({});
    } else if (agentPickedAt == "violated") {
      setSlaReasonVisible(true);
    }
  };
  const customerInvoiceSend = (values) => {
    customerInvoiceMutate(
      {
        activityId: aspResultData[activeIndex]?.activityId,
        ...values,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            emailPanel?.current?.hide();
            CustomerInvoiceReset();
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
  const handleServiceDetail = () => {
    setServiceDetailList(false);
  };

  // Handler for customer agreement confirmation
  const handleCustomerAgreementConfirm = () => {
    if (customerAgreedToPayment === true) {
      // Customer agreed - show send link dialog
      setAdditionalKmPaymentDialogVisible(false);
      setCustomerAgreedToPayment(null);
      setCustomerPaymentComments("");
      setSendLinkDialogVisible(true);
    } else if (customerAgreedToPayment === false) {
      // Customer did not agree - validate comments and call storeAdditionalPaymentDisagreement
      if (!customerPaymentComments || customerPaymentComments.trim() === "") {
        toast.error("Comments are required when customer does not agree");
        return;
      }

      storeAgreementMutate(
        {
          activityId: aspResultData[activeIndex]?.activityId,
          customerAgreedToAdditionalPayment: false,
          additionalPaymentRemarks: customerPaymentComments,
          authUserId: user?.id || 1,
        },
        {
          onSuccess: (res) => {
            if (res?.data?.success) {
              toast.success(res?.data?.message);
              setAdditionalKmPaymentDialogVisible(false);
              setCustomerAgreedToPayment(null);
              setCustomerPaymentComments("");
              aspRefetch[activeIndex]?.refetch();
              caseDetailrefetch();
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
    }
  };

  // Calculate discount amount
  const calculateDiscountAmount = (percentage, netAmount) => {
    if (!percentage || !netAmount) return 0;
    const discount = parseFloat((netAmount * percentage) / 100);
    return discount.toFixed(2);
  };

  // Handler for sending payment link
  const handleSendLinkSubmit = async () => {
    const isValid = await payTrigger([
      "discountReasonId",
      "sendPaymentLinkTo",
      "customerTypeId",
      "legalName",
      "tradeName",
      "gstin",
    ]);

    if (!isValid) {
      return;
    }

    let customerTypeName = null;
    if (customerTypeId) {
      const selectedCustomerType = nonMemberCustomerTypes?.data?.data?.find(
        (nonMemberCustomerType) => nonMemberCustomerType.id === customerTypeId
      );
      if (selectedCustomerType) {
        customerTypeName = selectedCustomerType.name;
      }
    }

    sendLinkMutate(
      {
        activityId: aspResultData[activeIndex]?.activityId,
        paymentLinkSentTo: sendPaymentLinkTo,
        discountReasonId: selectedDiscountReason?.id
          ? selectedDiscountReason?.id
          : null,
        discountReason: selectedDiscountReason?.name
          ? selectedDiscountReason?.name
          : null,
        discountPercentage: discountPercent ? discountPercent : null,
        discountAmount: discountAmount ? discountAmount : null,
        customerTypeId: customerTypeId,
        customerTypeName: customerTypeName,
        legalName: legalName ? legalName : null,
        tradeName: tradeName ? tradeName : null,
        gstin: gstin ? gstin : null,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setSendLinkDialogVisible(false);
            payReset();
            setSelectedDiscountReason(null);
            setDiscountPercent(0);
            setDiscountAmount(0);
            setLegalName(null);
            setTradeName(null);
            setGstin(null);
            aspRefetch[activeIndex]?.refetch();
            caseDetailrefetch();
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

  // Calculate discount when percentage changes
  useEffect(() => {
    if (
      discountPercent &&
      aspResultData[activeIndex]?.additionalKmEstimatedTotalAmount
    ) {
      const calculatedDiscount = calculateDiscountAmount(
        discountPercent,
        aspResultData[activeIndex]?.additionalKmEstimatedTotalAmount
      );
      setDiscountAmount(calculatedDiscount);
      setPayvalue("discountAmount", calculatedDiscount);
    } else {
      setDiscountAmount(0);
      setPayvalue("discountAmount", null);
    }
  }, [
    discountPercent,
    aspResultData[activeIndex]?.additionalKmEstimatedTotalAmount,
  ]);

  const roundDownToNearest15 = (date) => {
    const minutes = date.getMinutes();
    const flooredMinutes = Math.floor(minutes / 15) * 15;
    const roundedDate = new Date(date);
    roundedDate.setMinutes(flooredMinutes);
    roundedDate.setSeconds(0);
    roundedDate.setMilliseconds(0);
    return roundedDate;
  };

  const {
    mutate: getServiceProviderLiveLocationMutation,
    isLoading,
    data: serviceProviderLiveLocationData,
  } = useMutation(getServiceProviderLiveLocation);

  const handleServiceProviderApiLoad = (map, maps) => {
    let openInfoWindow = null; // Track the currently open InfoWindow

    getServiceProviderLiveLocationMutation(
      {
        activityId: aspResultData[activeIndex]?.activityId,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            const aspLiveLocation = {
              lat: Number(res?.data?.data?.trackLinkResponse?.liveLocationLat),
              lng: Number(res?.data?.data?.trackLinkResponse?.liveLocationLong),
            };
            const breakdownLocation = {
              lat: Number(res?.data?.data?.trackLinkResponse?.bdLat),
              lng: Number(res?.data?.data?.trackLinkResponse?.bdLong),
            };
            const dropLocation = res?.data?.data?.trackLinkResponse?.dropLat
              ? {
                  lat: Number(res?.data?.data?.trackLinkResponse?.dropLat),
                  lng: Number(res?.data?.data?.trackLinkResponse?.dropLong),
                }
              : null;
            const aspLocation = {
              lat: Number(res?.data?.data?.trackLinkResponse?.aspLocationLat),
              lng: Number(res?.data?.data?.trackLinkResponse?.aspLocationLong),
            };

            setBdLat(res?.data?.data?.trackLinkResponse?.bdLat);
            setBdLng(res?.data?.data?.trackLinkResponse?.bdLong);

            // Create markers and info popups with location names
            const createMarkerWithInfo = (
              position,
              title,
              locationName,
              icon
            ) => {
              const marker = new google.maps.Marker({
                position,
                map,
                title,
                icon,
              });

              const infoWindow = new google.maps.InfoWindow({
                content: `<div class="asp-location">
                                <div class="location-title">${title}</div>
                                <div class="location-detail">${
                                  locationName || "Location not provided."
                                }</div>
                              </div>`,
              });

              marker.addListener("click", () => {
                if (openInfoWindow) {
                  openInfoWindow.close(); // Close the previously open InfoWindow
                }
                infoWindow.open(map, marker);
                openInfoWindow = infoWindow; // Update the reference to the currently open InfoWindow
              });

              return marker;
            };

            // Add markers with InfoWindows
            createMarkerWithInfo(
              aspLiveLocation,
              "ASP Live Location",
              "ASP Current Location",
              RedLocationMarker
            );

            createMarkerWithInfo(
              breakdownLocation,
              "Breakdown Location",
              res?.data?.data?.trackLinkResponse?.bdLocation,
              VehicleLocationBlueMarker
            );

            createMarkerWithInfo(
              aspLocation,
              "ASP Location",
              res?.data?.data?.trackLinkResponse?.aspLocation,
              StartLocation
            );

            if (dropLocation) {
              createMarkerWithInfo(
                dropLocation,
                "Drop Location",
                res?.data?.data?.trackLinkResponse?.dropLocation,
                EndLocation
              );
            }

            // Close info window when clicking outside
            google.maps.event.addListener(map, "click", () => {
              if (openInfoWindow) {
                openInfoWindow.close();
                openInfoWindow = null; // Reset the reference
              }
            });

            // Define directions request only with available locations
            const waypoints = dropLocation
              ? [{ location: breakdownLocation, stopover: true }]
              : [];

            const request = {
              origin: aspLocation,
              destination: dropLocation || breakdownLocation,
              waypoints,
              travelMode: "DRIVING",
            };

            const directionsService = new google.maps.DirectionsService();
            directionsService?.route(request, (response, status) => {
              if (status === "OK") {
                const directionsRenderer = new google.maps.DirectionsRenderer({
                  directions: response,
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                  },
                });
                directionsRenderer.setMap(map);
              } else {
                console.error("Error fetching directions:", status);
              }
            });
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

  return (
    <div className="tab-body scroll-hidden">
      {/* <Accordion
        className="accordian-custom-header service-tab-accordian"
        expandIcon={(options) => <CollapsePlusIcon {...options.iconProps} />}
        collapseIcon={(options) => <CollapseMinusIcon {...options.iconProps} />}
      >
        <AccordionTab
          header={<div className="accordian-title">Entitlement Details</div>}
        >
          <ServiceDetailCard
            tabMenu={false}
            companyName={true}
            className="entilement-deails"
            tableClassName="entilement-accordian-table"
          />
        </AccordionTab>
      </Accordion> */}
      <div className="service-header">
        <div className="service-title">Services</div>
        {serviceInfo?.length > 0 &&
          userTypeId == 141 &&
          caseData?.caseStatusId !== 4 &&
          caseData?.caseStatusId !== 3 &&
          caseData?.caseStatusId == 2 &&
          // user?.role?.id == 3
          permissions?.includes("case-add-service-web") &&
          id == caseData?.agentId && (
            <button
              className="btn-link btn-text btn-with-icon"
              onClick={() => setServiceVisible(true)}
              disabled={user?.levelId == 1045}
            >
              <AddBlueIcon />
              Add Service
            </button>
          )}
      </div>
      {serviceInfo?.length > 0 ? (
        <Accordion
          className="accordian-custom-header service-tab-accordian"
          expandIcon={(options) => <CollapsePlusIcon {...options.iconProps} />}
          collapseIcon={(options) => (
            <CollapseMinusIcon {...options.iconProps} />
          )}
          // multiple={true}
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {serviceInfo?.map((aspServiceInfo, i) => (
            <AccordionTab
              className="custom-accordian-tab"
              tabIndex={i}
              key={aspServiceInfo?.id}
              headerTemplate={(e) => {
                return (
                  <div className="accordian-title d-flex align-items-center gap-2">
                    <span>{aspServiceInfo?.title}</span>
                    <StatusBadge
                      className={"badge-chip"}
                      text={aspServiceInfo?.status}
                      statusId={aspServiceInfo?.statusId}
                      statusType="activityStatus"
                    />
                    {aspServiceInfo?.code && (
                      <Chip
                        className="info-chip violet"
                        label={aspServiceInfo?.code}
                      />
                    )}
                  </div>
                );
              }}
            >
              {aspResultData[i]?.agentPickedAt == null &&
                caseData?.caseStatusId == 2 &&
                // user?.role?.id==3
                permissions?.includes("pick-service-web") &&
                id == caseData?.agentId &&
                aspResultData[i]?.activityStatusId != 8 && (
                  <div className="d-flex bg-white">
                    <div className="service-info">
                      Click 'Pick Service' to start this service and update the
                      pick-up time
                    </div>
                    <Button
                      label="Pick Service"
                      className="p-button-link"
                      style={{
                        color: "#007bff",
                        fontWeight: "bold",
                      }}
                      onClick={() => setPickTimeConfirmDialog(true)}
                      disabled={user?.levelId == 1045}
                    />
                  </div>
                )}
              {aspResultData[i]?.agentPickedAt && (
                <div className="bg-white pick-time-info">
                  Picked by {aspResultData[i]?.agentPickedAt}
                </div>
              )}
              <ServiceAccordianTabs
                setVisible={setVisible}
                setActivityDialogVisible={setActivityDialogVisible}
                setInteractionDialogeVisible={setInteractionDialogeVisible}
                setReminderDialogeVisible={setReminderDialogeVisible}
                serviceDetailsTabData={aspServiceInfo?.serviceDetailsItems}
                activityTabData={activityEvents}
                inventoryTabData={generateInventoryData(aspResultData[i])}
                aspResultData={aspResultData}
                caseData={caseData}
                aspRefetch={aspRefetch}
                activeServiceIndex={activeIndex}
                caseDetailrefetch={caseDetailrefetch}
              />
              {/* {serviceDetailList &&
                <ViewServiceDetails caseViewData={caseViewData} aspResultData={aspResultData[activeIndex]} />
              } */}
              <Dialog
                // className="reimbursement-dialog"
                className="w-372"
                position={"bottom"}
                header={
                  <div className="dialog-header">
                    <div className="dialog-header-title">
                      Update Reimbursement
                    </div>
                  </div>
                }
                visible={reimbursementDialogVisible}
                onHide={() => setReimbursementDialogVisible(false)}
                closable
                draggable={false}
                footer={
                  <div className="dialog-footer">
                    <Button
                      className="btn form-submit-btn"
                      type="submit"
                      form="reimbursement-form"
                      loading={reimbursementMappingLoading}
                      disabled={
                        selectedReimbursementOption?.length > 0 ? false : true
                      } // Disable button if no option is selected
                    >
                      Update
                    </Button>
                  </div>
                }
              >
                <form
                  onSubmit={handleReimbursementSubmit(onReimbursementSubmit)}
                  id="reimbursement-form"
                >
                  <label className="dialog-header-title mb-3">
                    Reimbursement
                  </label>
                  <div className="message-way-container">
                    <SelectableButtons
                      multiple={false}
                      items={reimbursementOptions}
                      onSelect={handleReimbursementOptionSelect}
                      //defaultItems={selectedmessageOptions}
                    />
                  </div>
                  {selectedReimbursementOption?.[0] == 1 &&
                    selectedReimbursementOption !== undefined && (
                      <div className="form-group mt-2">
                        <label className="form-label required">Remarks</label>
                        <Controller
                          name="comments"
                          control={controlReimbursement}
                          rules={{ required: "Remarks is required." }}
                          render={({ field, fieldState }) => (
                            <>
                              {/* <InputText
                                className="reimbursement-comment"
                                {...field}
                                placeholder="Comment"
                              /> */}
                              <InputTextarea
                                className="reimbursement-comment"
                                {...field}
                                placeholder="Comments"
                              />
                              {fieldState?.invalid && (
                                <small className="p-error">
                                  {fieldState?.error?.message}
                                </small>
                              )}
                            </>
                          )}
                        />
                      </div>
                    )}
                </form>
              </Dialog>
            </AccordionTab>
          ))}
        </Accordion>
      ) : (
        <NoDataComponent text="No Activity Service" />
      )}

      <InterActionSidebar
        visible={interactionDialogeVisible}
        setVisible={setInteractionDialogeVisible}
        data={interactionFormData?.data?.data?.extras}
        onSave={handleSaveInteraction}
        isLoading={interactionMutateLoading}
      />
      {reminderDialogeVisible && (
        <ReminderSidebar
          visible={reminderDialogeVisible}
          setVisible={setReminderDialogeVisible}
          formData={reminderFormData?.data?.data}
          onSave={handleSaveReminder}
          isLoading={reminderMutateLoading}
          aspActivityActiveData={aspResultData[activeIndex]}
        />
      )}
      {attachmentVisible && (
        <AttachmentsDialog
          visible={attachmentVisible}
          setVisible={setAttachmentVisible}
          attachments={
            attachementArray &&
            attachementArray?.map((item) => {
              return {
                ...item,
                fileName: item?.originalName,
                filePath: item?.filePath,
              };
            })
          }
          title={"Attachments"}
          download={false}
          deleteFile={false}
        />
      )}

      <ChangeActivityDialog
        visible={activityDialogVisible}
        setVisible={setActivityDialogVisible}
      />
      <OverlayPanel ref={statusChangePanel} className="form-overlay-panel">
        <div>
          <div className="filter-title mb-2">ASP Activity Changes</div>
          {aspActivityStatusId == 15 &&
            isSlaExceeded &&
            aspResultData[activeIndex]?.aspActivityStatusId != 15 && (
              <div className="mb-2">
                <TimerChip label="SLA Violated" type="red" />
              </div>
            )}
        </div>

        <div className="filter-body">
          <form
            onSubmit={handleActivityStatusSubmit(
              handleActivityStatusFormSubmit
            )}
          >
            <div className="d-flex flex-column gap-3_4">
              {aspActivityStatusId == 15 &&
                isSlaExceeded &&
                aspResultData[activeIndex]?.aspActivityStatusId != 15 && (
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form-label required">
                        SLA Violated Reason
                      </label>
                      <Controller
                        name="slaViolateReasonId"
                        control={controlActivityStatus}
                        rules={{ required: "SLA Violated Reason is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              value={field.value}
                              filter
                              placeholder="Select SLA Violated Reason"
                              options={reasons?.data?.data}
                              optionLabel="name"
                              onChange={(e) => {
                                field.onChange(e.value);
                              }}
                            />
                            <div className="p-error">
                              {ActivityStatusErrors &&
                                ActivityStatusErrors[field.name]?.message}
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>
                )}
              <div className="d-flex flex-column gap-3_4">
                <div className="form-group">
                  <label className="form-label filter-label required">
                    Status{" "}
                  </label>
                  <Controller
                    name="aspActivityStatusId"
                    control={controlActivityStatus}
                    rules={{
                      required: "Status is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select"
                          filter
                          options={aspStatusData?.data?.data?.map(
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
                          {ActivityStatusErrors &&
                            ActivityStatusErrors[field.name]?.message}
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
                    control={controlActivityStatus}
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
                          // stepMinute={aspActivityStatusId == 15 ? 1 : 15}
                          onChange={(e) => {
                            field.onChange(e.value); // Update the form field
                            // setASPStatus("dateTime", e.value); // Manually set the form value using setASPStatus
                          }}
                          // onChange={(e) => {
                          //   const selectedDate = new Date(e.value);
                          //   const roundedDate =
                          //     aspActivityStatusId === 15
                          //       ? selectedDate
                          //       : roundDownToNearest15(selectedDate);
                          //   field.onChange(roundedDate);
                          // }}
                        />

                        <div className="p-error">
                          {ActivityStatusErrors &&
                            ActivityStatusErrors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary gap-3_4"
                  loading={aspActivityStatusMutateLoading}
                  type="submit"
                >
                  Update
                </Button>
              </div>
              {/* <div className="form-group">
                <label className="form-label filter-label required">
                  Status{" "}
                </label>
                <Controller
                  name="activityStatusId"
                  control={controlActivityStatus}
                  rules={{
                    required: "Status is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={othersStatusData?.data?.data?.map(
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
                        {ActivityStatusErrors &&
                          ActivityStatusErrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div> */}
              {/* <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary gap-3_4"
                  loading={aspActivityStatusMutateLoading}
                  type="submit"
                >
                  Update
                </Button>
              </div> */}
            </div>
          </form>
        </div>
      </OverlayPanel>

      {/* <OverlayPanel ref={statusChangePanel} className="form-overlay-panel">
        <div className="filter-header">
          <div className="filter-title">Activity Changes</div>
        </div>
        <div className="filter-body">
          <form
            onSubmit={handleActivityStatusSubmit(
              handleActivityStatusFormSubmit
            )}
          >
            <div className="d-flex flex-column gap-3_4">
              <div className="form-group">
                <label className="form-label filter-label required">
                  Status{" "}
                </label>
                <Controller
                  name="aspActivityStatusId"
                  control={controlActivityStatus}
                  rules={{
                    required: "Status is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={aspStatusData?.data?.data?.map(
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
                        {ActivityStatusErrors &&
                          ActivityStatusErrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary gap-3_4"
                  loading={aspActivityStatusMutateLoading}
                  type="submit"
                >
                  Update
                </Button>
              </div>
            </div>
          </form>
        </div>
      </OverlayPanel> */}

      <OverlayPanel ref={othersStatusPanel} className="form-overlay-panel">
        <div className="filter-header">
          <div className="filter-title">Activity Changes</div>
        </div>
        <div className="filter-body">
          <form
            onSubmit={handleOthersStatusSubmit(handleOtherStatus)}
            id="status-tab"
          >
            <div className="d-flex flex-column gap-3_4">
              <div className="form-group">
                <label className="form-label filter-label required">
                  Status{" "}
                </label>
                <Controller
                  name="activityStatusId"
                  control={controlOthersStatus}
                  rules={{
                    required: "Status is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={othersStatusData?.data?.data}
                        optionLabel="name"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {OthersStatusErrors &&
                          OthersStatusErrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary gap-3_4"
                  disabled={activityStatusId ? false : true}
                  form="status-tab"
                  type="submit"
                >
                  Update
                </Button>
              </div>
            </div>
          </form>
        </div>
      </OverlayPanel>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title"> Update Service Status</div>
          </div>
        }
        className="w-576"
        visible={othersStatusVisible}
        position={"bottom"}
        // onHide={() => setDeviationVisible(false)}
        draggable={false}
        resizable={false}
        closable={false}
      >
        <form
          className="change-activity-form"
          onSubmit={handleOthersFormSubmit(handleStatusChangeOthers)}
          id="status-change"
        >
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Remarks</label>
                <Controller
                  name="remarks"
                  control={controlRemarksStatus}
                  rules={{ required: "Remarks is required." }}
                  defaultValue={aspResultData[activeIndex]?.remarks || ""}
                  render={({ field, fieldState }) => {
                    // console.log("text area field", field);
                    return (
                      <>
                        <InputTextarea
                          placeholder="comments"
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          id={field.name}
                          {...field}
                          rows={4}
                          cols={30}
                        />
                        <div className="p-error">
                          {RemarksStatusErrors &&
                            RemarksStatusErrors[field.name]?.message}
                        </div>
                      </>
                    );
                  }}
                />
              </div>
            </div>
            {(activityStatusId?.name == "Successful" ||
              aspResultData[activeIndex]?.activityStatusId == 7) && (
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">Attachments</label>
                  <Controller
                    name="files"
                    control={controlRemarksStatus}
                    rules={{
                      required:
                        deleteAttachments?.length <
                        aspResultData[activeIndex]?.otherServiceAttachments
                          ?.length
                          ? false
                          : "Attachment is required.",
                    }}
                    render={({ field, fieldState }) => {
                      // console.log("file upload field", field);
                      return (
                        <>
                          <FileChooseUpload
                            multiple={true}
                            field={field}
                            setField={(files) =>
                              handleRemoveFile(field?.name, files)
                            }
                            // itemTemplate={aspResultData[activeIndex]?.otherServiceAttachments}
                            // defaultValues={aspResultData[activeIndex]?.otherServiceAttachments}
                            initalFlag={initalFlag}
                            setInitalFlag={setInitalFlag}
                          />
                          <div className="p-error">
                            {RemarksStatusErrors &&
                              RemarksStatusErrors[field.name]?.message}
                          </div>
                        </>
                      );
                    }}
                  />
                </div>
                {aspResultData[activeIndex]?.otherServiceAttachments?.length >
                  0 &&
                  aspResultData[activeIndex]?.otherServiceAttachments
                    ?.filter((files) => !deleteAttachments.includes(files.id))
                    ?.map((files) => (
                      <div className="d-flex align-items-center gap-3">
                        <div
                          style={{
                            whiteSpace: "nowrap",

                            textOverflow: "ellipsis",
                            flexGrow: 1, // Ensure the filename takes up the remaining space
                          }}
                        >
                          {files.fileName}
                        </div>
                        <div
                          className="p-error"
                          onClick={() => handleDeleteFile(files.id)}
                          style={{ cursor: "pointer" }}
                        >
                          Delete
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
          <div className="d-flex gap-2 ms-auto">
            <Button
              className="btn btn-white update-btn"
              onClick={() => {
                setOthersStatusVisible(false);
                setEditMode(false);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className="btn update-btn"
              type="submit"
              form="status-change"
              loading={updateStatusLoading}
            >
              Update
            </Button>
          </div>
        </form>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Dash-cam</div>
          </div>
        }
        closeIcon={<img src={DialogCloseSmallIcon} />}
        className="w-576"
        visible={camVisible}
        position={"bottom-right"}
        modal={false}
        onHide={() => setCamVisible(false)}
      >
        <div className="dialog-main-content">
          <img src={DashCamImage} alt={"dash-cam-img"} />
        </div>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title"> Cancel Reason</div>
          </div>
        }
        visible={cancelDialogVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => setCancelDialogVisible(false)}
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
                aspResultData[activeIndex]?.activityStatusId
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
                            options={aspResultData[
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
                    aspResultData[activeIndex]?.aspVehicleRegistrationNumber
                  }
                  rules={{
                    required: false,
                    validate: {
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
                    },
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
            loading={updateVehicleNumberIsLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>

      {/* Assign Driver Dialog (only when ASP has mechanic and driver not assigned) */}
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Assign Driver</div>
          </div>
        }
        visible={assignDriverDialogVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setAssignDriverDialogVisible(false);
          setAssignDriverActivity(null);
          driverReset();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleDriverSubmit(handleAssignDriverSubmit)}>
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Driver</label>
                <Controller
                  name="aspMechanicId"
                  control={driverFormControl}
                  rules={{ required: "Driver is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={aspMechanicsData?.data?.data?.map(
                          ({ name, id, code }) => ({
                            label: `${name}-${code}`,
                            value: id,
                          })
                        )}
                        optionLabel="label"
                        onChange={(e) => field.onChange(e.value)}
                        className={fieldState.error ? "p-invalid" : ""}
                      />
                      <div className="p-error">
                        {driverErrors && driverErrors[field.name]?.message}
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
            loading={assignDriverLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>

      <AttachmentsDialog
        visible={attachmentDialogVisible}
        setVisible={setAttachmentDialogVisible}
        attachments={aspResultData[activeIndex]?.otherServiceAttachments}
        title={"Documents"}
        download={false}
      />
      <Dialog
        header="Pick Up Time Update"
        visible={pickTimeConfirmDialog}
        position="bottom"
        footer={
          <>
            <Button
              label="Cancel"
              type="button"
              className="btn btn-white"
              onClick={() => setPickTimeConfirmDialog(false)}
            />
            <Button
              label="Confirm"
              type="submit"
              onClick={handleUpdatePickupTime}
            />
          </>
        }
        draggable={false}
        resizable={false}
        closable={false}
      >
        <div>
          You have been assigned to the Case {caseData?.caseNumber}. Click
          'Confirm' to update the pick-up time.
        </div>
        {slaReasonVisible && (
          <SlaReasonDialog
            title="Agent Picked-up Time"
            updatePickTime={updatePickTime}
            setSlaReasonVisible={setSlaReasonVisible}
            slaReasonVisible={slaReasonVisible}
            loading={updatePickupTimeLoading}
          />
        )}
      </Dialog>

      <OverlayPanel ref={emailPanel} className="form-overlay-panel">
        <div className="filter-header">
          <div className="filter-title">Send Customer Invoice</div>
        </div>
        <div className="filter-body">
          <form
            onSubmit={handleCustomerInvoiceSubmit(customerInvoiceSend)}
            id="email-customer-invoice"
          >
            <div className="d-flex flex-column gap-3_4">
              <div className="form-group">
                <label className="form-label filter-label required">
                  Email
                </label>
                <Controller
                  name="email"
                  control={controlCustomerInvoice}
                  rules={{ required: "Email is required" }}
                  render={({ field }) => (
                    <>
                      <InputText
                        id="email"
                        {...field}
                        placeholder="Enter Email"
                      />
                      <div className="p-error">
                        {CustomerInvoiceErrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary gap-3_4"
                  form="email-customer-invoice"
                  type="submit"
                  loading={customerInvoiceLoading}
                >
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      </OverlayPanel>

      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">{trackLinkAspName}</div>
            <div className="refresh-btn">
              <Button
                onClick={() => {
                  setRefreshServiceProviderTracking(
                    !refreshServiceProviderTracking
                  );
                }}
              >
                Refresh Now
              </Button>
            </div>
          </div>
        }
        pt={{
          root: { className: "w-968" },
        }}
        visible={serviceProviderTrackingVisible}
        position={"bottom"}
        onHide={() => {
          setServiceProviderTrackingVisible(false);
          setTrackLinkAspName("");
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <div class="content">
          <div class="map-container">
            <GoogleMapReact
              key={refreshServiceProviderTracking}
              // defaultCenter={{ lat: 59.95, lng: 30.33 }}
              defaultCenter={
                bdLat && bdLng
                  ? {
                      lat: Number(bdLat),
                      lng: Number(bdLng),
                    }
                  : { lat: 20.5937, lng: 78.9629 }
              }
              defaultZoom={12}
              bootstrapURLKeys={{
                key: GoogleMapAPIKey,
              }}
              center={
                bdLat && bdLng
                  ? {
                      lat: Number(bdLat),
                      lng: Number(bdLng),
                    }
                  : { lat: 20.5937, lng: 78.9629 }
              }
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) =>
                handleServiceProviderApiLoad(map, maps)
              }
            ></GoogleMapReact>
          </div>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <div>
              <label
                style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}
              >
                Distance:{" "}
              </label>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#949494",
                }}
              >
                {serviceProviderLiveLocationData?.data?.data?.trackLinkResponse
                  ?.distance
                  ? " " +
                    serviceProviderLiveLocationData?.data?.data
                      ?.trackLinkResponse?.distance
                  : " " + "-"}
              </span>
            </div>
            <div>
              <label
                style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}
              >
                ETA:{" "}
              </label>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#949494",
                }}
              >
                {serviceProviderLiveLocationData?.data?.data?.trackLinkResponse
                  ?.duration
                  ? " " +
                    serviceProviderLiveLocationData?.data?.data
                      ?.trackLinkResponse?.duration
                  : " " + "-"}
              </span>
            </div>
            <div></div>
          </div>
        </div>
      </Dialog>
      {initiateCancellationDialogVisible && (
        <InitiateCancellationDialog
          visible={initiateCancellationDialogVisible}
          setVisible={setInitiateCancellationDialogVisible}
          aspResultData={aspResultData}
          activeServiceIndex={activeIndex}
          aspRefetch={aspRefetch}
        />
      )}

      {/* Additional KM Payment Confirmation Dialog */}
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Payment For Additional KM</div>
          </div>
        }
        visible={additionalKmPaymentDialogVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setAdditionalKmPaymentDialogVisible(false);
          setCustomerAgreedToPayment(null);
          setCustomerPaymentComments("");
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
        footer={
          <div className="dialog-footer">
            <Button
              className="btn btn-white"
              label="Cancel"
              onClick={() => {
                setAdditionalKmPaymentDialogVisible(false);
                setCustomerAgreedToPayment(null);
                setCustomerPaymentComments("");
              }}
            />
            <Button
              className="btn form-submit-btn"
              label="Confirm"
              onClick={handleCustomerAgreementConfirm}
              disabled={
                customerAgreedToPayment === null ||
                (customerAgreedToPayment === false &&
                  (!customerPaymentComments ||
                    customerPaymentComments.trim() === ""))
              }
              loading={storeAgreementLoading}
            />
          </div>
        }
      >
        <div className="row row-gap-3_4">
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label required">
                Customer agreed to proceed with payment link?
              </label>
              <div className="common-radio-group">
                <div className="common-radio-item">
                  <RadioButton
                    inputId="agree_yes"
                    name="customerAgreed"
                    value={true}
                    onChange={(e) => setCustomerAgreedToPayment(e.value)}
                    checked={customerAgreedToPayment === true}
                  />
                  <label htmlFor="agree_yes" className="common-radio-label">
                    Yes
                  </label>
                </div>
                <div className="common-radio-item">
                  <RadioButton
                    inputId="agree_no"
                    name="customerAgreed"
                    value={false}
                    onChange={(e) => setCustomerAgreedToPayment(e.value)}
                    checked={customerAgreedToPayment === false}
                  />
                  <label htmlFor="agree_no" className="common-radio-label">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
          {customerAgreedToPayment === false && (
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Comments</label>
                <InputTextarea
                  value={customerPaymentComments}
                  onChange={(e) => setCustomerPaymentComments(e.target.value)}
                  placeholder="Enter comments"
                  rows={4}
                  className="form-control"
                />
              </div>
            </div>
          )}
        </div>
      </Dialog>

      {/* Send Link Dialog */}
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Send Payment Link</div>
          </div>
        }
        visible={sendLinkDialogVisible}
        position={"bottom"}
        className="w-968"
        onHide={() => {
          setSendLinkDialogVisible(false);
          payReset();
          setSelectedDiscountReason(null);
          setDiscountPercent(0);
          setDiscountAmount(0);
          setLegalName(null);
          setTradeName(null);
          setGstin(null);
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
        footer={
          <div className="dialog-footer">
            <Button
              className="btn btn-white"
              label="Cancel"
              onClick={() => {
                setSendLinkDialogVisible(false);
                payReset();
                setSelectedDiscountReason(null);
                setDiscountPercent(0);
                setDiscountAmount(0);
                setLegalName(null);
                setTradeName(null);
                setGstin(null);
              }}
            />
            <Button
              className="btn form-submit-btn"
              label="Submit"
              onClick={handleSendLinkSubmit}
              loading={sendLinkMutateLoading}
            />
          </div>
        }
      >
        <div className="row row-gap-3_4">
          <div className="col-md-3">
            <div className="form-group">
              <label className="form-label">Additional KM</label>
              <InputText
                value={
                  aspResultData[activeIndex]?.additionalKmForPayment
                    ? `${aspResultData[activeIndex]?.additionalKmForPayment} KM`
                    : "--"
                }
                disabled
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="form-label">
                Service Cost (
                <span
                  className="include-gst"
                  style={{ color: "#4db86b", fontWeight: 500 }}
                >
                  Incl GST
                </span>
                )
              </label>
              <InputText
                value={
                  aspResultData[activeIndex]?.additionalKmEstimatedTotalAmount
                    ? new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(
                        aspResultData[activeIndex]
                          ?.additionalKmEstimatedTotalAmount
                      )
                    : "--"
                }
                disabled
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="form-label">Discount (%)</label>
              <Controller
                name="discountPercentage"
                control={payControl}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      placeholder="Enter Discount Percent"
                      maxLength={2}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                        setDiscountPercent(value);
                        setSelectedDiscountReason(null);
                        setPayvalue("discountReasonId", null);
                      }}
                      className={fieldState.error ? "p-invalid" : ""}
                    />
                    {fieldState.error && (
                      <p className="error">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label
                className={
                  discountPercent ? "form-label required" : "form-label"
                }
              >
                Discount Reason
              </label>
              <Controller
                name="discountReasonId"
                control={payControl}
                rules={{
                  required: discountPercent
                    ? "Discount Reason is required when Discount Percentage is entered"
                    : false,
                  validate: (value) => {
                    if (discountPercent && value == null) {
                      return "Discount Reason is required when Discount Percentage is entered";
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      filter
                      placeholder="Select Discount Reason"
                      options={discountData?.data?.data}
                      optionLabel="name"
                      onChange={(e) => {
                        field.onChange(e.value);
                        setSelectedDiscountReason(e.value);
                      }}
                      className={fieldState.error ? "p-invalid" : ""}
                      style={{ width: "100%" }}
                    />
                    {fieldState.error && (
                      <div className="p-error">{fieldState.error.message}</div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="form-label">Discount Amount</label>
              <Controller
                name="discountAmount"
                control={payControl}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      placeholder="Discount Amount"
                      keyfilter="pnum"
                      maxLength={10}
                      disabled
                      value={discountAmount}
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="form-label required">
                Send Payment Link to
              </label>
              <Controller
                name="sendPaymentLinkTo"
                control={payControl}
                rules={{
                  required: "Mobile Number is required",
                  validate: {
                    matchPattern: (v) => {
                      if (v.length > 0) {
                        return (
                          /^([+]\d{2})?\d{10}$/.test(v) ||
                          "Mobile Number must be a valid number"
                        );
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      placeholder="Enter Mobile Number"
                      keyfilter="pnum"
                      maxLength={10}
                      className={fieldState.error ? "p-invalid" : ""}
                    />
                    {fieldState.error && (
                      <div className="p-error">{fieldState.error.message}</div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label className="form-label required">Customer Type</label>
              <Controller
                name="customerTypeId"
                control={payControl}
                rules={{ required: "Customer Type is required." }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        placeholder="Select Customer Type"
                        options={nonMemberCustomerTypes?.data?.data}
                        optionLabel="name"
                        optionValue={"id"}
                        onChange={(e) => {
                          field.onChange(e.value);
                          setPayvalue("legalName", "");
                          setPayvalue("tradeName", "");
                          setPayvalue("gstin", "");
                          setLegalName(null);
                          setTradeName(null);
                          setGstin(null);
                        }}
                        className={fieldState.error ? "p-invalid" : ""}
                        style={{ width: "100%" }}
                      />
                      {fieldState.error && (
                        <div className="p-error">
                          {fieldState.error.message}
                        </div>
                      )}
                    </>
                  );
                }}
              />
            </div>
          </div>
          {customerTypeId && customerTypeId == 1150 && (
            <>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label required">Legal Name</label>
                  <Controller
                    name="legalName"
                    control={payControl}
                    rules={{
                      required: "Legal Name is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          placeholder="Enter Legal Name"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setLegalName(e.target.value);
                          }}
                          maxLength={250}
                        />
                        {fieldState.error && (
                          <div className="p-error">
                            {fieldState.error.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label required">Trade Name</label>
                  <Controller
                    name="tradeName"
                    control={payControl}
                    rules={{
                      required: "Trade Name is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          placeholder="Enter Trade Name"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setTradeName(e.target.value);
                          }}
                          maxLength={250}
                        />
                        {fieldState.error && (
                          <div className="p-error">
                            {fieldState.error.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label required">GSTIN</label>
                  <Controller
                    name="gstin"
                    control={payControl}
                    rules={{
                      required: "GSTIN is required.",
                      minLength: {
                        value: 15,
                        message: "GSTIN must have at least 15 characters",
                      },
                      maxLength: {
                        value: 15,
                        message: "GSTIN must not exceed 15 characters",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          placeholder="Enter GSTIN"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setGstin(e.target.value);
                          }}
                        />
                        {fieldState.error && (
                          <div className="p-error">
                            {fieldState.error.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default ServiceTab;
