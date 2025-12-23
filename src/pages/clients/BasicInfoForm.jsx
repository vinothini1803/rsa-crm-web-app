import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const BasicInfoForm = ({ formErrors }) => {
  // console.log("formErrors==>", formErrors);
  const { control } = useFormContext();

  return (
    <div className="row row-gap-3_4">
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Name</label>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required.",
              pattern: {
                value: /^[a-zA-Z ]*$/,
                message: "Only letters and spaces are allowed.",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  {...field}
                  placeholder="Enter Name"
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z ]$/.test(e.key)) {
                      e.preventDefault();
                    }
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Email</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required.",
              validate: {
                matchPattern: (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                  "Email address must be a valid address",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  {...field}
                  placeholder="Enter Email"
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Mobile Number</label>
          <Controller
            name="contactNumber"
            control={control}
            rules={{
              required: "Mobile Number is required.",
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  maxLength={10}
                  keyfilter={"pnum"}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  {...field}
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
    </div>
  );
};

export default BasicInfoForm;
