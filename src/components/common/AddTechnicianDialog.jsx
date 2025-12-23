import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Controller, useForm, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

import {
  cities,
  state,
  getState,
  getCityId,
} from "../../../services/masterServices";
import { addTechnician } from "../../../services/assignServiceProvider";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const AddTechnicianDialog = ({
  visible,
  onHide,
  subServiceId,
  aspId,
  nearASPRefetch,
}) => {
  const defaultValues = {
    name: "",
    code: "",
    latitude: "",
    longitude: "",
    cityId: "",
    address: "",
    contactNumber: "",
    state: "",
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

  const [cityList, setCityList] = useState([]);
  const { mutate: cityListMutatue, data: CityData } = useMutation(cities);

  const selectedState = useWatch({
    control,
    name: "state",
  });
  const { data: stateList = [] } = useQuery(
    ["stateList"],
    () => state({ search: event?.query, apiType: "dropdown" }),
    {
      enabled: visible,
    }
  );

  const handleCitySearch = (event) => {
    // console.log('City ** ', event, selectedState)
    cityListMutatue(
      {
        stateId: selectedState.id,
        search: event?.query,
        apiType: "dropdown",
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            // console.log("city list", res?.data?.data);
            setCityList(res?.data?.data);
          } else {
            setCityList([{ name: "No city found" }]);
          }
        },
      }
    );
  };

  const { mutate: addTechnicianMutatue, isLoading } =
    useMutation(addTechnician);

  const {
    suggestions,
    setValue: setSearchValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // Restrict to places within India
      componentRestrictions: { country: "IN" },
      strictBounds: false,
    },
  });

  const { mutate: stateMutate } = useMutation(getState);
  const { mutate: cityIdMutate } = useMutation(getCityId);
  const [dropDownCityList, setDropDownCityList] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleSearch = (event) => {
    setSearchValue(event.query);
  };

  const handleLocationSelect = (value) => {
    getGeocode({
      address: value?.value?.description,
    }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      setValue("latitude", lat);
      setValue("longitude", lng);

      // Extract the state code from geocode results
      const addressComponents = results[0]?.address_components;
      const stateComponent = addressComponents.find((component) =>
        component.types.includes("administrative_area_level_1")
      );

      // Prefill the state dropdown value based on the geocode state
      stateMutate(
        {
          code: stateComponent?.short_name,
        },
        {
          onSuccess: (res) => {
            if (res?.data?.success) {
              const stateFromList = stateList?.data?.data.find(
                (state) => state.id === res.data.data.id
              );
              if (stateFromList) {
                setValue("state", stateFromList);
              }
            }
          },
        }
      );

      const pinCodeComponent = addressComponents.find((component) =>
        component.types.includes("postal_code")
      );
      const districtComponent = addressComponents.find((component) =>
        component.types.includes("administrative_area_level_2")
      );

      const cityFetchApiParams = {
        pinCode: null,
        district: null,
        state: null,
      };

      if (pinCodeComponent?.long_name) {
        cityFetchApiParams.pinCode = pinCodeComponent.long_name;
      } else {
        if (districtComponent?.long_name) {
          cityFetchApiParams.district = districtComponent.long_name;
        }

        if (stateComponent?.short_name) {
          cityFetchApiParams.state = stateComponent.short_name;
        }
      }

      cityIdMutate(cityFetchApiParams, {
        onSuccess: (res) => {
          if (res?.data?.success) {
            setShowCityDropdown(true);
            setDropDownCityList(res.data.data);
          } else {
            setShowCityDropdown(false);
            setDropDownCityList([]);
          }
        },
      });
    });
  };

  const onTechnicianDialogSubmit = (formData) => {
    //console.log("technician Form Data:", formData, subServiceId);
    const { state, location, latitude, longitude, ...restOfFormData } =
      formData;
    addTechnicianMutatue(
      {
        ...restOfFormData,
        cityId: formData?.cityId?.id,
        subServiceIds: [subServiceId],
        aspId: aspId,
        latitude: String(latitude),
        longitude: String(longitude),
        address: location?.description || null,
      },
      {
        onSuccess: (res) => {
          // console.log("response tech", res);
          if (res?.data?.success) {
            onHide();
            nearASPRefetch();
            reset();
            toast.success(res?.data?.message);
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  return (
    <Dialog
      header="Add Technician"
      visible={visible}
      onHide={onHide}
      style={{ width: "566px" }}
    >
      <form onSubmit={handleSubmit(onTechnicianDialogSubmit)}>
        <div className="row row-gap-3_4">
          <div className="col-md-6">
            <div className="form-group">
              <div className="p-field">
                <label className="form-label required">Name</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <InputText
                      id="name"
                      {...field}
                      placeholder="Enter Name"
                      className={errors.name ? "p-invalid" : ""}
                    />
                  )}
                />
                {errors.name && (
                  <div className="p-error">{errors.name.message}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <div className="p-field">
                <label className="form-label required">Code</label>
                <Controller
                  name="code"
                  control={control}
                  rules={{ required: "Code is required" }}
                  render={({ field }) => (
                    <InputText
                      id="code"
                      placeholder="Enter Code"
                      {...field}
                      className={errors.code ? "p-invalid" : ""}
                    />
                  )}
                />
                {errors.code && (
                  <div className="p-error">{errors.code.message}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <div className="p-field">
                <label className="form-label required">Contact Number</label>
                <Controller
                  name="contactNumber"
                  control={control}
                  rules={{
                    required: "Contact Number is required",
                    validate: {
                      matchPattern: (v) =>
                        /^([+]\d{2})?\d{10}$/.test(v) ||
                        "Contact number must be a valid number",
                    },
                  }}
                  render={({ field }) => (
                    <InputText
                      placeholder="Enter Contact Number"
                      id="contact"
                      maxLength={10}
                      keyfilter="int"
                      {...field}
                      className={errors.contact ? "p-invalid" : ""}
                    />
                  )}
                />
                {errors.contactNumber && (
                  <div className="p-error">{errors.contactNumber.message}</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <div className="p-field">
                <label className="form-label required">Location</label>
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Location is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <AutoComplete
                        value={field.value}
                        suggestions={suggestions?.data}
                        completeMethod={handleSearch}
                        field="description"
                        itemTemplate={(option) => {
                          return <div>{option.description}</div>;
                        }}
                        onChange={(e) => {
                          field.onChange(e.value);
                          setValue("latitude", "");
                          setValue("longitude", "");
                          setValue("state", "");
                          setValue("cityId", null);
                          setShowCityDropdown(false);
                        }}
                        placeholder="Search Location"
                        onSelect={(e) => handleLocationSelect(e)}
                      />

                      <div className="p-error">
                        {/* {errors[field.name]?.message} */}
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <div className="p-field">
                <label className="form-label required">Latitude</label>
                <Controller
                  name="latitude"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Latitude is required" }}
                  render={({ field }) => (
                    <InputText
                      placeholder="Enter Latitude"
                      id="latitude"
                      keyfilter="pnum"
                      {...field}
                      className={
                        errors.latitude
                          ? "p-invalid form-control"
                          : "form-control"
                      }
                      disabled={true}
                    />
                  )}
                />
                {errors.latitude && (
                  <div className="p-error">{errors.latitude.message}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <div className="p-field">
                <label className="form-label required">Longitude</label>
                <Controller
                  name="longitude"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Longitude is required" }}
                  render={({ field }) => (
                    <InputText
                      placeholder="Enter Longitude"
                      id="longitude"
                      keyfilter="pnum"
                      {...field}
                      className={
                        errors.longitude
                          ? "p-invalid form-control"
                          : "form-control"
                      }
                      disabled={true}
                    />
                  )}
                />
                {errors.longitude && (
                  <div className="p-error">{errors.longitude.message}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <div className="p-field">
                <label className="form-label required">State</label>
                <Controller
                  name="state"
                  control={control}
                  rules={{ required: "State is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        placeholder="Enter State"
                        options={stateList?.data?.data}
                        optionLabel="name"
                        onChange={(e) => {
                          field.onChange(e.value);
                          setValue("cityId", null);
                        }}
                        disabled={true}
                      />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          {!showCityDropdown && (
            <div className="col-md-6">
              <div className="form-group">
                <div className="p-field">
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
                          completeMethod={handleCitySearch}
                          className="form-control-select"
                          placeholder="Enter City Name"
                          disabled={selectedState.id ? false : true}
                          pt={{
                            list: {
                              className: `${
                                CityData?.data?.success ? "" : "empty-state"
                              }`,
                            },
                          }}
                        />

                        <div className="p-error">
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {showCityDropdown && (
            <div className="col-md-6">
              <div className="form-group">
                <div className="p-field">
                  <label className="form-label required">City</label>
                  <Controller
                    name="cityId"
                    control={control}
                    rules={{ required: "City is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          filter
                          placeholder="Select City"
                          options={dropDownCityList}
                          optionLabel="name"
                          onChange={(e) => {
                            field.onChange(e.value);
                          }}
                          disabled={selectedState.id ? false : true}
                        />
                        <div className="p-error">
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* <div className="col-md-12">
            <div className="form-group">
              <div className="p-field">
                <label className="form-label required">Address</label>
                <Controller
                  name="address"
                  control={control}
                  className="form-control"
                  rules={{ required: "Address is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextarea
                        {...field}
                        placeholder="Enter Address"
                        rows={3}
                        className="form-control"
                      />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
          </div> */}
          <div className="">
            <Button
              className="form-submit-btn mt-2"
              type="submit"
              loading={isLoading}
            >
              Confirm
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default AddTechnicianDialog;
