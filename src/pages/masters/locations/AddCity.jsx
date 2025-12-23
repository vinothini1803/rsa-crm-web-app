import React, { useState } from "react";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { Controller, set, useForm, useWatch } from "react-hook-form";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { useNavigate, useParams } from "react-router";

import {
  cityData,
  districtList,
  talukList,
  nearestCityList,
  saveCity,
  state,
  regions,
} from "../../../../services/masterServices";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { CloseIcon, LocationsIcon } from "../../../utills/imgConstants";

const AddCity = () => {
  const navigate = useNavigate();
  const { cityId } = useParams();
  const [districtListData, setDistrictListData] = useState([]);
  const [talukListData, setTalukListData] = useState([]);
  const [nearestCityListData, setNearestCityListData] = useState([]);

  const { mutate: districtListMutate, data: districtData } =
    useMutation(districtList);
  const { mutate: talukListMutate, data: talukData } = useMutation(talukList);
  const { mutate: nearestCityListMutate, data: nearestCityData } =
    useMutation(nearestCityList);
  const { mutate, isLoading } = useMutation(saveCity);

  const MenuItems = [
    {
      label: <div onClick={() => navigate("/master/locations")}>Location</div>,
    },
    { label: <div>{cityId ? "Edit" : "Add"} City</div> },
  ];

  const defaultValues = {
    name: "", 
    stateId: null, 
    countryId: null,
    talukId: null, 
    districtId: null, 
    pincode: "",
    latitude: "", 
    longitude: "", 
    locationTypeId: null, 
    municipalLimitId: null, 
    nearestCityId: null, 
    locationCategoryId: null, 
    rmId: null, 
    networkHeadId: null,
    customerExperienceHeadId: null, 
    commandCentreHeadId: null, 
    serviceHeadId: null, 
    boHeadId: null, 
    serviceOrganisationId: null,
    regionId: null,
    status: 1
  };

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ defaultValues });

  const countryId = useWatch({
    control,
    name: "countryId",
  });

  const stateId = useWatch({
    control,
    name: "stateId",
  });

  const { data: stateData } = useQuery(
    ["statedropdown", countryId],
    () =>
      state({
        apiType: "dropdown",
        countryId: countryId,
      }),
    {
      enabled: countryId ? true : false,
    }
  );

  const { data: regionData } = useQuery(
    ["regiondropdown", stateId],
    () =>
      regions({
        apiType: "dropdown",
        stateId: stateId,
      }),
    {
      enabled: stateId ? true : false,
    }
  );

  const { data: cityFormData } = useQuery(
    ["cityFormData"],
    () =>
      cityData({
        cityId: cityId ? cityId : '',
      }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success && cityId) {
          Object.keys(defaultValues)?.forEach((field) => {
            setValue(`${field}`, res?.data?.data?.city[field])
          });
          setValue('talukId', res?.data?.data?.city?.taluk);
          setValue('districtId', res?.data?.data?.city?.district);
          setValue('nearestCityId', res?.data?.data?.city?.nearestCity);
        } else {
          if (cityId && res?.data?.error) {
            toast.error(res?.data?.error);
          } else if (res?.data?.errors) {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    }
  );

  const handleTalukSearch = (value) => {
    talukListMutate(
      {
        apiType: "dropdown",
        search: value?.query,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            setTalukListData(res?.data?.data);
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleDistrictSearch = (value) => {
    districtListMutate(
      {
        apiType: "dropdown",
        search: value?.query,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            setDistrictListData(res?.data?.data);
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleNearestCitySearch = (value) => {
    nearestCityListMutate(
      {
        apiType: "dropdown",
        search: value?.query,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            setNearestCityListData(res?.data?.data);
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleClose = () => {
    navigate("/master/locations");
    reset(defaultValues);
  };

  const handleFormSubmit = (values) => {
    mutate(
      {
        cityId: cityId ? cityId : null,
        ...values,
        talukId: values?.talukId?.id,
        nearestCityId: values?.nearestCityId?.id,
        districtId: values?.districtId?.id,
        name: values.name.trim(),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message, {
              autoClose: 1000,
            });
            navigate("/master/locations");
            reset(defaultValues);
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img className="img-fluid" src={LocationsIcon} alt="Title Icon" />
                </div>
                <div>
                  <h5 className="page-content-title">
                    {cityId ? "Edit" : "New"} City
                  </h5>
                </div>
              </div>
              <div className="page-content-header-right">
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
          </div>
          <div className="page-content-body">
            <form onSubmit={handleSubmit(handleFormSubmit)} id="cityForm">
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">City</label>
                    <Controller
                      name="name"
                      rules={{ required: "City is required." ,
                      }}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText {...field} placeholder="Enter City name" />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Country</label>
                    <Controller
                      name="countryId"
                      control={control}
                      rules={{ required: "Country is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Country"
                            options={
                              cityFormData?.data?.data?.extras?.countries
                            }
                            optionLabel="name"
                            optionValue="id"
                            onChange={(e) => field.onChange(e.value)}
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
                            options={stateData?.data?.data}
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => {
                              field.onChange(e.value);
                              setValue("talukId", null); 
                              setValue("districtId", null);
                              setValue("regionId", null);
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
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Pincode</label>
                    <Controller
                      name="pincode"
                      rules={{
                        required: "Pincode is required.",
                        pattern: {
                          value: /^[0-9]{6}$/, // Regex for 6-digit pincode (adjust if needed)
                          message: "Pincode must be 6 digits and numeric only."
                        }
                      }}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText {...field} placeholder="Enter Pincode"
                          keyfilter="pnum" maxLength={6}/>
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <div className="p-field">
                      <label className="form-label required">Latitude</label>
                      <Controller
                        name="latitude"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Latitude is required" ,
                          pattern: {
                            value: /^-?([0-8]?[0-9]|90)(\.\d+)?$/, // Latitude regex pattern
                            message: "Latitude must be a number between -90 and 90, with at most one decimal point"
                          }

                        }}
                        
                        render={({ field }) => (
                          <InputText
                            placeholder="Enter Latitude"
                            id="latitude"
                            keyfilter="pnum"
                            {...field}
                            className={errors.latitude ? "p-invalid" : ""}
                          />
                        )}
                      />
                      {errors.latitude && (
                        <div className="p-error">{errors.latitude.message}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <div className="p-field">
                      <label className="form-label required">Longitude</label>
                      <Controller
                        name="longitude"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Longitude is required",
                          pattern: {
                            value: /^-?([0-8]?[0-9]|90)(\.\d+)?$/, // Latitude regex pattern
                            message: "Latitude must be a number between -90 and 90, with at most one decimal point"
                          } }}
                        render={({ field }) => (
                          <InputText
                            placeholder="Enter Longitude"
                            id="longitude"
                            keyfilter="pnum"
                            {...field}
                            className={errors.longitude ? "p-invalid" : ""}
                          />
                        )}
                      />
                      {errors.longitude && (
                        <div className="p-error">
                          {errors.longitude.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <div className="p-field">
                      <label className="form-label required">Taluk</label>
                      <Controller
                        name="talukId"
                        control={control}
                        rules={{ required: "Taluk is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <AutoComplete
                              inputId={field.name}
                              value={field.value}
                              field="name"
                              onChange={field.onChange}
                              inputRef={field.ref}
                              suggestions={talukListData}
                              completeMethod={handleTalukSearch}
                              className="form-control-select"
                              placeholder="Enter Taluk"
                              pt={{
                                list: {
                                  className: `${
                                    talukData?.data?.success
                                      ? ""
                                      : "empty-state"
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
                <div className="col-md-3">
                  <div className="form-group">
                    <div className="p-field">
                      <label className="form-label required">District</label>
                      <Controller
                        name="districtId"
                        control={control}
                        rules={{ required: "District is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <AutoComplete
                              inputId={field.name}
                              value={field.value}
                              field="name"
                              onChange={field.onChange}
                              inputRef={field.ref}
                              suggestions={districtListData}
                              completeMethod={handleDistrictSearch}
                              className="form-control-select"
                              placeholder="Enter District"
                              pt={{
                                list: {
                                  className: `${
                                    districtData?.data?.success
                                      ? ""
                                      : "empty-state"
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
                <div className="col-md-3">
                  <div className="form-group">
                    <div className="p-field">
                      <label className="form-label required">
                        Nearest City
                      </label>
                      <Controller
                        name="nearestCityId"
                        control={control}
                        rules={{ required: "Nearest City is required." }}
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
                              suggestions={nearestCityListData}
                              completeMethod={handleNearestCitySearch}
                              className="form-control-select"
                              placeholder="Enter Nearest City"
                              pt={{
                                list: {
                                  className: `${
                                    nearestCityData?.data?.success
                                      ? ""
                                      : "empty-state"
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
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Service Organisation</label>
                    <Controller
                      name="serviceOrganisationId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Service Organisation"
                            options={cityFormData?.data?.data?.extras?.serviceOrganisations}
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Region</label>
                    <Controller
                      name="regionId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Region"
                            options={regionData?.data?.data}
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Location Type</label>
                    <Controller
                      name="locationTypeId"
                      control={control}
                      rules={{ required: "Location Type is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Location Type"
                            options={
                              cityFormData?.data?.data?.extras?.locationTypes
                            }
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">
                      Municipal Limit
                    </label>
                    <Controller
                      name="municipalLimitId"
                      control={control}
                      rules={{ required: "Municipal Limit is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Municipal Limit"
                            options={
                              cityFormData?.data?.data?.extras?.municipleLimits
                            }
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">
                      Location Category
                    </label>
                    <Controller
                      name="locationCategoryId"
                      control={control}
                      rules={{ required: "Location Category is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Location Category"
                            options={
                              cityFormData?.data?.data?.extras
                                ?.locationCategories
                            }
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">
                      Service Regional Manager
                    </label>
                    <Controller
                      name="rmId"
                      control={control}
                      rules={{ required: "Regional Manager is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Regional Manager"
                            options={
                              cityFormData?.data?.data?.extras
                                ?.serviceRegionalManagers
                            }
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Network Head</label>
                    <Controller
                      name="networkHeadId"
                      control={control}
                      // rules={{ required: "Network Head is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Network Head"
                            options={
                              cityFormData?.data?.data?.extras?.networkHeads
                            }
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">
                      Customer Experience Head
                    </label>
                    <Controller
                      name="customerExperienceHeadId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Customer Experience Head"
                            options={
                              cityFormData?.data?.data?.extras
                                ?.customerExperienceHeads
                            }
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => field.onChange(e.value)}
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
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Command Center Head</label>
                    <Controller
                      name="commandCentreHeadId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Command Center Head"
                            options={
                              cityFormData?.data?.data?.extras
                                ?.commandCentreHeads
                            }
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Service Head</label>
                    <Controller
                      name="serviceHeadId"
                      control={control}
                      // rules={{ required: "Service Head is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Service Head"
                            options={
                              cityFormData?.data?.data?.extras?.serviceHeads
                            }
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">BO Head</label>
                    <Controller
                      name="boHeadId"
                      control={control}
                      // rules={{ required: "BO Head is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select BO Head"
                            options={cityFormData?.data?.data?.extras?.boHeads}
                            optionLabel="name"
                            optionValue="id"
                            filter
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group radio-form-group">
                    <label className="form-label">Status</label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_active"
                              {...field}
                              value={1}
                              checked={field.value == 1}
                            />
                            <label
                              htmlFor="radio_active"
                              className="common-radio-label"
                            >
                              Active
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_inactive"
                              {...field}
                              value={0}
                              checked={field.value == 0}
                            />
                            <label
                              htmlFor="radio_inactive"
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
            </form>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center">
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary"
                  type="submit"
                  form="cityForm" //to intiaite form submission
                  loading={isLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCity;
