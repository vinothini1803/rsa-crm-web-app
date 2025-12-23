import React from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from "primereact/calendar";
import { Controller, useForm, useWatch } from "react-hook-form";
import {CalendarTimeIcon} from  "../../utills/imgConstants"

const DynamicFieldRenderer = ({ inputFields, control, errors,templateDetails }) => {
  console.log("++++++++++++",templateDetails )
  console.log("++++++++++++",inputFields )
  return (
    <div>
        <h6 className="text-left mt-3">{templateDetails?.name}</h6>
      <hr className="mt-1 mb-3"/>
    
      
      <div className="col col-gap-3_4">
      
      {inputFields && inputFields.length > 0 ? (
        inputFields.map((field) => {
          const { id, inputTypeId, displayName, lists, name } = field;
console.log("fields",field)
          switch (field.inputTypeId) {
            case 931: // Free Text Box
              return (
                <div key={id} className="col-md-6 mb-3">
                  <label className="form-label required">{displayName}</label>
                  <Controller
                    name={`${name}`}
                    control={control}
                    rules={{ required: `${displayName} is required.` }}
                    render={({ field }) => (
                        <>
                      <InputTextarea
                        placeholder={`Enter ${displayName}`}
                        {...field}
                        rows={2}
                        cols={30}
                        className="form-control-textarea"
                      />
                      {errors[field.name] && (
                        <p className="p-error">{errors[field.name].message}</p>
                      )}
                      </>
                    )}
                  />
           
                </div>
              );
            case 932: // Dropdown
              return (
                <div key={id} className="col-md-6 mb-3">
                  <label className="form-label required">{displayName}</label>
                  <Controller
                    name={`${name}`}
                    control={control}
                    rules={{ required: `${displayName} is required.` }}
                    render={({ field }) => (
                        <>
                      <Dropdown
                        {...field}
                        options={lists}
                        optionLabel="name"
                        optionValue="name"
                      />
                      {errors[field.name] && (
                        <p className="p-error">{errors[field.name].message}</p>
                      )}
                      </>
                    )}
                  />
        
                </div>
              );
            
            case 933: // Number Text Box
              return (
                <div key={id} className="col-md-6 form-group mb-3">
                  <label className="form-label required">{displayName}</label>
                  <Controller
                    name={name}
                    control={control}
                    rules={{ required: `${displayName} is required.` }}
                    render={({ field }) => (
                        <>
                      <InputText
                        type="number"
                        placeholder={`Enter ${displayName}`}
                        {...field}
                        className="form-control-number"
                        min={0} 
                      />
                      {errors[field.name] && (
                        <p className="p-error">{errors[field.name].message}</p>
                      )}
                      </>
                    )}
                  />
            
                </div>
              );
            case 934: // Radio Button
              return (
                <div key={field.id} className="col-md-6 form-group mb-3">
                  <label className="form-label required">{field.displayName}</label>
                  <Controller
                    name={field.name}
                    control={control}
                    rules={{ required: `${field.displayName} is required.` }}
                    render={({ field, fieldState }) => (
                      <>
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_Yes"
                              {...field}
                              value="Yes"
                              checked={field.value === "Yes"}
                            />
                            <label
                              htmlFor="radio_Yes"
                              className="common-radio-label"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_No"
                              {...field}
                              value="No"
                              checked={field.value === "No"}
                            />
                            <label
                              htmlFor="radio_No"
                              className="common-radio-label"
                            >
                              No
                            </label>
                          </div>
                        </div>
                        {errors[field.name] && (
                          <p className="p-error">
                            {errors[field.name].message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              );
            case 935: // Time Picker
              return (
                <div key={field.id} className="col-md-6 form-group mb-3">
                  <label className="form-label required">{field.displayName}</label>
                  {/* <Controller
                    name={field.name}
                    control={control}
                    rules={{ required: `${field.displayName} is required.` }}
                    render={({ field }) => (
                      <Calendar
                        timeOnly
                        placeholder={`Select ${field.displayName}`}
                        {...field}
                        className="form-control-calendar"
                      />
                    )}
                  />
                  {errors[field.name] && (
                    <p className="error-text">{errors[field.name].message}</p>
                  )} */}
                  <Controller
                    name={field.name}
                    control={control}
                    rules={{ required: `${field.displayName} is required.` }}
                    render={({ field, fieldState }) => (
                      <>
                        <Calendar
                          inputId={field.name}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          timeOnly
                          showIcon
                          iconPos={"left"}
                          placeholder="Select Waiting Time"
                          icon={<img src={CalendarTimeIcon} />}
                          pt={{
                            input: {
                              className: "border-right-hidden",
                            },
                          }}
                        />
                        <div className="p-error">
                          {errors[field.name] && (
                            <p className="p-error">
                              {errors[field.name].message}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  />
                </div>
              );
            default:
              return null; // Unknown inputTypeId
          }
        })
      ) : (
        <p>No fields to display</p>
      )}
      </div>
    </div>
  );
};

export default DynamicFieldRenderer;
