import React, { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { useQueries } from "react-query";
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";

import { CloseIcon } from "../../utills/imgConstants";
import { client, subService } from "../../../services/masterServices";
import { InputNumber } from "primereact/inputnumber";

const SearchBar = ({ OnSearch, clearMarkers }) => {
  const defaultValues = {
    type: "",
    location: "",
    subservice: "",
    client: "",
    kmRadius: null,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues,
  });

  const watchedValues = useWatch({ control });

  const type = useWatch({
    control,
    name: "type",
  });

  const [clients, subServices] = useQueries([
    {
      queryKey: ["clients"],
      queryFn: () =>
        client({
          apiType: "dropdown",
        }),
    },
    {
      queryKey: ["subServices"],
      queryFn: () => subService({ apiType: "dropdown" }),
    },
  ]);

  useEffect(() => {
    clearMarkers();
  }, [watchedValues]);

  const handleClear = () => {
    reset(defaultValues);
    clearMarkers();
  };

  // console.log("Cleints and subservices", clients, subServices);

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit(OnSearch)} id="mapSearch">
        <div className="search-wrap">
          <div className="field-border">
            <div className="form-group search-columns">
              <Controller
                name="type"
                control={control}
                rules={{ required: "Type is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      className="input-design"
                      value={field.value}
                      placeholder="Select Type"
                      options={[
                        { label: "ASP", value: "ASP" },
                        { label: "Case", value: "Case" },
                      ]}
                      optionLabel="label"
                      onChange={(e) => {
                        field.onChange(e.value);
                        setValue("location", "");
                        setValue("subservice", "");
                        setValue("client", "");
                        setValue("kmRadius", "");
                      }}
                    />
                    <div className="p-error error-font">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
            {/* <div className="custom-divider"></div> */}
          </div>

          <div className="field-border">
            <div className="form-group search-columns">
              <Controller
                name="location"
                control={control}
                rules={{ required: "Location is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextarea
                      className="form-control input-design"
                      {...field}
                      placeholder="Enter Location"
                      rows={1} cols={34}
                    />
                    <div className="p-error error-font">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
            {/* <div className="custom-divider"></div> */}
          </div>
          
          {/* {type === "ASP" && (
            <>
              <div className="field-border">
                <div className="form-group search-columns">
                  <Controller
                    name="subservice"
                    control={control}
                    rules={{ required: "Subservice is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Sub Service"
                          className="form-control-select input-design"
                          filter
                          options={subServices?.data?.data?.data}
                          optionLabel="name"
                          onChange={(e) => {
                            field.onChange(e.value);
                          }}
                        />
                        <div className="p-error error-font">
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
                <div className="custom-divider"></div>
              </div>
            </>
          )} */}

{type === "ASP" && (
            <>
              <div className="field-border">
                <div className="form-group search-multiselect search-columns">
                  <Controller
                    name="subservice"
                    control={control}
                    className="input-design"
                    rules={{ required: "Sub Service is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <MultiSelect
                          value={field.value}
                          filter
                          onChange={(e) => field.onChange(e.value)}
                          options={subServices?.data?.data?.data}
                          optionLabel="name"
                          placeholder="Select Sub Service"
                          maxSelectedLabels={1}
                          className="custom-multiselect input-design"
                          removeIcon={(options) => (
                            <img src={CloseIcon} {...options.iconProps} />
                          )}
                        />
                        <div className="p-error error-font">
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
                {/* <div className="custom-divider"></div> */}
              </div>
            </>
          )}

       
          {type === "Case" && (
            <>
              <div className="field-border">
                <div className="form-group search-multiselect search-columns">
                  <Controller
                    name="client"
                    control={control}
                    className="input-design"
                    rules={{ required: "Client is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <MultiSelect
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          options={clients?.data?.data?.data}
                          optionLabel="name"
                          placeholder="Select Clients"
                          maxSelectedLabels={1}
                          className="custom-multiselect input-design"
                          removeIcon={(options) => (
                            <img src={CloseIcon} {...options.iconProps} />
                          )}
                        />
                        <div className="p-error error-font">
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
                {/* <div className="custom-divider"></div> */}
              </div>
            </>
          )}

          <div className="field-border">
            <div className="form-group search-columns">
              <Controller
                name="kmRadius"
                control={control}
                className="input-design"
                rules={{ required: "Km Radius is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <InputNumber
                      {...field}
                      value={field.value || null}
                      onChange={(e)=>field.onChange(e.value)}
                      //onValueChange={(e) => field.onChange(e.value)}
                      className="input-design form-control no-border"
                      placeholder="Enter KM Radius"
                      suffix={field.value ? " km" : ""}
                    />
                    <div className="p-error error-font">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
            {/* <div className="custom-divider"></div> */}
          </div>

          <div className="button-columns">
            <span>
              <Button
                className="btn btn-primary"
                type="submit"
                form="mapSearch"
                //   loading={isLoading}
              >
                Search
              </Button>
            </span>
            <span className="clear-button">
              <Button
                type="button"
                className="btn"
                label="Clear filter"
                severity="danger"
                text
                onClick={handleClear}
              />
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
