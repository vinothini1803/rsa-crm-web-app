import React, { useState } from "react";
import { useParams } from "react-router";
import {
  DialogCloseIcon,
  NotificationSidebarIcon,
} from "../../utills/imgConstants";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import InfoComponent from "./InfoComponent";
import StatusBadge from "./StatusBadge";
import { MultiSelect } from "primereact/multiselect";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";
import SelectableButtons from "../../pages/case/serviceTab/SelectableButtons";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useQuery, useMutation } from "react-query";
import DynamicFieldRenderer from "./DynamicFieldRenderer";
import moment from "moment";
import {
  getEscalationData,
  getTemplateList,
  preview,
  sendNotification,
  sentToData,
  templateDetail,
} from "../../../services/escalationService";

const SendNotificationSidebarCrm = ({
  visible,
  setVisible,
  Details,
  activityId,
  aspRefetch,
  activeServiceIndex
}) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    resetField,
    trigger,
    formState: { errors },
  } = useForm();
  const [selectedmessageOptions, setSelectedMessageOption] = useState("");
  const sendToRoleId = useWatch({ control: control, name: "sendToRoleId" });
  const templateId = useWatch({ control: control, name: "templateId" });
  const toMobileNumbers = useWatch({
    control: control,
    name: "toMobileNumbers",
  });

  //api methods

  const { data, refetch } = useQuery(
    ["getEscalationData", Details?.caseDetailId],
    () =>
      getEscalationData({
        caseDetailId: Details?.caseDetailId,
      }),
    {
      enabled: visible,
    }
  );
  const {
    mutate: sendNotificationMutate,
    data: notificationData,
    isLoading,
  } = useMutation(sendNotification);
  const {
    mutate: previewMutate,
    data: previewData,
    isLoading: previewLoading,
  } = useMutation(preview);

  const { data: templateData, refetch: refetchTemplateData } = useQuery(
    [" getTemplateList", sendToRoleId, selectedmessageOptions?.[0]],
    () =>
      getTemplateList({
        clientId: Details?.clientId,
        typeId: selectedmessageOptions?.[0],
        ...(selectedmessageOptions?.[0] == 900 && {
          sendToRoleId: sendToRoleId,
        }),
      }),
    {
      enabled:
        selectedmessageOptions?.[0] == 900
          ? !!selectedmessageOptions?.[0] && !!sendToRoleId
          : !!selectedmessageOptions?.[0],
    }
  );

  const { data: sentData, refetch: refetchSentToData } = useQuery(
    ["sentToData", templateId],
    () =>
      sentToData({
        caseDetailId: Details?.caseDetailId,
        activityId: activityId,
        typeId: selectedmessageOptions?.[0],
        ...(selectedmessageOptions?.[0] != 901 && {
          sendToRoleId: sendToRoleId,
        }),
        templateId: templateId?.id,
      }),
    {
      enabled: !!templateId,
    }
  );
  const { data: templateDetailData, refetch: refetchTemplateDetailData } =
    useQuery(
      ["templateDetail", templateId],
      () =>
        templateDetail({
          caseDetailId: Details?.caseDetailId,
          activityId: activityId,
          templateId: templateId?.id,
        }),
      {
        enabled:
          selectedmessageOptions?.[0] == 900
            ? !!selectedmessageOptions?.[0] && !!sendToRoleId && !!templateId
            : !!selectedmessageOptions?.[0] && !!templateId,
      }
    );

  const info = [
    { title: "Customer Name", info: Details?.customerContactName },
    {
      title: "Status",
      info: (
        <StatusBadge
          text={Details?.caseStatus}
          statusId={Details?.caseStatusId}
          statusType={"activityStatus"}
        />
      ),
    },
    {
      title: "Case ID",
      info: Details?.caseNumber,
    },
    {
      title: "Vehicle No",
      info: Details?.registrationNumber || "-",
    },
    {
      title: "Description",
      info: Details?.voiceOfCustomer,
    },
    {
      title: "Dealer",
      info: Details?.dropDealer || "-",
    },
  ];
  //events
  const handleMessageOptionSelect = (items) => {
    setSelectedMessageOption(items);
    reset();
  };
  const handleTemplateChange = () => {
    refetchTemplateDetailData();
  };
  const handlePreview = async (e) => {
    e.preventDefault();
    const isValid = await trigger();

    if (isValid) {
      const values = getValues();

      const {
        toEmails,
        ccEmails,
        templateId,
        toMobileNumbers,
        sendToRoleId,
        ...filteredValues
      } = values;
      previewMutate(
        {
          templateId: templateId?.id,
          caseDetailId: Details?.caseDetailId,
          activityId: activityId,
          inputFieldDetails: {
            ...filteredValues,
            ...(filteredValues.actual_eta && {
              actual_eta: moment(filteredValues.actual_eta).format("HH:mm"),
            }),
          },
        },
        {
          onSuccess: (res) => {
            if (res?.data?.success) {
              const htmlContent = res?.data?.data;

              // Create a Blob with the HTML content
              const blob = new Blob([htmlContent], { type: "text/html" });
              const url = URL.createObjectURL(blob);

              // Open the HTML content in a new tab
              window.open(url, "_blank");
              // const htmlContent = res?.data?.data;

              // // Open a popup window
              // const popupWindow = window.open('', '_blank', 'width=800,height=600,resizable=yes,scrollbars=yes');
  
              // // Write the HTML content to the popup
              // if (popupWindow) {
              //   popupWindow.document.write(htmlContent);
              //   popupWindow.document.close(); // Important to finish writing the document
              // }
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
    }else{
      toast.error("Fill the Required Fields to preview")
    }
  };
  const handleFormSubmit = (values) => {
    const {
      toEmails,
      ccEmails,
      templateId,
      toMobileNumbers,
      sendToRoleId,
      ...filteredValues
    } = values;

    sendNotificationMutate(
      {
        templateId: templateId?.id,
        caseDetailId: Details?.caseDetailId,
        activityId: activityId,
        inputFieldDetails: {
          ...filteredValues,
          ...(filteredValues.actual_eta && {
            actual_eta: moment(filteredValues.actual_eta).format("HH:mm"),
          }),
        },
        ...(selectedmessageOptions?.[0] == 900 && {
          toMobileNumbers: [toMobileNumbers],
        }),
        ...(selectedmessageOptions?.[0] == 901 && {
          toEmails: values?.toEmails,
          ccEmails: values?.ccEmails,
        }),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.data);
            setVisible(false);
            aspRefetch[activeServiceIndex]?.refetch();
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

  //select Options
  let types = data?.data?.data?.types?.map((item) => ({
    id: item.id,
    label: item.name,
  }));
  let roleOptions = data?.data?.data?.sendToRoles?.map((item) => ({
    label: item.name,
    id: item.id,
  }));

  return (
    <>
      <Sidebar
        visible={visible}
        position="right"
        closeIcon={<DialogCloseIcon />}
        onHide={() => setVisible(false)}
        pt={{
          root: { className: "w-600 custom-sidebar" },
          header: { className: "brdr-bottom" },
        }}
        icons={
          <>
            <img src={NotificationSidebarIcon} />
            <div className="sidebar-title">Send Notification</div>
          </>
        }
      >
        <div className="sidebar-content-wrap">
          <div className="sidebar-content-body">
            <div className="details-container">
              {info?.map((data, i) => (
                <InfoComponent key={i} title={data?.title} info={data?.info} />
              ))}
            </div>
            <form
              className="send-notification-form"
              id="hook-form"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <div className="row row-gap-3_4">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">
                      Send Message Through
                    </label>
                    <div className="message-way-container">
                      <SelectableButtons
                        multiple={false}
                        items={types}
                        onSelect={handleMessageOptionSelect}
                        //defaultItems={selectedmessageOptions}
                      />
                    </div>
                  </div>
                </div>
                {selectedmessageOptions?.[0] == 900 && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        Sent to Role
                      </label>
                      <Controller
                        name="sendToRoleId"
                        control={control}
                        rules={{ required: "Role is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              value={field.value}
                              placeholder="Select"
                              options={roleOptions}
                              optionLabel="label"
                              optionValue="id"
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
                )}
                {/* <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">SMS To</label>
                  <Controller
                    name=""
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        options={[
                          { label: "Center 1", value: "center1" },
                          { label: "Center 2", value: "center2" },
                        ]}
                        optionLabel="label"
                        onChange={(e) => field.onChange(e.value)}
                      />
                    )}
                  />
                </div>
              </div> */}

                {selectedmessageOptions?.length > 0 && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        Select Template
                      </label>
                      <Controller
                        name="templateId"
                        control={control}
                        rules={{ required: "Template is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              value={field.value}
                              placeholder="Select"
                              options={templateData?.data?.data}
                              optionLabel="name"
                              // optionValue="id"
                              // onChange={(e) => field.onChange(e.value)}
                              onChange={(e) => {
                                field.onChange(e.value);
                                resetField("toEmails");
                                resetField("ccEmails");
                                
                                // handleTemplateChange();
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
                )}

                {selectedmessageOptions[0] == 900 &&
                  sendToRoleId &&
                  templateId && (
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label required">Sent to</label>
                        <Controller
                          name="toMobileNumbers"
                          control={control}
                          rules={{ required: "Sent to is required." }}
                          render={({ field, fieldState }) => (
                            <>
                              <Dropdown
                                value={field.value}
                                placeholder="Select"
                                options={sentData?.data?.data}
                                optionLabel="name"
                                optionValue="data"
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
                  )}
                {selectedmessageOptions[0] == 901 && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">To Users</label>
                      <Controller
                        name={`toEmails`}
                        control={control}
                        rules={{ required: "Sub Services is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <MultiSelect
                              value={field.value}
                              onChange={(e) => field.onChange(e.value)}
                              options={sentData?.data?.data?.toUsers}
                              // optionLabel="name"
                              optionLabel={(option) => `${option.name} - ${option.roleName}`}
                              optionValue="data"
                              // display="chip"
                              placeholder="Select Services"
                              maxSelectedLabels={3}
                              className="form-control-select"
                              removeIcon={(options) => (
                                <img src={CloseIcon} {...options.iconProps} />
                              )}
                              panelClassName="custom-dropdown-panel"
                            />
                            <div className="p-error">
                              {errors && errors[field.name]?.message}
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>
                )}
                {selectedmessageOptions[0] == 901 && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">CC Users</label>
                      <Controller
                        name={`ccEmails`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <>
                            <MultiSelect
                              value={field.value || []}
                              onChange={(e) => field.onChange(e.value)}
                              options={ sentData?.data?.data?.ccUsers }
                              optionLabel={(option) => `${option.name} - ${option.roleName}`}
                              optionValue="data"
                              // display="chip"
                              placeholder="Select Services"
                              maxSelectedLabels={3}
                              className="form-control-select"
                              removeIcon={(options) => (
                                <img src={CloseIcon} {...options.iconProps} />
                              )}
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>
                )}

                {templateDetailData?.data?.data?.inputFields.length > 0 && (
                  <DynamicFieldRenderer
                    inputFields={templateDetailData?.data?.data?.inputFields}
                    control={control}
                    errors={errors}
                    templateDetails={templateId}
                  />
                )}
                {selectedmessageOptions?.[0] == 900 && (
                  <>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-label">Subject</label>
                        <Controller
                          name="subject"
                          control={control}
                          render={({ field, fieldState }) => (
                            <InputText
                              value={field.value}
                              type="text"
                              placeholder={templateDetailData?.data?.data?.name}
                              readOnly // Make field non-editable
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  templateDetailData?.data?.data?.name
                                )
                              }
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-label">SMS Subject</label>
                        <Controller
                          name="sms_subject"
                          control={control}
                          render={({ field, fieldState }) => (
                            <InputTextarea
                              type="text"
                              value={field.value}
                              placeholder={
                                templateDetailData?.data?.data?.description
                              }
                              readOnly // Make field non-editable
                              {...field}
                              rows={4}
                              cols={30}
                              onChange={(e) => {
                                field.onChange(
                                  templateDetailData?.data?.data?.description
                                );
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

                
              </div>
            </form>
          </div>
          <div className="sidebar-content-footer d-flex align-items-center justify-content-between">
          {selectedmessageOptions?.[0] == 901 && (
                  <div className="justify-content-start">
                    <button
                      className="btn-link btn-text activity-btn"
                      onClick={(e) => handlePreview(e)}
                    >
                      Preview
                    </button>
                  </div>
                )}
            <div className="justify-content-end">
              <Button
                className="btn save-btn"
                type="submit"
                form="hook-form"
                loading={isLoading}
                disabled={selectedmessageOptions?.length > 0 ? false : true}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default SendNotificationSidebarCrm;
