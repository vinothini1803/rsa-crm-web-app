import React, { useState } from "react";
import NameComponent from "../../components/common/NameComponent";
import Note from "../../components/common/Note";
import {
  AspImage,
  CallImage,
  CancelCaseImage,
  DialogCloseSmallIcon,
  NoAgentImage,
  NoAgentRed,
  NoPolicyImage,
  NotificationGreyImage,
} from "../../utills/imgConstants";
import TimerChip from "../../components/common/TimerChip";
import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import TabMenuItem from "../../components/common/TabMenuItem";
import NoDataComponent from "../../components/common/NoDataComponent";
import InfoComponent from "../../components/common/InfoComponent";
import { Dropdown } from "primereact/dropdown";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { useLocation, useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
  agent,
  assginAgent,
  updateCaseCancel,
} from "../../../services/deliveryRequestViewService";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import moment from "moment";

import {
  caseCancelReason,
  slaViolateReasons,
} from "../../../services/masterServices";
import { clickToCall } from "../../../services/callService";

const RequestViewCard = ({
  setSendNoticationVisible,
  agentDetails,
  dealerDetails,
  agentId,
  refetch,
  caseNumber,
  caseStatusId,
  activityDetails,
  slaTime,
  caseData,
}) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closeCaseVisible, setCloseCaseVisible] = useState(false);
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const user = useSelector(CurrentUser);
  //userTypeId=141--->Agent ,140---->Dealer
  const params = useParams();
  // console.log("caseData", caseData);
  // console.log("paramid", params);

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      agent: "",
    },
  });
  const {
    handleSubmit: handleSlaReasonSubmit,
    control: slaContol,
    getValues: slaReasonGetValues,
    formState: { errorsSlaReasons },
    reset: slaReasonReset,
    setValue: setSlaReason,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const {
    handleSubmit: handleCaseCloseSubmit,
    control: controlCase,
    formState: { errors: caseCloseerrors },
    reset: resetCaseClose,
  } = useForm();
  const { data } = useQuery(
    "agent",
    () =>
      agent({
        userTypeId: 141,
        limit: 1000,
        offset: 0,
      }),
    {
      enabled: visible,
    }
  );

  //SLA violate Reasons dropdown

  const { data: reasons = [] } = useQuery(
    ["reasonList", role.id],
    () => slaViolateReasons({ apiType: "dropdown", roleId: role.id }),
    {
      enabled: visible,
    }
  );
  const { mutate: outboundCallMutate, isLoading: outboundCallLoading } =
    useMutation(clickToCall);

  const { mutate, isLoading } = useMutation(assginAgent);

  // console.log("Agent List", data?.data?.data, "userId", id);
  const { data: caseCancelReasonData } = useQuery(["caseCancelReason"], () =>
    caseCancelReason({
      apiType: "dropdown",
      typeId: 2,
    })
  );

  const { mutate: caseCancelMutate, isLoading: caseCancelIsLoading } =
    useMutation(updateCaseCancel);

  // console.log("caseCancelReasonData", caseCancelReasonData);
  const tabItems = [{ label: <TabMenuItem label="Agent Info" /> }];

  const AgentData = [
    {
      title: "Agent Name",
      info: agentDetails?.name,
    },
    {
      title: "Agent ID",
      info: agentDetails?.code,
    },
    {
      title: "Agent Mail ID",
      info: agentDetails?.email,
    },
    { title: "Agent Contact Number", info: agentDetails?.mobileNumber },
  ];
  const handleAddAgent = () => {
    setVisible(true);
  };
  const onSubmit = (value) => {
    if (value) {
      mutate(
        {
          caseDetailId: params?.caseId,
          agentId: parseInt(value?.agent?.id),
          ...(slaExceeded && {
            slaViolateReasonId: value.slaViolateReasonId.id,
          }),
        },
        {
          onSuccess: (res) => {
            if (res?.data?.success) {
              toast.success(res?.data?.message);
              if (value?.agent?.id !== id) {
                navigate("/delivery-request");
              }

              setVisible(false);
              refetch(); //refetch cadse details after agent assign
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

  const handleCloseCase = (values) => {
    // console.log("values", values);
    caseCancelMutate(
      {
        caseDetailId: params?.caseId,
        cancelReasonId: values?.rejectReasonId,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast?.success(res?.data?.message);
            setCloseCaseVisible(false);
            resetCaseClose();
            refetch();
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
  //   "cancel case option",
  //   !activityDetails?.some((activity) =>
  //     [3, 4, 10, 11, 12, 13, 14]?.includes(activity?.activityStatusId)
  //   ),
  //   dealerDetails?.createdDealerId,
  //   entityId
  // );
  const handleOutBoundCall = (value) => {
    outboundCallMutate(
      {
        agentId: user?.userName,
        campaignName: caseData?.dialerCampaignName,
        customerNumber: value,
        caseDetailId: caseData?.caseDetailId?.toString(),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast?.success(res?.data?.message);
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

  //SLA Time Limit
  const isSlaExceeded = () => {
    const slaForTypeId360 = slaTime?.find(
      (item) => item.typeId === 360
    )?.timeInMilliSeconds;
    const createdAt = dealerDetails?.createdAtInMilliSeconds; // createdAt in milliseconds
    const slaTimeMilliSeconds = slaForTypeId360; // SLA time in milliseconds

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

  return (
    <>
      <div className="aside-view-card">
        <div className="aside-view-card-header">
          <div className="fnt-md">{dealerDetails?.createdAt ?? "--"}</div>{" "}
          {/* 02-03-2022 20:20 AM */}
          <div className="aside-view-card-title">
            View Request <span className="subtitle"> - {caseNumber}</span>
          </div>
        </div>
        <div className="aside-view-card-body">
          <NameComponent
            name={dealerDetails?.name}
            email={dealerDetails?.email}
          />
          <div className="aside-view-card-action-wrap">
            {userTypeId == 141 && caseStatusId !== 4 && caseStatusId !== 3 && (
              <button
                className="action-item btn btn-brdr-transparent bg-transparent p-0"
                onClick={() =>
                  navigate(
                    `/delivery-request/${params?.caseId}/service-provider`
                  )
                }
                disabled={agentId ? false : true}
              >
                <img className="action-image" src={AspImage} />
                <div className="action-name text-align-center">
                  Assign Service
                  <br />
                  Provider
                </div>
              </button>
            )}
            <button
              // className="action-item"
              className="action-item btn btn-brdr-transparent bg-transparent btn-text p-0"
              // href={`tel:${"8876727626"}`}
              onClick={(e) => {
                e.preventDefault();
                handleOutBoundCall(agentDetails?.mobileNumber);
              }}
              disabled={!agentDetails?.mobileNumber}
            >
              <img className="action-image" src={CallImage} />
              <div className="action-name">Call</div>
            </button>
            <button
              className="action-item btn btn-brdr-transparent bg-transparent btn-text p-0"
              onClick={() => setSendNoticationVisible(true)}
              disabled
            >
              <img className="action-image" src={NotificationGreyImage} />
              <div className="action-name">Notification</div>
            </button>
            {((dealerDetails?.createdDealerId == entityId &&
              activityDetails?.length == 0 &&
              caseStatusId !== 3 &&
              caseStatusId !== 4) ||
              (userTypeId == 141 &&
                caseStatusId !== 3 &&
                caseStatusId !== 4 &&
                agentId &&
                !activityDetails?.some((activity) =>
                  [3, 7, 10, 11, 12, 13, 14]?.includes(
                    activity?.activityStatusId
                  )
                ))) && (
              <button
                className="action-item btn btn-brdr-transparent bg-transparent btn-text p-0"
                onClick={() => setCloseCaseVisible(true)}
              >
                <img className="action-image" src={CancelCaseImage} />
                <div className="action-name">Cancel Case</div>
              </button>
            )}
          </div>
          <Note type={"blue"} icon={false} purpose={"note"}>
            <div>
              <div className="note-title">Remarks</div>
              <div className="note-content">{dealerDetails?.remarks}</div>
            </div>
          </Note>
          <div className="mt-3">
            <TabMenu
              model={tabItems}
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
              // className="equal-grid"
              className="min-168"
            />
            <div className="case-detail agent-tab">
              <TabView
                className="tab-header-hidden case-view-tab bg-transparent"
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
              >
                <TabPanel>
                  <div className="case-view-tab-content">
                    {agentId ? (
                      <>
                        {AgentData?.map((data, i) => (
                          <InfoComponent
                            title={data?.title}
                            info={data?.info}
                            key={i}
                            infoContentClass={"whitespace-nowrap"}
                          />
                        ))}
                      </>
                    ) : (
                      <Note
                        type={"danger"}
                        icon={false}
                        purpose={"note"}
                        style={{ justifyContent: "center" }}
                      >
                        <NoDataComponent
                          image={NoAgentRed}
                          text={"No agent Assigned"}
                          btntext={"Assign Agent"}
                          onClick={handleAddAgent}
                          addbtn={userTypeId == 141 ? true : false}
                        />
                      </Note>
                    )}
                  </div>
                </TabPanel>
              </TabView>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        header={
          <>
            <div className="dialog-header">
              <div className="dialog-header-title">Assign Agent</div>
            </div>
            {slaExceeded ? <TimerChip label="SLA Violated" type="red" /> : null}
          </>
        }
        visible={visible}
        className="w-372"
        position={"bottom"}
        onHide={() => setVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleSubmit(onSubmit)} id="agent-form">
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Agent</label>
                <Controller
                  name="agent"
                  control={control}
                  rules={{ required: "Agent is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        placeholder="Select Agent"
                        options={data?.data?.data
                          ?.filter((a) => a.id === id)
                          // OTHER AGENT SELECTION DISABLED - SAID BY BUSINESS TEAM
                          // ?.sort((a, b) =>
                          //   a.id === id //'a' comes first because it has the target ID
                          //     ? -1
                          //     : b.id == id // 'b' comes first because it has the target ID
                          //     ? 1
                          //     : // Sort alphabetically by the 'name' property
                          //     a.name.toUpperCase() < b.name.toUpperCase()
                          //     ? -1
                          //     : 1
                          // )
                          ?.map((agent) => {
                            return {
                              name:
                                agent.id == id
                                  ? `${agent.name}-(Self Assign)`
                                  : agent.name,
                              id: agent.id,
                            };
                          })}
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
          {slaExceeded ? (
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
          ) : null}
          <Button
            className="confirm-btn mt-2"
            type="submit"
            form="agent-form"
            loading={isLoading}
            //disabled={caseStatusId == 3 ? true : false}
          >
            Assign
          </Button>
        </form>
      </Dialog>

      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title"> Cancel Reason</div>
          </div>
        }
        visible={closeCaseVisible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setCloseCaseVisible(false);
          resetCaseClose();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form
          onSubmit={handleCaseCloseSubmit(handleCloseCase)}
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
                        // options={caseCancelReasonData?.data?.data?.rows?.map(
                        //   ({ name, id }) => {
                        //     return {
                        //       label: name,
                        //       value: id,
                        //     };
                        //   }
                        // )}
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
    </>
  );
};

export default RequestViewCard;
