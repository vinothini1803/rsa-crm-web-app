import React, { useState, useEffect, useRef } from "react";
import { useQuery, useQueries, useMutation } from "react-query";
import { useSelector } from "react-redux";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import { Rating } from "primereact/rating";
import { OverlayPanel } from "primereact/overlaypanel";
import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import CaseViewCard from "./caseViewCard/CaseViewCard";
import "./style.less";
import { TabMenu } from "primereact/tabmenu";
import TabMenuItem from "../../components/common/TabMenuItem";
import { TabView, TabPanel } from "primereact/tabview";
import {
  getCaseInfo,
  getFullServiceEntitlements,
  getLatestPositiveActivity,
  updateLocation,
  getNearestDealersByLocation,
  getStateId,
  getCityMaster,
  sendCustomerInvoice,
} from "../../../services/caseService";
import {
  getCityId,
  getServiceDescription,
} from "../../../services/masterServices";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  agent,
  assginAgent,
  updateCaseClose,
} from "../../../services/deliveryRequestViewService";
import { aspData } from "../../../services/assignServiceProvider";
import CaseDetails from "./CaseDetails";
import {
  ContactImage,
  InfoDarkIcon,
  DialogCloseSmallIcon,
} from "../../utills/imgConstants";
import CaseInfoTab from "./caseInfoTab/CaseInfoTab";
import ActivityTab from "./activityTab/ActivityTab";
import ServiceTab from "./serviceTab/ServiceTab";
import ASPDialog from "./ASPDialog";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { CurrentUser } from "../../../store/slices/userSlice";
import { toast } from "react-toastify";
import ServiceSidebar from "./serviceTab/ServiceSidebar";
import SlaReasonDialog, { checkSla } from "../../components/common/Sla";
import ServiceDetails from "./serviceDetails/ServiceDetails";
import { clickToCall } from "../../../services/callService";
import CustomerFeedbackModal from "./CustomerFeedbackModal";
import QuestionnaireModal from "./QuestionnaireModal";
const CaseView = () => {
  const { userTypeId, id, entityId } = useSelector(CurrentUser);
  const user = useSelector(CurrentUser);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activityIds, setActivityIds] = useState(null);
  const [aspDialogVisible, setAspDialogVisible] = useState(false);
  const [closecaseVisible, setClosecaseVisible] = useState(false);
  const [agentAssignDialogeVisible, setAgentAssignDialogeVisible] =
    useState(false);
  const [serviceVisible, setServiceVisible] = useState(false);
  const [closeSlaReasonVisible, setCloseSlaReasonVisible] = useState(false);
  const [pendingCloseCaseValues, setPendingCloseCaseValues] = useState(null);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [questionnaireModalVisible, setQuestionnaireModalVisible] =
    useState(false);
  const [breakdownVisible, setBreakdownVisible] = useState(false);
  const [dropLocationForm, setDropLocationForm] = useState(false);
  const [breakStateId, setBreakStateId] = useState();
  const [dropStateId, setDropStateId] = useState();
  const [areaList, setAreaList] = useState([]);
  const [areaDropList, setAreaDropList] = useState([]);
  const [showAutoCompleteDrop, setShowAutoCompleteDrop] = useState(false);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { caseId } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const index = queryParams.get("i");
  const [assignAspActivityId, setAssignAspActivityId] = useState(null);
  const permissions = user?.role?.permissions?.map((perm) => perm.name) || [];
  const emailPanel = useRef(null);
  //console.log("caseId => ", activeIndex)
  // console.log("pathname", pathname, pathname.split("/")[2]);

  const {
    handleSubmit: handleAgentFormSubmit,
    control,
    getValues,
    formState: { errors: agentFormErrors },
    reset,
  } = useForm({
    defaultValues: {
      agent: "",
    },
  });

  // Forms for location editing
  const {
    handleSubmit,
    control: dropControl,
    getValues: getDropValues,
    formState: { errors: dropErrors },
    reset: resetDrop,
    setValue: setDropValue,
    resetField: resetDropField,
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

  const { data: caseViewData, refetch: caseViewRefetch } = useQuery(
    ["getCaseInfo"],
    () => getCaseInfo({ caseId: caseId }),
    {
      enabled: caseId ? true : false,
      onSuccess: (res) => {
        // console.log("caseViewData => ", res);
        if (res?.data?.data[0]?.activityDetails?.length > 0) {
          setActivityIds(res?.data?.data[0]?.activityDetails);
        }
      },
    }
  );

  // Fetch service descriptions for close case form
  const { data: serviceDescriptionData } = useQuery(
    ["getServiceDescription"],
    () => getServiceDescription({ apiType: "dropdown" }),
    {
      enabled: closecaseVisible && caseViewData?.data?.data[0]?.typeId != 32,
    }
  );

  // Form for close case
  const {
    handleSubmit: handleCloseCaseFormSubmit,
    control: closeCaseControl,
    formState: { errors: closeCaseErrors },
    reset: resetCloseCaseForm,
  } = useForm({
    defaultValues: {
      serviceDescriptionId: null,
      closureRemarks: "",
      closureRating: null,
    },
  });

  // console.log("caseViewData", caseViewData);

  // Location editing hooks and handlers
  const {
    suggestions,
    setValue: setSearchValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "IN" },
      strictBounds: false,
    },
  });

  // Drop location types and customer preferred locations
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

  // Watch form values
  const dropLocationType = useWatch({
    name: "drop_location_type",
    control: dropControl,
  });
  const customerPreferredLocation = useWatch({
    name: "customerPreferredLocation",
    control: dropControl,
  });
  const bdLatLng = useWatch({
    name: "lattiude_longtitude",
    control: bdControl,
    defaultValue: { lat: null, lng: null },
  });
  const { lat: bdlat, lng: bdlng } = bdLatLng || { lat: null, lng: null };

  const dropLatLng = useWatch({
    name: "droplatlng",
    control: dropControl,
    defaultValue: { lat: null, lng: null },
  });
  const { lat: dplat, lng: dplng } = dropLatLng || { lat: null, lng: null };
  const selectedDealers = useWatch({
    name: "dealers",
    control: dropControl,
  });
  const selectedBdLocation = useWatch({
    name: "breakdownlocation",
    control: bdControl,
  });
  const selectedDropLocation = useWatch({
    name: "dropdownlocation",
    control: dropControl,
  });

  // Mutations
  const {
    data: updateLocationData,
    mutate: updateLocationMutate,
    isLoading: updateLocationLoading,
  } = useMutation(updateLocation, {
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setBreakdownVisible(false);
        setDropLocationForm(false);
        resetBd();
        resetDrop();
        caseViewRefetch();
        refetchAll(); //refetch activity data to get updated customerNeedToPay
      } else {
        if (res?.data?.error) {
          toast.error(res?.data?.error);
        } else {
          res?.data?.errors?.forEach((el) => toast.error(el));
        }
      }
    },
  });

  const {
    data: bdCitiesData,
    mutate: getBdCitiesMutate,
    isLoading: getBdCitiesLoading,
  } = useMutation(getCityMaster);

  const { mutate: dealersMutate, data: dealersData } = useMutation(
    getNearestDealersByLocation,
    {
      onSuccess: (res) => {
        if (!res?.data?.success && res?.data?.error) {
          toast.error(res?.data?.error);
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
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors?.forEach((err) => toast.error(err));
          }
        }
      },
    }
  );

  const { mutate: getStateIdMutate, isLoading: getStateIdLoading } =
    useMutation(getStateId, {
      onSuccess: (res) => {
        if (res?.data?.success == false) {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors?.forEach((err) => toast.error(err));
          }
        }
      },
    });

  // Handlers
  const handleSearch = (event) => {
    setSearchValue(event.query);
  };

  const handleChange = (e, field) => {
    field.onChange(e.value);
    if (field?.name == "breakdownlocation") {
      setBdValue(`${field.name}`, e.value);
    } else {
      setDropValue(`${field.name}`, e.value);
    }
    if (e.value == "") {
      if (field?.name == "breakdownlocation") {
        resetFieldBd("lattiude_longtitude");
        resetFieldBd("area_id");
        resetFieldBd("dealerToBreakdownDistance");
      } else {
        resetDropField("dropnearest_city");
        resetDropField("droplatlng");
        resetDropField("dropToBreakdownDistance");
        resetDropField("droparea");
      }
    }
  };

  const handleSelect = (value, field, type) => {
    clearSuggestions();
    getGeocode({ address: value.description }).then((results) => {
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
      if (type === "breakdown" || field?.name == "breakdownlocation") {
        setBdValue("lattiude_longtitude", {
          lat: lat,
          lng: lng,
        });
        setBdValue("nearestCity", city);
        resetFieldBd("dealerToBreakdownDistance");
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
                setShowAutoComplete(false);
              } else {
                setAreaList([]);
                setShowAutoComplete(true);
              }
            },
          }
        );
        getStateIdMutate(
          {
            code: state,
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success) {
                setBreakStateId(res?.data?.data?.id);
              }
            },
          }
        );
      } else {
        setDropValue("droplatlng", {
          lat: lat,
          lng: lng,
        });
        setDropValue("dropnearest_city", city);
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
                setShowAutoCompleteDrop(false);
              } else {
                setAreaDropList([]);
                setShowAutoCompleteDrop(true);
              }
            },
          }
        );
        getStateIdMutate(
          {
            code: state,
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
          if (res?.data?.success) {
            setAreaList(res?.data.data);
          } else {
            setAreaList([]);
          }
        },
      }
    );
  };

  const handleDropLocationTypeChange = (e) => {
    if (e.value.id == 452) {
      dealersMutate({
        clientId: caseViewData?.data?.data[0]?.clientId,
        caseTypeId: caseViewData?.data?.data[0]?.caseTypeId ?? 413,
        bdLat: caseViewData?.data?.data[0]?.breakdownLat,
        bdLong: caseViewData?.data?.data[0]?.breakdownLong,
      });
      // Reset dropStateId when changing to dealer (dealers don't have stateId)
      setDropStateId(null);
    }
    resetDropField("customerPreferredLocation");
  };

  const handlePreferredLocationTypeChange = (e) => {
    resetDropField("dealers");
    resetDropField("dealer_location");
    resetDropField("dealerToBreakdownDistance");
    resetDropField("dropdownlocation");
    resetDropField("dropnearest_city");
    resetDropField("droplatlng");
    resetDropField("droparea");
    resetDropField("dropToBreakdownDistance");
    // Reset dropStateId when customer preferred location is Dealer (id 461)
    if (e.value?.id == 461) {
      setDropStateId(null);
    }
  };

  const handleDealerSelect = (e) => {
    setDropValue("dealers", e.value);
    setDropValue("dealer_location", e?.value?.dealerLocation);
    if (dropLocationType?.id == 452) {
      // Use dealer distance directly for dealer type
      setDropValue("dealerToBreakdownDistance", e?.value?.distance);
    } else {
      // Calculate distance for customer preferred location with dealer
      if (
        caseViewData?.data?.data[0]?.breakdownLat &&
        caseViewData?.data?.data[0]?.breakdownLong &&
        e?.value?.latitude &&
        e?.value?.longitude
      ) {
        getDistance(
          [
            Number(caseViewData?.data?.data[0]?.breakdownLat),
            Number(caseViewData?.data?.data[0]?.breakdownLong),
          ],
          [Number(e?.value?.latitude), Number(e?.value?.longitude)]
        );
      }
    }
  };

  const handleDealerSearch = (event) => {
    if (event?.query?.length > 2) {
      dealersMutate({
        clientId: caseViewData?.data?.data[0]?.clientId,
        caseTypeId: caseViewData?.data?.data[0]?.caseTypeId ?? 413,
        bdLat: caseViewData?.data?.data[0]?.breakdownLat,
        bdLong: caseViewData?.data?.data[0]?.breakdownLong,
        dropLocationTypeId: dropLocationType?.id,
        searchKey: event.query,
      });
    }
  };

  const handleDealerSearchSelect = (value) => {
    setDropValue("dealer_location", value?.dealerLocation);
  };

  const handleEditBreakdown = (values) => {
    const activityDetails = caseViewData?.data?.data[0]?.activityDetails || [];

    // Positive activities: activityStatusId NOT in [4, 5, 8] (Cancelled, Failure, Rejected)
    const positiveActivity = activityDetails.find((activity) => {
      const isPositive =
        activity?.activityStatusId &&
        ![4, 5, 8].includes(activity.activityStatusId);
      return isPositive;
    });

    // Negative activities: activityStatusId in [4, 5, 8] (Cancelled, Failure, Rejected)
    const negativeActivity = activityDetails.find((activity) => {
      const isNegative =
        activity?.activityStatusId &&
        [4, 5, 8].includes(activity.activityStatusId);
      return isNegative;
    });

    const activity = positiveActivity || negativeActivity;
    const activityId = activity?.id || null;

    // Fallback to latest positive activity if mechanical activity not found
    const latestActivityId =
      activityId || latestPositiveActivity?.data?.data?.[0]?.activityId || null;

    updateLocationMutate({
      caseDetailId: caseViewData?.data?.data[0]?.caseDetailId,
      editType: 1, //1-Breakdown,2-Drop
      activityId: latestActivityId,
      breakdownLocationReason: values?.breakdownLocationReason,
      breakdownLocation: values?.breakdownlocation?.description,
      breakdownLat: values?.lattiude_longtitude?.lat.toString(),
      breakdownLong: values?.lattiude_longtitude?.lng?.toString(),
      breakdownAreaId: values?.area_id?.id,
      breakdownToDropDistance:
        caseViewData?.data?.data[0]?.dropLocation != null
          ? values?.dealerToBreakdownDistance
          : null,
      breakdownStateId: breakStateId,
    });
  };

  const handleFormSubmit = (values) => {
    const activityDetails = caseViewData?.data?.data[0]?.activityDetails || [];

    // Positive activities: activityStatusId NOT in [4, 5, 8] (Cancelled, Failure, Rejected)
    const positiveTowingActivity = activityDetails.find((activity) => {
      const activityAspDetail =
        activity?.activityAspDetail || activity?.activityAspDetails;
      const isTowing = activityAspDetail?.serviceId == 1;
      const isPositive =
        activity?.activityStatusId &&
        ![4, 5, 8].includes(activity.activityStatusId);
      return isTowing && isPositive;
    });

    // Negative activities: activityStatusId in [4, 5, 8] (Cancelled, Failure, Rejected)
    const negativeTowingActivity = activityDetails.find((activity) => {
      const activityAspDetail =
        activity?.activityAspDetail || activity?.activityAspDetails;
      const isTowing = activityAspDetail?.serviceId == 1;
      const isNegative =
        activity?.activityStatusId &&
        [4, 5, 8].includes(activity.activityStatusId);
      return isTowing && isNegative;
    });

    const towingActivity = positiveTowingActivity || negativeTowingActivity;
    const towingActivityId = towingActivity?.id || null;

    // Fallback to latest positive activity if towing activity not found
    const latestActivityId =
      towingActivityId ||
      latestPositiveActivity?.data?.data?.[0]?.activityId ||
      null;

    updateLocationMutate({
      caseDetailId: caseViewData?.data?.data[0]?.caseDetailId,
      editType: 2, //1-Breakdown,2-Drop
      activityId: latestActivityId,
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
        : values?.dropToBreakdownDistance,
      dropAreaId: values?.droparea?.id,
      // Only send dropStateId for customer preferred location (not for dealer or when customer preferred is dealer)
      dropStateId:
        values?.drop_location_type?.id == 451 &&
        values?.customerPreferredLocation?.id != 461
          ? dropStateId
          : null,
    });
  };

  // Calculate distance between breakdown and drop location
  const getDistance = (start, end) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded");
      return;
    }
    const distanceService = new google.maps.DistanceMatrixService();
    const origin = new google.maps.LatLng(...start);
    const destination = new google.maps.LatLng(...end);
    const request = {
      origins: [origin],
      destinations: [destination],
      travelMode: "DRIVING",
    };

    distanceService.getDistanceMatrix(request, (response, status) => {
      if (status === "OK") {
        const distanceText = response.rows[0].elements[0].distance.text;
        const distanceValue = response.rows[0].elements[0].distance.value; // Distance in meters
        const distanceKm = (distanceValue / 1000).toFixed(2) + " km";

        // Update both breakdown and drop location forms based on context
        if (
          dropLocationType?.id == 451 &&
          (customerPreferredLocation?.id == 462 ||
            customerPreferredLocation?.id == 463 ||
            customerPreferredLocation?.id == 464)
        ) {
          if (distanceText.includes("m") && !distanceText.includes("km")) {
            setDropValue("dropToBreakdownDistance", distanceKm);
            setBdValue("dealerToBreakdownDistance", distanceKm);
          } else {
            setDropValue("dropToBreakdownDistance", distanceKm);
            setBdValue("dealerToBreakdownDistance", distanceKm);
          }
        } else {
          setDropValue("dealerToBreakdownDistance", distanceKm);
          setBdValue("dealerToBreakdownDistance", distanceKm);
        }
      } else {
        console.error("Distance calculation error:", status);
      }
    });
  };

  // Calculate distance when breakdown location changes (for breakdown edit form)
  useEffect(() => {
    if (
      bdlat &&
      bdlng &&
      caseViewData?.data?.data[0]?.dropLocationLat &&
      caseViewData?.data?.data[0]?.dropLocationLong
    ) {
      getDistance(
        [Number(bdlat), Number(bdlng)],
        [
          Number(caseViewData?.data?.data[0]?.dropLocationLat),
          Number(caseViewData?.data?.data[0]?.dropLocationLong),
        ]
      );
    }
  }, [
    bdlat,
    bdlng,
    caseViewData?.data?.data[0]?.dropLocationLat,
    caseViewData?.data?.data[0]?.dropLocationLong,
  ]);

  // Calculate distance when drop location changes (for drop location edit form)
  useEffect(() => {
    if (
      caseViewData?.data?.data[0]?.breakdownLat &&
      caseViewData?.data?.data[0]?.breakdownLong &&
      ((dplat && dplng) ||
        (selectedDealers?.latitude && selectedDealers?.longitude))
    ) {
      if (selectedDealers?.latitude && selectedDealers?.longitude) {
        if (dropLocationType?.id == 452) {
          // Use dealer distance if dealer is selected
          setDropValue("dealerToBreakdownDistance", selectedDealers?.distance);
        } else {
          getDistance(
            [
              Number(caseViewData?.data?.data[0]?.breakdownLat),
              Number(caseViewData?.data?.data[0]?.breakdownLong),
            ],
            [
              Number(selectedDealers?.latitude),
              Number(selectedDealers?.longitude),
            ]
          );
        }
      } else if (dplat && dplng) {
        getDistance(
          [
            Number(caseViewData?.data?.data[0]?.breakdownLat),
            Number(caseViewData?.data?.data[0]?.breakdownLong),
          ],
          [Number(dplat), Number(dplng)]
        );
      }
    }
  }, [
    caseViewData?.data?.data[0]?.breakdownLat,
    caseViewData?.data?.data[0]?.breakdownLong,
    dplat,
    dplng,
    selectedDealers,
    dropLocationType?.id,
  ]);

  useEffect(() => {
    if (selectedBdLocation?.description) {
      getGeocode({ address: selectedBdLocation?.description }).then(
        (results) => {
          const stateComponent = results[0]?.address_components?.find(
            (component) =>
              component.types.includes("administrative_area_level_1")
          );
          if (stateComponent) {
            getStateIdMutate(
              {
                code: stateComponent?.short_name,
              },
              {
                onSuccess: (res) => {
                  if (res?.data?.success) {
                    setBreakStateId(res?.data?.data?.id);
                  }
                },
              }
            );
          }
        }
      );
    } else {
      setAreaList([]);
    }
  }, [selectedBdLocation?.description]);

  useEffect(() => {
    if (selectedDropLocation?.description) {
      getGeocode({ address: selectedDropLocation?.description }).then(
        (results) => {
          const stateComponent = results[0]?.address_components?.find(
            (component) =>
              component.types.includes("administrative_area_level_1")
          );
          if (stateComponent) {
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
        }
      );
    } else {
      setAreaDropList([]);
    }
  }, [selectedDropLocation?.description]);
  const tabMenuItems = [
    { label: <TabMenuItem label="Case Info" /> },
    {
      label: (
        <TabMenuItem
          label="Activities"
          // badge={"4"}
          // badgeClassName={"danger"}
        />
      ),
    },
    { label: <TabMenuItem label="Services" /> },
  ];
  // console.log("case view", caseViewData?.data?.data)
  const { data: latestPositiveActivity } = useQuery(
    ["getLatestPositiveActivity"],
    () => getLatestPositiveActivity({ caseId: caseId }),
    {
      enabled: caseId ? true : false,
    }
  );
  //  console.log('latestPositiveActivity', latestPositiveActivity);
  // console.log("caseViewData => ", caseViewData);

  // Assign Agent Dropdown Options
  const { data: agentList } = useQuery(
    "rsaCaseagent",
    () =>
      agent({
        userTypeId: 141,
        limit: 1000,
        offset: 0,
        l2AgentOnly: true,
        ...(caseViewData?.data?.data?.callCenterId && {
          callCenterId: caseViewData.data.data.callCenterId,
        }),
      }),
    {
      enabled: agentAssignDialogeVisible,
    }
  );

  const { mutate: outboundCallMutate, isLoading: outboundCallLoading } =
    useMutation(clickToCall);

  // Assign Agent API
  const { mutate: assignAgentMutate, isLoading: assignAgentMutateLoading } =
    useMutation(assginAgent);

  const { mutate: closeCaseMutate, isLoading: closeCaseLoading } =
    useMutation(updateCaseClose);

  // Customer Invoice Send Form
  const {
    handleSubmit: handleCustomerInvoiceSubmit,
    control: controlCustomerInvoice,
    reset: CustomerInvoiceReset,
    formState: { errors: CustomerInvoiceErrors },
  } = useForm({});

  // Customer Invoice Send API
  const { mutate: customerInvoiceMutate, isLoading: customerInvoiceLoading } =
    useMutation(sendCustomerInvoice);

  const aspResultData = useQueries(
    activityIds
      ? activityIds?.map((activity, i) => {
          return {
            queryKey: [`caseServieProvider${i}`],
            queryFn: () =>
              aspData({
                activityId: activity?.id,
              }),
            enabled: activityIds?.length > 0 ? true : false,
          };
        })
      : []
  );
  const refetchAll = () => {
    aspResultData.forEach((query) => {
      query.refetch();
    });
  };
  //console.log('aspResultData => ', aspResultData);

  // Handle Case Close
  const handleCloseCase = () => {
    // console.log("case closed");
    setClosecaseVisible(true);
  };

  const closeCase = (values) => {
    // console.log('valuess', values);
    const isVdmCase = caseViewData?.data?.data[0]?.typeId == 32;

    // Merge SLA violation reason with pending closure form values if they exist
    const mergedValues = pendingCloseCaseValues
      ? { ...pendingCloseCaseValues, ...values }
      : values;

    const payload = {
      caseDetailId: caseViewData?.data?.data[0]?.caseDetailId,
      slaViolateReasonId: mergedValues?.slaViolateReasonId?.id || null,
      slaViolateReasonComments: mergedValues?.slaViolateReasonId?.name || null,
    };

    // Only include closure fields for non-VDM cases
    if (!isVdmCase) {
      payload.serviceDescriptionId = mergedValues?.serviceDescriptionId || null;
      payload.closureRemarks = mergedValues?.closureRemarks || null;
      payload.closureRating = mergedValues?.closureRating || null;
    }

    closeCaseMutate(payload, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setClosecaseVisible(false);
          setPendingCloseCaseValues(null);
          resetCloseCaseForm();
          caseViewRefetch();

          // aspRefetch[activeIndex]?.refetch();
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

  // Handle Confirm Case Close
  const handleConfirmCloseCase = (formValues = {}) => {
    let activity = {
      serviceInitiatingAtInMilliSeconds:
        latestPositiveActivity?.data?.data?.serviceInitiatingAtInMilliSeconds,
      activityCreatedAtInMilliSeconds:
        latestPositiveActivity?.data?.data?.activityCreatedAtInMilliSeconds,
      isInitiallyCreated:
        latestPositiveActivity?.data?.data?.activities[0]?.isInitiallyCreated,
      isImmediateService:
        latestPositiveActivity?.data?.data?.activities[0]?.isImmediateService,
      caseDetail: latestPositiveActivity?.data?.data?.caseDetail,
    };
    let closeSla = checkSla(
      activity,
      aspResultData[0]?.data?.data?.data[0]?.extras?.slaSettings,
      874,
      null
    );
    // console.log("closeSla", closeSla);
    if (closeSla == "violated") {
      setPendingCloseCaseValues(formValues);
      setCloseSlaReasonVisible(true);
    } else if (closeSla == "achieved") {
      closeCase(formValues);
    }
  };

  //handle outbound call
  const handleOutBoundCall = () => {
    outboundCallMutate(
      {
        agentId: user?.userName,
        campaignName: caseViewData?.data?.data[0]?.client,
        customerNumber:
          aspResultData?.[0]?.data?.data?.data[0]?.aspMechanic?.contactNumber,
        caseDetailId: caseViewData?.data?.data[0]?.caseDetailId?.toString(),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast?.success(res?.data?.message);
          } else {
            toast?.error(res?.data?.error);
          }
        },
      }
    );
  };

  // ASP Information
  const AspInfo =
    aspResultData?.length > 0
      ? aspResultData?.map((aspResult) => {
          return [
            {
              label: "Activity Status",
              badge: aspResult?.data?.data?.data[0]?.activityStatus,
              statusId: aspResult?.data?.data?.data[0]?.activityStatusId,
              statusType: "activityStatus",
              /* ...((userTypeId == 141 &&
          (caseViewData?.data?.data[0]?.caseStatusId == 1 ||
            caseViewData?.data?.data[0]?.caseStatusId == 2) && //activity cancel---> Agent
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(
            asp?.activityAppStatusId
          ) &&
          [2, 3, 9, 10].includes(asp?.activityStatusId)) ||
          (userTypeId == 140 &&
            (caseViewData?.data?.data[0]?.caseStatusId == 1 ||
              caseViewData?.data?.data[0]?.caseStatusId == 2) && //activity cancel---> Dealer
            [1, 2, 3].includes(asp?.activityAppStatusId) &&
            [2, 9, 10].includes(asp?.activityStatusId))
          ? {
            action: <span className="remove-text"> Cancel</span>,
            actionClick: () => setCancelVisible(true),
          }
          : {}), */
            },
            {
              label: "ASP Activity Status",
              value: aspResult?.data?.data?.data[0]?.aspActivityStatus || "--",
            },
            {
              label: "ASP Workshop Name",
              value: aspResult?.data?.data?.data[0]?.asp?.workshopName,
            },
            {
              label: "ASP Code",
              value: aspResult?.data?.data?.data[0]?.asp?.code,
              vlaueClassName: "info-badge info-badge-purple",
            },
            {
              label: "Driver Name",
              value: aspResult?.data?.data?.data[0]?.aspMechanic?.name || "--",
              // action: "Edit"
            },
            {
              label: "Driver Contact",
              value:
                aspResult?.data?.data?.data[0]?.aspMechanic?.contactNumber ||
                "--",
              vlaueClassName: aspResult?.data?.data?.data[0]?.aspMechanic
                ?.contactNumber
                ? "info-badge info-badge-yellow"
                : "",
              ...(aspResult?.data?.data?.data[0]?.aspMechanic
                ?.contactNumber && {
                btnLink: "Call",
                //btnLinkAction: () => handleOutBoundCall(),
              }),
            },
            /* {
        label: (
          <div className="d-flex align-items-center">
            ETA <img className={"eta-info-image"} src={InfoDarkIcon} />
          </div>
        ),
        value: "10 (min)",
        vlaueClassName: "info-badge info-badge-yellow",
      },
      {
        label: "Comment by ASP",
        value: "Starting to BD in 5 mins",
        
      }, */
            {
              label: "Service",
              value: aspResult?.data?.data?.data[0]?.service || "--",
              vlaueClassName: "info-badge info-badge-blue",
            },
          ];
        })
      : [];

  // console.log('aspInfo => ', AspInfo);

  // Ticket Info
  const TicketInfo = [
    // { label: "Membership type", value: caseViewData?.data?.data[0]?.serviceEligibility || '--' },
    // {
    //   label: "Service",
    //   value: caseViewData?.data?.data[0]?.service || "--",
    //   vlaueClassName: "info-badge info-badge-blue",
    // },
    // {
    //   label: "Sub Service",
    //   value: caseViewData?.data?.data[0]?.subService || "--",
    // },
    {
      label: "Current Contact Name",
      value: caseViewData?.data?.data[0]?.customerCurrentContactName,
    },
    {
      label: "Current Mobile Number",
      value: caseViewData?.data?.data[0]?.customerCurrentMobileNumber,
    },
    {
      label: "Alternate Mobile Number",
      value: caseViewData?.data?.data[0]?.customerAlternateMobileNumber,
    },
    {
      label: "Contact Language",
      value: caseViewData?.data?.data[0]?.contactLanguage,
    },

    {
      label: "Channel",
      value: caseViewData?.data?.data[0]?.channel,
    },
    {
      label: "Women Assist",
      value: caseViewData?.data?.data[0]?.womenAssist ? "Yes" : "No",
      vlaueClassName: `info-badge ${
        caseViewData?.data?.data[0]?.womenAssist
          ? "info-badge-green"
          : "info-badge-red"
      }`,
    },

    {
      label: "Irate Customer",
      value: caseViewData?.data?.data[0]?.irateCustomer ? "Yes" : "No",
      vlaueClassName: `info-badge ${
        caseViewData?.data?.data[0]?.irateCustomer
          ? "info-badge-green"
          : "info-badge-red"
      }`,
    },
    {
      label: "(VOC)Voice of Customer",
      value: caseViewData?.data?.data[0]?.voiceOfCustomer,
    },
    {
      label: "Probing Questions",
      action: "View Questions",
      actionClick: () => setQuestionnaireModalVisible(true),
    },

    /* {
      label: "Additional Charges",
      value: (
        <div className="additional-charges">
          ₹ 3000
          <div className="view-grid-item-value info-badge info-badge-green">
            Collected
          </div>
        </div>
      ),
    },
    {
      label: "Owner",
      subLabel: "(L2 agent)",
      value: "Arun Sharma",
    }, */
    // {
    //   label: "Requested By",
    //   value: caseViewData?.data?.data[0]?.createdBy || "--",
    // },
    /* { label: "SLA Category", value: "Location Type" },
    { label: "SLA Sub Category", value: "Highways" },
    { label: "SLA Status", value: "SLA Met" },
    {
      label: "SLA Estimation Time",
      value: "02/03/2022 20:20 AM",
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "SLA End Time",
      value: "03/03/2022 20:20 AM",
      vlaueClassName: "info-badge info-badge-purple",
    }, */
    {
      label: "L1 Agent",
      value: caseViewData?.data?.data[0]?.l1AgentName || "--",
    },
    ...(caseViewData?.data?.data[0]?.agentId
      ? [
          {
            label: "L2 Agent",
            value: caseViewData?.data?.data[0]?.agentName || "--",
          },
        ]
      : // [3,7].includes(user?.role?.id)
      permissions?.includes("agent-assign-manual-web") &&
        [1, 2].includes(caseViewData?.data?.data[0]?.caseStatusId)
      ? [
          {
            label: "L2 Agent",
            action: "Assign Agent",
            actionClick: () => setAgentAssignDialogeVisible(true),
          },
        ]
      : [
          {
            label: "L2 Agent",
            value: "--",
          },
        ]),
    {
      label: "Status",
      badge: caseViewData?.data?.data[0]?.caseStatus,
      statusId: caseViewData?.data?.data[0]?.caseStatusId,
      statusType: "caserequestStatus",
      ...(userTypeId == 141 &&
        caseViewData?.data?.data[0]?.agentId &&
        // user?.role?.id == 3
        permissions?.includes("case-close-web") &&
        id == caseViewData?.data?.data[0]?.agentId &&
        caseViewData?.data?.data[0]?.caseStatusId !== 4 &&
        caseViewData?.data?.data[0]?.caseStatusId !== 3 &&
        !caseViewData?.data?.data[0]?.activityDetails?.some((activity) =>
          [2, 3, 9, 10, 11, 13, 14].includes(activity.activityStatusId)
        ) &&
        user?.levelId !== 1045 && {
          action: "Close Case",
          actionClick: handleCloseCase,
        }),
    },
    {
      label: "Get Location Via",
      value: caseViewData?.data?.data[0]?.getLocationVia,
    },

    ...(caseViewData?.data?.data[0]?.manualLocationReason
      ? [
          {
            label: "Manual Location Reason",
            value: caseViewData?.data?.data[0]?.manualLocationReason,
          },
        ]
      : []),
    {
      label: "Breakdown Location",
      value: <div>{caseViewData?.data?.data[0]?.breakdownLocation} </div>,
      ...(caseViewData?.data?.data[0]?.caseStatusId == 2 &&
        !caseViewData?.data?.data[0]?.hasReachedBreakdown &&
        permissions?.includes("edit-breakdown-location-web") && {
          action: "Edit",
          actionClick: () => {
            setBreakdownVisible(true);
            caseViewRefetch();
            resetBd();
          },
        }),
    },
    {
      label: "Breakdown Nearby City",
      value: caseViewData?.data?.data[0]?.nearestCity,
    },
    {
      label: "Breakdown Area",
      value: caseViewData?.data?.data[0]?.breakdownArea,
    },
    {
      label: "Address By Customer",
      value: caseViewData?.data?.data[0]?.addressByCustomer || "--",
    },
    {
      label: "Breakdown Landmark",
      value: caseViewData?.data?.data[0]?.breakdownLandmark || "--",
    },
    {
      label: "Breakdown Location Type",
      value: caseViewData?.data?.data[0]?.breakdownAreaLocationType || "--",
    },
    {
      label: "Breakdown Location Category",
      value: caseViewData?.data?.data[0]?.breakdownAreaLocationCategory || "--",
    },
    {
      label: "Customer & Vehicle Location",
      value: caseViewData?.data?.data[0]?.vehicleLocation,
    },
    ...(caseViewData?.data?.data[0]?.activityDetails?.some(
      (activity) => activity.activityAspDetail.serviceId == 1 //Towing service
    )
      ? [
          {
            label: "Drop Location Type",
            value: caseViewData?.data?.data[0]?.dropLocationType || "--",
          },
        ]
      : []),
    ...(caseViewData?.data?.data[0]?.customerPreferredLocation
      ? [
          {
            label: "Customer Preferred Location",
            value:
              caseViewData?.data?.data[0]?.customerPreferredLocation || "--",
          },
        ]
      : []),
    ...(caseViewData?.data?.data[0]?.activityDetails?.some(
      (activity) => activity.activityAspDetail.serviceId == 1 //Towing service
    )
      ? [
          {
            label: "Drop Location",
            value: caseViewData?.data?.data[0]?.dropLocation || "--",
            ...(caseViewData?.data?.data[0]?.caseStatusId == 2 &&
              (!caseViewData?.data?.data[0]?.hasReachedBreakdown ||
                (caseViewData?.data?.data[0]?.hasReachedBreakdown &&
                  caseViewData?.data?.data[0]?.additionalServiceRequested)) &&
              permissions?.includes("edit-drop-location-web") && {
                action: "Edit",
                actionClick: () => {
                  setDropLocationForm(true);
                  caseViewRefetch();
                  resetDrop();
                },
              }),
          },
        ]
      : []),

    ...(caseViewData?.data?.data[0]?.dropArea
      ? [
          {
            label: "Drop Area",
            value: caseViewData?.data?.data[0]?.dropArea || "--",
          },
        ]
      : []),

    ...(caseViewData?.data?.data[0]?.dropDealer
      ? [
          {
            label: "Drop Dealer",
            value: caseViewData?.data?.data[0]?.dropDealer || "--",
          },
        ]
      : []),

    ...(caseViewData?.data?.data[0]?.breakdownToDropLocationDistance
      ? [
          {
            label: "Breakdown to Drop Distance",
            value:
              caseViewData?.data?.data[0]?.breakdownToDropLocationDistance ||
              "--",
          },
        ]
      : []),
    ...(caseViewData?.data?.data[0]?.caseStatusId !== 3 &&
    permissions?.includes("psf-collect") &&
    caseViewData?.data?.data[0]?.psfStatus !== 2
      ? [
          {
            label: "PSF",
            action: "Collect Feedback",
            actionClick: () => setFeedbackModalVisible(true),
          },
        ]
      : []),
    ...(permissions?.includes("psf-case-view") &&
    caseViewData?.data?.data[0]?.psfStatus === 2
      ? [
          {
            label: "PSF",
            action: "View PSF",
            actionClick: () => setFeedbackModalVisible(true),
          },
        ]
      : []),

    // Customer Invoice Details
    ...(caseViewData?.data?.data[0]?.customerInvoiceNumber
      ? [
          {
            label: "Customer Invoice Number",
            value: caseViewData?.data?.data[0]?.customerInvoiceNumber,
          },
        ]
      : []),
    ...(caseViewData?.data?.data[0]?.customerInvoiceNumber &&
    caseViewData?.data?.data[0]?.customerInvoicePath
      ? [
          {
            label: "Send Customer Invoice",
            btnLink: "Send Email",
            btnLinkAction: (e) => {
              emailPanel?.current?.toggle(e);
            },
            btnDisabled:
              user?.role?.id == 3 &&
              user?.levelId !== 1045 &&
              id == caseViewData?.data?.data[0]?.agentId
                ? false
                : true,
          },
          {
            label: "Customer Invoice",
            value: (
              <a
                className="btn-text btn-link"
                target="_blank"
                href={caseViewData?.data?.data[0]?.customerInvoicePath}
              >
                Download
              </a>
            ),
          },
        ]
      : []),
    // Cancellation Invoice Details
    ...(caseViewData?.data?.data[0]?.cancellationInvoiceNumber
      ? [
          {
            label: "Cancellation Invoice Number",
            value: caseViewData?.data?.data[0]?.cancellationInvoiceNumber,
          },
        ]
      : []),
    // ...(caseViewData?.data?.data[0]?.cancellationInvoiceDate
    //   ? [
    //       {
    //         label: "Cancellation Invoice Date",
    //         value: caseViewData?.data?.data[0]?.cancellationInvoiceDate,
    //         vlaueClassName: "info-badge info-badge-purple",
    //       },
    //     ]
    //   : []),
    ...(caseViewData?.data?.data[0]?.cancellationInvoicePath
      ? [
          {
            label: "Cancellation Invoice",
            value: (
              <a
                className="btn-text btn-link"
                target="_blank"
                href={caseViewData?.data?.data[0]?.cancellationInvoicePath}
              >
                Download
              </a>
            ),
          },
        ]
      : []),

    /* {
      label: "State",
      value: "Karnataka",
      vlaueClassName: "info-badge info-badge-blue",
    }, */
    /* { label: "Service Org", value: "Chennai", itemClassName: "separator-none" },
    { label: "Remarks", value: "Good Work",itemClassName: "separator-none"  },
    {
      label: "Rating",
      value: "5.5",
      
      vlaueClassName: "info-badge info-badge-yellow",
    }, */
  ];

  // Breadcrumbs Items
  const breadcrumbItems = [
    { label: <div onClick={() => navigate("/cases")}>Cases</div> },
    {
      label: (
        <div onClick={() => navigate(`/cases/view/${caseId}`)}>
          View Case - {caseViewData?.data?.data[0]?.caseNumber}
        </div>
      ),
    },

    ...(pathname?.includes("service-details")
      ? [
          {
            label: <div>View Service Details</div>,
          },
        ]
      : []),
  ];
  // console.log("Breadcrumb Items", breadcrumbItems);

  // Handle ASP Assign
  const handleAspAssign = (id) => {
    // console.log("Assign ASP Clicked", id);
    if (
      caseViewData?.data?.data[0]?.caseTypeId == 413 &&
      caseViewData?.data?.data[0]?.hasAccidentalDocument == false &&
      caseViewData?.data?.data[0]?.withoutAccidentalDocument == false
    ) {
      setAspDialogVisible(true);
      setAssignAspActivityId(id);
    } else {
      // navigate(`/cases/asp-assignment/${caseViewData?.data?.data[0]?.caseDetailId}`);
      const url = `/cases/asp-assignment/${caseViewData?.data?.data[0]?.caseDetailId}/${id}`;
      window.open(url, "_blank");
    }
  };

  // Handle Agent Assign
  const handleAgentAssign = (value) => {
    // console.log("agent assignValue", value);
    if (value) {
      assignAgentMutate(
        {
          caseDetailId: caseViewData?.data?.data[0]?.caseDetailId,
          agentId: parseInt(value?.agent?.id),
        },
        {
          onSuccess: (res) => {
            if (res?.data?.success) {
              toast.success(res?.data?.message);
              if (value?.agent?.id !== id) {
                navigate("/cases");
              }

              setAgentAssignDialogeVisible(false);
              caseViewRefetch(); //refetch cadse details after agent assign
            } else {
              toast.error(res?.data?.error);
            }
          },
        }
      );
    }
  };

  const refetchAspResultDataUsingIndex = (index) => {
    const query = aspResultData[index];
    if (query) {
      query.refetch();
    }
  };

  // Customer Invoice Send function
  const customerInvoiceSend = (values) => {
    // Check if case has customer invoice
    if (
      !caseViewData?.data?.data[0]?.customerInvoiceNumber ||
      !caseViewData?.data?.data[0]?.customerInvoicePath
    ) {
      toast.error("Customer invoice not found");
      return;
    }

    // Check if caseId is available
    if (!caseId) {
      toast.error("Case ID not found");
      return;
    }

    customerInvoiceMutate(
      {
        caseId: parseInt(caseId),
        ...values,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            emailPanel?.current?.hide();
            CustomerInvoiceReset();
            refetchAll();
            caseViewRefetch();
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
      <CustomBreadCrumb items={breadcrumbItems} milestone={false} />

      <div className="page-body">
        <div className="row row-gap-3_4 h-100">
          <div className="col-md-4">
            <CaseViewCard
              caseData={caseViewData?.data?.data[0]}
              caseStatusId={caseViewData?.data?.data[0]?.caseStatusId}
              activityDetails={caseViewData?.data?.data[0]?.activityDetails}
              caseViewRefetch={caseViewRefetch}
              handleAspAssign={handleAspAssign}
              setServiceVisible={setServiceVisible}
            />
          </div>
          {pathname.includes("service-details") && (
            <div className="col-md-8">
              <div className="">
                <ServiceDetails
                  aspResultData={
                    aspResultData
                      ? aspResultData?.map((aspInfo) => {
                          return aspInfo?.data?.data?.data[0];
                        })
                      : []
                  }
                  aspRefetch={aspResultData}
                  index={index}
                  caseViewData={caseViewData?.data?.data}
                  caseViewRefetch={caseViewRefetch}
                  refetchAspResultDataUsingIndex={
                    refetchAspResultDataUsingIndex
                  }
                />
              </div>
            </div>
          )}
          {!pathname.includes("service-details") && (
            <div className="col-md-8">
              <TabMenu
                model={tabMenuItems}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
                className="spearate-tab-menu min-168"
              />
              <div className="case-tab-content">
                <TabView
                  className="tab-header-hidden case-view-tab bg-transparent"
                  activeIndex={activeIndex}
                  onTabChange={(e) => setActiveIndex(e.index)}
                >
                  <TabPanel>
                    <CaseInfoTab
                      aspInfo={AspInfo}
                      ticketInfo={TicketInfo}
                      caseData={caseViewData?.data?.data[0]}
                      handleAspAssign={handleAspAssign}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ActivityTab caseData={caseViewData?.data?.data[0]} />
                  </TabPanel>
                  <TabPanel>
                    <ServiceTab
                      aspResultData={
                        aspResultData
                          ? aspResultData?.map((aspInfo) => {
                              return aspInfo?.data?.data?.data[0];
                            })
                          : []
                      }
                      caseData={caseViewData?.data?.data[0]}
                      aspRefetch={aspResultData}
                      caseDetailrefetch={caseViewRefetch}
                      handleAspAssign={handleAspAssign}
                      setServiceVisible={setServiceVisible}
                      caseViewData={caseViewData}
                    />
                  </TabPanel>
                </TabView>
              </div>
              <Outlet />
            </div>
          )}
        </div>
      </div>
      {aspDialogVisible && (
        <ASPDialog
          visible={aspDialogVisible}
          setVisible={setAspDialogVisible}
          caseDetailId={caseViewData?.data?.data[0]?.caseDetailId}
          // activityData={aspResultData[0]?.data?.data?.data[0]}
          activityData={assignAspActivityId}
        />
      )}
      {serviceVisible && (
        <ServiceSidebar
          activityData={aspResultData[0]?.data?.data?.data[0]}
          caseData={caseViewData?.data?.data[0]}
          visible={serviceVisible}
          setVisible={setServiceVisible}
          caseViewRefetch={caseViewRefetch}
        />
      )}
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Assign Agent</div>
          </div>
        }
        visible={agentAssignDialogeVisible}
        className="w-372"
        position={"bottom"}
        onHide={() => setAgentAssignDialogeVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form
          onSubmit={handleAgentFormSubmit(handleAgentAssign)}
          id="agent-form"
        >
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Agent</label>
                <Controller
                  name="agent"
                  control={control}
                  rules={{ required: "Agent is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        placeholder="Select Agent"
                        options={agentList?.data?.data
                          ?.sort((a, b) =>
                            a.id === id //'a' comes first because it has the target ID
                              ? -1
                              : b.id == id // 'b' comes first because it has the target ID
                              ? 1
                              : // Sort alphabetically by the 'name' property
                              a.name.toUpperCase() < b.name.toUpperCase()
                              ? -1
                              : 1
                          )
                          ?.map((agent) => {
                            return {
                              name:
                                agent.id == id
                                  ? `${agent.name}-(Self Assign)`
                                  : agent.name,
                              id: agent.id,
                            };
                          })}
                        optionLabel="name"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {agentFormErrors &&
                          agentFormErrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-12 align-content-end">
              <Button
                className="confirm-btn"
                type="submit"
                form="agent-form"
                loading={assignAgentMutateLoading}
                //disabled={caseStatusId == 3 ? true : false}
              >
                Assign
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Close Case</div>
          </div>
        }
        visible={closecaseVisible}
        position={"bottom"}
        className="w-400"
        onHide={() => {
          setClosecaseVisible(false);
          setPendingCloseCaseValues(null);
          resetCloseCaseForm();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        {caseViewData?.data?.data[0]?.typeId == 32 ? (
          // VDM Case - Simple confirmation dialog
          <div className="d-flex gap mt-3_4">
            <Button
              className="btn btn-white ms-auto"
              onClick={() => {
                setClosecaseVisible(false);
                setPendingCloseCaseValues(null);
                resetCloseCaseForm();
              }}
            >
              Cancel
            </Button>
            <Button
              className="btn-danger"
              onClick={handleConfirmCloseCase}
              loading={closeCaseLoading}
            >
              Close Case
            </Button>
          </div>
        ) : (
          // CRM Case - Form with closure fields below confirmation
          <form
            onSubmit={handleCloseCaseFormSubmit((values) => {
              handleConfirmCloseCase(values);
            })}
          >
            <div className="row row-gap-2">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">
                    Service Description
                  </label>
                  <Controller
                    name="serviceDescriptionId"
                    control={closeCaseControl}
                    rules={{ required: "Service Description is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Service Description"
                          options={
                            serviceDescriptionData?.data?.data?.map(
                              ({ id, name }) => ({
                                label: name,
                                value: id,
                              })
                            ) || []
                          }
                          optionLabel="label"
                          optionValue="value"
                          onChange={(e) => field.onChange(e.value)}
                          filter
                        />
                        <div className="p-error">
                          {closeCaseErrors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Closure Rating</label>
                  <Controller
                    name="closureRating"
                    control={closeCaseControl}
                    rules={{
                      required: "Closure Rating is required.",
                      min: {
                        value: 1,
                        message: "Rating must be between 1 and 5",
                      },
                      max: {
                        value: 5,
                        message: "Rating must be between 1 and 5",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <div className="d-flex align-items-center gap-2">
                          <Rating
                            value={field.value || 0}
                            onChange={(e) => field.onChange(e.value)}
                            stars={5}
                            cancel={false}
                            className={fieldState.error ? "p-invalid" : ""}
                          />
                          {field.value && (
                            <span style={{ fontSize: "14px", fontWeight: 500 }}>
                              {field.value}/5
                            </span>
                          )}
                        </div>
                        <div className="p-error">
                          {closeCaseErrors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Closure Remarks</label>
                  <Controller
                    name="closureRemarks"
                    control={closeCaseControl}
                    rules={{ required: "Closure Remarks is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextarea
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          rows={2}
                          cols={30}
                          placeholder="Enter closure remarks"
                          className={fieldState.error ? "p-invalid" : ""}
                        />
                        <div className="p-error">
                          {closeCaseErrors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex gap mt-2">
              <Button
                className="btn btn-white ms-auto"
                type="button"
                onClick={() => {
                  setClosecaseVisible(false);
                  setPendingCloseCaseValues(null);
                  resetCloseCaseForm();
                }}
              >
                Cancel
              </Button>
              <Button
                className="btn-danger"
                type="submit"
                loading={closeCaseLoading}
              >
                Close Case
              </Button>
            </div>
          </form>
        )}
        {closeSlaReasonVisible && (
          <SlaReasonDialog
            title="Close Case"
            updatePickTime={closeCase}
            setSlaReasonVisible={setCloseSlaReasonVisible}
            slaReasonVisible={closeSlaReasonVisible}
            loading={closeCaseLoading}
          />
        )}
      </Dialog>
      <CustomerFeedbackModal
        visible={feedbackModalVisible}
        setVisible={setFeedbackModalVisible}
        caseDetailId={caseViewData?.data?.data[0]?.caseDetailId}
        clientId={caseViewData?.data?.data[0]?.clientId}
        clientName={caseViewData?.data?.data[0]?.client}
        psfStatus={caseViewData?.data?.data[0]?.psfStatus}
        lastContactedAt={
          caseViewData?.data?.data[0]?.lastContactedAt
            ? new Date(
                caseViewData?.data?.data[0]?.lastContactedAt
              ).toLocaleString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : null
        }
        onSuccess={caseViewRefetch}
      />
      <QuestionnaireModal
        visible={questionnaireModalVisible}
        setVisible={setQuestionnaireModalVisible}
        caseId={caseId}
      />
      {/* Edit Drop Location Dialog */}
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Edit Drop Location</div>
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
                  control={dropControl}
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
                      {dropErrors[field?.name] && (
                        <div className="p-error">
                          {dropErrors[field.name]?.message}
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
                  Drop Location Type
                </label>
                <Controller
                  name="drop_location_type"
                  control={dropControl}
                  rules={{ required: "Drop Location Type is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Drop Location Type "
                        resetFilterOnHide={true}
                        className="form-control-select"
                        options={dropLocationTypes}
                        optionLabel="name"
                        onChange={(e) => {
                          field.onChange(e.value);
                          handleDropLocationTypeChange(e);
                        }}
                      />

                      {dropErrors[field?.name] && (
                        <div className="p-error">
                          {dropErrors[field.name]?.message}
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
                          onChange={(e) => {
                            field.onChange(e.value);
                            handlePreferredLocationTypeChange(e);
                          }}
                        />
                        {dropErrors[field?.name] && (
                          <div className="p-error">
                            {dropErrors[field.name]?.message}
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
                        control={dropControl}
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
                                field.onChange(e.value);
                                handleDealerSelect(e);
                              }}
                            />
                            {dropErrors[field?.name] && (
                              <div className="p-error">
                                {dropErrors[field.name]?.message}
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
                      </div>
                      {dropErrors["dealers"] && (
                        <div className="p-error">
                          {dropErrors["dealers"]?.message}
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
                          {dropErrors[field.name] && (
                            <div className="p-error">
                              {dropErrors[field.name]?.message}
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
                            value={field.value || ""}
                            className={`form-control `}
                            placeholder="Breakdown to Drop Distance"
                            disabled
                          />
                          {dropErrors[field.name] && (
                            <div className="p-error">
                              {dropErrors[field.name]?.message}
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
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        Drop Location
                      </label>
                      <div className="p-inputgroup">
                        <Controller
                          name="dropdownlocation"
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
                                  handleChange(e, field);
                                }}
                                onSelect={(e) =>
                                  handleSelect(e.value, field, "drop")
                                }
                                placeholder="Search places"
                                showEmptyMessage={true}
                              />
                            </>
                          )}
                        />
                      </div>
                      {dropErrors["dropdownlocation"] && (
                        <div className="p-error">
                          {dropErrors["dropdownlocation"]?.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        Drop Latitude & longitude
                      </label>
                      <Controller
                        name="droplatlng"
                        control={dropControl}
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
                              placeholder="Enter Drop Latitude & longitude"
                              disabled
                            />
                            {dropErrors[field.name] && (
                              <div className="p-error">
                                {dropErrors[field.name]?.message}
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
                                  field.onChange(e.value);
                                }}
                              />
                            )}
                            {dropErrors[field.name] && (
                              <div className="p-error">
                                {dropErrors[field.name]?.message}
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
                              value={field.value || ""}
                              className={`form-control ${
                                fieldState.error ? "p-invalid" : ""
                              }`}
                              placeholder="Breakdown to Drop Distance"
                              disabled
                            />
                            {dropErrors[field.name] && (
                              <div className="p-error">
                                {dropErrors[field.name]?.message}
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
              loading={updateLocationLoading}
            >
              Confirm
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Breakdown Location Dialog */}
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Edit Breakdown Location</div>
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
            {caseViewData?.data?.data[0]?.dropLocation != null && (
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">
                    Breakdown to Drop Distance
                  </label>
                  <Controller
                    name="dealerToBreakdownDistance"
                    control={bdControl}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          value={field.value || ""}
                          className={`form-control `}
                          placeholder="Enter Breakdown to Drop Distance"
                          disabled
                        />
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
              loading={updateLocationLoading}
            >
              Confirm
            </Button>
          </div>
        </form>
      </Dialog>

      <OverlayPanel ref={emailPanel} className="form-overlay-panel">
        <div className="filter-header">
          <div className="filter-title">Send Customer Invoice</div>
        </div>
        <div className="filter-body">
          <form
            onSubmit={handleCustomerInvoiceSubmit(customerInvoiceSend)}
            id="email-customer-invoice"
          >
            <div className="d-flex flex-column gap-3_4">
              <div className="form-group">
                <label className="form-label filter-label required">
                  Email
                </label>
                <Controller
                  name="email"
                  control={controlCustomerInvoice}
                  rules={{ required: "Email is required" }}
                  render={({ field }) => (
                    <>
                      <InputText
                        id="email"
                        {...field}
                        placeholder="Enter Email"
                      />
                      <div className="p-error">
                        {CustomerInvoiceErrors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary gap-3_4"
                  form="email-customer-invoice"
                  type="submit"
                  loading={customerInvoiceLoading}
                >
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default CaseView;
