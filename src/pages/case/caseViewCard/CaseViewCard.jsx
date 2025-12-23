import React, { useRef, useState } from "react";
import "../style.less";
import { Chip } from "primereact/chip";
import {
  AspImage,
  AddGreyCircleIcon,
  CallImage,
  CancelCaseImage,
  MoreImage,
  NoPolicyImage,
  NotificationGreyImage,
  DialogCloseSmallIcon,
  SpannerImage,
} from "../../../utills/imgConstants";
import { useSelector } from "react-redux";
import { useQuery, useMutation } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import NameComponent from "../../../components/common/NameComponent";
import { Menu } from "primereact/menu";
import Note from "../../../components/common/Note";
import { TabMenu } from "primereact/tabmenu";
import TabMenuItem from "../../../components/common/TabMenuItem";
import { TabView, TabPanel } from "primereact/tabview";
import EmptyComponent from "../../../components/common/TableWrapper/EmptyComponent";
import NoDataComponent from "../../../components/common/NoDataComponent";
import PolicySideBar from "./PolicySideBar";
import AgentFollowupDialog from "./AgentFollowupDialog";
import CloseCaseDialog from "./CloseCaseDialog";
import UpgradePolicyCard from "./UpgradePolicyCard";
import UpgradeDialog from "./UpgradeDialog";
import UploadDocsDialog from "./UploadDocsDialog";
import AttachmentsDialog from "../../../components/common/AttachmentsDialog";
import InfoComponent from "../../../components/common/InfoComponent";
import SendNotificationSidebar from "../../../components/common/SendNotificationSidebar";
import StatusBadge from "../../../components/common/StatusBadge";
import TimerChip from "../../../components/common/TimerChip";
import { Tooltip } from "primereact/tooltip";
import {
  requestPolicyInterestedCustomer,
  uploadAccidentalDocument,
  sendAccidentalDocumentUrl,
} from "../../../../services/caseService";
import { clickToCall } from "../../../../services/callService";
import { CurrentUser } from "../../../../store/slices/userSlice";
import { updateCaseCancel } from "../../../../services/deliveryRequestViewService";
import { caseCancelReason } from "../../../../services/masterServices";
import moment from "moment";

