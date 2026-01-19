import React, { useRef, useState } from "react";
import {
  CarTechnicianIcon,
  CircleWarningIcon,
  CollapseMinusIcon,
  CollapsePlusIcon,
  DialogCloseSmallIcon,
  DotIcon,
  LocationArrowBlueIcon,
  LocationArrowIcon,
  MapIcon,
  PhoneGrayIcon,
  SendBtnIcon,
  TimerClockIcon,
  YellowStarIcon,
  DialogCloseIcon,
  BluePlusIcon,
  EmptyListImage,
  InteractionImage,
  CasesAssignedIcon,
} from "../../utills/imgConstants";
import { Divider } from "primereact/divider";
import "./components.less";
import TimerChip from "./TimerChip";
import { SplitButton } from "primereact/splitbutton";
import ChipWithIcon from "./ChipWithIcon";
import { Panel } from "primereact/panel";
import { TabMenu } from "primereact/tabmenu";
import { TabView, TabPanel } from "primereact/tabview";
import TabMenuItem from "./TabMenuItem";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Menu } from "primereact/menu";
import { Chip } from "primereact/chip";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { useNavigate } from "react-router";
import ServiceTowingDialog from "../../pages/deliveryRequest/ServiceTowingDialog";
import CaseServiceTowingDialog from "../../pages/case/aspAssignment/CaseServiceTowingDialog";
import AcceptServiceRequestDialog from "../../pages/case/aspAssignment/AcceptServiceRequestDialog";
import {
  acceptRequest,
  aspData,
} from "../../../services/assignServiceProvider";
import { caseAccectRequest } from "../../../services/caseService";
import NoDataComponent from "./NoDataComponent";
import Avatar from "./Avatar";
import { slaViolateReasons } from "../../../services/masterServices";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useMutation, useQuery } from "react-query";
import AddTechnicianDialog from "./AddTechnicianDialog";
import { checkSla } from "./Sla";
import { clickToCall } from "../../../services/callService";
import InterActionSidebar from "./InterActionSidebar";
import {
  getInteractiondata,
  addInteraction,
} from "../../../services/deliveryRequestViewService";

