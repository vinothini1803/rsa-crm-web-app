import React, { useState, useRef, useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import {
  CloseIcon,
  ImageFile,
  ProfileUrl,
  UsersIcon,
} from "../../../utills/imgConstants";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { MultiSelect } from "primereact/multiselect";
import { useMutation, useQuery } from "react-query";
import { FileUpload } from "primereact/fileupload";
import { toast } from "react-toastify";
import {
  aspList,
  mechanicsFormData,
  saveMechanic,
} from "../../../../services/adminService";
import { cities } from "../../../../services/masterServices";

const MechanicForm = () => {
  const defaultValues = {
    aspTypeId: "coco",
    locationCapturedViaId: undefined,
    dynamicTypeId: undefined,
    cocoVehicleId: undefined,
    aspId: "",
    name: "",
    code: "",
    email: "",
    contactNumber: "",
    alternateContactNumber: "",
    latitude: "",
    longitude: "",
    performanceId: "",
    priorityId: "",
    status: 1,
    address: "",
    stateId: "",
    cityId: "",
    userName: "",
    password: "",
    changePassword: undefined,
    serviceIds: undefined,
    subServiceIds: undefined,
  };
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    reset,
    resetField,
    clearErrors,
  } = useForm({ defaultValues });

  const navigate = useNavigate();
  const { mechanicID } = useParams();
  const [cityQuery, setCityQuery] = useState();
  const [cityList, setCityList] = useState([]);
  const isInitialLoad = useRef(true);
  const initialSubServiceIds = useRef(null);
  const selectedASPType = useWatch({ control: control, name: "aspTypeId" });
  const selectedLocationCaptureVia = useWatch({
    control: control,
    name: "locationCapturedViaId",
  });
  const selectedState = useWatch({ control: control, name: "stateId" });
  const selectedCity = useWatch({ control: control, name: "cityId" });
  const selectedChangePassword = useWatch({
    control: control,
    name: "changePassword",
  });
  const selectedServiceIds = useWatch({
    control: control,
    name: "serviceIds",
  });
  // console.log("mechanicID", mechanicID);

  // Breadcrumbs Items
  const MenuItems = [
    {
      label: <div onClick={() => navigate("/admin/mechanics")}>Mechanics</div>,
    },
    { label: <div>{mechanicID ? "Edit" : "Add"} Mechanic</div> },
  ];

  // Handle close - to return back
  const handleClose = () => {
    navigate("/admin/mechanics");
    reset(defaultValues);
  };

  // Validate Uppercase Func
  const validateUppercase = (value) => {
    return (
      /[A-Z]/.test(value) ||
      "Password must contain at least one uppercase letter"
    );
  };
  // Validate Lowercase Func
  const validateLowercase = (value) => {
    return (
      /[a-z]/.test(value) ||
      "Password must contain at least one lowercase letter"
    );
  };
  // Validate Special Charc Func
  const validateSpecialCharacter = (value) => {
    return (
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value) ||
      "Password must contain at least one special character"
    );
  };

  // Get ASP Dropdown API
  const { data: aspOptions } = useQuery(
    ["getASPOptions"],
    () =>
      aspList({
        apiType: "dropdown",
        filterThirdParty: 1,
      }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        // console.log('aspOptions =>', res?.data?.data);
        if (!res?.data?.success) {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    }
  );

  // Get City Dropdown API
  const { data: cityOptions, refetch: cityRefetch } = useQuery(
    ["getCityOptions", selectedState, cityQuery],
    () =>
      cities({
        stateId: selectedState,
        apiType: "dropdown",
        ...(cityQuery && { search: cityQuery }),
      }),
    {
      refetchOnWindowFocus: false,
      enabled: selectedState ? true : false,
      onSuccess: (res) => {
        // console.log("cityOptions =>", res?.data?.data);
        if (res?.data?.success) {
          // console.log("city data List", res);
          setCityList(res?.data?.data);
        } else {
          setCityList([{ name: "No data found" }]);
        }
      },
    }
  );

  // console.log("cityId =>", selectedCity);

  // Get Form Data API
  const { data: formData } = useQuery(
    ["getMechanicFormData", mechanicID],
    () => mechanicsFormData({ aspMechanicId: mechanicID ?? "" }),
    {
      enabled: aspOptions?.data?.success ? true : false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          // console.log("Mechanic Form Data =>", res?.data?.data);
          if (mechanicID) {
            setValue("aspTypeId", res?.data?.data?.aspMechanicData?.aspTypeId);
            if (
              res?.data?.data?.aspMechanicData?.aspTypeId == 771 &&
              res?.data?.data?.aspMechanicData?.locationCapturedViaId
            ) {
              setValue(
                "locationCapturedViaId",
                res?.data?.data?.aspMechanicData?.locationCapturedViaId
              );
              if (
                res?.data?.data?.aspMechanicData?.locationCapturedViaId ==
                  782 &&
                res?.data?.data?.aspMechanicData?.dynamicTypeId
              ) {
                setValue(
                  "dynamicTypeId",
                  res?.data?.data?.aspMechanicData?.dynamicTypeId == 792 ? 0 : 1
                );
              }
              if (res?.data?.data?.aspMechanicData?.cocoVehicleId) {
                setValue(
                  "cocoVehicleId",
                  res?.data?.data?.aspMechanicData?.cocoVehicleId
                );
              }
            } else if (res?.data?.data?.aspMechanicData?.aspTypeId == 772) {
              setValue(
                "aspId",
                aspOptions?.data?.data?.some(
                  (asp) => asp?.id == res?.data?.data?.aspMechanicData?.aspId
                )
                  ? res?.data?.data?.aspMechanicData?.aspId
                  : undefined
              );
            }

            setValue(
              "name",
              res?.data?.data?.aspMechanicData?.name || undefined
            );
            setValue(
              "code",
              res?.data?.data?.aspMechanicData?.code || undefined
            );
            setValue(
              "email",
              res?.data?.data?.aspMechanicData?.email || undefined
            );
            setValue(
              "contactNumber",
              res?.data?.data?.aspMechanicData?.contactNumber || undefined
            );
            setValue(
              "alternateContactNumber",
              res?.data?.data?.aspMechanicData?.alternateContactNumber ||
                undefined
            );
            setValue(
              "latitude",
              res?.data?.data?.aspMechanicData?.latitude || undefined
            );
            setValue(
              "longitude",
              res?.data?.data?.aspMechanicData?.longitude || undefined
            );
            setValue(
              "performanceId",
              res?.data?.data?.aspMechanicData?.performanceId
            );
            setValue(
              "priorityId",
              res?.data?.data?.aspMechanicData?.priorityId
            );
            setValue("status", res?.data?.data?.aspMechanicData?.status);
            setValue(
              "address",
              res?.data?.data?.aspMechanicData?.address || undefined
            );
            setValue(
              "stateId",
              res?.data?.data?.aspMechanicData?.city?.stateId || undefined
            );
            setCityQuery(res?.data?.data?.aspMechanicData?.city?.name);
            // cityRefetch().then((response) => {
            //   console.log('City Refetch =>', response?.data?.data);
            //   setValue("cityId", response?.data?.data?.data?.some((city)=> city?.id == res?.data?.data?.aspMechanicData?.cityId) ? response?.data?.data?.data?.find((item)=>item?.id == res?.data?.data?.aspMechanicData?.cityId)  : undefined);
            // })
            setValue(
              "cityId",
              res?.data?.data?.aspMechanicData?.city || undefined
            );
            setValue(
              "userName",
              res?.data?.data?.aspMechanicData?.userName || undefined
            );
            setValue("changePassword", 0);
            const selectedSubServices = res?.data?.data?.extras?.subServices?.filter((item) =>
              res?.data?.data?.aspMechanicData?.aspMechanicSubServices?.some(
                (service) => service?.subServiceId == item?.id
              )
            ) || undefined;
            setValue("subServiceIds", selectedSubServices);
            
            // Store initial sub-service IDs to track what was actually saved
            if (selectedSubServices && selectedSubServices.length > 0) {
              initialSubServiceIds.current = selectedSubServices.map((sub) => sub?.id);
            }
            
            // Don't pre-select services - service dropdown is only for filtering/auto-selection purposes
            // Mark initial load as complete after a short delay to allow all values to be set
            setTimeout(() => {
              isInitialLoad.current = false;
            }, 100);
            // console.log("subServiceIds =>");
          } else {
            setValue("aspTypeId", 771);
            setValue("locationCapturedViaId", 781);
            // Mark initial load as complete for add mode
            setTimeout(() => {
              isInitialLoad.current = false;
            }, 100);
          }
        }
      },
    }
  );

  // Save Mechanic
  const { mutate: mechanicMutate, isLoading: mechanicLoading } = useMutation(
    saveMechanic,
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          navigate("/admin/mechanics");
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

  // Handle Autocomplete
  const handleCityChange = (event) => {
    setCityQuery(event.query);
  };

  // Auto-select/deselect sub-services when services are selected/deselected
  useEffect(() => {
    // Skip auto-selection during initial load to preserve manually deselected items
    if (isInitialLoad.current || !formData?.data?.data?.extras?.subServices) {
      return;
    }
    
    const allSubServices = formData.data.data.extras.subServices;
    const currentSubServices = getValues("subServiceIds") || [];
    
    // If no services selected, clear all sub-services
    if (!selectedServiceIds || selectedServiceIds.length === 0) {
      setValue("subServiceIds", []);
      return;
    }
    
    // Create Set of selected service IDs for O(1) lookup
    const selectedServiceIdSet = new Set(
      selectedServiceIds.map((service) => service?.id).filter(Boolean)
    );
    
    // Helper function to extract service ID from sub-service
    const getSubServiceId = (subService) => 
      subService?.service?.id || subService?.Service?.id || subService?.serviceId;
    
    // Get all sub-services that belong to selected services
    const subServicesForSelectedServices = allSubServices.filter((subService) => {
      const serviceId = getSubServiceId(subService);
      return serviceId && selectedServiceIdSet.has(serviceId);
    });
    
    // Create Set of current sub-service IDs for O(1) lookup
    const currentSubServiceIdSet = new Set(
      currentSubServices.map((sub) => sub?.id).filter(Boolean)
    );
    
    // Keep existing sub-services that belong to selected services, and add new ones
    const existingValidSubServices = currentSubServices.filter((subService) => {
      const serviceId = getSubServiceId(subService);
      return serviceId && selectedServiceIdSet.has(serviceId);
    });
    
    // Add new sub-services from selected services that aren't already selected
    const newSubServices = subServicesForSelectedServices.filter(
      (subService) => !currentSubServiceIdSet.has(subService?.id)
    );
    
    // Merge existing valid selections with new ones
    const mergedSubServices = [...existingValidSubServices, ...newSubServices];
    
    // Only update if there's a change
    const currentIds = new Set(currentSubServices.map((s) => s?.id).filter(Boolean));
    const newIds = new Set(mergedSubServices.map((s) => s?.id).filter(Boolean));
    
    if (currentIds.size !== newIds.size || 
        [...currentIds].some((id) => !newIds.has(id))) {
      setValue("subServiceIds", mergedSubServices);
    }
  }, [selectedServiceIds, formData?.data?.data?.extras?.subServices, setValue, getValues]);

  useEffect(() => {
    if (selectedASPType == 771) {
      resetField("aspId");
    } else {
      resetField("locationCapturedViaId");
      resetField("dynamicTypeId");
      clearErrors("latitude");
      clearErrors("longitude");
    }
  }, [selectedASPType]);

  const onFormSubmit = (values) => {
    // console.log("user form value", values);

    const formValues = {
      ...values,
      cityId: values?.cityId?.id,
      changePassword: mechanicID ? values?.changePassword : null,
      aspId: values?.aspTypeId == 772 ? values?.aspId : null,
      locationCapturedViaId:
        values?.aspTypeId == 771 ? values?.locationCapturedViaId : null,
      dynamicTypeId:
        values?.aspTypeId == 771 && values?.locationCapturedViaId == 782
          ? values?.dynamicTypeId == 1
            ? 791
            : 792
          : null,
      aspMechanicId: mechanicID ? mechanicID : null,
      userId: mechanicID ? formData?.data?.data?.aspMechanicData?.userId : null,
      subServiceIds: values?.subServiceIds?.map(
        (subServiceId) => subServiceId?.id
      ),
    };
    delete formValues?.stateId;
    delete formValues?.serviceIds; // Service field is for filtering only, not saved
    // console.log("Form Values => ", formValues);
    mechanicMutate(formValues);
  };
  // console.log("errors[field.locationCapturedViaId] ", errors);
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img className="img-fluid" src={UsersIcon} alt="Title Icon" />
                </div>
                <div>
                  <h5 className="page-content-title">
                    {mechanicID ? "Edit" : "New"} Mechanic
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
            <form onSubmit={handleSubmit(onFormSubmit)} id="userform">
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group radio-form-group">
                    <label className="form-label required">ASP Type</label>
                    <Controller
                      name="aspTypeId"
                      control={control}
                      rules={{ required: "ASP Type is required" }}
                      render={({ field, fieldState }) => (
                        <div className="common-radio-group">
                          {formData?.data?.data?.extras?.aspType?.map(
                            (item, i) => (
                              <div className="common-radio-item" key={i}>
                                <RadioButton
                                  inputId={`radioASP_${i}`}
                                  {...field}
                                  value={item?.id}
                                  checked={field?.value == item?.id}
                                />
                                <label
                                  htmlFor={`radioASP_${i}`}
                                  className="common-radio-label"
                                >
                                  {item?.name}
                                </label>
                              </div>
                            )
                          )}
                          {/* <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_yes"
                              {...field}
                              value={"coco"}
                              checked={field.value == "coco"}
                            />
                            <label
                              htmlFor="radio_yes"
                              className="common-radio-label"
                            >
                              COCO
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_no"
                              {...field}
                              value={"3rdParty"}
                              checked={field.value == "3rdParty"}
                            />
                            <label
                              htmlFor="radio_no"
                              className="common-radio-label"
                            >
                              3rd Party
                            </label>
                          </div> */}
                        </div>
                      )}
                    />
                  </div>
                </div>
                {selectedASPType == 771 ? (
                  <>
                    <div className="col-md-3">
                      <div className="form-group radio-form-group">
                        <label className="form-label required">
                          Location Capture Via
                        </label>
                        <Controller
                          name="locationCapturedViaId"
                          control={control}
                          rules={{
                            required: "Location Capture Via is required",
                          }}
                          render={({ field, fieldState }) => (
                            <>
                              <div className="common-radio-group">
                                {formData?.data?.data?.extras?.locationCapturedVia?.map(
                                  (item, i) => (
                                    <div className="common-radio-item" key={i}>
                                      <RadioButton
                                        inputId={`radioLocation_${i}`}
                                        {...field}
                                        value={item?.id}
                                        checked={field?.value == item?.id}
                                      />
                                      <label
                                        htmlFor={`radioLocation_${i}`}
                                        className="common-radio-label"
                                      >
                                        {item?.name}
                                      </label>
                                    </div>
                                  )
                                )}
                                <div className="p-error">
                                  {errors &&
                                    errors?.locationCapturedViaId?.message}
                                </div>
                                {/* <div className="common-radio-item">
                                <RadioButton
                                  inputId="radioStationary"
                                  {...field}
                                  value={1}
                                  checked={field.value == 1}
                                />
                                <label
                                  htmlFor="radioStationary"
                                  className="common-radio-label"
                                >
                                  Stationary
                                </label>
                              </div>
                              <div className="common-radio-item">
                                <RadioButton
                                  inputId="radioDynamic"
                                  {...field}
                                  value={0}
                                  checked={field.value == 0}
                                />
                                <label
                                  htmlFor="radioDynamic"
                                  className="common-radio-label"
                                >
                                  Dynamic
                                </label>
                              </div> */}
                              </div>
                            </>
                          )}
                        />
                      </div>
                    </div>
                    {selectedLocationCaptureVia == 782 && (
                      <div className="col-md-3">
                        <div className="form-group radio-form-group">
                          <label className="form-label required">
                            Dynamic Type
                          </label>
                          <Controller
                            name="dynamicTypeId"
                            control={control}
                            rules={{
                              required: "Dynamic Type is required",
                            }}
                            render={({ field, fieldState }) => (
                              <>
                                <div className="common-radio-group">
                                  <div className="common-radio-item">
                                    <RadioButton
                                      inputId="radioMobile"
                                      {...field}
                                      value={1}
                                      checked={field.value == 1}
                                    />
                                    <label
                                      htmlFor="radioMobile"
                                      className="common-radio-label"
                                    >
                                      Mobile
                                    </label>
                                  </div>
                                  <div className="common-radio-item">
                                    <RadioButton
                                      inputId="radioGPS"
                                      {...field}
                                      value={0}
                                      checked={field.value == 0}
                                    />
                                    <label
                                      htmlFor="radioGPS"
                                      className="common-radio-label"
                                    >
                                      GPS
                                    </label>
                                  </div>
                                </div>
                                <div className="p-error">
                                  {errors && errors?.dynamicTypeId?.message}
                                </div>
                              </>
                            )}
                          />
                        </div>
                      </div>
                    )}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-label required">
                          COCO Vehicle
                        </label>
                        <Controller
                          name="cocoVehicleId"
                          control={control}
                          rules={{
                            required:
                              selectedASPType == 771
                                ? "COCO Vehicle is required"
                                : false,
                          }}
                          render={({ field, fieldState }) => (
                            <>
                              <Dropdown
                                value={field.value}
                                filter
                                placeholder="Select COCO Vehicle"
                                className="form-control-select"
                                options={formData?.data?.data?.extras?.cocoVehicles?.map(
                                  (item) => ({
                                    id: item?.id,
                                    name: item?.vehicleRegistrationNumber,
                                  })
                                )}
                                optionLabel="name"
                                optionValue="id"
                                onChange={(e) => {
                                  field.onChange(e.value);
                                }}
                                resetFilterOnHide={true}
                              />
                              <div className="p-error">
                                {errors && errors[field.name]?.message}
                              </div>
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label required">ASP</label>
                      <Controller
                        name="aspId"
                        control={control}
                        rules={{ required: "ASP is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              value={field.value}
                              filter
                              placeholder="Select"
                              className="form-control-select"
                              options={aspOptions?.data?.data?.map((item) => ({
                                id: item?.id,
                                name: item?.code + " - " + item?.workshopName,
                              }))}
                              optionLabel="name"
                              optionValue="id"
                              onChange={(e) => {
                                field.onChange(e.value);
                              }}
                              resetFilterOnHide={true}
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
                )}

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Name</label>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "Name is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText {...field} placeholder="Enter Name" />
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
                    <label className="form-label required">Code</label>
                    <Controller
                      name="code"
                      control={control}
                      rules={{ required: "Code is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            className="form-control"
                            placeholder="Enter Code"
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
                    <label className="form-label">Email</label>
                    <Controller
                      name="email"
                      control={control}
                      // rules={{
                      //   required: "Email ID is required.",
                      //   validate: {
                      //     matchPattern: (v) =>
                      //       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                      //         v
                      //       ) || "Email address must be a valid address",
                      //   },
                      // }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            className="form-control"
                            value={field.value}
                            placeholder="Enter Email"
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
                    <label className="form-label required">
                      Contact Number
                    </label>
                    <Controller
                      name="contactNumber"
                      control={control}
                      rules={{
                        required: "Contact Number is required.",

                        validate: {
                          matchPattern: (v) =>
                            /^([+]\d{2})?\d{10}$/.test(v) ||
                            "Contact Number must be a valid number",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter Contact Number"
                            maxLength={10}
                            keyfilter={"pnum"}
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
                    <label className="form-label">
                      Alternate Contact Number
                    </label>
                    <Controller
                      name="alternateContactNumber"
                      control={control}
                      // rules={{
                      //   // required: "Alternate Contact Number is required.",
                      //   validate: {
                      //     matchPattern: (v) =>
                      //       /^([+]\d{2})?\d{10}$/.test(v) ||
                      //       "Contact Number must be a valid number",
                      //   },
                      // }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter Alternate Contact Number"
                            className="form-control"
                            maxLength={10}
                            keyfilter={"pnum"}
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
                    <label
                      className={
                        selectedASPType == 771
                          ? "form-label required"
                          : "form-label"
                      }
                    >
                      Latitude
                    </label>
                    <Controller
                      name="latitude"
                      control={control}
                      {...(selectedASPType == 771
                        ? { rules: { required: "Latitude is required" } }
                        : { rules: { required: false } })}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            className="form-control"
                            placeholder="Enter Latitude"
                          />
                          {/* <div className="p-error"> */}
                          {/* {errors[field.name]?.message} */}
                          {/* {errors && errors[field.latitude]?.message}
                          </div> */}
                          {fieldState.error && (
                            <div className="p-error">
                              {fieldState.error.message}
                            </div>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label
                      className={
                        selectedASPType == 771
                          ? "form-label required"
                          : "form-label"
                      }
                    >
                      Longitude
                    </label>
                    <Controller
                      name="longitude"
                      control={control}
                      {...(selectedASPType == 771
                        ? { rules: { required: "Longitude is required" } }
                        : { rules: { required: false } })}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            className="form-control"
                            placeholder="Enter Longitude"
                          />
                          <div className="p-error">
                            {fieldState.error && (
                              <div className="p-error">
                                {fieldState.error.message}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Performance</label>
                    <Controller
                      name="performanceId"
                      control={control}
                      rules={{ required: "Performance is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select"
                            className="form-control-select"
                            options={
                              formData?.data?.data?.extras?.performance || []
                            }
                            optionLabel="name"
                            optionValue="id"
                            onChange={(e) => {
                              field.onChange(e.value);
                            }}
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
                    <label className="form-label required">Priority</label>
                    <Controller
                      name="priorityId"
                      control={control}
                      rules={{ required: "Priority is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select"
                            className="form-control-select"
                            options={
                              formData?.data?.data?.extras?.priority || []
                            }
                            optionLabel="name"
                            optionValue="id"
                            onChange={(e) => {
                              field.onChange(e.value);
                            }}
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
                  <div className="form-group radio-form-group">
                    <label className="form-label required">Status</label>
                    <Controller
                      name="status"
                      control={control}
                      rules={{ required: "Status is required" }}
                      render={({ field, fieldState }) => (
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_yes"
                              {...field}
                              value={1}
                              checked={field.value == 1}
                            />
                            <label
                              htmlFor="radio_yes"
                              className="common-radio-label"
                            >
                              Active
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_no"
                              {...field}
                              value={0}
                              checked={field.value == 0}
                            />
                            <label
                              htmlFor="radio_no"
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
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">Address</label>
                    <Controller
                      name="address"
                      control={control}
                      rules={{ required: "Address is required" }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputTextarea
                            {...field}
                            className="form-control"
                            value={field.value}
                            placeholder="Enter address"
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
                            placeholder="Select"
                            className="form-control-select"
                            options={formData?.data?.data?.extras?.states}
                            optionLabel="name"
                            optionValue="id"
                            onChange={(e) => {
                              field.onChange(e.value);
                            }}
                            filter
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
                                className: `${
                                  cityOptions?.data?.success
                                    ? ""
                                    : "empty-state"
                                }`,
                              },
                            }}
                          />
                          {/* <Dropdown
                            value={field.value}
                            placeholder="Select"
                            className="form-control-select"
                            options={selectedState ? cityOptions?.data?.data?.rows : []}
                            optionLabel="name"
                            optionValue="id"
                            onChange={(e) => {
                              field.onChange(e.value);
                            }}
                            filter
                          /> */}
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
                    <label className="form-label required">Username</label>
                    <Controller
                      name={`userName`}
                      control={control}
                      rules={{ required: "Username is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter Username"
                            className={`form-control ${
                              fieldState.error ? "p-invalid" : ""
                            }`}
                            keyfilter={"pnum"}
                            autoComplete="off"
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                {mechanicID && (
                  <div className="col-md-3">
                    <div className="form-group radio-form-group">
                      <label className="form-label required">
                        Change Password
                      </label>
                      <Controller
                        name={`changePassword`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <div className="common-radio-group">
                            <div className="common-radio-item">
                              <RadioButton
                                inputId="radioChangeYes"
                                {...field}
                                value={1}
                                checked={field.value === 1}
                                onChange={(e) => {
                                  // handlePasswordChange(index, 1);
                                  field.onChange(e.value);
                                }} // Set value to 1 for 'Yes'
                              />
                              <label
                                htmlFor="radioChangeYes"
                                className="common-radio-label"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="common-radio-item">
                              <RadioButton
                                inputId="radioChangeNo"
                                {...field}
                                value={0}
                                checked={field.value === 0}
                                onChange={(e) => {
                                  // handlePasswordChange(index, 0);
                                  field.onChange(e.value);
                                }} // Set value to 0 for 'No'
                              />
                              <label
                                htmlFor="radioChangeNo"
                                className="common-radio-label"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )}
                {mechanicID == undefined || selectedChangePassword == 1 ? (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label required">Password</label>
                      <Controller
                        name={`password`}
                        control={control}
                        rules={{
                          required: "Password is required.",
                          minLength: {
                            // value: 12,
                            // message: "Password must have at least 12 characters",
                            value: 3,
                            message: "Password must have at least 3 characters",
                          },
                          validate: {
                            // validateUppercase,
                            // validateSpecialCharacter,
                            // validateLowercase,
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            {/* <InputText
                              placeholder="Enter Password"
                              autoComplete="off"
                              {...field}
                              className={`form-control ${
                                fieldState.error ? "p-invalid" : ""
                              }`}
                            /> */}
                            <Password
                              toggleMask
                              className={`${
                                fieldState.error ? "p-invalid" : ""
                              }`}
                              feedback={false}
                              placeholder="Enter Password"
                              autoComplete="new-password"
                              {...field}
                            />
                            <div className="p-error">
                              {errors && errors[field.name]?.message}
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Service</label>
                    <Controller
                      name="serviceIds"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <MultiSelect
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            options={formData?.data?.data?.extras?.services}
                            optionLabel="name"
                            placeholder="Select Service"
                            maxSelectedLabels={3}
                            className="form-control-select"
                            removeIcon={(options) => (
                              <img src={CloseIcon} {...options.iconProps} />
                            )}
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
                    <label className="form-label required">Sub Services</label>
                    <Controller
                      name={`subServiceIds`}
                      control={control}
                      rules={{ required: "Sub Services is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <MultiSelect
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            options={formData?.data?.data?.extras?.subServices}
                            optionLabel="name"
                            filter
                            filterPlaceholder="Search Sub Services"
                            // display="chip"
                            placeholder="Select Sub Services"
                            maxSelectedLabels={3}
                            className="form-control-select"
                            removeIcon={(options) => (
                              <img src={CloseIcon} {...options.iconProps} />
                            )}
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
            </form>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center">
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary"
                  type="submit"
                  form="userform" //to intiaite form submission
                  loading={mechanicLoading}
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

export default MechanicForm;
