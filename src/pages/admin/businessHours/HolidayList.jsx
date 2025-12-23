import React from "react";
import DynamicFormCard from "../../../components/common/DynamicFormCard";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import "./style.less";
import { Divider } from "primereact/divider";
import { CalendarTimeIcon, CalenderIcon } from "../../../utills/imgConstants";

const HolidayList = ({ formErrors }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "holidayList",
  });
  const handleAdd = () => {
    append(
      { date: "", holidayName: "", status: "" },
      {
        focusIndex: -1,
      }
    );
  };
  console.log("formError",formErrors)
  const handleRemove = (e, index) => {
    remove(index);
  };
  return (
    <DynamicFormCard
      title={"Holidays"}
      addLabel={"Add Holiday"}
      onAdd={handleAdd}
    >
      {fields?.map((item, index) => (
        <div className="fields-row" key={item.id}>
          <div className="form-field">
            <div className="field-title-text">
              Holiday {index + 1} :
              <button
                className="btn-link btn-text-danger ms-1_2"
                type="button"
                onClick={(e) => handleRemove(e, index)}
              >
                Remove
              </button>
            </div>
            <div className="row">
              <div className="col-md-2">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <Controller
                    name={`holidayList.${index}.date`}
                    control={control}
                    
                    render={({ field, fieldState }) => (
                      <>
                      <Calendar
                        {...field}
                        icon={<img src={CalenderIcon} />}
                        
                     
                        pt={{
                          input: {
                            className: "border-right-hidden",
                          },
                        }}
                        showIcon
                        iconPos={"right"}
                        placeholder="Select"
                        readOnlyInput
                        //autoFocus={true}
                      />
                       
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label className="form-label">Holiday Name</label>
                  <Controller
                    name={`holidayList.${index}.holidayName`}
                    control={control}
                    rules={{ required: "Holiday Name is required." }}
                    //rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          placeholder="Holiday Name"
                          {...field}
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          value={field.value}
                        />
                        <div className="p-error">
                          {/* {errors[field.name]?.message} */}
    
                          {fieldState.error && fieldState.error?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <Controller
                    name={`holidayList.${index}.status`}
                    control={control}
                    //rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <InputSwitch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.value)}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <Divider />
        </div>
      ))}
    </DynamicFormCard>
  );
};

export default HolidayList;
