import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState, useEffect, useRef } from "react";
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
import { Rating } from "primereact/rating";
import {
  getCaseSubjectServices,
  getCaseSubjectSubServices,
} from "../../../services/caseService";
import { getQuestionnairesByCaseSubjectId } from "../../../services/masterServices";
import moment from "moment";
import { Children } from "react";
import { Chip } from "primereact/chip";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import DialogForm from "./DialogForm";
const NewInteraction = ({
  formOptions,
  formErrors,
  entitlementData,
  client,
  setFullEntitlementVisible,
  existCustomer,
  subServiceForm,
  additionalServiceForm,
  questionnaireErrors,
  setQuestionnaireErrors,
  questionnaireVisible: parentQuestionnaireVisible,
  setQuestionnaireVisible: setParentQuestionnaireVisible,
}) => {
  const { control, resetField, watch, setValue, getValues } = useFormContext();
  const handleSubjectSelect = (id) => {
    // console.log("selcted ids", id);
  };
  const user = useSelector(CurrentUser);
  // console.log("user", user);
  //const [value, setValue] = useState(true);
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
  // console.log("serviceExpectedAtValue", serviceExpectedAtValue);
  const subjectValue = useWatch({ name: "subject" });
  const selectedCaseType = useWatch({ name: "caseType" });
  const selectedCaseSubject = useWatch({ name: "caseSubject" });
  const selectedCaseService = useWatch({ name: "service" });
  const selectedCaseSubService = useWatch({ name: "subService" });
  // const selectedConditionOfVehicle = useWatch({ name: "condtionOfVehicle" });
  const selectedPolicyNumber = useWatch({ name: "policyNumber" });
  const selectedPolicyType = useWatch({ name: "policyType" });
  const selectedPolicyStart = useWatch({ name: "policyStartDate" });
  const selectedPolicyEnd = useWatch({ name: "policyEndDate" });
  const selectedAdditionalSubService = useWatch({
    name: "additionalSubServiceId",
  });
  const [primaryVisible, setPrimaryVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [visibleDialog, setVisibleDialog] = useState(null);
  const [secondaryVisible, setSecondaryVisible] = useState(false);
  const [questionnaireVisible, setQuestionnaireVisible] = useState(false);
  const autoOpenedForCaseSubjectIdRef = useRef(null);

  // Use parent questionnaireVisible if provided, otherwise use local state
  const isQuestionnaireVisible =
    parentQuestionnaireVisible !== undefined
      ? parentQuestionnaireVisible
      : questionnaireVisible;
  const setIsQuestionnaireVisible =
    setParentQuestionnaireVisible || setQuestionnaireVisible;
  const serviceIsImmediate = subServiceForm.watch("serviceIsImmediate");
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  const formQuestionnaireAnswers = watch("questionnaireAnswers") || [];
  const [filteredCaseSubjects, setFilteredCaseSubjects] = useState(
    formOptions?.caseSubjects || []
  );
  // const additionalServiceIsImmediate = additionalServiceForm.watch(
  //   "additionalServiceIsImmediate"
  // );
  // console.log(
  //   "selectedAdditionalSubService",
  //   selectedAdditionalSubService,
  //   selectedServices
  // );

  // Filter case subjects based on selected case type
  useEffect(() => {
    if (selectedCaseType?.id && formOptions?.caseSubjects) {
      const filtered = formOptions.caseSubjects.filter(
        (subject) => subject.caseTypeId === selectedCaseType.id
      );
      setFilteredCaseSubjects(filtered);
      // Clear case subject if current selection doesn't match the new case type
      if (
        selectedCaseSubject &&
        selectedCaseSubject.caseTypeId !== selectedCaseType.id
      ) {
        resetField("caseSubject");
        // Clear questionnaire answers when case subject is reset due to case type change
        setQuestionnaireAnswers({});
        setValue("questionnaireAnswers", []);
        autoOpenedForCaseSubjectIdRef.current = null;
      }
    } else {
      // If no case type selected, show no case subjects
      setFilteredCaseSubjects([]);
      // Clear case subject when case type is cleared
      if (selectedCaseSubject) {
        resetField("caseSubject");
        // Clear questionnaire answers when case subject is cleared
        setQuestionnaireAnswers({});
        setValue("questionnaireAnswers", []);
        autoOpenedForCaseSubjectIdRef.current = null;
      }
    }
  }, [
    selectedCaseType,
    formOptions?.caseSubjects,
    selectedCaseSubject,
    resetField,
    setValue,
  ]);

  // Clear questionnaire answers when case subject changes (including when it becomes null/undefined)
  useEffect(() => {
    if (!selectedCaseSubject) {
      setQuestionnaireAnswers({});
      setValue("questionnaireAnswers", []);
      autoOpenedForCaseSubjectIdRef.current = null;
    }
  }, [selectedCaseSubject, setValue]);

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

  const { data: questionnairesData } = useQuery(
    ["getQuestionnairesByCaseSubjectId", selectedCaseSubject],
    () =>
      getQuestionnairesByCaseSubjectId({
        caseSubjectId: selectedCaseSubject?.id,
      }),
    {
      enabled: selectedCaseSubject ? true : false,
      staleTime: 5 * 60 * 1000, // 5 minutes - prevent refetching
      cacheTime: 10 * 60 * 1000, // 10 minutes - keep cache
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on mount if data exists
      onSuccess: (res) => {
        // Only auto-open if this is a NEW case subject (different from the one we auto-opened for)
        // Double check: res success, case subject exists, and it's different from what we've opened
        if (
          res?.data?.success &&
          selectedCaseSubject?.id &&
          selectedCaseSubject.id !== autoOpenedForCaseSubjectIdRef.current
        ) {
          // Reset questionnaire answers when questionnaires change (new case subject selected)
          setQuestionnaireAnswers({});
          setValue("questionnaireAnswers", []);

          // Auto-open modal if questionnaires exist
          if (res?.data?.data?.length > 0) {
            setIsQuestionnaireVisible(true);
            autoOpenedForCaseSubjectIdRef.current = selectedCaseSubject.id;
          } else {
            // Mark as processed even if no questionnaires
            autoOpenedForCaseSubjectIdRef.current = selectedCaseSubject.id;
          }
        }
      },
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
    // Reset questionnaire answers when case subject changes
    setQuestionnaireAnswers({});
    setValue("questionnaireAnswers", []);
    // Reset auto-opened flag when case subject changes (user selected a different one)
    if (e.value?.id !== autoOpenedForCaseSubjectIdRef.current) {
      autoOpenedForCaseSubjectIdRef.current = null;
    }
  };

  const handleQuestionnaireAnswerChange = (
    questionnaireId,
    value,
    fieldType
  ) => {
    setQuestionnaireAnswers((prev) => {
      const newAnswers = { ...prev };
      if (fieldType === "option_text" || fieldType === "option_conditional") {
        newAnswers[questionnaireId] = {
          option: value.option || value,
          text: value.text || "",
        };
      } else {
        newAnswers[questionnaireId] = value;
      }

      // Update the form value for case creation - this persists across tabs
      const formattedAnswers = Object.keys(newAnswers).map((key) => ({
        questionnaireId: parseInt(key),
        answer: newAnswers[key],
      }));
      setValue("questionnaireAnswers", formattedAnswers);

      return newAnswers;
    });
  };

  // Initialize questionnaire answers from form context when modal opens
  useEffect(() => {
    if (isQuestionnaireVisible) {
      if (formQuestionnaireAnswers.length > 0) {
        const answersFromForm = {};
        formQuestionnaireAnswers.forEach((item) => {
          if (
            item.questionnaireId &&
            item.answer !== undefined &&
            item.answer !== null &&
            item.answer !== ""
          ) {
            // Handle different answer types
            if (
              typeof item.answer === "object" &&
              (item.answer.option !== undefined ||
                item.answer.text !== undefined)
            ) {
              answersFromForm[item.questionnaireId] = item.answer;
            } else if (
              typeof item.answer === "string" ||
              typeof item.answer === "number"
            ) {
              answersFromForm[item.questionnaireId] = item.answer;
            }
          }
        });
        setQuestionnaireAnswers(answersFromForm);
      } else {
        // Reset if no answers in form context
        setQuestionnaireAnswers({});
      }
    }
  }, [isQuestionnaireVisible]);

  // Also update when form values change while modal is open
  useEffect(() => {
    if (isQuestionnaireVisible && formQuestionnaireAnswers.length > 0) {
      const answersFromForm = {};
      formQuestionnaireAnswers.forEach((item) => {
        if (
          item.questionnaireId &&
          item.answer !== undefined &&
          item.answer !== null &&
          item.answer !== ""
        ) {
          if (
            typeof item.answer === "object" &&
            (item.answer.option !== undefined || item.answer.text !== undefined)
          ) {
            answersFromForm[item.questionnaireId] = item.answer;
          } else if (
            typeof item.answer === "string" ||
            typeof item.answer === "number"
          ) {
            answersFromForm[item.questionnaireId] = item.answer;
          }
        }
      });
      setQuestionnaireAnswers(answersFromForm);
    }
  }, [formQuestionnaireAnswers, isQuestionnaireVisible]);

  const handleCaseService = (e) => {
    resetField("subService");
    resetField("additionalSubServiceId");
    resetField("dealers");
    clearDropLoaction();
  };

  //console.log("subjectValue", subjectValue);
  //console.log("Form Options => ", additionalServiceForm?.getValues('serviceConfig'));
  // console.log("selectedCaseSubject => ", selectedCaseSubject);
  //console.log('caseSubjectServicesData => ', caseSubjectSubServicesData);
  //console.log('caseSubjectSubServicesData => ', caseSubjectSubServicesData);
  //console.log("Entitlement Data => ", entitlementData);

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
  const handleServiceSelect = (services) => {
    setSelectedServices(services);
  };
  // console.log("selectedServices", selectedServices);
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
                    // validate: {
                    //   matchPattern: (v) =>
                    //     /^[a-zA-Z.\s'-]+$/.test(v) ||
                    //     "Contact Name must be a Alphabets",
                    // },
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
                    // validate: {
                    //   matchPattern: (v) =>
                    //     /^[a-zA-Z.\s'-]+$/.test(v) ||
                    //     "Current Contact Name must be a Alphabets",
                    // },
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
            {/*<div className="col-md-12">
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
                        options={filteredCaseSubjects}
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
                      {/* {console.log(
                        "Service Dropdown fieldState => ",
                        fieldState,
                        field
                      )} */}
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
                {/* <div className="col-md-6">
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
                )} */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Additional Sub Service</label>
                    <Controller
                      name="additionalSubServiceId"
                      control={control}
                      // rules={{ required: "Additional Sub Services is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <MultiSelect
                            value={field.value}
                            placeholder="Select Additional Sub Service"
                            // filter
                            // resetFilterOnHide={true}
                            className="form-control-select"
                            options={formOptions?.towingAdditionalSubServices}
                            optionLabel="name"
                            showClear
                            showSelectAll={false}
                            onChange={(e) => {
                              field.onChange(e.value);
                              resetField("hasAspAssignment");
                              //setSecondaryVisible(true);
                              handleServiceSelect(e.value);
                              setVisibleDialog(
                                e.value.length > 0
                                  ? e.value[e.value.length - 1]
                                  : null
                              );
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
                        {formErrors && formErrors[field.name]?.message}
                      </div>
                    </>
                  )}
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
                (() => {
                  const serviceConfigs =
                    additionalServiceForm?.getValues("serviceConfig") || [];
                  return serviceConfigs.some(
                    (_, index) =>
                      additionalServiceForm.getValues(
                        `serviceConfig[${index}].additionalServiceIsImmediate`
                      )?.[0] === "Immediate"
                  );
                })()) && (
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
            {selectedCaseSubject &&
              questionnairesData?.data?.success &&
              questionnairesData?.data?.data?.length > 0 && (
                <>
                  <div className="page-content-title">Probing Questions</div>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="title mb-0">
                      {questionnairesData?.data?.data?.length} Question
                      {questionnairesData?.data?.data?.length > 1 ? "s" : ""}
                    </p>
                    <button
                      className="btn-link btn-text"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsQuestionnaireVisible(true);
                      }}
                    >
                      {Object.keys(questionnaireAnswers).length > 0
                        ? "Edit"
                        : "View"}{" "}
                      Questions
                    </button>
                  </div>
                </>
              )}
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
                {/* {selectedAdditionalSubService?.id &&
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
                  )} */}
                {selectedAdditionalSubService?.length > 0 &&
                  selectedAdditionalSubService.map((service, index) => (
                    <div
                      key={service?.id}
                      className="d-flex align-items-center justify-content-between"
                    >
                      <p className="title mb-0">{service?.name}</p>
                      <button
                        className="btn-link btn-text"
                        onClick={(e) => {
                          e.preventDefault();
                          setVisibleDialog(service); // Ensure this state setter is defined
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
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
          onHide={() => setPrimaryVisible(false)}
          // onHide={() => {
          //   setPrimaryVisible(false);

          //   // Reset subService in the parent form
          //   resetField("subService");

          //   // Also reset subService-related fields in the subServiceForm
          //   subServiceForm.resetField("serviceInitiatingAt");
          //   subServiceForm.resetField("serviceExpectedAt");
          //   subServiceForm.resetField("serviceIsImmediate");
          //   subServiceForm.resetField("aspAutoAllocation");
          // }}
          //closable
          closable={true}
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
                              stepMinute={15}
                              minDate={now}
                              maxDate={maxDate}
                              touchUI={false}
                              onChange={(e) => {
                                const selectedDate = roundMinutes(
                                  new Date(e.value)
                                ); // Round only on selection
                                field.onChange(selectedDate);
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
                        );
                      }}
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
                      rules={{
                        required: "Date and Time is required.",
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
                                field.onChange(selectedDate); // Update the form field
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
                        );
                      }}
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

      {/* {selectedAdditionalSubService?.id && (
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
                          !additionalServiceInitiatingAtValue || value > additionalServiceInitiatingAtValue
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
      )} */}
      {visibleDialog &&
        selectedAdditionalSubService?.map((service, i) => {
          // console.log("Index:", i); // Check if the index is logged correctly

          return (
            <DialogForm
              key={i} // React internal key
              index={i}
              visible={visibleDialog.id === service.id}
              onClose={() => setVisibleDialog(null)}
              // onClose={(shouldRemove = false) => {
              //   if (shouldRemove) {
              //     // Remove the value from the selected array
              //     const updatedValues = selectedAdditionalSubService?.filter(
              //       (val) => val?.id !== service?.id
              //     );
              //     setValue("additionalSubServiceId", updatedValues);

              //     // Reset the fields in the form
              //     additionalServiceForm.setValue(
              //       `serviceConfig[${i}].additionalServiceIsImmediate`,
              //       []
              //     );
              //     additionalServiceForm.setValue(
              //       `serviceConfig[${i}].additionalServiceExpectedAt`,
              //       ""
              //     );
              //     additionalServiceForm.setValue(
              //       `serviceConfig[${i}].additionalServiceInitiatingAt`,
              //       ""
              //     );
              //     additionalServiceForm.setValue(
              //       `serviceConfig[${i}].additionalServiceAspAutoAllocation`,
              //       false
              //     );
              //   }

              //   setVisibleDialog(null);
              // }}
              service={service}
              additionalServiceForm={additionalServiceForm}
            />
          );
        })}

      {/* Questionnaire Dialog Modal */}
      {questionnairesData?.data?.success &&
        questionnairesData?.data?.data?.length > 0 && (
          <Dialog
            header={
              <div className="dialog-header">
                <div className="dialog-header-title">Probing Questions</div>
              </div>
            }
            visible={isQuestionnaireVisible}
            onHide={() => {
              setIsQuestionnaireVisible(false);
              // Clear errors when modal is closed
              if (setQuestionnaireErrors) {
                setQuestionnaireErrors({});
              }
            }}
            closable={true}
            draggable={false}
            style={{ width: "650px", maxWidth: "90vw", maxHeight: "80vh" }}
          >
            <div
              className="questionnaire-modal-content"
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              {questionnairesData.data.data.map((questionnaire, index) => {
                const answerType = questionnaire.answerType;
                const fieldType = answerType?.fieldType;
                let options = [];
                try {
                  if (answerType?.options) {
                    options =
                      typeof answerType.options === "string"
                        ? JSON.parse(answerType.options)
                        : answerType.options;
                    // Convert array of strings to array of objects for dropdown
                    if (
                      Array.isArray(options) &&
                      options.length > 0 &&
                      typeof options[0] === "string"
                    ) {
                      options = options.map((opt) => ({
                        label: opt,
                        value: opt,
                      }));
                    }
                  }
                } catch (e) {
                  console.error("Error parsing options:", e);
                  options = [];
                }
                // Parse conditionalOptions for option_conditional type
                let conditionalOptionsList = [];
                if (
                  fieldType === "option_conditional" &&
                  answerType?.conditionalOptions
                ) {
                  try {
                    conditionalOptionsList =
                      typeof answerType.conditionalOptions === "string"
                        ? JSON.parse(answerType.conditionalOptions)
                        : answerType.conditionalOptions;
                  } catch (e) {
                    console.error("Error parsing conditionalOptions:", e);
                    conditionalOptionsList = [];
                  }
                }

                const currentAnswer =
                  questionnaireAnswers[questionnaire.id] ||
                  (fieldType === "option_text" ||
                  fieldType === "option_conditional"
                    ? { option: "", text: "" }
                    : "");

                // For option_conditional, check if selected option triggers text field
                const shouldShowTextField =
                  fieldType === "option_text" ||
                  (fieldType === "option_conditional" &&
                    currentAnswer?.option &&
                    conditionalOptionsList.includes(currentAnswer.option));

                const hasError = questionnaireErrors?.[questionnaire.id];

                return (
                  <div
                    key={questionnaire.id}
                    className="mb-4 pb-3 border-bottom"
                  >
                    <label
                      className={`form-label mb-2 ${
                        hasError ? "text-danger" : ""
                      }`}
                    >
                      {index + 1}. {questionnaire.question}
                      {hasError && <span className="ms-2 text-danger">*</span>}
                    </label>

                    {fieldType === "option" && (
                      <>
                        <Dropdown
                          value={currentAnswer}
                          placeholder="Select Option"
                          options={options}
                          optionLabel="label"
                          optionValue="value"
                          onChange={(e) =>
                            handleQuestionnaireAnswerChange(
                              questionnaire.id,
                              e.value,
                              fieldType
                            )
                          }
                          className={`w-100 ${hasError ? "p-invalid" : ""}`}
                        />
                        {hasError && (
                          <div className="p-error mt-1">{hasError}</div>
                        )}
                      </>
                    )}

                    {fieldType === "text" && (
                      <>
                        <InputText
                          value={currentAnswer}
                          placeholder="Enter answer"
                          onChange={(e) =>
                            handleQuestionnaireAnswerChange(
                              questionnaire.id,
                              e.target.value,
                              fieldType
                            )
                          }
                          className={`w-100 ${hasError ? "p-invalid" : ""}`}
                        />
                        {hasError && (
                          <div className="p-error mt-1">{hasError}</div>
                        )}
                      </>
                    )}

                    {fieldType === "rating" && (
                      <>
                        <div className="d-flex align-items-center gap-2">
                          <Rating
                            value={
                              currentAnswer ? parseInt(currentAnswer) || 0 : 0
                            }
                            onChange={(e) => {
                              // Convert numeric value to string to match option values
                              const ratingValue = String(e.value);
                              handleQuestionnaireAnswerChange(
                                questionnaire.id,
                                ratingValue,
                                fieldType
                              );
                            }}
                            stars={options.length || 5}
                            cancel={false}
                            className={hasError ? "p-invalid" : ""}
                          />
                          {currentAnswer && (
                            <span className="text-muted">
                              {currentAnswer} / {options.length || 5}
                            </span>
                          )}
                        </div>
                        {hasError && (
                          <div className="p-error mt-1">{hasError}</div>
                        )}
                      </>
                    )}

                    {(fieldType === "option_text" ||
                      fieldType === "option_conditional") && (
                      <div className="row">
                        <div
                          className={
                            shouldShowTextField ? "col-md-6" : "col-md-12"
                          }
                        >
                          <Dropdown
                            value={currentAnswer?.option || ""}
                            placeholder="Select Option"
                            options={options}
                            optionLabel="label"
                            optionValue="value"
                            onChange={(e) => {
                              // Reset text when option changes for option_conditional
                              if (fieldType === "option_conditional") {
                                handleQuestionnaireAnswerChange(
                                  questionnaire.id,
                                  { option: e.value, text: "" },
                                  fieldType
                                );
                              } else {
                                handleQuestionnaireAnswerChange(
                                  questionnaire.id,
                                  { ...currentAnswer, option: e.value },
                                  fieldType
                                );
                              }
                            }}
                            className={`w-100 ${
                              hasError &&
                              (!currentAnswer?.option ||
                                currentAnswer?.option === "")
                                ? "p-invalid"
                                : ""
                            }`}
                          />
                        </div>
                        {shouldShowTextField && (
                          <div className="col-md-6">
                            <InputText
                              value={currentAnswer?.text || ""}
                              placeholder={
                                fieldType === "option_conditional"
                                  ? "Enter details (required)"
                                  : "Enter additional details"
                              }
                              onChange={(e) =>
                                handleQuestionnaireAnswerChange(
                                  questionnaire.id,
                                  { ...currentAnswer, text: e.target.value },
                                  fieldType
                                )
                              }
                              className={`w-100 ${
                                hasError &&
                                (!currentAnswer?.text ||
                                  currentAnswer?.text.trim() === "")
                                  ? "p-invalid"
                                  : ""
                              }`}
                            />
                          </div>
                        )}
                        {hasError && (
                          <div className="col-12">
                            <div className="p-error mt-1">{hasError}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              className="btn form-submit-btn mb-2"
              onClick={(e) => {
                e.preventDefault();
                setIsQuestionnaireVisible(false);
                // Clear errors when saving
                if (setQuestionnaireErrors) {
                  setQuestionnaireErrors({});
                }
              }}
            >
              Save Questions
            </button>
          </Dialog>
        )}
    </>
  );
};

export default NewInteraction;
