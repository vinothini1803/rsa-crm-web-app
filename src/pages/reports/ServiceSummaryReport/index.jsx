import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { CalendarTimeIcon } from "../../../utills/imgConstants";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getServiceSummaryReport,
  getServiceSummaryFilterDetails,
  exportServiceSummaryReport,
} from "../../../../services/reportService";
import "../../../assets/styles/reports.less";

const DEFAULT_VALUES = {
  state: [],
  nearestCity: [],
  callCenter: [],
  locationCategory: [],
  clientName: [],
  aspActivityStatus: [],
};

// Get current month start and end dates
const getCurrentMonthRange = () => {
  const now = moment().tz("Asia/Kolkata");
  const start = now.clone().startOf("month").toDate();
  const end = now.clone().endOf("month").toDate();
  return [start, end];
};

// Transform backend response to frontend format
const transformBackendData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  return data.map((item) => {
    const open = item.open || 0;
    const assigned = item.assigned || 0;
    const inProgress = item.inProgress || 0;
    const cancelled = item.cancelled || 0;
    const successful = item.successful || 0;
    const total = open + assigned + inProgress + cancelled + successful;

    return {
      service: item.service,
      subService: item.subService,
      open,
      assigned,
      inProgress,
      cancelled,
      successful,
      total,
    };
  });
};

// Unified totals calculation function
const calculateAspStyleTotals = (data) => {
  if (!data || data.length === 0) {
    return {
      open: 0,
      assigned: 0,
      inProgress: 0,
      cancelled: 0,
      successful: 0,
      total: 0,
    };
  }

  const calculatedTotals = data.reduce(
    (acc, row) => ({
      open: acc.open + (row.open || 0),
      assigned: acc.assigned + (row.assigned || 0),
      inProgress: acc.inProgress + (row.inProgress || 0),
      cancelled: acc.cancelled + (row.cancelled || 0),
      successful: acc.successful + (row.successful || 0),
    }),
    {
      open: 0,
      assigned: 0,
      inProgress: 0,
      cancelled: 0,
      successful: 0,
    }
  );

  calculatedTotals.total =
    calculatedTotals.open +
    calculatedTotals.assigned +
    calculatedTotals.inProgress +
    calculatedTotals.cancelled +
    calculatedTotals.successful;

  return calculatedTotals;
};

