import React from "react";
import { useQuery, useMutation } from "react-query";
import ServiceDetailCard from "../home/ServiceDetailCard";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import Note from "../../components/common/Note";
import { Calendar } from "primereact/calendar";
import { CalenderIcon } from "../../utills/imgConstants";
import { getCaseVehicleModel } from "../../../services/caseService";
import {
  vehiclePatternValidation,
  vehicleNumberValidation,
} from "../../utills/patternValidation";
import { Button } from "primereact/button";
import moment from "moment";
import { getVIN } from "../../../services/masterServices";
import { toast } from "react-toastify";

const BasicInfo = ({
  formOptions,
  formErrors,
  entitlementData,
  client,
  setFullEntitlementVisible,
  existCustomer,
  methods,
  vehicleRegistrationNumber,
  vin,
  updateIsVinOrVehicleManuallyEntered,
}) => {
  const { control } = useFormContext();

  const selectedPolicyNumber = useWatch({ name: "policyNumber" });
  const selectedPolicyStart = useWatch({ name: "policyStartDate" });
  const selectedPolicyEnd = useWatch({ name: "policyEndDate" });
  const selectedPolicyType = useWatch({ name: "policyType" });
  const selectedCaseSubService = useWatch({ name: "subService" });
  const vehicleNumber = useWatch({ name: "vehicleNumber" });
  const basicVinNumber = useWatch({ name: "basicVinNumber" });

  // console.log('Basic Info Form Options => ', formOptions);
  // console.log('Vehicle Model Options => ', caseVehicleManufacturerData);
  // console.log('Entitlement Data => ', entitlementData);
  // console.log("basicVinNumber", vehicleNumber == "");
  const validatePositiveNumber = (value) => {
    // if (value > 0) {
    //   return true;
    // }
    const pattern = /^\d+(\.\d{1,2})?$/; // Regular expression to match positive numbers with up to two decimal places
    if (!pattern.test(value) || parseFloat(value) <= 0) {
      return "Please enter a positive number with up to two decimal places."; // Return error message if the value is not valid
    }
    return true; // Return true if the value is valid
    // return "Please enter a KM greater than 0";
  };

  const {
    data: vinData,
    mutate: vinMutate,
    isLoading: vinLoading,
  } = useMutation(getVIN);
  const handleVIN = () => {
    vinMutate(
      {
        vehicleRegistrationNumber: vehicleNumber,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            methods.setValue(
              "basicVinNumber",
              res?.data?.vehicleDetails?.viNumber
            );
            let FuelValue =
              res?.data?.fuelTypes?.find(
                (item) =>
                  item?.name?.toLowerCase() ===
                  res?.data?.vehicleDetails?.fuelType?.toLowerCase()
              )?.id || null;
            methods.setValue("fuelType", FuelValue);
          } else {
            toast.error(res?.data?.error);
          }
        },
      }
    );
  };
  // console.log("existCustomer", existCustomer);
  return (
    <div className="row row-gap-3_4">
      <div className="col-md-6">
        <div className="row row-gap-3_4">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Vehicle Number</label>
              <div className="p-inputgroup">
                <Controller
                  name="vehicleNumber"
                  control={control}
                  rules={{
                    required: "Vehicle No is required.",
                    // validate: {
                    //   matchPattern: (v) =>{
                    //     if(v.length > 0) {
                    //       return vehiclePatternValidation(v) || "Please enter a valid Vehicle Number";
                    //     } else {
                    //       return Promise.resolve();
                    //     }
                    //   }
                    // },

                    validate: {
                      matchPattern: (v) => {
                        if (v.length > 0) {
                          if (!vehicleNumberValidation(v)) {
                            return "Vehicle Number must be a valid number";
                          } else {
                            return true;
                          }
                        }
                      },
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                        placeholder="Enter a Vehicle Number"
                        keyfilter={/[^ ]$/}
                        // disabled={existCustomer}
                        disabled={vehicleRegistrationNumber ? true : false}
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                          updateIsVinOrVehicleManuallyEntered();
                          // if(!existCustomer){
                          // methods.resetField("basicVinNumber")
                          // }
                        }}
                      />
                    </>
                  )}
                />
                {/* {!vin &&<Button 
                    type="button" 
                    className="btn-default"
                    onClick={handleVIN} 
                    label="Fetch VIN" 
                    loading={vinLoading}
                  disabled={vin?true:false}
                  />
                  } */}
              </div>
              <div className="p-error">
                {/* {errors[field.name]?.message} */}
                {formErrors && formErrors["vehicleNumber"]?.message}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">VIN Number</label>
              <Controller
                name="basicVinNumber"
                control={control}
                rules={{
                  required: "VIN Number is required.",
                  // validate: {
                  //   matchPattern: (v) =>
                  //     /^[A-HJ-NPR-Z0-9]{17}$/.test(
                  //       v
                  //     ) || "Please enter a valid VIN Number",
                  // },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      maxLength={17}
                      placeholder="Enter a VIN Number"
                      keyfilter={/[^ ]$/}
                      disabled={vin ? true : false}
                      onChange={(e) => {
                        field.onChange(e.target.value.toUpperCase());
                        updateIsVinOrVehicleManuallyEntered();
                      }}
                    />
                    <div className="p-error">
                      {/* {errors[field.name]?.message} */}
                      {formErrors && formErrors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Vehicle Type</label>
              <Controller
                name="vehicleType"
                control={control}
                rules={{ required: "Vehicle Type is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      filter
                      resetFilterOnHide={true}
                      className="form-control-select"
                      placeholder="Select Vehicle Type"
                      options={formOptions?.vehicleTypes}
                      optionLabel="name"
                      onChange={(e) => field.onChange(e.value)}
                    />
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
                        {/*  {errors[field.name]?.message}*/}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">
                Vehicle Manufacturer
              </label>
              <Controller
                name="vehicleManufacturer"
                control={control}
                rules={{ required: "Vehicle Manufacturer is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      placeholder="Select Manufacturer "
                      filter
                      resetFilterOnHide={true}
                      className="form-control-select"
                      options={formOptions?.vehicleManufacturers}
                      optionLabel="name"
                      onChange={(e) => field.onChange(e.value)}
                    />
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
                        {/*  {errors[field.name]?.message}*/}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Model</label>
              <Controller
                name="vehicleModel"
                control={control}
                rules={{ required: "Model is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      placeholder="Select Model"
                      filter
                      resetFilterOnHide={true}
                      className="form-control-select"
                      options={formOptions?.vehicleModels}
                      optionLabel="name"
                      onChange={(e) => field.onChange(e.value)}
                    />
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
                        {/*  {errors[field.name]?.message}*/}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Fuel Type</label>
              <Controller
                name="fuelType"
                control={control}
                rules={{ required: "Fuel Type is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      placeholder="Select Fuel Type"
                      filter
                      resetFilterOnHide={true}
                      className="form-control-select"
                      options={formOptions?.fuelTypes}
                      optionLabel="name"
                      optionValue="id"
                      onChange={(e) => field.onChange(e.value)}
                    />
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
                        {/*  {errors[field.name]?.message}*/}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Sale Date</label>
              <Controller
                name="saleDate"
                control={control}
                rules={{ required: "Sale Date is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      {...field}
                      dateFormat="dd-mm-yy"
                      icon={<img src={CalenderIcon} />}
                      pt={{
                        input: {
                          className: "border-right-hidden",
                        },
                      }}
                      showIcon
                      iconPos={"left"}
                      placeholder="Select"
                      readOnlyInput
                      maxDate={new Date()}
                      //autoFocus={true}
                    />
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
                        {/*  {errors[field.name]?.message}*/}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Running KM</label>
              <Controller
                name="runningKm"
                control={control}
                rules={{
                  // required: "Running KM is required." ,
                  validate: {
                    matchPattern: (v) => {
                      if (v?.length > 0) {
                        return (
                          /^\d+(\.\d{1,2})?$/.test(v) ||
                          "KM must be positive number with up to two decimal places"
                        );
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      placeholder="Enter Running KM"
                      keyfilter={"pnum"}
                    />
                    <div className="p-error">
                      {/* {errors[field.name]?.message} */}
                      {formErrors && formErrors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Policy Type</label>
              <Controller
                name="policyType"
                control={control}
                rules={{ required: "Policy Type is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      placeholder="Select Policy Type"
                      filter
                      resetFilterOnHide={true}
                      className="form-control-select"
                      options={formOptions?.policyTypes}
                      optionLabel="name"
                      onChange={(e) => field.onChange(e.value)}
                      disabled
                    />
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
                        {/*  {errors[field.name]?.message}*/}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          {selectedPolicyType?.id !== 434 && (
            <>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Policy Number</label>
                  <Controller
                    name="policyNumber"
                    control={control}
                    // rules={{ required: "Policy Number is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          placeholder="Enter Policy Number"
                          disabled
                        />
                        <div className="p-error">
                          {/* {errors[field.name]?.message} */}
                          {formErrors && formErrors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">
                    W/EW/RSA Pol Start Date
                  </label>
                  <Controller
                    name="policyStartDate"
                    control={control}
                    rules={{ required: "W/EW/RSA Pol Start Date is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Calendar
                          {...field}
                          dateFormat="dd-mm-yy"
                          icon={<img src={CalenderIcon} />}
                          pt={{
                            input: {
                              className: "border-right-hidden",
                            },
                          }}
                          showIcon
                          iconPos={"left"}
                          placeholder="Select"
                          readOnlyInput
                          disabled
                          //autoFocus={true}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">
                    W/EW/RSA Pol End Date
                  </label>
                  <Controller
                    name="policyEndDate"
                    control={control}
                    rules={{ required: "W/EW/RSA Pol End Date is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Calendar
                          {...field}
                          dateFormat="dd-mm-yy"
                          icon={<img src={CalenderIcon} />}
                          pt={{
                            input: {
                              className: "border-right-hidden",
                            },
                          }}
                          showIcon
                          iconPos={"left"}
                          placeholder="Select"
                          readOnlyInput
                          disabled
                          //autoFocus={true}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
              {selectedPolicyType?.id == 433 && (
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Service Eligibility</label>
                    <Controller
                      name="serviceEligibility"
                      control={control}
                      // rules={{ required: "Service Eligibility is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Service Eligibility"
                            filter
                            resetFilterOnHide={true}
                            className="form-control-select"
                            options={formOptions?.eligbilityServices}
                            optionLabel="name"
                            onChange={(e) => field.onChange(e.value)}
                            disabled
                          />
                          {formErrors && (
                            <div className="p-error">
                              {formErrors[field.name]?.message}
                              {/*  {errors[field.name]?.message}*/}
                            </div>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">Policy Premium</label>
                  <Controller
                    name="policyPremium"
                    control={control}
                    rules={{ required: "Policy Premium is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Policy Premium"
                          filter
                          resetFilterOnHide={true}
                          className="form-control-select"
                          options={formOptions?.policyPremiums}
                          optionLabel="name"
                          onChange={(e) => field.onChange(e.value)}
                        />
                        {formErrors && (
                          <div className="p-error">
                            {formErrors[field.name]?.message}
                            {/*  {errors[field.name]?.message}*/}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </>
          )}
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label required">Voice of Customer</label>
              <Controller
                name="voiceCustomer"
                control={control}
                rules={{ required: "Voice of Customer is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextarea
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      placeholder="Enter Voice of Customer"
                      // disabled
                    />
                    <div className="p-error">
                      {/* {errors[field.name]?.message} */}
                      {formErrors && formErrors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="row row-gap-3_4 case-position-sticky">
          <div className="col-md-12">
            <div className="entilement-title-text">Entitlement Details</div>
            <ServiceDetailCard
              tabMenu={false}
              companyName={true}
              client={client}
              serviceTableScrollHidden={true}
              entitlementData={{
                policyData:
                  selectedPolicyType?.id !== 434
                    ? {
                        policyNumber: selectedPolicyNumber,
                        policyStartDate:
                          moment(selectedPolicyStart).format("DD/MM/YYYY"),
                        policyEndDate:
                          moment(selectedPolicyEnd).format("DD/MM/YYYY"),
                      }
                    : null,
                ...entitlementData?.result,
              }}
              setFullEntitlementVisible={setFullEntitlementVisible}
              selectedCaseSubService={selectedCaseSubService}
            />
          </div>
          {entitlementData?.notes &&
            entitlementData?.notes?.message?.length > 0 && (
              <div className="col-md-12">
                <Note
                  type={entitlementData?.notes?.status ? "success" : "info"}
                  icon={true}
                  purpose={"note"}
                  title={true}
                >
                  <div
                    className={`note-content ${
                      entitlementData?.notes?.status ? "note-content-green" : ""
                    }`}
                  >
                    {entitlementData.notes?.message?.map((note, i) => (
                      <div key={i}>{note}</div>
                    ))}
                    {/* <div>MemberShip</div>
                  <div>RSA Customer.</div>
                  <div>No additional charges will be applied.</div> */}
                  </div>
                </Note>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
