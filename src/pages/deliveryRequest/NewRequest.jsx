import React, { useEffect, useRef, useState } from "react";
import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import { Navigate, useLocation, useNavigate } from "react-router";
import {
  CloseIcon,
  DropDownBlueIcon,
  FolderIcon,
} from "../../utills/imgConstants";
import { Dropdown } from "primereact/dropdown";
import Note from "../../components/common/Note";
import { Controller, useForm, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { CalendarTimeIcon } from "../../utills/imgConstants";
import { toast } from "react-toastify";
import CustomFileUpload from "../../components/common/CustomFileUpload";
import { useMutation, useQueries, useQuery } from "react-query";
import { AutoComplete } from "primereact/autocomplete";
import {
  cities,
  city,
  client,
  dealer,
  dealerData,
  getConfigList,
  getState,
  state,
  subService,
  subject,
  vehicleMakes,
  vehicleModal,
  vehicleScheme,
  vehicleType,
  getCityId,
} from "../../../services/masterServices";
import { Upload, createRequest } from "../../../services/createRequestService";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const NewRequest = () => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState();
  const [pickUpDealersList, setPickUpDealerList] = useState([]);
  const [DropDealersList, setDropDealerList] = useState([]);
  const [showPrevIcon, setShowPrevIcon] = useState(false);
  const [pickupState, setPickupState] = useState();
  const [dropState, setDropState] = useState();
  const [cityList, setCityList] = useState([]);
  const [dropCityList, setDropCityList] = useState([]);
  const [cityQuery, setCityQuery] = useState();
  const [pickupLatlng, setPickupLatlng] = useState();
  const [dropLatlng, setDropLatlng] = useState();
  const [areaList, setAreaList] = useState([]);
  const [areaDropList, setAreaDropList] = useState([]);
  const [showAutoCompleteDrop, setShowAutoCompleteDrop] = useState(false);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [enableLocationType, setEnableLocationType] = useState(false);

  const defaultValues = {
    vin: "",
    vehicleTypeId: "",
    vehicleMakeId: "",
    vehicleModelId: "",
    registrationNumber: "",
    // approximateVehicleValue: "",
    subjectID: "",
    deliveryRequestSubServiceId: "",
    deliveryRequestSchemeId: "",
    deliveryRequestDropDealerId: "",
    contactNameAtPickUp: "",
    contactNumberAtPickUp: "",
    contactNameAtDrop: "",
    contactNumberAtDrop: "",
    deliveryRequestPickupDate: "",
    deliveryRequestPickupTime: "",
    description: "",
    hasDocuments: false,
    locationTypeId: "",
  };
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    reset,
    resetField,
  } = useForm({ defaultValues });
  const { pathname } = useLocation();
  const hasdocuments = useWatch({
    control,
    name: "hasDocuments",
  });

  const files = useWatch({
    control,
    name: "file",
  });

  const pickupDealer = useWatch({
    control,
    name: "dealerId",
  });

  const { id: locationTypeId } = useWatch({
    control,
    name: "locationTypeId",
  });

  const pickupLocation = useWatch({
    control,
    name: "pickupLocation",
  });

  const pickupCityId = useWatch({
    control,
    name: "pickupCityId",
  });

  const dropLocation = useWatch({
    control,
    name: "dropLocation",
  });

  // console.log("pickupLocation", pickupLocation);
  // console.log("pickupDealer", pickupDealer);
  // console.log("uploaded request file", files);
  const { id: deliveryRequestSchemeId } = useWatch({
    control,
    name: "deliveryRequestSchemeId",
  });
  const selectedPickupDate = useWatch({
    control,
    name: "deliveryRequestPickupDate",
  });

  const { mutate: pickupMutate, data: pickupDealerList } = useMutation(dealer);
  const { mutate: dropMutate, data: dropDealerList } = useMutation(dealer);

  const { mutate: stateMutate } = useMutation(getState);
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

  const { mutate: getCityIdMutate, isLoading: getCityIdLoading } = useMutation(
    getCityId,
    {
      onSuccess: (res) => {
        if (res?.data?.success == false) {
          if (res?.data?.error) {
            //toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    }
  );

  const { data } = useQuery(
    ["citiesList", pickupState, cityQuery],
    () =>
      cities({
        apiType: "dropdown",
        stateId: pickupState,
        ...(cityQuery && { search: cityQuery }),
      }),
    {
      enabled: pickupState ? true : false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          // console.log("city data List", res);
          setCityList(res?.data?.data);
        } else {
          setCityList([{ name: "No data found" }]);
        }
      },
    }
  );

  const { data: dropCityData } = useQuery(
    ["dropCitiesList", dropState, cityQuery],
    () =>
      cities({
        apiType: "dropdown",
        stateId: dropState,
        ...(cityQuery && { search: cityQuery }),
      }),
    {
      enabled: dropState ? true : false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          // console.log("city data List", res);
          setDropCityList(res?.data?.data);
        } else {
          setDropCityList([{ name: "No data found" }]);
        }
      },
    }
  );

  const user = useSelector(CurrentUser);
  const pageTitle = pathname.split("/")[2];

  const handleClose = () => {
    navigate("/delivery-request");
  };

  const { id: vehicleMakeId } = useWatch({
    control,
    name: "vehicleMakeId",
  });
  const { id: sujectId } = useWatch({
    control,
    name: "subjectID",
  });
  // console.log("sujectId", sujectId);
  // console.log("selectAccount", selectedAccount);
  const [
    clientsListData,
    vehicleTypeListData,
    vehicleMakesListData,
    vehicleModalListData,
    subjectListData,
    subServicesListData,
    vehicleSchemeListData,
  ] = useQueries([
    {
      queryKey: ["client"],
      queryFn: () =>
        client({
          apiType: "dropdown",
        }),
    },
    {
      queryKey: ["vehicleType"],
      queryFn: () =>
        vehicleType({
          clientId: selectedAccount?.id,
          apiType: "dropdown",
        }),
      enabled:
        selectedAccount !== "" && selectedAccount !== undefined ? true : false,
    },
    {
      queryKey: ["vehicleMakes"],
      queryFn: () =>
        vehicleMakes({ clientId: selectedAccount?.id, apiType: "dropdown" }),
      enabled:
        selectedAccount !== "" && selectedAccount !== undefined ? true : false,
    },
    {
      queryKey: ["vehicleModal", vehicleMakeId],
      queryFn: () =>
        vehicleModal({ vehicleMakeId: vehicleMakeId, apiType: "dropdown" }),
      enabled:
        vehicleMakeId !== "" && vehicleMakeId !== undefined ? true : false,
    },
    {
      queryKey: ["subject"],
      queryFn: () =>
        subject({ clientId: selectedAccount?.id, apiType: "dropdown" }),
      enabled:
        selectedAccount !== "" && selectedAccount !== undefined ? true : false,
    },
    {
      queryKey: ["subServices"],
      queryFn: () => subService({ subjectId: sujectId, apiType: "dropdown" }),
      enabled: sujectId !== "" && sujectId !== undefined ? true : false,
    },
    {
      queryKey: ["vehicleScheme"],
      queryFn: () => vehicleScheme(3), // default scheme type_id=3
    },
  ]);

  const { data: locationTypeData } = useQuery(["locationtypeList"], () =>
    getConfigList({
      typeId: 42,
    })
  );

  const { data: enableLocationTypeData } = useQuery(
    ["enableLocationTypeList"],
    () =>
      getConfigList({
        typeId: 90,
      })
  );

  // const { data: approximateVehicleValueMinimumLimitData } = useQuery(
  //   ["approximateVehicleValueMinimumLimitDetail"],
  //   () =>
  //     getConfigList({
  //       typeId: 89,
  //     })
  // );

  const { mutate, isLoading } = useMutation(createRequest);
  // console.log("locationTypeData", locationTypeData);
  //upload API
  const { mutate: uploadMutate, isLoading: uploadisLoading } =
    useMutation(Upload);

  // api response data
  const ClientList = clientsListData?.data?.data?.data;
  const vehicleTypeList = vehicleTypeListData?.data?.data?.data;
  const vehicleMakesList = vehicleMakesListData?.data?.data?.data;
  const vehicleModalList = vehicleModalListData?.data?.data?.data;
  const subjectList = subjectListData?.data?.data?.data;
  const subServicesList = subServicesListData?.data?.data?.data;
  const vehicleSchemeList = vehicleSchemeListData?.data?.data?.data;
  let minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  minDate.setHours(0, 0, 0, 0);
  const { data: dealerDetailsData } = useQuery(
    ["dealerData"],
    () =>
      dealerData({
        dealerId: user?.entityId,
      }),
    {
      onSuccess: (res) => {
        // console.log("ClientList", ClientList, res);
      },
    }
  );
  //  console.log("subjectList", subjectList.find(item => item.id === 1));
  useEffect(() => {
    setSelectedAccount(
      ClientList?.find((el) => el.id == dealerDetailsData?.data?.data?.clientId)
    );
  }, [dealerDetailsData, ClientList]);

  useEffect(() => {
    setEnableLocationType(
      enableLocationTypeData?.data?.data?.[0]?.name === "true" ? true : false
    );
  }, [enableLocationTypeData]);

  useEffect(() => {
    // IF ENABLE LOCATION TYPE IS FALSE AND DELIVERY REQUEST SCHEME IS DEALER THEN SET LOCATION TYPE IS DEALER
    if (
      !enableLocationType &&
      deliveryRequestSchemeId == 22 &&
      locationTypeData?.data?.data?.length > 0
    ) {
      const defaultLocationType = locationTypeData.data.data.find(
        (item) => item.id === 452
      );
      if (defaultLocationType) {
        setValue("locationTypeId", defaultLocationType);
      }
    }
  }, [deliveryRequestSchemeId, enableLocationType, locationTypeData]);

  const TimeRangeOptions = [
    {
      name: "12AM - 2AM",
      minHour: [0, 1],
    },
    {
      name: "2AM - 4AM",
      minHour: [2, 3],
    },
    {
      name: "4AM - 6AM",
      minHour: [4, 5],
    },
    {
      name: "6AM - 8AM",
      minHour: [6, 7],
    },
    {
      name: "8AM - 10AM",
      minHour: [8, 9],
    },
    {
      name: "10AM - 12PM",
      minHour: [10, 11],
    },
    {
      name: "12PM - 2PM",
      minHour: [12, 13],
    },
    {
      name: "2PM - 4PM",
      minHour: [14, 15],
    },
    {
      name: "4PM - 6PM",
      minHour: [16, 17],
    },
    {
      name: "6PM - 8PM",
      minHour: [18, 19],
    },
    {
      name: "8PM - 10PM",
      minHour: [20, 21],
    },
    {
      name: "10PM - 12AM",
      minHour: [22, 23, 24],
    },
  ];
  const [pickupTimeRangeOptions, setPickupTimeRangeOptions] =
    useState(TimeRangeOptions);
  //console.log("pickupTimeRangeOptions",pickupTimeRangeOptions)
  const MenuItems = [
    {
      label: <div onClick={handleClose}>Delivery Requests</div>,
    },
    { label: <div className="text-caps">{pageTitle} Request</div> },
  ];

  const onFormSubmit = (values) => {
    // console.log("request form value", values);
    // const formValues = { ...values };
    // console.log("formValues", formValues);
    // console.log('lat lng ', dropLatlng, pickupLatlng, pickupState, dropState);
    //console.log("test")
    if (!selectedAccount) {
      toast.error("Please Select Account to create a request.", {
        autoClose: 1000,
      });
    } else {
      delete values.file;
      // console.log(
      //   "pickup Dealer",
      //   values?.dealerId,
      //   "deliveryRequestDropDealerId",
      //   values?.deliveryRequestDropDealerId
      // );
      mutate(
        {
          ...values,
          typeId: 32,
          clientId: selectedAccount?.id,
          dealerId: values?.dealerId?.id,
          vehicleTypeId: values?.vehicleTypeId?.id,
          vehicleMakeId: values?.vehicleMakeId?.id,
          vehicleModelId: values?.vehicleModelId?.id,
          // approximateVehicleValue: values?.approximateVehicleValue,
          subjectID: values?.subjectID?.id,
          deliveryRequestSubServiceId: values?.deliveryRequestSubServiceId?.id,
          deliveryRequestSchemeId: values?.deliveryRequestSchemeId?.id,
          deliveryRequestDropDealerId: values?.deliveryRequestDropDealerId?.id,
          deliveryRequestPickupDate: moment(
            values?.deliveryRequestPickupDate
          ).format("YYYY-MM-DD"),
          deliveryRequestPickupTime: values?.deliveryRequestPickupTime.name,
          deliveryRequestCreatedDealerId: user?.entityId,
          hasDocuments: values?.hasDocuments,
          statusId: 1,
          createdById: user?.id,
          createdBy: user?.name,
          locationTypeId: values?.locationTypeId?.id
            ? values?.locationTypeId?.id
            : null,
          dropLocation: values?.dropLocation?.description
            ? values?.dropLocation?.description
            : "",
          dropCityId: values?.dropCityId?.id ? values?.dropCityId?.id : null,
          dropStateId: dropState ? dropState : null,
          dropLatitude: dropLatlng?.lat ? String(dropLatlng?.lat) : "",
          dropLongitude: dropLatlng?.lng ? String(dropLatlng?.lng) : "",
          pickupLocation: values?.pickupLocation?.description
            ? values?.pickupLocation?.description
            : "",
          pickupCityId: values?.pickupCityId?.id
            ? values?.pickupCityId?.id
            : null,
          pickupStateId: pickupState ? pickupState : null,
          pickupLatitude: pickupLatlng?.lat ? String(pickupLatlng?.lat) : "",
          pickupLongitude: pickupLatlng?.lng ? String(pickupLatlng?.lng) : "",
          pickupLocationPinCode: values?.pickupCityId?.pincode
            ? values?.pickupCityId?.pincode
            : null,
          dropLocationPinCode: values?.dropCityId?.pincode
            ? values?.dropCityId?.pincode
            : null,
          attachmentId: null,
        },
        {
          onSuccess: (res) => {
            // console.log("response", res);
            if (res?.data?.success) {
              // console.log("hasDocuments", getValues("hasDocuments"));
              if (getValues("hasDocuments")) {
                // console.log("files", files);
                const uploadParams = {
                  files: files,
                  attachmentTypeId: 61,
                  attachmentOfId: 101,
                  entityId: res?.data?.caseDetailId,
                };
                let formData = new FormData();
                Object.entries(uploadParams)?.forEach((el) => {
                  if (Array.isArray(el[1])) {
                    return el[1]?.forEach((file) => {
                      return formData.append(el[0], file);
                    });
                  }

                  return formData.append(el[0], el[1]);
                });
                uploadMutate(formData);
              }

              toast.success(res?.data?.message);

              navigate("/delivery-request");
            } else {
              // console.log('res error', res.data);
              if (res?.data?.error) {
                toast.error(res?.data?.error);
              } else {
                res?.data?.errors?.forEach((el) => toast.error(el));
              }
            }
          },
        }
      );
    }
  };

  const handleDropDealerSearch = (event) => {
    dropMutate(
      {
        limit: 10,
        offset: 0,
        schemeId: deliveryRequestSchemeId,
        search: event.query,
        clientId: selectedAccount?.id,
        type: "drop",
        pickupDealerId: pickupDealer?.id,
        ...(deliveryRequestSchemeId == 21 && { loginDealerId: user?.entityId }),
        apiType: "dropdown",
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            // console.log("Drop Dealer list", res?.data?.data);
            setDropDealerList(
              res?.data?.data.map((item) => {
                return { ...item, name: `${item?.code}-${item?.name}` };
              })
            );
          } else {
            setDropDealerList([{ name: "No data found" }]);
          }
        },
      }
    );
  };

  const handlepickDealerSearch = (event) => {
    pickupMutate(
      {
        limit: 10,
        offset: 0,
        schemeId: deliveryRequestSchemeId,
        search: event.query,
        type: "pickup",
        clientId: selectedAccount?.id,
        ...(deliveryRequestSchemeId == 21 && { loginDealerId: user?.entityId }),
        apiType: "dropdown",
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            // console.log("pickup Dealer list", res?.data?.data);
            setPickUpDealerList(
              res?.data?.data.map((item) => {
                return { ...item, name: `${item?.code}-${item?.name}` };
              })
            );
          } else {
            setPickUpDealerList([{ name: "No data found" }]);
          }
        },
      }
    );
    // console.log("pickDealer event", event);
  };

  useEffect(() => {
    if (selectedPickupDate) {
      // resetField("deliveryRequestPickupTime");
      const currentDate = moment();
      const pickupDate = moment(selectedPickupDate);
      // console.log("CurrentDate =>", currentDate);
      // console.log("PickupDate =>", pickupDate);
      // console.log("DayDiffDate =>", pickupDate.diff(currentDate, "days"));
      if (pickupDate.diff(currentDate, "days") > 0) {
        // console.log("No restrictions in Time Slot");
        setPickupTimeRangeOptions(TimeRangeOptions);
      } else {
        const startTimeOfCurrent = currentDate.clone().startOf("day");
        // console.log(
        //   "PastHoursInDate =>",
        //   currentDate.diff(startTimeOfCurrent, "hours")
        // );
        setPickupTimeRangeOptions(
          TimeRangeOptions?.filter((time) =>
            time?.minHour?.some(
              (hour) => hour >= currentDate.diff(startTimeOfCurrent, "hours")
            )
          )
        );
      }
    }
  }, [selectedPickupDate]);

  // console.log("deliveryRequestSchemeId", deliveryRequestSchemeId);
  const handleSearch = (event) => {
    // console.log("handle search event", event);
    setSearchValue(event.query);
  };

  // console.log("suggestions?.data", suggestions?.data);

  const handleStateCode = (results, field) => {
    const addressComponents = results?.address_components;

    const stateComponent = addressComponents.find((component) =>
      component.types.includes("administrative_area_level_1")
    );

    // console.log("stateComponent", stateComponent);
    stateMutate(
      {
        code: stateComponent?.short_name,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            console.log("state", res?.data);
            if (field == "pickupLocation") {
              setPickupState(res?.data?.data?.id);
            } else if (field == "dropLocation") {
              setDropState(res?.data?.data?.id);
            }
          }
        },
      }
    );
  };

  const handleLocationSelect = (value, field) => {
    // console.log("handleLocationSelect", value?.value?.description);
    getGeocode({
      address: value?.value?.description,
    }).then((results) => {
      // console.log("geo details", results);
      handleStateCode(results[0], field);
      const addressComponents = results[0]?.address_components;
      const cityComponent = addressComponents.find(
        (component) =>
          component.types.includes("locality") ||
          component.types.includes("administrative_area_level_1")
      );
      const city = cityComponent ? cityComponent.long_name : null;
      const areaComponent = addressComponents.find((component) =>
        component.types.includes("postal_code")
      );
      const area = areaComponent ? areaComponent.long_name : "";
      const stateComponent = addressComponents.find((component) =>
        component.types.includes("administrative_area_level_1")
      );
      const state = stateComponent ? stateComponent?.short_name : "";
      const { lat, lng } = getLatLng(results[0]);
      console.log("lat    lng ***", lat, lng, field);
      if (field == "pickupLocation") {
        setPickupLatlng({
          lat: lat,
          lng: lng,
        });
        getCityIdMutate(
          {
            pinCode: area ? area.toString() : "",
            district: area ? "" : city ? city.toString() : "",
            state: area ? "" : state ? state.toString() : "",
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success) {
                setAreaList(res?.data?.data);
                setShowAutoComplete(false); // Show dropdown
              } else {
                setAreaDropList([]); // Just to be safe
                setShowAutoComplete(true); // Show autocomplete
              }
            },
          }
        );
      } else if (field == "dropLocation") {
        setDropLatlng({
          lat: lat,
          lng: lng,
        });
        getCityIdMutate(
          {
            pinCode: area ? area.toString() : "",
            district: area ? "" : city ? city.toString() : "",
            state: area ? "" : state ? state.toString() : "",
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success) {
                setAreaDropList(res?.data?.data);
                setShowAutoCompleteDrop(false); // Show dropdown
              } else {
                setAreaDropList([]); // Just to be safe
                setShowAutoCompleteDrop(true); // Show autocomplete
              }
            },
          }
        );
      }
    });
  };

  const handleCityChange = (event) => {
    setCityQuery(event.query);
  };

  const formatIndianNumber = (value) => {
    const num = parseInt(value, 10);
    return isNaN(num) ? "" : num.toLocaleString("en-IN");
  };

  // console.log("locationTypeId", locationTypeId);
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page without-step">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={FolderIcon}
                    alt="Title Icon"
                  />
                </div>
                <div className="d-flex gap-1_2 align-items-center">
                  <h5 className="page-content-title text-caps">
                    {pageTitle} Request
                  </h5>

                  <Dropdown
                    className="account-select"
                    value={selectedAccount}
                    // defaultValue={dealerDetailsData?.data?.data?.clientId}
                    placeholder="Select Account"
                    options={ClientList}
                    disabled
                    dropdownIcon={(options) => (
                      <DropDownBlueIcon {...options.iconProps} />
                    )}
                    optionLabel="name"
                    onChange={(e) => setSelectedAccount(e.value)}
                  />
                  {!selectedAccount && (
                    <Note
                      type={"danger"}
                      icon={true}
                      purpose={"note"}
                      style={{ padding: "6px 16px 6px 10px" }}
                    >
                      <div className="account-note">
                        Select Account to create a request.
                      </div>
                    </Note>
                  )}
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
            <form onSubmit={handleSubmit(onFormSubmit)} id="formName">
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">
                      Vehicle Number{" "}
                      <span className="optional">(Optional) </span>
                    </label>
                    <Controller
                      name="registrationNumber"
                      rules={{
                        required: false,
                        /*  validate: {
                          matchPattern: (v) => {
                            if (v?.length > 0) {
                              return (
                                /^[AP|AR|AS|BR|GA|GJ|HR|HP|JH|KA|KL|MP|MH|MN|ML|MZ|NL|OD|PB|RJ|SK|TN|TS|TR|UP|UK|WB]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(
                                  v
                                ) || "Please enter a valid Vehicle Number"
                              );
                            } else {
                              return Promise.resolve();
                            }
                          },
                        }, */
                      }}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            value={field.value.toUpperCase()}
                            keyfilter={"alphanum"}
                            className={`form-control`}
                            placeholder="Enter Vehicle Number"
                            maxLength={10}
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
                    <label className="form-label required">VIN Number</label>
                    <Controller
                      name="vin"
                      control={control}
                      rules={{ required: "VIN Number is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            className={`form-control`}
                            placeholder="Enter VIN Number"
                            maxLength={17}
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
                    <label className="form-label required">Vehicle Type</label>
                    <Controller
                      name="vehicleTypeId"
                      control={control}
                      rules={{ required: "Vehicle Type is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select Vehicle Type"
                            className="form-control-select"
                            options={vehicleTypeList}
                            optionLabel="name"
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
                    <label className="form-label required">Vehicle Make</label>
                    <Controller
                      name="vehicleMakeId"
                      control={control}
                      rules={{ required: "Vehicle Make is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select Vehicle Make"
                            className="form-control-select"
                            options={vehicleMakesList}
                            optionLabel="name"
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
                    <label className="form-label required">Vehicle Model</label>
                    <Controller
                      name="vehicleModelId"
                      control={control}
                      rules={{ required: "Vehicle Model is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select Vehicle Model"
                            className="form-control-select"
                            options={vehicleModalList}
                            optionLabel="name"
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

                {/* <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Vehicle Value</label>
                    <Controller
                      name="approximateVehicleValue"
                      control={control}
                      rules={{
                        required: "Vehicle Value is required.",
                        min: {
                          value:
                            approximateVehicleValueMinimumLimitData?.data
                              ?.data[0]?.name,
                          message: `Value should be greater than or equal to ${formatIndianNumber(
                            approximateVehicleValueMinimumLimitData?.data
                              ?.data[0]?.name
                          )}.`,
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            value={formatIndianNumber(field.value)}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/,/g, "");
                              if (/^\d*$/.test(raw)) {
                                field.onChange(raw);
                              }
                            }}
                            // keyfilter={"pnum"}
                            className={`form-control`}
                            placeholder="Enter In Lakhs"
                          />
                          <div className="p-error">
                            
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div> */}

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">
                      Service Request
                    </label>
                    <Controller
                      name="subjectID"
                      control={control}
                      rules={{ required: "Service Request is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select Service Request"
                            className="form-control-select"
                            options={
                              subjectList
                                ? subjectList?.filter((item) => item?.id === 1)
                                : []
                            }
                            optionLabel="name"
                            onChange={(e) => {
                              // console.log('service request', e.value);
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
                    <label className="form-label required">Sub Service</label>
                    <Controller
                      name="deliveryRequestSubServiceId"
                      control={control}
                      rules={{ required: "Sub Service is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select Sub Service"
                            className="form-control-select"
                            options={
                              subServicesList
                                ? subServicesList?.filter(
                                    (item) => item?.id === 1
                                  )
                                : []
                            }
                            optionLabel="name"
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
                    <label className="form-label required">Scheme</label>
                    <Controller
                      name="deliveryRequestSchemeId"
                      control={control}
                      rules={{ required: "Scheme is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Scheme"
                            className="form-control-select"
                            filter
                            options={vehicleSchemeList}
                            optionLabel="name"
                            onChange={(e) => {
                              field.onChange(e.value);
                              setValue("dealerId", "");
                              setValue("deliveryRequestDropDealerId", "");
                              setValue("locationTypeId", "");
                              setValue("pickupLocation", "");
                              setValue("dropLocation", "");
                              setValue("pickupCityId", "");
                              setValue("dropCityId", "");
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
                {deliveryRequestSchemeId == 22 && (
                  <div
                    className="col-md-3"
                    style={{
                      display: enableLocationType ? "block" : "none",
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label required">
                        Location Type
                      </label>
                      <Controller
                        name="locationTypeId"
                        control={control}
                        rules={{ required: "Location Type is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              value={field.value}
                              placeholder="Select Location Type"
                              className="form-control-select"
                              filter
                              options={locationTypeData?.data?.data}
                              optionLabel="name"
                              onChange={(e) => {
                                // console.log('Location type', e);
                                field.onChange(e.value);
                                setValue("dealerId", "");
                                setValue("deliveryRequestDropDealerId", "");
                                setValue("pickupLocation", "");
                                setValue("dropLocation", "");
                                setValue("pickupCityId", "");
                                setValue("dropCityId", "");
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
                )}

                {locationTypeId == 451 && (
                  <>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-label required">
                          Pickup Location
                        </label>
                        <Controller
                          name="pickupLocation"
                          control={control}
                          rules={{ required: "Pickup Location is required." }}
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
                                  // console.log('Pick up location changed',e);
                                  field.onChange(e.value);
                                  setValue("pickupCityId", "");
                                  setValue("dropLocation", "");
                                }}
                                placeholder="Search Pickup Location"
                                onSelect={(e) =>
                                  handleLocationSelect(e, "pickupLocation")
                                }
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
                          Pickup Location City
                        </label>
                        <Controller
                          name="pickupCityId"
                          control={control}
                          rules={{
                            required: "Pickup Location City is required.",
                          }}
                          render={({ field, fieldState }) => (
                            <>
                              {showAutoComplete ? (
                                <AutoComplete
                                  inputId={field.name}
                                  value={field.value}
                                  field="name"
                                  onChange={field.onChange}
                                  inputRef={field.ref}
                                  suggestions={cityList}
                                  completeMethod={handleCityChange}
                                  disabled={pickupLocation ? false : true}
                                  className="form-control-select"
                                  placeholder="Enter Pickup Location City Name"
                                  pt={{
                                    list: {
                                      className: `${
                                        data?.data?.success ? "" : "empty-state"
                                      }`,
                                    },
                                  }}
                                />
                              ) : (
                                <Dropdown
                                  value={field.value}
                                  placeholder="Select Pickup Location City Name "
                                  filter
                                  resetFilterOnHide={true}
                                  className={`form-control-select ${
                                    fieldState.error ? "p-invalid" : ""
                                  }}`}
                                  disabled={pickupLocation ? false : true}
                                  options={areaList}
                                  optionLabel="name"
                                  onChange={(e) => {
                                    //handleAreaSearch(e, breakStateId)
                                    field.onChange(e.value);
                                  }}
                                />
                              )}
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
                          Drop Location
                        </label>
                        <Controller
                          name="dropLocation"
                          control={control}
                          rules={{ required: "Drop Location is required." }}
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
                                  setValue("dropCityId", "");
                                }}
                                placeholder="Search Drop Location"
                                onSelect={(e) =>
                                  handleLocationSelect(e, "dropLocation")
                                }
                                disabled={pickupCityId ? false : true}
                              />{" "}
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
                          Drop Location City
                        </label>
                        <Controller
                          name="dropCityId"
                          control={control}
                          rules={{
                            required: "Drop Location City is required.",
                          }}
                          render={({ field, fieldState }) => (
                            <>
                              {showAutoCompleteDrop ? (
                                <AutoComplete
                                  inputId={field.name}
                                  value={field.value}
                                  field="name"
                                  onChange={field.onChange}
                                  inputRef={field.ref}
                                  suggestions={dropCityList}
                                  completeMethod={handleCityChange}
                                  disabled={dropLocation ? false : true}
                                  className="form-control-select"
                                  placeholder="Enter Drop Location City Name"
                                  pt={{
                                    list: {
                                      className: `${
                                        data?.data?.success ? "" : "empty-state"
                                      }`,
                                    },
                                  }}
                                />
                              ) : (
                                <Dropdown
                                  value={field.value}
                                  placeholder="Select Drop Location City Name "
                                  filter
                                  resetFilterOnHide={true}
                                  className={`form-control-select ${
                                    fieldState.error ? "p-invalid" : ""
                                  }}`}
                                  disabled={dropLocation ? false : true}
                                  options={areaDropList}
                                  optionLabel="name"
                                  onChange={(e) => {
                                    //handleAreaSearch(e, dropStateId)
                                    field.onChange(e.value);
                                  }}
                                />
                              )}
                              <div className="p-error">
                                {errors && errors[field.name]?.message}
                              </div>
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

                {(locationTypeId == 452 || deliveryRequestSchemeId == 21) && (
                  <>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-label required">
                          Pickup Dealer
                        </label>
                        <Controller
                          name="dealerId"
                          control={control}
                          rules={{ required: "PickUp Dealer is required." }}
                          render={({ field, fieldState }) => {
                            // console.log("pick up dealer field", field);
                            return (
                              <>
                                <AutoComplete
                                  inputId={field.name}
                                  value={field.value}
                                  field="name"
                                  onChange={(value) => {
                                    field.onChange(value);
                                    setValue("deliveryRequestDropDealerId", "");
                                  }}
                                  inputRef={field.ref}
                                  suggestions={pickUpDealersList}
                                  completeMethod={handlepickDealerSearch}
                                  className="form-control-select"
                                  placeholder="Enter Pickup Dealer"
                                  pt={{
                                    list: {
                                      className: `${
                                        pickupDealerList?.data?.success
                                          ? ""
                                          : "empty-state"
                                      }`,
                                    },
                                  }}
                                  disabled={
                                    deliveryRequestSchemeId == undefined
                                      ? true
                                      : false
                                  }
                                />
                                <div className="p-error">
                                  {errors && errors[field.name]?.message}
                                </div>
                              </>
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-label required">
                          Drop Dealer
                        </label>
                        <Controller
                          name="deliveryRequestDropDealerId"
                          control={control}
                          rules={{ required: "Drop Dealer is required." }}
                          render={({ field, fieldState }) => (
                            <>
                              <AutoComplete
                                inputId={field.name}
                                value={field.value}
                                field="name"
                                onChange={field.onChange}
                                inputRef={field.ref}
                                suggestions={DropDealersList}
                                completeMethod={handleDropDealerSearch}
                                pt={{
                                  list: {
                                    className: `${
                                      dropDealerList?.data?.success
                                        ? ""
                                        : "empty-state"
                                    }`,
                                  },
                                }}
                                placeholder="Enter Drop Dealer"
                                disabled={pickupDealer?.id ? false : true}
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
                )}

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">
                      Contact Name at Pickup
                    </label>
                    <Controller
                      name="contactNameAtPickUp"
                      control={control}
                      rules={{
                        required: "Contact Name at Pickup is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            keyfilter={/^[A-Za-z\s]*$/} // This regex allows only alphabets and spaces
                            placeholder="Enter Contact Name at Pickup"
                            className={`form-control`}
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
                      Contact Number at Pickup
                    </label>
                    <Controller
                      name="contactNumberAtPickUp"
                      control={control}
                      rules={{
                        required: "Contact Number at Pickup is required.",
                        validate: {
                          matchPattern: (v) =>
                            /^([+]\d{2})?\d{10}$/.test(v) ||
                            "Contact number must be a valid number",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            keyfilter="int"
                            placeholder="Enter Contact Number at Pickup"
                            maxLength={10}
                            className={`form-control`}
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
                      Contact Name at Drop
                    </label>
                    <Controller
                      name="contactNameAtDrop"
                      control={control}
                      rules={{ required: "Contact Name is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            keyfilter={/^[A-Za-z\s]*$/} // This regex allows only alphabets and spaces
                            className={`form-control`}
                            placeholder="Enter Contact Name at Drop"
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
                      Contact Number at Drop
                    </label>
                    <Controller
                      name="contactNumberAtDrop"
                      control={control}
                      rules={{
                        required: "Contact Number at Drop is required.",
                        validate: {
                          matchPattern: (v) =>
                            /^([+]\d{2})?\d{10}$/.test(v) ||
                            "Contact number must be a valid number",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            keyfilter="int"
                            className={`form-control`}
                            placeholder="Enter Contact Number at Drop"
                            maxLength={10}
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
                    <label className="form-label required">Pickup Date</label>
                    <Controller
                      name="deliveryRequestPickupDate"
                      control={control}
                      rules={{ required: "Pickup Date is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Calendar
                            id="dateRange"
                            value={field.value}
                            hourFormat="24"
                            dateFormat="dd-mm-yy"
                            {...field}
                            placeholder="Select Pickup Date"
                            showIcon
                            iconPos={"left"}
                            // readOnlyInput
                            minDate={minDate}
                            dateTemplate={(date) => {
                              if (date.selectable) {
                                if (date?.year > minDate.getFullYear()) {
                                  setShowPrevIcon(true);
                                } else {
                                  if (date?.month > minDate.getMonth()) {
                                    setShowPrevIcon(false);
                                  }
                                }
                              } else {
                                if (date?.year == minDate.getFullYear()) {
                                  setShowPrevIcon(false);
                                }
                              }
                              return date.day;
                            }}
                            pt={{
                              previousButton: {
                                className: showPrevIcon ? "" : "hidden",
                              },
                            }}
                            onChange={(e) => {
                              field.onChange(e.value); // update the field value
                              resetField("deliveryRequestPickupTime"); // reset the time field
                            }}
                            //prevIcon={null}
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
                    <label className="form-label required">Pickup Time</label>
                    <Controller
                      name="deliveryRequestPickupTime"
                      control={control}
                      rules={{ required: "Pickup Time is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Pickup Time"
                            className="form-control-select"
                            options={
                              selectedPickupDate ? pickupTimeRangeOptions : []
                            }
                            optionLabel="name"
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
                    <label className="form-label required">Remarks</label>
                    <Controller
                      name="description"
                      control={control}
                      className="form-control"
                      rules={{ required: "Remarks is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputTextarea
                            {...field}
                            placeholder="Enter Remarks"
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
                <div className="col-md-7">
                  <div className="form-group radio-form-group">
                    <label className="form-label">Documents</label>
                    <Controller
                      name="hasDocuments"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_yes"
                              {...field}
                              value={true}
                              checked={field.value === true}
                            />
                            <label
                              htmlFor="radio_yes"
                              className="common-radio-label"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_no"
                              {...field}
                              value={false}
                              checked={field.value === false}
                            />
                            <label
                              htmlFor="radio_no"
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
                {hasdocuments && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Attachments</label>
                      <Controller
                        name="file"
                        control={control}
                        rules={{ required: "Attachment is required" }}
                        render={({ field, fieldState }) => {
                          return (
                            <>
                              <CustomFileUpload
                                multiple={true}
                                name={field.name}
                                field={field}
                              />
                              <div className="p-error">
                                {errors && errors[field.name]?.message}
                              </div>
                            </>
                          );
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary"
                  type="submit"
                  form="formName"
                  loading={isLoading}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;
