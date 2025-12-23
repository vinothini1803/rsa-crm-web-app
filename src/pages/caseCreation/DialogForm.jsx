import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Controller, useWatch } from "react-hook-form";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import SelectableButtons from "../case/serviceTab/SelectableButtons";

export default function DialogForm({
  visible,
  onClose,
  service,
  additionalServiceForm,
  updateServiceConfig,
  index,
}) {
  const watchedValue = useWatch({
    control: additionalServiceForm.control,
    name: `serviceConfig[${index}].additionalServiceIsImmediate`,
  });
  const watchedInitialData = useWatch({
    control: additionalServiceForm.control,
    name: `serviceConfig[${index}].additionalServiceInitiatingAt`,
  });
  const watchedExpectedData = useWatch({
    control: additionalServiceForm.control,
    name: `serviceConfig[${index}].additionalServiceExpectedAt`,
  });

  const handleSave = additionalServiceForm.handleSubmit(
    () => {
      console.log("Form submission successful!");
      onClose();
    },
    (errors) => {
      console.log("alidation Errors:", errors);
    }
  );
  console.log("Immediate Value:", watchedInitialData);
  return (
    <Dialog
      className="w-372"
      key={index}
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">{service?.name}</div>
        </div>
      }
      visible={visible}
      onHide={onClose}
      closable={true}
      draggable={false}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Service Initiation */}
        <label className="form-label required">Service Initiation</label>
        <Controller
          name={`serviceConfig[${index}].additionalServiceIsImmediate`}
          control={additionalServiceForm.control}
          render={({ field, fieldState }) => (
            <>
              <div className="subject-container">
                <SelectableButtons
                  items={[
                    { id: "Immediate", label: "Immediate" },
                    { id: "Later", label: "Later" },
                  ]}
                  onSelect={(ids) => {
                    field.onChange(ids);
                    console.log("ids", ids?.[0]);
                    // If "Later" is selected, reset date fields
                    if (ids?.[0] === "Later") {
                      additionalServiceForm.setValue(
                        `serviceConfig[${index}].additionalServiceExpectedAt`,
                        ""
                      );
                      additionalServiceForm.setValue(
                        `serviceConfig[${index}].additionalServiceInitiatingAt`,
                        ""
                      );
                    }
                  }}
                  multiple={false}
                  defaultItems={field.value}
                  type="button"
                />
              </div>
            </>
          )}
        />

        {/* Expected Date and Time */}
        {watchedValue?.[0] === "Later" && (
          <>
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <label className="form-label required">
                  Expected Date and Time
                </label>
                <Controller
                  name={`serviceConfig[${index}].additionalServiceExpectedAt`}
                  control={additionalServiceForm.control}
                  rules={{
                    required: "Expected Date and Time is required.",
                    validate: (value) => {
                      console.log("Expected Date Value:", value);
                      console.log(
                        "Watched Initiation Date Value:",
                        watchedInitialData
                      );

                      if (!value) {
                        return "Expected Date and Time is required.";
                      }

                      // Check if expected date is greater than initiation date
                      if (watchedInitialData && value <= watchedInitialData) {
                        return "Expected Date and Time must be greater than Initiation Date and Time.";
                      }

                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => {
                    const now = new Date();
                    const maxDate = new Date();
                    maxDate.setHours(maxDate.getHours() + 72);

                    const roundMinutes = (date) => {
                      let minutes = date.getMinutes();
                      let remainder = minutes % 15;
                      if (remainder !== 0) {
                        date.setMinutes(minutes + (15 - remainder), 0, 0);
                      } else {
                        date.setSeconds(0);
                        date.setMilliseconds(0);
                      }
                      return date;
                    };
                    return (
                      <>
                        <Calendar
                          id="dateRange"
                          value={field.value || null}
                          hourFormat="24"
                          dateFormat="dd/mm/yy"
                          {...field}
                          placeholder="Select Date and Time"
                          showIcon
                          showTime
                          // hide
                          iconPos={"left"}
                          minDate={now}
                          maxDate={maxDate}
                          stepMinute={15}
                          touchUI={false}
                          onChange={(e) => {
                            const selectedDate = roundMinutes(
                              new Date(e.value)
                            ); // Round only on selection
                            field.onChange(selectedDate);
                          }}
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
            {/* Initiation Date and Time */}
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <label className="form-label required">
                  Initiation Date and Time
                </label>
                <Controller
                  name={`serviceConfig[${index}].additionalServiceInitiatingAt`}
                  control={additionalServiceForm.control}
                  rules={{ required: "Date and Time is required." }}
                  render={({ field, fieldState }) => {
                    const now = new Date();
                    const maxDate = new Date();
                    maxDate.setHours(maxDate.getHours() + 72);
                    const roundMinutes = (date) => {
                      let minutes = date.getMinutes();
                      let remainder = minutes % 15;
                      if (remainder !== 0) {
                        date.setMinutes(minutes + (15 - remainder), 0, 0);
                      } else {
                        date.setSeconds(0);
                        date.setMilliseconds(0);
                      }
                      return date;
                    };
                    return (
                      <>
                        <Calendar
                          id="dateRange"
                          value={field.value || null}
                          hourFormat="24"
                          dateFormat="dd/mm/yy"
                          {...field}
                          placeholder="Select Date and Time"
                          showIcon
                          showTime
                          // hide
                          iconPos={"left"}
                          minDate={now}
                          maxDate={maxDate}
                          stepMinute={15}
                          touchUI={false}
                          onChange={(e) => {
                            const selectedDate = roundMinutes(
                              new Date(e.value)
                            ); // Round only on selection
                            field.onChange(selectedDate);
                          }}
                          disabled={!watchedExpectedData}
                        />

                        {/* {fieldState.error && (
              <div className="p-error">
                {fieldState.error.message}
              </div>
            )} */}
                      </>
                    );
                  }}
                />
              </div>
            </div>
          </>
        )}
        {/* ASP Auto Allocation */}
        {service?.hasAspAssignment && (
          <>
            <div className="dialog-header-title mt-3">ASP Assignment</div>
            <p style={{ color: "#949494" }} className="mt-2">
              Assign Asp to this case
            </p>
            <Controller
              name={`serviceConfig[${index}].additionalServiceAspAutoAllocation`}
              control={additionalServiceForm.control}
              render={({ field, fieldState }) => (
                <div className="checkbox-item">
                  <Checkbox
                    inputId={field.name}
                    checked={field.value}
                    inputRef={field.ref}
                    onChange={(e) => field.onChange(e.checked)}
                  />
                  <label className="checkbox-label">Auto Assign for ASP</label>
                </div>
              )}
            />
          </>
        )}

        <button
          className="btn form-submit-btn mb-2"
          type="submit"
          onClick={handleSave}
          disabled={watchedValue?.length > 0 ? false : true}
        >
          Save Service
        </button>
      </form>
    </Dialog>
  );
}
