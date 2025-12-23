import React, { useMemo, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  AscentSortIcon,
  CalendarTimeIcon,
  ConfirmIcon,
  DangerConfirmIcon,
  DescentSortIcon,
  EditBlueIcon,
  ImportIconGray,
  NoteInfoIcon,
  CustomReportIcon,
  SortIcon,
  FilterIcon,
} from "../../../utills/imgConstants";

import {
  ActiveIcon,
  BinIcon,
  CloseTagIcon,
  DropdownIcon,
  ExportGreyIcon,
  ExportIcon,
  ImportGreyIcon,
  ImportIcon,
  InactiveIcon,
  NextImage,
  PlusIcon,
  PrevImage,
} from "../../../utills/imgConstants";
import { Dropdown } from "primereact/dropdown";
import Filters from "../Filters";
import "../components.less";
import Search from "../Search";
import { Menu } from "primereact/menu";
import TableActions from "../TableActions";
import EmptyComponent from "./EmptyComponent";
import { Chip } from "primereact/chip";
import ImportDialog from "../ImportDialog";
import ExportDialog from "../ExportDialog";
import { Calendar } from "primereact/calendar";
import { Paginator } from "primereact/paginator";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import moment from "moment";

const TableWrapper = ({
  title,
  className,
  columns,
  data,
  rowSelection,
  classname,
  loading,
  onFilterApply,
  onAdd,
  action,
  selectionMode,
  expand,
  handleDateChange,
  date,
  datepicker,
  tableScroll,
  addbtn,
  filterFields,
  exportAction,
  importAction,
  onPaginationChange,
  totalRecords,
  onSearch,
  onEdit,
  onDelete,
  onStatusUpdate,
  deleteLoading,
  statusLoading,
  selectedRows,
  setSelectedRows,
  onReport,
  isVisible,
  onImport,
  onExport,
  onServiceExport,
  onServiceImport,
  isDataSelectable,
  onSkillImport,
  onSkillExport,
  showFilterButton,
  onFilterButtonClick,
  selectedDateFilters,
  filterChip,
  removeChip,
  filterOptions,
  onClientEntitlementImport,
  onClientEntitlementExport,
  onQuestionnaireImport,
  onQuestionnaireExport,
  highlightIrateCustomer = false,
  searchValue,
}) => {
  const [first, setFirst] = useState(0);

  // console.log("onExport", onExport, onImport);

  const [rows, setRows] = useState(10);
  const actionmenu = useRef(null);
  const [filters, setFilters] = useState(
    filterFields?.filterFields?.includes("refDate")
      ? selectedDateFilters.startDate && selectedDateFilters.endDate
        ? {
            date: {
              label: `${moment(selectedDateFilters.startDate).format(
                "DD MMM YYYY"
              )} - ${moment(selectedDateFilters.endDate).format(
                "DD MMM YYYY"
              )}`,
              value: [
                moment(selectedDateFilters.startDate).toDate(),
                moment(selectedDateFilters.endDate).toDate(),
              ],
            },
          }
        : null
      : filterFields?.filterFields?.includes("date")
      ? {
          date: {
            label: `${moment()
              .startOf("month")
              .format("DD MMM YYYY")} - ${moment()
              .endOf("month")
              .format("DD MMM YYYY")}`,
            value: [
              moment().startOf("month").toDate(),
              moment().endOf("month").toDate(),
            ],
          },
        }
      : null
  );
  const [remove, setRemove] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dialogOptions, setDialogOptions] = useState();
  const actionLoading = {
    Delete: deleteLoading,
    Active: statusLoading,
    Inactive: statusLoading,
  };
  const dataSource = Array.from({ length: 1000 }, (v, i, k) => {
    return {
      id: i,
      action: <TableActions />,
      code: i + 1,
      name: "Bamboo Watch",
      category: "Accessories",
      quantity: "24",
    };
  });

  const handleSearch = (e) => {
    // console.log("search value", e.target.value);
    onSearch(e.target.value);
  };
  // const handlepageChange = (e) => {
  //   console.log("page change event", e);
  //   setRows(e.rows);
  //   setFirst(first ? e.rows * e.page : e.first);
  //   onPaginationChange(e.page, e.rows);
  // };
  // console.log("first", first);
  const handlejumppage = (e, options) => {
    // console.log("jump options details", options);
    if (options.page > options.currentPage || options.currentPage == 0) {
      setFirst(
        options.currentPage + 4 >= options.totalPages
          ? (options.totalPages - 1) * options.props.rows
          : (options.currentPage + 4) * options.props.rows
      ); //To set Page ---> update with index of data
    } else {
      setFirst(
        options.page == 1 ? 0 : (options.currentPage - 4) * options.props.rows
      );
    }
  };

  const handlerowSelect = (e) => {
    setSelectedRows(e.value);
  };
  // console.log("first", first);

  const handleFilter = (values) => {
    // console.log("filterd values", values);
    setFirst(0);
    setRows(10);
    setFilters(values);
    onFilterApply(values);
  };
  const paginatorTemplate = {
    layout:
      "RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink",
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={"paginator-prev"}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <img src={PrevImage} />
          <span className="">Prev</span>
        </button>
      );
    },
    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={"paginator-next"}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="">Next</span>
          <img src={NextImage} />
        </button>
      );
    },
    PageLinks: (options) => {
      // console.log("page link options", options);
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        return (
          <button
            type="button"
            className={options.className}
            onClick={(e) => handlejumppage(e, options)}
          >
            ...
          </button>
        );
      }
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
        >
          {options.page + 1}
        </button>
      );
    },
    RowsPerPageDropdown: (options) => {
      // console.log("row per page classname", options);
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
          style={{ marginRight: "auto" }}
        />
      );
    },
    CurrentPageReport: (options) => {
      // console.log("CurrentPageReport options", options);
      return (
        <div className="paginate-info">
          Showing {options?.first} - {options?.last} of {options?.totalRecords}{" "}
          Entries
        </div>
      );
    },
  };

  const handleExport = () => {
    setExportVisible(true);
  };
  const items = [
    ...(onImport
      ? [
          {
            label: "Import",
            template: (
              <div className="action-menu-item" onClick={() => onImport()}>
                <img src={ImportGreyIcon} />
                <span className="menu-label">Import</span>
              </div>
            ),
          },
        ]
      : []),

    ...(onExport
      ? [
          {
            label: "Export",
            template: (
              <div className="action-menu-item" onClick={() => onExport()}>
                <img src={ExportGreyIcon} />
                <span className="menu-label">Export</span>
              </div>
            ),
          },
        ]
      : []),
    ...(onServiceImport
      ? [
          {
            label: "Import",
            template: (
              <div
                className="action-menu-item"
                onClick={() => onServiceImport()}
              >
                <img src={ImportGreyIcon} />
                <span className="menu-label">Service Import</span>
              </div>
            ),
          },
        ]
      : []),

    ...(onServiceExport
      ? [
          {
            label: "Export",
            template: (
              <div
                className="action-menu-item"
                onClick={() => onServiceExport()}
              >
                <img src={ExportGreyIcon} />
                <span className="menu-label">Service Export</span>
              </div>
            ),
          },
        ]
      : []),
    ...(onSkillImport
      ? [
          {
            label: "Import",
            template: (
              <div className="action-menu-item" onClick={() => onSkillImport()}>
                <img src={ImportGreyIcon} />
                <span className="menu-label">User Skill Import</span>
              </div>
            ),
          },
        ]
      : []),
    ...(onSkillExport
      ? [
          {
            label: "Export",
            template: (
              <div className="action-menu-item" onClick={() => onSkillExport()}>
                <img src={ExportGreyIcon} />
                <span className="menu-label">User Skill Export</span>
              </div>
            ),
          },
        ]
      : []),

    ...(onClientEntitlementImport
      ? [
          {
            label: "Import",
            template: (
              <div
                className="action-menu-item"
                onClick={() => onClientEntitlementImport()}
              >
                <img src={ImportGreyIcon} />
                <span className="menu-label">Entitlement Import</span>
              </div>
            ),
          },
        ]
      : []),

    ...(onClientEntitlementExport
      ? [
          {
            label: "Export",
            template: (
              <div
                className="action-menu-item"
                onClick={() => onClientEntitlementExport()}
              >
                <img src={ExportGreyIcon} />
                <span className="menu-label">Entitlement Export</span>
              </div>
            ),
          },
        ]
      : []),

    ...(onQuestionnaireImport
      ? [
          {
            label: "Import",
            template: (
              <div
                className="action-menu-item"
                onClick={() => onQuestionnaireImport()}
              >
                <img src={ImportGreyIcon} />
                <span className="menu-label">Questionnaire Import</span>
              </div>
            ),
          },
        ]
      : []),

    ...(onQuestionnaireExport
      ? [
          {
            label: "Export",
            template: (
              <div
                className="action-menu-item"
                onClick={() => onQuestionnaireExport()}
              >
                <img src={ExportGreyIcon} />
                <span className="menu-label">Questionnaire Export</span>
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleChipRemove = (filter) => {
    setRemove((prev) => {
      // console.log("prev", prev);
      return prev == null ? true : !prev;
    });
    // console.log("chip", filter);
    delete filters[filter]; //To remove filter-->Mutate filter state
    setFilters({ ...filters });
    setFirst(0);
    setRows(10);
    onFilterApply({
      ...filters,
    });
  };
  const handleChipdelete = (key, item = null) => {
    const updatedFilters = { ...filterChip };

    if (key === "calendar") {
      delete updatedFilters[key];
    } else if (Array.isArray(updatedFilters[key])) {
      if (item !== null) {
        updatedFilters[key] = updatedFilters[key].filter((i) => i !== item); // FIX: compare directly with ID
        if (updatedFilters[key].length === 0) {
          delete updatedFilters[key];
        }
      } else {
        delete updatedFilters[key];
      }
    } else {
      delete updatedFilters[key];
    }

    removeChip(updatedFilters);
  };
  // console.log("filteres", filters);
  const handleConfirm = () => {
    if (dialogOptions?.action == "Delete") {
      onDelete(selectedRows, setVisible);
    }
    if (
      dialogOptions?.action == "Active" ||
      dialogOptions?.action == "Inactive"
    ) {
      onStatusUpdate(
        selectedRows,
        dialogOptions?.action == "Active" ? 1 : 0,
        setVisible
      );
    }
  };

  const handleConfirmCancel = () => {
    setVisible(false);
  };

  // console.log("totalRecords", totalRecords);

  const confirmHeader = (
    <>
      <span className="confirm-header-icon">
        <NoteInfoIcon />
      </span>{" "}
      <span className="confirm-header-title">Confirmation</span>
    </>
  );
  // const confirm = (position, action, type) => {
  //   confirmDialog({
  //     className: `confirm-${type}`,
  //     message: confirmMsg,
  //     header: confirmHeader,

  //     position,
  //     accept,
  //     acceptLabel: (
  //       <>
  //         {deleteLoading && (
  //           <svg
  //             width="14"
  //             height="14"
  //             viewBox="0 0 14 14"
  //             fill="none"
  //             xmlns="http://www.w3.org/2000/svg"
  //             class="p-icon p-icon-spin p-button-icon p-c p-button-loading-icon"
  //             aria-hidden="true"
  //             data-pc-section="loadingicon"
  //           >
  //             <g clip-path="url(#pr_icon_clip_2)">
  //               <path
  //                 d="M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z"
  //                 fill="currentColor"
  //               ></path>
  //             </g>
  //             <defs>
  //               <clipPath id="pr_icon_clip_2">
  //                 <rect width="14" height="14" fill="white"></rect>
  //               </clipPath>
  //             </defs>
  //           </svg>
  //         )}{" "}
  //         {action}
  //       </>
  //     ),
  //     acceptClassName: deleteLoading ? "p-disabled" : "",

  //     reject,
  //     rejectLabel: "Cancel",
  //     draggable: false,
  //     closable: false,
  //   });
  // };
  // console.log("filters table render", filters);
  const handleChange = (e) => {
    // console.log("datepicker", e.value);
    handleDateChange(e.value);
  };

  const onPageChange = (event) => {
    // console.log("event", event);
    setFirst(event.first);
    setRows(event.rows);
    onPaginationChange(event.page * 10, event.rows);
  };

  const handleEdit = () => {
    onEdit(selectedRows[0]);
  };

  // console.log("remove", remove);

  return (
    <div className="page-content-wrap list-page">
      <div className={`page-content-body ${tableScroll ? tableScroll : ""}`}>
        <div className="table-content-header">
          <div className="table-content-left d-flex align-items-center gap-4_5">
            <div className="page-content-title-wrap">
              <h5 className="page-content-title">{title || "Title Here"}</h5>
            </div>
            {selectedRows && selectedRows?.length > 0 && (
              <div className="d-flex align-items-center gap-2_3">
                {selectedRows?.length == 1 && (
                  <button className="btn-action-full" onClick={handleEdit}>
                    <img src={EditBlueIcon} alt="edit-icon" />
                    <span>Edit</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    className="btn-action-full"
                    onClick={() => {
                      setVisible(true);
                      setDialogOptions({
                        type: "danger",
                        action: "Delete",
                      });
                    }}
                  >
                    <img src={BinIcon} />
                    <span>Delete</span>
                  </button>
                )}
                {!isVisible && (
                  <>
                    <button
                      className="btn-action-full"
                      onClick={() => {
                        setVisible(true);
                        setDialogOptions({
                          type: "danger",
                          action: "Inactive",
                        });
                      }}
                    >
                      <img src={InactiveIcon} />
                      <span>Inactive</span>
                    </button>
                    <button
                      className="btn-action-full"
                      onClick={() => {
                        setVisible(true);
                        setDialogOptions({
                          type: "success",
                          action: "Active",
                        });
                      }}
                    >
                      <img src={ActiveIcon} />
                      <span>Active</span>
                    </button>
                  </>
                )}

                <Dialog
                  className={`confirm-${dialogOptions?.type}`}
                  position="bottom"
                  visible={visible}
                  closable={false}
                  draggable={false}
                  footer={
                    <>
                      <Button
                        label="Cancel"
                        onClick={handleConfirmCancel}
                        className="btn btn-text btn-text-grey"
                      />
                      <Button
                        label={dialogOptions?.action}
                        onClick={handleConfirm}
                        severity={
                          dialogOptions?.action == "Active"
                            ? "success"
                            : "danger"
                        }
                        loading={actionLoading[dialogOptions?.action]}
                      />
                    </>
                  }
                  header={
                    <>
                      <ConfirmIcon
                        color={
                          dialogOptions?.type == "success"
                            ? "#4db86b"
                            : "#e23342"
                        }
                      />
                      Confirmation
                    </>
                  }
                >
                  Are you sure ? Do you want to <b>{dialogOptions?.action}</b>{" "}
                  this record ?
                </Dialog>
              </div>
            )}
          </div>

          <div className="d-flex gap-2_3">
            <>
              {filterChip &&
                Object.entries(filterChip).map(([key, value]) => {
                  const options = filterOptions?.[key] || [];

                  // For date range (calendar)
                  if (
                    key === "calendar" &&
                    Array.isArray(value) &&
                    value.length === 2
                  ) {
                    const [from, to] = value;
                    const label = `${moment(from).format(
                      "DD MMM YYYY"
                    )} - ${moment(to).format("DD MMM YYYY")}`;

                    return (
                      <Chip
                        key={key}
                        label={label}
                        removable
                        removeIcon={
                          <div
                            className="close-chip-icon"
                            onClick={() => handleChipdelete(key)}
                          >
                            <CloseTagIcon />
                          </div>
                        }
                        className="closeable-chip"
                      />
                    );
                  }

                  // // ---- 1. MultiSelect (Array of IDs) ----
                  // if (Array.isArray(value)) {
                  //   return value.map((id) => {
                  //     const match = options.find((opt) => opt.id === id);
                  //     const label = match?.name || match?.label || id;
                  //     return (
                  //       <Chip
                  //         key={`${key}-${id}`}
                  //         label={`${label}`}
                  //         removable
                  //         removeIcon={
                  //           <div
                  //             className="close-chip-icon"
                  //             onClick={() => handleChipdelete(key, id)}
                  //           >
                  //             <CloseTagIcon />
                  //           </div>
                  //         }
                  //         className="closeable-chip"
                  //       />
                  //     );
                  //   });
                  // }

                  // // ---- 3. Text Field ----
                  // const label = value?.toString();

                  // return (
                  //   <Chip
                  //     key={key}
                  //     label={`${label}`}
                  //     removable
                  //     removeIcon={
                  //       <div className="close-chip-icon" onClick={() => handleChipdelete(key)}>
                  //         <CloseTagIcon />
                  //       </div>
                  //     }
                  //     className="closeable-chip"
                  //   />
                  // );
                })}

              {filters &&
                Object.values(filters)?.map((filterItem, index) => (
                  <Chip
                    key={index}
                    label={filterItem.label}
                    removable
                    removeIcon={
                      <div
                        className="close-chip-icon"
                        key={index}
                        onClick={() =>
                          handleChipRemove(Object.keys(filters)[index])
                        }
                      >
                        <CloseTagIcon />
                      </div>
                    }
                    className="closeable-chip"
                  ></Chip>
                ))}
            </>
            <Search onChange={handleSearch} expand={expand} value={searchValue} />
            {datepicker && (
              <Calendar
                style={{ width: "250px" }}
                value={date}
                dateFormat="dd-mm-yy"
                onChange={handleChange}
                placeholder="Select Date Range"
                selectionMode="range"
                numberOfMonths={2}
                showIcon
                iconPos={"left"}
                readOnlyInput
                icon={<img src={CalendarTimeIcon} />}
              />
            )}

            {onReport && (
              <button className={`btn-white btn-with-icon`} onClick={onReport}>
                <img src={CustomReportIcon} alt="report" />
                <span>Report</span>
              </button>
            )}
            {filterFields && (
              <Filters
                filterFields={filterFields}
                onFilterApply={handleFilter}
                filters={filters}
                remove={remove}
                selectedDateFilters={selectedDateFilters}

                // setFilters={setFilters}
              />
            )}
            <>
              {/* Display filter button if passed as prop */}
              {showFilterButton && (
                <div className="p-text-right p-mt-3">
                  <button
                    className={`btn-white btn-with-icon`}
                    onClick={onFilterButtonClick}
                  >
                    <img src={FilterIcon} alt="filter" />
                    <span>Filters</span>
                  </button>
                </div>
              )}
            </>
            {/* <button className="btn-with-icon btn-grey-white btn-brdr-transparent">
            <img src={ExportIcon} />
            <span>Export</span>
          </button>
          <button className="btn-with-icon btn-grey-white  btn-brdr-transparent">
            <img src={ImportIcon} />
            <span>Import</span>
          </button> */}
            {/* <!------ Action Menu -----!> */}
            {exportAction && (
              <button
                className="btn-with-icon btn-grey-white btn-brdr-transparent"
                onClick={() => setExportVisible(true)}
                aria-controls="popup_menu_right"
                aria-haspopup
              >
                <img src={ExportGreyIcon} />
                <span>Export</span>
              </button>
            )}
            {importAction && (
              <button
                className="btn-with-icon btn-grey-white btn-brdr-transparent"
                onClick={() => onImport()}
                aria-controls="popup_menu_right"
                aria-haspopup
              >
                <img src={ImportIconGray} />
                <span>Import</span>
              </button>
            )}
            <Menu
              model={items}
              popup
              ref={actionmenu}
              id="popup_menu_right"
              popupAlignment={"right"}
            />
            {addbtn && (
              <button
                className="btn btn-primary btn-with-icon"
                onClick={addbtn?.onClick}
              >
                {addbtn?.icon !== false && <img src={PlusIcon} />}
                <span>{addbtn?.label ?? "Add"}</span>
              </button>
            )}
            {action !== false && (
              <button
                className="btn-with-icon btn-grey-white btn-brdr-transparent"
                onClick={(event) => actionmenu.current.toggle(event)}
                aria-controls="popup_menu_right"
                aria-haspopup
              >
                <span>Actions</span>
                <img src={DropdownIcon} />
              </button>
            )}
          </div>
          {/* <!------ Action Menu -----!> */}
        </div>
        <DataTable
          className={className}
          value={data}
          tableClassName={
            data?.length == 0 || data == undefined ? "table-empty" : ""
          }
          rowClassName={
            highlightIrateCustomer
              ? (rowData) => {
                  // Check if case is irate customer (matches the same condition used in column rendering)
                  // Uses loose equality to handle both boolean true and numeric 1
                  if (rowData?.customerType?.irateCustomer == true) {
                    return "irate-customer-row";
                  }
                  return "";
                }
              : undefined
          }
          scrollable
          scrollHeight="600px"
          selectionMode={selectionMode == null ? selectionMode : "checkbox"}
          selection={selectedRows}
          onSelectionChange={handlerowSelect}
          dataKey={data?.id}
          loading={loading}
          emptyMessage={<EmptyComponent />}
          sortIcon={(options) => {
            // console.log("sort options", options?.sortOrder);
            if (options?.sortOrder == 1) {
              return <img src={AscentSortIcon} {...options.iconProps} />;
            } else if (options?.sortOrder == -1) {
              return <img src={DescentSortIcon} {...options.iconProps} />;
            } else {
              return <img src={SortIcon} {...options.iconProps} />;
            }
          }}
          isDataSelectable={isDataSelectable}
        >
          {rowSelection && (
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
            ></Column>
          )}

          {columns?.map(
            (
              { field, title, body, sorter, sortField, frozen, alignFrozen },
              index
            ) => (
              <Column
                field={field}
                header={title}
                body={body}
                sortable={sorter}
                key={index}
                frozen={frozen}
                alignFrozen={alignFrozen}
              ></Column>
            )
          )}
        </DataTable>
        {data?.length > 0 && (
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            template={paginatorTemplate}
            rowsPerPageOptions={[10, 20, 50, 100]}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default TableWrapper;
