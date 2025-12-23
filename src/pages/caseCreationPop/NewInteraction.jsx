import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import SelectableButtons from "../case/serviceTab/SelectableButtons";
import { Checkbox } from "primereact/checkbox";
import "./style.less";
import Note from "../../components/common/Note";
import { RadioButton } from "primereact/radiobutton";
import ServiceDetailCard from "../home/ServiceDetailCard";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import {
  getCaseSubjectServices,
  getCaseSubjectSubServices,
} from "../../../services/caseService";
import moment from "moment";
import { Children } from "react";
import { Chip } from "primereact/chip";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";

const NewInteraction = ({
  formOptions,
  formErrors,
  entitlementData,
  client,
  setFullEntitlementVisible,
  existCustomer,
  subServiceForm,
  additionalServiceForm,
}) => {
  const { control, resetField, watch } = useFormContext();
  const handleSubjectSelect = (id) => {
    console.log("selcted ids", id);
  };
  const user = useSelector(CurrentUser);
  console.log("user", user);
  const [value, setValue] = useState(true);
  const serviceExpectedAtValue = useWatch({
    name: "serviceExpectedAt",
    control: subServiceForm.control,
  });
  const serviceInitiatingAtValue = useWatch({
    name: "serviceInitiatingAt",
    control: subServiceForm.control,
  });
  const additionalServiceExpectedAtValue = useWatch({
    name: "additionalServiceExpectedAt",
    control: additionalServiceForm.control,
  });
  const additionalServiceInitiatingAtValue = useWatch({
    name: "additionalServiceInitiatingAt",
    control: additionalServiceForm.control,
  });
  console.log("serviceExpectedAtValue", serviceExpectedAtValue);
  const subjectValue = useWatch({ name: "subject" });
  const selectedCaseType = useWatch({ name: "caseType" });
  const selectedCaseSubject = useWatch({ name: "caseSubject" });
  const selectedCaseService = useWatch({ name: "service" });
  const selectedCaseSubService = useWatch({ name: "subService" });
  const selectedConditionOfVehicle = useWatch({ name: "condtionOfVehicle" });
  const selectedPolicyNumber = useWatch({ name: "policyNumber" });
  const selectedPolicyType = useWatch({ name: "policyType" });
  const selectedPolicyStart = useWatch({ name: "policyStartDate" });
  const selectedPolicyEnd = useWatch({ name: "policyEndDate" });
  const selectedAdditionalSubService = useWatch({
    name: "additionalSubServiceId",
  });
  console.log(" selectedPolicyType", selectedPolicyType);
  console.log("selectedAdditionalSubService", selectedAdditionalSubService);
  console.log("policy Date", selectedPolicyStart, selectedPolicyEnd);
  const [primaryVisible, setPrimaryVisible] = useState(false);
  const [secondaryVisible, setSecondaryVisible] = useState(false);
  const serviceIsImmediate = subServiceForm.watch("serviceIsImmediate");
  const additionalServiceIsImmediate = additionalServiceForm.watch(
    "additionalServiceIsImmediate"
  );
  console.log("selectedAdditionalSubService", selectedAdditionalSubService);
  const { data: caseSubjectServicesData } = useQuery(
    ["getCaseSubjectServices", selectedCaseSubject],
    () =>
      getCaseSubjectServices({
        subjectId: selectedCaseSubject?.id,
      }),
    {
      enabled: selectedCaseSubject ? true : false,
    }
  );

  const { data: caseSubjectSubServicesData } = useQuery(
    ["getCaseSubjectSubServices", selectedCaseService],
    () =>
      getCaseSubjectSubServices({
        apiType: "dropdown",
        serviceId: selectedCaseService?.id,
      }),
    {
      enabled: selectedCaseService ? true : false,
    }
  );

  const clearDropLoaction = () => {
    resetField("drop_location_type");
    resetField("customerPreferredLocation");
    resetField("dealers");
    resetField("dealer_location");
    resetField("dealerToBreakdownDistance");
    resetField("dropdownlocation");
    resetField("dropnearest_city");
    resetField("droplatlng");
    resetField("dropToBreakdownDistance");
    resetField("droparea");
  };

  const handleCaseSubject = (e) => {
    resetField("service");
    resetField("subService");
    // console.log("Changes", e);
    clearDropLoaction();
  };

  const handleCaseService = (e) => {
    resetField("subService");
    resetField("additionalSubServiceId");
    resetField("dealers");
    clearDropLoaction();
  };

  //console.log("subjectValue", subjectValue);
  console.log("Form Options => ", formOptions);
  // console.log("selectedCaseSubject => ", selectedCaseSubject);
  //console.log('caseSubjectServicesData => ', caseSubjectSubServicesData);
  //console.log('caseSubjectSubServicesData => ', caseSubjectSubServicesData);
  console.log("Entitlement Data => ", entitlementData);

  const handleValidationSubservice = async (e) => {
    e.preventDefault();
    const result = await subServiceForm.trigger([
      "serviceExpectedAt",
      "serviceInitiatingAt",
    ]);

    if (!result) {
    } else {
      setPrimaryVisible(false);
    }
  };
  const handleValidationAdditionalSub = async (e) => {
    e.preventDefault();
    const result = await additionalServiceForm.trigger([
      "additionalServiceExpectedAt",
      "additionalServiceInitiatingAt",
    ]);

    if (!result) {
    } else {
      setSecondaryVisible(false);
    }
  };

  return (
    <>
      <div className="row row-gap-3_4">
        <div className="col-md-6">
          <div className="row row-gap-3_4">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Contact Name</label>
                <Controller
                  name="contactName"
                  control={control}
                  rules={{
                    required: "Contact Name is required.",
                    validate: {
                      matchPattern: (v) =>
                        /^[a-zA-Z.\s'-]+$/.test(v) ||
                        "Contact Name must be a Alphabets",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                        placeholder="Enter Contact Name"
                        disabled={
                          existCustomer && formOptions?.contactName
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                        }} // Convert input to Upper case on change
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
                <label className="form-label required">Mobile Number</label>
                <Controller
                  name="mobileNumber"
                  rules={{
                    required: "Mobile Number is required.",
                    validate: {
                      matchPattern: (v) =>
                        /^([+]\d{2})?\d{10}$/.test(v) ||
                        "Mobile Number must be a valid number",
                    },
                  }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        keyfilter="int"
                        maxLength={10}
                        className={`form-control ${
                          fieldState.isDirty || fieldState.isTouched
                            ? "p-filled"
                            : ""
                        } ${fieldState.error ? "p-invalid" : ""}`}
                        disabled={
                          existCustomer && formOptions?.mobileNumber
                            ? true
                            : false
                        }
                        placeholder="Enter Mobile Number"
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
                  Current Contact Name
                </label>
                <Controller
                  name="currentContactName"
                  control={control}
                  rules={{
                    required: "Current Contact Name is required.",
                    validate: {
                      matchPattern: (v) =>
                        /^[a-zA-Z.\s'-]+$/.test(v) ||
                        "Current Contact Name must be a Alphabets",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                        placeholder="Enter Current Contact Name"
                        type="text"
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                        }} // Convert input to Upper case on change
                      />
                      {formErrors && (
                        <div className="p-error">
                          {formErrors[field.name]?.message}
                        </div>
                      )}
                    </>
                  )}
                />
                <Controller
                  name="isSameasContact"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="checkbox-item">
                      <Checkbox
                        inputId="issameas_contact"
                        name="issameas_contact"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.checked)}
                      />
                      <label htmlFor="ingredient1" className="checkbox-label">
                        Same as Contact
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">
                  Current Mobile number
                </label>
                <Controller
                  name="currentMobileNumber"
                  rules={{
                    required: "Current Mobile number is required.",
                    validate: {
                      matchPattern: (v) =>
                        /^([+]\d{2})?\d{10}$/.test(v) ||
                        "Current Mobile Number must be a valid number",
                    },
                  }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        keyfilter="pint"
                        maxLength="10"
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                        placeholder="Enter Current Mobile number"
                      />
                      <div className="p-error">
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
                  Alternate Mobile Number
                </label>
                <Controller
                  name="alternateMobileNumber"
                  control={control}
                  rules={{
                    required: "Alternate Mobile Number is required.",
                    validate: {
                      matchPattern: (v) => {
                        if (v.length > 0) {
                          return (
                            /^([+]\d{2})?\d{10}$/.test(v) ||
                            "Alternate Mobile Number must be a valid number"
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
                        keyfilter="pint"
                        maxLength="10"
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                        placeholder="Enter Alternate Mobile number"
                      />
                      <div className="p-error">
                        {formErrors && formErrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            {/* <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <Controller
                name="subject"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="subject-container">
                    <SelectableButtons
                      items={[
                        { id: 1, label: "RSA" },
                        { id: 2, label: "NON-RSA" },
                      ]}
                      onSelect={(ids) => {
                        handleSubjectSelect(ids);
                        field.onChange(ids);
                      }}
                      multiple={false}
                      defaultItems={field.value}
                    />
                  </div>
                )}
              />
            </div>
          </div> */}
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
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Disposition</label>
                <Controller
                  name="disposition"
                  control={control}
                  rules={{ required: "Disposition is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Disposition "
                        filter
                        resetFilterOnHide={true}
                        className={`form-control-select ${
                          fieldState.error ? "p-invalid" : ""
                        }}`}
                        options={formOptions?.dispositions}
                        optionLabel="name"
                        disabled
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
            {/* <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Vehicle Number</label>
              <Controller
                name="vehicleNo"
                control={control}
                rules={{
                  required: "Vehicle Number is required.",
                  validate: {
                    matchPattern: (v) =>
                      /^[A-Z0-9]{2}[A-Z0-9]{0,2}[A-Z0-9]{0,3}[A-Z0-9]{0,4}$/.test(
                        v
                      ) || "Please enter a valid Vehicle Number",
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      value={field.value.toUpperCase()}
                      keyfilter={"alphanum"}
                      maxLength={10}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      placeholder="Enter Vehicle Number"
                      disabled={existCustomer}
                    />
                    <div className="p-error">
                      {formErrors && formErrors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div> */}
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Contact Language</label>
                <Controller
                  name="contactLanguage"
                  control={control}
                  rules={{ required: "Contact Language is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        resetFilterOnHide={true}
                        placeholder="Select Contact Language"
                        className="form-control-select"
                        options={formOptions?.contactLanguages}
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
            {/* <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">
                  Current Contact Language
                </label>
                <Controller
                  name="currentContactLanguage"
                  rules={{
                    required: "Current Contact Language is required.",
                  }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        resetFilterOnHide={true}
                        className="form-control-select"
                        placeholder="Select Current Contact Language "
                        options={formOptions?.currentContactLanguages}
                        optionLabel="name"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      {formErrors && (
                        <div className="p-error">
                          {formErrors[field.name]?.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div> */}
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Channel</label>
                <Controller
                  name="channel"
                  control={control}
                  rules={{ required: "Channel is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        resetFilterOnHide={true}
                        className="form-control-select"
                        placeholder="Select Channel "
                        options={formOptions?.channels}
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
                <label className="form-label required">Case Type</label>
                <Controller
                  name="caseType"
                  rules={{ required: "Case Type is required." }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Case Type "
                        filter
                        resetFilterOnHide={true}
                        className="form-control-select"
                        options={formOptions?.caseTypes}
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

            {selectedCaseType?.id == 413 && (
              <>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">Accident Type</label>
                    <Controller
                      name="accidentType"
                      control={control}
                      rules={{ required: "Accident Type is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Accident Type"
                            filter
                            resetFilterOnHide={true}
                            className="form-control-select"
                            options={formOptions?.accidentTypes}
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
                    <label className="form-label">Special Crane needed</label>
                    <Controller
                      name="specialCrane"
                      control={control}
                      //rules={{ required: "pecial Crane needed is required." }}
                      render={({ field, fieldState }) => {
                        // console.log("Repair Status", field);
                        return (
                          <>
                            <div className="common-radio-group">
                              <div className="common-radio-item">
                                <RadioButton
                                  inputId="radio_yes_specialCrane"
                                  {...field}
                                  value="Yes"
                                  checked={field.value === "Yes"}
                                />
                                <label
                                  htmlFor="radio_yes_specialCrane"
                                  className="common-radio-label"
                                >
                                  Yes
                                </label>
                              </div>
                              <div className="common-radio-item">
                                <RadioButton
                                  inputId="radio_no_specialCrane"
                                  {...field}
                                  value="No"
                                  checked={field.value === "No"}
                                />
                                <label
                                  htmlFor="radio_no_specialCrane"
                                  className="common-radio-label"
                                >
                                  No
                                </label>
                              </div>
                            </div>
                          </>
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Case Subject</label>
                <Controller
                  name="caseSubject"
                  rules={{ required: "Case Subject is required." }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Case Subject"
                        filter
                        resetFilterOnHide={true}
                        className="form-control-select"
                        options={formOptions?.caseSubjects}
                        optionLabel="name"
                        onChange={(e) => {
                          field.onChange(e.value);
                          handleCaseSubject(e);
                        }}
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
                <label className="form-label required">Service</label>
                <Controller
                  name="service"
                  control={control}
                  rules={{ required: "Service is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      {console.log(
                        "Service Dropdown fieldState => ",
                        fieldState,
                        field
                      )}
                      <Dropdown
                        value={field.value}
                        placeholder="Select Service"
                        filter
                        resetFilterOnHide={true}
                        className={`form-control-select `}
                        options={
                          caseSubjectServicesData
                            ? caseSubjectServicesData.data.data.filter(
                                (service) => service?.id !== 3
                              )
                            : []
                        }
                        optionLabel="name"
                        onChange={(e) => {
                          field.onChange(e.value);
                          handleCaseService(e);
                        }}
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
                <label className="form-label required">Sub Service</label>
                <Controller
                  name="subService"
                  control={control}
                  rules={{ required: "Sub Service is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Sub Service"
                        filter
                        resetFilterOnHide={true}
                        className="form-control-select"
                        options={
                          caseSubjectSubServicesData
                            ? caseSubjectSubServicesData?.data?.data.filter(
                                (subService) => subService?.id !== 1
                              )
                            : []
                        }
                        optionLabel="name"
                        onChange={(e) => {
                          field.onChange(e.value);
                          setPrimaryVisible(true);
                          subServiceForm.resetField("serviceInitiatingAt");
                          subServiceForm.resetField("serviceExpectedAt");
                          subServiceForm.resetField("serviceIsImmediate");
                        }}
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
            {selectedCaseService?.id == 1 && (
              <>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">
                      Condition of Vehicle
                    </label>
                    <Controller
                      name="condtionOfVehicle"
                      control={control}
                      rules={{ required: "Condition of Vehicle is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Condition of Vehicle"
                            filter
                            resetFilterOnHide={true}
                            className="form-control-select"
                            options={formOptions?.conditionOfVehicles}
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
                {selectedConditionOfVehicle?.id == 8 && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        Condition of Vehicle - Others
                      </label>
                      <Controller
                        name="vehicleOthers"
                        control={control}
                        rules={{
                          required: "Condition of Vehicle-others is required.",
                        }}
                        render={({ field, fieldState }) => (
                          <InputText
                            {...field}
                            placeholder="Enter Condition of Vehicle-others "
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Additional Sub Service</label>
                    <Controller
                      name="additionalSubServiceId"
                      control={control}
                      // rules={{ required: "Additional Sub Services is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Additional Sub Service"
                            filter
                            resetFilterOnHide={true}
                            className="form-control-select"
                            options={formOptions?.towingAdditionalSubServices}
                            optionLabel="name"
                            showClear
                            onChange={(e) => {
                              field.onChange(e.value);
                              resetField("hasAspAssignment");
                              setSecondaryVisible(true);
                              additionalServiceForm.resetField(
                                "additionalServiceInitiatingAt"
                              );
                              additionalServiceForm.resetField(
                                "additionalServiceExpectedAt"
                              );
                              additionalServiceForm.resetField(
                                "additionalServiceIsImmediate"
                              );
                            }}
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
            <div className="col-md-6">
              <div className="form-group radio-form-group">
                <label className="form-label">Irate Customer</label>
                <Controller
                  name="irateCustomer"
                  control={control}
                  //rules={{ required: "Input is required." }}
                  render={({ field, fieldState }) => {
                    // console.log("Repair Status", field);
                    return (
                      <>
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_yes_irateCustomer"
                              {...field}
                              value="Yes"
                              checked={field.value === "Yes"}
                            />
                            <label
                              htmlFor="radio_yes_irateCustomer"
                              className="common-radio-label"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_no_irateCustomer"
                              {...field}
                              value="No"
                              checked={field.value === "No"}
                            />
                            <label
                              htmlFor="radio_no_irateCustomer"
                              className="common-radio-label"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </>
                    );
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group radio-form-group">
                <label className="form-label">Women Assist</label>
                <Controller
                  name="womenAssist"
                  control={control}
                  //rules={{ required: "Input is required." }}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_yes_womenAssist"
                              {...field}
                              value="Yes"
                              checked={field.value === "Yes"}
                            />
                            <label
                              htmlFor="radio_yes_womenAssist"
                              className="common-radio-label"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_no_womenAssist"
                              {...field}
                              value="No"
                              checked={field.value === "No"}
                            />
                            <label
                              htmlFor="radio_no_womenAssist"
                              className="common-radio-label"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </>
                    );
                  }}
                />
              </div>
            </div>
            {/* {selectedAdditionalSubService?.id && 
            <div className="col-md-6">
              <div className="form-group radio-form-group">
                <label className="form-label">ASP Required for Additional Sub Service</label>
                <Controller
                  name="hasAspAssignment"
                  control={control}
                  //rules={{ required: "Input is required." }}
                  render={({ field, fieldState }) => {
                    // console.log("Repair Status", field);
                    return (
                      <>
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="asp_asp_radio_yes"
                              {...field}
                              value="Yes"
                              checked={field.value === "Yes"}
                            />
                            <label
                              htmlFor="asp_radio_yes"
                              className="common-radio-label"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="asp_radio_no"
                              {...field}
                              value="No"
                              checked={field.value === "No"}
                            />
                            <label
                              htmlFor="asp_radio_no"
                              className="common-radio-label"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </>
                    );
                  }}
                />
              </div>
            </div>
          } */}

            <hr></hr>
            {user?.levelId == 1047 &&
              (serviceIsImmediate?.[0] == "Immediate" ||
                additionalServiceIsImmediate?.[0] == "Immediate") && (
                <div className="page-content-title">
                  Agent Assign
                  <p
                    style={{ color: "#949494", fontSize: "14px" }}
                    className="mt-2"
                  >
                    Assign Agent to this case
                  </p>
                  <Controller
                    name="agentAutoAllocation"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className="checkbox-item">
                        <Checkbox
                          inputId={field.name}
                          checked={field.value}
                          inputRef={field.ref}
                          onChange={(e) => field.onChange(e.checked)}
                        />
                        <label className="checkbox-label">
                          Self Assign to Me
                        </label>
                      </div>
                    )}
                  />
                </div>
              )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="row row-gap-3_4 case-position-sticky">
            {selectedCaseSubService?.id && (
              <>
                <div className="page-content-title"> Service Details</div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <p className="title mb-0">{selectedCaseSubService?.name}</p>
                    <Chip
                      label="Primary Service"
                      className="info-chip success case-status-chip"
                    />
                  </div>
                  <button
                    className="btn-link btn-text"
                    onClick={(e) => {
                      e.preventDefault();
                      setPrimaryVisible(true);
                    }}
                  >
                    {" "}
                    View Details
                  </button>
                </div>
                {selectedAdditionalSubService?.id &&
                  additionalServiceIsImmediate?.length > 0 && (
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="title mb-0">
                        {selectedAdditionalSubService?.name}
                      </p>
                      <button
                        className="btn-link btn-text"
                        onClick={(e) => {
                          e.preventDefault();
                          setSecondaryVisible(true);
                        }}
                      >
                        {" "}
                        View Details
                      </button>
                    </div>
                  )}
              </>
            )}
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
            {/* <div className="export-checkbox-group">
            <Controller
              name="one_time_service"
              inputId="one_time_service"
              control={control}
              render={({ field, fieldState }) => (
                <div className="common-checkbox-item">
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.checked)}
                  />
                  <label className="common-checkbox-label">
                    Onetime Service
                  </label>
                </div>
              )}
            />
          </div> */}
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
                        entitlementData?.notes?.status
                          ? "note-content-green"
                          : ""
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
      {selectedCaseSubService?.id && (
        <Dialog
          className="w-372"
          header={
            <div className="dialog-header">
              <div className="dialog-header-title">
                {selectedCaseSubService?.name}
              </div>
            </div>
          }
          visible={primaryVisible}
          // onHide={() => setPrimaryVisible(false)}
          // closable
          closable={false}
          draggable={false}
        >
          {/* <form id="dialogForm" onSubmit={handleSubmit(handleSubservice)}> */}
          <form>
            <label className="form-label required">Service Initiation</label>
            <Controller
              name="serviceIsImmediate"
              control={subServiceForm.control}
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
                        subServiceForm.resetField("serviceExpectedAt");
                        subServiceForm.resetField("serviceInitiatingAt");
                      }}
                      multiple={false}
                      defaultItems={field.value}
                      type="button"
                    />
                  </div>
                </>
              )}
            />

            {serviceIsImmediate?.[0] == "Later" && (
              <>
                <div className="col-md-12 mt-2">
                  <div className="form-group">
                    <label className="form-label required">
                      Expected Date and Time
                    </label>
                    <Controller
                      name="serviceExpectedAt"
                      control={subServiceForm.control}
                      rules={{
                        required: "Date and Time is required.",
                        validate: (value) =>
                          !serviceInitiatingAtValue ||
                          value > serviceInitiatingAtValue
                            ? true
                            : "Expected Date and Time must be greater than Initiation Date and Time.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <Calendar
                            id="dateRange"
                            value={field.value}
                            hourFormat="12"
                            dateFormat="dd/mm/yy"
                            {...field}
                            placeholder="Select Date and Time"
                            showIcon
                            showTime
                            hide
                            iconPos={"left"}
                            minDate={new Date()}
                            onChange={(e) => {
                              field.onChange(e.value); // Update the form field
                            }}
                          />
                          {/* {errors?.name && (
                        <div className="p-error">{subServiceForm.errors?.serviceExpectedAt?.message}</div>
                      )} */}
                          {fieldState.error && (
                            <div className="p-error">
                              {fieldState.error.message}
                            </div>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-12 mt-2">
                  <div className="form-group">
                    <label className="form-label required">
                      Initiation Date and Time
                    </label>
                    <Controller
                      name="serviceInitiatingAt"
                      control={subServiceForm.control}
                      rules={{ required: "Date and Time is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Calendar
                            id="dateRange"
                            value={field.value}
                            hourFormat="12"
                            dateFormat="dd/mm/yy"
                            {...field}
                            placeholder="Select Date and Time"
                            showIcon
                            showTime
                            hide
                            iconPos={"left"}
                            minDate={new Date()}
                            onChange={(e) => {
                              field.onChange(e.value); // Update the form field
                            }}
                            disabled={!serviceExpectedAtValue}
                          />
                          {/* {subServiceForm.errors?.serviceInitiatingAt && (
                        <div className="p-error">
                          {subServiceForm.errors?.serviceInitiatingAt?.message}
                        </div>
                      )} */}
                          {fieldState.error && (
                            <div className="p-error">
                              {fieldState.error.message}
                            </div>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
              </>
            )}
            {selectedCaseSubService?.hasAspAssignment && (
              <>
                <div className="dialog-header-title mt-3">ASP Assignment</div>
                <p style={{ color: "#949494" }} className="mt-2">
                  Assign Asp to this case
                </p>
                <Controller
                  name="aspAutoAllocation"
                  control={subServiceForm.control}
                  render={({ field, fieldState }) => (
                    <div className="checkbox-item">
                      <Checkbox
                        inputId={field.name}
                        checked={field.value}
                        inputRef={field.ref}
                        onChange={(e) => field.onChange(e.checked)}
                      />
                      <label className="checkbox-label">
                        Auto Assign for ASP
                      </label>
                    </div>
                  )}
                />
              </>
            )}

            <button
              className="btn form-submit-btn mb-2"
              onClick={(e) => handleValidationSubservice(e)}
              disabled={serviceIsImmediate?.length > 0 ? false : true}
            >
              Save Service
            </button>
          </form>
        </Dialog>
      )}

      {/* Additional Service Dialog box */}

      {selectedAdditionalSubService?.id && (
        <Dialog
          className="w-372"
          header={
            <div className="dialog-header">
              <div className="dialog-header-title">
                {selectedAdditionalSubService?.name}
              </div>
            </div>
          }
          visible={secondaryVisible}
          // onHide={() => setSecondaryVisible(false)}
          closable={false}
          draggable={false}
        >
          {/* <form id="additionalService" onSubmit={additionalServiceForm.handleSubmit(handleSubservice)}> */}
          <form>
            <label className="form-label required">Service Initiation</label>
            <Controller
              name="additionalServiceIsImmediate"
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
                        additionalServiceForm.resetField(
                          "additionalServiceExpectedAt"
                        );
                        additionalServiceForm.resetField(
                          "additionalServiceInitiatingAt"
                        );
                      }}
                      multiple={false}
                      defaultItems={field.value}
                      type="button"
                    />
                  </div>
                </>
              )}
            />

            {additionalServiceIsImmediate?.[0] == "Later" && (
              <>
                <div className="col-md-12 mt-2">
                  <div className="form-group">
                    <label className="form-label required">
                      Expected Date and Time
                    </label>
                    <Controller
                      name="additionalServiceExpectedAt"
                      control={additionalServiceForm.control}
                      rules={{
                        required: "Date and Time is required.",
                        validate: (value) =>
                          !additionalServiceInitiatingAtValue ||
                          value > additionalServiceInitiatingAtValue
                            ? true
                            : "Expected Date and Time must be greater than Initiation Date and Time.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <Calendar
                            id="dateRange"
                            value={field.value}
                            hourFormat="12"
                            dateFormat="dd/mm/yy"
                            {...field}
                            placeholder="Select Date and Time"
                            showIcon
                            showTime
                            hide
                            iconPos={"left"}
                            minDate={new Date()}
                            onChange={(e) => {
                              field.onChange(e.value); // Update the form field
                            }}
                          />
                          {/* {errors?.name && (
                        <div className="p-error">{subServiceForm.errors?.serviceExpectedAt?.message}</div>
                      )} */}
                          {fieldState.error && (
                            <div className="p-error">
                              {fieldState.error.message}
                            </div>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-12 mt-2">
                  <div className="form-group">
                    <label className="form-label required">
                      Initiation Date and Time
                    </label>
                    <Controller
                      name="additionalServiceInitiatingAt"
                      control={additionalServiceForm.control}
                      rules={{ required: "Date and Time is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Calendar
                            id="dateRange"
                            value={field.value}
                            hourFormat="12"
                            dateFormat="dd/mm/yy"
                            {...field}
                            placeholder="Select Date and Time"
                            showIcon
                            showTime
                            hide
                            iconPos={"left"}
                            minDate={new Date()}
                            onChange={(e) => {
                              field.onChange(e.value); // Update the form field
                            }}
                            disabled={!additionalServiceExpectedAtValue}
                          />

                          {fieldState.error && (
                            <div className="p-error">
                              {fieldState.error.message}
                            </div>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
              </>
            )}
            {selectedAdditionalSubService?.hasAspAssignment && (
              <>
                <div className="dialog-header-title mt-3">ASP Assignment</div>
                <p style={{ color: "#949494" }} className="mt-2">
                  Assign Asp to this case
                </p>
                <Controller
                  name="additionalServiceAspAutoAllocation"
                  control={additionalServiceForm.control}
                  render={({ field, fieldState }) => (
                    <div className="checkbox-item">
                      <Checkbox
                        inputId={field.name}
                        checked={field.value}
                        inputRef={field.ref}
                        onChange={(e) => field.onChange(e.checked)}
                      />
                      <label className="checkbox-label">
                        Auto Assign for ASP
                      </label>
                    </div>
                  )}
                />
              </>
            )}

            <button
              className="btn form-submit-btn mb-2"
              onClick={(e) => handleValidationAdditionalSub(e)}
              disabled={additionalServiceIsImmediate?.length > 0 ? false : true}
            >
              Save Service
            </button>
          </form>
        </Dialog>
      )}
    </>
  );
};

export default NewInteraction;