const CaseViewCard = ({
  caseData,
  caseStatusId,
  caseViewRefetch,
  handleAspAssign,
  activityDetails,
  setServiceVisible,
}) => {
  const navigate = useNavigate();
  const moremenu = useRef(null);
  const moremenuTL = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { userTypeId, id, entityId } = useSelector(CurrentUser);
  const params = useParams();
  // console.log("entityId", entityId);
  const user = useSelector(CurrentUser);
  const [visible, setVisible] = useState(false);
  const [agentFollowUpVisible, setAgentFollwUpVisible] = useState(false);
  const [closeCaseVisible, setCloseCaseVisible] = useState(false);
  const [cancelCaseVisible, setCancelCaseVisible] = useState(false);
  const [upgradeDialogVisible, setUpgradeDialogVisible] = useState(false);
  const [uploadDialogVisible, setUploadDialogVisible] = useState(false);
  const [attachmentDialogVisible, setAttachmentDialogVisible] = useState(false);
  const [sendNotificationVisible, setSendNoticationVisible] = useState(false);
  const [attachmentLinkVisible, setAttachmentLinkVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const permissions = user?.role?.permissions?.map((perm) => perm.name) || [];
  const { data: caseCancelReasonData } = useQuery(["caseCancelReason"], () =>
    caseCancelReason({
      apiType: "dropdown",
      typeId: 2,
    })
  );
  const { mutate: caseCancelMutate, isLoading: caseCancelIsLoading } =
    useMutation(updateCaseCancel);
  const { mutate: outboundCallMutate, isLoading: outboundCallLoading } =
    useMutation(clickToCall);
  const {
    handleSubmit: handleCaseCloseSubmit,
    control: controlCase,
    formState: { errors: caseCloseerrors },
    reset: resetCaseClose,
  } = useForm();

  const {
    handleSubmit: handleAttachmentLinkSubmit,
    control: controlAttachmentLink,
    formState: { errors: attachmentLinkErrors },
    reset: resetAttachmentLink,
  } = useForm();

  const Details = [
    { title: "Customer Name", info: "Arun Kumar R" },
    {
      title: "Status",
      info: <StatusBadge text={"Inprogress"} statusId={3} />,
    },
    {
      title: "Case ID",
      info: "ANICS329870CG93",
    },
    {
      title: "Vehicle No",
      info: "TN70AM2694",
    },
    {
      title: "Description",
      info: "Starting Problem, Black Smoke when tried to start vehicle, Loud sound from engine.",
    },
    {
      title: "Dealer",
      info: "Tata Motors",
    },
  ];
  const attachments = [
    {
      name: "Fircopy.pdf",
      url: "https://source.unsplash.com/snNHKZ-mGfE",
    },
    {
      name: "Insurance.pdf",
      url: "https://source.unsplash.com/snNHKZ-mGfE",
    },
  ];

  const tabItems = [
    { label: <TabMenuItem label="Vehicle Info" /> },
    { label: <TabMenuItem label="Policy Info" /> },
  ];

  // console.log("Case Data => ", caseData);

  const {
    data: requestPolicyInterestData,
    mutate: requestPolicyInterestMutate,
    isLoading: requestPolicyInterestLoading,
  } = useMutation(requestPolicyInterestedCustomer);

  const {
    data: uploadAccidentalDocumentData,
    mutate: uploadAccidentalDocumentMutate,
    isLoading: uploadAccidentalDocumentLoading,
  } = useMutation(uploadAccidentalDocument);

  const {
    data: sendAttachmentLinkData,
    mutate: sendAttachmentLinkMutate,
    isLoading: sendAttachmentLinkLoading,
  } = useMutation(sendAccidentalDocumentUrl, {
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast?.success(res?.data?.message);
        setAttachmentLinkVisible(false);
        resetAttachmentLink();
        caseViewRefetch();
      } else {
        toast?.error(res?.data?.error);
      }
    },
  });

  const handleAttachmentLinkDialoge = () => {
    if (caseData?.accidentalDocLinkId) {
      const inputDateString = moment(
        caseData?.accidentalDocumentLink?.createdAt
      );
      // const currentDateString = moment();
      const diffInSeconds = moment().diff(inputDateString, "seconds");
      // console.log('Date String => ', moment(inputDateString).format('DD-MM-YYYY hh:mm:ss A'), moment(currentDateString).format('DD-MM-YYYY hh:mm:ss A'));
      // console.log("Diff String =>", diffInSeconds);
      if (diffInSeconds > 60) {
        setAttachmentLinkVisible(true);
      } else {
        toast?.warning(
          `Resend link available after ${60 - diffInSeconds} seconds`
        );
      }
    } else {
      setAttachmentLinkVisible(true);
    }
  };
  const itemsTL = [
    {
      label: "Agent Followup",
      template: (
        <div
          className="case-menu-item"
          onClick={() => setAgentFollwUpVisible(true)}
        >
          Agent Followup
        </div>
      ),
    },
  ];
  const items = [
    /* {
      label: "Add Service",
      template: <div className="case-menu-item" onClick={()=>setServiceVisible(true)}>Add Service</div>,
    }, */
    /* {
      label: "Update ASP Status",
      template: <div className="case-menu-item">Update ASP Status</div>,
    }, */
    /* {
      label: "Agent Followup",
      template: (
        <div
          className="case-menu-item"
          onClick={() => setAgentFollwUpVisible(true)}
        >
          Agent Followup
        </div>
      ),
    }, */
    /* {
      label: "Send Payment Link",
      template: <div className="case-menu-item">Send Payment Link</div>,
    }, */
    ...(caseData?.caseTypeId == 413 &&
    caseData?.hasAccidentalDocument == false &&
    caseData?.agentId &&
    caseStatusId == 2 &&
    permissions?.includes("case-send-accidental-document-link-web") &&
    (id == caseData?.l1AgentId || id == caseData?.agentId)
      ? [
          {
            label: "Send Attachment Link",
            template: (
              <div
                className="case-menu-item"
                onClick={() => handleAttachmentLinkDialoge()}
              >
                Send Document Link
              </div>
            ),
          },
        ]
      : []),
    ...(userTypeId === 141 &&
    caseStatusId !== 3 &&
    caseStatusId !== 4 &&
    caseData?.agentId &&
    id == caseData?.agentId &&
    // user?.role?.id == 3
    permissions?.includes("case-cancel-web") &&
    !activityDetails?.some((activity) =>
      [3, 7, 10, 11, 12, 13, 14].includes(activity?.activityStatusId)
    )
      ? [
          {
            label: "Cancel Case",
            template: (
              <div
                className="case-menu-item close-case"
                onClick={() => setCancelCaseVisible(true)}
              >
                Cancel Case
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleAddPolicy = () => {
    // console.log("policy added");
    setVisible(true);
    setEditVisible(false);
  };

  const handleEditPolicy = () => {
    // console.log("policy added");
    setVisible(true);
    setEditVisible(true);
  };

  const handleDocuments = () => {
    if (caseData?.accidentalAttachments?.length > 0) {
      setAttachmentDialogVisible(true);
    } else {
      setUploadDialogVisible(true);
    }
  };

  const handleUpdateDocuments = () => {
    setAttachmentDialogVisible(false);
    setUploadDialogVisible(true);
  };

  const handleUpgradeChange = (checked) => {
    setUpgradeDialogVisible(checked);
  };

  const handlePolicyUpgrade = (values) => {
    // console.log("Policy Interest values", values, caseData);
    requestPolicyInterestMutate(
      {
        caseDetailId: caseData?.caseDetailId,
        typeId: 1,
        remarks: values.remarks,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast?.success(res?.data?.message);
            setUpgradeDialogVisible(false);
            caseViewRefetch();
          }
        },
      }
    );
  };

  const handleAccidentalAttachments = (values) => {
    // console.log("AccidentalAttachments => ", values);
    const uploadParams = {
      attachmentTypeId: 82,
      attachmentOfId: 101,
      entityId: caseData?.caseDetailId,
      ...(values?.attachments?.filter((file) => file?.id == undefined)
        ?.length == 0 && {
        isFileOptional: true,
      }),
      files: values?.attachments?.filter((file) => file?.id == undefined),
      ...(values?.attachments?.filter((file) => file?.id !== undefined)
        ?.length > 0 && {
        attachmentIds: values?.attachments
          ?.filter((file) => file?.id !== undefined)
          ?.map((file) => {
            return file?.id;
          }),
      }),
    };
    // console.log("AccidentalAttachments => ", uploadParams);
    let formData = new FormData();
    /* Object.entries(uploadParams)?.forEach((el) => {
      if (Array.isArray(el[1])) {
        return el[1]?.forEach((file) => {
          return formData.append(el[0], file);
        });
      }
      return formData.append(el[0], el[1]);
    }); */
    formData.append("attachmentTypeId", 82);
    formData.append("attachmentOfId", 101);
    formData.append("entityId", caseData?.caseDetailId);
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
    uploadAccidentalDocumentMutate(formData, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast?.success(res?.data?.message);
          setUploadDialogVisible(false);
          caseViewRefetch();
        }
      },
    });
  };

  const attachmentsFooterContent = (
    <div className="d-flex justify-content-center">
      <Button
        className="btn-link underline"
        label="Update Attachments"
        link
        onClick={handleUpdateDocuments}
      />
    </div>
  );

  const PolicyData = [
    {
      title: "Policy/Membership No",
      info: (
        <div className="view-grid-item-value info-badge info-badge-yellow">
          98765-44321
        </div>
      ),
    },
    {
      title: "W/EW/RSA Pol SD",
      info: (
        <div className="view-grid-item-value info-badge info-badge-purple">
          02/03/2022
        </div>
      ),
    },
    {
      title: "W/EW/RSA Pol ED",
      info: (
        <div className="view-grid-item-value info-badge info-badge-purple">
          02/03/2022
        </div>
      ),
    },
    { title: "Policy Type", info: "Warranty" },
    {
      title: "Expired Services",
      info: <div className="expired-servive-info">Towing, Cab, Hotel</div>,
    },
    {
      title: "Policy Documents",
      info: (
        <div className="link-text" onClick={handleDocuments}>
          {attachments?.length > 0
            ? "View"
            : user?.role?.id == 3 &&
              user?.levelId != 1045 &&
              id == caseData?.agentId
            ? "Upload"
            : null}{" "}
          Documents
        </div>
      ),
    },
  ];

  const handleCancelCase = (values) => {
    // console.log("values", values);
    caseCancelMutate(
      {
        caseDetailId: params?.caseId,
        cancelReasonId: values?.rejectReasonId,
        cancelRemarks: values?.cancelRemarks || null, // Include cancelRemarks
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast?.success(res?.data?.message);
            setCancelCaseVisible(false);
            resetCaseClose();
            caseViewRefetch();
          } else {
            toast?.error(res?.data?.error);
          }
        },
      }
    );
  };

  const handleSendAttachmentLink = (values) => {
    sendAttachmentLinkMutate({
      entityId: caseData?.caseDetailId,
      entityTypeId: 701,
      linkViaId: values?.linkViaId,
      target: values?.target,
    });
  };

  const handleAccidentalDocumentsFetch = () => {
    caseViewRefetch();
    if (caseData?.hasAccidentalDocument) {
      toast?.success(`Accidental Documents fetched successfully`);
    } else {
      toast?.warning(
        `Please fetch again after uploading the accidental documents!`
      );
    }
  };

  const handleOutBoundCall = () => {
    outboundCallMutate(
      {
        agentId: user?.userName,
        //agentId: "Soundarya1",
        campaignName: caseData?.client,
        customerNumber: caseData?.customerCurrentMobileNumber,
        //customerNumber: "9751912511",
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

  return (
    <div className="case-view-card">
      <div
        className={`case-view-card-container ${
          activeIndex == 1 ? "with-footer" : ""
        }`}
      >
        <div className="case-view-header">
          <div className="case-date">{caseData?.createdAt}</div>

          <div className="case-title">
            View Case <span className="case-no"> - {caseData?.caseNumber}</span>
          </div>
          <Chip
            label={caseData?.client?.toUpperCase()}
            className="info-chip blue reminder-chip"
          />
          {(() => {
            // Get breakdown reach time SLA from caseData
            const breakdownReachSla = caseData?.breakdownReachTimeSLA;
            return breakdownReachSla?.slaStatus ? (
              <div className="breakdown-reach-sla-container mt-2 mb-2 d-flex align-items-center gap-1_2">
                <span className="breakdown-reach-sla-label">
                  Breakdown Reach SLA :
                </span>
                <TimerChip
                  label={breakdownReachSla.slaStatus}
                  type={breakdownReachSla.statusColor}
                />
              </div>
            ) : null;
          })()}
          <div className="case-detail">
            <div className="case-name">
              <img src={SpannerImage} className="" />
              <span>{caseData?.caseSubject}</span>
            </div>
            {/* <Chip label={"Un-assigned"} className={`info-chip unassign`} /> */}
          </div>
        </div>
        <NameComponent
          name={caseData?.customerCurrentContactName}
          email={caseData?.customerCurrentMobileNumber}
        />
        <div className="location-name">{caseData?.contactLanguage}</div>
        <div className="case-action-container">
          {/* {userTypeId == 141 && caseStatusId !== 4 && caseStatusId !== 3 && ( */}
          <>
            {/* <button
                className="action action-item btn btn-brdr-transparent bg-transparent p-0"
                onClick={() => handleAspAssign()}
                disabled={caseData?.agentId ? false : true}
              >
                <img className="action-image" src={AspImage} />
                <div className="action-name text-align-center">Assign ASP</div>
              </button> */}
            <button
              className="action action-item btn btn-brdr-transparent bg-transparent p-0"
              onClick={() => setServiceVisible(true)}
              disabled={
                caseData?.agentId &&
                caseStatusId == 2 &&
                // user?.role?.id == 3
                permissions?.includes("case-add-service-web") &&
                id == caseData?.agentId &&
                user?.levelId != 1045
                  ? false
                  : true
              }
            >
              <img className="action-image" src={AddGreyCircleIcon} />
              <div className="action-name text-align-center">Service</div>
            </button>
          </>
          {/* )} */}
          <a
            className="action action-item"
            //href={`tel:${"8876727626"}`}
            //onClick={() => handleOutBoundCall()}
          >
            <img className="action-image" src={CallImage} />
            <div className="action-name">Call</div>
          </a>
          {/* <button
            className="action action-item btn btn-brdr-transparent bg-transparent btn-text p-0"
            onClick={() => setSendNoticationVisible(true)}
            disabled
          >
            <img className="action-image" src={NotificationGreyImage} />
            <div className="action-name">Notification</div>
          </button> */}
          <Menu
            model={user?.role?.id == 3 ? items : itemsTL}
            popup
            ref={user?.role?.id == 3 ? moremenu : moremenuTL}
            id="popup_menu_right"
            popupAlignment={"right"}
            className="case-more-menu"
          />
          {user?.role?.id == 3 && (
            <button
              className="action action-item btn btn-brdr-transparent bg-transparent btn-text p-0"
              onClick={(e) => moremenu.current.toggle(e)}
              // disabled
              disabled={
                user?.role?.id == 3 &&
                // user?.levelId != 1045 &&
                (id == caseData?.l1AgentId || id == caseData?.agentId) &&
                items?.length > 0
                  ? false
                  : true
              }
            >
              <img className="action-image" src={MoreImage} />
              <div className="action-name">More</div>
            </button>
          )}
          {user?.role?.id == 7 && (
            <button
              className="action action-item btn btn-brdr-transparent bg-transparent btn-text p-0"
              onClick={(e) => moremenuTL.current.toggle(e)}
              disabled={
                user?.role?.id == 7 &&
                caseStatusId != 3 &&
                caseStatusId != 4 &&
                itemsTL?.length > 0
                  ? false
                  : true
              }
            >
              <img className="action-image" src={MoreImage} />
              <div className="action-name">More</div>
            </button>
          )}

          {/* {
            (
              (userTypeId == 141 &&
                caseStatusId !== 3 &&
                caseStatusId !== 4 &&
                caseData?.agentId &&
                !activityDetails?.some((activity) =>
                  [3, 7, 10, 11, 12, 13]?.includes(activity?.activityStatusId)
                ))) &&    <button
                className="action action-item btn btn-brdr-transparent bg-transparent btn-text p-0" 
                onClick={() => setCancelCaseVisible(true)}
              >
                <img className="action-image" src={CancelCaseImage} />
                <div className="action-name">Cancel Case</div>
              </button>
          } */}
        </div>

        {/* <Note type={"info"} icon={false} purpose={"note"}>
          <div className="note-content-container">
            <div className="note-title">Previous Case Feedback</div>
            <div className="note-content">
              Good towing assistance and customer handling, quick action has
              been taken from the action has{" "}
              <span className="blue_text fw-600">View More.</span>
            </div>
          </div>
        </Note> */}
        <div className="case-view-detail-container">
          <TabMenu
            model={tabItems}
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            className="equal-grid"
          />
          <div
            className={`case-detail ${
              activeIndex == 1 ? "policy-tab" : "vehicle-tab"
            }`}
          >
            <TabView
              className="tab-header-hidden case-view-tab bg-transparent"
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
            >
              <TabPanel>
                <div className="case-view-tab-content">
                  <InfoComponent
                    title={"Vehicle No"}
                    info={caseData?.registrationNumber || "--"}
                    infoContentClass={"whitespace-nowrap"}
                  />
                  <InfoComponent
                    title={"VIN No"}
                    info={caseData?.vin || "--"}
                    infoContentClass={"whitespace-nowrap"}
                  />
                  <InfoComponent
                    title={"Vehicle Brand"}
                    info={`${caseData?.vehicleMake} ${caseData?.vehicleModel}`}
                  />
                  <InfoComponent
                    title={"Vehicle Type"}
                    info={caseData?.vehicleType}
                  />
                  <InfoComponent
                    title={"Running KM"}
                    info={
                      caseData?.runningKm ? `${caseData?.runningKm} KM` : "--"
                    }
                  />
                  <InfoComponent
                    title={"Sale Date"}
                    info={
                      <div className="view-grid-item-value info-badge info-badge-purple">
                        {caseData?.saleDate}
                      </div>
                    }
                  />
                  {/* <InfoComponent
                    title={"Condition of Vehicle"}
                    info={caseData?.conditionOfVehicle || "--"}
                  /> */}
                  {caseData?.caseTypeId == 413 &&
                    caseData?.caseStatusId == 2 &&
                    // user?.role?.id == 3
                    permissions?.includes(
                      "case-upload-accidental-document-web"
                    ) && (
                      <InfoComponent
                        title={"Accidental Documents"}
                        info={
                          <div className="d-flex justify-content-between">
                            <button
                              className="btn-link"
                              onClick={handleDocuments}
                              disabled={caseData?.agentId ? false : true}
                            >
                              {caseData?.accidentalAttachments?.length > 0
                                ? "View"
                                : user?.levelId &&
                                  (id == caseData?.l1AgentId ||
                                    id == caseData?.agentId)
                                ? "Upload"
                                : null}{" "}
                              Documents
                            </button>
                            {caseData?.hasAccidentalDocument == false &&
                              caseData?.accidentalDocLinkId && (
                                <button
                                  className="btn-link"
                                  onClick={handleAccidentalDocumentsFetch}
                                  disabled={caseData?.agentId ? false : true}
                                >
                                  Fetch
                                </button>
                              )}
                          </div>
                        }
                      />
                    )}

                  {/* <Note type={"danger"} icon={false} purpose={"note"}>
                    <div className="d-flex gap-2">
                      <div
                        style={{
                          fontWeight: 700,
                          marginRight: "4px",
                         // width: "20%",
                        }}
                      >
                        NOTE :
                      </div>
                      <div style={{ fontWeight: "500" }}>
                        Collect accidental documents to proceed with ASP
                        assignment.
                      </div>
                    </div>
                  </Note> */}
                </div>
              </TabPanel>
              <TabPanel>
                <div className="case-view-tab-content">
                  {caseData?.policyType &&
                  caseData?.policyStartDate &&
                  caseData?.policyEndDate ? (
                    <>
                      <InfoComponent
                        title={"Policy / Membership No"}
                        info={
                          caseData?.policyNumber ? (
                            <div className="view-grid-item-value info-badge info-badge-yellow">
                              {caseData?.policyNumber}
                            </div>
                          ) : (
                            "--"
                          )
                        }
                      />
                      <InfoComponent
                        title={"W/EW/RSA Pol SD"}
                        info={
                          caseData?.policyStartDate ? (
                            <div className="view-grid-item-value info-badge info-badge-purple">
                              {caseData?.policyStartDate}
                            </div>
                          ) : (
                            "--"
                          )
                        }
                      />
                      <InfoComponent
                        title={"W/EW/RSA Pol ED"}
                        info={
                          caseData?.policyEndDate ? (
                            <div className="view-grid-item-value info-badge info-badge-purple">
                              {caseData?.policyEndDate}
                            </div>
                          ) : (
                            "--"
                          )
                        }
                      />
                      <InfoComponent
                        title={"Policy Type"}
                        info={caseData?.policyType || "--"}
                      />
                      {/* <InfoComponent title={"Expired Services"} info={caseData?.policyNumber || '--'} />
                      <InfoComponent title={"Policy Documents"} info={caseData?.policyNumber || '--'} /> */}
                      <InfoComponent
                        title={"Policy Premium"}
                        info={caseData?.policyPremium || "--"}
                      />
                      <div />
                    </>
                  ) : (
                    <>
                      {
                        // user?.role?.id == 3
                        permissions?.includes("add-policy-web") && (
                          <NoDataComponent
                            image={NoPolicyImage}
                            text={"No Policy Information"}
                            btntext={"Add Policy"}
                            onClick={handleAddPolicy}
                          />
                        )
                      }
                    </>
                  )}
                  {caseData?.policyTypeId == 434 &&
                    !caseData.hasActivePolicy &&
                    caseStatusId == 2 &&
                    !caseData?.positiveActivityExists &&
                    // user?.role?.id == 3
                    permissions?.includes("upgrade-policy-web") && (
                      <UpgradePolicyCard
                        onUpgradeChange={handleUpgradeChange}
                        upgradeChanged={upgradeDialogVisible}
                        policyAlreadyRequested={
                          caseData?.policyInterestedCustomer
                        }
                        agentId={caseData?.agentId}
                        caseData={caseData}
                      />
                    )}
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
      {caseData?.policyType &&
        caseData?.policyStartDate &&
        caseData?.policyEndDate &&
        !caseData?.hasActivePolicy &&
        caseStatusId == 2 &&
        !caseData?.positiveActivityExists &&
        // user?.role?.id == 3
        permissions?.includes("edit-policy-web") && (
          <div className="case-view-card-footer">
            <button
              className="btn-link btn-text text-decoration"
              onClick={handleEditPolicy}
            >
              Edit Policy
            </button>
          </div>
        )}
      <PolicySideBar
        visible={visible}
        setVisible={setVisible}
        caseDetailId={caseData?.caseDetailId}
        caseViewRefetch={caseViewRefetch}
        setEditVisible={setEditVisible}
        editVisible={editVisible}
      />
      <AgentFollowupDialog
        visible={agentFollowUpVisible}
        setVisible={setAgentFollwUpVisible}
        caseDetailId={caseData?.caseDetailId}
        caseViewRefetch={caseViewRefetch}
        agentId={caseData?.agentId}
        caseData={caseData}
      />
      <CloseCaseDialog
        visible={closeCaseVisible}
        setVisible={setCloseCaseVisible}
      />
      <UpgradeDialog
        visible={upgradeDialogVisible}
        setVisible={setUpgradeDialogVisible}
        onFormSubmit={handlePolicyUpgrade}
        submitLoading={requestPolicyInterestLoading}
      />
      <UploadDocsDialog
        visible={uploadDialogVisible}
        setVisible={setUploadDialogVisible}
        onFormSubmit={handleAccidentalAttachments}
        submitLoading={uploadAccidentalDocumentLoading}
        defaultValues={caseData?.accidentalAttachments}
      />
      <AttachmentsDialog
        visible={attachmentDialogVisible}
        setVisible={setAttachmentDialogVisible}
        attachments={caseData?.accidentalAttachments?.map((file) => {
          return { ...file, fileName: file?.originalName };
        })}
        title={activeIndex == 1 ? "Policy Documents" : "Accidental Documents"}
        footer={attachmentsFooterContent}
      />
      <SendNotificationSidebar
        Details={Details}
        visible={sendNotificationVisible}
        setVisible={setSendNoticationVisible}
      />
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title"> Cancel Reason</div>
          </div>
        }
        visible={cancelCaseVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setCancelCaseVisible(false);
          resetCaseClose();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form
          onSubmit={handleCaseCloseSubmit(handleCancelCase)}
          id={"reject-reason-form"}
        >
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Cancel Reason</label>
                <Controller
                  name="rejectReasonId"
                  control={controlCase}
                  rules={{ required: "Cancel Reason is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={caseCancelReasonData?.data?.data?.map(
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
                        {caseCloseerrors &&
                          caseCloseerrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Cancel Remarks</label>
                  <Controller
                    name="cancelRemarks"
                    control={controlCase}
                    rules={{ required: "Cancel Remarks is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextarea
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          rows={3}
                          placeholder="Enter cancel remarks"
                          className={fieldState.error ? "p-invalid" : ""}
                        />
                        <div className="p-error">
                          {caseCloseerrors && caseCloseerrors[field.name]?.message}
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
            loading={caseCancelIsLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">
              Send Accidental Attachment Link
            </div>
          </div>
        }
        visible={attachmentLinkVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setAttachmentLinkVisible(false);
          resetAttachmentLink();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form
          onSubmit={handleAttachmentLinkSubmit(handleSendAttachmentLink)}
          id={"sendAttachmentLinkForm"}
        >
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Link Via</label>
                <Controller
                  name="linkViaId"
                  control={controlAttachmentLink}
                  rules={{ required: "Link Via is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={caseData?.extras?.accidentalDocLocationViaTypes?.map(
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
                        {attachmentLinkErrors &&
                          attachmentLinkErrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Mobile Number</label>
                <Controller
                  name="target"
                  control={controlAttachmentLink}
                  rules={{ required: "Mobile Number is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={caseData?.extras?.accidentalDocCaptureContactDetails?.map(
                          (mobileNumber) => {
                            return {
                              label: mobileNumber,
                              value: mobileNumber,
                            };
                          }
                        )}
                        optionLabel="label"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {/* {errors[field.name]?.message} */}
                        {attachmentLinkErrors &&
                          attachmentLinkErrors[field.name]?.message}
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
            form="sendAttachmentLinkForm"
            loading={sendAttachmentLinkLoading}
          >
            Submit
          </Button>
        </form>
      </Dialog>
    </div>
  );
};

export default CaseViewCard;
