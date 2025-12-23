import React, { useRef, useState, useEffect, useCallback } from "react";
import GoogleMapReact from "google-map-react";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import moment from "moment-timezone";

import SearchBar from "./Search";
import FilterPanel from "./FilterPanel";
import MapMarkerDetailsPanel from "./MapMarkerDetailsPanel";
import "./style.less";

import {
  BlackAsp,
  BlueAsp,
  GreenAsp,
  RedAsp,
  GreenCase,
  RedCase,
  YellowCase,
  Asp,
  Case,
  GoogleMapAPIKey,
  PhoneMapIcon,
  FilterIcon,
  // Vehicle Type Icons
  CarGreen,
  CarBlue,
  CarRed,
  CarBlack,
  TruckGreen,
  TruckBlue,
  TruckRed,
  TruckBlack,
  ScooterGreen,
  ScooterBlue,
  ScooterRed,
  ScooterBlack,
  MotorcycleGreen,
  MotorcycleBlue,
  MotorcycleRed,
  MotorcycleBlack,
  // Mechanic Icons for Technicians
  MechanicGreen,
  MechanicBlue,
  MechanicRed,
  MechanicBlack,
} from "../../utills/imgConstants";
import { clickToCall } from "../../../services/callService";

import {
  aspMapSearch,
  caseMapSearch,
  technicianMapSearch,
} from "../../../services/mapServices";
import { getMapViewFilterData } from "../../../services/masterServices";
import {
  getMapViewFilters,
  deleteMapViewFilters,
} from "../../../services/userService";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useMapViewContext } from "../../contexts/MapViewContext";

