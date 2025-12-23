import React, { useState, useEffect } from "react";
import {
  DialogCloseIcon,
  ReminderSidebarIcon,
} from "../../utills/imgConstants";
import { Sidebar } from "primereact/sidebar";
import { Controller, useForm, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import SelectableButtons from "../../pages/case/serviceTab/SelectableButtons";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

import { slaViolateReasons } from "../../../services/masterServices";
import { CurrentUser } from "../../../store/slices/userSlice";
import TimerChip from "./TimerChip";
import { checkSla } from "./Sla";

const ReminderSidebar = ({
  visible,
  setVisible,
  formData,
  onSave,
  isLoading,
  aspActivityActiveData,
}) => {
  // console.log("aspActivityActiveData", aspActivityActiveData);
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);

  const { data: reasons = [] } = useQuery(
    ["reasonList", role.id],
    () => slaViolateReasons({ apiType: "dropdown", roleId: role.id }),
    {}
  );

  const defaultValues = {
    subject: "",
    description: "",
    reminder: [],
    priority: [],
    status: [],
    scheduleTime: "",
  };

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
    resetField,
  } = useForm({ defaultValues });
  const [selectedReminder, setSelectedReminder] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedRelated, setSelectedRelated] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [reminderSlaReasonVisible, setReminderSlaReasonVisible] =
    useState(false);

  let minDate = new Date();

  const selectedReminders = useWatch({ name: "reminder", control });

  // console.log("selectedReminders", selectedReminders);

  const handleSelect = (items, category) => {
    if (category == "reminder") {
      setSelectedReminder(items);
    }
    if (category == "priority") {
      setSelectedPriority(items);
    }
    if (category == "type") {
      setSelectedType(items);
    }
    if (category == "related") {
      setSelectedRelated(items);
    }
    if (category == "status") {
      setSelectedStatus(items);
    }
  };
  // console.log(
  //   "reminder selected items",
  //   selectedReminder,
  //   selectedPriority,
  //   selectedType,
  //   selectedRelated,
  //   selectedStatus
  // );
  const Reminder = [
    { id: 1, label: "10 min" },
    { id: 2, label: "15 min" },
    { id: 3, label: "30 min" },
    { id: 4, label: "45 min" },
    { id: 5, label: "1 Hour" },
    { id: 6, label: "2 Hours" },
    { id: 7, label: "4 Hours" },
    { id: 8, label: "Others" },
  ];

  const Priority = [
    { id: 1, label: "Normal" },
    { id: 2, label: "High" },
  ];
  const Types = [
    { id: 1, label: "Call" },
    { id: 2, label: "Meeting" },
    { id: 3, label: "Others" },
  ];
  const Status = [
    { id: 1, label: "Open" },
    { id: 2, label: "Completed" },
  ];
  const RelatedData = [
    { id: 1, label: "Accounts" },
    { id: 2, label: "Contacts" },
    { id: 3, label: "Cases" },
  ];

  // console.log("Reminder Get Form Data => ", formData);

  const reminderSlaCheck = () => {
    if (aspActivityActiveData?.aspServiceAcceptedAtInMilliSeconds) {
      let logs = aspActivityActiveData?.activityLogs?.filter(
        (log) => log.typeId == 243
      );
      let remindersAfterAspServiceAccepted = logs?.filter(
        (log) =>
          log.createdAtInMilliSeconds >
          aspActivityActiveData?.aspServiceAcceptedAtInMilliSeconds
      );
      if (!logs?.length || !remindersAfterAspServiceAccepted?.length) {
        let reminderSlaStatus = checkSla(
          aspActivityActiveData,
          aspActivityActiveData?.extras?.slaSettings,
          868,
          null
        );
        if (reminderSlaStatus === "violated") {
          setReminderSlaReasonVisible(true);
        }
      }
    }
  };

  useEffect(() => {
    reminderSlaCheck();
  }, []);

  const onFormSubmit = (values) => {
    // console.log("reminder form values", values);
    reminderSlaCheck();
    onSave(values, reset);
  };

  return (
    <Sidebar
      visible={visible}
      position="right"
      closeIcon={<DialogCloseIcon />}
      onHide={() => {
        setVisible(false);
        reset(defaultValues);
      }}
      pt={{
        root: { className: "w-520 custom-sidebar" },
        header: { className: "brdr-bottom" },
      }}
      icons={
        <>
          <img src={ReminderSidebarIcon} />
          <div className="sidebar-title">Add Reminder</div>
          {reminderSlaReasonVisible && (
            <TimerChip label="SLA Violated" type="red" />
          )}
        </>
      }
    >
      <div className="sidebar-content-wrap">
        <div className="sidebar-content-body">
          <form id="reminder-form" onSubmit={handleSubmit(onFormSubmit)}>
            <div className="row row-gap-3_4">
              {reminderSlaReasonVisible && (
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
              )}
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Subject</label>
                  <Controller
                    name="subject"
                    control={control}
                    rules={{ required: "Subject is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          type="text"
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          placeholder="Enter Subject"
                          {...field}
                        />
                        <div className="p-error">
                          {errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Description</label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Description is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextarea
                          rows={5}
                          {...field}
                          className="form-control"
                          placeholder="Enter Description"
                        />
                        <div className="p-error">
                          {errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Reminder</label>
                  <Controller
                    name="reminder"
                    control={control}
                    rules={{ required: "Reminder is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <div className="channels-container">
                          <SelectableButtons
                            multiple={false}
                            items={formData?.reminder?.map((reminder) => {
                              return { ...reminder, label: reminder?.name };
                            })}
                            onSelect={(item) => {
                              field.onChange(item);
                              if (item[0] !== 1) {
                                resetField("scheduleTime");
                              }
                            }}
                            defaultItems={field.value}
                            type="button"
                          />
                        </div>
                        {errors && (
                          <div className="p-error">
                            {errors[field.name]?.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                  {selectedReminders?.length > 0 &&
                    selectedReminders[0] == 1 && (
                      <div className="mt-3">
                        <Controller
                          name="scheduleTime"
                          control={control}
                          rules={{ required: "Reminder Date is required." }}
                          render={({ field, fieldState }) => (
                            <>
                              <Calendar
                                inputId={field.name}
                                value={field.value}
                                dateFormat="dd-mm-yy"
                                className={`${
                                  fieldState.error ? "p-invalid" : ""
                                }`}
                                showIcon
                                iconPos={"left"}
                                showTime
                                hourFormat="12"
                                placeholder="Select Date And Time"
                                minDate={minDate}
                                onChange={(value) => {
                                  field.onChange(value);
                                  // resetField('reachDatetime')
                                }}
                              />
                              <div className="p-error">
                                {errors && errors[field.name]?.message}
                              </div>
                            </>
                          )}
                        />
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Priority</label>
                  <Controller
                    name="priority"
                    control={control}
                    rules={{ required: "Priority is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <div className="channels-container">
                          <SelectableButtons
                            multiple={false}
                            items={formData?.priority?.map((priority) => {
                              return { ...priority, label: priority?.name };
                            })}
                            onSelect={(item) => {
                              field.onChange(item);
                              // handleSelect(item, "priority")
                            }}
                            defaultItems={field.value}
                            type="button"
                          />
                        </div>
                        {errors && (
                          <div className="p-error">
                            {errors[field.name]?.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Type</label>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Type is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <div className="channels-container">
                          <SelectableButtons
                            multiple={false}
                            items={formData?.type?.map((type) => {
                              return { ...type, label: type?.name };
                            })}
                            onSelect={(item) => {
                              field.onChange(item);
                              // handleSelect(item, "type")
                            }}
                            defaultItems={field.value}
                            type="button"
                          />
                        </div>
                        {errors && (
                          <div className="p-error">
                            {errors[field.name]?.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              {/* <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label">Related To (Optional) </label>
                  <Controller
                    name="type"
                    control={control}
                    // rules={{ required: "Type is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <div className="channels-container">
                          <SelectableButtons
                            multiple
                            items={RelatedData}
                            onSelect={(item) => {
                              field.onChange(item);
                              // handleSelect(item, "related")
                            }}
                            defaultItems={field.value}
                            type="button"
                          />
                        </div>
                        {errors && (
                          <div className="p-error">
                            {errors[field.name]?.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div> */}
              {/* <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Status</label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Status is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <div className="channels-container">
                          <SelectableButtons
                            multiple={false}
                            items={formData?.status?.map(status => {return {...status, label: status?.name}})}
                            onSelect={(item) => {
                              field.onChange(item);
                              // handleSelect(item, "status")
                            }}
                            defaultItems={field.value}
                            type="button"
                          />
                        </div>
                        {errors && (
                          <div className="p-error">
                            {errors[field.name]?.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div> */}
            </div>
          </form>
        </div>
        <div className="sidebar-content-footer">
          <div className="d-flex align-items-center justify-content-end">
            <Button
              className="btn save-btn"
              form="reminder-form"
              loading={isLoading}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default ReminderSidebar;
