import React, { useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Controller, useFormContext } from "react-hook-form";
import FileChooseUpload from "./FileChooseUpload";
import { CalendarTimeIcon, CalendarClockIcon } from "../../utills/imgConstants";
import moment from "moment";

const TowingInventoryForm = ({ caseFullData, typeOfId }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  // console.log("Towing in inventory Case Data", caseFullData);

  useEffect(() => {
    if (caseFullData) {
      if (caseFullData?.rsaActivityInventory?.createdAt) {
        setValue(
          "datetime",
          moment(caseFullData?.rsaActivityInventory?.createdAt).toDate()
        );
      }

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
      setValue(
        "customerComplaint",
        caseFullData?.caseDetail?.caseInformation?.voiceOfCustomer || undefined
      );
      setValue("aspObservation", caseFullData?.issueComments || undefined);
      // setValue("failedParts", caseFullData.failedParts);
    }
  }, [caseFullData]);

  return (
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
    </div>
  );
};

export default TowingInventoryForm;
