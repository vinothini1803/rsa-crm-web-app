import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import { Dropdown } from "primereact/dropdown";
import {
  DialogCloseIcon,
  AscentSortIcon,
  DescentSortIcon,
  SortIcon,
  EmptyListImage,
  PrevImage,
  NextImage,
} from "../../utills/imgConstants";
import {
  getCaseInfo,
  getMapViewVehicleCaseDetails,
  getMapViewTechnicianCaseDetails,
  getMapViewCaseServiceDetails,
} from "../../../services/caseService";
import { toast } from "react-toastify";
import NoDataComponent from "../../components/common/NoDataComponent";
import EmptyComponent from "../../components/common/TableWrapper/EmptyComponent";

const MapMarkerDetailsPanel = ({
  visible,
  onClose,
  marker,
  mapViewContext,
}) => {
  const navigate = useNavigate();
  const [serviceTableRows, setServiceTableRows] = React.useState(10);
  const [serviceTableFirst, setServiceTableFirst] = React.useState(0);
  const [serviceTableCurrentPage, setServiceTableCurrentPage] =
    React.useState(0);
  const [caseDetailsTableRows, setCaseDetailsTableRows] = React.useState(10);
  const [caseDetailsTableFirst, setCaseDetailsTableFirst] = React.useState(0);
  const [caseDetailsCurrentPage, setCaseDetailsCurrentPage] = React.useState(0);

  // Reset pagination when marker changes
  React.useEffect(() => {
    setServiceTableFirst(0);
    setServiceTableRows(10);
    setServiceTableCurrentPage(0);
    setCaseDetailsTableFirst(0);
    setCaseDetailsTableRows(10);
    setCaseDetailsCurrentPage(0);
  }, [marker?.id]);

  // Pagination template matching existing design pattern
  const handleServiceTablePageChange = (e) => {
    setServiceTableRows(e.rows);
    // Reset to first page when rows per page changes
    if (e.rows !== serviceTableRows) {
      setServiceTableFirst(0);
      setServiceTableCurrentPage(0);
    } else {
      setServiceTableFirst(e.first);
      setServiceTableCurrentPage(e.page || Math.floor(e.first / e.rows));
    }
  };

  const handleCaseDetailsTablePageChange = (e) => {
    setCaseDetailsTableRows(e.rows);
    // Reset to first page when rows per page changes
    if (e.rows !== caseDetailsTableRows) {
      setCaseDetailsTableFirst(0);
      setCaseDetailsCurrentPage(0);
    } else {
      setCaseDetailsTableFirst(e.first);
      setCaseDetailsCurrentPage(e.page || Math.floor(e.first / e.rows));
    }
  };

  const handlejumppageService = (e, options) => {
    const rows = serviceTableRows || 10;
    if (options.page > options.currentPage || options.currentPage == 0) {
      setServiceTableFirst((options.currentPage + 4) * rows);
    } else {
      setServiceTableFirst(
        options.page == 1 ? 0 : (options.currentPage - 4) * rows
      );
    }
  };

  const handlejumppageCaseDetails = (e, options) => {
    const rows = caseDetailsTableRows || 10;
    if (options.page > options.currentPage || options.currentPage == 0) {
      setCaseDetailsTableFirst((options.currentPage + 4) * rows);
    } else {
      setCaseDetailsTableFirst(
        options.page == 1 ? 0 : (options.currentPage - 4) * rows
      );
    }
  };

  // Create PageLinks function factory for different tables
  const createPageLinks = (isServiceTable) => {
    return (options) => {
      const pageIndex = options.page; // 0-based index of the page being rendered
      const pageNumber = pageIndex + 1; // 1-based page number
      const totalPages = options.totalPages || 0;
      const view = options.view || {};

      // Get current active page from appropriate DataTable state
      const rows = isServiceTable ? serviceTableRows : caseDetailsTableRows;
      const first = isServiceTable ? serviceTableFirst : caseDetailsTableFirst;
      const activePageIndex = Math.floor(first / rows); // Current active page (0-based)

      // Determine which 2 pages to show: active page and previous page (or active and next if on first page)
      let pagesToShow = [];
      if (totalPages <= 2) {
        // If 2 or fewer pages, show all
        pagesToShow = Array.from({ length: totalPages }, (_, i) => i);
      } else {
        // Show active page and previous page (if available)
        if (activePageIndex > 0) {
          pagesToShow = [activePageIndex - 1, activePageIndex];
        } else {
          pagesToShow = [activePageIndex, activePageIndex + 1];
        }
        // Ensure we don't go beyond total pages
        pagesToShow = pagesToShow.filter((p) => p < totalPages);
      }

      const firstVisiblePage =
        pagesToShow.length > 0 ? Math.min(...pagesToShow) : 0;
      const lastVisiblePage =
        pagesToShow.length > 0 ? Math.max(...pagesToShow) : 0;

      // Check if this page should be shown
      const shouldShowPage = pagesToShow.includes(pageIndex);

      // Use master list pattern: show ellipsis when view indicates a gap
      // Show ellipsis before if this is the startPage and there are pages before
      const needsEllipsisBefore =
        view.startPage === pageIndex &&
        view.startPage !== 0 &&
        firstVisiblePage > 0;

      // Show ellipsis after if this is the endPage and there are pages after
      const needsEllipsisAfter =
        view.endPage === pageIndex &&
        pageIndex + 1 !== totalPages &&
        lastVisiblePage < totalPages - 1;

      // Show ellipsis before (using master list pattern)
      if (needsEllipsisBefore) {
        return (
          <button
            type="button"
            className={options.className}
            onClick={(e) =>
              isServiceTable
                ? handlejumppageService(e, options)
                : handlejumppageCaseDetails(e, options)
            }
            style={{ cursor: "pointer" }}
          >
            ...
          </button>
        );
      }

      // Show the page number if it's in the visible range
      if (shouldShowPage) {
        return (
          <button
            type="button"
            className={options.className}
            onClick={options.onClick}
          >
            {pageNumber}
          </button>
        );
      }

      // Show ellipsis after (using master list pattern)
      if (needsEllipsisAfter) {
        return (
          <button
            type="button"
            className={options.className}
            onClick={(e) =>
              isServiceTable
                ? handlejumppageService(e, options)
                : handlejumppageCaseDetails(e, options)
            }
            style={{ cursor: "pointer" }}
          >
            ...
          </button>
        );
      }

      // Don't render other pages
      return null;
    };
  };

  // Create separate paginator templates for each table
  const createPaginatorTemplate = (isServiceTable) => ({
    layout:
      "RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink",
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className="paginator-prev"
          onClick={options.onClick}
          disabled={options.disabled}
          style={{ fontSize: "12px", flexShrink: 0, whiteSpace: "nowrap" }}
        >
          <img
            src={PrevImage}
            alt="Previous"
            style={{ width: "12px", height: "12px" }}
          />
          <span>Prev</span>
        </button>
      );
    },
    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className="paginator-next"
          onClick={options.onClick}
          disabled={options.disabled}
          style={{ fontSize: "12px", flexShrink: 0, whiteSpace: "nowrap" }}
        >
          <span>Next</span>
          <img
            src={NextImage}
            alt="Next"
            style={{ width: "12px", height: "12px" }}
          />
        </button>
      );
    },
    PageLinks: createPageLinks(isServiceTable),
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: "10 per page", value: 10 },
        { label: "20 per page", value: 20 },
        { label: "50 per page", value: 50 },
        { label: "100 per page", value: 100 },
      ];

      return (
        <Dropdown
          value={options.value}
          defaultValue={10}
          options={dropdownOptions}
          onChange={options.onChange}
          className="pagination-dropdown"
          style={{ marginRight: "auto", fontSize: "12px", flexShrink: 0 }}
        />
      );
    },
    CurrentPageReport: (options) => {
      // Ensure we have valid values, with fallbacks
      const first = options?.first ?? 0;
      const last = options?.last ?? 0;
      const total = options?.totalRecords ?? 0;

      // Handle edge cases
      if (total === 0) {
        return (
          <div
            className="paginate-info"
            style={{ fontSize: "12px", flexShrink: 0, whiteSpace: "nowrap" }}
          >
            Showing 0 - 0 of 0 Entries
          </div>
        );
      }

      return (
        <div
          className="paginate-info"
          style={{ fontSize: "12px", flexShrink: 0, whiteSpace: "nowrap" }}
        >
          Showing {first} - {last} of {total} Entries
        </div>
      );
    },
  });

  // Fetch case and service details if marker is a Case
  const { data: caseServiceData, isLoading: caseLoading } = useQuery(
    ["caseServiceDetails", marker?.id],
    () =>
      getMapViewCaseServiceDetails({
        caseId: marker?.id,
      }),
    {
      enabled: visible && marker?.type === "Case" && !!marker?.id,
      onError: (error) => {
        console.error("Error fetching case details:", error);
        toast.error("Failed to load case details");
      },
    }
  );

  // Fetch vehicle case details if marker is an ASP/Vehicle
  const { data: vehicleCaseData, isLoading: vehicleCaseLoading } = useQuery(
    ["vehicleCaseDetails", marker?.id],
    () =>
      getMapViewVehicleCaseDetails({
        aspId: marker?.id,
      }),
    {
      enabled: visible && marker?.type === "ASP" && !!marker?.id,
      onError: (error) => {
        console.error("Error fetching vehicle case details:", error);
        toast.error("Failed to load vehicle case details");
      },
    }
  );

  // Fetch technician case details if marker is a Technician
  const { data: technicianCaseData, isLoading: technicianCaseLoading } =
    useQuery(
      ["technicianCaseDetails", marker?.id],
      () =>
        getMapViewTechnicianCaseDetails({
          aspMechanicId: marker?.id,
        }),
      {
        enabled: visible && marker?.type === "Technician" && !!marker?.id,
        onError: (error) => {
          console.error("Error fetching technician case details:", error);
          toast.error("Failed to load technician case details");
        },
      }
    );

  const caseData = caseServiceData?.data?.data?.caseDetails;
  const vehicleCaseDetails = vehicleCaseData?.data?.data;
  const technicianCaseDetails = technicianCaseData?.data?.data;
  const serviceData = caseServiceData?.data?.data?.serviceDetails;

  // Handle ASP Assignment
  const handleAspAssign = (serviceItem) => {
    const caseDetailId = serviceItem?.caseDetailId;
    const activityId = serviceItem?.activityId;
    const typeId = caseData?.typeId || marker?.typeId;

    if (!caseDetailId) {
      toast.error("Unable to assign ASP: Missing case information");
      return;
    }

    // Check if it's a delivery request (typeId === 32) or regular case
    let url;
    if (typeId === 32) {
      // Delivery request route: /delivery-request/{caseDetailId}/service-provider
      url = `/delivery-request/${caseDetailId}/service-provider`;
    } else {
      // Regular case route: /cases/asp-assignment/{caseDetailId}/{activityId}
      if (!activityId) {
        toast.error("Unable to assign ASP: Missing activity information");
        return;
      }
      url = `/cases/asp-assignment/${caseDetailId}/${activityId}`;
    }
    window.open(url, "_blank");
  };

  return (
    <Sidebar
      visible={visible}
      position="right"
      closeIcon={<DialogCloseIcon />}
      onHide={onClose}
      pt={{
        root: { className: "w-582 custom-sidebar map-marker-details-sidebar" },
        header: { className: "brdr-bottom" },
      }}
      icons={
        <div className="sidebar-title">
          {marker?.type === "ASP"
            ? "Vehicle & Case Details"
            : marker?.type === "Technician"
            ? "Technician & Case Details"
            : "Case & Service Details"}
        </div>
      }
    >
      <div className="sidebar-content-wrap">
        <div className="sidebar-content-body">
          {marker?.type === "ASP" ? (
            // Vehicle Details Section
            <div className="form-group mb-4">
              <div
                className="form-label mb-3"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Vehicle Details
              </div>
              <div className="detail-list-compact detail-list-two-column">
                <div className="detail-row">
                  <span className="detail-label">Vehicle No.:</span>
                  <span className="detail-value">
                    {marker?.registrationNumber ||
                      marker?.vehicleRegistrationNumber ||
                      "--"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Vehicle Type:</span>
                  <span className="detail-value">
                    {marker?.vehicleType || marker?.vehicleTypeName || "--"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Current Contact Name:</span>
                  <span className="detail-value">
                    {marker?.currentContactName || marker?.name || "--"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ASP Code:</span>
                  <span className="detail-value">{marker?.code || "--"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Work Shop:</span>
                  <span className="detail-value">
                    {marker?.workshopName || "--"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Updated Time:</span>
                  <span className="detail-value">
                    {marker?.lastUpdatedTime || "--"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    ASP BD Reach Time (Mins):
                  </span>
                  <span className="detail-value">
                    {marker?.aspBdReachTime || "0"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    ASP BD Reach Distance (Meters):
                  </span>
                  <span className="detail-value">
                    {marker?.aspBdReachDistance || "0"}
                  </span>
                </div>
              </div>
            </div>
          ) : marker?.type === "Technician" ? (
            // Technician Details Section
            <div className="form-group mb-4">
              <div
                className="form-label mb-3"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Technician Details
              </div>
              <div className="detail-list-compact detail-list-two-column">
                <div className="detail-row">
                  <span className="detail-label">Technician Code:</span>
                  <span className="detail-value">{marker?.code || "--"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Technician Name:</span>
                  <span className="detail-value">{marker?.name || "--"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Contact Number:</span>
                  <span className="detail-value">
                    {marker?.contactNumber || "--"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Alternate Contact:</span>
                  <span className="detail-value">
                    {marker?.alternateContactNumber || "--"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{marker?.email || "--"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Vehicle No.:</span>
                  <span className="detail-value">
                    {marker?.vehicleRegistrationNumber || "--"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Vehicle Type:</span>
                  <span className="detail-value">
                    {marker?.vehicleType || "--"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">
                    {marker?.address || "--"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Case Details Section
            <div className="form-group mb-4">
              <div
                className="form-label mb-3"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Case Details
              </div>
              {caseLoading ? (
                <div className="text-center p-4">Loading case details...</div>
              ) : caseData ? (
                <div className="detail-list-compact detail-list-two-column">
                  <div className="detail-row">
                    <span className="detail-label">Case ID:</span>
                    <span className="detail-value">
                      {caseData?.caseNumber ? (
                        <a
                          href={
                            caseData?.typeId === 32
                              ? `/delivery-request/view/${marker?.id}`
                              : `/cases/view/${marker?.id}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#0370f2",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {caseData.caseNumber}
                        </a>
                      ) : (
                        "--"
                      )}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Current Contact Name:</span>
                    <span className="detail-value">
                      {caseData?.currentContactName || "--"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Account:</span>
                    <span className="detail-value">
                      {caseData?.clientName || "--"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      {caseData?.caseStatusName || "--"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Vehicle No.:</span>
                    <span className="detail-value">
                      {caseData?.registrationNumber || "--"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">SLA Status:</span>
                    <span className="detail-value">
                      {caseData?.slaStatusName || "--"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Subject:</span>
                    <span className="detail-value">
                      {caseData?.caseSubjectName || "--"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Current Contact No.:</span>
                    <span className="detail-value">
                      {caseData?.currentContactNumber || "--"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">
                      {caseData?.breakdownLocation || "--"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Created On:</span>
                    <span className="detail-value">
                      {caseData?.createdAt || "--"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Owner:</span>
                    <span className="detail-value">
                      {caseData?.ownerName || "--"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">SLA Estimated Time:</span>
                    <span className="detail-value">
                      {caseData?.slaEstimatedTime || "--"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location Type:</span>
                    <span className="detail-value">
                      {caseData?.breakdownLocationType || "--"}
                    </span>
                  </div>
                </div>
              ) : (
                <NoDataComponent
                  image={EmptyListImage}
                  text="No case details available"
                />
              )}
            </div>
          )}

          {/* Case Summary Section - For ASP and Technician markers */}
          {(marker?.type === "ASP" || marker?.type === "Technician") && (
            <div className="form-group mb-4">
              <div
                className="form-label mb-3"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Case Summary
              </div>
              {(
                marker?.type === "ASP"
                  ? vehicleCaseLoading
                  : technicianCaseLoading
              ) ? (
                <div className="text-center p-4">Loading case summary...</div>
              ) : (
                  marker?.type === "ASP"
                    ? vehicleCaseDetails?.summary
                    : technicianCaseDetails?.summary
                ) ? (
                <DataTable
                  value={[
                    {
                      status: "Open",
                      count:
                        (marker?.type === "ASP"
                          ? vehicleCaseDetails
                          : technicianCaseDetails
                        ).summary.open || 0,
                    },
                    {
                      status: "In Progress",
                      count:
                        (marker?.type === "ASP"
                          ? vehicleCaseDetails
                          : technicianCaseDetails
                        ).summary.inProgress || 0,
                    },
                    {
                      status: "Cancelled",
                      count:
                        (marker?.type === "ASP"
                          ? vehicleCaseDetails
                          : technicianCaseDetails
                        ).summary.cancelled || 0,
                    },
                    {
                      status: "Closed",
                      count:
                        (marker?.type === "ASP"
                          ? vehicleCaseDetails
                          : technicianCaseDetails
                        ).summary.closed || 0,
                    },
                  ]}
                  emptyMessage={<EmptyComponent />}
                  className="p-datatable-sm"
                >
                  <Column field="status" header="Status" />
                  <Column field="count" header="Count" />
                </DataTable>
              ) : (
                <NoDataComponent
                  image={EmptyListImage}
                  text="No case summary available"
                />
              )}
            </div>
          )}

          {/* Case Details Table - For ASP and Technician markers */}
          {(marker?.type === "ASP" || marker?.type === "Technician") && (
            <div className="form-group mb-4">
              <div
                className="form-label mb-3"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Case Details
              </div>
              {(
                marker?.type === "ASP"
                  ? vehicleCaseLoading
                  : technicianCaseLoading
              ) ? (
                <div className="text-center p-4">Loading case details...</div>
              ) : (marker?.type === "ASP"
                  ? vehicleCaseDetails?.caseDetails
                  : technicianCaseDetails?.caseDetails) &&
                (marker?.type === "ASP"
                  ? vehicleCaseDetails.caseDetails.length > 0
                  : technicianCaseDetails.caseDetails.length > 0) ? (
                <div style={{ width: "100%", overflow: "hidden" }}>
                  <DataTable
                    value={
                      marker?.type === "ASP"
                        ? vehicleCaseDetails.caseDetails
                        : technicianCaseDetails.caseDetails
                    }
                    emptyMessage={<EmptyComponent />}
                    className="p-datatable-sm"
                    paginator
                    rows={caseDetailsTableRows}
                    first={caseDetailsTableFirst}
                    onPage={handleCaseDetailsTablePageChange}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    paginatorTemplate={createPaginatorTemplate(false)}
                    totalRecords={
                      (marker?.type === "ASP"
                        ? vehicleCaseDetails.caseDetails
                        : technicianCaseDetails.caseDetails
                      )?.length || 0
                    }
                    pt={{
                      paginator: {
                        style: {
                          display: "flex",
                          flexWrap: "nowrap",
                          alignItems: "center",
                          gap: "4px",
                          padding: "0.5rem",
                          overflowX: "auto",
                          minWidth: "100%",
                        },
                      },
                    }}
                  >
                    <Column
                      field="caseNumber"
                      header="Case Number"
                      body={(rowData) => (
                        <a
                          href={
                            rowData?.typeId === 32
                              ? `/delivery-request/view/${rowData.caseId}`
                              : `/cases/view/${rowData.caseId}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#0370f2",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {rowData.caseNumber || "--"}
                        </a>
                      )}
                    />
                    <Column field="subject" header="Subject" />
                    <Column field="service" header="Service" />
                    <Column field="subService" header="Sub Service" />
                    <Column field="activityStatus" header="Activity Status" />
                    <Column field="caseStatus" header="Case Status" />
                  </DataTable>
                </div>
              ) : (
                <NoDataComponent
                  image={EmptyListImage}
                  text="No case details available"
                />
              )}
            </div>
          )}

          {/* Service Details - Only for Case markers */}
          {marker?.type === "Case" && (
            <div className="form-group mb-4">
              <div
                className="form-label mb-3"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Service Details
              </div>
              {caseLoading ? (
                <div className="text-center p-4">
                  Loading service details...
                </div>
              ) : serviceData && serviceData.length > 0 ? (
                <DataTable
                  value={serviceData}
                  emptyMessage={<EmptyComponent />}
                  className="p-datatable-sm"
                  paginator
                  rows={serviceTableRows}
                  first={serviceTableFirst}
                  onPage={handleServiceTablePageChange}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  paginatorTemplate={createPaginatorTemplate(true)}
                  totalRecords={serviceData?.length || 0}
                >
                  <Column field="serviceName" header="Service" />
                  <Column field="subServiceName" header="Sub Service" />
                  <Column
                    field="aspActivityStatusName"
                    header="ASP Activity Status"
                  />
                  <Column field="aspName" header="ASP Name" />
                  <Column field="aspCode" header="ASP Code" />
                  <Column field="activityStatusName" header="Activity Status" />
                  <Column
                    header="Action"
                    body={(rowData) => {
                      const typeId = rowData?.typeId;
                      let shouldShowAssignButton = false;

                      if (typeId === 32) {
                        // For delivery request (typeId === 32):
                        // Show "Assign ASP" if agent is assigned (agentId is not null) AND ASP is not assigned (aspId is null)
                        shouldShowAssignButton =
                          rowData?.agentId && !rowData?.aspId;
                      } else {
                        // For regular case (typeId === 31 or other):
                        // Show "Assign ASP" if agent has picked the service (agentPickedAt is not null) AND ASP is not assigned (aspId is null)
                        shouldShowAssignButton =
                          rowData?.agentPickedAt && !rowData?.aspId;
                      }

                      if (shouldShowAssignButton) {
                        return (
                          <button
                            onClick={() => handleAspAssign(rowData)}
                            style={{
                              color: "#0370f2",
                              textDecoration: "underline",
                              cursor: "pointer",
                              background: "none",
                              border: "none",
                              padding: 0,
                              fontSize: "inherit",
                            }}
                          >
                            Assign ASP
                          </button>
                        );
                      }
                      return "--";
                    }}
                  />
                </DataTable>
              ) : (
                <NoDataComponent
                  image={EmptyListImage}
                  text="No data available in table"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default MapMarkerDetailsPanel;
