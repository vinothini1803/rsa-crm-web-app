export const getBaseTime = (activity) => {
  // console.log("get base time ***", activity);
  //OLD LOGIC
  // if (activity.isInitiallyCreated && !activity.isImmediateService) {
  //   return activity.serviceInitiatingAtInMilliSeconds;
  // } else if (!activity.isInitiallyCreated) {
  //   return activity.activityCreatedAtInMilliSeconds;
  // } else {
  //   return activity.caseDetail.createdAtInMilliSeconds;
  // }
  //NEW LOGIC
  //WHEN SERVICE IS INITIALLY CREATED AND NOT IMMEDIATE SERVICE, THEN USE SERVICE INITIATING AT ELSE USE CASE CREATED AT FOR BASE DATE
  if (activity.isInitiallyCreated && !activity.isImmediateService) {
    return activity.serviceInitiatingAtInMilliSeconds;
  } else {
    return activity.caseDetail.createdAtInMilliSeconds;
  }
};

export const checkSla = (activity, slaSettings, typeId, locationTypeId) => {
  let baseTime = getBaseTime(activity);
  // console.log("base time ", baseTime, slaSettings);
  let slaSettingTime = slaSettings.find(
    (sla) => sla.typeId == typeId && sla.locationTypeId == locationTypeId
  );
  // console.log("sla setting time", slaSettingTime);
  let slaTime = baseTime + slaSettingTime?.timeInMilliSeconds;
  const currentTime = Date.now();
  // console.log("sla time", slaTime, currentTime);
  if (currentTime <= slaTime) {
    return "achieved";
  } else if (currentTime > slaTime) {
    return "violated";
  }
};

import React, { useRef, useState } from "react";
import { Button } from "primereact/button";

import TimerChip from "./TimerChip";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

import { DialogCloseSmallIcon } from "../../utills/imgConstants";

import { slaViolateReasons } from "../../../services/masterServices";
import { CurrentUser } from "../../../store/slices/userSlice";

const SlaReasonDialog = ({
  title,
  updatePickTime,
  setSlaReasonVisible,
  slaReasonVisible,
  loading,
}) => {
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({});

  const { data: reasons = [] } = useQuery(
    ["reasonList", role.id],
    () => slaViolateReasons({ apiType: "dropdown", roleId: role.id }),
    {}
  );

  return (
    <>
      <Dialog
        header={
          <>
            <div className="dialog-header">
              <div className="dialog-header-title">{title}</div>
            </div>
            <TimerChip label="SLA Violated" type="red" />
          </>
        }
        className="w-372"
        position={"bottom"}
        onHide={() => setSlaReasonVisible(false)}
        draggable={false}
        resizable={false}
        visible={slaReasonVisible}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleSubmit(updatePickTime)} id="reject-reason-form">
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
            loading={loading}
          >
            Update
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default SlaReasonDialog;
