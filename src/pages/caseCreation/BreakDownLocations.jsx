import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useState, useRef } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import Note from "../../components/common/Note";
import { Button } from "primereact/button";
import ServiceDetailCard from "../home/ServiceDetailCard";
import {
  CollapseMinusIcon,
  CollapsePlusIcon,
  EndLocation,
  GoogleMapAPIKey,
  GreenLocationMarker,
  SearchIcon,
  StartLocation,
} from "../../utills/imgConstants";
import "./style.less";
import GoogleMapReact from "google-map-react";
import TravelledKM from "../../components/common/TravelledKM";
import { setCaseData } from "../../../store/slices/caseSlice";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { AutoComplete } from "primereact/autocomplete";
import { useMutation } from "react-query";
import {
  getNearestDealersByLocation,
  sendLocationURL,
  getStateId,
  getCityMaster,
  getReceivedSMSId,
} from "../../../services/caseService";
import { toast } from "react-toastify";
import moment from "moment";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useDispatch, useSelector } from "react-redux";
import { CaseSMSId, ExistingCaseSMSId } from "../../../store/slices/caseSlice";
import { getCityId } from "../../../services/masterServices";
const BreakDownLocations = ({
  formErrors,
  formOptions,
  client,
  entitlementData,
  setFullEntitlementVisible,
  activeIndexTab,
}) => {
  const dispatch = useDispatch();
  const receivedSMSId = useSelector(CaseSMSId);
  const existingCaseSMSId = useSelector(ExistingCaseSMSId);
  const { control, setValue, resetField, getValues } = useFormContext();
  const [remainingTime, setRemainingTime] = useState(60);
  const [showRemainingTime, setShowRemainingTime] = useState(false);
  const [sentToList, setSentToList] = useState([]);
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
  const [drag, setDrag] = useState(false);
  const [fetchingStateId, setFetchingStateId] = useState({});
  const infoWindowsRef = useRef([]);
  const markerClickTimeRef = useRef(0);
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
  const selectedPolicyNumber = useWatch({ name: "policyNumber" });
  const selectedPolicyStart = useWatch({ name: "policyStartDate" });
  const selectedPolicyEnd = useWatch({ name: "policyEndDate" });
  const selectedContactNumber = useWatch({ name: "mobileNumber" });
  const selectedPolicyType = useWatch({ name: "policyType" });
  const selectedCurrentContactNumber = useWatch({
    name: "currentMobileNumber",
  });
  const selectedAlternateContactNumber = useWatch({
    name: "alternateMobileNumber",
  });
  const selectedContactName = useWatch({ name: "contactName" });
  const selecteSentToMobile = useWatch({ name: "sentToMobile" });
  const selectedBdLocation = useWatch({ name: "breakdownlocation" });
  const selectedDropLocation = useWatch({ name: "dropdownlocation" });
  const selectedCustomerLocation = useWatch({ name: "customerLocation" });
  const selectedStateID = useWatch({ name: "customerStateId" });
  const selectedAreaId = useWatch({ name: "area_id" });
  const selectedDroparea = useWatch({ name: "droparea" });
  // console.log("breakStateId", breakStateId);
  // console.log("selectedBdLocation", selectedBdLocation?.description);
  // console.log("travelKM => ", travelKM);
  // console.log("locations => ", locations);
  // console.log(
  //   "selecteSentToMobile => ",
  //   selecteSentToMobile,
  //   selectedContactNumber
  // );
  //console.log("map =>", map);
  const locationVia = useWatch({
    name: "locationvia",
    control,
  });
  const breakdownlocation = useWatch({
    name: "breakdownlocation",
    control,
  });

  const { lat: bdlat, lng: bdlng } = useWatch({
    name: "lattiude_longtitude",
    control,
  });

  const { lat: dplat, lng: dplng } = useWatch({
    name: "droplatlng",
    control,
  });

  const caseType = useWatch({
    name: "caseType",
    control,
  });

  const caseServiceType = useWatch({
    name: "service",
    control,
  });

  const selectedCaseSubService = useWatch({ name: "subService", control });

  const dropLocationType = useWatch({
    name: "drop_location_type",
    control,
  });
  const selectedDealers = useWatch({
    name: "dealers",
    control,
  });
  const customerPreferredLocation = useWatch({
    name: "customerPreferredLocation",
    control,
  });
  // console.log("locationvia", locationVia);

  // console.log("breakdownlocation", breakdownlocation);

  const locationLinkResend = () => {
    let time = 60;
    const timerInterval = setInterval(() => {
      // console.log("timerInterval", timerInterval, remainingTime, time);
      if (time > 0) {
        time = time - 1;
        setRemainingTime(time);
      } else {
        clearInterval(timerInterval);
        setShowRemainingTime(false);
      }
    }, 1000); // Update every second
  };

  useEffect(() => {
    const numberArray = [
      selectedContactNumber,
      selectedCurrentContactNumber,
      selectedAlternateContactNumber,
    ];
    //Filter out null values
    const filteredArray = numberArray.filter(
      (item) => item !== null && item !== undefined && item !== ""
    );
    // Remove duplicates
    const uniqueArray = Array.from(new Set(filteredArray));
    const numberOptions = uniqueArray?.map((num) => {
      return {
        label: num,
        value: num,
      };
    });
    // console.log("Num Array", uniqueArray);
    setSentToList(numberOptions);
  }, [
    selectedContactNumber,
    selectedCurrentContactNumber,
    selectedAlternateContactNumber,
  ]);

  const { mutate, data: dealersData } = useMutation(
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

  const {
    data: receivedSMSData,
    mutate: receivedSMSMutate,
    isLoading: receivedSMSLoading,
  } = useMutation(getReceivedSMSId);

  const { mutate: sendToMobileMutate, isLoading: sendToMobileLoading } =
    useMutation(sendLocationURL, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          /* const tempID = res?.data?.url?.split('&');
          const id = tempID[1].split('=')[1]; */
          // console.log("URL ID => ", res?.data?.id);
          dispatch(
            setCaseData({
              caseSMSId: res?.data?.id,
              existingCaseSMSId: res?.data?.id,
            })
          );
          setRemainingTime(60);
          setShowRemainingTime(true);
          locationLinkResend();
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    });

  const { mutate: getStateIdMutate, isLoading: getStateIdLoading } =
    useMutation(getStateId, {
      // Removed global onSuccess/onError to allow local handlers to work properly
      // Error handling is done in the local onError callbacks
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
  const {
    data: bdCitiesData,
    mutate: getBdCitiesMutate,
    isLoading: getBdCitiesLoading,
  } = useMutation(getCityMaster);
  const {
    data: dropCitiesData,
    mutate: getDropCitiesMutate,
    isLoading: getDropCitiesLoading,
  } = useMutation(getCityMaster);

  // console.log("dealersData", dealersData);
  const getDirection = (origin, destination) => {
    // console.log("Get direction", origin, destination);
    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin,
      destination,
      //waypoints,
      travelMode: "DRIVING", // You can change the mode to WALKING, BICYCLING, or TRANSIT
    };
    directionsService?.route(request, (response, status) => {
      // console.log("direction response", response);
      // Clear existing direction renderer
      // Remove previous direction renderer if exists
      if (directions) {
        directions.setMap(null);
      }

      // Create a new direction renderer
      const newDirectionsRenderer = new google.maps.DirectionsRenderer({
        directions: response,
        suppressMarkers: true, // Customize as needed
        polylineOptions: {
          strokeColor: "#1A2E35", // Customize the color of your direction line
          strokeOpacity: 0.8,
          strokeWeight: 3,
        },
      });
      // console.log("newDirectionsRenderer", newDirectionsRenderer);
      newDirectionsRenderer.setMap(map);
      newDirectionsRenderer.setDirections(response);
      setDirections(newDirectionsRenderer);
      setDrag(false);
    });
  };

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
        // console.log("Distance:", distanceText, response.rows[0].elements[0]);
        // console.log("Distance value:", distanceValue);
      } else {
        console.error("Error:", status);
      }
    });
  };

  /* useEffect(() => {
    const timerInterval = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime((prevTime) => prevTime - 1);
      } else {
        clearInterval(timerInterval);
      }
    }, 1000); // Update every second
    if (remainingTime == 0) {
      setRemainingTime(60);
    }
    return () => {
      clearInterval(timerInterval);
    };
  }, [remainingTime]); */

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const handleApiLoaded = (map, maps) => {
    // console.log("direction called", map);
    setMap(map);

    // Function to close all InfoWindows
    const closeAllInfoWindows = () => {
      // Don't close if a marker was just clicked (within 100ms)
      const timeSinceMarkerClick = Date.now() - markerClickTimeRef.current;
      if (timeSinceMarkerClick < 100) {
        return;
      }
      infoWindowsRef.current.forEach((window) => {
        if (window) {
          window.close();
        }
      });
    };

    // Add click listener to map to close InfoWindows when clicking outside
    map.addListener("click", () => {
      closeAllInfoWindows();
    });
  };

  const clearAllMarkers = () => {
    if (markers) {
      markers?.forEach((marker) => {
        marker.setMap(null);
      });
    }
  };

  const clearDropMarkers = () => {
    const exitDropMarker = markers.filter(
      (marker) => marker?.title === "Drop Location"
    );
    if (exitDropMarker.length > 0) {
      // console.log("Removing Drop Markers: ", exitDropMarker);
      exitDropMarker.forEach((marker) => marker.setMap(null));
      setMarkers((prevMarkers) =>
        prevMarkers.filter((marker) => marker?.title !== "Drop Location")
      );
    }
  };

  const handleSearch = (event) => {
    // console.log("Location event => ", event);
    var options = {
      types: ["(cities)"],
      componentRestrictions: { country: "us" },
    };

    var input = document.getElementById("searchTextField");
    if (input) {
      var autocomplete = new google.maps.places.Autocomplete(input, options);
      // console.log("Autocomplete", autocomplete);
    }
    setSearchValue(event.query);
  };

  const handleStateCode = (results, fieldName) => {
    if (results?.address_components) {
      // Extract city or locality from address components
      const addressComponents = results?.address_components;

      const stateComponent = addressComponents.find((component) =>
        component.types.includes("administrative_area_level_1")
      );
      if (stateComponent?.short_name) {
        const stateCode = stateComponent?.short_name;
        const fetchKey = `${fieldName}_${stateCode}`;

        // Prevent duplicate calls for the same field and state code
        if (fetchingStateId[fetchKey]) {
          return;
        }

        setFetchingStateId((prev) => ({ ...prev, [fetchKey]: true }));

        try {
          getStateIdMutate(
            {
              code: stateCode,
            },
            {
              onSuccess: (res) => {
                setFetchingStateId((prev) => {
                  const newState = { ...prev };
                  delete newState[fetchKey];
                  return newState;
                });

                // Check if response is successful
                if (res?.data?.success && res?.data?.data?.id) {
                  const stateId = res?.data?.data?.id;
                  if (fieldName == "breakdownlocation") {
                    setBreakStateId(stateId);
                    setValue("breakdownLocationStateId", stateId, {
                      shouldValidate: false,
                      shouldDirty: true,
                    });
                  } else {
                    setDropStateId(stateId);
                    setValue("dropLocationStateId", stateId, {
                      shouldValidate: false,
                      shouldDirty: true,
                    });
                  }
                } else {
                  // Show error if API returned success=false
                  if (res?.data?.success == false) {
                    if (res?.data?.error) {
                      toast.error(res?.data?.error);
                    } else if (res?.data?.errors) {
                      res?.data?.errors.forEach((err) => toast.error(err));
                    }
                  }
                }
              },
              onError: (error) => {
                // Show error toast
                if (error?.response?.data?.error) {
                  toast.error(error.response.data.error);
                } else if (error?.response?.data?.errors) {
                  error.response.data.errors.forEach((err) => toast.error(err));
                } else {
                  toast.error("Failed to get state ID. Please try again.");
                }

                setFetchingStateId((prev) => {
                  const newState = { ...prev };
                  delete newState[fetchKey];
                  return newState;
                });
              },
            }
          );
        } catch (error) {
          console.error("Exception calling getStateIdMutate:", error);
          setFetchingStateId((prev) => {
            const newState = { ...prev };
            delete newState[fetchKey];
            return newState;
          });
        }
      }
    }
  };
  useEffect(() => {
    if (drag) {
      clearDropMarkers();
      directions?.setMap(null);
      setDirections(null);
    }
  }, [drag]);
  useEffect(() => {
    if (selectedBdLocation?.description) {
      // Use a small timeout to ensure the value is set before geocoding
      const timeoutId = setTimeout(() => {
        // Check if stateId is already set to avoid unnecessary API calls
        const currentStateId = getValues("breakdownLocationStateId");
        if (currentStateId) {
          return;
        }

        getGeocode({ address: selectedBdLocation?.description })
          .then((results) => {
            if (results && results[0] && results[0]?.address_components) {
              handleStateCode(results[0], "breakdownlocation");
            }
          })
          .catch((error) => {
            console.error("Error in geocoding breakdown location:", error);
          });
      }, 200);

      return () => clearTimeout(timeoutId);
    } else {
      setAreaList([]);
      // Reset stateId when breakdown location is cleared
      setBreakStateId(null);
      setValue("breakdownLocationStateId", null);
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

  useEffect(() => {
    // console.log("Customer Location", selectedCustomerLocation);
    if (selectedCustomerLocation?.description) {
      getGeocode({ address: selectedCustomerLocation?.description }).then(
        (results) => {
          if (results?.length > 0) {
            if (results[0]?.address_components) {
              // Extract city or locality from address components
              const addressComponents = results[0]?.address_components;

              const stateComponent = addressComponents.find((component) =>
                component.types.includes("administrative_area_level_1")
              );
              // console.log("customer stateComponent => ", stateComponent);
              getStateIdMutate(
                {
                  code: stateComponent?.short_name,
                },
                {
                  onSuccess: (res) => {
                    // console.log("Customer State Res", res?.data);
                    if (res?.data?.success) {
                      // console.log("Customer State", res?.data?.data);
                      /* setCustomerState([{
                        id: res?.data?.data?.id,
                        code: stateComponent?.short_name,
                        name: res?.data?.data?.name
                      }]); */
                      setValue("customerStateId", {
                        id: res?.data?.data?.id,
                        name: res?.data?.data?.name,
                      });
                    }
                  },
                }
              );
            }
          }
        }
      );
    } else {
      // resetField('customerStateId')
    }
  }, [selectedCustomerLocation?.description]);

  // Manual Location Select
  const handleSelect = (value, field) => {
    clearSuggestions();
    // Ensure the breakdown location value is set first
    if (field?.name == "breakdownlocation") {
      setValue("breakdownlocation", value);
    }
    getGeocode({ address: value.description }).then((results) => {
      // console.log("Geo Location Result => ", results);
      if (!results || !results[0]) {
        console.error("No geocode results found");
        return;
      }
      const addressComponents = results[0]?.address_components;
      if (!addressComponents) {
        console.error("No address components found");
        return;
      }
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
        setValue("customerLocation", { description: value.description });
        // resetField("dealerToBreakdownDistance");
        // resetField("dealer_location");
        // Get and set breakdown location stateId - call this immediately
        // This ensures stateId is set when manually selecting a location
        handleStateCode(results[0], "breakdownlocation");
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
        // Get and set drop location stateId (only if not dealer)
        if (
          dropLocationType?.id == 451 &&
          customerPreferredLocation?.id != 461
        ) {
          handleStateCode(results[0], "dropdownlocation");
        }
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
  useEffect(() => {
    if (activeIndexTab) {
      if (locationVia?.id == 491 || locationVia?.id == 492) {
        handleFetchSMSLocation();
      } else if (selectedCustomerLocation?.description) {
        handleSelect(
          selectedCustomerLocation,
          { name: "breakdownlocation" },
          "breakdown"
        );
      }
    }
    if (selectedDropLocation?.description) {
      setTimeout(() => {
        handleSelect(selectedDropLocation, { name: "dropdownlocation" });
      }, 200);
    }
    //}
  }, [activeIndexTab]);

  const handleChange = (e, field) => {
    // console.log("location changed", field.name, e);
    setValue(`${field.name}`, e.value);
    if (e.value == "") {
      setTravelKM(null);
      if (field?.name == "breakdownlocation") {
        resetField("nearestCity");
        resetField("lattiude_longtitude");
        resetField("area_id");
        resetField("breakdownLocationStateId");
        setBreakStateId(null);
        resetField("drop_location_type");
        resetField("customerPreferredLocation");
        // resetField("customerLocation");
        clearDropLocationValues();
        clearAllMarkers();
      } else {
        resetField("dropnearest_city");
        resetField("droplatlng");
        resetField("dropToBreakdownDistance");
        resetField("droparea");
        resetField("dropLocationStateId");
        setDropStateId(null);
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
        clearDropMarkers();
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
    resetField("dropLocationStateId");
    setDropStateId(null);
    setTravelKM(null);
    if (locations?.breakdown) {
      setLocations({
        breakdown: locations?.breakdown,
      });
    }

    if (directions) {
      // console.log("DropLocationTypeChange directions => ", directions);
      directions.setMap(null);
      //directions.setDirections({ routes: [] });
      setDirections(null);
    }
  };

  const handleDropLocationTypeChange = (e) => {
    // console.log("DropLocationTypeChange", e);
    if (e.value.id == 452) {
      mutate({
        clientId: client?.id,
        caseTypeId: caseType.id ?? 413,
        bdLat: String(bdlat),
        bdLong: String(bdlng),
      });
      // Reset dropStateId when changing to dealer (dealers don't have stateId)
      setDropStateId(null);
      setValue("dropLocationStateId", null);
    }
    clearDropLocationValues();
    resetField("customerPreferredLocation");
    clearDropMarkers();
  };

  const handlePreferredLocationTypeChange = (e) => {
    // console.log("handlePreferredLocationTypeChange", e);
    clearDropLocationValues();
    clearDropMarkers();
    // Reset dropStateId when customer preferred location is Dealer (id 461)
    if (e.value?.id == 461) {
      setDropStateId(null);
      setValue("dropLocationStateId", null);
    }
  };

  useEffect(() => {
    // console.log("Selected caseServiceType", caseServiceType);
    if (caseServiceType && caseServiceType?.id !== 1) {
      resetField("drop_location_type");
      resetField("customerPreferredLocation");
      clearDropLocationValues();
      // console.log("Selected caseServiceType True", caseServiceType, locations, travelKM);
    }
  }, [caseServiceType]);

  useEffect(() => {
    if (bdlat && bdlng) {
      if (dropLocationType?.id == 452) {
        mutate({
          clientId: client?.id,
          caseTypeId: caseType.id ?? 413,
          bdLat: String(bdlat),
          bdLong: String(bdlng),
        });
      }
    }
  }, [caseType, bdlat, bdlng]);

  // console.log("dealersData", dealersData);

  const handleDealerSelect = (e) => {
    // console.log("Dealer Event => ", e, locations);
    setValue("dealer_location", e?.value?.dealerLocation);
    setValue("dealerToBreakdownDistance", e?.value?.distance);
  };

  const handleDealerSearch = (event) => {
    if (event?.query?.length > 2) {
      mutate({
        clientId: client?.id,
        caseTypeId: caseType.id ?? 413,
        bdLat: String(bdlat),
        bdLong: String(bdlng),
        dropLocationTypeId: dropLocationType?.id,
        searchKey: event.query,
      });
    }
  };
  const handleDealerSearchSelect = (value) => {
    // console.log("Dealer Selection Event => ", value);
    setValue("dealer_location", value?.dealerLocation);
  };

  const handleLocationVia = (e) => {
    if (e.value?.id !== 493) {
      setValue("sentToMobile", selectedContactNumber);
    } else {
      resetField("sentToMobile");
    }
    resetField("locationreason");
    resetField("breakdownlocation");
    resetField("nearestCity");
    resetField("lattiude_longtitude");
    resetField("area_id");
    // resetField("customerLocation")
    // resetField("customerStateId")
    setTravelKM(null);
    clearDropLocationValues();
    clearAllMarkers();
  };

  const handleMobileChange = (e) => {
    resetField("breakdownlocation");
    resetField("nearestCity");
    resetField("lattiude_longtitude");
    resetField("area_id");
    setTravelKM(null);
    if (existingCaseSMSId) {
      dispatch(
        setCaseData({
          existingCaseSMSId: existingCaseSMSId,
          caseSMSId: null,
        })
      );
    }
  };

  const handleSentTo = () => {
    // console.log('Existing Case SMS ID => ', existingCaseSMSId, receivedSMSId);
    if (selecteSentToMobile) {
      sendToMobileMutate({
        getLocationViaId: locationVia?.id,
        customerName: selectedContactName,
        target: selecteSentToMobile,
        existingLocationLogId: existingCaseSMSId || null,
      });
    }
  };

  // console.log('Entitlement Data => ', entitlementData);
  // console.log('Get Location Form Options => ', formOptions);

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

  const clearRoute = () => {
    //if (directions) {
    // console.log("Clearing existing directions...");

    // ✅ Ensure the route is removed from the map
    directions.setMap(null);
    //directions.setDirections({ routes: [] }); // Explicitly clear routes

    // ✅ Set state immediately
    setDirections(null);
    setTimeout(() => {
      setDirections(null);
      // console.log("✅ Route Cleared & State Reset!");
    }, 0);

    // console.log("Directions successfully cleared!", directions);
    //}
  };

  const addBreakdownMarker = (lat, lng, address) => {
    // ✅ **Step 1: Remove Existing Breakdown Marker**
    markers.forEach((marker) => {
      if (marker.title === "Breakdown Location") {
        marker.setMap(null);
      }
    });

    const breakdownLocation = { lat: Number(lat), lng: Number(lng) };

    const BreakdownWindow = new google.maps.InfoWindow({
      content: `<div class="asp-location">
                    <div class="location-title">Breakdown Location</div>
                    <div class="location-detail">${address || "--"}</div>
                  </div>`,
      ariaLabel: "Breakdown Location",
    });

    // Store InfoWindow in ref
    const existingBreakdownWindow = infoWindowsRef.current.find(
      (w) => w && w.getContent && w.getContent().includes("Breakdown Location")
    );
    if (existingBreakdownWindow) {
      const index = infoWindowsRef.current.indexOf(existingBreakdownWindow);
      infoWindowsRef.current[index] = BreakdownWindow;
    } else {
      infoWindowsRef.current.push(BreakdownWindow);
    }

    const breakdownMarker = new google.maps.Marker({
      position: breakdownLocation,
      icon: StartLocation,
      map: map,
      title: "Breakdown Location",
      draggable: true,
    });

    breakdownMarker.addListener("click", () => {
      markerClickTimeRef.current = Date.now();
      BreakdownWindow.open({ anchor: breakdownMarker, map });
      // Close other InfoWindows
      infoWindowsRef.current.forEach((window) => {
        if (window && window !== BreakdownWindow) {
          window.close();
        }
      });
      // console.log("CLICK");
    });

    breakdownMarker.addListener("dragend", async (event) => {
      // console.log("Drag");
      setDrag(true);
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();

      // Reverse Geocode the new location
      const results = await getGeocode({
        location: { lat: newLat, lng: newLng },
      });
      const newAddress = results[0]?.formatted_address;
      const addressComponents = results[0]?.address_components;
      const cityComponent = addressComponents.find(
        (component) =>
          component.types.includes("locality") ||
          component.types.includes("administrative_area_level_1")
      );
      const newCity = cityComponent ? cityComponent.long_name : null;
      const areaComponent = addressComponents.find((component) =>
        component.types.includes("postal_code")
      );
      const area = areaComponent ? areaComponent.long_name : "";
      const stateComponent = addressComponents.find((component) =>
        component.types.includes("administrative_area_level_1")
      );
      const state = stateComponent ? stateComponent?.short_name : "";
      getCityIdMutate(
        {
          pinCode: area ? area.toString() : "",
          district: area ? "" : newCity ? newCity.toString() : "",
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
      setValue("breakdownlocation", { description: newAddress });
      setValue("nearestCity", newCity);
      setValue("lattiude_longtitude", { lat: newLat, lng: newLng });

      //clearDropLocationValues();
      resetField("dealers");
      resetField("dealer_location");
      resetField("dealerToBreakdownDistance");
      resetField("dropdownlocation");
      resetField("dropnearest_city");
      resetField("droplatlng");
      resetField("dropToBreakdownDistance");
      resetField("droparea");
      setTravelKM(null);
      if (locations?.breakdown) {
        setLocations({
          breakdown: locations?.breakdown,
        });
      }

      clearRoute();

      // console.log("Updated Breakdown Location:", newAddress, newLat, newLng);
    });

    setMarkers((prevMarkers) => [...prevMarkers, breakdownMarker]);
  };
  // console.log("directions", directions);

  const addDropMarker = (lat, lng, address) => {
    const exitDropMarker = markers.filter(
      (marker) => marker?.title == "Drop Location"
    );
    if (exitDropMarker) {
      // console.log("Exit Drop Marker => ", exitDropMarker);
      exitDropMarker?.forEach((marker) => {
        marker.setMap(null);
      });
    }

    const dropLocation = { lat: Number(lat), lng: Number(lng) };
    const DropWindow = new google.maps.InfoWindow({
      content: `<div class="asp-location"><div class="location-title">Drop Location</div><div class="location-detail">${
        address || "--"
      } </div></div>`,
      ariaLabel: "Drop Location",
    });

    // Store InfoWindow in ref
    const existingDropWindow = infoWindowsRef.current.find(
      (w) => w && w.getContent && w.getContent().includes("Drop Location")
    );
    if (existingDropWindow) {
      const index = infoWindowsRef.current.indexOf(existingDropWindow);
      infoWindowsRef.current[index] = DropWindow;
    } else {
      infoWindowsRef.current.push(DropWindow);
    }

    const dropMarker = new google.maps.Marker({
      position: { lat: Number(lat), lng: Number(lng) },
      icon: EndLocation,
      map: map,
      title: "Drop Location",
    });

    dropMarker.addListener("click", () => {
      markerClickTimeRef.current = Date.now();
      DropWindow.open({
        anchor: dropMarker,
        map,
      });
      // Close other InfoWindows
      infoWindowsRef.current.forEach((window) => {
        if (window && window !== DropWindow) {
          window.close();
        }
      });
    });

    setMarkers((prevMarkers) => [...prevMarkers, dropMarker]);
  };

  useEffect(() => {
    if (dplat && dplng && bdlat && bdlng) {
      // console.log("Drop Lat & Long =>", dplat, dplng);
      setLocations({
        breakdown: {
          lat: bdlat,
          lng: bdlng,
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
      addDropMarker(dplat, dplng, selectedDropLocation?.description);
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
      addDropMarker(
        selectedDealers?.latitude,
        selectedDealers?.longitude,
        selectedDealers?.dealerLocation
      );
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
      addBreakdownMarker(bdlat, bdlng, selectedBdLocation?.description);
    }
    if (
      bdlat &&
      bdlng &&
      ((dplat && dplng) ||
        (selectedDealers?.latitude && selectedDealers?.longitude))
    ) {
      // console.log("Direction issue => ", dplat, dplng, selectedDealers);
      getDirection(
        {
          lat: Number(bdlat),
          lng: Number(bdlng),
        },
        {
          lat: Number(dplat || selectedDealers?.latitude),
          lng: Number(dplng || selectedDealers?.longitude),
        }
      );
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
          [Number(dplat), Number(dplng)]
        );
      }
    }
  }, [bdlat, bdlng, dplat, dplng, selectedDealers, map]);

  const handleFetchSMSLocation = () => {
    if (receivedSMSId) {
      receivedSMSMutate(
        {
          id: receivedSMSId,
        },
        {
          onSuccess: (res) => {
            // console.log("SMS Location Received Resp => ", res?.data);
            if (res?.data?.success) {
              const location = {
                lat: Number(res?.data?.data?.latitude),
                lng: Number(res?.data?.data?.longitude),
              };
              getGeocode({ location }).then((results) => {
                // console.log("Geo Location by Lat&Lng:", results);
                if (results && results?.length > 0) {
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
                  const state = stateComponent
                    ? stateComponent?.short_name
                    : "";
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
                  setValue("breakdownlocation", {
                    description: results[0]?.formatted_address,
                  });
                  setValue("lattiude_longtitude", {
                    lat: location?.lat,
                    lng: location?.lng,
                  });
                  setValue("nearestCity", city);
                  setValue("customerLocation", {
                    description: results[0]?.formatted_address,
                  });
                  // Get and set breakdown location stateId
                  handleStateCode(results[0], "breakdownlocation");
                } else {
                  toast.error("Address not found");
                }
              });
            } else {
              toast.error(res?.data?.error);
            }
          },
        }
      );
    }
  };

  // console.log("Map Markers => ", markers);

  return (
    <div className="row row-gap-3_4">
      <div className="col-md-6">
        <div className="row row-gap-3_4">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Get Location Via</label>
              <Controller
                name="locationvia"
                control={control}
                rules={{ required: "Get Location Via is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      placeholder="Select Location Via"
                      filter
                      resetFilterOnHide={true}
                      className="form-control-select"
                      options={formOptions?.locationVia}
                      optionLabel="name"
                      onChange={(e) => {
                        field.onChange(e.value);
                        handleLocationVia(e);
                      }}
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
          {locationVia?.id == 493 && (
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">
                  Manual location Reason
                </label>
                <Controller
                  name="locationreason"
                  control={control}
                  rules={{ required: "Manual location Reason is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Reason"
                        filter
                        resetFilterOnHide={true}
                        className="form-control-select"
                        options={formOptions?.manualLocationReasons}
                        optionLabel="name"
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
          )}
          {(locationVia?.id == 491 || locationVia?.id == 492) && (
            <div className="col-md-6">
              <div className="form-group">
                <div className="d-flex">
                  <label className="form-label">Send To</label>
                  {showRemainingTime && (
                    <div className="resend-container">
                      Resend in{" "}
                      <span className="time">{formatTime(remainingTime)}</span>
                    </div>
                  )}
                </div>
                <div className="p-inputgroup">
                  <Controller
                    name="sentToMobile"
                    control={control}
                    rules={{
                      required: "Send To Mobile number is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        {/* <InputText
                          keyfilter="pint"
                          maxLength="10"
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          placeholder="Send To"
                          {...field}
                        /> */}
                        <Dropdown
                          value={field.value}
                          placeholder="Select Number"
                          filter
                          resetFilterOnHide={true}
                          className="form-control-select"
                          options={sentToList}
                          optionLabel="value"
                          onChange={(e) => {
                            field.onChange(e.value);
                            handleMobileChange(e);
                          }}
                        />
                      </>
                    )}
                  />
                  <Button
                    type="button"
                    className="btn-default"
                    loading={sendToMobileLoading}
                    icon="pi pi-send"
                    onClick={handleSentTo}
                    disabled={
                      selecteSentToMobile == undefined ||
                      selecteSentToMobile == null ||
                      selecteSentToMobile == "" ||
                      showRemainingTime
                        ? true
                        : false
                    }
                  />
                </div>
                {formErrors && (
                  <div className="p-error">
                    {formErrors["sentToMobile"]?.message}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Breakdown Location</label>
              <div className="p-inputgroup">
                <Controller
                  name="breakdownlocation"
                  control={control}
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
                        disabled={locationVia?.id !== 493 ? true : false}
                        placeholder="Search places"
                        showEmptyMessage={true}
                      />
                    </>
                  )}
                />
                {(locationVia?.id == 491 || locationVia?.id == 492) && (
                  <Button
                    type="button"
                    className="btn-default"
                    onClick={handleFetchSMSLocation}
                    label="Fetch"
                    loading={receivedSMSLoading}
                    disabled={
                      receivedSMSId == undefined || receivedSMSId == null
                        ? true
                        : false
                    }
                  />
                )}
              </div>
              {formErrors && (
                <div className="p-error">
                  {formErrors["breakdownlocation"]?.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Nearest City</label>
              <Controller
                name="nearestCity"
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
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
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
                BD Latitude & longitude
              </label>
              <Controller
                name="lattiude_longtitude"
                control={control}
                rules={{ required: "BD Latitude & longitude is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      value={
                        field.value && `${field.value.lat}&${field.value.lng}`
                      }
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      placeholder="Enter BD Latitude & longitude"
                      disabled
                    />
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
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
                control={control}
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
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Breakdown Landmark</label>
              <Controller
                name="breakdownLandmark"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      placeholder="Enter Landmark"
                    />
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Address by customer</label>
              <Controller
                name="location_customer"
                control={control}
                // rules={{ required: "Location by customer is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      placeholder="Enter address by customer"
                    />
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6 ">
            <div className="form-group">
              <label className="form-label required">
                Customer & Vehicle location
              </label>
              <Controller
                name="vehicle_location"
                control={control}
                rules={{ required: "Location by customer is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      placeholder="Select Customer & Vehicle location "
                      filter
                      resetFilterOnHide={true}
                      className="form-control-select"
                      options={formOptions?.customerVehicleLocations}
                      optionLabel="name"
                      onChange={(e) => field.onChange(e.value)}
                    />
                    {formErrors && (
                      <div className="p-error">
                        {formErrors[field.name]?.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label required">Voice of Customer</label>
              <Controller
                name="voiceCustomer"
                control={control}
                rules={{ required: "Voice of Customer is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextarea
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      placeholder="Enter Voice of Customer"
                      // disabled
                    />
                    <div className="p-error">
                      {formErrors && formErrors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
        </div>
        {caseServiceType &&
          caseServiceType?.id == 1 &&
          selectedBdLocation?.description && (
            <>
              <hr />
              <div className="row row-gap-3_4">
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
                {dropLocationType.id == 451 && (
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
                              options={formOptions?.customerPreferredLocations}
                              optionLabel="name"
                              onChange={(e) => {
                                field.onChange(e.value);
                                handlePreferredLocationTypeChange(e);
                              }}
                            />
                            {formErrors && (
                              <div className="p-error">
                                {formErrors[field.name]?.message}
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
                          {formErrors && (
                            <div className="p-error">
                              {formErrors["dealers"]?.message}
                              {/*  {errors[field.name]?.message}*/}
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
                              {formErrors && (
                                <div className="p-error">
                                  {formErrors[field.name]?.message}
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
                                className={`form-control ${
                                  fieldState.error ? "p-invalid" : ""
                                }`}
                                placeholder="Enter Breakdown to Drop Distance"
                                disabled
                              />
                              {formErrors && (
                                <div className="p-error">
                                  {formErrors[field.name]?.message}
                                </div>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

                {dropLocationType.id == 451 &&
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
                          {formErrors && (
                            <div className="p-error">
                              {formErrors["dropdownlocation"]?.message}
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
                                {formErrors && (
                                  <div className="p-error">
                                    {formErrors[field.name]?.message}
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
                                {formErrors && (
                                  <div className="p-error">
                                    {formErrors[field.name]?.message}
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
                                {formErrors && (
                                  <div className="p-error">
                                    {formErrors[field.name]?.message}
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
            </>
          )}
        {!defaultHide && entitlementData?.notes?.customerNeedToPay && (
          <>
            <hr />
            <div className="row row-gap-3_4">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">
                    Customer Location
                  </label>
                  <Controller
                    name="customerLocation"
                    control={control}
                    rules={{
                      required: "Customer Location is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        {/* <AutoComplete
                          value={field.value}
                          suggestions={suggestions?.data}
                          completeMethod={handleSearch}
                          field="description"
                          itemTemplate={(option) => {
                            return <div>{option.description}</div>;
                          }}
                          onChange={(e) => field.onChange(e.value)}
                          placeholder="Search places"
                          showEmptyMessage={true}
                        /> */}
                        <InputText
                          {...field}
                          value={field.value && field.value?.description}
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          placeholder="Enter Location"
                          disabled
                        />
                        {formErrors && (
                          <div className="p-error">
                            {formErrors[field?.name]?.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-6 ">
                <div className="form-group">
                  <label className="form-label required">Customer State</label>
                  <Controller
                    name="customerStateId"
                    control={control}
                    rules={{ required: "Customer State is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          value={field.value && field.value?.name}
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          placeholder="Enter State"
                          disabled
                        />
                        {formErrors && (
                          <div className="p-error">
                            {formErrors[field.name]?.message}
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
                    Send Payment Link to
                  </label>
                  <Controller
                    name="sendPaymentLinkTo"
                    control={control}
                    rules={{
                      required: "Send Payment Link to is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Number"
                          options={sentToList}
                          optionLabel="value"
                          onChange={(e) => {
                            field.onChange(e.value);
                          }}
                        />
                        {formErrors && (
                          <div className="p-error">
                            {formErrors[field?.name]?.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Google Map */}
      <div className="col-md-6">
        <div className="row row-gap-3_4 case-position-sticky">
          <div className="col-md-12">
            <Accordion
              className="accordian-custom-header case-accordian"
              expandIcon={(options) => (
                <CollapsePlusIcon {...options.iconProps} />
              )}
              collapseIcon={(options) => (
                <CollapseMinusIcon {...options.iconProps} />
              )}
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
            >
              <AccordionTab
                className="custom-accordian-tab"
                tabIndex={0}
                headerTemplate={(e) => {
                  // console.log(e);
                  return (
                    <div className="accordian-title">
                      {caseServiceType?.id == 1
                        ? "Breakdown and Drop"
                        : "Breakdown"}{" "}
                      Location
                    </div>
                  );
                }}
              >
                <div className="map-card">
                  <GoogleMapReact
                    key={locations || selectedDealers || locations?.drop}
                    defaultCenter={
                      bdlat && bdlng
                        ? {
                            lat: bdlat,
                            lng: bdlng,
                          }
                        : { lat: 20.5937, lng: 78.9629 }
                    }
                    defaultZoom={12}
                    bootstrapURLKeys={{
                      key: GoogleMapAPIKey,
                    }}
                    center={
                      bdlat && bdlng
                        ? {
                            lat: bdlat,
                            lng: bdlng,
                          }
                        : { lat: 20.5937, lng: 78.9629 }
                    }
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) =>
                      handleApiLoaded(map, maps)
                    }
                  ></GoogleMapReact>
                  {travelKM && (
                    <div className="travelledkm">
                      <TravelledKM km={travelKM?.split(" ")[0]} />
                    </div>
                  )}
                </div>
              </AccordionTab>
              <AccordionTab
                className="custom-accordian-tab"
                tabIndex={1}
                headerTemplate={(e) => {
                  // console.log(e);
                  return (
                    <div className="accordian-title">Entitlement Details</div>
                  );
                }}
              >
                <ServiceDetailCard
                  tabMenu={false}
                  companyName={true}
                  client={client}
                  serviceTableScrollHidden={true}
                  entitlementData={{
                    policyData:
                      selectedPolicyType?.id !== 434
                        ? {
                            policyNumber: selectedPolicyNumber,
                            policyStartDate:
                              moment(selectedPolicyStart).format("DD/MM/YYYY"),
                            policyEndDate:
                              moment(selectedPolicyEnd).format("DD/MM/YYYY"),
                          }
                        : null,
                    ...entitlementData?.result,
                  }}
                  setFullEntitlementVisible={setFullEntitlementVisible}
                  selectedCaseSubService={selectedCaseSubService}
                />
              </AccordionTab>
            </Accordion>
          </div>
          {entitlementData?.notes &&
            entitlementData?.notes?.message?.length > 0 && (
              <div className="col-md-12">
                <Note
                  type={entitlementData?.notes?.status ? "success" : "info"}
                  icon={true}
                  purpose={"note"}
                  title={true}
                >
                  <div
                    className={`note-content ${
                      entitlementData?.notes?.status ? "note-content-green" : ""
                    }`}
                  >
                    {entitlementData.notes?.message?.map((note, i) => (
                      <div key={i}>{note}</div>
                    ))}
                    {/* <div>MemberShip</div>
                  <div>RSA Customer.</div>
                  <div>No additional charges will be applied.</div> */}
                  </div>
                </Note>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BreakDownLocations;
