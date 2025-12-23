import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const BusinessHours = ({formErrors}) => {
  const { control } = useFormContext();
  return (
    <div className="row">
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">Name</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required." }}
            render={({ field, fieldState }) => (
              <>
              <InputText
              className={`form-control ${
                fieldState.error ? "p-invalid" : ""
              }`}
              {...field}
              placeholder="Eg : DL001"
              
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
          <label className="form-label">Time Zone</label>
          <Controller
            name="timezone"
            control={control}
            rules={{ required: "Time Zone is required." }}
            render={({ field, fieldState }) => (
              <>
              <Dropdown
                value={field.value}
                placeholder="Select"
                options={[
                  { label: "Center 1", value: "center1" },
                  { label: "Center 2", value: "center2" },
                ]}
                className={`form-control-select ${
                  fieldState.error ? "p-invalid" : ""
                }`}
                optionLabel="label"
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
          <label className="form-label">Description</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required." }}
            render={({ field, fieldState }) => (
              <>
              <InputTextarea
                placeholder=""
                rows={1}
                className={`form-control-select ${
                  fieldState.error ? "p-invalid" : ""
                }`}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                id={field.name}
                {...field}
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
    </div>
  );
};

export default BusinessHours;
