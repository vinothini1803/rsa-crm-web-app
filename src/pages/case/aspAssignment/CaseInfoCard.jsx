import React, { useState, useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useMutation } from "react-query";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import {
  CalendarViewIcon,
  CloseIcon,
  DialogCloseSmallIcon,
  KMStoneIcon,
  SpannerImage,
  VehicleGreyIcon,
  ChevronDownSquareIcon,
  ChevronUpSquareIcon,
} from "../../../utills/imgConstants";
import Filters from "../../../components/common/Filters";
import { Checkbox } from "primereact/checkbox";
import Note from "../../../components/common/Note";
import { Dialog } from "primereact/dialog";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useQueries, useQuery } from "react-query";
import {
  configtypes,
  nspFilter,
  getCityId,
} from "../../../../services/masterServices";
import { reimbursementMapping } from "../../../../services/otherService";
import { toast } from "react-toastify";
import {
  getNearestDealersByLocation,
  sendLocationURL,
  getStateId,
  getCityMaster,
  getReceivedSMSId,
  updateLocation,
} from "../../../../services/caseService";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../../store/slices/userSlice";
const CaseInfoCard = ({
  caseDetail,
  activityData,
  setFilterId,
  thirdPartyAsp,
  setThirdPartyAsp,
  setSearchKey,
  activityIdReimbursement,
  refetchCaseDetails,
  nearASPRefetch,
  activityViewRefetch,
}) => {
  const user = useSelector(CurrentUser);
  const navigate = useNavigate();
  const [filters, setFilters] = useState(null);
  const [dropLocationForm, setDropLocationForm] = useState(false);
  const [checked, setChecked] = useState(false);
  const { pathname } = useLocation();
  const { id } = useParams();
  const [reimbursement, setReimbursement] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [breakdownVisible, setBreakdownVisible] = useState(false);
  const permissions = user?.role?.permissions?.map((perm) => perm.name) || [];

  //For Dialogbox
  const [locations, setLocations] = useState();
  const [directions, setDirections] = useState();
  const [map, setMap] = useState();
  const [markers, setMarkers] = useState([]);
  const [travelKM, setTravelKM] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [breakStateId, setBreakStateId] = useState();
  const [dropStateId, setDropStateId] = useState();
  const [customerState, setCustomerState] = useState([]);
  const [defaultHide, setDefaultHide] = useState(true);
  const [areaList, setAreaList] = useState([]);
  const [areaDropList, setAreaDropList] = useState([]);
  const [showAutoCompleteDrop, setShowAutoCompleteDrop] = useState(false);
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
    setValue,
    resetField,
  } = useForm({
    defaultValues: {
      dropLocationReason: "",
      drop_location_type: null,
      customerPreferredLocation: null,
      dealers: null,
      dealer_location: "",
      dealerToBreakdownDistance: "",
      dropdownlocation: null,
      droplatlng: null,
      dropnearest_city: "",
      droparea: null,
      dropToBreakdownDistance: "",
    },
  });

  const {
    handleSubmit: handleBreakdownLocation,
    control: bdControl,
    getValues: getbdValues,
    formState: { errors: errorsBd },
    reset: resetBd,
    setValue: setBdValue,
    resetField: resetFieldBd,
  } = useForm({
    defaultValues: {
      breakdownLocationReason: "",
      breakdownlocation: null,
      lattiude_longtitude: null,
      nearestCity: "",
      area_id: null,
      dealerToBreakdownDistance: "",
    },
  });
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

  const dropLocationTypes = [
    { id: 451, name: "Customer Preferred Location" },
    { id: 452, name: "Dealer" },
  ];
  const customerPreferredLocations = [
    { id: 461, name: "Dealer" },

    { id: 462, name: "Home" },
    { id: 463, name: "Garage" },
    { id: 464, name: "Charging Station" },
  ];

  const dropLocationType = useWatch({
    name: "drop_location_type",
    control,
  });
  const customerPreferredLocation = useWatch({
    name: "customerPreferredLocation",
    control,
  });
  const bdLatLng = useWatch({
    name: "lattiude_longtitude",
    control: bdControl,
    defaultValue: { lat: null, lng: null },
  });
  const { lat: bdlat, lng: bdlng } = bdLatLng || { lat: null, lng: null };

  const dropLatLng = useWatch({
    name: "droplatlng",
    control,
    defaultValue: { lat: null, lng: null },
  });
  const { lat: dplat, lng: dplng } = dropLatLng || { lat: null, lng: null };
  const selectedDealers = useWatch({
    name: "dealers",
    control,
  });
  const selectedBdLocation = useWatch({
    name: "breakdownlocation",
    control: bdControl,
  });
  const selectedDropLocation = useWatch({
    name: "dropdownlocation",
    control,
  });
  // console.log();
  const {
    data: updateLocationData,
    mutate: updateMutate,
    isLoading: updateIsLoading,
  } = useMutation(updateLocation);
  const {
    data: bdCitiesData,
    mutate: getBdCitiesMutate,
    isLoading: getBdCitiesLoading,
  } = useMutation(getCityMaster);

  const { mutate, data: dealersData } = useMutation(
    getNearestDealersByLocation,
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          //resetField({ name: "dealer_location" });
          //resetField({ name: "dealerToBreakdownDistance" });
          // console.log("");
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

  const { data } = useQuery(["aspdistance"], () =>
    nspFilter({
      typeId: 31,
    })
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
  // console.log(
  //   "asp distance data",
  //   data,
  //   data?.data?.data?.map((distance) => {
  //     return {
  //       code: distance?.id,
  //       label: distance?.name,
  //     };
  //   })
  // );

  // console.log(pathname);

  const handleFilter = (values) => {
    // console.log("ASP Assign Filter values", values);
    setFilterId(values?.distance?.code);
    if (values?.asp_id) {
      setSearchKey(values?.asp_id?.value);
    } else {
      setSearchKey("");
    }
  };
  const handleClearFilter = () => {
    setFilterId(null);
  };
  const handleClose = () => {
    // console.log("Case ID => ", id);
    navigate(`/cases/view/${id}`);
  };
  const handleFormSubmit = (values) => {
    // console.log("drop values", values, dropStateId);
    updateMutate(
      {
        caseDetailId: caseDetail?.caseDetailId,
        editType: 2, //1-Breakdown,2-Drop
        activityId: activityIdReimbursement,
        dropLocationReason: values?.dropLocationReason,
        dropLocationTypeId: values?.drop_location_type?.id,
        customerPreferredLocationId: values?.customerPreferredLocation?.id,
        dropDealerId: values?.dealers ? values?.dealers?.id : null,
        dropLocationLat: values?.dealers
          ? values?.dealers?.latitude
          : values?.droplatlng?.lat?.toString(),
        dropLocationLong: values?.dealers
          ? values?.dealers?.longitude
          : values?.droplatlng?.lng?.toString(),
        dropLocation: values?.dealers
          ? values?.dealer_location
          : values?.dropdownlocation?.description,
        breakdownToDropDistance: values?.dealers
          ? values?.dealerToBreakdownDistance
          : values?.dropToBreakdownDistance, //It should be calculated  and passed for both breakdown & drop
        dropAreaId: values?.droparea?.id, //DROP AREA WILL COME ONLY IF CUSTOMER PREFERRED LOCATION IS HOME
        // Only send dropStateId for customer preferred location (not for dealer or when customer preferred is dealer)
        dropStateId:
          values?.drop_location_type?.id == 451 &&
          values?.customerPreferredLocation?.id != 461
            ? dropStateId
            : null,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setDropLocationForm(false);
            refetchCaseDetails();
            nearASPRefetch();
            activityViewRefetch(); //refetch activity data to get updated customerNeedToPay
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

  const handleCheckboxChange = (e) => {
    setReimbursement(e.checked); // Update the reimbursement state
    setDialogVisible(e.checked); // Open the dialog if checkbox is checked
  };
  const handleDialogClose = () => {
    setDialogVisible(false);
    setReimbursement(false);
    reset();
  };
  // console.log("reimbursement check box", reimbursement);
  const {
    mutate: reimbursementMappingMutation,
    data: reimbursementMappingData,
  } = useMutation(reimbursementMapping);

  const onSubmit = (data) => {
    // Call the API with the form data
    reimbursementMappingMutation(
      {
        comments: data?.comments,
        isReimbursement: reimbursement ? 1 : 0,
        activityId: activityIdReimbursement,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            handleDialogClose();
            navigate(`/cases/view/${id}`);
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
  useEffect(() => {
    if (bdlat && bdlng) {
      // console.log("Drop Lat & Long =>", dplat, dplng);
      setLocations({
        breakdown: {
          lat: bdlat,
          lng: bdlng,
        },
        drop: {
          lat: caseDetail?.dropLocationLat,
          lng: caseDetail?.dropLocationLong,
        },
      });
      const dropLocation = {
        lat: Number(caseDetail?.dropLocationLat),
        lng: Number(caseDetail?.dropLocationLong),
      };
    } else if (selectedDealers && bdlat && bdlng) {
      // console.log("Selected Dealers =>", selectedDealers);
      setLocations({
        breakdown: {
          lat: bdlat,
          lng: bdlng,
        },
        drop: {
          lat: Number(selectedDealers?.latitude),
          lng: Number(selectedDealers?.longitude),
        },
      });
    }
    if (bdlat && bdlng) {
      // console.log("BD Lat & Long =>", bdlat, bdlng);
      setLocations({
        ...locations,
        breakdown: {
          lat: bdlat,
          lng: bdlng,
        },
      });
    }
    if (
      bdlat &&
      bdlng &&
      ((caseDetail?.dropLocationLat && caseDetail?.dropLocationLong) ||
        (selectedDealers?.latitude && selectedDealers?.longitude))
    ) {
      // console.log("Direction issue => ", dplat, dplng, selectedDealers);

      if (selectedDealers?.latitude && selectedDealers?.longitude) {
        if (dropLocationType?.id == 452) {
          setTravelKM(selectedDealers?.distance);
        } else {
          getDistance(
            [Number(bdlat), Number(bdlng)],
            [
              Number(selectedDealers?.latitude),
              Number(selectedDealers?.longitude),
            ]
          );
        }
      } else {
        getDistance(
          [Number(bdlat), Number(bdlng)],
          [
            Number(caseDetail?.dropLocationLat),
            Number(caseDetail?.dropLocationLong),
          ]
        );
      }
    }
  }, [bdlat, bdlng]);
  useEffect(() => {
    if (dplat && dplng) {
      // console.log("Drop Lat & Long =>", dplat, dplng);
      setLocations({
        breakdown: {
          lat: caseDetail?.breakdownLat,
          lng: caseDetail?.breakdownLong,
        },
        drop: {
          lat: dplat,
          lng: dplng,
        },
      });
      const dropLocation = {
        lat: Number(dplat),
        lng: Number(dplng),
      };
      // addDropMarker(dplat, dplng, selectedDropLocation?.description);
    } else if (
      selectedDealers &&
      caseDetail?.breakdownLat &&
      caseDetail?.breakdownLong
    ) {
      // console.log("Selected Dealers =>", selectedDealers);
      setLocations({
        breakdown: {
          lat: caseDetail?.breakdownLat,
          lng: caseDetail?.breakdownLong,
        },
        drop: {
          lat: Number(selectedDealers?.latitude),
          lng: Number(selectedDealers?.longitude),
        },
      });
      // addDropMarker(
      //   selectedDealers?.latitude,
      //   selectedDealers?.longitude,
      //   selectedDealers?.dealerLocation
      // );
    }

    if (
      caseDetail?.breakdownLat &&
      caseDetail?.breakdownLong &&
      ((dplat && dplng) ||
        (selectedDealers?.latitude && selectedDealers?.longitude))
    ) {
      // console.log("Direction issue => ", dplat, dplng, selectedDealers);

      if (selectedDealers?.latitude && selectedDealers?.longitude) {
        if (dropLocationType?.id == 452) {
          setTravelKM(selectedDealers?.distance);
        } else {
          getDistance(
            [
              Number(caseDetail?.breakdownLat),
              Number(caseDetail?.breakdownLong),
            ],
            [
              Number(selectedDealers?.latitude),
              Number(selectedDealers?.longitude),
            ]
          );
        }
      } else {
        getDistance(
          [Number(caseDetail?.breakdownLat), Number(caseDetail?.breakdownLong)],
          [Number(dplat), Number(dplng)]
        );
      }
    }
  }, [caseDetail, dplat, dplng, selectedDealers]);
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
        setTravelKM((distanceValue / 1000).toFixed(2) + " km");
        if (
          dropLocationType?.id == 451 &&
          (customerPreferredLocation?.id == 462 ||
            customerPreferredLocation?.id == 463 ||
            customerPreferredLocation?.id == 464)
        ) {
          if (distanceText.includes("m") && !distanceText.includes("km")) {
            // console.log("distanceValue ", distanceValue);
            let value = (distanceValue / 1000).toFixed(2) + " km";
            setValue("dropToBreakdownDistance", value);
            setBdValue("dealerToBreakdownDistance", value);
          } else {
            setValue(
              "dropToBreakdownDistance",
              (distanceValue / 1000).toFixed(2) + " km"
            );
            setBdValue(
              "dealerToBreakdownDistance",
              (distanceValue / 1000).toFixed(2) + " km"
            );
          }
        } else {
          setValue(
            "dealerToBreakdownDistance",
            (distanceValue / 1000).toFixed(2) + " km"
          );
          setBdValue(
            "dealerToBreakdownDistance",
            (distanceValue / 1000).toFixed(2) + " km"
          );
        }
        // console.log("Distance:", distanceText, response.rows[0].elements[0]);
        // console.log("Distance value:", distanceValue);
      } else {
        console.error("Error:", status);
      }
    });
  };
  const handleDropLocationTypeChange = (e) => {
    // console.log("DropLocationTypeChange", e);
    if (e.value.id == 452) {
      mutate({
        clientId: caseDetail?.clientId,
        caseTypeId: caseDetail?.caseTypeId ?? 413,
        bdLat: caseDetail?.breakdownLat,
        bdLong: caseDetail?.breakdownLong,
      });
      // Reset dropStateId when changing to dealer (dealers don't have stateId)
      setDropStateId(null);
    }
    // clearDropLocationValues();
    resetField("customerPreferredLocation");
    // clearDropMarkers();
  };

  const handlePreferredLocationTypeChange = (e) => {
    resetField("dealers");
    resetField("dealer_location");
    resetField("dealerToBreakdownDistance");
    resetField("dropdownlocation");
    resetField("dropnearest_city");
    resetField("droplatlng");
    resetField("droparea");
    resetField("dropToBreakdownDistance");
    // Reset dropStateId when customer preferred location is Dealer (id 461)
    if (e.value?.id == 461) {
      setDropStateId(null);
    }
  };
  const handleDealerSelect = (e) => {
    // console.log("Dealer Event => ", e, locations);
    setValue("dealer_location", e?.value?.dealerLocation);
    setValue("dealerToBreakdownDistance", e?.value?.distance);
  };
  const handleDealerSearch = (event) => {
    if (event?.query?.length > 2) {
      mutate({
        clientId: caseDetail?.clientId,
        caseTypeId: caseDetail?.caseTypeId ?? 413,
        bdLat: caseDetail?.breakdownLat,
        bdLong: caseDetail?.breakdownLong,
        dropLocationTypeId: dropLocationType?.id,
        searchKey: event.query,
      });
    }
  };
  // Manual Location Select
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
        // console.log("lat", lat, lng);
        setBdValue("lattiude_longtitude", {
          lat: lat,
          lng: lng,
        });
        setBdValue("nearestCity", city);
        setValue("customerLocation", { description: value.description });
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
    field.onChange(e.value);
    setValue(`${field.name}`, e.value);
    if (e.value == "") {
      setTravelKM(null);
      if (field?.name == "breakdownlocation") {
        resetFieldBd("lattiude_longtitude");
        resetFieldBd("area_id");
        resetFieldBd("dealerToBreakdownDistance");
      } else {
        resetField("dropnearest_city");
        resetField("droplatlng");
        resetField("dropToBreakdownDistance");
        resetField("droparea");
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
        // clearDropMarkers();
      }
    }
  };
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
  const handleDealerSearchSelect = (value) => {
    // console.log("Dealer Selection Event => ", value);
    setValue("dealer_location", value?.dealerLocation);
  };

  useEffect(() => {
    if (selectedBdLocation?.description) {
      getGeocode({ address: selectedBdLocation?.description }).then(
        (results) => {
          handleStateCode(results[0], "breakdownlocation");
        }
      );
    } else {
      setAreaList([]);
    }
  }, [selectedBdLocation?.description]);

  useEffect(() => {
    // console.log("droplocation changes", selectedDropLocation);
    if (selectedDropLocation?.description) {
      getGeocode({ address: selectedDropLocation?.description }).then(
        (results) => {
          handleStateCode(results[0], "dropdownlocation");
        }
      );
    } else {
      setAreaDropList([]);
    }
  }, [selectedDropLocation?.description]);

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
  const handleEditBreakdown = (values) => {
    // console.log("Beakdown values", values, breakStateId);
    updateMutate(
      {
        caseDetailId: caseDetail?.caseDetailId,
        editType: 1, //1-Breakdown,2-Drop
        activityId: activityIdReimbursement,
        breakdownLocationReason: values?.breakdownLocationReason,
        breakdownLocation: values?.breakdownlocation?.description,
        breakdownLat: values?.lattiude_longtitude?.lat.toString(),
        breakdownLong: values?.lattiude_longtitude?.lng?.toString(),
        breakdownAreaId: values?.area_id?.id,
        breakdownToDropDistance:
          caseDetail?.dropLocation != null
            ? values?.dealerToBreakdownDistance
            : null,
        breakdownStateId: breakStateId, //Get state frome breakdown location
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setBreakdownVisible(false);
            refetchCaseDetails();
            nearASPRefetch();
            activityViewRefetch(); //refetch activity data to get updated customerNeedToPay
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
    <>
      <div className="delivery-request-info-card">
        {/* <div className="row row-gap-3_4 h-100 mb-2_3">
          <div className="col-md-6 border-right">
            <div className="delivery-request-info-header">
              <h4 className="delivery-request-title">Case Info</h4>
              <span className="delivery-request-sub">
                {" "}
                - {caseDetail?.caseNumber}
              </span>
            </div>
            <div className="delivery-request-detail">
              <div className="delivery-request-name">
                <img src={SpannerImage} alt="spanner_icon" />
                <span>
                  {caseDetail?.caseSubject} - {activityData?.subService}
                </span>
              </div>
              <div className="delivery-request-name">
                <img src={KMStoneIcon} alt={"milestone-icon"} />
                <span>--</span>
              </div>

              <div className="delivery-request-name">
                <img src={CalendarViewIcon} alt={"milestone-icon"} />
                <span>
                  {caseDetail?.createdAt}{" "}
                  {caseDetail?.deliveryRequestPickupTime}
                </span>
              </div>
              <div className="delivery-request-name">
                <img src={VehicleGreyIcon} alt={"milestone-icon"} />
                <span>{caseDetail?.vehicleMake}</span>
                <span className="vehicle-detail">{caseDetail?.vin}</span>
                <span className="vehicle-detail">
                  {caseDetail?.vehicleModel}
                </span>
                <span className="vehicle-detail">
                  {caseDetail?.vehicleType}
                </span>
              </div>
            </div>
            
          </div>
          <div className="col-md-6">
            <div className="delivery-location-header">
              <h4 className="delivery-location-title">Location Details</h4>
              <button type="button" className="btn btn-close" onClick={handleClose}>
                <img className="img-fluid" src={CloseIcon} alt="Close" />
              </button>
            </div>
            <div className="delivery-location-content">
              <div className="location">
                <h4 className="delivery-location-content-title">
                  Breakdown Location
                </h4>
                <div className="d-flex gap-3">
                  <p className="delivery-location-content-text">
                    {caseDetail?.breakdownLocation}
                  </p>
                  <div
                    className="request-blue_text"
                    onClick={() => setDropLocationForm(!true)}
                  >
                    Edit
                  </div>
                </div>
              </div>
              {caseDetail?.dropLocation && 
                <div className="location">
                  <h4 className="delivery-location-content-title">
                    Drop Location
                  </h4>
                  <div className="d-flex gap-3">
                    <p className="delivery-location-content-text">
                      {caseDetail?.dropLocation}
                    </p>
                    <div
                      className="request-blue_text"
                      onClick={() => setDropLocationForm(!true)}
                    >
                      Edit
                    </div>
                  </div>
                </div>
              }
             
            </div>
          </div>
        </div> */}
        <div className="delivery-request-info-card-header">
          <Accordion
            className="assignment-accordin"
            expandIcon={(options) => (
              <ChevronDownSquareIcon {...options.iconProps} />
            )}
            collapseIcon={(options) => (
              <ChevronUpSquareIcon {...options.iconProps} />
            )}
          >
            <AccordionTab header="Location Details">
              <div className="row row-gap-3_4">
                <div className="col-md-6 border-right">
                  <div className="delivery-location-content">
                    <div className="location">
                      <h4 className="delivery-location-content-title">
                        Breakdown Location
                      </h4>
                      <div className="d-flex gap-3 mb-2">
                        <p className="delivery-location-content-text">
                          {/* 96, Ranganath, Extension, Gopal Gowda, Shivamogga,
                          Karnataka. */}
                          {caseDetail?.breakdownLocation}
                        </p>
                        {caseDetail?.caseStatusId == 2 &&
                          // !caseDetail?.positiveActivityExists &&
                          !caseDetail?.hasReachedBreakdown &&
                          permissions?.includes(
                            "edit-breakdown-location-web"
                          ) && (
                            <div
                              className="request-blue_text"
                              onClick={() => {
                                setBreakdownVisible(true);
                                refetchCaseDetails();
                                resetBd();
                              }}
                            >
                              Edit
                            </div>
                          )}
                      </div>
                      <div className="d-flex gap-2">
                        <div className="d-inline-flex flex-column values-wrap">
                          <span className="values-label">Customer Name</span>
                          <span className="values-text">
                            {caseDetail?.customerCurrentContactName}
                          </span>
                        </div>
                        <div className="d-inline-flex flex-column values-wrap">
                          <span className="values-label">Customer Number</span>
                          <span className="values-text">
                            {caseDetail?.customerCurrentMobileNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {caseDetail?.dropLocation && (
                  <div className="col-md-6">
                    <div className="location">
                      <h4 className="delivery-location-content-title">
                        Drop Location
                      </h4>
                      <div className="d-flex gap-3">
                        <p className="delivery-location-content-text">
                          {caseDetail?.dropLocation}
                        </p>
                        {caseDetail?.caseStatusId == 2 &&
                          // !caseDetail?.positiveActivityExists &&
                          !caseDetail?.hasReachedBreakdown &&
                          permissions?.includes("edit-drop-location-web") && (
                            <div
                              className="request-blue_text"
                              onClick={() => {
                                setDropLocationForm(true);
                                refetchCaseDetails();
                                reset();
                              }}
                            >
                              Edit
                            </div>
                          )}
                      </div>
                      {caseDetail?.dropLocationType == "Dealer" && (
                        <div className="d-flex gap-2 mt-2">
                          <div className="d-inline-flex flex-column values-wrap">
                            <span className="values-label">Dealer Name</span>
                            <span className="values-text">
                              {caseDetail?.dropDealer}
                            </span>
                          </div>
                          <div className="d-inline-flex flex-column values-wrap">
                            <span className="values-label">Dealer Number</span>
                            <span className="values-text">
                              {caseDetail?.dropDealerMobileNumber || "--"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </AccordionTab>
          </Accordion>
          <div className="delivery-request-info-card-close">
            <button
              type="button"
              className="btn btn-close"
              onClick={handleClose}
            >
              <img className="img-fluid" src={CloseIcon} alt="Close" />
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <Note type={"info"} icon={true} purpose={"note"}>
            <div>
              Comparison of ASPs based on distance, travel time, and other
              parameters to help you select the nearest ASP.
            </div>
          </Note>
          <div className="delivery-request-filter">
            <div className="delivery-request-filter-left">
              <Filters
                onFilterApply={handleFilter}
                filters={filters}
                filterFields={{
                  filterFields: ["Distance", "ASP"],
                  filterData: {
                    distance: data?.data?.data?.map((distance) => {
                      return {
                        code: distance?.id,
                        label: distance?.name,
                      };
                    }),
                  },
                }}
                remove={null}
              />
              <div className="d-flex gap-2">
                <Checkbox
                  onChange={(e) => setThirdPartyAsp(e.checked)}
                  checked={thirdPartyAsp}
                ></Checkbox>
                <label>Include 3rd party ASP</label>
              </div>
              {[1, 4, 8].includes(activityData?.activityStatusId) && (
                <div className="d-flex gap-2">
                  <Checkbox
                    onChange={handleCheckboxChange}
                    checked={reimbursement}
                  ></Checkbox>
                  <label>Reimbursement</label>
                </div>
              )}
              {reimbursement == true && (
                <Dialog
                  className="reimbursement-dialog"
                  header={
                    <div className="dialog-header">
                      <div className="dialog-header-title">Reimbursement</div>
                    </div>
                  }
                  visible={dialogVisible}
                  onHide={handleDialogClose}
                  closable
                  draggable={false}
                >
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <p>
                      Are you sure you want to submit this case for
                      reimbursement?
                    </p>
                    <div className="form-group">
                      <label className="form-label required">Remarks</label>

                      <Controller
                        name="comments"
                        control={control}
                        rules={{ required: "Remarks is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <InputTextarea
                              {...field}
                              className={`form-control ${
                                fieldState.error ? "p-invalid" : ""
                              }`}
                              placeholder="Comments"
                            />
                            {fieldState?.invalid && (
                              <small className="p-error">
                                {fieldState?.error?.message}
                              </small>
                            )}
                          </>
                        )}
                      />
                    </div>
                    <button className="btn form-submit-btn" type="submit">
                      Confirm
                    </button>
                  </form>
                </Dialog>
              )}
            </div>
            {/*<span
              className="delivery-request-filter-right"
              onClick={handleClearFilter}
            >
              Clear Filter
            </span> */}
          </div>
        </div>
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title"> Edit Drop Location</div>
          </div>
        }
        visible={dropLocationForm}
        position={"bottom"}
        onHide={() => setDropLocationForm(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
        className="w-574"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} id="drop-form">
          <div className="row row-gap-3_4">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Reason</label>
                <Controller
                  name="dropLocationReason"
                  control={control}
                  rules={{
                    required: "Reason is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        id="name"
                        {...field}
                        value={field.value || ""}
                        placeholder="Enter Reason"
                        className={`form-control`}
                      />
                      {errors[field?.name] && (
                        <div className="p-error">
                          {errors[field.name]?.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Drop Location Details */}
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">
                  Drop Location Type
                </label>
                <Controller
                  name="drop_location_type"
                  control={control}
                  rules={{ required: "Drop Location Type is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Drop Location Type "
                        // filter
                        resetFilterOnHide={true}
                        className="form-control-select"
                        options={dropLocationTypes}
                        optionLabel="name"
                        onChange={(e) => {
                          field.onChange(e.value);
                          handleDropLocationTypeChange(e);
                        }}
                      />

                      {errors[field?.name] && (
                        <div className="p-error">
                          {errors[field.name]?.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            {dropLocationType?.id == 451 && (
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">
                    Customer Preferred Location
                  </label>
                  <Controller
                    name="customerPreferredLocation"
                    control={control}
                    rules={{
                      required: "Customer Preferred Location is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Customer Preferred Location"
                          filter
                          resetFilterOnHide={true}
                          className="form-control-select"
                          options={customerPreferredLocations}
                          optionLabel="name"
                          onChange={(e) => {
                            field.onChange(e.value);
                            handlePreferredLocationTypeChange(e);
                          }}
                        />
                        {errors[field?.name] && (
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

            {(dropLocationType?.id == 452 ||
              customerPreferredLocation?.id == 461) && (
              <>
                {dropLocationType?.id == 452 ? (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">Dealers</label>
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
                            {errors[field?.name] && (
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
                      <label className="form-label required">Dealers</label>
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
                                    <span>{dealer.codeWithLegalName}</span>
                                  </div>
                                )}
                              />
                            </>
                          )}
                        />
                        {/* <Button icon={<img src={SearchIcon} />} /> */}
                      </div>
                      {errors["dealers"] && (
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
                      Dealer Drop Location
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
                            className={`form-control`}
                            disabled
                            // readOnly
                          />
                          {errors[field.name] && (
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
                        required: "Breakdown to Drop Distance is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            value={field.value || ""}
                            className={`form-control `}
                            placeholder="Breakdown to Drop Distance"
                            disabled
                          />
                          {errors[field.name] && (
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

            {dropLocationType?.id == 451 &&
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
                          rules={{ required: "Drop Location is required." }}
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
                                onChange={(e) => {
                                  handleChange(e, field);
                                  resetFieldBd("lattiude_longtitude");
                                  resetFieldBd("area_id");
                                  resetFieldBd("dealerToBreakdownDistance");
                                }}
                                onSelect={(e) => handleSelect(e.value, field)}
                                placeholder="Search places"
                                showEmptyMessage={true}
                              />
                            </>
                          )}
                        />
                        {/* <Button icon={<img src={SearchIcon} />} /> */}
                      </div>
                      {errors["dropdownlocation"] && (
                        <div className="p-error">
                          {errors["dropdownlocation"]?.message}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className="col-md-6">
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
                            {errors[field.name] && (
                              <div className="p-error">
                                {errors[field.name]?.message}
                              </div>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div> */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        Drop Latitude & longitude
                      </label>
                      <Controller
                        name="droplatlng"
                        control={control}
                        rules={{
                          required: "Drop Latitude & longitude is required.",
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
                            {errors[field.name] && (
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
                                disabled={!selectedDropLocation?.description}
                                options={areaDropList}
                                optionLabel="name"
                                onChange={(e) => {
                                  //handleAreaSearch(e, dropStateId)
                                  field.onChange(e.value);
                                }}
                              />
                            )}
                            {errors[field.name] && (
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
                        name="dropToBreakdownDistance"
                        control={control}
                        rules={{
                          required: "Breakdown to Drop Distance is required.",
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
                            {errors[field.name] && (
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
          </div>

          <div className="d-flex justify-content-end mt-3_4">
            <Button
              className="btn form-submit-btn"
              type="submit"
              form="drop-form"
              loading={updateIsLoading}
            >
              Confirm
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title"> Edit Breakdown Location</div>
          </div>
        }
        visible={breakdownVisible}
        position={"bottom"}
        onHide={() => setBreakdownVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
        className="w-574"
      >
        <form
          onSubmit={handleBreakdownLocation(handleEditBreakdown)}
          id="bd-form"
        >
          <div className="row row-gap-3_4">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Reason</label>
                <Controller
                  name="breakdownLocationReason"
                  control={bdControl}
                  rules={{
                    required: "Reason is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        id="name"
                        {...field}
                        value={field.value || ""}
                        placeholder="Enter Reason"
                      />
                      {errorsBd[field.name] && (
                        <div className="p-error">
                          {errorsBd[field.name]?.message}
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
                  Breakdown Location
                </label>
                <div className="p-inputgroup ">
                  <Controller
                    name="breakdownlocation"
                    control={bdControl}
                    rules={{
                      required: "Breakdown Location is required.",
                    }}
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
                          onChange={(e) => handleChange(e, field)}
                          onSelect={(e) =>
                            handleSelect(e.value, field, "breakdown")
                          }
                          // disabled={locationVia?.id !== 493 ? true : false}
                          placeholder="Search places"
                          showEmptyMessage={true}
                        />
                      </>
                    )}
                  />
                </div>
                {errorsBd["breakdownlocation"] && (
                  <div className="p-error">
                    {errorsBd["breakdownlocation"]?.message}
                  </div>
                )}
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Nearest City</label>
                <Controller
                  name="nearestCity"
                  control={bdControl}
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
                    </>
                  )}
                />
              </div>
            </div> */}
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">
                  BD Latitude & longitude
                </label>
                <Controller
                  name="lattiude_longtitude"
                  control={bdControl}
                  rules={{ required: "BD Latitude & longitude is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        value={
                          field.value && `${field.value.lat}&${field.value.lng}`
                        }
                        className={`form-control`}
                        placeholder="Enter BD Latitude & longitude"
                        disabled
                      />
                      {errorsBd[field.name] && (
                        <div className="p-error">
                          {errorsBd[field.name]?.message}
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
                  name="area_id"
                  control={bdControl}
                  rules={{ required: "Area is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      {showAutoComplete ? (
                        <AutoComplete
                          placeholder="Enter Area"
                          inputId={field.name}
                          value={field.value}
                          inputRef={field.ref}
                          field="name"
                          suggestions={areaList}
                          completeMethod={(event) =>
                            handleAreaSearch(event, breakStateId)
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
                          disabled={!selectedBdLocation?.description}
                          options={areaList}
                          optionLabel="name"
                          onChange={(e) => {
                            //handleAreaSearch(e, breakStateId)
                            field.onChange(e.value);
                          }}
                        />
                      )}
                      {errorsBd[field.name] && (
                        <div className="p-error">
                          {errorsBd[field.name]?.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            {caseDetail?.dropLocation != null && (
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">
                    Breakdown to Drop Distance
                  </label>
                  <Controller
                    name="dealerToBreakdownDistance"
                    control={bdControl}
                    // rules={{
                    //   required: "Breakdown to Drop Distance is required.",
                    // }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          value={field.value || ""}
                          className={`form-control `}
                          placeholder="Enter Breakdown to Drop Distance"
                          disabled
                        />
                        {/* {errorsBd [field.name] && (
                        <div className="p-error">
                          {errorsBd [field.name]?.message}
                        </div>
                      )} */}
                      </>
                    )}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end mt-3_4">
            <Button
              className="btn form-submit-btn"
              type="submit"
              form="bd-form"
              loading={updateIsLoading}
            >
              Confirm
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default CaseInfoCard;