const ASPCard = ({
  state,
  city,
  companyName,
  companyCode,
  ownPatrolVehicleRegistrationNumber,
  addressLineOne,
  addressLineTwo,
  whatsappContact,
  contactNumber,
  reginalContact,
  location,
  distance,
  duration,
  reginalManager,
  setRejectVisible,
  onSendRequest,
  sendRequestLoading,
  aspId,
  setAspId,
  caseId,
  setActivityId,
  activityId,
  mapLocation,
  disabled,
  approvalbtn,
  aspRequestRefetch,
  g2gKM,
  cancelbtn,
  setCancelVisible,
  activityStatusId,
  available,
  rsaCase,
  caseData,
  caseActivityId,
  serviceId,
  isOwnPatrol,
  subServiceId,
  nearASPRefetch,
  activityData,
  aspActivityStatusId,
  activityViewRefetch,
  aspMechanics,
  slaTime,
  agentAssignedAt,
  zonalManager,
  zonalContact,
  nationalManager,
  nationalContact,
  cocoTechnicianInShift,
  rejectedActivityExists = false,
  caseAssignedCount = 0,
  ownPatrolVehicle,
  onOpenDriverModal,
  isTechnicianAssigned = false,
}) => {
  // console.log("caseData, caseData",  aspActivityStatusId)
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const user = useSelector(CurrentUser);
  const navigate = useNavigate();

  const [openTechnicianDialog, setOpenTechnicianDialog] = useState(false);

  const handleOpenTechnicianDialog = () => setOpenTechnicianDialog(true);
  const handleCloseTechnicianDialog = () => {
    setOpenTechnicianDialog(false);
  };

  const [visible, setVisible] = useState(false);
  const [rsaAcceptVisible, setRsaAcceptVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [managerSiderVisible, setManagerSiderVisible] = useState(false);
  const [viewMode, setViewMode] = useState("");
  const [slaReasonVisible, setSlaReasonVisible] = useState(false);
  const [slaViolatedVisible, setSlaViolatedVisible] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [interactionDialogVisible, setInteractionDialogVisible] =
    useState(false);

  const option = useRef(null);
  const op = useRef(null);
  const menuOptions = useRef(null);
  const menuChangeOption = useRef(null);
  // console.log("op", op);
  // Vehicle Delivery Accept Request
  const {
    mutate: acceptRequestMutation,
    data: acceptRequestData,
    isLoading,
  } = useMutation(acceptRequest);

  // RSA Case Service Accept Request
  const {
    mutate: caseAccectRequestMutation,
    data: caseAccectRequestData,
    isLoading: caseAccectRequestLoading,
  } = useMutation(caseAccectRequest);

  // console.log("acceptRequestData?.data?.data", acceptRequestData?.data?.data);
  // console.log("mainsplitdisabled", disabled);
  // console.log("approvalbtn option", approvalbtn);

  const { mutate: outboundCallMutate, isLoading: outboundCallLoading } =
    useMutation(clickToCall);

  // Get Interaction Form Data
  const { data: interactionFormData } = useQuery(
    ["aspInteractionFormData", aspId],
    () => getInteractiondata(),
    {
      enabled: interactionDialogVisible,
    }
  );

  // Save Interaction API
  const { mutate: interactionMutate, isLoading: interactionMutateLoading } =
    useMutation(addInteraction);

  const handleOutBoundCallContact = () => {
    outboundCallMutate(
      {
        agentId: user?.userName,
        campaignName: caseData?.client,
        customerNumber: contactNumber,
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

  const handleOutBoundCallWhatsApp = () => {
    outboundCallMutate(
      {
        agentId: user?.userName,
        campaignName: caseData?.client,
        customerNumber: whatsappContact,
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

  const { data: reasons = [] } = useQuery(
    ["reasonList", role.id],
    () => slaViolateReasons({ apiType: "dropdown", roleId: role.id }),
    {
      enabled: slaReasonVisible,
    }
  );

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      slaViolateReasonId: "",
    },
  });

  //console.log("activityData",activityData)
  // console.log("op", op);
  // console.log("acceptRequestData?.data?.data", acceptRequestData?.data?.data);

  // console.log("acceptRequestData?.data?.data", acceptRequestData?.data?.data);
  // console.log("mainsplitdisabled", disabled);

  // console.log("approvalbtn option", approvalbtn);
  // console.log("000",disabled?.sendRequest?.tech)

  const shouldShowAssignDriverButton =
    rsaCase && isOwnPatrol && activityStatusId && !isTechnicianAssigned;
  const shouldShowAcceptedOnly =
    rsaCase && isOwnPatrol && activityStatusId && isTechnicianAssigned;

  const itemsChange = [
    {
      label: <span className="request-accept">Update</span>,
      command: () => {
        setViewMode("form");
        setAspId(aspId);
        setUpdateMode(true);
        setVisible(true);
      },
    },
    ...(cancelbtn
      ? [
          {
            label: <span className="request-reject">Cancel</span>,
            command: () => {
              setActivityId(activityId);
              setCancelVisible(true);
            },
          },
        ]
      : []),
  ];
  const items = [
    ...(shouldShowAssignDriverButton
      ? [
          {
            label: <span className="request-accept">Assign Driver</span>,
            command: () => {
              if (onOpenDriverModal) {
                onOpenDriverModal({
                  aspId: aspId,
                  isOwnPatrol: isOwnPatrol,
                  ownPatrolVehicle: ownPatrolVehicle,
                  aspMechanics: aspMechanics || [],
                });
              }
            },
          },
        ]
      : shouldShowAcceptedOnly
      ? [
          {
            label: <span className="request-accept">Accepted</span>,
            command: () => {
              if (rsaCase) {
                // console.log("rsa case ****", activityData);
                let acceptSla = checkSla(
                  activityData,
                  activityData?.extras?.slaSettings,
                  866,
                  null
                );
                // console.log("acceptSla ****", acceptSla);
                if (acceptSla == "violated") {
                  setSlaViolatedVisible(true);
                }
                setRsaAcceptVisible(true);
              } else {
                if (slaExceeded) {
                  setSlaReasonVisible(true);
                } else {
                  acceptRequestMutation(
                    {
                      activityId: activityId,
                      aspId: aspId,
                      logTypeId: 240,
                    },
                    {
                      onSuccess: (res) => {
                        if (res) {
                          toast.success(res?.data?.message);
                          setViewMode("form");
                          setVisible(true);
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
                }

                setAspId(aspId);
              }
            },
          },
          {
            label: <span className="request-reject">Rejected</span>,
            command: () => {
              setRejectVisible(true);
              setActivityId(activityId);
              setAspId(aspId);
            },
          },
        ]
      : [
          // Normal menu items for VDM and other cases
          ...(approvalbtn
            ? [
                {
                  label: (
                    <span className="request-accept">
                      {activityData?.customerNeedToPay
                        ? "Send Link"
                        : "Approval"}
                    </span>
                  ),
                  command: () => {
                    setUpdateMode(false);
                    setViewMode("form");
                    setAspId(aspId);
                    setVisible(true);
                  },
                  disabled:
                    activityData?.customerNeedToPay &&
                    activityData?.sendPaymentLinkTo !== null,
                },
              ]
            : [
                {
                  label: <span className="request-accept">Accepted</span>,

                  command: () => {
                    if (rsaCase) {
                      // console.log("rsa case ****", activityData);
                      let acceptSla = checkSla(
                        activityData,
                        activityData?.extras?.slaSettings,
                        866,
                        null
                      );
                      // console.log("acceptSla ****", acceptSla);
                      if (acceptSla == "violated") {
                        setSlaViolatedVisible(true);
                      }
                      setRsaAcceptVisible(true);
                    } else {
                      if (slaExceeded) {
                        setSlaReasonVisible(true);
                      } else {
                        acceptRequestMutation(
                          {
                            activityId: activityId,
                            aspId: aspId,
                            logTypeId: 240,
                          },
                          {
                            onSuccess: (res) => {
                              if (res) {
                                toast.success(res?.data?.message);
                                setViewMode("form");
                                setVisible(true);
                                aspRequestRefetch();
                              } else {
                                if (res?.data?.error) {
                                  toast.error(res?.data?.error);
                                } else {
                                  res?.data?.errors?.forEach((el) =>
                                    toast.error(el)
                                  );
                                }
                              }
                            },
                          }
                        );
                      }

                      setAspId(aspId);
                    }
                  },
                },
              ]),

          ...(cancelbtn
            ? [
                {
                  label: <span className="request-reject">Cancel</span>,
                  command: () => {
                    setActivityId(activityId);
                    setCancelVisible(true);
                  },
                },
              ]
            : []),

          ...(activityStatusId
            ? [
                {
                  label: <span className="request-reject">Rejected</span>,
                  command: () => {
                    setRejectVisible(true);
                    setActivityId(activityId);
                    setAspId(aspId);
                  },
                },
              ]
            : []),
        ]),
  ];

  const siderItems = [
    { label: <TabMenuItem label="Driver & Mechanic" /> },
    { label: <TabMenuItem label="Manager Info" /> },
  ];

  // Handle Service Accepted Form Submit
  const handleAcceptedFormSubmit = (values) => {
    // console.log('Service Accepted Form Values => ', values);
    let acceptSla = checkSla(
      activityData,
      activityData?.extras?.slaSettings,
      866,
      null
    );
    // console.log("acceptSla **** in api", acceptSla);
    if (acceptSla == "violated") {
      setSlaViolatedVisible(true);
    }
    caseAccectRequestMutation(
      {
        activityId: activityId,
        aspId: aspId,
        logTypeId: 240,
        startTime: moment
          .tz(values?.startDatetime, "Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment
          .tz(values?.endDatetime, "Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss"),
        comments: values?.comments,
        slaViolateReasonId: values?.slaViolateReasonId?.id || null,
        slaViolateReasonComments: values?.slaViolateReasonId?.name || null,
        proposedDelayReasonId: values?.proposedDelayReasonId?.id || null,
        breakdownReachTimeSlaDateTime: caseData?.breakdownReachTimeSLA?.slaTime
          ? moment
              .tz(caseData.breakdownReachTimeSLA.slaTime, "Asia/Kolkata")
              .format("YYYY-MM-DD HH:mm:ss")
          : null,
      },
      {
        onSuccess: async (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setSlaViolatedVisible(false);
            setRsaAcceptVisible(false);
            aspRequestRefetch();

            // Simple flow:
            // If paid service already has a successful one-time-service transaction,
            // don't open the "send link" form again; just redirect to case view.
            // Fetch latest activity data (post-accept) to evaluate txn state reliably
            if (rsaCase === true) {
              const acceptedActivityRes = await aspData({ activityId });
              const acceptedActivity =
                acceptedActivityRes?.data?.data?.[0] ||
                acceptedActivityRes?.data?.data ||
                null;

              const hasSuccessfulNonMembershipTxn =
                acceptedActivity?.transactions?.some(
                  (txn) =>
                    Number(txn?.paymentTypeId) === 174 &&
                    Number(txn?.paymentStatusId) === 191 &&
                    (txn?.refundStatusId == null ||
                      Number(txn?.refundStatusId) === 1303)
                ) || false;
              if (
                acceptedActivity?.customerNeedToPay === true &&
                hasSuccessfulNonMembershipTxn
              ) {
                navigate(`/cases/view/${caseId}`);
                return;
              }
            }

            setViewMode("form");
            setVisible(true);
          } else {
            toast.error(res?.data.error);
          }
        },
      }
    );
  };

  // Handle ASP Manager & Driver Info
  const handleAspInfo = () => {
    setManagerSiderVisible(true);
  };

  const isSlaExceeded = () => {
    const slaForTypeId361 = slaTime?.find(
      (item) => item.typeId === 361
    )?.timeInMilliSeconds;
    const createdAt = agentAssignedAt; // createdAt in milliseconds
    const slaTimeMilliSeconds = slaForTypeId361; // SLA time in milliseconds

    // If createdAt or slaTime is not valid, return false
    if (!createdAt || !slaTimeMilliSeconds) {
      // console.error("Invalid createdAt or slaTimeMilliSeconds");
      return false;
    }

    // Create the SLA deadline by adding the SLA time to the createdAt timestamp
    const slaDeadline = new Date(createdAt + slaTimeMilliSeconds);

    // Get the current time
    const currentTime = new Date();

    // Compare the current time with the SLA deadline
    return currentTime > slaDeadline;
  };
  const slaExceeded = isSlaExceeded();

  //Sla Volation Reason Submit
  const slaViolationSubmit = (value) => {
    acceptRequestMutation(
      {
        activityId: activityId,
        aspId: aspId,
        logTypeId: 240,
        slaViolateReasonId: value.slaViolateReasonId.id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setViewMode("form");
            setVisible(true);
            aspRequestRefetch();
            setSlaReasonVisible(false);
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

  // Handle Save Interaction
  const handleSaveInteraction = (values, reset) => {
    interactionMutate(
      {
        caseDetailId: caseId,
        activityId: caseActivityId || activityId || null,
        typeId: 242,
        ...values,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setInteractionDialogVisible(false);
            reset();
            if (aspRequestRefetch) {
              aspRequestRefetch();
            }
            if (activityViewRefetch) {
              activityViewRefetch();
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
  const aspCardTitle =
    isOwnPatrol && ownPatrolVehicleRegistrationNumber
      ? `${companyName} - ${companyCode} - ${ownPatrolVehicleRegistrationNumber}`
      : `${companyName} - ${companyCode}`;
  const [selectedAspForInteraction, setSelectedAspForInteraction] =
    useState(null);

  return (
    <>
      <div className="asp-card-info-container">
        <div className="asp-card-info-header">
          <div className="d-flex gap-2">
            <img
              src={CarTechnicianIcon}
              className="asp-card-info-header-icon"
            />
            <div>
              {isOwnPatrol && ownPatrolVehicleRegistrationNumber ? (
                <span className="asp-card-info-title">
                  <b>{companyName}</b> - {companyCode} -{" "}
                  {ownPatrolVehicleRegistrationNumber}
                </span>
              ) : (
                <span className="asp-card-info-title">
                  <b>{companyName}</b> - {companyCode}
                </span>
              )}
              <div className="asp-card-info-subtitle">
                {/*  <span className="asp-card-info-point">{'4'}</span>
                <img src={YellowStarIcon} />*/}
                {isOwnPatrol && !cocoTechnicianInShift ? (
                  <span className="asp-card-info-status offline">
                    {"Offline"}
                  </span>
                ) : (
                  <span
                    className={`asp-card-info-status ${
                      available ? "available" : "busy"
                    }`}
                  >
                    {available ? "Avalilable" : "Busy"}
                  </span>
                )}
                {/* <img
                  style={{ cursor: "pointer" }}
                  src={CircleWarningIcon}
                  onClick={(e) => op.current.toggle(e)}
                /> */}
              </div>
            </div>
          </div>

          <div className="asp-card-info-header-left">
            {rejectedActivityExists && (
              <div>
                <ChipWithIcon
                  label="Already Rejected"
                  icon={CircleWarningIcon}
                  type="danger"
                />
              </div>
            )}
            {!rsaCase && (
              <div>
                <ChipWithIcon
                  label={`G to G - ${g2gKM}`}
                  icon={LocationArrowBlueIcon}
                  type="lightblue"
                />
              </div>
            )}
            <div>
              <ChipWithIcon
                label={distance}
                icon={LocationArrowIcon}
                type="gray"
              />
            </div>
            <div>
              <ChipWithIcon
                label={duration}
                icon={TimerClockIcon}
                type="violet"
              />
            </div>
            <div>
              <ChipWithIcon
                label={`Assigned - ${caseAssignedCount}`}
                icon={CasesAssignedIcon}
                type="gray"
              />
            </div>
            <div
              onClick={() => {
                setViewMode("view");
                setVisible(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <ChipWithIcon icon={MapIcon} label="Map View" type="yellow" />
            </div>
            <div
              onClick={() => {
                setSelectedAspForInteraction({
                  aspId,
                  aspTitle:
                    isOwnPatrol && ownPatrolVehicleRegistrationNumber
                      ? `${companyName} - ${companyCode} - ${ownPatrolVehicleRegistrationNumber}`
                      : `${companyName} - ${companyCode}`,
                  // location: `${location}${addressLineOne}${addressLineTwo}, ${city}, ${state}`,
                  contactNumber,
                  whatsappContact,
                });

                setInteractionDialogVisible(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <ChipWithIcon
                icon={InteractionImage}
                label="Add Interaction"
                type="gray"
              />
            </div>
          </div>
        </div>
        <div className="asp-card-info-content gap-2">
          <div className="d-flex align-items-center">
            <div>
              <h4 className="asp-card-info-name">
                {location}
                {addressLineOne}
                {addressLineTwo},{state},{city}
              </h4>
              <div
                className="asp-card-info-with-icon"
                onClick={(e) => option.current.toggle(e)}
              >
                <img src={PhoneGrayIcon} />
                {isOwnPatrol ? (
                  <span>
                    {aspMechanics?.length === 1 ? (
                      aspMechanics?.map((item, index) => (
                        <React.Fragment key={index}>
                          {item?.name && <>{item?.name}</>}
                          {" - "}
                          {item?.contactNumber && <>{item?.contactNumber}</>}
                          {item?.contactNumber && item?.alternateContactNumber
                            ? ", "
                            : ""}
                          {item?.alternateContactNumber && (
                            <>{item?.alternateContactNumber}</>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <>
                        {contactNumber && <>{contactNumber}</>}
                        {contactNumber && whatsappContact ? ", " : ""}
                        {whatsappContact && <>{whatsappContact}</>}
                      </>
                    )}
                  </span>
                ) : (
                  <span>
                    {contactNumber && <>{contactNumber}</>}
                    {contactNumber && whatsappContact ? ", " : ""}
                    {whatsappContact && <>{whatsappContact}</>}
                  </span>
                )}
              </div>
              {/* {disabled?.sendRequest?.tech && (
                <div className="tech-button-margin mt-4">
                  <Button
                    className="tech-button"
                    onClick={handleOpenTechnicianDialog}
                    label="Add Technician"
                    icon={<img src={BluePlusIcon} />}
                  ></Button>
                </div>
              )} */}
            </div>
            <div className="ms-auto">
              <div className="p-splitbutton p-component p-button-info p-button-text split-btn">
                <Button
                  className=""
                  onClick={onSendRequest}
                  label="Send Request"
                  icon={<img src={SendBtnIcon} />}
                  loading={sendRequestLoading}
                  //disabled={activityId ? true : false}
                  disabled={disabled?.sendRequest?.send}
                ></Button>
                {!activityData?.customerNeedToPay &&
                aspActivityStatusId == 2 ? (
                  <>
                    <Menu
                      model={itemsChange}
                      popup
                      ref={menuChangeOption}
                      id="popup_menu_options"
                      popupAlignment="right"
                    />
                    <Button
                      icon={<img src={DotIcon} />}
                      onClick={(event) => {
                        menuChangeOption.current.toggle(event);
                        aspRequestRefetch();
                        activityViewRefetch();
                      }}
                      aria-controls="popup_menu_options"
                      aria-haspopup
                    />
                  </>
                ) : (
                  <>
                    <Menu
                      model={items}
                      popup
                      ref={menuOptions}
                      id="popup_menu_options"
                      popupAlignment="right"
                    />
                    <Button
                      icon={<img src={DotIcon} />}
                      onClick={(event) => {
                        menuOptions.current.toggle(event);
                        aspRequestRefetch();
                      }}
                      aria-controls="popup_menu_options"
                      aria-haspopup
                      disabled={disabled?.acceptReject}
                      //disabled={disableRequest?.sendRequestDisable}
                      // disabled={activityId ? false : true}
                    />
                  </>
                )}
              </div>

              {/* <SplitButton
              onClick={onSendRequest}
              loading={sendRequestLoading}
              label="Send Request"
              pt={{
                root: {
                  className: `split-btn ${
                    mainsplitdisabled ? "disable-main-btn" : ""
                  }`,
                },
              }}
              icon={<img src={SendBtnIcon} />}
              model={items}
              severity="info"
              text
              dropdownIcon={<img src={DotIcon} />}
            /> */}
            </div>
          </div>
        </div>
        {rsaCase ? (
          <div className="d-flex justify-content-between asp-card-info-footer">
            <div>
              <b>Manager & Driver Info</b>
            </div>
            <div className="">
              <Button
                className="btn btn-icon bg-transparent"
                icon={<CollapsePlusIcon />}
                text
                onClick={handleAspInfo}
              />
            </div>
          </div>
        ) : (
          <Panel
            header="Manager Info"
            toggleable
            collapsed={true}
            className="asp-assignment-panel"
            expandIcon={(options) => (
              <CollapsePlusIcon {...options.iconProps} />
            )}
            collapseIcon={(options) => (
              <CollapseMinusIcon {...options.iconProps} />
            )}
          >
            <div className="asp-panel-content">
              <div className="asp-panel-content-left">
                <div>
                  <h4 className="asp-panel-title">Regional Manager Name</h4>
                  <span className="asp-panel-name">{reginalManager}</span>
                </div>
                <div className="ms-auto">
                  <h4 className="asp-panel-title">
                    {" "}
                    Regional Manager Mobile No
                  </h4>
                  <div className="asp-card-info-with-icon">
                    <img src={PhoneGrayIcon} />
                    <span>{reginalContact}</span>
                  </div>
                </div>
              </div>
              <hr />
              {zonalManager && (
                <>
                  <div>
                    <p className="mt-4 fnt-sbd">Zonal Manager</p>
                    <span className="asp-panel-name">{zonalManager}</span>
                    <div className="asp-card-info-with-icon">
                      <img src={PhoneGrayIcon} />
                      <span>{zonalContact}</span>
                    </div>
                  </div>
                  <hr />
                </>
              )}
              {nationalManager && (
                <>
                  <div>
                    <p className="mt-4 fnt-sbd">National Manager</p>
                    <span className="asp-panel-name">{nationalManager}</span>
                    <div className="asp-card-info-with-icon">
                      <img src={PhoneGrayIcon} />
                      <span>{nationalContact}</span>
                    </div>
                  </div>
                </>
              )}
              {/* <div className="asp-panel-content-right">
                <div>
                  <h4 className="asp-panel-title">Zonal Manager Name</h4>
                  <span className="asp-panel-name">{zonalManager}</span>
                </div>
                <div>
                  <h4 className="asp-panel-title">Zonal Manager Mobile No</h4>
                  <div className="asp-card-info-with-icon">
                    <img src={PhoneGrayIcon} />
                    <span>8967543231, 8967543231</span>
                  </div>
                </div>
              </div> */}
            </div>
          </Panel>
        )}
      </div>
      {rsaCase && visible && (
        <CaseServiceTowingDialog
          activityId={activityId}
          visible={visible}
          companyName={companyName}
          setVisible={setVisible}
          aspId={aspId}
          caseId={caseId}
          serviceId={serviceId}
          caseData={caseData}
          viewMode={viewMode}
          isOwnPatrol={isOwnPatrol}
          // details={{
          //   ...acceptRequestData?.data?.data,
          //   totaladditionalcharge:
          //     Number(acceptRequestData?.data?.data?.tollCharges) +
          //     Number(acceptRequestData?.data?.data?.borderCharges) +
          //     Number(acceptRequestData?.data?.data?.greenTaxCharges),
          // }}
          mapLocation={mapLocation}
          caseActivityId={caseActivityId}
          activityData={activityData}
          aspRequestRefetch={aspRequestRefetch}
          updateMode={updateMode}
          aspActivityStatusId={aspActivityStatusId}
          activityViewRefetch={activityViewRefetch}
        />
      )}
      {!rsaCase && visible && (
        <ServiceTowingDialog
          activityId={activityId}
          visible={visible}
          companyName={companyName}
          setVisible={setVisible}
          aspId={aspId}
          caseId={caseId}
          viewMode={viewMode}
          isOwnPatrol={isOwnPatrol}
          // details={{
          //   ...acceptRequestData?.data?.data,
          //   totaladditionalcharge:
          //     Number(acceptRequestData?.data?.data?.tollCharges) +
          //     Number(acceptRequestData?.data?.data?.borderCharges) +
          //     Number(acceptRequestData?.data?.data?.greenTaxCharges),
          // }}
          mapLocation={mapLocation}
        />
      )}

      {rsaAcceptVisible && (
        <AcceptServiceRequestDialog
          visible={rsaAcceptVisible}
          setVisible={setRsaAcceptVisible}
          handleFormSubmit={handleAcceptedFormSubmit}
          submitLoading={caseAccectRequestLoading}
          slaViolated={slaViolatedVisible}
          aspRequestRefetch={aspRequestRefetch}
          breakdownReachTimeSlaDateTime={
            caseData?.breakdownReachTimeSLA?.slaTime
              ? caseData.breakdownReachTimeSLA.slaTime
              : null
          }
        />
      )}

      {managerSiderVisible && (
        <Sidebar
          visible={managerSiderVisible}
          position="right"
          closeIcon={<DialogCloseIcon />}
          onHide={() => setManagerSiderVisible(false)}
          pt={{
            root: { className: "aspInfo-sidebar" },
          }}
          icons={
            <div>
              <div className="asp-card-info-header">
                <div className="d-flex gap-2">
                  <img
                    src={CarTechnicianIcon}
                    className="asp-card-info-header-icon"
                  />
                  <div>
                    {isOwnPatrol && ownPatrolVehicleRegistrationNumber ? (
                      <span className="asp-card-info-title">
                        <b>{companyName}</b> - {companyCode} -{" "}
                        {ownPatrolVehicleRegistrationNumber}
                      </span>
                    ) : (
                      <span className="asp-card-info-title">
                        <b>{companyName}</b> - {companyCode}
                      </span>
                    )}
                    <div className="asp-card-info-subtitle">
                      {/*  <span className="asp-card-info-point">{'4'}</span>
                      <img src={YellowStarIcon} />*/}
                      {isOwnPatrol && !cocoTechnicianInShift ? (
                        <span className="asp-card-info-status offline">
                          {"Offline"}
                        </span>
                      ) : (
                        <span
                          className={`asp-card-info-status ${
                            available ? "available" : "busy"
                          }`}
                        >
                          {available ? "Avalilable" : "Busy"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="asp-card-info-content gap-2">
                <div className="d-flex align-items-center">
                  <div>
                    <h4 className="asp-card-info-name">
                      {location}
                      {addressLineOne}
                      {addressLineTwo},{state},{city}
                    </h4>
                    <div
                      className="asp-card-info-with-icon"
                      onClick={(e) => option.current.toggle(e)}
                    >
                      <img src={PhoneGrayIcon} />
                      <span>
                        {contactNumber ?? "--"},{whatsappContact ?? "--"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <div className="sidebar-content-wrap">
            <div className="sidebar-content-header">
              <TabMenu
                model={siderItems}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
              />
            </div>
            <div className="sidebar-content-body">
              <TabView
                className="tab-header-hidden aspInfo-sidebar-tab"
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
              >
                <TabPanel>
                  {aspMechanics?.length > 0 ? (
                    <div className="mechanic-list">
                      {aspMechanics?.map((aspMechanic, i) => (
                        <div
                          className="mechanic-list-item d-flex gap-2"
                          key={i}
                        >
                          <Avatar
                            text={aspMechanic?.name?.charAt(0).toUpperCase()}
                            className={"aspMechanic-avatar"}
                          />
                          <div>
                            <div className="fnt-sbd">
                              {aspMechanic?.name}{" "}
                              {aspMechanic?.status && (
                                <span
                                  className={
                                    aspMechanic?.status
                                      ? "color-success"
                                      : "color-error"
                                  }
                                >
                                  {aspMechanic?.status || "--"}
                                </span>
                              )}
                            </div>
                            <div className="asp-card-info-with-icon">
                              <img src={PhoneGrayIcon} />
                              <span>
                                {aspMechanic?.contactNumber}
                                {aspMechanic?.alternateContactNumber
                                  ? `,  ${aspMechanic?.alternateContactNumber}`
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
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
                  <div>
                    <p className="mb-2 fnt-sbd">Regional Manager</p>
                    <span className="asp-panel-name">{reginalManager}</span>
                    <div className="asp-card-info-with-icon">
                      <img src={PhoneGrayIcon} />
                      <span>{reginalContact}</span>
                    </div>
                  </div>
                  <hr />
                  {zonalManager && (
                    <>
                      <div>
                        <p className="mt-4 fnt-sbd">Zonal Manager</p>
                        <span className="asp-panel-name">{zonalManager}</span>
                        <div className="asp-card-info-with-icon">
                          <img src={PhoneGrayIcon} />
                          <span>{zonalContact}</span>
                        </div>
                      </div>
                      <hr />
                    </>
                  )}
                  {nationalManager && (
                    <>
                      <div>
                        <p className="mt-4 fnt-sbd">National Manager</p>
                        <span className="asp-panel-name">
                          {nationalManager}
                        </span>
                        <div className="asp-card-info-with-icon">
                          <img src={PhoneGrayIcon} />
                          <span>{nationalContact}</span>
                        </div>
                      </div>
                    </>
                  )}
                </TabPanel>
              </TabView>
            </div>
          </div>
        </Sidebar>
      )}

      <OverlayPanel ref={option} className="contact-detail">
        {/* <div className="d-flex gap-2 pointer" onClick={()=>handleOutBoundCallContact()}>
          <img src={PhoneGrayIcon} />
          <span>{contactNumber ?? "--"}</span>
        </div>
        <div className="d-flex gap-2 pointer" onClick={() => handleOutBoundCallWhatsApp()}>
          <img src={PhoneGrayIcon} />
          <span>{whatsappContact ?? "--"}</span>
        </div> */}
        {(isOwnPatrol
          ? aspMechanics?.length === 1
            ? aspMechanics[0]?.contactNumber
            : contactNumber
          : contactNumber) && (
          <div className="d-flex gap-2">
            <img src={PhoneGrayIcon} alt="Phone Icon" />
            <span>
              {isOwnPatrol
                ? aspMechanics?.length === 1
                  ? aspMechanics[0]?.contactNumber
                  : contactNumber
                : contactNumber}
            </span>
          </div>
        )}
        {(isOwnPatrol
          ? aspMechanics?.length === 1
            ? aspMechanics[0]?.alternateContactNumber
            : whatsappContact
          : whatsappContact) && (
          <div className="d-flex gap-2">
            <img src={PhoneGrayIcon} alt="Phone Icon" />
            <span>
              {isOwnPatrol
                ? aspMechanics?.length === 1
                  ? aspMechanics[0]?.alternateContactNumber
                  : whatsappContact
                : whatsappContact}
            </span>
          </div>
        )}
      </OverlayPanel>
      <OverlayPanel ref={op} className="warning-panel">
        <div className="warning-card-container">
          <div className="warning-card-title">TVS A.A Own Patrol</div>
          <div>
            {" "}
            <Chip
              label={"Busy"}
              className="info-chip danger case-status-chip"
            />
          </div>
          <div>Assigned to another Case</div>
          <div className="warning-card-list">
            <div>
              <span className="warning-card-name">Case Completion</span>
              <div className="warning-card-detail">1hr 50min</div>
            </div>
            <Divider layout="vertical" />
            <div>
              <span className="warning-card-name">BD Reach time</span>
              <div className="warning-card-detail">1hr 5min</div>
            </div>
            <Divider layout="vertical" />
            <div>
              <span className="warning-card-name">Garage Reach time</span>
              <div className="warning-card-detail">45min</div>
            </div>
          </div>
        </div>
      </OverlayPanel>

      {slaReasonVisible && (
        <Dialog
          header={
            <>
              <div className="dialog-header">
                <div className="dialog-header-title">
                  ASP Assignment & Acceptance
                </div>
              </div>
              <TimerChip label="SLA Violated" type="red" />
            </>
          }
          visible={slaReasonVisible}
          className="w-372"
          position={"bottom"}
          onHide={() => setSlaReasonVisible(false)}
          draggable={false}
          resizable={false}
          closeIcon={<img src={DialogCloseSmallIcon} />}
        >
          <form
            onSubmit={handleSubmit(slaViolationSubmit)}
            id="reject-reason-form"
          >
            <div className="row row-gap-3_4 mt-2">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">
                    SLA Violated Reason
                  </label>
                  <Controller
                    name="slaViolateReasonId"
                    control={control}
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
              loading={isLoading}
            >
              Update
            </Button>
          </form>
        </Dialog>
      )}
      {/* <AddTechnicianDialog
        visible={openTechnicianDialog}
        onHide={handleCloseTechnicianDialog}
        subServiceId={subServiceId}
        aspId={aspId}
        nearASPRefetch={nearASPRefetch}
      /> */}
      <InterActionSidebar
        visible={interactionDialogVisible}
        setVisible={setInteractionDialogVisible}
        data={interactionFormData?.data?.data?.extras}
        onSave={handleSaveInteraction}
        isLoading={interactionMutateLoading}
         selectedAsp={selectedAspForInteraction}
      />
    </>
  );
};

export default ASPCard;
