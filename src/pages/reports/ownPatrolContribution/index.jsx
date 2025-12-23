import React, { useState, useEffect, useCallback } from "react";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { useNavigate } from "react-router";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import {
  getOwnPatrolContributionReport,
  exportOwnPatrolContributionReport,
  getOwnPatrolContributionFilterDetails,
} from "../../../../services/reportService";
import "./style.less";
import { CalendarTimeIcon } from "../../../utills/imgConstants";

// Get current month start and end dates
const getCurrentMonthRange = () => {
  const now = moment().tz("Asia/Kolkata");
  const start = now.clone().startOf("month").toDate();
  const end = now.clone().endOf("month").toDate();
  return [start, end];
};

const OwnPatrolContribution = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState(getCurrentMonthRange());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const [scrollbarWidth, setScrollbarWidth] = useState(17);
  const wrapperRef = React.useRef(null);
  const resetLoadingRef = React.useRef(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    locationCategories: [],
    rms: [],
    zms: [],
  });

  const { control, getValues, reset } = useForm({
    defaultValues: {
      locationCategory: [],
      state: [],
      rm: [],
      zm: [],
    },
  });

  const MenuItems = [
    { label: <div onClick={() => navigate("/reports")}>Reports</div> },
    { label: <div>COCO Contribution Summary Report</div> },
  ];

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await getOwnPatrolContributionFilterDetails();
        if (response?.data?.success) {
          setFilterOptions({
            states: response.data.data.states || [],
            locationCategories: response.data.data.locationCategories || [],
            rms: response.data.data.rms || [],
            zms: response.data.data.zms || [],
          });
        }
      } catch (error) {
        console.error("Error loading filter options:", error);
        toast.error("Error loading filter options", { autoClose: 2000 });
      }
    };
    loadFilterOptions();
  }, []);

  // Validate date range
  const validateDateRange = (dateRange) => {
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
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return null;
    return moment.tz(date, "Asia/Kolkata").format("YYYY-MM-DD");
  };

  // Build filters object
  const buildFilters = useCallback((formValues) => {
    const extractIds = (arr) => {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return [];
      return arr
        .map((item) => {
          if (typeof item === "number" || typeof item === "string") {
            return item;
          }
          return item?.id;
        })
        .filter((id) => id != null && id !== "");
    };

    return {
      locationCategoryIds: extractIds(formValues.locationCategory),
      stateIds: extractIds(formValues.state),
      rmIds: extractIds(formValues.rm),
      zmIds: extractIds(formValues.zm),
    };
  }, []);

  // Load default data on component mount (current month)
  useEffect(() => {
    const loadDefaultData = async () => {
      const currentMonthRange = getCurrentMonthRange();
      setDateRange(currentMonthRange);
      setShouldFetch(true);
    };
    loadDefaultData();
  }, []);

  // Fetch report data
  const { data, refetch, isLoading, isFetching } = useQuery(
    [
      "ownPatrolContributionReport",
      dateRange?.[0],
      dateRange?.[1],
      getValues("locationCategory"),
      getValues("state"),
      getValues("nearestCity"),
      getValues("rm"),
      getValues("zm"),
    ],
    () => {
      if (!dateRange || !dateRange[0] || !dateRange[1]) {
        return Promise.resolve({
          data: { success: false, error: "Please select date range" },
        });
      }
      const formValues = getValues();
      const filters = buildFilters(formValues);
      return getOwnPatrolContributionReport({
        startDate: formatDate(dateRange[0]),
        endDate: formatDate(dateRange[1]),
        ...filters,
      });
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: shouldFetch && !!dateRange && !!dateRange[0] && !!dateRange[1],
      onSuccess: (response) => {
        if (response?.data?.success) {
          setReportData(response.data.data);
        } else {
          if (response?.data?.error) {
            toast.error(response?.data?.error || "Failed to load report data");
          }
          setReportData(null);
        }
        if (!resetLoadingRef.current) {
          setLoading(false);
        }
      },
      onError: (error) => {
        toast.error("Failed to load report data");
        console.error(error);
        setReportData(null);
        if (!resetLoadingRef.current) {
          setLoading(false);
        }
      },
    }
  );

  // Update loading state when query is fetching (only if reset is not loading)
  useEffect(() => {
    if ((isLoading || isFetching) && !resetLoadingRef.current) {
      setLoading(true);
    }
  }, [isLoading, isFetching]);

  // Update reset loading state when query completes
  useEffect(() => {
    if (resetLoading && !isLoading && !isFetching) {
      setResetLoading(false);
      resetLoadingRef.current = false;
    }
  }, [resetLoading, isLoading, isFetching]);

  // Apply function
  const handleApply = async () => {
    if (!validateDateRange(dateRange)) {
      setDateError("Date range is required");
      toast.error("Please select a date range", { autoClose: 2000 });
      return;
    }
    setDateError("");
    setLoading(true);
    setShouldFetch(true);
    await refetch();
  };

  // Reset function
  const handleReset = async () => {
    const currentMonthRange = getCurrentMonthRange();
    setResetLoading(true);
    resetLoadingRef.current = true;
    setDateRange(currentMonthRange);
    reset({
      locationCategory: [],
      state: [],
      rm: [],
      zm: [],
    });
    setShouldFetch(true);
    await refetch();
  };

  // Export function
  const handleExport = async () => {
    if (!validateDateRange(dateRange)) {
      setDateError("Date range is required");
      toast.error("Please select a date range", { autoClose: 2000 });
      return;
    }
    setDateError("");
    setExportLoading(true);
    try {
      const formValues = getValues();
      const filters = buildFilters(formValues);
      const response = await exportOwnPatrolContributionReport({
        startDate: formatDate(dateRange[0]),
        endDate: formatDate(dateRange[1]),
        ...filters,
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const dateStr = `${formatDate(dateRange[0])}_to_${formatDate(
        dateRange[1]
      )}`;
      link.download = `COCO-Contribution-${dateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Report exported successfully", { autoClose: 2000 });
    } catch (error) {
      try {
        if (error.response?.data instanceof Blob) {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          toast.error(errorData?.error || "Failed to export report", {
            autoClose: 2000,
          });
        } else {
          toast.error("Failed to export report", { autoClose: 2000 });
        }
      } catch (e) {
        toast.error("Failed to export report", { autoClose: 2000 });
      }
      console.error(error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    if (e && e.value) {
      setDateRange(e.value);
      if (validateDateRange(e.value)) {
        setDateError("");
      }
      setShouldFetch(false);
    } else {
      setDateRange(null);
      setShouldFetch(false);
    }
  };

  // Format percentage
  const formatPercentage = (value) => {
    if (value === undefined || value === null) return "0.00%";
    return `${parseFloat(value).toFixed(2)}%`;
  };

  // Format productivity (truncate to 2 decimals, no rounding)
  const formatProductivity = (value) => {
    if (value === undefined || value === null) return "0.00";
    // Truncate to 2 decimal places without rounding
    const numValue = parseFloat(value);
    const truncated = Math.floor(numValue * 100) / 100;
    return truncated.toFixed(2);
  };

  // Format numbers
  const numberBodyTemplate = (value) => {
    return value || 0;
  };

  // Check if date range is valid
  const isDateRangeValid = React.useMemo(() => {
    return validateDateRange(dateRange);
  }, [dateRange]);

  // Prepare table data
  const tableData = reportData?.cities || [];
  const grandTotals = reportData?.grandTotals || null;

  // Calculate scrollbar width
  React.useEffect(() => {
    const updateScrollbarWidth = () => {
      if (wrapperRef.current) {
        const wrapper = wrapperRef.current;
        const hasVerticalScrollbar =
          wrapper.scrollHeight > wrapper.clientHeight;

        if (hasVerticalScrollbar) {
          const outer = document.createElement("div");
          outer.style.visibility = "hidden";
          outer.style.overflow = "scroll";
          outer.style.msOverflowStyle = "scrollbar";
          outer.style.width = "100px";
          outer.style.height = "100px";
          outer.style.position = "absolute";
          outer.style.top = "-9999px";
          document.body.appendChild(outer);

          const inner = document.createElement("div");
          inner.style.width = "100%";
          inner.style.height = "100%";
          outer.appendChild(inner);

          const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
          document.body.removeChild(outer);

          setScrollbarWidth(Math.max(scrollbarWidth, 15));
        } else {
          setScrollbarWidth(0);
        }
      }
    };

    const timeoutId1 = setTimeout(updateScrollbarWidth, 50);
    const timeoutId2 = setTimeout(updateScrollbarWidth, 200);
    const timeoutId3 = setTimeout(updateScrollbarWidth, 500);

    window.addEventListener("resize", updateScrollbarWidth);

    let resizeObserver = null;
    if (wrapperRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        setTimeout(updateScrollbarWidth, 100);
      });
      resizeObserver.observe(wrapperRef.current);
    }

    const observer = new MutationObserver(() => {
      setTimeout(updateScrollbarWidth, 100);
    });
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      window.removeEventListener("resize", updateScrollbarWidth);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      observer.disconnect();
    };
  }, [tableData, isLoading]);

  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        {/* Filter Section */}
        <div className="border-box bg-white border-transparent mb-4">
          <div className="row row-gap-3_4">
            {/* Date Range */}
            <div className="col-md-6 col-lg-3">
              <div className="form-group">
                <label className="form-label">
                  Date <span style={{ color: "red" }}>*</span>
                </label>
                <Calendar
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  selectionMode="range"
                  numberOfMonths={2}
                  showIcon
                  readOnlyInput
                  placeholder="Select Date Range"
                  dateFormat="dd/mm/yy"
                  icon={<img src={CalendarTimeIcon} alt="calendar" />}
                  iconPos="left"
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
                          moment().tz("Asia/Kolkata").startOf("week").toDate(),
                          moment().tz("Asia/Kolkata").endOf("week").toDate(),
                        ],
                      },
                      {
                        label: "This Month",
                        dateRange: [
                          moment().tz("Asia/Kolkata").startOf("month").toDate(),
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
                      return arr1.every((el, i) => areDatesEqual(el, arr2[i]));
                    };

                    return (
                      <div className="rangecontainer">
                        {Ranges.map((range, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              handleDateRangeChange({
                                value: range.dateRange,
                              });
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

            {/* Location Category Filter */}
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

            {/* State Filter */}
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

            {/* RM Filter */}
            <div className="col-md-6 col-lg-3">
              <div className="form-group">
                <label className="form-label">RM</label>
                <Controller
                  name="rm"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      {...field}
                      value={field.value || []}
                      options={filterOptions.rms}
                      onChange={(e) => field.onChange(e.value)}
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Select RM"
                      maxSelectedLabels={1}
                      selectedItemsLabel="{0} selected"
                      filter
                      className="form-control-select w-100"
                    />
                  )}
                />
              </div>
            </div>

            {/* ZM Filter */}
            <div className="col-md-6 col-lg-3">
              <div className="form-group">
                <label className="form-label">ZM</label>
                <Controller
                  name="zm"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      {...field}
                      value={field.value || []}
                      options={filterOptions.zms}
                      onChange={(e) => field.onChange(e.value)}
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Select ZM"
                      maxSelectedLabels={1}
                      selectedItemsLabel="{0} selected"
                      filter
                      className="form-control-select w-100"
                    />
                  )}
                />
              </div>
            </div>

            {/* Apply, Reset, and Export Buttons */}
            <div className="col-md-6 col-lg-3">
              <div className="form-group">
                <label className="form-label" style={{ visibility: "hidden" }}>
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
                    type="button"
                    label="Apply"
                    className="btn btn-primary"
                    onClick={handleApply}
                    loading={loading}
                    disabled={!isDateRangeValid}
                  />
                  <Button
                    type="button"
                    label="Reset"
                    className="btn btn-primary"
                    onClick={handleReset}
                    loading={resetLoading}
                  />
                  <Button
                    type="button"
                    label="Export"
                    className="btn btn-primary"
                    onClick={handleExport}
                    loading={exportLoading}
                    disabled={
                      !isDateRangeValid ||
                      !reportData ||
                      tableData.length === 0
                    }
                  />
                </div>
              </div>
            </div>
          </div>
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
        {!loading && (
          <div
            style={{ marginTop: "24px", marginBottom: "24px", clear: "both" }}
          >
            <div className="border-box bg-white border-transparent">
              {/* <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Own Patrol Contribution Summary Report</h4>
              </div> */}

              {/* Report Table */}
              <div
                ref={wrapperRef}
                className="own-patrol-contribution-table-wrapper"
                style={{
                  "--scrollbar-width": `${scrollbarWidth}px`,
                }}
              >
                {!reportData || tableData.length === 0 ? (
                  <div className="text-center p-4">No data available</div>
                ) : (
                  <table className="own-patrol-contribution-table">
                    <thead>
                      <tr>
                        <th rowSpan={2} className="sticky-left">
                          City
                        </th>
                        <th rowSpan={2}>State</th>
                        <th rowSpan={2}>Location Category</th>
                        <th colSpan={3} className="header-group">
                          Vehicle Count
                        </th>
                        <th colSpan={3} className="header-group">
                          COCO Case
                        </th>
                        <th colSpan={3} className="header-group">
                          ASP Case
                        </th>
                        <th colSpan={3} className="header-group">
                          Total Cases
                        </th>
                        <th colSpan={3} className="header-group">
                          COCO Share
                        </th>
                        <th colSpan={3} className="header-group">
                          Productivity Actual
                        </th>
                        <th rowSpan={2} className="sticky-right-rm">
                          RM Name
                        </th>
                        <th rowSpan={2} className="sticky-right-zm">
                          ZM Name
                        </th>
                      </tr>
                      <tr>
                        <th className="month-header">ROS</th>
                        <th className="month-header">Tow</th>
                        <th className="total-header">Total</th>
                        <th className="month-header">ROS</th>
                        <th className="month-header">Tow</th>
                        <th className="total-header">Total</th>
                        <th className="month-header">ROS</th>
                        <th className="month-header">Tow</th>
                        <th className="total-header">Total</th>
                        <th className="month-header">ROS</th>
                        <th className="month-header">Tow</th>
                        <th className="total-header">Total</th>
                        <th className="month-header">ROS</th>
                        <th className="month-header">Tow</th>
                        <th className="total-header">Overall</th>
                        <th className="month-header">ROS</th>
                        <th className="month-header">Tow</th>
                        <th className="total-header">Overall</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Grand Total Row - Immediately after headers */}
                      {grandTotals && (
                        <tr className="grand-total-row">
                          <td className="sticky-left">Grand Total</td>
                          <td></td>
                          <td></td>
                          <td className="number-cell">
                            {numberBodyTemplate(grandTotals.vehicleCount?.ros)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(grandTotals.vehicleCount?.towing)}
                          </td>
                          <td className="number-cell total-cell">
                            {numberBodyTemplate(grandTotals.vehicleCount?.total)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(grandTotals.ownPatrol?.ros)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(grandTotals.ownPatrol?.tow)}
                          </td>
                          <td className="number-cell total-cell">
                            {numberBodyTemplate(grandTotals.ownPatrol?.total)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(grandTotals.asp?.ros)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(grandTotals.asp?.tow)}
                          </td>
                          <td className="number-cell total-cell">
                            {numberBodyTemplate(grandTotals.asp?.total)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(grandTotals.totalCases?.ros)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(grandTotals.totalCases?.tow)}
                          </td>
                          <td className="number-cell total-cell">
                            {numberBodyTemplate(grandTotals.totalCases?.total)}
                          </td>
                          <td className="number-cell">
                            {formatPercentage(grandTotals.cocoShare?.ros)}
                          </td>
                          <td className="number-cell">
                            {formatPercentage(grandTotals.cocoShare?.tow)}
                          </td>
                          <td className="number-cell total-cell">
                            {formatPercentage(grandTotals.cocoShare?.overall)}
                          </td>
                          <td className="number-cell">
                            {formatProductivity(grandTotals.productivityActual?.ros)}
                          </td>
                          <td className="number-cell">
                            {formatProductivity(grandTotals.productivityActual?.tow)}
                          </td>
                          <td className="number-cell total-cell">
                            {formatProductivity(grandTotals.productivityActual?.overall)}
                          </td>
                          <td className="sticky-right-rm"></td>
                          <td className="sticky-right-zm"></td>
                        </tr>
                      )}
                      {/* Data Rows */}
                      {tableData.map((row, index) => (
                        <tr key={index}>
                          <td className="sticky-left">{row.city}</td>
                          <td>{row.state || ""}</td>
                          <td>{row.locationCategory || ""}</td>
                          <td className="number-cell">
                            {numberBodyTemplate(row.vehicleCount?.ros)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(row.vehicleCount?.towing)}
                          </td>
                          <td className="number-cell total-cell">
                            {numberBodyTemplate(row.vehicleCount?.total)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(row.ownPatrol?.ros)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(row.ownPatrol?.tow)}
                          </td>
                          <td className="number-cell total-cell">
                            {numberBodyTemplate(row.ownPatrol?.total)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(row.asp?.ros)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(row.asp?.tow)}
                          </td>
                          <td className="number-cell total-cell">
                            {numberBodyTemplate(row.asp?.total)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(row.totalCases?.ros)}
                          </td>
                          <td className="number-cell">
                            {numberBodyTemplate(row.totalCases?.tow)}
                          </td>
                          <td className="number-cell total-cell">
                            {numberBodyTemplate(row.totalCases?.total)}
                          </td>
                          <td className="number-cell">
                            {formatPercentage(row.cocoShare?.ros)}
                          </td>
                          <td className="number-cell">
                            {formatPercentage(row.cocoShare?.tow)}
                          </td>
                          <td className="number-cell total-cell">
                            {formatPercentage(row.cocoShare?.overall)}
                          </td>
                          <td className="number-cell">
                            {formatProductivity(row.productivityActual?.ros)}
                          </td>
                          <td className="number-cell">
                            {formatProductivity(row.productivityActual?.tow)}
                          </td>
                          <td className="number-cell total-cell">
                            {formatProductivity(row.productivityActual?.overall)}
                          </td>
                          <td className="sticky-right-rm">{row.rmNames || ""}</td>
                          <td className="sticky-right-zm">{row.zmNames || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnPatrolContribution;
