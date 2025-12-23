import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import { useQuery, useQueries, useMutation } from "react-query";
import React, { useState, useEffect } from "react";
import TabMenuItem from "../../../components/common/TabMenuItem";
import { UpdatePencilIcon } from "../../../utills/imgConstants";
import ViewGrid from "../../../components/common/ViewGrid";
import "../style.less";
import ASPAttachmentDialog from "./AspAttachmentDialog";
import TravelHistoryDialog from "./TravelHistoryDialog";
import { getServiceDetails } from "../../../../services/otherService";
import { serviceDeatils } from "../../../../services/assignServiceProvider";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { Controller, useForm, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import {
  additionalServiceDetails,
  getNearestDealersByLocation,
  getStateId,
  getCityMaster,
  updateServiceDropLocation,
} from "../../../../services/caseService";
import { getCityId } from "../../../../services/masterServices";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { toast } from "react-toastify";

const ServiceDetails = ({
  aspResultData,
  aspRetech,
  index,
  caseViewData,
  caseViewRefetch,
  refetchAspResultDataUsingIndex,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [historyDialogVisible, setHistoryDialogVisible] = useState(false);

  const [dropLocationForm, setDropLocationForm] = useState(false);
  const [showAutoCompleteDrop, setShowAutoCompleteDrop] = useState(false);
  const [dropStateId, setDropStateId] = useState(null);
  const [areaDropList, setAreaDropList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [selectedDropDealerDetails, setSelectedDropDealerDetails] =
    useState(null);

  const activityId = aspResultData?.[index]?.activityId;

  const {
    data: serviceData,
    refetch,
    isLoading: serviceDetailIsLoading,
    refetch: serviceDetailRefetch,
  } = useQuery(
    ["serviceDetail", activityId],
    () =>
      serviceDeatils({
        activityId,
      }),
    {
      enabled: !!activityId,
    }
  );
  const {
    data,
    isFetching: tableLoading,
    refetch: getServiceDetailsRefetch,
  } = useQuery(["getServiceDetails", activityId], () =>
    getServiceDetails({
      activityId: activityId,
    })
  );
  // console.log("====activity data>>>", aspResultData?.[index]?.activityId);
  // console.log("====activity data", serviceData?.data?.data?.[0]);

  const serviceDetails = [
    {
      label: "Service Disposition",
      value: data?.data?.data?.masterDetails?.disposition
        ? data?.data?.data?.masterDetails?.disposition?.name
        : "--",
    },

    {
      label: "Service",
      value: aspResultData?.[index]?.service
        ? aspResultData?.[index]?.service
        : "--",
    },
    {
      label: "Status",
      value: aspResultData?.[index]?.activityStatus
        ? aspResultData?.[index]?.activityStatus
        : "--",
      vlaueClassName: "info-badge info-badge-green",
      //action: "Change",
    },
    {
      label: "Sub - Service",
      value: aspResultData?.[index]?.subService
        ? aspResultData?.[index]?.subService
        : "--",
    },
    {
      label: "Category",
      value: aspResultData?.[index]?.service
        ? aspResultData?.[index]?.service
        : "--",
    },
    {
      label: "Sub-category",
      value: aspResultData?.[index]?.subService
        ? aspResultData?.[index]?.subService
        : "--",
    },

    {
      label: "Breakdown Location",
      value: data?.data?.data?.serviceDetails?.breakDownLocation
        ? data?.data?.data?.serviceDetails?.breakDownLocation
        : "--",
    },

    {
      label: "Service Start Time",
      value: data?.data?.data?.serviceDetails?.serviceStartDateTime
        ? data?.data?.data?.serviceDetails?.serviceStartDateTime
        : "--",

      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Service End Time",
      value: data?.data?.data?.serviceDetails?.serviceEndDateTime
        ? data?.data?.data?.serviceDetails?.serviceEndDateTime
        : "--",

      vlaueClassName: "info-badge info-badge-yellow",
    },
    // {
    //   label: "Breakdown Location",
    //   value: data?.data?.data?.dropLocationDetails?.breakDownLocation ? data?.data?.data?.dropLocationDetails?.breakDownLocation : "--",

    // },
  ];
  const dropLocationDetails = [
    {
      label: "Drop Location Type",
      value: data?.data?.data?.masterDetails?.dropLocationType?.name,
    },
    {
      label: "Customer Preferred Location Type",
      value: data?.data?.data?.masterDetails?.customerPreferredLocation?.name
        ? data?.data?.data?.masterDetails?.customerPreferredLocation?.name
        : "--",
    },
    {
      label: "Dealer",
      value: data?.data?.data?.masterDetails?.dropDealer?.name
        ? data?.data?.data?.masterDetails?.dropDealer?.name
        : "--",
    },
    // {
    //   label: "Dealer Location",
    //   value:
    //     "12/23, Block 2, Titan township, Mathigiri, Hosur, TamilNadu, India- 635110.",
    // },
    {
      label: "Drop Location Longitude",
      value: data?.data?.data?.dropLocationDetails?.dropLocationLong
        ? data?.data?.data?.dropLocationDetails?.dropLocationLong
        : "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Drop Location Latitude",
      value: data?.data?.data?.dropLocationDetails?.dropLocationLat
        ? data?.data?.data?.dropLocationDetails?.dropLocationLat
        : "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    // { label: "Hand Over By", value: "--" },
    {
      label: "Vehicle Acknowledged By",
      value: data?.data?.data?.dropLocationDetails?.vehicleAcknowledgedBy
        ? data?.data?.data?.dropLocationDetails?.vehicleAcknowledgedBy
        : "--",
    },

    {
      label: "Mobile Number of Receiver",
      value: data?.data?.data?.dropLocationDetails?.mobileNumberOfReceiver
        ? data?.data?.data?.dropLocationDetails?.mobileNumberOfReceiver
        : "--",
    },

    {
      label: "Excess KM",
      value: data?.data?.data?.dropLocationDetails?.additionalChargeableKm
        ? data?.data?.data?.dropLocationDetails?.additionalChargeableKm
        : "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
  ];

  const aspDetails = [
    {
      label: "Activity Status",
      value: aspResultData?.[index]?.aspActivityStatus
        ? aspResultData?.[index]?.aspActivityStatus
        : "--",
      //action: "change"
    },
    {
      label: "ASP Workshop Name",
      value: aspResultData?.[index]?.asp?.workshopName
        ? aspResultData?.[index]?.asp?.workshopName
        : "--",
    },
    {
      label: "ASP Contact",
      value: aspResultData?.[index]?.asp?.contactNumber
        ? aspResultData?.[index]?.asp?.contactNumber
        : "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "ASP Code",
      value: aspResultData?.[index]?.asp?.code
        ? aspResultData?.[index]?.asp?.code
        : "--",
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "ASP Accepted/Rejected/Cancelled Time",
      value: aspResultData?.[index]?.aspServiceAcceptedAt
        ? aspResultData?.[index]?.aspServiceAcceptedAt
        : "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },

    {
      label: "Reject / Cancel Reason",
      value: data?.data?.data?.masterDetails?.rejectReason?.name
        ? data?.data?.data?.masterDetails?.rejectReason?.name
        : "--",
    },
    {
      label: "Mechanic Name",
      value: data?.data?.data?.masterDetails?.asp?.name
        ? data?.data?.data?.masterDetails?.asp?.name
        : "--",
    },
    {
      label: "Mechanic Contact",
      value: data?.data?.data?.masterDetails?.asp?.contactNumber
        ? data?.data?.data?.masterDetails?.asp?.contactNumber
        : "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "ASP Reached at BD in",
      value: aspResultData?.[index]?.estimatedAspToBreakdownInfo
        ? aspResultData?.[index]?.estimatedAspToBreakdownInfo
        : "--",
    },
    {
      label: "ASP End/Base Location",
      value: data?.data?.data?.masterDetails?.asp?.addressLineOne
        ? data?.data?.data?.masterDetails?.asp?.addressLineOne
        : "--",
    },
    {
      label: "ETA",
      value: aspResultData?.[index]?.estimatedAspToBreakdownKmDuration
        ? aspResultData?.[index]?.estimatedAspToBreakdownKmDuration
        : "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Expected Service Start Date Time",
      value: serviceData?.data?.data?.[0]?.expectedServiceStartDateTime
        ? serviceData?.data?.data?.[0]?.expectedServiceStartDateTime
        : "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Expected Service End Date Time",
      value: serviceData?.data?.data?.[0]?.expectedServiceEndDateTime
        ? serviceData?.data?.data?.[0]?.expectedServiceEndDateTime
        : "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Comments",
      value: serviceData?.data?.data?.[0]?.comments
        ? serviceData?.data?.data?.[0]?.comments
        : "--",
    },
    //{ label: "ASP SLA Status", value: "SLA Met" },
    {
      label: "Regional Manager Name",
      value: aspResultData?.[index]?.asp?.rmName
        ? aspResultData?.[index]?.asp?.rmName
        : "--",
    },
    {
      label: "Regional Manager Contact",
      value: aspResultData?.[index]?.asp?.rmContactNumber
        ? aspResultData?.[index]?.asp?.rmContactNumber
        : "--",
    },
    // { label: "Zonal Manager Name", value: "Praveen Kumar" },
    // {
    //   label: "Zonal Manager Contact",
    //   value: "9876453234",
    //   vlaueClassName: "info-badge info-badge-yellow",
    // },
    {
      label: "Vehicle Registration Number",
      value: data?.data?.data?.aspDetails?.aspVehicleRegistrationNumber
        ? data?.data?.data?.aspDetails?.aspVehicleRegistrationNumber
        : "--",

      vlaueClassName: "info-badge info-badge-purple",
    },
    // {
    //   label: "Attachments",
    //   value: (
    //     <div className="blue_text" onClick={() => setVisible(true)}>
    //       View Attachments
    //     </div>
    //   ),

    // },
  ];

  const tabMenuItems = [
    { label: <TabMenuItem label="Service Details" /> },
    {
      label: <TabMenuItem label="Drop Location" />,
    },
    { label: <TabMenuItem label="ASP Details" /> },
    { label: <TabMenuItem label="Travelled KM" /> },
    // { label: <TabMenuItem label="Finance" /> },
  ];
  const travelledKMDetails = [
    {
      label: "Base to Break down",
      value: data?.data?.data?.traveledKmDetails?.estimatedAspToBreakdownKm
        ? data?.data?.data?.traveledKmDetails?.estimatedAspToBreakdownKm
        : "--",
    },

    {
      label: "Break down to Dealer",
      value: data?.data?.data?.traveledKmDetails?.estimatedBreakdownToDropKm
        ? data?.data?.data?.traveledKmDetails?.estimatedBreakdownToDropKm
        : "--",
    },

    {
      label: "Return km",
      value: data?.data?.data?.traveledKmDetails?.estimatedBreakdownToAspKm
        ? data?.data?.data?.traveledKmDetails?.estimatedBreakdownToAspKm
        : data?.data?.data?.traveledKmDetails?.estimatedDropToAspKm,
    },

    // { label: "Empty Return", value: "13 km" },

    {
      label: "Total Travelled km",
      value: data?.data?.data?.traveledKmDetails?.estimatedTotalKm
        ? data?.data?.data?.traveledKmDetails?.estimatedTotalKm
        : "--",
    },

    {
      label: "ASP Travel History",
      value:
        aspResultData?.[index]?.asp?.code != null ? (
          <div
            className="blue_text"
            onClick={() => setHistoryDialogVisible(true)}
          >
            View on Map
          </div>
        ) : null,
    },
    // {
    //   label: "Attachments",
    //   value: <div className="blue_text">View Attachments</div>,

    // },
  ];
  const financeDetails = [
    { label: "Service Charges", value: "₹ 300" },
    { label: "Membership Charges", value: "--" },
    { label: "Eatable Items Supply Charges", value: "--" },
    { label: "Toll Charges", value: "₹ 300" },
    { label: "Green Tax / Fuel Charges", value: "₹ 300" },
    { label: "Border Charges", value: "₹ 30" },
    { label: "Hydra Charges", value: "₹ 3000" },
    { label: "Total Excess Charges", value: "₹ 3000" },
    { label: "Customer Not Paid", value: "₹ 3000" },
    { label: "Charges collected from Customer", value: "₹ 3000" },
    { label: "Finance Update", value: "Paid" },
    { label: "Excess Km Charges", value: "₹ 300" },
    { label: "Paid by ASP", value: "₹ 30", itemClassName: "separator-none" },
    {
      label: "Attachments",
      value: <div className="blue_text">2 Attachments</div>,

      action: "View",
    },
  ];

  // Drop location detail update form
  const {
    handleSubmit: handleDropLocationSubmit,
    control: dropControl,
    getValues: getDropValues,
    formState: { errors: errorsDrop },
    reset: resetDrop,
    setValue: setDropValue,
    resetField: resetFieldDrop,
  } = useForm();

  const { data: locationUpdateFormData } = useQuery(
    ["dropLocationUpdateFormDetails"],
    () => additionalServiceDetails(),
    {
      enabled: dropLocationForm,
    }
  );

  let dropLocationTypes = [];
  let customerPreferredLocations = [];
  if (locationUpdateFormData && locationUpdateFormData.data.success) {
    dropLocationTypes =
      locationUpdateFormData.data.data.extras.dropLocationTypes;
    customerPreferredLocations =
      locationUpdateFormData.data.data.extras.customerPreferredLocations;
  }

  const handleDropLocationTypeChange = (id) => {
    setDropValue("customerPreferredLocationId", null);
    setDropValue("dealers", null);
    setSelectedDropDealerDetails(null);
    setDropValue("dealerLocation", "");
    setDropValue("dealerToBreakdownDistance", "");
    setDropValue("dropLocation", null);
    setDropValue("dropLatLng", {
      lat: "",
      lng: "",
    });
    // Reset dropStateId when changing to dealer (dealers don't have stateId)
    if (id == 452) {
      setDropStateId(null);
    }
    setDropStateId(null);
    setDropValue("dropArea", null);
    setDropValue("dropToBreakdownDistance", "");

    if (id == 452) {
      //Dealer
      nearestDealersByLocationMutate({
        clientId: caseViewData[0].clientId,
        caseTypeId: caseViewData[0].caseTypeId ?? 413,
        bdLat: caseViewData[0].breakdownLat,
        bdLong: caseViewData[0].breakdownLong,
      });
    }
  };

  const handlePreferredLocationTypeChange = (id) => {
    setDropValue("dealers", null);
    setSelectedDropDealerDetails(null);
    setDropValue("dealerLocation", "");
    setDropValue("dealerToBreakdownDistance", "");
    setDropValue("dropLocation", null);
    setDropValue("dropLatLng", {
      lat: "",
      lng: "",
    });
    // Reset dropStateId when customer preferred location is Dealer (id 461)
    if (id == 461) {
      setDropStateId(null);
    }
    setDropValue("dropArea", null);
    setDropValue("dropToBreakdownDistance", "");
  };

  const handleDealerSelect = (id) => {
    const dealerData = dealersData.data.data.find((d) => d.id == id);
    setSelectedDropDealerDetails(dealerData);
    setDropValue("dealerLocation", dealerData.dealerLocation);
    setDropValue("dealerToBreakdownDistance", dealerData.distance);
  };

  const handleDealerSearch = (event) => {
    if (event?.query?.length > 2) {
      nearestDealersByLocationMutate({
        clientId: caseViewData[0].clientId,
        caseTypeId: caseViewData[0].caseTypeId ?? 413,
        bdLat: caseViewData[0].breakdownLat,
        bdLong: caseViewData[0].breakdownLong,
        dropLocationTypeId: dropLocationTypeId,
        searchKey: event.query,
      });
    }
  };

  const handleDealerSearchSelect = (id) => {
    const dealerData = dealersData.data.data.find((d) => d.id == id);
    setSelectedDropDealerDetails(dealerData);
    setDropValue("dealerLocation", dealerData.dealerLocation);
  };

  const dropLocationTypeId = useWatch({
    name: "dropLocationTypeId",
    control: dropControl,
  });

  const customerPreferredLocationId = useWatch({
    name: "customerPreferredLocationId",
    control: dropControl,
  });

  const selectedDropLocation = useWatch({
    name: "dropLocation",
    control: dropControl,
  });

  const { lat: dplat, lng: dplng } = useWatch({
    name: "dropLatLng",
    control: dropControl,
    defaultValue: { lat: null, lng: null },
  });

  const selectedDealers = useWatch({
    name: "dealers",
    control: dropControl,
  });

  useEffect(() => {
    if (
      caseViewData &&
      caseViewData[0].breakdownLat &&
      caseViewData[0].breakdownLong &&
      ((dplat && dplng) ||
        (selectedDropDealerDetails?.latitude &&
          selectedDropDealerDetails?.longitude))
    ) {
      if (
        selectedDropDealerDetails?.latitude &&
        selectedDropDealerDetails?.longitude
      ) {
        if (dropLocationTypeId == 452) {
          // setTravelKM(selectedDealers?.distance);
        } else {
          getDistance(
            [
              Number(caseViewData[0]?.breakdownLat),
              Number(caseViewData[0]?.breakdownLong),
            ],
            [
              Number(selectedDropDealerDetails?.latitude),
              Number(selectedDropDealerDetails?.longitude),
            ]
          );
        }
      } else {
        getDistance(
          [
            Number(caseViewData[0]?.breakdownLat),
            Number(caseViewData[0]?.breakdownLong),
          ],
          [Number(dplat), Number(dplng)]
        );
      }
    }
  }, [dplat, dplng, selectedDealers]);

  const {
    data: bdCitiesData,
    mutate: getCitiesMutate,
    isLoading: getBdCitiesLoading,
  } = useMutation(getCityMaster);

  const { mutate: nearestDealersByLocationMutate, data: dealersData } =
    useMutation(getNearestDealersByLocation);

  const { mutate: getCityIdMutate, isLoading: getCityIdLoading } =
    useMutation(getCityId);

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

  const { mutate: getStateIdMutate, isLoading: getStateIdLoading } =
    useMutation(getStateId);

  const getDistance = (start, end) => {
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
        // setTravelKM((distanceValue / 1000).toFixed(2) + " km");
        if (
          dropLocationTypeId == 451 &&
          (customerPreferredLocationId == 462 ||
            customerPreferredLocationId == 463 ||
            customerPreferredLocationId == 464)
        ) {
          if (distanceText.includes("m") && !distanceText.includes("km")) {
            // console.log("distanceValue ", distanceValue);
            let value = (distanceValue / 1000).toFixed(2) + " km";
            setDropValue("dropToBreakdownDistance", value);
          } else {
            setDropValue(
              "dropToBreakdownDistance",
              (distanceValue / 1000).toFixed(2) + " km"
            );
          }
        } else {
          setDropValue(
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

  const handleSearch = (event) => {
    var options = {
      types: ["(cities)"],
      componentRestrictions: { country: "us" },
    };

    var input = document.getElementById("searchTextField");
    if (input) {
      var autocomplete = new google.maps.places.Autocomplete(input, options);
    }
    setSearchValue(event.query);
  };

  const handleDropLocationChange = (e, field) => {
    field.onChange(e.value);
    setDropValue(`${field.name}`, e.value);
    setDropValue("dropLatLng", {
      lat: "",
      lng: "",
    });
    setDropValue("dropArea", null);
    setDropValue("dropToBreakdownDistance", "");
    setDropStateId(null);
  };

  const handleDropLocationSelect = (description) => {
    clearSuggestions();
    getGeocode({ address: description }).then((results) => {
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

      setDropValue("dropLatLng", {
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
              setShowAutoCompleteDrop(false); // Show area dropdown
            } else {
              setAreaDropList([]);
              setShowAutoCompleteDrop(true); // Show area auto complete
            }
          },
        }
      );
    });
  };

  useEffect(() => {
    if (selectedDropLocation?.description) {
      getGeocode({ address: selectedDropLocation?.description }).then(
        (results) => {
          handleStateCode(results[0]);
        }
      );
    } else {
      setAreaDropList([]);
    }
  }, [selectedDropLocation?.description]);

  const handleStateCode = (results) => {
    if (results?.address_components) {
      // Extract city or locality from address components
      const addressComponents = results?.address_components;

      const stateComponent = addressComponents.find((component) =>
        component.types.includes("administrative_area_level_1")
      );

      getStateIdMutate(
        {
          code: stateComponent?.short_name,
        },
        {
          onSuccess: (res) => {
            if (res?.data?.success) {
              setDropStateId(res?.data?.data?.id);
            }
          },
        }
      );
    }
  };

  const handleAreaSearch = (event, stateId) => {
    getCitiesMutate(
      {
        stateId: stateId,
        apiType: "dropdown",
        search: event.query,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            setAreaList(res.data.data);
          } else {
            setAreaList([]);
          }
        },
      }
    );
  };

  //On initial load prefill drop location details
  useEffect(() => {
    if (dropLocationForm && caseViewData) {
      setDropValue("dropLocationTypeId", caseViewData[0].dropLocationTypeId);
      handleDropLocationTypeChange(caseViewData[0].dropLocationTypeId);

      if (caseViewData[0].customerPreferredLocationId) {
        setDropValue(
          "customerPreferredLocationId",
          caseViewData[0].customerPreferredLocationId
        );
        handlePreferredLocationTypeChange(
          caseViewData[0].customerPreferredLocationId
        );
      }

      if (
        caseViewData[0].dropLocationTypeId == 452 ||
        caseViewData[0].customerPreferredLocationId == 461
      ) {
        setDropValue("dealers", {
          id: caseViewData[0].dropDealerId,
          name: caseViewData[0].dropDealerCodeWithLegalName,
        });

        setSelectedDropDealerDetails({
          id: caseViewData[0].dropDealerId,
          name: caseViewData[0].dropDealerCodeWithLegalName,
          latitude: caseViewData[0].dropLocationLat,
          longitude: caseViewData[0].dropLocationLong,
          dealerLocation: caseViewData[0].dropLocation,
          distance: caseViewData[0].breakdownToDropLocationDistance,
        });

        setDropValue("dealerLocation", caseViewData[0].dropLocation);
        setDropValue(
          "dealerToBreakdownDistance",
          caseViewData[0].breakdownToDropLocationDistance
        );
      }

      if (
        caseViewData[0].dropLocationTypeId == 451 &&
        (caseViewData[0].customerPreferredLocationId == 462 ||
          caseViewData[0].customerPreferredLocationId == 463 ||
          caseViewData[0].customerPreferredLocationId == 464)
      ) {
        setDropValue("dropLocation", {
          description: caseViewData[0].dropLocation,
        });
        handleDropLocationSelect(caseViewData[0].dropLocation);

        setDropValue("dropArea", {
          id: caseViewData[0].dropAreaId,
          name: caseViewData[0].dropArea,
        });

        setDropValue(
          "dropToBreakdownDistance",
          caseViewData[0].breakdownToDropLocationDistance
        );
      }
    }
  }, [dropLocationForm]);

  const {
    mutate: dropLocationUpdateMutate,
    isLoading: dropLocationUpdateLoading,
  } = useMutation(updateServiceDropLocation);

  const handleDropLocationFormSubmit = (values) => {
    dropLocationUpdateMutate(
      {
        activityId: activityId,
        dropLocationTypeId: values.dropLocationTypeId,
        customerPreferredLocationId: values.customerPreferredLocationId
          ? values.customerPreferredLocationId
          : null,
        dropDealerId: selectedDropDealerDetails
          ? selectedDropDealerDetails.id
          : null,
        dropLocationLat: selectedDropDealerDetails
          ? selectedDropDealerDetails.latitude
          : values.dropLatLng.lat.toString(),
        dropLocationLong: selectedDropDealerDetails
          ? selectedDropDealerDetails.longitude
          : values.dropLatLng.lng.toString(),
        dropLocation: selectedDropDealerDetails
          ? values.dealerLocation
          : values.dropLocation.description,
        breakdownToDropDistance: selectedDropDealerDetails
          ? values.dealerToBreakdownDistance
          : values.dropToBreakdownDistance, //It should be calculated  and passed for both breakdown & drop
        dropAreaId: values.dropArea ? values.dropArea.id : null,
        // Only send dropStateId for customer preferred location (not for dealer or when customer preferred is dealer)
        dropStateId:
          values.dropLocationTypeId == 451 &&
          values.customerPreferredLocationId != 461
            ? dropStateId
            : null,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setDropLocationForm(false);

            caseViewRefetch();
            refetchAspResultDataUsingIndex(index);
            serviceDetailRefetch();
            getServiceDetailsRefetch();
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
      <TabMenu
        model={tabMenuItems}
        activeIndex={activeIndex}
        onTabChange={(e) => {
          refetch();
          setActiveIndex(e.index);
        }}
        className="spearate-tab-menu min-168"
      />
      <div className=" ">
        {/* <button className="btn btn-white btn-with-icon service-update-btn">
          <img src={UpdatePencilIcon} />
          Update
        </button> */}
        <div className="service-detail-tabcontent">
          <TabView
            className="tab-header-hidden case-view-tab bg-transparent"
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            <TabPanel>
              <div className="border-box bg-white border-transparent">
                <ViewGrid items={serviceDetails} className="grid-3" />
              </div>
            </TabPanel>
            <TabPanel>
              {aspResultData?.[index]?.serviceId === 1 &&
                caseViewData[0]?.caseStatusId === 2 &&
                (!caseViewData[0]?.dropLocation ||
                  (caseViewData[0]?.dropLocation &&
                    !caseViewData[0]?.positiveActivityExists)) && (
                  <button
                    className="btn btn-white btn-with-icon service-update-btn"
                    onClick={() => {
                      setDropLocationForm(true);
                      resetDrop();
                    }}
                  >
                    <img src={UpdatePencilIcon} />
                    Update
                  </button>
                )}
              <div className="border-box bg-white border-transparent">
                <ViewGrid items={dropLocationDetails} className="grid-3" />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="border-box bg-white border-transparent">
                <ViewGrid items={aspDetails} className="grid-3" />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="border-box bg-white border-transparent">
                <ViewGrid items={travelledKMDetails} className="grid-3" />
              </div>
            </TabPanel>
            {/* <TabPanel>
              <div className="border-box bg-white border-transparent">
                <ViewGrid items={financeDetails} className="grid-3" />
              </div>
            </TabPanel> */}
          </TabView>
        </div>
        <ASPAttachmentDialog visible={visible} setVisible={setVisible} />
        <TravelHistoryDialog
          visible={historyDialogVisible}
          setVisible={setHistoryDialogVisible}
          aspResultData={aspResultData?.[index]}
          viewMode="view"
          getData={data?.data?.data}
          caseData={caseViewData}
        />
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
        <form
          onSubmit={handleDropLocationSubmit(handleDropLocationFormSubmit)}
          id="drop-location-form"
        >
          <div className="row row-gap-3_4">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">
                  Drop Location Type
                </label>
                <Controller
                  name="dropLocationTypeId"
                  control={dropControl}
                  rules={{ required: "Drop Location Type is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Drop Location Type"
                        resetFilterOnHide={true}
                        className="form-control-select"
                        options={dropLocationTypes}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(e) => {
                          field.onChange(e.value);
                          handleDropLocationTypeChange(e.value);
                        }}
                      />

                      {errorsDrop[field?.name] && (
                        <div className="p-error">
                          {errorsDrop[field.name]?.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {dropLocationTypeId == 451 && (
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">
                    Customer Preferred Location
                  </label>
                  <Controller
                    name="customerPreferredLocationId"
                    control={dropControl}
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
                          optionValue="id"
                          onChange={(e) => {
                            field.onChange(e.value);
                            handlePreferredLocationTypeChange(e.value);
                          }}
                        />
                        {errorsDrop[field?.name] && (
                          <div className="p-error">
                            {errorsDrop[field.name]?.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            )}

            {(dropLocationTypeId == 452 ||
              customerPreferredLocationId == 461) && (
              <>
                {dropLocationTypeId == 452 ? (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">Dealers</label>
                      <Controller
                        name="dealers"
                        control={dropControl}
                        rules={{ required: "Dealers is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              value={field.value}
                              placeholder="Select Dealers"
                              filter
                              resetFilterOnHide={true}
                              className="form-control-select"
                              options={dealersData?.data?.data?.map(
                                (dealer) => {
                                  return {
                                    id: dealer.id,
                                    name: dealer.codeWithLegalName,
                                  };
                                }
                              )}
                              optionLabel="name"
                              onChange={(e) => {
                                field.onChange(e.value);
                                handleDealerSelect(e.value.id);
                              }}
                            />
                            {errorsDrop[field?.name] && (
                              <div className="p-error">
                                {errorsDrop[field.name]?.message}
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
                          control={dropControl}
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
                                  setSelectedDropDealerDetails(null);
                                  setDropValue("dealerLocation", "");
                                  setDropValue("dealerToBreakdownDistance", "");
                                }}
                                onSelect={(e) =>
                                  handleDealerSearchSelect(e.value.id)
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
                      {errorsDrop["dealers"] && (
                        <div className="p-error">
                          {errorsDrop["dealers"]?.message}
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
                      name="dealerLocation"
                      control={dropControl}
                      rules={{ required: "Dealer Location is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputTextarea
                            {...field}
                            rows={4}
                            placeholder="Enter Dealer Location"
                            className={`form-control`}
                            disabled
                          />
                          {errorsDrop[field.name] && (
                            <div className="p-error">
                              {errorsDrop[field.name]?.message}
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
                      control={dropControl}
                      rules={{
                        required: "Breakdown to Drop Distance is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            className={`form-control `}
                            placeholder="Breakdown to Drop Distance"
                            disabled
                          />
                          {errorsDrop[field.name] && (
                            <div className="p-error">
                              {errorsDrop[field.name]?.message}
                            </div>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
              </>
            )}

            {dropLocationTypeId == 451 &&
              (customerPreferredLocationId == 462 ||
                customerPreferredLocationId == 463 ||
                customerPreferredLocationId == 464) && (
                <>
                  {" "}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        Drop Location
                      </label>
                      <div className="p-inputgroup">
                        <Controller
                          name="dropLocation"
                          control={dropControl}
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
                                  handleDropLocationChange(e, field);
                                }}
                                onSelect={(e) =>
                                  handleDropLocationSelect(e.value.description)
                                }
                                placeholder="Search places"
                                showEmptyMessage={true}
                              />
                            </>
                          )}
                        />
                        {/* <Button icon={<img src={SearchIcon} />} /> */}
                      </div>
                      {errorsDrop["dropLocation"] && (
                        <div className="p-error">
                          {errorsDrop["dropLocation"]?.message}
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
                        name="dropLatLng"
                        control={dropControl}
                        rules={{
                          validate: (value) =>
                            value && value.lat && value.lng
                              ? true
                              : "Drop Latitude & longitude is required.",
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <InputText
                              {...field}
                              value={
                                field.value &&
                                field.value.lat &&
                                field.value.lng
                                  ? `${field.value.lat}&${field.value.lng}`
                                  : ""
                              }
                              className={`form-control ${
                                fieldState.error ? "p-invalid" : ""
                              }`}
                              placeholder="Enter Drop Latitude & longitude"
                              disabled
                            />
                            {errorsDrop[field.name] && (
                              <div className="p-error">
                                {errorsDrop[field.name]?.message}
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
                        name="dropArea"
                        control={dropControl}
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
                                disabled={!selectedDropLocation?.description}
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
                                options={areaDropList.map((dropArea) => {
                                  return {
                                    id: dropArea.id,
                                    name: dropArea.name,
                                  };
                                })}
                                optionLabel="name"
                                onChange={(e) => {
                                  field.onChange(e.value);
                                }}
                              />
                            )}
                            {errorsDrop[field.name] && (
                              <div className="p-error">
                                {errorsDrop[field.name]?.message}
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
                        control={dropControl}
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
                            {errorsDrop[field.name] && (
                              <div className="p-error">
                                {errorsDrop[field.name]?.message}
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

          <button
            className="btn form-submit-btn"
            loading={dropLocationUpdateLoading.toString()}
            type="submit"
            form="drop-location-form"
          >
            Confirm
          </button>
        </form>
      </Dialog>
    </>
  );
};

export default ServiceDetails;
