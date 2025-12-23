import React, { useState, useEffect, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import moment from "moment-timezone";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import {
  RefreshIcon,
  DialogCloseIcon,
  CircleTickIcon,
} from "../../utills/imgConstants";
import { saveMapViewFilters } from "../../../services/userService";

// Helper function to normalize filters - defined outside component to avoid dependency issues
const normalizeFilters = (filtersToNormalize) => {
  // Check if filtersToNormalize is a string (shouldn't happen, but handle it)
  if (typeof filtersToNormalize === "string") {
    console.warn(
      "normalizeFilters: Received string instead of object, parsing..."
    );
    try {
      filtersToNormalize = JSON.parse(filtersToNormalize);
    } catch (e) {
      console.error("normalizeFilters: Failed to parse string:", e);
      return {
        vehicleCaseFilterIds: ["Vehicle"],
      };
    }
  }

  // Check if filtersToNormalize is an object with numeric keys (stringified object)
  if (
    filtersToNormalize &&
    typeof filtersToNormalize === "object" &&
    !Array.isArray(filtersToNormalize)
  ) {
    const keys = Object.keys(filtersToNormalize);
    // If all keys are numeric strings, it's likely a stringified object
    if (keys.length > 0 && keys.every((key) => /^\d+$/.test(key))) {
      console.warn(
        "normalizeFilters: Received stringified object, attempting to reconstruct..."
      );
      console.warn(
        "normalizeFilters: Stringified object keys:",
        keys.slice(0, 10),
        "..."
      );
      // Try to reconstruct the original object from the stringified version
      try {
        // Sort keys numerically and join the values
        const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
        const reconstructed = sortedKeys
          .map((key) => filtersToNormalize[key])
          .join("");
        console.warn(
          "normalizeFilters: Reconstructed string:",
          reconstructed.substring(0, 100),
          "..."
        );
        filtersToNormalize = JSON.parse(reconstructed);
        console.warn(
          "normalizeFilters: Successfully parsed, statusIds:",
          filtersToNormalize.statusIds
        );
      } catch (e) {
        console.error("normalizeFilters: Failed to reconstruct object:", e);
        return {
          vehicleCaseFilterIds: ["Vehicle"],
        };
      }
    }
  }

  if (
    !filtersToNormalize ||
    typeof filtersToNormalize !== "object" ||
    Object.keys(filtersToNormalize).length === 0
  ) {
    return {
      vehicleCaseFilterIds: ["Vehicle"],
    };
  }

  return {
    ...filtersToNormalize,
    // Ensure vehicleCaseFilterIds is always an array
    vehicleCaseFilterIds:
      filtersToNormalize.vehicleCaseFilterIds &&
      Array.isArray(filtersToNormalize.vehicleCaseFilterIds)
        ? filtersToNormalize.vehicleCaseFilterIds
        : filtersToNormalize.vehicleCaseFilterIds
        ? [filtersToNormalize.vehicleCaseFilterIds]
        : ["Vehicle"],
    // Ensure all other filter arrays are arrays (not null/undefined)
    statusIds: Array.isArray(filtersToNormalize.statusIds)
      ? filtersToNormalize.statusIds
      : [],
    caseSubjectNames: Array.isArray(filtersToNormalize.caseSubjectNames)
      ? filtersToNormalize.caseSubjectNames
      : [],
    stateIds: Array.isArray(filtersToNormalize.stateIds)
      ? filtersToNormalize.stateIds
      : [],
    slaStatusIds: Array.isArray(filtersToNormalize.slaStatusIds)
      ? filtersToNormalize.slaStatusIds
      : [],
    clientIds: Array.isArray(filtersToNormalize.clientIds)
      ? filtersToNormalize.clientIds
      : [],
    unAssignmentReasonIds: Array.isArray(
      filtersToNormalize.unAssignmentReasonIds
    )
      ? filtersToNormalize.unAssignmentReasonIds
      : [],
    serviceIds: Array.isArray(filtersToNormalize.serviceIds)
      ? filtersToNormalize.serviceIds
      : [],
    aspActivityStatusIds: Array.isArray(filtersToNormalize.aspActivityStatusIds)
      ? filtersToNormalize.aspActivityStatusIds
      : [],
    activityStatusIds: Array.isArray(filtersToNormalize.activityStatusIds)
      ? filtersToNormalize.activityStatusIds
      : [],
    serviceOrganisationIds: Array.isArray(
      filtersToNormalize.serviceOrganisationIds
    )
      ? filtersToNormalize.serviceOrganisationIds
      : [],
    apiUserIds: Array.isArray(filtersToNormalize.apiUserIds)
      ? filtersToNormalize.apiUserIds
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
    // Preserve other filter properties (caseNumber, aspCode, etc.)
    caseNumber: filtersToNormalize.caseNumber || "",
    aspCode: filtersToNormalize.aspCode || "",
  };
};

const FilterPanel = ({
  visible,
  onToggle,
  onApply,
  onReset,
  filterOptions = {},
  filters = {},
}) => {
  const user = useSelector(CurrentUser);
  const [selectedCategory, setSelectedCategory] = useState("Created On");

  // Use a function to create a stable string representation for comparison
  const getFiltersKey = (filtersObj) => {
    if (!filtersObj || Object.keys(filtersObj).length === 0) {
      return "empty";
    }
    // Create a stable string representation excluding Date objects (which can't be stringified)
    const stableFilters = { ...filtersObj };
    if (stableFilters.createdOn) {
      // Convert dates to ISO strings for comparison
      if (Array.isArray(stableFilters.createdOn)) {
        stableFilters.createdOn = stableFilters.createdOn.map((d) =>
          d instanceof Date ? d.toISOString() : d
        );
      } else if (stableFilters.createdOn instanceof Date) {
        stableFilters.createdOn = stableFilters.createdOn.toISOString();
      }
    }
    return JSON.stringify(stableFilters);
  };

  const previousFiltersRef = useRef(null);
  const [localFilters, setLocalFilters] = useState(() => {
    // Initialize with filters prop, ensuring proper structure
    if (filters && Object.keys(filters).length > 0) {
      const normalized = normalizeFilters(filters);
      previousFiltersRef.current = getFiltersKey(filters);
      return normalized;
    }
    return {
      vehicleCaseFilterIds: ["Vehicle"],
    };
  });

  const { mutate: saveFiltersMutate, isLoading: isSaving } = useMutation(
    saveMapViewFilters,
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success("Filters saved successfully");
        } else {
          toast.error(res?.data?.error || "Failed to save filters");
        }
      },
      onError: (error) => {
        toast.error("Failed to save filters");
        console.error("Error saving filters:", error);
      },
    }
  );

  useEffect(() => {
    // Always normalize and update localFilters when filters prop changes
    // Check if filters is a string (which would indicate it was stringified)
    if (typeof filters === "string") {
      console.error(
        "FilterPanel: Filters prop is a string! Attempting to parse..."
      );
      try {
        const parsedFilters = JSON.parse(filters);
        const normalizedFilters = normalizeFilters(parsedFilters);
        setLocalFilters({ ...normalizedFilters });
        previousFiltersRef.current = getFiltersKey(parsedFilters);
        return;
      } catch (e) {
        console.error("FilterPanel: Failed to parse filters string:", e);
        setLocalFilters({ vehicleCaseFilterIds: ["Vehicle"] });
        return;
      }
    }

    if (
      !filters ||
      typeof filters !== "object" ||
      Object.keys(filters).length === 0
    ) {
      setLocalFilters({ vehicleCaseFilterIds: ["Vehicle"] });
      return;
    }

    const normalizedFilters = normalizeFilters(filters);

    // Use getFiltersKey to detect deep changes in filters object
    const currentFiltersKey = getFiltersKey(filters);
    const previousFiltersKey = previousFiltersRef.current;

    // Always update if filters have actually changed (deep comparison)
    if (currentFiltersKey !== previousFiltersKey) {
      previousFiltersRef.current = currentFiltersKey;
      // Force update by creating a new object reference
      setLocalFilters({ ...normalizedFilters });
    } else {
      // Even if key is same, always sync to ensure consistency
      setLocalFilters({ ...normalizedFilters });
    }
  }, [filters]);

  // Additional effect: Sync filters when panel becomes visible
  useEffect(() => {
    if (visible && filters && Object.keys(filters).length > 0) {
      const currentFiltersKey = getFiltersKey(filters);
      const currentLocalFiltersKey = getFiltersKey(localFilters);

      // If filters have changed while panel was hidden, sync them
      if (currentFiltersKey !== currentLocalFiltersKey) {
        const normalizedFilters = normalizeFilters(filters);
        setLocalFilters({ ...normalizedFilters });
        previousFiltersRef.current = currentFiltersKey;
      }
    }
  }, [visible, filters]);

  const filterCategories = [
    "Created On",
    "Status",
    "Problem",
    "State",
    "SLA Status",
    "Accounts",
    "Case ID",
    "Un-Assignment Reasons",
    "Services",
    "My Asp Status",
    "Service Status",
    "Service Organisations",
    "ASP Code",
    "API Users",
    "Vehicle Case Filter",
  ];

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDateRangeChange = (value) => {
    handleFilterChange("createdOn", value);
  };

  const handleQuickDateSelect = (type) => {
    let dateRange = [];
    switch (type) {
      case "today":
        dateRange = [
          moment.tz("Asia/Kolkata").startOf("day").toDate(),
          moment.tz("Asia/Kolkata").endOf("day").toDate(),
        ];
        break;
      case "last8hours":
        dateRange = [
          moment.tz("Asia/Kolkata").subtract(8, "hours").toDate(),
          moment.tz("Asia/Kolkata").toDate(),
        ];
        break;
      case "last30days":
        dateRange = [
          moment
            .tz("Asia/Kolkata")
            .subtract(30, "days")
            .startOf("day")
            .toDate(),
          moment.tz("Asia/Kolkata").endOf("day").toDate(),
        ];
        break;
      default:
        dateRange = null;
    }
    handleFilterChange("createdOn", dateRange);
  };

  const handleSave = () => {
    if (!user?.id) {
      toast.error("User information not available");
      return;
    }

    // Save filters to database
    saveFiltersMutate({
      userId: user.id,
      filters: localFilters,
    });
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    // Reset to default filters with vehicle case filter as "Vehicle"
    const clearedFilters = {
      vehicleCaseFilterIds: ["Vehicle"],
    };
    setLocalFilters(clearedFilters);
    onReset(clearedFilters);
  };

  const renderFilterContent = () => {
    switch (selectedCategory) {
      case "Created On":
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select Time Period</label>
              <Calendar
                value={localFilters.createdOn || null}
                onChange={(e) => handleDateRangeChange(e.value)}
                selectionMode="range"
                showIcon
                readOnlyInput
                placeholder="Select Date Range"
                dateFormat="dd/mm/yy"
                className="form-control-select"
              />
            </div>
            <div className="quick-date-options">
              <div
                className="quick-date-option"
                onClick={() => handleQuickDateSelect("today")}
              >
                Today
              </div>
              <div
                className="quick-date-option"
                onClick={() => handleQuickDateSelect("last8hours")}
              >
                Last 8 hours
              </div>
              <div
                className="quick-date-option"
                onClick={() => handleQuickDateSelect("last30days")}
              >
                Last 30 days
              </div>
              <div
                className="quick-date-option"
                onClick={() => handleQuickDateSelect("select")}
              >
                Select Time Period
              </div>
            </div>
          </div>
        );

      case "Status":
        const statusOptions = filterOptions.caseStatuses || [];
        const statusValues = localFilters.statusIds || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select Status</label>
              <MultiSelect
                value={statusValues}
                options={statusOptions}
                onChange={(e) => handleFilterChange("statusIds", e.value)}
                optionLabel="name"
                optionValue="id"
                placeholder="Select Status"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      case "Problem":
        const problemOptions = filterOptions.caseSubjects || [];
        const problemValues = localFilters.caseSubjectNames || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select Problem</label>
              <MultiSelect
                value={problemValues}
                options={problemOptions}
                onChange={(e) =>
                  handleFilterChange("caseSubjectNames", e.value)
                }
                optionLabel="name"
                optionValue="name"
                placeholder="Select Problem"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      case "State":
        const stateOptions = filterOptions.states || [];
        const stateValues = localFilters.stateIds || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select State</label>
              <MultiSelect
                value={stateValues}
                options={stateOptions}
                onChange={(e) => handleFilterChange("stateIds", e.value)}
                optionLabel="name"
                optionValue="id"
                placeholder="Select State"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      case "SLA Status":
        const slaOptions = filterOptions.slaStatuses || [];
        const slaValues = localFilters.slaStatusIds || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select SLA Status</label>
              <MultiSelect
                value={slaValues}
                options={slaOptions}
                onChange={(e) => handleFilterChange("slaStatusIds", e.value)}
                optionLabel="name"
                optionValue="id"
                placeholder="Select SLA Status"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      case "Accounts":
        const accountOptions = filterOptions.clients || [];
        const accountValues = localFilters.clientIds || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select Accounts</label>
              <MultiSelect
                value={accountValues}
                options={accountOptions}
                onChange={(e) => handleFilterChange("clientIds", e.value)}
                optionLabel="name"
                optionValue="id"
                placeholder="Select Accounts"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      case "Case ID":
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <InputText
                value={localFilters.caseNumber || ""}
                onChange={(e) =>
                  handleFilterChange("caseNumber", e.target.value)
                }
                placeholder="Enter Case ID"
                className="form-control"
              />
            </div>
          </div>
        );

      case "Un-Assignment Reasons":
        const unAssignmentOptions = filterOptions.unAssignmentReasons || [];
        const unAssignmentValues = localFilters.unAssignmentReasonIds || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select Un-Assignment Reasons</label>
              <MultiSelect
                value={unAssignmentValues}
                options={unAssignmentOptions}
                onChange={(e) =>
                  handleFilterChange("unAssignmentReasonIds", e.value)
                }
                optionLabel="name"
                optionValue="id"
                placeholder="Select Un-Assignment Reasons"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      case "Services":
        const serviceOptions = filterOptions.services || [];
        const serviceValues = localFilters.serviceIds || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select Services</label>
              <MultiSelect
                value={serviceValues}
                options={serviceOptions}
                onChange={(e) => handleFilterChange("serviceIds", e.value)}
                optionLabel="name"
                optionValue="id"
                placeholder="Select Services"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      case "My Asp Status":
        const aspStatusOptions = filterOptions.aspActivityStatuses || [];
        const aspStatusValues = localFilters.aspActivityStatusIds || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select My ASP Status</label>
              <MultiSelect
                value={aspStatusValues}
                options={aspStatusOptions}
                onChange={(e) =>
                  handleFilterChange("aspActivityStatusIds", e.value)
                }
                optionLabel="name"
                optionValue="id"
                placeholder="Select My ASP Status"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      case "Service Status":
        const activityStatusOptions = filterOptions.activityStatuses || [];
        const activityStatusValues = localFilters.activityStatusIds || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select Service Status</label>
              <MultiSelect
                value={activityStatusValues}
                options={activityStatusOptions}
                onChange={(e) =>
                  handleFilterChange("activityStatusIds", e.value)
                }
                optionLabel="name"
                optionValue="id"
                placeholder="Select Service Status"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      case "Service Organisations":
        const serviceOrgOptions = filterOptions.serviceOrganisations || [];
        const serviceOrgValues = localFilters.serviceOrganisationIds || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select Service Organisations</label>
              <MultiSelect
                value={serviceOrgValues}
                options={serviceOrgOptions}
                onChange={(e) =>
                  handleFilterChange("serviceOrganisationIds", e.value)
                }
                optionLabel="name"
                optionValue="id"
                placeholder="Select Service Organisations"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      case "ASP Code":
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <InputText
                value={localFilters.aspCode || ""}
                onChange={(e) => handleFilterChange("aspCode", e.target.value)}
                placeholder="Enter ASP Code"
                className="form-control"
              />
            </div>
          </div>
        );

      case "API Users":
        const apiUserOptions = filterOptions.apiUsers || [];
        const apiUserValues = localFilters.apiUserIds || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select API Users</label>
              <MultiSelect
                value={apiUserValues}
                options={apiUserOptions}
                onChange={(e) => handleFilterChange("apiUserIds", e.value)}
                optionLabel="name"
                optionValue="id"
                placeholder="Select API Users"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      case "Vehicle Case Filter":
        // Hardcoded options: Vehicle, Case, and Technician
        const vehicleCaseOptions = [
          { id: "Vehicle", name: "Vehicle" },
          { id: "Case", name: "Case" },
          { id: "Technician", name: "Technician" },
        ];
        const vehicleCaseValues = localFilters.vehicleCaseFilterIds || [];
        return (
          <div className="filter-options-content">
            <div className="form-group">
              <label className="form-label">Select Vehicle Case Filter</label>
              <MultiSelect
                value={vehicleCaseValues}
                options={vehicleCaseOptions}
                onChange={(e) =>
                  handleFilterChange("vehicleCaseFilterIds", e.value)
                }
                optionLabel="name"
                optionValue="id"
                placeholder="Select Vehicle Case Filter"
                filter
                maxSelectedLabels={1}
                className="form-control-select"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="filter-options-content">No options available</div>
        );
    }
  };

  if (!visible) return null;

  return (
    <div className="map-filter-panel">
      <div className="filter-panel-header">
        <div className="filter-panel-title">Apply Filters</div>
        <div className="filter-panel-actions">
          <Button
            label="Save"
            className="btn filter-save-btn"
            onClick={handleSave}
          />
          <div
            className="filter-icon-wrapper"
            onClick={handleApply}
            title="Apply Filters"
          >
            <img src={CircleTickIcon} alt="Apply" />
          </div>
          <div
            className="filter-icon-wrapper"
            onClick={handleReset}
            title="Reset Filters"
          >
            <img src={RefreshIcon} alt="Reset" />
          </div>
          <div
            className="filter-icon-wrapper"
            onClick={onToggle}
            title="Close Panel"
          >
            <DialogCloseIcon />
          </div>
        </div>
      </div>
      <div className="filter-panel-body">
        <div className="filter-categories">
          {filterCategories.map((category) => (
            <div
              key={category}
              className={`filter-category-item ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>
        <div className="filter-options">{renderFilterContent()}</div>
      </div>
    </div>
  );
};

export default FilterPanel;