const ServiceSummaryReport = () => {
  const navigate = useNavigate();
  const [reportName] = useState("Summary Report");
  const [dateRange, setDateRange] = useState(getCurrentMonthRange());
  const [reportData, setReportData] = useState([]);
  const [aspReportData, setAspReportData] = useState([]);
  const [ownpatrolReportData, setOwnpatrolReportData] = useState([]);
  const [emptyReportData, setEmptyReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    nearestCities: [],
    callCenters: [],
    locationCategories: [],
    clients: [],
    aspActivityStatuses: [],
  });

  const { control, handleSubmit, getValues, reset } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  // Validate date range
  const validateDateRange = useCallback((dateRange) => {
    if (
      !dateRange ||
      !Array.isArray(dateRange) ||
      dateRange.length === 0 ||
      !dateRange[0] ||
      !dateRange[1]
    ) {
      return false;
    }
    return true;
  }, []);

  // Build filter object from form values and date range
  const buildFilters = useCallback((formValues, dateRange) => {
    const startDate =
      dateRange && dateRange[0]
        ? moment.tz(dateRange[0], "Asia/Kolkata").format("YYYY-MM-DD")
        : null;
    const endDate =
      dateRange && dateRange[1]
        ? moment.tz(dateRange[1], "Asia/Kolkata").format("YYYY-MM-DD")
        : null;

    // Helper function to extract valid IDs from array
    // Handles both cases: when MultiSelect stores IDs directly (optionValue="id") or objects with id property
    const extractIds = (arr) => {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return [];
      return arr
        .map((item) => {
          // If item is a primitive (number/string), use it directly
          if (typeof item === "number" || typeof item === "string") {
            return item;
          }
          // If item is an object with id property, extract the id
          return item?.id;
        })
        .filter((id) => id != null && id !== "");
    };

    return {
      startDate,
      endDate,
      stateIds: extractIds(formValues.state),
      nearestCityIds: extractIds(formValues.nearestCity),
      callCenterIds: extractIds(formValues.callCenter),
      locationCategoryIds: extractIds(formValues.locationCategory),
      clientIds: extractIds(formValues.clientName),
      aspStatusIds: extractIds(formValues.aspActivityStatus),
    };
  }, []);

  // Memoize MenuItems to prevent recreation
  const menuItems = useMemo(
    () => [
      {
        label: <div onClick={() => navigate("/reports")}>Reports</div>,
      },
      { label: <div>{reportName}</div> },
    ],
    [navigate, reportName]
  );

  // Load filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await getServiceSummaryFilterDetails();
        if (response?.data?.success) {
          setFilterOptions({
            states: response.data.data.states || [],
            nearestCities: response.data.data.nearestCities || [],
            callCenters: response.data.data.callCenters || [],
            locationCategories: response.data.data.locationCategories || [],
            clients: response.data.data.clients || [],
            aspActivityStatuses: response.data.data.aspActivityStatuses || [],
          });
        }
      } catch (error) {
        console.error("Error loading filter options:", error);
        toast.error("Error loading filter options", { autoClose: 2000 });
      }
    };
    loadFilterOptions();
  }, []);

  // Load default data on component mount (current month)
  useEffect(() => {
    const loadDefaultData = async () => {
      const formValues = getValues();
      const currentMonthRange = getCurrentMonthRange();
      const baseFilters = buildFilters(formValues, currentMonthRange);
      await fetchReportData(baseFilters);
    };

    loadDefaultData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch report data for all sections
  const fetchReportData = useCallback(async (baseFilters) => {
    setLoading(true);
    try {
      // Overall section API call
      const overallResponse = await getServiceSummaryReport(baseFilters);
      if (overallResponse?.data?.success) {
        const transformedData = transformBackendData(
          overallResponse.data.data || []
        );
        setReportData(transformedData);
      } else {
        toast.error(
          overallResponse?.data?.error || "Error generating overall report",
          { autoClose: 2000 }
        );
      }

      // Make three separate API calls for ASP, Ownpatrol, and Empty sections
      const apiCalls = [
        // ASP section - third-party ASPs (isOwnPatrol = false)
        (async () => {
          try {
            const aspFilters = { ...baseFilters, isOwnPatrol: false };
            const response = await getServiceSummaryReport(aspFilters);
            if (response?.data?.success) {
              const transformedData = transformBackendData(
                response.data.data || []
              );
              setAspReportData(transformedData);
            }
          } catch (error) {
            console.error("ASP section error:", error);
          }
        })(),
        // Ownpatrol section - own patrol ASPs (isOwnPatrol = true)
        (async () => {
          try {
            const ownpatrolFilters = { ...baseFilters, isOwnPatrol: true };
            const response = await getServiceSummaryReport(ownpatrolFilters);
            if (response?.data?.success) {
              const transformedData = transformBackendData(
                response.data.data || []
              );
              setOwnpatrolReportData(transformedData);
            }
          } catch (error) {
            console.error("Ownpatrol section error:", error);
          }
        })(),
        // Empty section - financeStatusId = 2
        (async () => {
          try {
            const emptyFilters = { ...baseFilters, financeStatusId: 2 };
            const response = await getServiceSummaryReport(emptyFilters);
            if (response?.data?.success) {
              const transformedData = transformBackendData(
                response.data.data || []
              );
              setEmptyReportData(transformedData);
            }
          } catch (error) {
            console.error("Empty section error:", error);
          }
        })(),
      ];

      await Promise.all(apiCalls);
    } catch (error) {
      toast.error("Error generating report", { autoClose: 2000 });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      if (!validateDateRange(dateRange)) {
        setDateError("Date range is required");
        toast.error("Please select a date range", { autoClose: 2000 });
        return;
      }
      setDateError("");
      const baseFilters = buildFilters(data, dateRange);
      await fetchReportData(baseFilters);
    },
    [dateRange, buildFilters, fetchReportData, validateDateRange]
  );

  // Export function
  const handleExport = useCallback(async () => {
    if (!validateDateRange(dateRange)) {
      setDateError("Date range is required");
      toast.error("Please select a date range", { autoClose: 2000 });
      return;
    }
    setDateError("");
    setExportLoading(true);
    try {
      const formValues = getValues();
      const baseFilters = buildFilters(formValues, dateRange);
      const response = await exportServiceSummaryReport(baseFilters);

      // Create blob and download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Service_Summary_Report_${moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Report exported successfully", { autoClose: 2000 });
    } catch (error) {
      toast.error("Error exporting report", { autoClose: 2000 });
      console.error("Export error:", error);
    } finally {
      setExportLoading(false);
    }
  }, [getValues, dateRange, buildFilters, validateDateRange]);

  // Reset function
  const handleReset = useCallback(async () => {
    reset(DEFAULT_VALUES);
    const currentMonthRange = getCurrentMonthRange();
    setDateRange(currentMonthRange);
    const baseFilters = buildFilters(DEFAULT_VALUES, currentMonthRange);

    setResetLoading(true);
    try {
      // Overall section API call
      const overallResponse = await getServiceSummaryReport(baseFilters);
      if (overallResponse?.data?.success) {
        const transformedData = transformBackendData(
          overallResponse.data.data || []
        );
        setReportData(transformedData);
      } else {
        toast.error(
          overallResponse?.data?.error || "Error generating overall report",
          { autoClose: 2000 }
        );
      }

      // Make three separate API calls for ASP, Ownpatrol, and Empty sections
      const apiCalls = [
        // ASP section - third-party ASPs (isOwnPatrol = false)
        (async () => {
          try {
            const aspFilters = { ...baseFilters, isOwnPatrol: false };
            const response = await getServiceSummaryReport(aspFilters);
            if (response?.data?.success) {
              const transformedData = transformBackendData(
                response.data.data || []
              );
              setAspReportData(transformedData);
            }
          } catch (error) {
            console.error("ASP section error:", error);
          }
        })(),
        // Ownpatrol section - own patrol ASPs (isOwnPatrol = true)
        (async () => {
          try {
            const ownpatrolFilters = { ...baseFilters, isOwnPatrol: true };
            const response = await getServiceSummaryReport(ownpatrolFilters);
            if (response?.data?.success) {
              const transformedData = transformBackendData(
                response.data.data || []
              );
              setOwnpatrolReportData(transformedData);
            }
          } catch (error) {
            console.error("Ownpatrol section error:", error);
          }
        })(),
        // Empty section - financeStatusId = 2
        (async () => {
          try {
            const emptyFilters = { ...baseFilters, financeStatusId: 2 };
            const response = await getServiceSummaryReport(emptyFilters);
            if (response?.data?.success) {
              const transformedData = transformBackendData(
                response.data.data || []
              );
              setEmptyReportData(transformedData);
            }
          } catch (error) {
            console.error("Empty section error:", error);
          }
        })(),
      ];

      await Promise.all(apiCalls);
    } catch (error) {
      toast.error("Error generating report", { autoClose: 2000 });
      console.error("Error:", error);
    } finally {
      setResetLoading(false);
    }
  }, [reset, buildFilters]);

  // Check if date range is valid
  const isDateRangeValid = useMemo(() => {
    return validateDateRange(dateRange);
  }, [dateRange, validateDateRange]);

  // Memoize totals calculations
  const totals = useMemo(() => {
    const calculated = calculateAspStyleTotals(reportData);
    return calculated.total > 0 ? calculated : null;
  }, [reportData]);

  const aspTotals = useMemo(
    () => calculateAspStyleTotals(aspReportData),
    [aspReportData]
  );
  const ownpatrolTotals = useMemo(
    () => calculateAspStyleTotals(ownpatrolReportData),
    [ownpatrolReportData]
  );
  const emptyTotals = useMemo(
    () => calculateAspStyleTotals(emptyReportData),
    [emptyReportData]
  );

  // Memoized row className function
  const getRowClassName = useCallback((rowData, rowIndex) => {
    return rowIndex % 2 === 0 ? "even-row" : "odd-row";
  }, []);

  // Memoized render function for ASP/Ownpatrol/Empty tables
  const renderAspStyleTable = useCallback(
    (title, data, totals) => {
      return (
        <div style={{ marginTop: "24px", marginBottom: "24px", clear: "both" }}>
          <div className="border-box bg-white border-transparent">
            <div className="service-summary-report-container">
              <h4
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  marginTop: "0",
                }}
              >
                {title}
              </h4>
              <div className="service-summary-table-wrapper service-summary-scrollable-table">
                <div className="service-summary-table-container">
                  <table className="service-summary-table">
                    <thead className="service-summary-table-header">
                      <tr>
                        <th className="col-subservice">Service</th>
                        <th className="col-subservice">Sub Service</th>
                        <th className="col-number">OPEN</th>
                        <th className="col-number">ASSIGNED</th>
                        <th className="col-number">IN PROGRESS</th>
                        <th className="col-number">CANCELLED</th>
                        <th className="col-number">SUCCESSFUL</th>
                        <th className="col-number col-total">Total</th>
                      </tr>
                    </thead>
                    <tbody className="service-summary-table-body">
                      {data && data.length > 0 ? (
                        data.map((row, index) => (
                          <tr
                            key={index}
                            className={getRowClassName(row, index)}
                          >
                            <td className="col-subservice">
                              {row.service || ""}
                            </td>
                            <td className="col-subservice">
                              {row.subService || ""}
                            </td>
                            <td className="col-number">{row.open || 0}</td>
                            <td className="col-number">{row.assigned || 0}</td>
                            <td className="col-number">
                              {row.inProgress || 0}
                            </td>
                            <td className="col-number">{row.cancelled || 0}</td>
                            <td className="col-number">
                              {row.successful || 0}
                            </td>
                            <td className="col-number col-total">
                              {row.total || 0}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Row */}
              {totals && (
                <div className="service-summary-totals-wrapper">
                  <table className="service-summary-totals-table">
                    <tbody>
                      <tr className="totals-row">
                        <td className="col-subservice">Total</td>
                        <td className="col-subservice"></td>
                        <td className="col-number">{totals.open}</td>
                        <td className="col-number">{totals.assigned}</td>
                        <td className="col-number">{totals.inProgress}</td>
                        <td className="col-number">{totals.cancelled}</td>
                        <td className="col-number">{totals.successful}</td>
                        <td className="col-number col-total">{totals.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    },
    [getRowClassName]
  );

  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={menuItems} milestone={false} />
      <div className="page-body">
        {/* Filter Section */}
        <div className="border-box bg-white border-transparent mb-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row row-gap-3_4">
              {/* Date Range */}
              <div className="col-md-6 col-lg-3">
                <div className="form-group">
                  <label className="form-label">
                    Date <span style={{ color: "red" }}>*</span>
                  </label>
                  <Calendar
                    value={dateRange}
                    onChange={(e) => {
                      setDateRange(e.value);
                      if (validateDateRange(e.value)) {
                        setDateError("");
                      }
                    }}
                    selectionMode="range"
                    numberOfMonths={2}
                    dateFormat="dd/mm/yy"
                    placeholder="Select Date Range"
                    showIcon
                    iconPos="left"
                    readOnlyInput
                    icon={<img src={CalendarTimeIcon} alt="calendar" />}
                    className={`w-100 ${dateError ? "p-invalid" : ""}`}
                    pt={{
                      panel: { className: "defined-rangepicker" },
                    }}
                    footerTemplate={() => {
                      const Ranges = [
                        {
                          label: "Today",
                          dateRange: [
                            moment().tz("Asia/Kolkata").startOf("day").toDate(),
                            moment().tz("Asia/Kolkata").endOf("day").toDate(),
                          ],
                        },
                        {
                          label: "This Week",
                          dateRange: [
                            moment()
                              .tz("Asia/Kolkata")
                              .startOf("week")
                              .toDate(),
                            moment().tz("Asia/Kolkata").endOf("week").toDate(),
                          ],
                        },
                        {
                          label: "This Month",
                          dateRange: [
                            moment()
                              .tz("Asia/Kolkata")
                              .startOf("month")
                              .toDate(),
                            moment().tz("Asia/Kolkata").endOf("month").toDate(),
                          ],
                        },
                      ];

                      const areDatesEqual = (a, b) =>
                        moment.tz(a, "Asia/Kolkata").format("DD-MM-YYYY") ===
                        moment.tz(b, "Asia/Kolkata").format("DD-MM-YYYY");

                      const areArraysEqual = (arr1, arr2) => {
                        if (!arr1 || !arr2 || arr1.length !== arr2.length)
                          return false;
                        return arr1.every((el, i) =>
                          areDatesEqual(el, arr2[i])
                        );
                      };

                      return (
                        <div className="rangecontainer">
                          {Ranges.map((range, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setDateRange(range.dateRange);
                                setDateError("");
                              }}
                              className={`rangelabel ${
                                dateRange &&
                                areArraysEqual(dateRange, range.dateRange)
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              {range.label}
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                  {dateError && (
                    <small className="p-error" style={{ display: "block" }}>
                      {dateError}
                    </small>
                  )}
                </div>
              </div>

              {/* State */}
              <div className="col-md-6 col-lg-3">
                <div className="form-group">
                  <label className="form-label">State</label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        value={field.value || []}
                        options={filterOptions.states}
                        onChange={(e) => field.onChange(e.value)}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select State"
                        maxSelectedLabels={1}
                        selectedItemsLabel="{0} selected"
                        filter
                        className="form-control-select w-100"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Nearest City/District */}
              <div className="col-md-6 col-lg-3">
                <div className="form-group">
                  <label className="form-label">Nearest City</label>
                  <Controller
                    name="nearestCity"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        value={field.value || []}
                        options={filterOptions.nearestCities}
                        onChange={(e) => field.onChange(e.value)}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select Nearest City"
                        maxSelectedLabels={1}
                        selectedItemsLabel="{0} selected"
                        filter
                        className="form-control-select w-100"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Call Center */}
              <div className="col-md-6 col-lg-3">
                <div className="form-group">
                  <label className="form-label">Call Center</label>
                  <Controller
                    name="callCenter"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        value={field.value || []}
                        options={filterOptions.callCenters}
                        onChange={(e) => field.onChange(e.value)}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select Call Center"
                        maxSelectedLabels={1}
                        selectedItemsLabel="{0} selected"
                        filter
                        className="form-control-select w-100"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Location Category */}
              <div className="col-md-6 col-lg-3">
                <div className="form-group">
                  <label className="form-label">Location Category</label>
                  <Controller
                    name="locationCategory"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        value={field.value || []}
                        options={filterOptions.locationCategories}
                        onChange={(e) => field.onChange(e.value)}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select Location Category"
                        maxSelectedLabels={1}
                        selectedItemsLabel="{0} selected"
                        filter
                        className="form-control-select w-100"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Client Name */}
              <div className="col-md-6 col-lg-3">
                <div className="form-group">
                  <label className="form-label">Client</label>
                  <Controller
                    name="clientName"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        value={field.value || []}
                        options={filterOptions.clients}
                        onChange={(e) => field.onChange(e.value)}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select Client"
                        maxSelectedLabels={1}
                        selectedItemsLabel="{0} selected"
                        filter
                        className="form-control-select w-100"
                      />
                    )}
                  />
                </div>
              </div>

              {/* ASP Activity Status */}
              <div className="col-md-6 col-lg-3">
                <div className="form-group">
                  <label className="form-label">ASP Activity Status</label>
                  <Controller
                    name="aspActivityStatus"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        value={field.value || []}
                        options={filterOptions.aspActivityStatuses}
                        onChange={(e) => field.onChange(e.value)}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select ASP Activity Status"
                        maxSelectedLabels={1}
                        selectedItemsLabel="{0} selected"
                        filter
                        className="form-control-select w-100"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Export and Submit Buttons */}
              <div className="col-md-6 col-lg-3">
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ visibility: "hidden" }}
                  >
                    Actions
                  </label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "8px",
                    }}
                  >
                    <Button
                      type="submit"
                      label="Apply"
                      className="btn form-submit-btn"
                      loading={loading}
                      disabled={!isDateRangeValid}
                    />
                    <Button
                      type="button"
                      label="Reset"
                      className="btn form-submit-btn"
                      onClick={handleReset}
                      loading={resetLoading}
                    />
                    <Button
                      type="button"
                      label="Export"
                      className="btn form-submit-btn"
                      loading={exportLoading}
                      onClick={handleExport}
                      disabled={
                        !isDateRangeValid ||
                        (reportData.length === 0 &&
                          aspReportData.length === 0 &&
                          ownpatrolReportData.length === 0 &&
                          emptyReportData.length === 0)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Common Page Loader */}
        {loading && (
          <div
            style={{
              position: "relative",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "24px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #fecc3f",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          </div>
        )}

        {/* Report Table Section */}
        {!loading && reportData.length > 0 && (
          <div
            style={{ marginTop: "24px", marginBottom: "24px", clear: "both" }}
          >
            <div className="border-box bg-white border-transparent">
              <div className="service-summary-report-container">
                <h4
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    marginTop: "0",
                  }}
                >
                  Overall
                </h4>
                <div className="service-summary-table-wrapper service-summary-scrollable-table">
                  <div className="service-summary-table-container">
                    <table className="service-summary-table">
                      <thead className="service-summary-table-header">
                        <tr>
                          <th className="col-subservice">Service</th>
                          <th className="col-subservice">Sub Service</th>
                          <th className="col-number">OPEN</th>
                          <th className="col-number">ASSIGNED</th>
                          <th className="col-number">IN PROGRESS</th>
                          <th className="col-number">CANCELLED</th>
                          <th className="col-number">SUCCESSFUL</th>
                          <th className="col-number col-total">Total</th>
                        </tr>
                      </thead>
                      <tbody className="service-summary-table-body">
                        {reportData && reportData.length > 0 ? (
                          reportData.map((row, index) => (
                            <tr
                              key={index}
                              className={getRowClassName(row, index)}
                            >
                              <td className="col-subservice">
                                {row.service || ""}
                              </td>
                              <td className="col-subservice">
                                {row.subService || ""}
                              </td>
                              <td className="col-number">{row.open || 0}</td>
                              <td className="col-number">
                                {row.assigned || 0}
                              </td>
                              <td className="col-number">
                                {row.inProgress || 0}
                              </td>
                              <td className="col-number">
                                {row.cancelled || 0}
                              </td>
                              <td className="col-number">
                                {row.successful || 0}
                              </td>
                              <td className="col-number col-total">
                                {row.total || 0}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="8"
                              style={{ textAlign: "center", padding: "20px" }}
                            >
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total Row */}
                {totals && (
                  <div className="service-summary-totals-wrapper">
                    <table className="service-summary-totals-table">
                      <tbody>
                        <tr className="totals-row">
                          <td className="col-subservice">Total</td>
                          <td className="col-subservice"></td>
                          <td className="col-number">{totals.open}</td>
                          <td className="col-number">{totals.assigned}</td>
                          <td className="col-number">{totals.inProgress}</td>
                          <td className="col-number">{totals.cancelled}</td>
                          <td className="col-number">{totals.successful}</td>
                          <td className="col-number col-total">
                            {totals.total}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ASP Table Section */}
        {!loading &&
          aspReportData.length > 0 &&
          renderAspStyleTable("ASP", aspReportData, aspTotals)}

        {/* Ownpatrol Table Section */}
        {!loading &&
          ownpatrolReportData.length > 0 &&
          renderAspStyleTable(
            "Own Patrol",
            ownpatrolReportData,
            ownpatrolTotals
          )}

        {/* Empty Table Section */}
        {!loading &&
          emptyReportData.length > 0 &&
          renderAspStyleTable("Empty", emptyReportData, emptyTotals)}
      </div>
    </div>
  );
};

export default ServiceSummaryReport;
