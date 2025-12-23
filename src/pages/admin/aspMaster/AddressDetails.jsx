import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { cities } from "../../../../services/masterServices";
import { useQuery } from "react-query";
import { AutoComplete } from "primereact/autocomplete";

const AddressDetails = ({ formErrors, states }) => {
  const { control, setValue } = useFormContext();
  const [cityQuery, setCityQuery] = useState();
  const [cityList, setCityList] = useState([]);
  const StateId = useWatch({
    control,
    name: "stateId",
  });

  const { data } = useQuery(
    ["cities", StateId, cityQuery],
    () =>
      cities({
        apiType: "dropdown",
        stateId: StateId,
        ...(cityQuery && { search: cityQuery }),
      }),
    {
      enabled: StateId ? true : false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          console.log("city data List", res);
          setCityList(res?.data?.data);
        } else {
          setCityList([{ name: "No data found" }]);
        }
      },
    }
  );
  const handleCityChange = (event) => {
    setCityQuery(event.query);
  };
  return (
    <div className="row row-gap-3_4">
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Address Line 1</label>
          <Controller
            name="addressLineOne"
            control={control}
            rules={{ required: "Address Line 1 is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Address Line 1"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
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
          <label className="form-label">Address Line 2</label>
          <Controller
            name="addressLineTwo"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  value={field.value || ""}
                  placeholder="Enter Address Line 2"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
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
          <label className="form-label required">State</label>
          <Controller
            name="stateId"
            control={control}
            rules={{ required: "State is required." }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select State"
                  options={states}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => {
                    field.onChange(e.value);
                    setValue("cityId", "");
                  }}
                  filter
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
          <label className="form-label required">City</label>
          <Controller
            name="cityId"
            control={control}
            rules={{ required: "City is required." }}
            render={({ field, fieldState }) => (
              <>
                <AutoComplete
                  inputId={field.name}
                  value={field.value}
                  field="name"
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  inputRef={field.ref}
                  suggestions={cityList}
                  completeMethod={handleCityChange}
                  className="form-control-select"
                  placeholder="Enter City Name"
                  pt={{
                    list: {
                      className: `${data?.data?.success ? "" : "empty-state"}`,
                    },
                  }}
                />
                {/*  <Dropdown
                  value={field.value}
                  placeholder="Select City"
                  options={data?.data?.data}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => field.onChange(e.value)}
                /> */}
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
          <label className="form-label required">Pincode</label>
          <Controller
            name="pincode"
            control={control}
            rules={{ required: "Pincode is required" }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Pincode"
                  maxLength={6}
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Location</label>
          <Controller
            name="location"
            control={control}
            rules={{ required: "Location is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Location"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
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
          <label className="form-label required">Latitude</label>
          <Controller
            name="latitude"
            control={control}
            rules={{ required: "Latitude is required." }}
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
          <label className="form-label required">Longitude</label>
          <Controller
            name="longitude"
            control={control}
            rules={{ required: "Longitude is required." }}
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

export default AddressDetails;
