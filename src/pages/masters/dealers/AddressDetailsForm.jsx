import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router";
import { cities, getdealerFormData } from "../../../../services/masterServices";
import { AutoComplete } from "primereact/autocomplete";

const AddressDetailsForm = ({ formErrors, states, zones }) => {
  const { control, setValue } = useFormContext();
  const [cityQuery, setCityQuery] = useState();
  const [cityList, setCityList] = useState([]);
  console.log("formErrors", formErrors);
  const StateId = useWatch({ control, name: "stateId" });
  const { data } = useQuery(
    ["citiesDropdown", StateId, cityQuery],
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
            rules={{ required: "Address line 1 is required." }}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  {...field}
                  placeholder="Enter Address Line 1"
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
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  {...field}
                  placeholder="Enter Address Line 2"
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
          <label className="form-label required">Correspondence Address</label>
          <Controller
            name="correspondenceAddress"
            control={control}
            rules={{ required: "Correspondence Address is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  {...field}
                  placeholder="Enter Correspondence Address"
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
                  optionLabel={"name"}
                  optionValue={"id"}
                  className={`form-control-select ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  onChange={(e) => {
                    field.onChange(e.value);
                    setValue("cityId", "");
                  }}
                  filter
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
                  className={`form-control-select ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => field.onChange(e.value)}
                /> */}
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Area</label>
          <Controller
            name="area"
            control={control}
            rules={{ required: "Area is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  {...field}
                  placeholder="Enter Area"
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
          <label className="form-label required">Pincode</label>
          <Controller
            name="pincode"
            control={control}
            rules={{ required: "Pincode is required" }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
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
          <label className="form-label required">Latitude</label>
          <Controller
            name="lat"
            control={control}
            rules={{ required: "Latitude is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  {...field}
                  placeholder="Enter Latitude"
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
            name="long"
            control={control}
            rules={{ required: "Longitude is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  {...field}
                  placeholder="Enter Longitude"
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
          <label className="form-label required">Zone</label>
          <Controller
            name="zoneId"
            control={control}
            rules={{ required: "Zone is required." }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select Zone"
                  options={zones}
                  className={`form-control-select ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
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
    </div>
  );
};

export default AddressDetailsForm;
