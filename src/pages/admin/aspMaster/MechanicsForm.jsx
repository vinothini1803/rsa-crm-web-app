import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import React, { useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import "./style.less";
import { AddFieldIcon, BinIcon, PlusIcon } from "../../../utills/imgConstants";
import { useParams } from "react-router";
const MechanicsForm = ({ formErrors, priorities, performances }) => {
  const { control, setValue } = useFormContext();
  const { aspId } = useParams();
  const [mechanicsFields, setMechanicsFields] = useState([]);

  const aspStatusId = useWatch({
    control,
    name: "status",
  });

  console.log("aspStatusId", aspStatusId);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "aspMechanics", // The name of the field array in the form data
  });
  console.log("fields", fields);
  const onhandleAdd = (e) => {
    e.preventDefault();
    append({
      ...(aspId && { aspMechanicId: null, userId: null }),
      name: "",
      code: "",
      email: "",
      contactNumber: "",
      alternateContactNumber: "",
      businessHourId: null,
      latitude: "",
      longitude: "",
      performanceId: "",
      priorityId: "",
      address: "",
      userName: "",
      password: "",
      //changePassword: 0,
      status: aspStatusId ? 1 : 0,
    });
  };
  console.log("fields", fields);

  console.log(
    "formError mechanicform",
    formErrors,
    formErrors?.mechanic?.errors?.aspMechanics[0].name
  );
  const validateUppercase = (value) => {
    return (
      /[A-Z]/.test(value) ||
      "Password must contain at least one uppercase letter"
    );
  };

  const validateLowercase = (value) => {
    return (
      /[a-z]/.test(value) ||
      "Password must contain at least one lowercase letter"
    );
  };

  const validateSpecialCharacter = (value) => {
    return (
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value) ||
      "Password must contain at least one special character"
    );
  };

  // Use setValue function to update the form value for 'changePassword'
  const handlePasswordChange = (index, value) => {
    const updatedFields = [...mechanicsFields];
    updatedFields[index] = {
      ...updatedFields[index],
      changePassword: value, // Update the 'changePassword' field for a specific index
    };
    setMechanicsFields(updatedFields);
    if (value === 0) {
      setValue(`aspMechanics.${index}.password`, ""); // Reset the password field when 'changePassword' is set to 0
    }
  };

  console.log("formErrors", formErrors);
  return (
    <>
      {fields.map((field, index) => {
        console.log("field", field);
        return (
          <div className="row row-gap-3_4 form-border" key={field?.id}>
            <div className="pt-3_4 mechanic-form-title">
              <h6>Mechanic {index + 1}</h6>
             {/*  <button
                onClick={() => remove(index)}
                className="btn-link btn-text btn-with-icon remove-btn ms-auto"
              >
                <img src={BinIcon} />
              </button> */}
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label required">Name</label>
                <Controller
                  name={`aspMechanics.${index}.name`}
                  control={control}
                  rules={{
                    required: "Name is required.",
                  }}
                  render={({ field, fieldState }) => {
                    console.log("field, fieldState", field, fieldState);
                    return (
                      <>
                        <InputText
                          {...field}
                          placeholder="Enter Name"
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                        />
                        <div className="p-error">
                          {formErrors &&
                            formErrors.hasOwnProperty("aspMechanics") &&
                            formErrors?.aspMechanics[index]?.name?.message}
                        </div>
                      </>
                    );
                  }}
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label required">Code</label>
                <Controller
                  name={`aspMechanics.${index}.code`}
                  control={control}
                  rules={{ required: "Code is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        placeholder="Enter Code"
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                      />
                      <div className="p-error">
                        {formErrors &&
                          formErrors.hasOwnProperty("aspMechanics") &&
                          formErrors?.aspMechanics[index]?.code?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">Email</label>
                <Controller
                  name={`aspMechanics.${index}.email`}
                  control={control}
                  rules={{
                    validate: {
                      matchPattern: (v) =>
                        v == "" ||
                        v == null ||
                        v == undefined ||
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                        "Email address must be a valid address",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        placeholder="Enter Email"
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                        keyfilter={"email"}
                      />
                      <div className="p-error">
                        {formErrors &&
                          formErrors.hasOwnProperty("aspMechanics") &&
                          formErrors?.aspMechanics[index]?.email?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label required">Contact Number</label>
                <Controller
                  name={`aspMechanics.${index}.contactNumber`}
                  control={control}
                  rules={{
                    required: "Contact Number is required.",
                    validate: {
                      matchPattern: (v) =>
                        /^([+]\d{2})?\d{10}$/.test(v) ||
                        "Contact Number must be a valid number",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        placeholder="Enter Contact Number"
                        maxLength={10}
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                        keyfilter={"pnum"}
                      />
                      <div className="p-error">
                        {formErrors &&
                          formErrors.hasOwnProperty("aspMechanics") &&
                          formErrors?.aspMechanics[index]?.contactNumber
                            ?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">Alternate Contact Number</label>
                <Controller
                  name={`aspMechanics.${index}.alternateContactNumber`}
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <InputText
                          {...field}
                          placeholder="Enter Alternate Contact Number"
                          maxLength={10}
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          keyfilter={"pnum"}
                        />
                        <div className="p-error">
                          {formErrors &&
                            formErrors.hasOwnProperty("aspMechanics") &&
                            formErrors?.aspMechanics[index]
                              ?.alternateContactNumber?.message}
                        </div>
                      </>
                    );
                  }}
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <Controller
                  name={`aspMechanics.${index}.latitude`}
                  control={control}
                  //rules={{ required: "Latitude is Required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        placeholder="Enter Latitude"
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                      />
                      <div className="p-error">
                        {formErrors &&
                          formErrors.hasOwnProperty("aspMechanics") &&
                          formErrors?.aspMechanics[index]?.latitude?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <Controller
                  name={`aspMechanics.${index}.longitude`}
                  control={control}
                  //rules={{ required: "Longitude is Required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        placeholder="Enter Longitude"
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                      />
                      <div className="p-error">
                        {formErrors &&
                          formErrors.hasOwnProperty("aspMechanics") &&
                          formErrors?.aspMechanics[index]?.longitude?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label required">Performance</label>
                <Controller
                  name={`aspMechanics.${index}.performanceId`}
                  control={control}
                  rules={{ required: "Performance is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Performance"
                        options={performances}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(e) => field.onChange(e.value)}
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                      />
                      <div className="p-error">
                        {formErrors &&
                          formErrors.hasOwnProperty("aspMechanics") &&
                          formErrors?.aspMechanics[index]?.performanceId
                            ?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label required">Priority</label>
                <Controller
                  name={`aspMechanics.${index}.priorityId`}
                  control={control}
                  rules={{ required: "Priority is Required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Priority"
                        options={priorities}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(e) => field.onChange(e.value)}
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                      />
                      <div className="p-error">
                        {formErrors &&
                          formErrors.hasOwnProperty("aspMechanics") &&
                          formErrors?.aspMechanics[index]?.priorityId?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Address</label>
                <Controller
                  name={`aspMechanics.${index}.address`}
                  rules={{ required: "Address is Required" }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        placeholder="Enter Address"
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                      />
                      <div className="p-error">
                        {formErrors &&
                          formErrors.hasOwnProperty("aspMechanics") &&
                          formErrors?.aspMechanics[index]?.address?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label required">Username</label>
                <Controller
                  name={`aspMechanics.${index}.userName`}
                  control={control}
                  rules={{ required: "Username is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        placeholder="Enter Contact Number"
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                        maxLength={10}
                        keyfilter={"pnum"}
                      />
                      <div className="p-error">
                        {formErrors &&
                          formErrors.hasOwnProperty("aspMechanics") &&
                          formErrors?.aspMechanics[index]?.userName?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            {!field?.aspMechanicId ? (
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label required">Password</label>
                  <Controller
                    name={`aspMechanics.${index}.password`}
                    control={control}
                    rules={{
                      required: "Password is required.",
                      minLength: {
                        value: 12,
                        message: "Password must have at least 12 characters",
                      },
                      validate: {
                        validateUppercase,
                        validateSpecialCharacter,
                        validateLowercase,
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          placeholder="Enter Password"
                          autoComplete="off"
                          {...field}
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                        />
                        <div className="p-error">
                          {formErrors &&
                            formErrors.hasOwnProperty("aspMechanics") &&
                            formErrors?.aspMechanics[index]?.password?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            ) : (
              <div className="col-md-3">
                <div className="form-group radio-form-group">
                  <label className="form-label required">Change Password</label>
                  <Controller
                    name={`aspMechanics.${index}.changePassword`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className="common-radio-group">
                        <div className="common-radio-item">
                          <RadioButton
                            inputId="radio_yes"
                            {...field}
                            value={1}
                            checked={field.value === 1}
                            onChange={(e) => {
                              handlePasswordChange(index, 1);
                              field.onChange(e.value);
                            }} // Set value to 1 for 'Yes'
                          />
                          <label
                            htmlFor="radio_yes"
                            className="common-radio-label"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="common-radio-item">
                          <RadioButton
                            inputId="radio_no"
                            {...field}
                            value={0}
                            checked={field.value === 0}
                            onChange={(e) => {
                              handlePasswordChange(index, 0);
                              field.onChange(e.value);
                            }} // Set value to 1 for 'No'
                          />
                          <label
                            htmlFor="radio_no"
                            className="common-radio-label"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            )}

            {mechanicsFields[index]?.changePassword ? (
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label required">Password</label>
                  <Controller
                    name={`aspMechanics.${index}.password`}
                    control={control}
                    rules={{
                      required: "Password is required.",
                      minLength: {
                        value: 12,
                        message: "Password must have at least 12 characters",
                      },
                      validate: {
                        validateUppercase,
                        validateSpecialCharacter,
                        validateLowercase,
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          placeholder="Enter Password"
                          autoComplete="off"
                          {...field}
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                        />
                        <div className="p-error">
                          {formErrors &&
                            formErrors.hasOwnProperty("aspMechanics") &&
                            formErrors?.aspMechanics[index]?.password?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            ) : null}
            <div className="col-md-3">
              <div className="form-group radio-form-group">
                <label className="form-label required">Status</label>
                <Controller
                  name={`aspMechanics.${index}.status`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId={`mechanic${index}_yes`}
                          {...field}
                          value={1}
                          checked={field.value === 1}
                          disabled={aspStatusId == 0 ? true : false}
                        />
                        <label
                          htmlFor={`mechanic${index}_yes`}
                          className="common-radio-label"
                        >
                          Active
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId={`mechanic${index}_no`}
                          {...field}
                          value={0}
                          checked={field.value === 0}
                          disabled={aspStatusId == 0 ? true : false}
                        />
                        <label
                          htmlFor={`mechanic${index}_no`}
                          className="common-radio-label"
                        >
                          Inactive
                        </label>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        );
      })}
      <div className="pt-2_3">
        <button
          className="btn-link btn-text btn-with-icon mechanic-btn"
          onClick={onhandleAdd}
        >
          <img src={AddFieldIcon} />
          Add Mechanic
        </button>
      </div>
    </>
  );
};

export default MechanicsForm;
