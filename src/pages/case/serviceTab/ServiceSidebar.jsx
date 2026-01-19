import React, { useRef, useState, useEffect } from "react";
import {
  DialogCloseIcon,
  InfoDarkIcon,
  InfoGreyIcon,
  SearchIcon,
} from "../../../utills/imgConstants";
import { Sidebar } from "primereact/sidebar";
import Note from "../../../components/common/Note";
import { Tooltip } from "primereact/tooltip";
import { OverlayPanel } from "primereact/overlaypanel";
import ServiceDetailCard from "../../home/ServiceDetailCard";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useMutation, useQuery } from "react-query";
import moment from "moment";
import {
  additionalServiceDetails,
  getCaseSubjectSubServices,
  getCityMaster,
  getEntitlementDetails,
  getFullServiceEntitlements,
  getNearestDealersByLocation,
  getStateId,
  addService,
} from "../../../../services/caseService";
import { InputTextarea } from "primereact/inputtextarea";
import { toast } from "react-toastify";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { AutoComplete } from "primereact/autocomplete";
import { RadioButton } from "primereact/radiobutton";
import { getCityId } from "../../../../services/masterServices";
const ServiceSidebar = ({
  activityData,
  caseData,
  visible,
  setVisible,
  caseViewRefetch,
}) => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [areaList, setAreaList] = useState([]);
  const [areaDropList, setAreaDropList] = useState([]);
  const [showAutoCompleteDrop, setShowAutoCompleteDrop] = useState(false);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [breakStateId, setBreakStateId] = useState();
  const [dropStateId, setDropStateId] = useState();
  const [locations, setLocations] = useState();
  const [directions, setDirections] = useState();
  const [travelKM, setTravelKM] = useState();
  // console.log("caseData", caseData);
  const defaultValues = {
    service: "",
    subService: "",
    drop_location_type: "",
    customerPreferredLocation: "",
    dealers: "",
    dealer_location: "",
    dealerToBreakdownDistance: "",
    dropToBreakdownDistance: "",
    droparea: "",
    droplatlng: "",
    dropdownlocation: "",
    dropnearest_city: "",
    dealerdroplatlng: "",
    // custodyRequest: "No",
    // assignedTo: "Myself",
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
  const selectedCaseService = useWatch({ name: "service", control });
  const dropLocationType = useWatch({
    name: "drop_location_type",
    control,
  });
  // const custodyRequest = useWatch({
  //   name: "custodyRequest",
  //   control,
  // });

  const customerPreferredLocation = useWatch({
    name: "customerPreferredLocation",
    control,
  });
  const service = useWatch({
    name: "service",
    control,
  });
  const subService = useWatch({
    name: "subService",
    control,
  });
  const { lat: dplat, lng: dplng } = useWatch({
    name: "droplatlng",
    control,
  });
  const selectedBreakdownLatLong = useWatch({
    control,
    name: "lattiude_longtitude",
  });
  const selectedDealerToBreakdownDistance = useWatch({
    control,
    name: "dealerToBreakdownDistance",
  });
  const selectedDropToBreakdownDistance = useWatch({
    control,
    name: "dropToBreakdownDistance",
  });
  const selectedDropLocation = useWatch({ control, name: "dropdownlocation" });
  const selectedDealers = useWatch({
    name: "dealers",
    control,
  });

  // Add Service API Calling
  const { mutate: serviceUpdateMutate, isLoading: serviceUpdateLoading } =
    useMutation(addService);
  // console.log("service", service);

  // Service FormData API Calling
  const { data } = useQuery(["getServiceDetails"], () =>
    additionalServiceDetails()
  );
  // console.log("servoceData", data);

  // Entitlement API Calling
  const { data: entitlementDetailsData } = useQuery(
    ["entitlements", service, subService],
    () =>
      getEntitlementDetails({
        clientId: caseData?.clientId,
        customerName: caseData.customerContactName,
        customerContactNumber: caseData.customerMobileNumber,
        vin: caseData.vin,
        vehicleRegistrationNumber: caseData.registrationNumber,
        caseTypeId: caseData.caseTypeId,
        serviceId: service?.id,
        subServiceId: subService?.id,
        policyTypeId: caseData.policyTypeId,
        policyNumber: caseData.policyNumber,
        policyStartDate: caseData.policyStartDate,
        policyEndDate: caseData.policyEndDate,
        membershipTypeId: caseData.serviceEligibilityId,
        breakdownToDropDistance: selectedDealerToBreakdownDistance
          ? selectedDealerToBreakdownDistance
          : selectedDropToBreakdownDistance
          ? selectedDropToBreakdownDistance
          : null, // service is towing means required (Field: Dealer to Breakdown Distance)
        bdLat: selectedBreakdownLatLong
          ? selectedBreakdownLatLong?.lat.toString()
          : null,
        bdLong: selectedBreakdownLatLong
          ? selectedBreakdownLatLong?.lng.toString()
          : null,
      }),
    {
      enabled: service?.id || subService?.id ? true : false,
      refetchOnWindowFocus: false,
    }
  );
  // console.log(
  //   "entitlementDetailsData",
  //   entitlementDetailsData,
  //   service,
  //   subService
  // );

  // Entitlement Service Based Service & Sub Service API
  const { data: fullEntitlementServiceData } = useQuery(
    ["getAddFullServiceEntitlements", activityData, service],
    () =>
      getFullServiceEntitlements({
        clientId: caseData?.clientId,
        vin: caseData?.vin,
        vehicleRegistrationNumber: caseData?.registrationNumber || null,
        policyTypeId: caseData.policyTypeId,
        policyNumber: caseData.policyNumber || null, //nullable
        membershipTypeId: caseData?.serviceEligibilityId || null, // policyTypeId rsa means required.
        typeId: 1,
      }),
    {
      enabled: activityData ? true : false,
    }
  );
  // console.log("activityData", fullEntitlementServiceData);

  // Get Nearest Dealers API
  const { mutate: nearestDealerMutate, data: dealersData } = useMutation(
    getNearestDealersByLocation,
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          //resetField({ name: "dealer_location" });
          //resetField({ name: "dealerToBreakdownDistance" });
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    }
  );
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

  // Get State ID for Selected Dealers
  const { mutate: getStateIdMutate, isLoading: getStateIdLoading } =
    useMutation(getStateId, {
      onSuccess: (res) => {
        if (res?.data?.success == false) {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    });

  // Get BD Cities
  const {
    data: bdCitiesData,
    mutate: getBdCitiesMutate,
    isLoading: getBdCitiesLoading,
  } = useMutation(getCityMaster);
  const formOptions = data?.data?.data?.extras ?? [];
  const { data: caseSubjectSubServicesData } = useQuery(
    ["getCaseSubjectSubServices", selectedCaseService],
    () =>
      getCaseSubjectSubServices({
        apiType: "dropdown",
        serviceId: selectedCaseService?.id,
      }),
    {
      enabled: selectedCaseService ? true : false,
    }
  );
console.log("11111111111111");

  const {
    suggestions,
    setValue: setSearchValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // types: ['(regions)'],
      componentRestrictions: { country: "IN" }, // 'in' is the country code for India
      strictBounds: false,
    },
  });
  const op = useRef(null);

  // Get Distance Function
  const getDistance = (start, end) => {
    // console.log("start", start);
    // Initialize the DirectionsService
    const distanceService = new google.maps.DistanceMatrixService();
    // Define the origin and destination
    const origin = new google.maps.LatLng(...start); // Example: Chicago
    const destination = new google.maps.LatLng(...end); // Example: Los Angeles
    // console.log("distance origin", origin);
    // Define the request parameters
    const request = {
      origins: [origin],
      destinations: [destination],
      travelMode: "DRIVING", // You can change the travel mode if needed
    };

    // Call the Distance Matrix service
    distanceService.getDistanceMatrix(request, (response, status) => {
      if (status === "OK") {
        const distanceText = response.rows[0].elements[0].distance.text;
        const distanceValue = response.rows[0].elements[0].distance.value; // Distance in meters
        // const distanceElement = response?.rows[0]?.elements?.[0]?.distance;
        // const distanceText = distanceElement?.value
        //   ? (distanceElement.value / 1000).toFixed(2) + " km" // Convert meters to km and format to 2 decimal places
        //   : "0 km";
        // console.log(response, "distanceText===" + distanceText);
        setTravelKM(distanceText);
        if (
          dropLocationType.id == 451 &&
          (customerPreferredLocation?.id == 462 ||
            customerPreferredLocation?.id == 463 ||
            customerPreferredLocation?.id == 464)
        ) {
          if (distanceText.includes("m") && !distanceText.includes("km")) {
            // console.log("distanceValue ", distanceValue);
            let value = (distanceValue / 1000).toFixed(2) + " km";
            setValue("dropToBreakdownDistance", value);
          } else {
            setValue(
              "dropToBreakdownDistance",
              (distanceValue / 1000).toFixed(2) + " km"
            );
          }
        } else {
          setValue(
            "dealerToBreakdownDistance",
            (distanceValue / 1000).toFixed(2) + " km"
          );
        }
      } else {
        console.error("Error:", status);
      }
    });
  };
  const handleDealerSearch = (event) => {
    if (event?.query?.length > 2) {
      nearestDealerMutate({
        clientId: activityData?.caseDetail?.clientId,
        caseTypeId: caseData?.caseTypeId ?? 413,
        bdLat: caseData?.breakdownLat,
        bdLong: caseData?.breakdownLong,
        dropLocationTypeId: dropLocationType?.id,
        searchKey: event.query,
      });
    }
  };
  const handleDealerSearchSelect = (value) => {
    // console.log("Dealer Selection Event => ", value);
    setValue("dealer_location", value?.dealerLocation);
    setValue("dealerdroplatlng", {
      lat: value?.latitude,
      lng: value?.longitude,
    });
  };
  // Add Service Form Submittion
  const onFormSubmit = (values) => {
    // console.log("values", values, caseData, values?.droplatlng?.lat);
    const ServiceFormValues = {
      caseDetailId: caseData?.caseDetailId,
      agentId: caseData?.agentId,

      additionalServiceId: values?.service?.id,
      additionalSubServiceId: values?.subService?.id,
      dropLocationTypeId: caseData?.dropLocationTypeId
        ? caseData?.dropLocationTypeId
        : values?.drop_location_type?.id,
      dropLocationLat: caseData?.dropLocationLat
        ? caseData?.dropLocationLat
        : values?.droplatlng?.lat
        ? String(values?.droplatlng?.lat)
        : String(values?.dealerdroplatlng?.lat),
      dropLocationLong: caseData?.dropLocationLong
        ? caseData?.dropLocationLong
        : values?.droplatlng?.lng
        ? String(values?.droplatlng?.lng)
        : String(values?.dealerdroplatlng?.lng),
      dropLocation: caseData?.dropLocation
        ? caseData?.dropLocation
        : values?.dropdownlocation?.description
        ? values?.dropdownlocation?.description
        : values?.dealer_location,
      dropDealerId: caseData?.dropDealerId
        ? caseData?.dropDealerId
        : values?.dealers?.id ?? null,
      customerPreferredLocationId: caseData?.customerPreferredLocationId
        ? caseData?.customerPreferredLocationId
        : values?.customerPreferredLocation?.id ?? null,

      dropAreaId: caseData?.dropAreaId
        ? caseData?.dropAreaId
        : values?.droparea?.id ?? null,

      breakdownToDropDistance: caseData?.breakdownToDropLocationDistance
        ? caseData?.breakdownToDropLocationDistance
        : values?.dropToBreakdownDistance !== ""
        ? values?.dropToBreakdownDistance
        : values?.dealerToBreakdownDistance ?? null,
    };
    // console.log("ServiceFormValues", ServiceFormValues);
    serviceUpdateMutate(ServiceFormValues, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setVisible(false);
          reset(defaultValues);
          caseViewRefetch();
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors?.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };

  // Handle Serach Function
  const handleSearch = (event) => {
    // console.log("Location event => ", event);
    var options = {
      types: ["(cities)"],
      componentRestrictions: { country: "us" },
    };

    var input = document.getElementById("searchTextField");
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    // console.log("Autocomplete", autocomplete);
    setSearchValue(event.query);
  };

  useEffect(() => {
    if (selectedDealers?.latitude && selectedDealers?.longitude) {
      if (dropLocationType?.id == 452) {
        setTravelKM(selectedDealers?.distance);
      } else {
        getDistance(
          [Number(caseData?.breakdownLat), Number(caseData?.breakdownLong)],
          [
            Number(selectedDealers?.latitude),
            Number(selectedDealers?.longitude),
          ]
        );
      }
    } else {
      getDistance(
        [Number(caseData?.breakdownLat), Number(caseData?.breakdownLong)],
        [Number(dplat), Number(dplng)]
      );
    }
  }, [
    caseData?.breakdownLat,
    caseData?.breakdownLong,
    dplat,
    dplng,
    selectedDealers,
  ]);
  const handleSelect = (value, field) => {
    // console.log("selected location", value);
    clearSuggestions();
    getGeocode({ address: value.description }).then((results) => {
      // console.log("Geo Location Result => ", results);
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
      if (field?.name == "breakdownlocation") {
        setValue("lattiude_longtitude", {
          lat: lat,
          lng: lng,
        });
        setValue("nearestCity", city);
        resetField("dealerToBreakdownDistance");
        resetField("dealer_location");
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
      } else {
        setValue("droplatlng", {
          lat: lat,
          lng: lng,
        });
        setValue("dropnearest_city", city);
        getDistance(
          [Number(caseData?.breakdownLat), Number(caseData?.breakdownLong)],
          [Number(lat), Number(lng)]
        );
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
  const handleChange = (e, field) => {
    // console.log("location changed", field.name, e);
    setValue(`${field.name}`, e.value);
    if (e.value == "") {
      if (field?.name == "breakdownlocation") {
        resetField("nearestCity");
        resetField("lattiude_longtitude");
        resetField("area_id");
        resetField("drop_location_type");
        resetField("customerPreferredLocation");
        clearDropLocationValues();
        clearAllMarkers();
      } else {
        resetField("dropnearest_city");
        resetField("droplatlng");
        resetField("dropToBreakdownDistance");
        resetField("droparea");
        setAreaDropList([]);
        if (locations?.breakdown) {
          setLocations({
            breakdown: locations?.breakdown,
          });
        }
        if (directions) {
          // console.log("DropLocationTypeChange directions => ", directions);
          directions.setMap(null);
          setDirections(null);
        }
      }
    }
  };
  const clearDropLocationValues = () => {
    resetField("dealers");
    resetField("dealer_location");
    resetField("dealerToBreakdownDistance");
    resetField("dropdownlocation");
    resetField("dropnearest_city");
    resetField("droplatlng");
    resetField("dropToBreakdownDistance");
    resetField("droparea");
    setAreaDropList([]);
  };

  const handleDropLocationTypeChange = (e) => {
    // console.log("DropLocationTypeChange", e);
    if (e.value.id == 452) {
      nearestDealerMutate({
        clientId: activityData?.caseDetail?.clientId,
        caseTypeId: caseData?.caseTypeId ?? 413,
        bdLat: caseData?.breakdownLat,
        bdLong: caseData?.breakdownLong,
      });
    }
    clearDropLocationValues();
    resetField("customerPreferredLocation");
  };
  const handleDealerSelect = (e) => {
    // console.log("Dealer Event => ", e);
    setValue("dealer_location", e?.value?.dealerLocation);
    setValue("dealerToBreakdownDistance", e?.value?.distance);
    setValue("dealerdroplatlng", {
      lat: e?.value?.latitude,
      lng: e?.value?.longitude,
    });
  };
  const handleAreaSearch = (event, stateId) => {
    getBdCitiesMutate(
      {
        stateId: stateId,
        apiType: "dropdown",
        search: event.query,
      },
      {
        onSuccess: (res) => {
          // console.log("area response", res);
          if (res?.data?.success) {
            setAreaList(res?.data.data);
          } else {
            setAreaList([]);
          }
        },
      }
    );
  };
  const handleStateCode = (results, fieldName) => {
    // console.log("results", results);
    if (results?.address_components) {
      // Extract city or locality from address components
      const addressComponents = results?.address_components;

      const stateComponent = addressComponents.find((component) =>
        component.types.includes("administrative_area_level_1")
      );
      // console.log("stateComponent => ", stateComponent);
      getStateIdMutate(
        {
          code: stateComponent?.short_name,
        },
        {
          onSuccess: (res) => {
            if (res?.data?.success) {
              if (fieldName == "breakdownlocation") {
                setBreakStateId(res?.data?.data?.id);
              } else {
                // console.log("fieldName");
                setDropStateId(res?.data?.data?.id);
              }
            }
          },
        }
      );
    }
  };

  const handlePreferredLocationTypeChange = (e) => {
    // console.log("handlePreferredLocationTypeChange", e);
    clearDropLocationValues();
  };
  const clearDropLoaction = () => {
    resetField("drop_location_type");
    resetField("customerPreferredLocation");
    resetField("dealers");
    resetField("dealer_location");
    resetField("dealerToBreakdownDistance");
    resetField("dropdownlocation");
    resetField("dropnearest_city");
    resetField("droplatlng");
    resetField("dropToBreakdownDistance");
    resetField("droparea");
  };
  const handleCaseService = (e) => {
    resetField("subService");
    resetField("dealers");
    clearDropLoaction();
  };
  useEffect(() => {
    if (caseData?.breakdownLocation) {
      getGeocode({ address: caseData?.breakdownLocation }).then((results) => {
        handleStateCode(results[0], "breakdownlocation");
      });
    }
  }, [caseData?.breakdownLocation]);
  // console.log("caseData", caseData);
  // console.log("errors", errors);
  return (
    <Sidebar
      visible={visible}
      position="right"
      closeIcon={<DialogCloseIcon />}
      onHide={() => setVisible(false)}
      pt={{
        root: { className: "w-744 custom-sidebar" },
        header: { className: "brdr-bottom" },
      }}
      icons={
        <>
          <div className="sidebar-title">Add Service</div>
        </>
      }
    >
      <div className="sidebar-content-wrap">
        <div className="sidebar-content-body">
          <Note type={"danger"} icon={false} purpose={"note"}>
            <div>
              <span style={{ fontWeight: 700, marginRight: "7px" }}>
                NOTE :
              </span>
              Add a new service after completion or when an additional service
              is requested.
            </div>
          </Note>
          <div className="time-left-content">
            {/* Time left : <span className="time"> 2 min 55 sec </span>{" "}
            <img className={"info"} src={InfoGreyIcon} /> */}
            {/* <OverlayPanel ref={op} pt={{ root: { className: "bg-grey" } }}>
              <div className="note-content-contanier">
                <div className="note-title">Service Request</div>
                <div className="note-content">
                  You can only add a new service after the timer ends.
                </div>{" "}
                <button
                  className="bg-transparent got-it-btn"
                  onClick={(e) => op.current.hide(e)}
                >
                  Got It
                </button>
              </div>
            </OverlayPanel> */}
            <Tooltip
              target=".info"
              position="bottom"
              autoHide={false}
              pt={{
                text: { className: "bg-grey" },
                arrow: { className: "bg-grey" },
              }}
            >
              <div className="note-content-contanier">
                <div className="note-title">Service Request</div>
                <div className="note-content">
                  You can only add a new service after the timer ends.
                </div>
                <button className="bg-transparent  got-it-btn">Got It</button>
              </div>
            </Tooltip>
          </div>
          <div className="service-details">
            <ServiceDetailCard
              tabMenu={false}
              companyName={true}
              client={{ name: caseData?.client }}
              serviceTableScrollHidden={true}
              entitlementData={{
                fullScreenView: false,
                policyData:
                  caseData?.policyTypeId !== 434
                    ? {
                        policyNumber: caseData?.policyNumber,
                        policyStartDate: caseData?.policyStartDate,
                        policyEndDate: caseData?.policyEndDate,
                      }
                    : null,
                ...(service
                  ? entitlementDetailsData?.data?.data?.result
                  : fullEntitlementServiceData?.data?.data),
              }}
            />
          </div>
          <form
            className="service-form"
            onSubmit={handleSubmit(onFormSubmit)}
            id="serviceform"
          >
            <div className="row row-gap-3_4">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">Service</label>
                  <Controller
                    name="service"
                    control={control}
                    rules={{ required: "Service is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Service"
                          filter
                          resetFilterOnHide={true}
                          className={`form-control-select `}
                          options={formOptions?.services}
                          optionLabel="name"
                          onChange={(e) => {
                            field.onChange(e.value);
                            handleCaseService(e);
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
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">Sub Service</label>
                  <Controller
                    name="subService"
                    control={control}
                    rules={{ required: "Sub Service is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Sub Service"
                          filter
                          resetFilterOnHide={true}
                          className="form-control-select"
                          options={
                            caseSubjectSubServicesData
                              ? caseSubjectSubServicesData?.data?.data.filter(
                                  (subService) => subService?.id !== 1
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
              {(caseData?.dropLocationType === undefined ||
                caseData?.dropLocationType === null) && (
                <>
                  {service?.id == 1 && (
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label required">
                          Drop Location Type
                        </label>
                        <Controller
                          name="drop_location_type"
                          control={control}
                          rules={{
                            required: "Drop Location Type is required.",
                          }}
                          render={({ field, fieldState }) => (
                            <Dropdown
                              value={field.value}
                              placeholder="Select Drop Location Type"
                              filter
                              resetFilterOnHide={true}
                              className="form-control-select"
                              options={formOptions?.dropLocationTypes}
                              optionLabel="name"
                              onChange={(e) => {
                                field.onChange(e.value);
                                handleDropLocationTypeChange(e);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  )}
                  {/* <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Dealer</label>
                  <Controller
                    name="to"
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        filter
                        value={[]}
                        //onChange={(e) => setSelectedCity(e.value)}
                        //options={cities}
                        optionLabel="name"
                        placeholder="Select"
                        className={`form-control-select ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">
                    Customer Preferred Location
                  </label>
                  <Controller
                    name="Customer Preferred Location"
                    control={control}
                    rules={{
                      required: "Customer Preferred Location is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                      value={field.value}
                      placeholder="Select Customer Preferred Location"
                      filter
                      resetFilterOnHide={true}
                      className="form-control-select"
                      options={formOptions?.customerPreferredLocations}
                      optionLabel="name"
                      onChange={(e) => {
                        field.onChange(e.value);
                        
                      }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Customer Drop Location</label>
                  <div className="p-inputgroup">
                    <Controller
                      name="link"
                      control={control}
                      rules={{ required: "Link is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            keyfilter="int"
                            className={`form-control ${
                              fieldState.error ? "p-invalid" : ""
                            }`}
                            placeholder="Enter Drop Location"
                            {...field}
                          />
                        </>
                      )}
                    />
                    <Button icon={<img src={SearchIcon} />} />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Latitude & Longitude</label>
                  <Controller
                    name="to"
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        filter
                        value={[]}
                        //onChange={(e) => setSelectedCity(e.value)}
                        //options={cities}
                        optionLabel="name"
                        placeholder="Select"
                        className={`form-control-select ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div> */}
                  {service?.id !== 3 && dropLocationType?.id == 451 && (
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label required">
                          Customer Preferred Location
                        </label>
                        <Controller
                          name="customerPreferredLocation"
                          control={control}
                          rules={{
                            required:
                              "Customer Preferred Location is required.",
                          }}
                          render={({ field, fieldState }) => (
                            <>
                              <Dropdown
                                value={field.value}
                                placeholder="Select Customer Preferred Location"
                                filter
                                resetFilterOnHide={true}
                                className="form-control-select"
                                options={
                                  formOptions?.customerPreferredLocations
                                }
                                optionLabel="name"
                                onChange={(e) => {
                                  field.onChange(e.value);
                                  handlePreferredLocationTypeChange(e);
                                }}
                              />
                              {errors && (
                                <div className="p-error">
                                  {errors[field.name]?.message}
                                </div>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  )}
                  {((service?.id !== 3 && dropLocationType?.id == 452) ||
                    customerPreferredLocation?.id == 461) && (
                    <>
                      {dropLocationType?.id == 452 ? (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label required">
                              Dealers
                            </label>
                            <Controller
                              name="dealers"
                              control={control}
                              rules={{ required: "Dealers is required." }}
                              render={({ field, fieldState }) => (
                                <>
                                  <Dropdown
                                    value={field.value}
                                    placeholder="Select Dealers "
                                    filter
                                    resetFilterOnHide={true}
                                    className="form-control-select"
                                    options={dealersData?.data?.data?.map(
                                      (dealer) => {
                                        return {
                                          ...dealer,
                                          name: `${dealer.code}-${dealer.name}`,
                                        };
                                      }
                                    )}
                                    optionLabel="name"
                                    onChange={(e) => {
                                      // console.log("dealer selected", e);
                                      field.onChange(e.value);
                                      handleDealerSelect(e);
                                    }}
                                  />
                                  {errors && (
                                    <div className="p-error">
                                      {errors[field.name]?.message}
                                    </div>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label required">
                              Dealers
                            </label>
                            <div className="p-inputgroup">
                              <Controller
                                name="dealers"
                                control={control}
                                rules={{ required: "Dealers is required." }}
                                render={({ field, fieldState }) => (
                                  <>
                                    <AutoComplete
                                      placeholder="Search Dealers"
                                      inputId={field.name}
                                      value={field.value}
                                      inputRef={field.ref}
                                      field="name"
                                      suggestions={dealersData?.data?.data}
                                      completeMethod={(event) =>
                                        handleDealerSearch(event)
                                      }
                                      showEmptyMessage={true}
                                      onChange={(value) => {
                                        field.onChange(value);
                                      }}
                                      onSelect={(e) =>
                                        handleDealerSearchSelect(e?.value)
                                      }
                                      itemTemplate={(dealer) => (
                                        <div>
                                          <span>
                                            {dealer.codeWithLegalName}
                                          </span>
                                        </div>
                                      )}
                                    />
                                  </>
                                )}
                              />
                              {/* <Button icon={<img src={SearchIcon} />} /> */}
                            </div>
                            {errors && (
                              <div className="p-error">
                                {errors["dealers"]?.message}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label required">
                            Dealer Location
                          </label>
                          <Controller
                            name="dealer_location"
                            control={control}
                            rules={{ required: "Dealer Location is required." }}
                            render={({ field, fieldState }) => (
                              <>
                                <InputTextarea
                                  {...field}
                                  rows={4}
                                  placeholder="Enter Dealer Location"
                                  className={`form-control ${
                                    fieldState.error ? "p-invalid" : ""
                                  }`}
                                  disabled
                                  // readOnly
                                />
                                {errors && (
                                  <div className="p-error">
                                    {errors[field.name]?.message}
                                  </div>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label required">
                            Breakdown to Drop Distance
                          </label>
                          <Controller
                            name="dealerToBreakdownDistance"
                            control={control}
                            rules={{
                              required:
                                "Breakdown to Drop Distance is required.",
                            }}
                            render={({ field, fieldState }) => (
                              <>
                                <InputText
                                  {...field}
                                  className={`form-control ${
                                    fieldState.error ? "p-invalid" : ""
                                  }`}
                                  placeholder="Enter Breakdown to Drop Distance"
                                  disabled
                                />
                                {errors && (
                                  <div className="p-error">
                                    {errors[field.name]?.message}
                                  </div>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label required">
                            Drop Latitude & longitude
                          </label>
                          <Controller
                            name="dealerdroplatlng"
                            control={control}
                            rules={{
                              required:
                                "Drop Latitude & longitude is required.",
                            }}
                            render={({ field, fieldState }) => (
                              <>
                                <InputText
                                  {...field}
                                  value={
                                    field.value &&
                                    `${field.value.lat}&${field.value.lng}`
                                  }
                                  className={`form-control ${
                                    fieldState.error ? "p-invalid" : ""
                                  }`}
                                  placeholder="Enter Dropd Latitude & longitude"
                                  disabled
                                />
                                {errors && (
                                  <div className="p-error">
                                    {errors[field.name]?.message}
                                  </div>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {service?.id !== 3 &&
                    dropLocationType.id == 451 &&
                    (customerPreferredLocation?.id == 462 ||
                      customerPreferredLocation?.id == 463 ||
                      customerPreferredLocation?.id == 464) && (
                      <>
                        {" "}
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label required">
                              Drop Location
                            </label>
                            <div className="p-inputgroup">
                              <Controller
                                name="dropdownlocation"
                                control={control}
                                rules={{
                                  required: "Drop Location is required.",
                                }}
                                render={({ field, fieldState }) => (
                                  <>
                                    <AutoComplete
                                      value={field.value}
                                      suggestions={suggestions?.data}
                                      completeMethod={handleSearch}
                                      field="description"
                                      itemTemplate={(option) => {
                                        return <div>{option?.description}</div>;
                                      }}
                                      onChange={(e) => handleChange(e, field)}
                                      onSelect={(e) =>
                                        handleSelect(e.value, field)
                                      }
                                      placeholder="Search places"
                                      showEmptyMessage={true}
                                    />
                                  </>
                                )}
                              />
                              {/* <Button icon={<img src={SearchIcon} />} /> */}
                            </div>
                            {errors && (
                              <div className="p-error">
                                {errors["dropdownlocation"]?.message}
                                {/*  {errors[field.name]?.message}*/}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label required">
                              Nearest City
                            </label>
                            <Controller
                              name="dropnearest_city"
                              control={control}
                              rules={{ required: "Nearest City is required." }}
                              render={({ field, fieldState }) => (
                                <>
                                  <InputText
                                    {...field}
                                    className={`form-control ${
                                      fieldState.error ? "p-invalid" : ""
                                    }`}
                                    placeholder="Enter Nearest City"
                                    disabled
                                  />
                                  {errors && (
                                    <div className="p-error">
                                      {errors[field.name]?.message}
                                    </div>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label required">
                              Drop Latitude & longitude
                            </label>
                            <Controller
                              name="droplatlng"
                              control={control}
                              rules={{
                                required:
                                  "Drop Latitude & longitude is required.",
                              }}
                              render={({ field, fieldState }) => (
                                <>
                                  <InputText
                                    {...field}
                                    value={
                                      field.value &&
                                      `${field.value.lat}&${field.value.lng}`
                                    }
                                    className={`form-control ${
                                      fieldState.error ? "p-invalid" : ""
                                    }`}
                                    placeholder="Enter Dropd Latitude & longitude"
                                    disabled
                                  />
                                  {errors && (
                                    <div className="p-error">
                                      {errors[field.name]?.message}
                                    </div>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label required">Area</label>
                            <Controller
                              name="droparea"
                              control={control}
                              rules={{ required: "Area is required." }}
                              render={({ field, fieldState }) => (
                                <>
                                  {showAutoCompleteDrop ? (
                                    <AutoComplete
                                      placeholder="Enter Area"
                                      inputId={field.name}
                                      value={field.value}
                                      inputRef={field.ref}
                                      field="name"
                                      suggestions={areaList}
                                      completeMethod={(event) =>
                                        handleAreaSearch(event, dropStateId)
                                      }
                                      showEmptyMessage={true}
                                      onChange={(value) => {
                                        field.onChange(value);
                                      }}
                                    />
                                  ) : (
                                    <Dropdown
                                      value={field.value}
                                      placeholder="Select area "
                                      filter
                                      resetFilterOnHide={true}
                                      className={`form-control-select ${
                                        fieldState.error ? "p-invalid" : ""
                                      }}`}
                                      disabled={
                                        !selectedDropLocation?.description
                                      }
                                      options={areaDropList}
                                      optionLabel="name"
                                      onChange={(e) => {
                                        //handleAreaSearch(e, dropStateId)
                                        field.onChange(e.value);
                                      }}
                                    />
                                  )}
                                  {errors && (
                                    <div className="p-error">
                                      {errors[field.name]?.message}
                                      {/*  {errors[field.name]?.message}*/}
                                    </div>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label required">
                              Breakdown to Drop Distance
                            </label>
                            <Controller
                              name="dropToBreakdownDistance"
                              control={control}
                              rules={{
                                required:
                                  "Breakdown to Drop Distance is required.",
                              }}
                              render={({ field, fieldState }) => (
                                <>
                                  <InputText
                                    {...field}
                                    className={`form-control ${
                                      fieldState.error ? "p-invalid" : ""
                                    }`}
                                    placeholder="Breakdown to Drop Distance"
                                    disabled
                                  />
                                  {errors && (
                                    <div className="p-error">
                                      {errors[field.name]?.message}
                                    </div>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        </div>
                        {/* <div className="col-md-6">
                      <div className="form-group radio-form-group">
                        <label className="form-label">Custody Request</label>
                        <Controller
                          name="custodyRequest"
                          control={control}
                          //rules={{ required: "Input is required." }}
                          render={({ field, fieldState }) => {
                            return (
                              <>
                                <div className="common-radio-group">
                                  <div className="common-radio-item">
                                    <RadioButton
                                      inputId="radio_yes"
                                      {...field}
                                      value="Yes"
                                      checked={field.value === "Yes"}
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
                                      value="No"
                                      checked={field.value === "No"}
                                    />
                                    <label
                                      htmlFor="radio_no"
                                      className="common-radio-label"
                                    >
                                      No
                                    </label>
                                  </div>
                                </div>
                              </>
                            );
                          }}
                        />
                      </div>
                    </div> */}
                        {/* {custodyRequest == "Yes" && (
                      <div className="col-md-6">
                        <div className="form-group radio-form-group">
                          <label className="form-label">Assigned To</label>
                          <Controller
                            name="assignedTo"
                            control={control}
                            //rules={{ required: "Input is required." }}
                            render={({ field, fieldState }) => {
                              return (
                                <>
                                  <div className="common-radio-group">
                                    <div className="common-radio-item">
                                      <RadioButton
                                        inputId="radio_myself"
                                        {...field}
                                        value={"Myself"}
                                        checked={field.value === "Myself"}
                                      />
                                      <label
                                        htmlFor="radio_myself"
                                        className="common-radio-label"
                                      >
                                        Myself
                                      </label>
                                    </div>
                                    <div className="common-radio-item">
                                      <RadioButton
                                        inputId="radio_others"
                                        {...field}
                                        value={"Others"}
                                        checked={field.value === "Others"}
                                      />
                                      <label
                                        htmlFor="radio_others"
                                        className="common-radio-label"
                                      >
                                        Others
                                      </label>
                                    </div>
                                  </div>
                                </>
                              );
                            }}
                          />
                        </div>
                      </div>
                    )} */}
                      </>
                    )}
                </>
              )}
            </div>
          </form>
        </div>
        <div className="sidebar-content-footer">
          <div className="d-flex align-items-center justify-content-end">
            <Button
              className="btn btn-primary"
              form="serviceform"
              type="submit"
              loading={serviceUpdateLoading}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default ServiceSidebar;
