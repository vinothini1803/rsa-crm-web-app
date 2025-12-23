import { RadioButton } from "primereact/radiobutton";
import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";

const OperatingHours = () => {
  const { control } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: "customhoursList",
  });

  const colums = [
    {
      field: "status",
      header: "status",
      body: (field) => (
        <Controller
          name={`customhoursList.${fields.indexOf(field)}.status`}
          control={control}
          render={({ field, fieldState }) => {
            console.log("switch field field", field);
            return (
              <InputSwitch
                checked={field.value}
                onChange={(e) => field.onChange(e.value)}
              />
            );
          }}
        />
      ),
    },
    {
      field: "day",
      header: "Days",
      body: (record, field) => <div className="day-text">{record.day}</div>,
    },
    {
      field: "startTime",
      header: "Start Time",
      body: (field) => (
        <Controller
          name={`customhoursList.${fields.indexOf(field)}.startTime`}
          control={control}
          render={({ field, fieldState }) => (
            <InputText
              className="hide-border"
              placeholder="Eg : 8:00 AM"
              {...field}
            />
          )}
        />
      ),
    },
    {
      field: "endTime",
      header: "End TIme",
      body: (field) => (
        <Controller
          name={`customhoursList.${fields.indexOf(field)}.endTime`}
          control={control}
          render={({ field, fieldState }) => (
            <InputText placeholder="Eg : 8:00 AM" className="hide-border" {...field} />
          )}
        />
      ),
    },
  ];
  return (
    <div>
      <Controller
        name="opreatinghours"
        control={control}
        render={({ field, fieldState }) => (
          <div className="radio-btn-container">
            <button
              className={`btn-white custom-radio-btn ${
                field.value === "24*7" ? "active" : ""
              }`}
              type="button"
              onClick={() => field.onChange("24*7")}
            >
              <RadioButton value="24*7" checked={field.value === "24*7"} />
              <span className="radio-btn-label">24*7</span>
            </button>
            <button
              className={`btn-white custom-radio-btn ${
                field.value === "customize" ? "active" : ""
              }`}
              type="button"
              onClick={() => field.onChange("customize")}
            >
              <RadioButton
                value="customize"
                checked={field.value === "customize"}
              />
              <span className="radio-btn-label">Customize</span>
            </button>
          </div>
        )}
      />

      {/* <div className="time-card-container"></div> */}
      <div className="table-container">
        <DataTable value={fields} className="table-border hide-last-row-border">
          {colums?.map((item, index) => (
            <Column
              field={item.field}
              header={item.header}
              body={item.body}
            ></Column>
          ))}
        </DataTable>
      </div>
    </div>
  );
};

export default OperatingHours;