const MapViewContent = () => {
  const [markers, setMarkers] = useState([]); // State to store markers
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Initial center of the map
  const [zoom, setZoom] = useState(5); // Initial zoom
  const user = useSelector(CurrentUser);
  const [map, setMap] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);
  const [circle, setCircle] = useState(null);
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);
  // Set default vehicle case filter to "Vehicle"
  const [filters, setFilters] = useState({
    vehicleCaseFilterIds: ["Vehicle"],
  });
  const mapViewContext = useMapViewContext();

  // Handle case when context is not available (shouldn't happen, but safety check)
  if (!mapViewContext) {
    console.error(
      "MapViewContext is not available. Make sure MapViewProvider wraps the component."
    );
    return <div>Loading...</div>;
  }

  const {
    statusCounts,
    setStatusCounts,
    selectedStatusFilter,
    setSelectedStatusFilter,
    selectedFilterType,
    setSelectedFilterType,
    setHandleStatusFilterClick,
    storedAspData,
    setStoredAspData,
    storedCaseData,
    setStoredCaseData,
    storedTechnicianData,
    setStoredTechnicianData,
  } = mapViewContext;

  const infoWindowRef = useRef(null);
  const markersRef = useRef([]); // Keep a reference to all markers created on the map
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isDetailsPanelVisible, setIsDetailsPanelVisible] = useState(false);

  const { mutate: aspMapSearchMutate } = useMutation(aspMapSearch);
  const { mutate: caseMapSearchMutate } = useMutation(caseMapSearch);
  const { mutate: technicianMapSearchMutate } =
    useMutation(technicianMapSearch);
  const { mutate: deleteFiltersMutate } = useMutation(deleteMapViewFilters);

  // Fetch filter options - only once on mount/refresh, not on tab changes, clicks, or filter panel interactions
  const { data: filterOptionsData } = useQuery(
    ["mapViewFilterData", user?.id],
    () =>
      getMapViewFilterData({
        authUserData: { id: user?.id, permissions: user?.role?.permissions },
      }),
    {
      enabled: !!user?.id,
      refetchOnWindowFocus: false, // Don't refetch when switching tabs or window focus
      refetchOnMount: false, // Don't refetch on component remount
      refetchOnReconnect: false, // Don't refetch on network reconnect
      refetchInterval: false, // Don't refetch on interval
      staleTime: Infinity, // Data never becomes stale
      cacheTime: Infinity, // Keep in cache forever (now called gcTime in newer versions)
      // Prevent refetch on any user interaction
      notifyOnChangeProps: ["data", "error"],
    }
  );

  // Fetch saved filters - refetch when component mounts (user navigates back to map view)
  const {
    data: savedFiltersData,
    isSuccess: savedFiltersLoaded,
    isError: savedFiltersError,
  } = useQuery(
    ["mapViewSavedFilters", user?.id],
    () => getMapViewFilters({ userId: user?.id }),
    {
      enabled: !!user?.id,
      refetchOnWindowFocus: false, // Don't refetch when switching tabs or window focus
      refetchOnMount: true, // Refetch when component remounts (user navigates back to map view)
      refetchOnReconnect: false, // Don't refetch on network reconnect
      refetchInterval: false, // Don't refetch on interval
      staleTime: 0, // Data is considered stale immediately, so it refetches on mount
      cacheTime: Infinity, // Keep in cache forever (now called gcTime in newer versions)
      // Prevent refetch on any user interaction
      notifyOnChangeProps: ["data", "error"],
      onSuccess: (res) => {
        if (
          res?.data?.success &&
          res?.data?.data &&
          Object.keys(res?.data?.data).length > 0
        ) {
          // Use saved filters if they exist
          const savedFilters = res.data.data;

          // Ensure savedFilters is an object, not a string
          let filtersToNormalize = savedFilters;
          if (typeof savedFilters === "string") {
            console.warn("savedFilters is a string, parsing...");
            try {
              filtersToNormalize = JSON.parse(savedFilters);
            } catch (e) {
              console.error("Failed to parse savedFilters:", e);
              filtersToNormalize = {};
            }
          }

          // Normalize all filter arrays to ensure they're arrays
          const normalizedFilters = {
            ...filtersToNormalize,
            // Ensure vehicleCaseFilterIds is always an array
            vehicleCaseFilterIds:
              filtersToNormalize.vehicleCaseFilterIds &&
              Array.isArray(filtersToNormalize.vehicleCaseFilterIds)
                ? filtersToNormalize.vehicleCaseFilterIds
                : filtersToNormalize.vehicleCaseFilterIds
                ? [filtersToNormalize.vehicleCaseFilterIds]
                : ["Vehicle"],
            // Normalize all other filter arrays
            statusIds: Array.isArray(filtersToNormalize.statusIds)
              ? filtersToNormalize.statusIds
              : filtersToNormalize.statusIds
              ? [filtersToNormalize.statusIds]
              : [],
            caseSubjectNames: Array.isArray(filtersToNormalize.caseSubjectNames)
              ? filtersToNormalize.caseSubjectNames
              : filtersToNormalize.caseSubjectNames
              ? [filtersToNormalize.caseSubjectNames]
              : [],
            stateIds: Array.isArray(filtersToNormalize.stateIds)
              ? filtersToNormalize.stateIds
              : filtersToNormalize.stateIds
              ? [filtersToNormalize.stateIds]
              : [],
            slaStatusIds: Array.isArray(filtersToNormalize.slaStatusIds)
              ? filtersToNormalize.slaStatusIds
              : filtersToNormalize.slaStatusIds
              ? [filtersToNormalize.slaStatusIds]
              : [],
            clientIds: Array.isArray(filtersToNormalize.clientIds)
              ? filtersToNormalize.clientIds
              : filtersToNormalize.clientIds
              ? [filtersToNormalize.clientIds]
              : [],
            unAssignmentReasonIds: Array.isArray(
              filtersToNormalize.unAssignmentReasonIds
            )
              ? filtersToNormalize.unAssignmentReasonIds
              : filtersToNormalize.unAssignmentReasonIds
              ? [filtersToNormalize.unAssignmentReasonIds]
              : [],
            serviceIds: Array.isArray(filtersToNormalize.serviceIds)
              ? filtersToNormalize.serviceIds
              : filtersToNormalize.serviceIds
              ? [filtersToNormalize.serviceIds]
              : [],
            aspActivityStatusIds: Array.isArray(
              filtersToNormalize.aspActivityStatusIds
            )
              ? filtersToNormalize.aspActivityStatusIds
              : filtersToNormalize.aspActivityStatusIds
              ? [filtersToNormalize.aspActivityStatusIds]
              : [],
            activityStatusIds: Array.isArray(
              filtersToNormalize.activityStatusIds
            )
              ? filtersToNormalize.activityStatusIds
              : filtersToNormalize.activityStatusIds
              ? [filtersToNormalize.activityStatusIds]
              : [],
            serviceOrganisationIds: Array.isArray(
              filtersToNormalize.serviceOrganisationIds
            )
              ? filtersToNormalize.serviceOrganisationIds
              : filtersToNormalize.serviceOrganisationIds
              ? [filtersToNormalize.serviceOrganisationIds]
              : [],
            apiUserIds: Array.isArray(filtersToNormalize.apiUserIds)
              ? filtersToNormalize.apiUserIds
              : filtersToNormalize.apiUserIds
              ? [filtersToNormalize.apiUserIds]
              : [],
            // Handle createdOn date - convert string dates back to Date objects if needed
            createdOn:
              filtersToNormalize.createdOn &&
              Array.isArray(filtersToNormalize.createdOn)
                ? filtersToNormalize.createdOn.map((date) =>
                    date instanceof Date ? date : new Date(date)
                  )
                : filtersToNormalize.createdOn
                ? [new Date(filtersToNormalize.createdOn)]
                : null,
            // Preserve other filter properties
            caseNumber: filtersToNormalize.caseNumber || "",
            aspCode: filtersToNormalize.aspCode || "",
          };

          // Ensure we're setting a proper object, not a stringified one
          // Check if normalizedFilters has numeric keys (indicates stringified object)
          const keys = Object.keys(normalizedFilters);
          if (keys.length > 0 && keys.every((key) => /^\d+$/.test(key))) {
            console.error(
              "ERROR: normalizedFilters is a stringified object! Attempting to fix..."
            );
            // This shouldn't happen, but if it does, try to reconstruct
            try {
              const reconstructed = keys
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((key) => normalizedFilters[key])
                .join("");
              const parsed = JSON.parse(reconstructed);
              setFilters(parsed);
            } catch (e) {
              console.error("Failed to reconstruct, using defaults:", e);
              setFilters({ vehicleCaseFilterIds: ["Vehicle"] });
            }
          } else {
            // Normal case - set the filters
            setFilters(normalizedFilters);
          }
        } else {
          // Set default filters if no saved filters
          setFilters({
            vehicleCaseFilterIds: ["Vehicle"],
          });
        }
      },
      onError: (error) => {
        // On error, use default filters (graceful fallback)
        console.error("Error fetching saved filters:", error);
        setFilters({
          vehicleCaseFilterIds: ["Vehicle"],
        });
      },
    }
  );

  // Handle cached data: Apply saved filters when component remounts and data is already in cache
  const hasAppliedSavedFiltersRef = useRef(false);

  // Reset ref when savedFiltersData changes (on refetch/remount)
  useEffect(() => {
    hasAppliedSavedFiltersRef.current = false;
  }, [savedFiltersData]);

  useEffect(() => {
    if (
      savedFiltersLoaded &&
      savedFiltersData?.data?.success &&
      savedFiltersData?.data?.data &&
      Object.keys(savedFiltersData.data.data).length > 0 &&
      !hasAppliedSavedFiltersRef.current
    ) {
      // Apply saved filters (only once per data fetch)
      hasAppliedSavedFiltersRef.current = true;
      const savedFilters = savedFiltersData.data.data;

      // Ensure savedFilters is an object, not a string
      let filtersToNormalize = savedFilters;
      if (typeof savedFilters === "string") {
        try {
          filtersToNormalize = JSON.parse(savedFilters);
        } catch (e) {
          console.error("Failed to parse savedFilters:", e);
          return;
        }
      }

      // Normalize all filter arrays to ensure they're arrays
      const normalizedFilters = {
        ...filtersToNormalize,
        vehicleCaseFilterIds:
          filtersToNormalize.vehicleCaseFilterIds &&
          Array.isArray(filtersToNormalize.vehicleCaseFilterIds)
            ? filtersToNormalize.vehicleCaseFilterIds
            : filtersToNormalize.vehicleCaseFilterIds
            ? [filtersToNormalize.vehicleCaseFilterIds]
            : ["Vehicle"],
        statusIds: Array.isArray(filtersToNormalize.statusIds)
          ? filtersToNormalize.statusIds
          : filtersToNormalize.statusIds
          ? [filtersToNormalize.statusIds]
          : [],
        caseSubjectNames: Array.isArray(filtersToNormalize.caseSubjectNames)
          ? filtersToNormalize.caseSubjectNames
          : filtersToNormalize.caseSubjectNames
          ? [filtersToNormalize.caseSubjectNames]
          : [],
        stateIds: Array.isArray(filtersToNormalize.stateIds)
          ? filtersToNormalize.stateIds
          : filtersToNormalize.stateIds
          ? [filtersToNormalize.stateIds]
          : [],
        slaStatusIds: Array.isArray(filtersToNormalize.slaStatusIds)
          ? filtersToNormalize.slaStatusIds
          : filtersToNormalize.slaStatusIds
          ? [filtersToNormalize.slaStatusIds]
          : [],
        clientIds: Array.isArray(filtersToNormalize.clientIds)
          ? filtersToNormalize.clientIds
          : filtersToNormalize.clientIds
          ? [filtersToNormalize.clientIds]
          : [],
        unAssignmentReasonIds: Array.isArray(
          filtersToNormalize.unAssignmentReasonIds
        )
          ? filtersToNormalize.unAssignmentReasonIds
          : filtersToNormalize.unAssignmentReasonIds
          ? [filtersToNormalize.unAssignmentReasonIds]
          : [],
        serviceIds: Array.isArray(filtersToNormalize.serviceIds)
          ? filtersToNormalize.serviceIds
          : filtersToNormalize.serviceIds
          ? [filtersToNormalize.serviceIds]
          : [],
        aspActivityStatusIds: Array.isArray(
          filtersToNormalize.aspActivityStatusIds
        )
          ? filtersToNormalize.aspActivityStatusIds
          : filtersToNormalize.aspActivityStatusIds
          ? [filtersToNormalize.aspActivityStatusIds]
          : [],
        activityStatusIds: Array.isArray(filtersToNormalize.activityStatusIds)
          ? filtersToNormalize.activityStatusIds
          : filtersToNormalize.activityStatusIds
          ? [filtersToNormalize.activityStatusIds]
          : [],
        serviceOrganisationIds: Array.isArray(
          filtersToNormalize.serviceOrganisationIds
        )
          ? filtersToNormalize.serviceOrganisationIds
          : filtersToNormalize.serviceOrganisationIds
          ? [filtersToNormalize.serviceOrganisationIds]
          : [],
        apiUserIds: Array.isArray(filtersToNormalize.apiUserIds)
          ? filtersToNormalize.apiUserIds
          : filtersToNormalize.apiUserIds
          ? [filtersToNormalize.apiUserIds]
          : [],
        createdOn:
          filtersToNormalize.createdOn &&
          Array.isArray(filtersToNormalize.createdOn)
            ? filtersToNormalize.createdOn.map((date) =>
                date instanceof Date ? date : new Date(date)
              )
            : filtersToNormalize.createdOn
            ? [new Date(filtersToNormalize.createdOn)]
            : null,
        caseNumber: filtersToNormalize.caseNumber || "",
        aspCode: filtersToNormalize.aspCode || "",
      };

      // Check if normalizedFilters has numeric keys (indicates stringified object)
      const keys = Object.keys(normalizedFilters);
      if (keys.length > 0 && keys.every((key) => /^\d+$/.test(key))) {
        console.error(
          "ERROR: normalizedFilters is a stringified object! Attempting to fix..."
        );
        try {
          const reconstructed = keys
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((key) => normalizedFilters[key])
            .join("");
          const parsed = JSON.parse(reconstructed);
          setFilters(parsed);
        } catch (e) {
          console.error("Failed to reconstruct, using defaults:", e);
          setFilters({ vehicleCaseFilterIds: ["Vehicle"] });
        }
      } else {
        setFilters(normalizedFilters);
      }
    }
  }, [savedFiltersLoaded, savedFiltersData]);

  const addCircle = (lat, lng, radius) => {
    if (!map || !mapsApi) {
      console.warn("Google Maps API not loaded yet");
      return;
    }
    if (circle) {
      circle.setMap(null); // Remove the existing circle if any
    }
    const newCircle = new mapsApi.Circle({
      strokeColor: "#87CEEB",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#87CEEB",
      fillOpacity: 0.35,
      map: map,
      center: { lat, lng },
      radius: radius * 1000, // Convert radius from km to meters
    });
    newCircle.addListener("click", () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    });
    setCircle(newCircle);
  };

  const removeCircle = () => {
    if (circle) {
      circle.setMap(null);
      setCircle(null);
    }
  };

  // Calculate status counts from stored ASP, Case, and Technician data
  const calculateStatusCounts = useCallback(
    (aspData, caseData, technicianData) => {
      const counts = {
        asp: {
          green: 0,
          blue: 0,
          red: 0,
          black: 0,
        },
        case: {
          green: 0,
          yellow: 0,
          red: 0,
        },
        technician: {
          green: 0,
          blue: 0,
          red: 0,
          black: 0,
        },
      };

      // Calculate ASP status counts
      if (aspData && Array.isArray(aspData)) {
        aspData.forEach((asp) => {
          if (asp.colorStatus) {
            if (asp.colorStatus === "green") {
              counts.asp.green++;
            } else if (asp.colorStatus === "blue") {
              counts.asp.blue++;
            } else if (asp.colorStatus === "red") {
              counts.asp.red++;
            } else if (asp.colorStatus === "black") {
              counts.asp.black++;
            }
          }
        });
      }

      // Calculate Case status counts
      if (caseData && Array.isArray(caseData)) {
        caseData.forEach((caseItem) => {
          if (caseItem.color) {
            if (caseItem.color === "green") {
              counts.case.green++;
            } else if (caseItem.color === "yellow") {
              counts.case.yellow++;
            } else if (caseItem.color === "red") {
              counts.case.red++;
            }
          }
        });
      }

      // Calculate Technician status counts
      if (technicianData && Array.isArray(technicianData)) {
        technicianData.forEach((technician) => {
          if (technician.colorStatus) {
            if (technician.colorStatus === "green") {
              counts.technician.green++;
            } else if (technician.colorStatus === "blue") {
              counts.technician.blue++;
            } else if (technician.colorStatus === "red") {
              counts.technician.red++;
            } else if (technician.colorStatus === "black") {
              counts.technician.black++;
            }
          }
        });
      }

      return counts;
    },
    []
  );

  // Clear existing markers from the map when the new markers are set
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    markersRef.current = [];
    if (infoWindowRef?.current && map) {
      infoWindowRef.current.close(map);
    }
    removeCircle();
  };

  // Handle status filter click - will be defined after refreshMarkers
  let handleStatusFilterClick;

  const { mutate: outboundCallMutate, isLoading: outboundCallLoading } =
    useMutation(clickToCall);

  // Helper function to get vehicle type-based icon
  // Maps vehicleTypeId and colorStatus to appropriate icon
  // Vehicle type icons should follow naming: {vehicleType}_{colorStatus}.svg
  // e.g., car_green.svg, truck_blue.svg, scooter_red.svg, motorcycle_black.svg
  // For Technicians, always use mechanic icons regardless of vehicle type
  const getVehicleTypeIcon = (marker) => {
    // For Technician markers, always use mechanic icons
    if (marker.type === "Technician") {
      const colorStatus = marker.colorStatus || "black";
      const mechanicIconMap = {
        green: MechanicGreen,
        blue: MechanicBlue,
        red: MechanicRed,
        black: MechanicBlack,
      };
      return mechanicIconMap[colorStatus] || MechanicBlack;
    }

    // For ASP markers with vehicle type information
    if (marker.type === "ASP" && marker.vehicleTypeId) {
      const vehicleTypeName = marker.vehicleType
        ? marker.vehicleType.toLowerCase().replace(/\s+/g, "_")
        : null;
      const colorStatus = marker.colorStatus || "black";

      // Vehicle type icon mapping
      // Format: vehicleTypeIconMap[vehicleTypeName][colorStatus]
      const vehicleTypeIconMap = {
        // Car icons
        car: {
          green: CarGreen,
          blue: CarBlue,
          red: CarRed,
          black: CarBlack,
        },
        // Truck icons
        truck: {
          green: TruckGreen,
          blue: TruckBlue,
          red: TruckRed,
          black: TruckBlack,
        },
        // Scooter icons
        scooter: {
          green: ScooterGreen,
          blue: ScooterBlue,
          red: ScooterRed,
          black: ScooterBlack,
        },
        // Motorcycle icons
        motorcycle: {
          green: MotorcycleGreen,
          blue: MotorcycleBlue,
          red: MotorcycleRed,
          black: MotorcycleBlack,
        },
      };

      // Get icon based on vehicle type and color status
      // Handle case-insensitive matching and common variations
      if (vehicleTypeName) {
        // Normalize vehicle type name (remove spaces, convert to lowercase)
        const normalizedType = vehicleTypeName
          .toLowerCase()
          .replace(/\s+/g, "_");

        // Try exact match first
        if (vehicleTypeIconMap[normalizedType]) {
          return vehicleTypeIconMap[normalizedType][colorStatus] || CarBlack;
        }

        // Try common variations
        const typeVariations = {
          two_wheeler: "scooter",
          "2_wheeler": "scooter",
          "two-wheeler": "scooter",
          "2-wheeler": "scooter",
          bike: "motorcycle",
          bikes: "motorcycle",
          auto: "scooter",
          auto_rickshaw: "scooter",
          van: "truck",
          pickup: "truck",
          pickup_truck: "truck",
        };

        const mappedType = typeVariations[normalizedType];
        if (mappedType && vehicleTypeIconMap[mappedType]) {
          return vehicleTypeIconMap[mappedType][colorStatus] || CarBlack;
        }
      }

      // Fallback: use generic ASP icon based on color status
      return getVehicleTypeIconFallback(marker);
    }

    // Not an ASP marker or no vehicle type info
    return null;
  };

  // Fallback function for vehicle type icons (uses car icons for ASP markers, mechanic icons for Technician markers)
  const getVehicleTypeIconFallback = (marker) => {
    if (marker.type === "ASP") {
      return marker.colorStatus === "green"
        ? CarGreen
        : marker.colorStatus === "blue"
        ? CarBlue
        : marker.colorStatus === "red"
        ? CarRed
        : CarBlack;
    }
    if (marker.type === "Technician") {
      return marker.colorStatus === "green"
        ? MechanicGreen
        : marker.colorStatus === "blue"
        ? MechanicBlue
        : marker.colorStatus === "red"
        ? MechanicRed
        : MechanicBlack;
    }
    return null;
  };

  const refreshMarkers = useCallback(
    (
      data,
      lat,
      lng,
      type,
      filterOverride = undefined,
      filterTypeOverride = undefined,
      filtersOverride = undefined
    ) => {
      if (!map || !mapsApi) {
        console.warn("Google Maps API not loaded yet, cannot create markers");
        return;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        return;
      }

      // Get current filter - use override if explicitly provided (even if null),
      // otherwise use the selectedStatusFilter from closure (which is updated via dependencies)
      const currentFilter =
        filterOverride !== undefined ? filterOverride : selectedStatusFilter;
      const currentFilterType =
        filterTypeOverride !== undefined
          ? filterTypeOverride
          : selectedFilterType;

      // Use filtersOverride if provided, otherwise use filters from state
      const currentFilters =
        filtersOverride !== undefined ? filtersOverride : filters;

      data
        .map((loc) => ({
          type: type,
          ...loc,
        }))
        .forEach((marker) => {
          // Skip markers without valid coordinates
          if (!marker.latitude || !marker.longitude) {
            return;
          }

          // Check which filters are selected in filter panel
          const vehicleCaseFilterIds =
            currentFilters?.vehicleCaseFilterIds || [];
          const hasVehicle = vehicleCaseFilterIds.includes("Vehicle");
          const hasCase = vehicleCaseFilterIds.includes("Case");
          const hasTechnician = vehicleCaseFilterIds.includes("Technician");
          const selectedCount = [hasVehicle, hasCase, hasTechnician].filter(
            Boolean
          ).length;

          // If multiple types are selected, show all selected types
          // Only apply color filter to the respective type
          if (selectedCount > 1) {
            // Multiple types selected - show all selected types
            // Apply color filter only to the matching type
            if (currentFilter && currentFilterType) {
              if (currentFilterType === "asp" && marker.type === "ASP") {
                // Apply ASP color filter to ASP markers
                if (marker.colorStatus !== currentFilter) {
                  return; // Skip this marker if it doesn't match the filter
                }
              } else if (
                currentFilterType === "case" &&
                marker.type === "Case"
              ) {
                // Apply Case color filter to Case markers
                if (marker.color !== currentFilter) {
                  return; // Skip this marker if it doesn't match the filter
                }
              } else if (
                currentFilterType === "technician" &&
                marker.type === "Technician"
              ) {
                // Apply Technician color filter to Technician markers
                if (marker.colorStatus !== currentFilter) {
                  return; // Skip this marker if it doesn't match the filter
                }
              }
              // If filter type doesn't match marker type, show the marker (don't filter it)
            }
            // Check if marker type is selected
            if (marker.type === "ASP" && !hasVehicle) return;
            if (marker.type === "Case" && !hasCase) return;
            if (marker.type === "Technician" && !hasTechnician) return;
          } else {
            // Only one type is selected - apply normal filtering
            if (currentFilter && currentFilterType) {
              if (currentFilterType === "asp" && marker.type === "ASP") {
                if (marker.colorStatus !== currentFilter) {
                  return; // Skip this marker if it doesn't match the filter
                }
              } else if (
                currentFilterType === "case" &&
                marker.type === "Case"
              ) {
                if (marker.color !== currentFilter) {
                  return; // Skip this marker if it doesn't match the filter
                }
              } else if (
                currentFilterType === "technician" &&
                marker.type === "Technician"
              ) {
                if (marker.colorStatus !== currentFilter) {
                  return; // Skip this marker if it doesn't match the filter
                }
              } else {
                // Hide markers that don't match the active filter type
                return;
              }
            } else if (currentFilter === null && currentFilterType) {
              // "All" filter - show all markers of the selected type only
              if (currentFilterType === "asp" && marker.type !== "ASP") {
                return; // Hide non-ASP markers when ASP "All" filter is active
              } else if (
                currentFilterType === "case" &&
                marker.type !== "Case"
              ) {
                return; // Hide non-Case markers when Case "All" filter is active
              } else if (
                currentFilterType === "technician" &&
                marker.type !== "Technician"
              ) {
                return; // Hide non-Technician markers when Technician "All" filter is active
              }
            } else {
              // No color filter active - show only the selected type
              if (hasVehicle && marker.type !== "ASP") {
                return; // Hide non-ASP markers when only Vehicle is selected
              } else if (hasCase && marker.type !== "Case") {
                return; // Hide non-Case markers when only Case is selected
              } else if (hasTechnician && marker.type !== "Technician") {
                return; // Hide non-Technician markers when only Technician is selected
              }
            }
          }

          // Get vehicle type icon if available, otherwise use default logic
          let iconUrl = getVehicleTypeIcon(marker);

          if (!iconUrl) {
            // Default icon logic for Case markers, ASPs, or Technicians without vehicle type
            // For ASP markers without vehicle type, use car icon based on colorStatus
            // For Technician markers, always use mechanic icon based on colorStatus
            // For Case markers, use case icon based on color
            if (marker.type === "ASP") {
              iconUrl =
                marker.colorStatus === "green"
                  ? CarGreen
                  : marker.colorStatus === "blue"
                  ? CarBlue
                  : marker.colorStatus === "red"
                  ? CarRed
                  : CarBlack;
            } else if (marker.type === "Technician") {
              iconUrl =
                marker.colorStatus === "green"
                  ? MechanicGreen
                  : marker.colorStatus === "blue"
                  ? MechanicBlue
                  : marker.colorStatus === "red"
                  ? MechanicRed
                  : MechanicBlack;
            } else if (marker.type === "Case") {
              iconUrl =
                marker.color === "green"
                  ? GreenCase
                  : marker.color === "yellow"
                  ? YellowCase
                  : RedCase;
            }
          }

          // Marker size: 40x40 pixels - balanced visibility and clickability
          // Adjust between 32-48px based on your needs:
          // - 32px: More markers visible, less prominent
          // - 40px: Good balance (recommended)
          // - 48px: More prominent, easier to click
          const markerIcon = {
            url: iconUrl,
            scaledSize: new mapsApi.Size(50, 50),
          };

          try {
            const googleMarker = new mapsApi.Marker({
              position: {
                lat: Number(marker.latitude),
                lng: Number(marker.longitude),
              },
              map: map,
              icon: markerIcon,
            });

            // Add the marker to the reference array for later cleanup
            markersRef.current.push(googleMarker);

            // Add click listener for each marker
            googleMarker.addListener("click", () => handleMarkerClick(marker));
          } catch (error) {
            console.error("Error creating marker:", error, marker);
          }
        });

      // Keep the center at India (initial position) and maintain initial zoom level
      // setCenter({ lat: lat, lng: lng });
      // setZoom(10);
    },
    [map, mapsApi, selectedStatusFilter, selectedFilterType, filters]
  );

  // Handle status filter click - defined after refreshMarkers
  // This filters the already fetched data without calling the API
  handleStatusFilterClick = useCallback(
    (status, filterType) => {
      // Get current filter from context to avoid stale closure values
      // Use the latest value from context, not from closure
      const currentFilterFromContext = mapViewContext?.selectedStatusFilter;
      const currentFilterTypeFromContext = mapViewContext?.selectedFilterType;
      const currentFilter =
        currentFilterFromContext !== undefined
          ? currentFilterFromContext
          : selectedStatusFilter;
      const currentType =
        currentFilterTypeFromContext !== undefined
          ? currentFilterTypeFromContext
          : selectedFilterType;

      // Determine new filter: if clicking the same status and type, toggle to "All" (null)
      // Otherwise, set to the clicked status and type
      const newFilter =
        currentFilter === status && currentType === filterType ? null : status;
      const newFilterType =
        currentFilter === status && currentType === filterType
          ? null
          : filterType;

      // Get fresh data from context (in case closure has stale data)
      const currentStoredAspData =
        mapViewContext?.storedAspData || storedAspData;
      const currentStoredCaseData =
        mapViewContext?.storedCaseData || storedCaseData;
      const currentStoredTechnicianData =
        mapViewContext?.storedTechnicianData || storedTechnicianData;

      // Check if we have stored data - if not, exit early
      if (
        (filterType === "asp" &&
          (!currentStoredAspData || currentStoredAspData.length === 0)) ||
        (filterType === "case" &&
          (!currentStoredCaseData || currentStoredCaseData.length === 0)) ||
        (filterType === "technician" &&
          (!currentStoredTechnicianData ||
            currentStoredTechnicianData.length === 0))
      ) {
        // Still update the filter state so UI reflects the selection
        setSelectedStatusFilter(newFilter);
        setSelectedFilterType(newFilterType);
        return; // Exit early if no data
      }

      // Update the filter state immediately - this will update context
      setSelectedStatusFilter(newFilter);
      setSelectedFilterType(newFilterType);

      // Clear existing markers synchronously
      clearMarkers();

      // Immediately re-render markers with the new filter
      // We pass newFilter explicitly to ensure we use the correct filter value
      // No need for requestAnimationFrame - clearMarkers is synchronous
      if (map && mapsApi) {
        const defaultLat = 20.5937; // Center of India
        const defaultLng = 78.9629;

        // Check which filters are selected in the filter panel
        const vehicleCaseFilterIds = filters?.vehicleCaseFilterIds || [];
        const hasVehicle = vehicleCaseFilterIds.includes("Vehicle");
        const hasCase = vehicleCaseFilterIds.includes("Case");
        const hasTechnician = vehicleCaseFilterIds.includes("Technician");

        // If a color filter is active (newFilterType is set), ONLY show markers of that type
        // Otherwise, show all selected types from the filter panel
        if (newFilterType) {
          // Color filter is active - only show the filtered type
          if (newFilterType === "asp") {
            // Only show ASP/Vehicle markers
            if (
              currentStoredAspData &&
              currentStoredAspData.length > 0 &&
              hasVehicle
            ) {
              refreshMarkers(
                currentStoredAspData,
                defaultLat,
                defaultLng,
                "ASP",
                newFilter, // Apply the color filter
                newFilterType
              );
            }
          } else if (newFilterType === "case") {
            // Only show Case markers
            if (
              currentStoredCaseData &&
              currentStoredCaseData.length > 0 &&
              hasCase
            ) {
              refreshMarkers(
                currentStoredCaseData,
                defaultLat,
                defaultLng,
                "Case",
                newFilter, // Apply the color filter
                newFilterType
              );
            }
          } else if (newFilterType === "technician") {
            // Only show Technician markers
            if (
              currentStoredTechnicianData &&
              currentStoredTechnicianData.length > 0 &&
              hasTechnician
            ) {
              refreshMarkers(
                currentStoredTechnicianData,
                defaultLat,
                defaultLng,
                "Technician",
                newFilter, // Apply the color filter
                newFilterType
              );
            }
          }
        } else {
          // No color filter active - show all selected types from filter panel
          // Re-render ASP markers if Vehicle is selected
          if (
            currentStoredAspData &&
            currentStoredAspData.length > 0 &&
            hasVehicle
          ) {
            refreshMarkers(
              currentStoredAspData,
              defaultLat,
              defaultLng,
              "ASP",
              undefined, // No color filter
              undefined
            );
          }

          // Re-render Case markers if Case is selected
          if (
            currentStoredCaseData &&
            currentStoredCaseData.length > 0 &&
            hasCase
          ) {
            refreshMarkers(
              currentStoredCaseData,
              defaultLat,
              defaultLng,
              "Case",
              undefined, // No color filter
              undefined
            );
          }

          // Re-render Technician markers if Technician is selected
          if (
            currentStoredTechnicianData &&
            currentStoredTechnicianData.length > 0 &&
            hasTechnician
          ) {
            refreshMarkers(
              currentStoredTechnicianData,
              defaultLat,
              defaultLng,
              "Technician",
              undefined, // No color filter
              undefined
            );
          }
        }
      }
    },
    [
      map,
      mapsApi,
      selectedStatusFilter,
      selectedFilterType,
      storedAspData,
      storedCaseData,
      storedTechnicianData,
      mapViewContext,
      clearMarkers,
      refreshMarkers,
    ]
  );

  // Set the handler in context so Header can use it
  // Using ref pattern - handler is stored in context's ref, doesn't cause re-renders
  useEffect(() => {
    if (setHandleStatusFilterClick && handleStatusFilterClick) {
      // Directly set the handler function - context uses ref internally
      setHandleStatusFilterClick(handleStatusFilterClick);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleStatusFilterClick]); // setHandleStatusFilterClick is stable (memoized in context)

  const applyFiltersToSearch = (searchData, filterValues) => {
    // Handle Created On date range - convert to startDate and endDate
    if (
      filterValues.createdOn &&
      Array.isArray(filterValues.createdOn) &&
      filterValues.createdOn.length === 2 &&
      filterValues.createdOn[0] &&
      filterValues.createdOn[1]
    ) {
      // Format dates from createdOn array to startDate and endDate
      searchData.startDate = moment
        .tz(filterValues.createdOn[0], "Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");
      searchData.endDate = moment
        .tz(filterValues.createdOn[1], "Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");
    }
    if (filterValues.statusIds && filterValues.statusIds.length > 0) {
      searchData.statusIds = filterValues.statusIds;
    }
    if (
      filterValues.caseSubjectNames &&
      filterValues.caseSubjectNames.length > 0
    ) {
      searchData.caseSubjectNames = filterValues.caseSubjectNames;
    }
    if (filterValues.stateIds && filterValues.stateIds.length > 0) {
      searchData.stateIds = filterValues.stateIds;
    }
    if (filterValues.slaStatusIds && filterValues.slaStatusIds.length > 0) {
      searchData.slaStatusIds = filterValues.slaStatusIds;
    }
    if (filterValues.clientIds && filterValues.clientIds.length > 0) {
      searchData.clientIds = filterValues.clientIds;
    }
    if (filterValues.caseNumber) {
      searchData.caseNumber = filterValues.caseNumber;
    }
    if (
      filterValues.unAssignmentReasonIds &&
      filterValues.unAssignmentReasonIds.length > 0
    ) {
      searchData.unAssignmentReasonIds = filterValues.unAssignmentReasonIds;
    }
    if (filterValues.serviceIds && filterValues.serviceIds.length > 0) {
      searchData.serviceIds = filterValues.serviceIds;
    }
    if (
      filterValues.aspActivityStatusIds &&
      filterValues.aspActivityStatusIds.length > 0
    ) {
      searchData.aspActivityStatusIds = filterValues.aspActivityStatusIds;
    }
    if (
      filterValues.activityStatusIds &&
      filterValues.activityStatusIds.length > 0
    ) {
      searchData.activityStatusIds = filterValues.activityStatusIds;
    }
    if (
      filterValues.serviceOrganisationIds &&
      filterValues.serviceOrganisationIds.length > 0
    ) {
      searchData.serviceOrganisationIds = filterValues.serviceOrganisationIds;
    }
    if (filterValues.aspCode) {
      searchData.aspCode = filterValues.aspCode;
    }
    if (filterValues.apiUserIds && filterValues.apiUserIds.length > 0) {
      searchData.apiUserIds = filterValues.apiUserIds;
    }
    // vehicleCaseFilterIds is only used in frontend to determine which APIs to call
    // It should not be sent to the backend
    return searchData;
  };

  // handleSearch function is hidden since SearchBar is commented out
  // const handleSearch = async (values, filterValues = filters) => {
  //   clearMarkers();
  //   setLastSearchValues(values);
  //   // console.log("form values", values);
  //   const geocodeResults = await getGeocode({ address: values?.location });
  //   const { lat, lng } = getLatLng(geocodeResults[0]);
  //   addCircle(lat, lng, values.kmRadius);
  //   let searchData = {
  //     lat: lat?.toString(),
  //     long: lng?.toString(),
  //     radius: String(values?.kmRadius),
  //     searchKey: "",
  //   };

  //   // Apply filters to search data
  //   searchData = applyFiltersToSearch(searchData, filterValues);

  //   if (values.type === "ASP") {
  //     const subServiceIds = values?.subservice?.map((item) => item?.id); // Correct mapping
  //     //console.log("subServiceIds", subServiceIds);
  //     aspMapSearchMutate(
  //       { ...searchData, subServiceIds: subServiceIds },
  //       {
  //         onSuccess: (res) => {
  //           console.log("data", res);
  //           if (res?.data?.success == true) {
  //             refreshMarkers(res?.data?.data, lat, lng, "ASP");
  //           } else {
  //             console.log("error");
  //             if (res?.data?.error) {
  //               toast.error(res?.data?.error);
  //             } else {
  //               res?.data?.errors?.forEach((el) => toast.error(el));
  //             }
  //           }
  //         },
  //       }
  //     );
  //   } else if (values.type === "Case") {
  //     // clientIds might already be in searchData from filters
  //     if (!searchData.clientIds && values?.client) {
  //       searchData.clientIds = values?.client?.map((c) => c.id);
  //     }
  //     caseMapSearchMutate(searchData, {
  //       onSuccess: (res) => {
  //         console.log("data", res);
  //         if (res?.data?.success == true) {
  //           refreshMarkers(res?.data?.data, lat, lng, "Case");
  //         } else {
  //           if (res?.data?.error) {
  //             toast.error(res?.data?.error);
  //           } else {
  //             res?.data?.errors?.forEach((el) => toast.error(el));
  //           }
  //         }
  //       },
  //     });
  //   }
  // };

  const handleFilterApply = async (newFilters) => {
    setFilters(newFilters);
    // Reset status filter when applying new filters
    setSelectedStatusFilter(null);

    // Load default data with new filters
    // Default location: Center of India
    const defaultLocation = "India";
    const defaultRadius = 1000; // 1000 km radius

    try {
      clearMarkers();
      const geocodeResults = await getGeocode({ address: defaultLocation });
      const { lat, lng } = getLatLng(geocodeResults[0]);

      let searchData = {
        lat: lat?.toString(),
        long: lng?.toString(),
        radius: String(defaultRadius),
        searchKey: "",
      };

      // Apply all filter categories to search data
      searchData = applyFiltersToSearch(searchData, newFilters);

      // Check vehicle case filter to determine which APIs to call
      // All three APIs can be called simultaneously if multiple options are selected
      const vehicleCaseFilterIds = newFilters.vehicleCaseFilterIds || [
        "Vehicle",
      ];
      const shouldLoadVehicle = vehicleCaseFilterIds.includes("Vehicle");
      const shouldLoadCase = vehicleCaseFilterIds.includes("Case");
      const shouldLoadTechnician = vehicleCaseFilterIds.includes("Technician");

      // Track API completion to refresh all markers together
      let aspDataLoaded = !shouldLoadVehicle; // If not loading, mark as loaded
      let caseDataLoaded = !shouldLoadCase; // If not loading, mark as loaded
      let technicianDataLoaded = !shouldLoadTechnician; // If not loading, mark as loaded
      let loadedAspData = [];
      let loadedCaseData = [];
      let loadedTechnicianData = [];

      // Helper function to refresh all markers when all APIs complete
      const refreshAllMarkers = () => {
        if (!map || !mapsApi) return;

        // Only proceed if all expected APIs have completed
        if (shouldLoadVehicle && !aspDataLoaded) return;
        if (shouldLoadCase && !caseDataLoaded) return;
        if (shouldLoadTechnician && !technicianDataLoaded) return;

        // Recalculate status counts with the latest loaded data
        // This ensures counts are accurate after all APIs complete
        const finalAspData = shouldLoadVehicle ? loadedAspData : [];
        const finalCaseData = shouldLoadCase ? loadedCaseData : [];
        const finalTechnicianData = shouldLoadTechnician
          ? loadedTechnicianData
          : [];
        const counts = calculateStatusCounts(
          finalAspData,
          finalCaseData,
          finalTechnicianData
        );
        setStatusCounts(counts);

        // Clear existing markers first
        clearMarkers();

        // Refresh ASP markers if Vehicle is selected and data is loaded
        if (shouldLoadVehicle && loadedAspData.length > 0) {
          refreshMarkers(
            loadedAspData,
            lat,
            lng,
            "ASP",
            null,
            null,
            newFilters
          );
        }

        // Refresh Case markers if Case is selected and data is loaded
        if (shouldLoadCase && loadedCaseData.length > 0) {
          refreshMarkers(
            loadedCaseData,
            lat,
            lng,
            "Case",
            null,
            null,
            newFilters
          );
        }

        // Refresh Technician markers if Technician is selected and data is loaded
        if (shouldLoadTechnician && loadedTechnicianData.length > 0) {
          refreshMarkers(
            loadedTechnicianData,
            lat,
            lng,
            "Technician",
            null,
            null,
            newFilters
          );
        }
      };

      // Load ASP data if "Vehicle" is selected (can be called along with Case API)
      if (shouldLoadVehicle) {
        aspMapSearchMutate(searchData, {
          onSuccess: (res) => {
            if (res?.data?.success == true && map && mapsApi) {
              loadedAspData = res?.data?.data || [];
              setStoredAspData(loadedAspData);
              aspDataLoaded = true;

              // Refresh markers after data is loaded
              // Status counts will be recalculated in refreshAllMarkers
              refreshAllMarkers();
            } else {
              aspDataLoaded = true; // Mark as loaded even if empty to proceed
              // Handle API error response
              if (res?.data?.error) {
                toast.error(res?.data?.error);
              } else if (
                res?.data?.errors &&
                Array.isArray(res?.data?.errors)
              ) {
                res?.data?.errors?.forEach((el) => toast.error(el));
              } else {
                toast.error("Failed to load ASP data");
              }
              refreshAllMarkers();
            }
          },
          onError: (error) => {
            console.error("Error loading ASP data:", error);
            aspDataLoaded = true; // Mark as loaded to proceed
            const errorMessage =
              error?.response?.data?.error ||
              error?.response?.data?.message ||
              error?.message ||
              "Failed to load ASP data. Please try again.";
            toast.error(errorMessage);
            refreshAllMarkers();
          },
        });
      } else {
        // Clear ASP data if Vehicle is not selected
        setStoredAspData([]);
        aspDataLoaded = true; // Mark as loaded since we're not loading
        // Update status counts - keep case and technician counts if they exist
        const currentCaseData =
          mapViewContext?.storedCaseData || storedCaseData;
        const currentTechnicianData =
          mapViewContext?.storedTechnicianData || storedTechnicianData;
        const counts = calculateStatusCounts(
          [],
          currentCaseData,
          currentTechnicianData
        );
        setStatusCounts(counts);
        // If Case and Technician are not being loaded either, refresh markers now
        if (!shouldLoadCase && !shouldLoadTechnician) {
          refreshAllMarkers();
        }
      }

      // Load Case data if "Case" is selected (can be called along with Vehicle API)
      if (shouldLoadCase) {
        caseMapSearchMutate(searchData, {
          onSuccess: (res) => {
            if (res?.data?.success == true && map && mapsApi) {
              loadedCaseData = res?.data?.data || [];
              setStoredCaseData(loadedCaseData);
              caseDataLoaded = true;

              // Refresh markers after data is loaded
              // Status counts will be recalculated in refreshAllMarkers
              refreshAllMarkers();
            } else {
              caseDataLoaded = true; // Mark as loaded even if empty to proceed
              // Handle API error response
              if (res?.data?.error) {
                toast.error(res?.data?.error);
              } else if (
                res?.data?.errors &&
                Array.isArray(res?.data?.errors)
              ) {
                res?.data?.errors?.forEach((el) => toast.error(el));
              } else {
                toast.error("Failed to load Case data");
              }
              refreshAllMarkers();
            }
          },
          onError: (error) => {
            console.error("Error loading Case data:", error);
            caseDataLoaded = true; // Mark as loaded to proceed
            const errorMessage =
              error?.response?.data?.error ||
              error?.response?.data?.message ||
              error?.message ||
              "Failed to load Case data. Please try again.";
            toast.error(errorMessage);
            refreshAllMarkers();
          },
        });
      } else {
        // Clear Case data if Case is not selected
        setStoredCaseData([]);
        caseDataLoaded = true; // Mark as loaded since we're not loading
        // Update status counts - keep ASP and Technician counts if they exist
        const currentAspData = mapViewContext?.storedAspData || storedAspData;
        const currentTechnicianData =
          mapViewContext?.storedTechnicianData || storedTechnicianData;
        const counts = calculateStatusCounts(
          currentAspData,
          [],
          currentTechnicianData
        );
        setStatusCounts(counts);
        // If Vehicle and Technician are not being loaded either, refresh markers now
        if (!shouldLoadVehicle && !shouldLoadTechnician) {
          refreshAllMarkers();
        }
      }

      // Load Technician data if "Technician" is selected (can be called along with Vehicle and Case APIs)
      if (shouldLoadTechnician) {
        technicianMapSearchMutate(searchData, {
          onSuccess: (res) => {
            if (res?.data?.success == true && map && mapsApi) {
              loadedTechnicianData = res?.data?.data || [];
              setStoredTechnicianData(loadedTechnicianData);
              technicianDataLoaded = true;

              // Refresh markers after data is loaded
              // Status counts will be recalculated in refreshAllMarkers
              refreshAllMarkers();
            } else {
              technicianDataLoaded = true; // Mark as loaded even if empty to proceed
              // Handle API error response
              if (res?.data?.error) {
                toast.error(res?.data?.error);
              } else if (
                res?.data?.errors &&
                Array.isArray(res?.data?.errors)
              ) {
                res?.data?.errors?.forEach((el) => toast.error(el));
              } else {
                toast.error("Failed to load Technician data");
              }
              refreshAllMarkers();
            }
          },
          onError: (error) => {
            console.error("Error loading Technician data:", error);
            technicianDataLoaded = true; // Mark as loaded to proceed
            const errorMessage =
              error?.response?.data?.error ||
              error?.response?.data?.message ||
              error?.message ||
              "Failed to load Technician data. Please try again.";
            toast.error(errorMessage);
            refreshAllMarkers();
          },
        });
      } else {
        // Clear Technician data if Technician is not selected
        setStoredTechnicianData([]);
        technicianDataLoaded = true; // Mark as loaded since we're not loading
        // Update status counts - keep ASP and Case counts if they exist
        const currentAspData = mapViewContext?.storedAspData || storedAspData;
        const currentCaseData =
          mapViewContext?.storedCaseData || storedCaseData;
        const counts = calculateStatusCounts(
          currentAspData,
          currentCaseData,
          []
        );
        setStatusCounts(counts);
        // If Vehicle and Case are not being loaded either, refresh markers now
        if (!shouldLoadVehicle && !shouldLoadCase) {
          refreshAllMarkers();
        }
      }
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleFilterReset = async (clearedFilters) => {
    // Delete saved filters from database
    if (user?.id) {
      deleteFiltersMutate(
        { userId: user.id },
        {
          onSuccess: (res) => {
            // Filters deleted successfully
          },
          onError: (error) => {
            console.error("Error deleting saved filters:", error);
            // Continue with reset even if delete fails
          },
        }
      );
    }

    setFilters(clearedFilters);
    // Reset status filter when resetting filters
    setSelectedStatusFilter(null);
    setSelectedFilterType(null);

    // Reset to default filters with vehicle case filter as "Vehicle"
    const defaultFilters = {
      vehicleCaseFilterIds: ["Vehicle"],
    };
    setFilters(defaultFilters);

    // Load default data
    const defaultLocation = "India";
    const defaultRadius = 1000;

    try {
      clearMarkers();
      const geocodeResults = await getGeocode({ address: defaultLocation });
      const { lat, lng } = getLatLng(geocodeResults[0]);

      let searchData = {
        lat: lat?.toString(),
        long: lng?.toString(),
        radius: String(defaultRadius),
        searchKey: "",
      };

      // Apply filters to search data
      searchData = applyFiltersToSearch(searchData, defaultFilters);

      // On filter reset, only Vehicle API is called (default is "Vehicle" only)
      // Clear Case and Technician data since we're resetting to Vehicle only
      setStoredCaseData([]);
      setStoredTechnicianData([]);

      // Load ASP data only (Vehicle is selected by default on reset)
      aspMapSearchMutate(searchData, {
        onSuccess: (res) => {
          if (res?.data?.success == true && map && mapsApi) {
            const aspData = res?.data?.data || [];
            setStoredAspData(aspData);
            // Calculate and update status counts from backend data
            const currentCaseData =
              mapViewContext?.storedCaseData || storedCaseData;
            const currentTechnicianData =
              mapViewContext?.storedTechnicianData || storedTechnicianData;
            const counts = calculateStatusCounts(
              aspData,
              currentCaseData,
              currentTechnicianData
            );
            setStatusCounts(counts);
            // Refresh markers with current filter
            refreshMarkers(aspData, lat, lng, "ASP");
          } else {
            // Handle API error response
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else if (res?.data?.errors && Array.isArray(res?.data?.errors)) {
              res?.data?.errors?.forEach((el) => toast.error(el));
            } else {
              toast.error("Failed to load ASP data");
            }
          }
        },
        onError: (error) => {
          console.error("Error loading ASP data:", error);
          const errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            error?.message ||
            "Failed to load ASP data. Please try again.";
          toast.error(errorMessage);
        },
      });
    } catch (error) {
      console.error("Error resetting filters:", error);
      toast.error("An error occurred while resetting filters");
    }
  };

  // Initialize map and store reference to map and maps API
  const handleApiLoaded = (mapInstance, mapsInstance) => {
    // Prevent multiple initializations
    if (map || mapsApi) {
      console.warn("Google Maps API already initialized");
      return;
    }

    if (!mapInstance || !mapsInstance) {
      console.error("Google Maps API failed to load");
      return;
    }

    setMap(mapInstance);
    setMapsApi(mapsInstance);
    infoWindowRef.current = new mapsInstance.InfoWindow();
    // Close InfoWindow when clicking outside
    mapInstance.addListener("click", (event) => {
      // Check if the InfoWindow is open and the click is outside the marker
      if (infoWindowRef.current && infoWindowRef.current.getMap()) {
        infoWindowRef.current.close();
      }
    });
  };

  const handleOutBoundCall = (marker) => {
    outboundCallMutate(
      {
        agentId: user?.userName,
        campaignName: "Renault",
        customerNumber: marker?.contactNumber,
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

  const handleMarkerClick = (marker) => {
    // Show side panel instead of info window
    setSelectedMarker(marker);
    setIsDetailsPanelVisible(true);

    // Close info window if open
    if (infoWindowRef.current && mapsApi) {
      infoWindowRef.current.close();
    }

    // Keep old info window code as fallback (commented out)
    /*
    if (infoWindowRef.current && mapsApi) {
      let content = ``;
      if (marker.type == "ASP") {
        content = `<div class="marker">
         <div class="d-flex">
            <img class="marker-image" src=${Asp} alt="marker image">
            <span class="d-flex flex-column" style="width: 100%">
            <span class="marker-name-container name-width" title=${
              marker.name
            }>${marker?.name ? marker.name : ""}</span>
            <span class="marker-code">${marker?.code ? marker.code : ""}</span>
            </span>
         </div>
       ${
         marker?.colorStatus === "black"
           ? '<div class="status-chip grey-chip chip-margin">Offline</div>'
           : marker?.colorStatus === "red"
           ? '<div class="status-chip red-chip chip-margin">Busy</div>'
           : marker?.colorStatus === "green"
           ? '<div class="status-chip green-chip chip-margin">Available</div>'
           : marker?.colorStatus === "blue"
           ? '<div class="status-chip blue-chip chip-margin">Assigned</div>'
           : "---"
       }
       <div class="marker-workshopname">${
         marker?.workshopName ? marker?.workshopName : "---"
       }</div> 
       <div class="marker-address">${
         marker?.addressLineOne ? marker?.addressLineOne : "---"
       }</div>
       <div class="marker-address">${
         marker?.addressLineTwo ? marker?.addressLineTwo : "---"
       }</div>
       
       <div class="marker-contact">
       Contact Number</div>
       
       <div class="marker-contact-number pointer" data-marker-id="${marker.id}">
    <img class="action-image" src="${PhoneMapIcon}" style="height: 20px; width: 20px; margin-right: 4px" />
    ${marker?.contactNumber ? marker?.contactNumber : "---"}
  </div>
  
    ${
      marker?.caseDetailId && marker.caseTypeId == 31
        ? `<div class="more-details"><a href="/cases/view/${marker?.caseDetailId}" target="_blank" class="more-details-button">More Details</a></div>`
        : marker?.caseDetailId && marker.caseTypeId == 32
        ? `<div class="more-details"><a href="/delivery-request/view/${marker?.caseDetailId}" target="_blank" class="more-details-button">More Details</a></div>`
        : ""
    }
      </div>`;
      }
      //   } else if (marker.type == "Case") {
      //     content = `<div class="marker">
      //     // <div class="status-chip blue-chip chip-margin">${marker.client}</div>
      //     <div class="d-flex">
      //        <img class="marker-image" src=${Case} alt="marker image">
      //        <span class="d-flex flex-column">
      //        <span class="marker-user-name">
      //          ${marker?.typeId == "31" ? "RSA Request" : "Delivery Request"}
      //          ${marker?.color === "yellow"
      //         ? '<div class="status-chip yellow-chip">Case created</div>'
      //         : marker?.color === "red"
      //           ? '<div class="status-chip red-chip">Asp unassigned</div>'
      //           : marker?.color === "green"
      //             ? '<div class="status-chip green-chip">Inprogress</div>'
      //             : "---"
      //       }
      //        </span>
      //        <span class="marker-code">${marker?.caseNumber ? marker?.caseNumber : ""
      //       }</span>
      //        </span>
      //     </div>
      //   <div class="marker-contact">${marker?.vehicleMake ? marker?.vehicleMake : "---"
      //       }
      //  - ${marker?.vehicleModel ? marker?.vehicleModel : "---"}
      //   </div>
      //   <div class="marker-contact">
      //   ${marker?.typeId == "31"
      //         ? marker?.registrationNumber
      //           ? marker?.registrationNumber
      //           : marker?.vin
      //         : marker?.vin
      //       }
      //   </div>
      //   <div class="marker-contact">
      //     ${marker?.deliveryRequestSubService
      //         ? marker?.deliveryRequestSubService
      //         : "---"
      //       }
      //     -
      //     ${marker?.caseSubject ? marker?.caseSubject : "---"}
      //   </div>
      //   <div class="marker-contact">
      //     ${marker?.deliveryRequestPickupDate
      //         ? marker?.deliveryRequestPickupDate
      //         : "---"
      //       }
      //     --
      //     ${marker?.deliveryRequestPickupTime
      //         ? marker?.deliveryRequestPickupTime
      //         : "---"
      //       }
      //   </div>
      //   ${marker?.caseDetailId
      //         ? `<div class="more-details"><a href="/view/${marker?.caseDetailId}" target="_blank" class="more-details-button">More Details</a></div>`
      //         : ""
      //       }
      //  </div>`;
      //   }
      else if (marker.type == "Case") {
        content = `<div class="marker">
          <div>
          <div>
          <div class="d-flex">
             <img class="marker-image" src=${Case} alt="marker image">
             <span class="marker-user-name d-flex flex-column">
              ${
                marker?.typeId === 31
                  ? "Breakdown Request"
                  : marker?.typeId === 32
                  ? "Delivery Request"
                  : ""
              }   
              </span>
             <span class="name-width d-flex">
              
               ${
                 marker?.color === "yellow"
                   ? '<div class="status-chip yellow-chip">Case created</div>'
                   : marker?.color === "red"
                   ? '<div class="status-chip red-chip">Asp unassigned</div>'
                   : marker?.color === "green"
                   ? '<div class="status-chip green-chip">Inprogress</div>'
                   : "---"
               }
             </span>
             
             </div>
              <div class="marker-code">${
                marker?.caseNumber ? marker?.caseNumber : ""
              }</div>
             </div>
          </div>
          <span class="marker-code">
  ${
    marker?.irateCustomer === true
      ? '<div class="status-chip red-chip">Irate Customer</div>'
      : ""
  }
</span>
<span class="marker-code">
  ${
    marker?.womenAssist === true
      ? '<div class="status-chip blue-chip">Women Assist</div>'
      : ""
  }
</span>
<span class="marker-code">
  ${
    marker?.caseType === "Accidental"
      ? '<div class="status-chip grey-chip">Accident</div>'
      : ""
  }
</span>
        <div class="marker-contact">${
          marker?.vehicleMake ? marker?.vehicleMake : "---"
        }
       - ${marker?.vehicleModel ? marker?.vehicleModel : "---"}
        </div> 
        <div class="marker-contact">
        ${
          marker?.typeId == "31"
            ? marker?.registrationNumber
              ? marker?.registrationNumber
              : marker?.vin
            : marker?.vin
        }
        </div>
        ${
          marker?.typeId == 31
            ? `<div class="more-details"><a href="/cases/view/${marker?.id}" target="_blank" class="more-details-button">More Details</a></div>`
            : marker?.typeId == 32
            ? `<div class="more-details"><a href="/delivery-request/view/${marker?.id}" target="_blank" class="more-details-button">More Details</a></div>`
            : ""
        }
       </div>`;
      }
      infoWindowRef.current.setContent(content);
      infoWindowRef.current.setPosition({
        lat: Number(marker.latitude),
        lng: Number(marker.longitude),
      });

      // Adjust the pixel offset relative to the marker anchor
      infoWindowRef.current.setOptions({
        pixelOffset: new mapsApi.Size(0, -80), // Adjust based on icon height
      });

      infoWindowRef.current.open(map);
      setTimeout(() => {
        const contactElement = document.querySelector(
          `[data-marker-id="${marker.id}"]`
        );
        if (contactElement) {
          //contactElement.addEventListener("click", () => handleOutBoundCall(marker));
        }
      }, 0);
    }
    */
  };

  // Track if initial load has been done to prevent multiple calls
  const hasInitialLoadRef = useRef(false);
  const initialLoadTimerRef = useRef(null);

  // Load default data on mount - wait for saved filters API to complete first
  useEffect(() => {
    // Only run once on initial load when all conditions are met
    // Proceed if:
    // 1. Map and mapsApi are ready
    // 2. User ID is available
    // 3. Saved filters API has completed (either success or error)
    // 4. Initial load hasn't been done yet
    if (
      map &&
      mapsApi &&
      user?.id &&
      (savedFiltersLoaded || savedFiltersError) &&
      !hasInitialLoadRef.current
    ) {
      // Clear any existing timer
      if (initialLoadTimerRef.current) {
        clearTimeout(initialLoadTimerRef.current);
      }

      // Load data after saved filters API has completed
      const loadDefaultData = async () => {
        // Mark as loading to prevent duplicate calls
        hasInitialLoadRef.current = true;

        // Use current filters if available, otherwise use defaults
        // Saved filters should be loaded by now, so filters state should be set
        const filtersToUse =
          filters &&
          filters.vehicleCaseFilterIds &&
          Array.isArray(filters.vehicleCaseFilterIds) &&
          filters.vehicleCaseFilterIds.length > 0
            ? filters
            : {
                vehicleCaseFilterIds: ["Vehicle"],
              };

        // Default location: Center of India
        const defaultLocation = "India";
        const defaultRadius = 1000; // 1000 km radius to cover entire country

        try {
          const geocodeResults = await getGeocode({ address: defaultLocation });
          const { lat, lng } = getLatLng(geocodeResults[0]);

          let searchData = {
            lat: lat?.toString(),
            long: lng?.toString(),
            radius: String(defaultRadius),
            searchKey: "",
          };

          // Apply filters to search data
          searchData = applyFiltersToSearch(searchData, filtersToUse);

          // Check vehicle case filter to determine which APIs to call
          const vehicleCaseFilterIds = filtersToUse.vehicleCaseFilterIds || [
            "Vehicle",
          ];
          const shouldLoadVehicle = vehicleCaseFilterIds.includes("Vehicle");
          const shouldLoadCase = vehicleCaseFilterIds.includes("Case");
          const shouldLoadTechnician =
            vehicleCaseFilterIds.includes("Technician");

          // Track API completion
          let aspDataLoaded = !shouldLoadVehicle;
          let caseDataLoaded = !shouldLoadCase;
          let technicianDataLoaded = !shouldLoadTechnician;
          let loadedAspData = [];
          let loadedCaseData = [];
          let loadedTechnicianData = [];

          // Helper function to refresh all markers when all APIs complete
          const refreshAllMarkers = () => {
            if (!map || !mapsApi) return;
            if (aspDataLoaded && caseDataLoaded && technicianDataLoaded) {
              setStoredAspData(loadedAspData);
              setStoredCaseData(loadedCaseData);
              setStoredTechnicianData(loadedTechnicianData);
              const counts = calculateStatusCounts(
                loadedAspData,
                loadedCaseData,
                loadedTechnicianData
              );
              setStatusCounts(counts);

              // Clear existing markers first
              clearMarkers();

              // Refresh ASP markers if Vehicle is selected and data is loaded
              if (shouldLoadVehicle && loadedAspData.length > 0) {
                refreshMarkers(
                  loadedAspData,
                  lat,
                  lng,
                  "ASP",
                  null,
                  null,
                  filtersToUse
                );
              }

              // Refresh Case markers if Case is selected and data is loaded
              if (shouldLoadCase && loadedCaseData.length > 0) {
                refreshMarkers(
                  loadedCaseData,
                  lat,
                  lng,
                  "Case",
                  null,
                  null,
                  filtersToUse
                );
              }

              // Refresh Technician markers if Technician is selected and data is loaded
              if (shouldLoadTechnician && loadedTechnicianData.length > 0) {
                refreshMarkers(
                  loadedTechnicianData,
                  lat,
                  lng,
                  "Technician",
                  null,
                  null,
                  filtersToUse
                );
              }
            }
          };

          // Load Vehicle data if needed
          if (shouldLoadVehicle) {
            aspMapSearchMutate(searchData, {
              onSuccess: (res) => {
                if (res?.data?.success == true && map && mapsApi) {
                  loadedAspData = res?.data?.data || [];
                  aspDataLoaded = true;
                  refreshAllMarkers();
                } else {
                  // Handle API error response
                  if (res?.data?.error) {
                    toast.error(res?.data?.error);
                  } else if (
                    res?.data?.errors &&
                    Array.isArray(res?.data?.errors)
                  ) {
                    res?.data?.errors?.forEach((el) => toast.error(el));
                  } else {
                    toast.error("Failed to load ASP data");
                  }
                  aspDataLoaded = true;
                  refreshAllMarkers();
                }
              },
              onError: (error) => {
                console.error("Error loading ASP data:", error);
                const errorMessage =
                  error?.response?.data?.error ||
                  error?.response?.data?.message ||
                  error?.message ||
                  "Failed to load ASP data. Please try again.";
                toast.error(errorMessage);
                aspDataLoaded = true;
                refreshAllMarkers();
              },
            });
          }

          // Load Case data if needed
          if (shouldLoadCase) {
            caseMapSearchMutate(searchData, {
              onSuccess: (res) => {
                if (res?.data?.success == true && map && mapsApi) {
                  loadedCaseData = res?.data?.data || [];
                  caseDataLoaded = true;
                  refreshAllMarkers();
                } else {
                  if (res?.data?.error) {
                    toast.error(res?.data?.error);
                  } else if (
                    res?.data?.errors &&
                    Array.isArray(res?.data?.errors)
                  ) {
                    res?.data?.errors?.forEach((el) => toast.error(el));
                  } else {
                    toast.error("Failed to load Case data");
                  }
                  caseDataLoaded = true;
                  refreshAllMarkers();
                }
              },
              onError: (error) => {
                console.error("Error loading Case data:", error);
                const errorMessage =
                  error?.response?.data?.error ||
                  error?.response?.data?.message ||
                  error?.message ||
                  "Failed to load Case data. Please try again.";
                toast.error(errorMessage);
                caseDataLoaded = true;
                refreshAllMarkers();
              },
            });
          } else {
            // Clear Case data if Case is not selected
            setStoredCaseData([]);
            caseDataLoaded = true;
            refreshAllMarkers();
          }

          // Load Technician data if needed
          if (shouldLoadTechnician) {
            technicianMapSearchMutate(searchData, {
              onSuccess: (res) => {
                if (res?.data?.success == true && map && mapsApi) {
                  loadedTechnicianData = res?.data?.data || [];
                  technicianDataLoaded = true;
                  refreshAllMarkers();
                } else {
                  // Handle API error response
                  if (res?.data?.error) {
                    toast.error(res?.data?.error);
                  } else if (
                    res?.data?.errors &&
                    Array.isArray(res?.data?.errors)
                  ) {
                    res?.data?.errors?.forEach((el) => toast.error(el));
                  } else {
                    toast.error("Failed to load Technician data");
                  }
                  technicianDataLoaded = true;
                  refreshAllMarkers();
                }
              },
              onError: (error) => {
                console.error("Error loading Technician data:", error);
                const errorMessage =
                  error?.response?.data?.error ||
                  error?.response?.data?.message ||
                  error?.message ||
                  "Failed to load Technician data. Please try again.";
                toast.error(errorMessage);
                technicianDataLoaded = true;
                refreshAllMarkers();
              },
            });
          } else {
            // Clear Technician data if Technician is not selected
            setStoredTechnicianData([]);
            technicianDataLoaded = true;
            refreshAllMarkers();
          }
        } catch (error) {
          console.error("Error loading default data:", error);
          toast.error("An error occurred while loading default data");
        }
      };

      // Small delay to ensure filters state is updated after saved filters load
      // This gives React time to update the filters state from the savedFiltersData
      initialLoadTimerRef.current = setTimeout(() => {
        loadDefaultData();
        initialLoadTimerRef.current = null;
      }, 100);

      return () => {
        if (initialLoadTimerRef.current) {
          clearTimeout(initialLoadTimerRef.current);
          initialLoadTimerRef.current = null;
        }
      };
    }

    // Cleanup function to clear markers when component unmounts
    return () => {
      if (initialLoadTimerRef.current) {
        clearTimeout(initialLoadTimerRef.current);
        initialLoadTimerRef.current = null;
      }
      clearMarkers();
      hasInitialLoadRef.current = false; // Reset on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, mapsApi, user?.id, savedFiltersLoaded, savedFiltersError, filters]);

  const filterOptions = filterOptionsData?.data?.data || {};

  return (
    <div className="map-page">
      {/* Commented out SearchBar - using filter panel instead */}
      {/* <div className="search-container">
        <SearchBar OnSearch={handleSearch} clearMarkers={clearMarkers} />
      </div> */}

      {/* Map Header with Filter Button */}
      <div className="map-header-controls">
        <button
          className="btn-white filter-save-btn"
          onClick={() => setIsFilterPanelVisible(!isFilterPanelVisible)}
          title="Toggle Filters"
        >
          <img src={FilterIcon} alt="Filter" />
          <span>Filters</span>
        </button>
      </div>

      <FilterPanel
        visible={isFilterPanelVisible}
        onToggle={() => setIsFilterPanelVisible(!isFilterPanelVisible)}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
        filterOptions={filterOptions}
        filters={filters}
      />
      <div className="map-view">
        <GoogleMapReact
          center={center} // Updated center based on search results
          zoom={zoom} // Updated zoom level
          bootstrapURLKeys={{
            key: GoogleMapAPIKey,
            libraries: ["places"], // Add libraries to match loadGoogleMaps
          }}
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          yesIWantToUseGoogleMapApiInternals
        ></GoogleMapReact>
      </div>

      {/* Marker Details Side Panel */}
      <MapMarkerDetailsPanel
        visible={isDetailsPanelVisible}
        onClose={() => {
          setIsDetailsPanelVisible(false);
          setSelectedMarker(null);
        }}
        marker={selectedMarker}
        mapViewContext={mapViewContext}
      />
    </div>
  );
};

const MapView = () => {
  // Provider is now in MainLayout, so we don't need to wrap here
  return <MapViewContent />;
};

export default MapView;
