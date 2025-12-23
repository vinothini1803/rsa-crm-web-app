import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Controller, useForm } from "react-hook-form";
import { CalendarTimeIcon, CalendarClockIcon } from "../../utills/imgConstants";
import FileChooseUpload from "./FileChooseUpload";
import moment from "moment";

const InventoryForm = ({ caseFullData, onFormSubmit, updateInventory }) => {
  const defaultValues = {
    // datetime: "",
    aspCode: "",
    aspName: "",
    aspStartLocation: "",
    breakdownTicketNo: "",
    breakdownDateTime: "",
    customerName: "",
    vehicleNo: "",
    vehicleMake: "",
    vehicleModel: "",
    odoReading: "",
    breakdownLocation: "",
    aspReachedToBreakdownAt: "",
    customerComplaint: "",
    aspObservation: "",
    failedPartName: "",
    repairStatus: undefined,
    repairWork: "",
    repairTime: "",
    termsAndConditions: undefined,
    photoOfFailedParts: [],
    photoOfVehicles: [],
    signatureOfAsp: [],
    signatureOfCustomer: [],
    requestDealershipSignature: undefined,
  };
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
  });
  const [initalFlag, setInitalFlag] = useState(true);
  let reachedMinDate = new Date();

  // Handle Remove Attached files
  const handleRemoveFile = (field, files) => {
    // console.log("setFiles", files);
    setValue(field, files);
  };

  useEffect(() => {
    if (caseFullData) {
      // if(caseFullData?.rsaActivityInventory?.createdAt) {
      //   setValue("datetime", moment(caseFullData?.rsaActivityInventory?.createdAt).toDate());
      // }

      setValue("aspCode", caseFullData?.asp?.code);
      setValue("aspName", caseFullData?.asp?.name);
      setValue("aspStartLocation", caseFullData?.asp?.location);
      setValue("breakdownTicketNo", caseFullData?.caseDetail?.caseNumber);
      if (caseFullData?.caseDetail?.caseCreatedDateTime) {
        setValue(
          "breakdownDateTime",
          moment(
            caseFullData?.caseDetail?.caseCreatedDateTime,
            "DD/MM/YYYY hh:mm A"
          ).toDate()
        );
        reachedMinDate = moment(
          caseFullData?.caseDetail?.caseCreatedDateTime,
          "DD/MM/YYYY hh:mm A"
        ).toDate();
      }
      setValue(
        "customerName",
        caseFullData?.caseDetail?.caseInformation?.customerContactName
      );
      setValue("vehicleNo", caseFullData?.caseDetail?.registrationNumber);
      setValue("vehicleMake", caseFullData?.caseDetail?.vehicleMake);
      setValue("vehicleModel", caseFullData?.caseDetail?.vehicleModel);
      setValue(
        "odoReading",
        caseFullData?.caseDetail?.caseInformation?.runningKm || undefined
      );
      setValue(
        "breakdownLocation",
        caseFullData?.caseDetail?.caseInformation?.breakdownLocation
      );
      if (caseFullData?.caseDetail?.caseInformation?.reachTime) {
        setValue(
          "reachTime",
          moment(caseFullData?.caseDetail?.caseInformation?.reachTime)
        );
      }
      setValue(
        "customerComplaint",
        caseFullData?.caseDetail?.caseInformation?.voiceOfCustomer || undefined
      );
      setValue("aspObservation", caseFullData?.issueComments || undefined);
      // setValue("failedParts", caseFullData.failedParts);
    }
    if (updateInventory && caseFullData) {
      setValue(
        "aspReachedToBreakdownAt",
        moment(
          caseFullData?.aspReachedToBreakdownAt,
          "DD/MM/YYYY hh:mm A"
        ).toDate()
      );
      setValue(
        "failedPartName",
        caseFullData?.rsaActivityInventory[0]?.failedPartName
      );
      setValue(
        "repairStatus",
        caseFullData?.serviceStatus == true ? "true" : "false"
      );
      setValue("repairWork", caseFullData?.rsaActivityInventory[0]?.repairWork);
      if (caseFullData?.serviceDurationInSeconds) {
        const inputMoment = moment();
        const startOfDayMoment = inputMoment.startOf("day");
        const newTimeMoment = startOfDayMoment
          .clone()
          .add(Number(caseFullData?.serviceDurationInSeconds), "seconds");
        // console.log("newTimeMoment", newTimeMoment?._d, caseFullData);
        setValue("repairTime", newTimeMoment?._d);
      }
      setValue(
        "termsAndConditions",
        caseFullData?.rsaActivityInventory[0]?.termsAndConditions == true
          ? "true"
          : "false"
      );
      // setValue("requestDealershipSignature", caseFullData?.rsaActivityInventory[0]?.requestDealershipSignature == true ? 'true' : 'false');
    }
  }, [caseFullData, updateInventory]);

  return (
    <form
      id="inventoryForm"
      onSubmit={handleSubmit((values) => onFormSubmit(values, reset))}
    >
      <div className="row row-gap-3_4">
        {/* <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Date and Time</label>
            <Controller
              name="datetime"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Calendar
                    inputId={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    showTime
                    hourFormat="12"
                    showIcon
                    iconPos={"left"}
                    dateFormat="dd-mm-yy"
                    placeholder="Select Date & Time"
                    icon={<img src={CalendarTimeIcon} />}
                    pt={{
                      input: {
                        className: "border-right-hidden",
                      },
                    }}
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div> */}
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">ASP Code</label>
            <Controller
              name="aspCode"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">ASP Name</label>
            <Controller
              name="aspName"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">ASP Start Location</label>
            <Controller
              name="aspStartLocation"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Breakdown Ticket No</label>
            <Controller
              name="breakdownTicketNo"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Breakdown Ticket Date & Time</label>
            <Controller
              name="breakdownDateTime"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Calendar
                    inputId={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    showTime
                    hourFormat="12"
                    showIcon
                    iconPos={"left"}
                    dateFormat="dd-mm-yy"
                    placeholder="Select BD Ticket Date & Time"
                    icon={<img src={CalendarTimeIcon} />}
                    pt={{
                      input: {
                        className: "border-right-hidden",
                      },
                    }}
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Customer Name</label>
            <Controller
              name="customerName"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Vehicle No</label>
            <Controller
              name="vehicleNo"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Vehicle Make</label>
            <Controller
              name="vehicleMake"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Vehicle Model</label>
            <Controller
              name="vehicleModel"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Customer Vehicle ODO Reading</label>
            <Controller
              name="odoReading"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  {" "}
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Breakdown Location</label>
            <Controller
              name="breakdownLocation"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  {" "}
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Customer Complaint</label>
            <Controller
              name="customerComplaint"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">ASP Observation</label>
            <Controller
              name="aspObservation"
              control={control}
              // rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  {" "}
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    className="form-control"
                    disabled
                  />
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Reached at Breakdown</label>
            <Controller
              name="aspReachedToBreakdownAt"
              control={control}
              rules={{ required: "Reach Date at Breakdown is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Calendar
                    inputId={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    showTime
                    showIcon
                    hourFormat="12"
                    iconPos={"left"}
                    dateFormat="dd-mm-yy"
                    placeholder="Select Reach Date & Time"
                    icon={<img src={CalendarTimeIcon} />}
                    minDate={reachedMinDate}
                    pt={{
                      input: {
                        className: "border-right-hidden",
                      },
                    }}
                  />
                  {errors && (
                    <div className="p-error">{errors[field.name]?.message}</div>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Failed Part Name</label>
            <Controller
              name="failedPartName"
              control={control}
              rules={{ required: "Failed Part Name is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field.value}
                    placeholder="Enter Failed Part Name"
                  />
                  <div className="p-error">
                    {errors && errors[field.name]?.message}
                  </div>
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group radio-form-group">
            <label className="form-label required">Repair Status</label>
            <Controller
              name="repairStatus"
              control={control}
              rules={{ required: "Repair Status is required." }}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="repairStatusCompleted"
                          {...field}
                          value={"true"}
                          checked={field?.value == "true"}
                          disabled
                        />
                        <label
                          htmlFor="repairStatusCompleted"
                          className="common-radio-label"
                        >
                          Completed
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="repairStatusNotCompleted"
                          {...field}
                          value={"false"}
                          checked={field?.value === "false"}
                          disabled
                        />
                        <label
                          htmlFor="repairStatusNotCompleted"
                          className="common-radio-label"
                        >
                          Not Completed
                        </label>
                      </div>
                    </div>
                    <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                );
              }}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Repair Work</label>
            <Controller
              name="repairWork"
              control={control}
              rules={{ required: "Repair Work is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    onChange={(e) => field.onChange(e.target.value)}
                    id={field.name}
                    value={field?.value}
                    placeholder="Enter Repair Work"
                  />
                  <div className="p-error">
                    {errors && errors[field.name]?.message}
                  </div>
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Repair Time</label>
            <Controller
              name="repairTime"
              control={control}
              rules={{ required: "Repair Time is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Calendar
                    inputId={field.name}
                    value={field.value}
                    onChange={(e) => {
                      // console.log("Time Field", e);
                      field.onChange(e);
                    }}
                    timeOnly
                    showIcon
                    showSeconds={true}
                    iconPos={"left"}
                    placeholder="Select Repair Time"
                    icon={<img src={CalendarClockIcon} />}
                    pt={{
                      input: {
                        className: "border-right-hidden",
                      },
                    }}
                  />
                  <div className="p-error">
                    {errors && errors[field.name]?.message}
                  </div>
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">
              Photos of Failed Parts
            </label>
            <Controller
              name="photoOfFailedParts"
              control={control}
              rules={{ required: "Failed Parts is required." }}
              render={({ field, fieldState }) => {
                // console.log("file upload field", field);
                return (
                  <>
                    <FileChooseUpload
                      multiple={true}
                      field={field}
                      setField={(files) => handleRemoveFile(field?.name, files)}
                      defaultValues={caseFullData?.rsaActivityInventoryAttachments?.filter(
                        (data) => data?.attachmentTypeId == 85
                      )}
                      initalFlag={initalFlag}
                      setInitalFlag={setInitalFlag}
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
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Photo of Vehicles</label>
            <Controller
              name="photoOfVehicles"
              control={control}
              rules={{ required: "Photo of Vehicles is required." }}
              render={({ field, fieldState }) => {
                // console.log("file upload field", field);
                return (
                  <>
                    <FileChooseUpload
                      multiple={true}
                      field={field}
                      setField={(files) => handleRemoveFile(field?.name, files)}
                      defaultValues={caseFullData?.rsaActivityInventoryAttachments?.filter(
                        (data) => data?.attachmentTypeId == 86
                      )}
                      initalFlag={initalFlag}
                      setInitalFlag={setInitalFlag}
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
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Signature of ASP</label>
            <Controller
              name="signatureOfAsp"
              control={control}
              rules={{ required: "Signature of ASP is required." }}
              render={({ field, fieldState }) => {
                // console.log("file upload field", field);
                return (
                  <>
                    <FileChooseUpload
                      multiple={false}
                      field={field}
                      setField={(files) => handleRemoveFile(field?.name, files)}
                      defaultValues={caseFullData?.rsaActivityInventoryAttachments?.filter(
                        (data) => data?.attachmentTypeId == 87
                      )}
                      initalFlag={initalFlag}
                      setInitalFlag={setInitalFlag}
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
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Signature of Customer</label>
            <Controller
              name="signatureOfCustomer"
              control={control}
              rules={{ required: "Signature of Customer is required." }}
              render={({ field, fieldState }) => {
                // console.log("file upload field", field);
                return (
                  <>
                    <FileChooseUpload
                      multiple={false}
                      field={field}
                      setField={(files) => handleRemoveFile(field?.name, files)}
                      defaultValues={caseFullData?.rsaActivityInventoryAttachments?.filter(
                        (data) => data?.attachmentTypeId == 88
                      )}
                      initalFlag={initalFlag}
                      setInitalFlag={setInitalFlag}
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
        {/* <div className="col-md-3">
          <div className="form-group radio-form-group">
            <label className="form-label required">Request Dealership Signature</label>
            <Controller
              name="requestDealershipSignature"
              control={control}
              rules={{ required: "Request Dealership Signature is required." }}
              render={({ field, fieldState }) => (
                <>
                  <div className="common-radio-group">
                    <div className="common-radio-item">
                      <RadioButton
                        inputId="signatureCompleted"
                        {...field}
                        value='true'
                        checked={field?.value == 'true'}
                      />
                      <label
                        htmlFor="signatureCompleted"
                        className="common-radio-label"
                      >
                        Completed
                      </label>
                    </div>
                    <div className="common-radio-item">
                      <RadioButton
                        inputId="signatureNotCompleted"
                        {...field}
                        value={'false'}
                        checked={field?.value === 'false'}
                      />
                      <label
                        htmlFor="signatureNotCompleted"
                        className="common-radio-label"
                      >
                        Not Completed
                      </label>
                    </div>
                  </div>
                  <div className="p-error">
                    {errors && errors[field.name]?.message}
                  </div>
                </>
              )}
            />
          </div>
        </div> */}
        <div className="col-md-3">
          <div className="form-group radio-form-group">
            <label className="form-label required">Terms and Conditions</label>
            <Controller
              name="termsAndConditions"
              control={control}
              rules={{ required: "Terms and Conditions is required." }}
              render={({ field, fieldState }) => (
                <>
                  <div className="common-radio-group">
                    <div className="common-radio-item">
                      <RadioButton
                        inputId="termsAndConditionsAccepted"
                        {...field}
                        value={"true"}
                        checked={field?.value == "true"}
                      />
                      <label
                        htmlFor="termsAndConditionsAccepted"
                        className="common-radio-label"
                      >
                        Accepted
                      </label>
                    </div>
                    <div className="common-radio-item">
                      <RadioButton
                        inputId="termsAndConditionsNotAccepted"
                        {...field}
                        value={"false"}
                        checked={field?.value === "false"}
                      />
                      <label
                        htmlFor="termsAndConditionsNotAccepted"
                        className="common-radio-label"
                      >
                        Not Accepted
                      </label>
                    </div>
                  </div>
                  <div className="p-error">
                    {errors && errors[field.name]?.message}
                  </div>
                </>
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default InventoryForm;
