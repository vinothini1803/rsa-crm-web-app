import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import {
  Controller,
  set,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Dropdown } from "primereact/dropdown";

import {
  slaViolateReasons,
  proposedDelayReasons,
} from "../../../../services/masterServices";
import { CurrentUser } from "../../../../store/slices/userSlice";
import TimerChip from "../../../components/common/TimerChip";

import {
  DialogCloseSmallIcon,
  EndLocation,
  GoogleMapAPIKey,
  InfoDarkIcon,
  StartLocation,
  VehicleLocationBlueMarker,
} from "../../../utills/imgConstants";

const AcceptServiceRequestDialog = ({
  visible,
  setVisible,
  handleFormSubmit,
  submitLoading,
  slaViolated,
  breakdownReachTimeSlaDateTime,
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    resetField,
    setValue,
  } = useForm();
  let minDate = new Date();
  const selectedStartDate = useWatch({ name: "startDatetime", control });
  const endDatetime = useWatch({ name: "endDatetime", control });
  // console.log("selectedStartDate", selectedStartDate);

  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);

  const { data: reasons = [] } = useQuery(
    ["reasonList", role.id],
    () => slaViolateReasons({ apiType: "dropdown", roleId: role.id }),
    {}
  );

  const { data: proposedDelayReasonsData = [] } = useQuery(
    ["proposedDelayReasonList"],
    () => proposedDelayReasons({ apiType: "dropdown" }),
    {}
  );

  // State to track if proposed delay reason dropdown should be shown
  const [showProposedDelayReason, setShowProposedDelayReason] = useState(false);

  const roundUpToNext15 = (date) => {
    const minutes = date.getMinutes();
    const remainder = minutes % 15;

    const roundedDate = new Date(date);

    if (remainder === 0) {
      // Already on a 15-minute mark — just zero out seconds/milliseconds
      roundedDate.setSeconds(0);
      roundedDate.setMilliseconds(0);
    } else {
      // Round up to next 15-minute block
      const minutesToAdd = 15 - remainder;
      roundedDate.setMinutes(minutes + minutesToAdd);
      roundedDate.setSeconds(0);
      roundedDate.setMilliseconds(0);
    }

    return roundedDate;
  };

  // Effect to check if Expected Reach Date exceeds Breakdown Reach Time SLA
  useEffect(() => {
    if (endDatetime && breakdownReachTimeSlaDateTime) {
      const expectedReachDate = new Date(endDatetime);
      const breakdownSlaDate = new Date(breakdownReachTimeSlaDateTime);

      if (expectedReachDate > breakdownSlaDate) {
        setShowProposedDelayReason(true);
      } else {
        setValue("proposedDelayReasonId", null);
        setShowProposedDelayReason(false);
      }
    } else {
      setShowProposedDelayReason(false);
    }
  }, [endDatetime, breakdownReachTimeSlaDateTime, setValue]);

  return (
    <Dialog
      header={
        <>
          <div className="dialog-header">
            <div className="dialog-header-title">ASP Accepted</div>
          </div>
          {slaViolated && <TimerChip label="SLA Violated" type="red" />}
        </>
      }
      pt={{
        root: { className: "w-480" },
      }}
      visible={visible}
      position={"bottom"}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      //closable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="row row-gap-3_4">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">
                Expected Start Date & Time
              </label>
              <Controller
                name="startDatetime"
                control={control}
                rules={{ required: "Start Date is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      inputId={field.name}
                      value={field.value}
                      dateFormat="dd-mm-yy"
                      className={`${fieldState.error ? "p-invalid" : ""}`}
                      showIcon
                      iconPos={"left"}
                      showTime
                      // hourFormat="12"
                      hourFormat="24"
                      placeholder="Select Date"
                      minDate={new Date()}
                      // onChange={(value) => {
                      //   field.onChange(value);
                      //   resetField("endDatetime");
                      // }}

                      onChange={(e) => {
                        const selectedDate = new Date(e.value);
                        const roundedDate = roundUpToNext15(selectedDate);
                        field.onChange(roundedDate);

                        resetField("endDatetime");
                      }}
                      stepMinute={15}
                    />
                    <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">
                Expected Reach Date & Time
              </label>
              <Controller
                name="endDatetime"
                control={control}
                rules={{
                  required: "Reach Date is required.",
                  validate: (value) =>
                    !selectedStartDate || value > selectedStartDate
                      ? true
                      : "Reach Date and Time must be greater than Start Date and Time.",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      inputId={field.name}
                      value={field.value}
                      dateFormat="dd-mm-yy"
                      className={`${fieldState.error ? "p-invalid" : ""}`}
                      onChange={field.onChange}
                      showIcon
                      iconPos={"left"}
                      showTime
                      // hourFormat="12"
                      hourFormat="24"
                      placeholder="Select Date"
                      minDate={selectedStartDate}
                      disabled={selectedStartDate !== undefined ? false : true}
                    />
                    <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label required">Comments</label>
              <Controller
                name="comments"
                control={control}
                rules={{ required: "Comments is required." }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <InputTextarea
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        id={field.name}
                        {...field}
                        rows={4}
                      />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  );
                }}
              />
            </div>
          </div>
          {slaViolated && (
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
          {showProposedDelayReason && (
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">
                  Proposed Delay Reason
                </label>
                <Controller
                  name="proposedDelayReasonId"
                  control={control}
                  rules={{ required: "Proposed delay reason is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        placeholder="Select Proposed Delay Reason"
                        options={proposedDelayReasonsData?.data?.data}
                        optionLabel="name"
                        onChange={(e) => {
                          field.onChange(e.value);
                        }}
                        className={fieldState.error ? "p-invalid" : ""}
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
          <div className="col-md-12 align-content-end">
            <Button
              className="confirm-btn"
              type="submit"
              loading={submitLoading}
            >
              Confirm
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default AcceptServiceRequestDialog;
