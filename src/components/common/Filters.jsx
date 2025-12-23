import React, { useCallback, useMemo, useRef } from "react";
import { FilterIcon } from "../../utills/imgConstants";
import { OverlayPanel } from "primereact/overlaypanel";
import { useForm, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { InputText } from "primereact/inputtext";

const Filters = ({
  className,
  onFilterApply,
  filters,
  filter,
  filterFields,
  filterIcon,
  btnClassName,
  remove,
  selectedDateFilters,
}) => {
  const defaultValues = {
    city: "",
    status: "",
    date: filterFields?.filterFields?.includes("refDate")
      ? selectedDateFilters.startDate && selectedDateFilters.endDate
        ? [
            moment(selectedDateFilters.startDate).toDate(),
            moment(selectedDateFilters.endDate).toDate(),
          ]
        : ""
      : filterFields?.filterFields?.includes("date")
      ? [moment().startOf("month").toDate(), moment().endOf("month").toDate()]
      : "",
    service: "",
    activityStatus: "",
    dealer: "",
    designation: "",
    role: "",
    team: "",
    distance: "",
    period: "",
    asp_id: "",
    caseStatusId: "",
    transactionTypeId: "",
    paymentStatusId: "",
    utrNumber: "",
    state: "",
    subjectId: "",
    clientId: "",
    dispositionId: "",
    roleId: "",
  };

  const {
    control,
    formState: { errors, isSubmitted, submitCount },
    handleSubmit,
    reset,
    setValue,
    resetField,
  } = useForm({ defaultValues });
  const overlaypanel = useRef(null);

  const onSubmit = (values) => {
    // console.log("values", values, Object.entries(values));

    const FilterdItems = Object.fromEntries(
      Object.entries(values)
        .filter(([key, value]) => value !== "" && value !== undefined)
        .map(([key, value], index) => {
          if (Array.isArray(value)) {
            return [
              key,
              {
                label: `${moment(value[0]).format("DD MMM YYYY")} - ${moment(
                  value[1]
                ).format("DD MMM YYYY")}`,
                value: value,
              },
            ];
          } else if (typeof value == "string") {
            return [key, { label: value, value: value }];
          } else {
            return [key, value];
          }
        })
    );

    // console.log("FilterdItems", FilterdItems);

    onFilterApply(FilterdItems);
    overlaypanel.current.hide();
  };

  const handleClearFilter = () => {
    onFilterApply({});
    overlaypanel.current.hide();
    reset({ ...defaultValues, date: "" });
  };

  //To reset form after tag remove ---->the field name should be in defaultValues
  useMemo(() => {
    // console.log("remove on filter", remove, filters);
    if (remove !== null) {
      const Fields = Object.keys(defaultValues || {}).filter(
        (allfilter) =>
          !Object.keys(filters || {}).some((filter) => allfilter == filter)
      );
      if (Fields) {
        // console.log("form resetted fields", Fields);

        Fields.forEach((field) =>
          field == "date" ? setValue(field, "") : resetField(field)
        );
      }
    }
  }, [remove]);
  return (
    <div className={`filter-container ${className ? className : ""}`}>
      <button
        className={`btn-white btn-with-icon ${btnClassName}`}
        onClick={(e) => overlaypanel.current.toggle(e)}
      >
        <img src={filterIcon ? filterIcon : FilterIcon} alt="filter" />
        <span>Filters</span>
      </button>
      <OverlayPanel ref={overlaypanel}>
        <div className="filter-header">
          <div className="filter-title">Filters</div>
          <div className="filter-clear" onClick={handleClearFilter}>
            Clear Filters
          </div>
        </div>
        <div className="filter-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex flex-column gap-3_4">
              {filterFields?.filterFields?.includes("service") && (
                <div className="form-group">
                  <label className="form-label filter-label">Service</label>
                  <Controller
                    name="service"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        filter
                        optionLabel="label"
                        className="form-control-select"
                        placeholder="Select a service"
                        onChange={(e) => field.onChange(e.value)}
                        options={filterFields?.filterData?.service}
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields?.includes("activityStatus") && (
                <div className="form-group">
                  <label className="form-label filter-label">
                    Activity Status
                  </label>
                  <Controller
                    name="activityStatus"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        filter
                        className="form-control-select"
                        optionLabel="label"
                        placeholder="Select a Status"
                        onChange={(e) => field.onChange(e.value)}
                        options={filterFields?.filterData?.activityStatus}
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields?.includes("caseStatus") && (
                <div className="form-group">
                  <label className="form-label filter-label">Case Status</label>
                  <Controller
                    name="caseStatusId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        filter
                        className="form-control-select"
                        optionLabel="label"
                        placeholder="Select a Status"
                        onChange={(e) => field.onChange(e.value)}
                        options={filterFields?.filterData?.caseStatus}
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields?.includes("dealer") && (
                <div className="form-group">
                  <label className="form-label filter-label">Dealer</label>
                  <Controller
                    name="dealer"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        filter
                        className="form-control-select"
                        optionLabel="label"
                        placeholder="Select a Dealer Code"
                        onChange={(e) => field.onChange(e.value)}
                        options={filterFields?.filterData?.dealers}
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields?.includes("date") && (
                <div className="form-group">
                  <label className="form-label filter-label">
                    Requested Date
                  </label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field, fieldState }) => {
                      // console.log("field", field);
                      return (
                        <Calendar
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          selectionMode="range"
                          numberOfMonths={2}
                          showIcon
                          iconPos={"left"}
                          readOnlyInput
                          placeholder="Select Date"
                          dateFormat="dd/mm/yy"
                        />
                      );
                    }}
                  />
                </div>
              )}

              {filterFields?.filterFields?.includes("refDate") && (
                <div className="form-group">
                  <label className="form-label filter-label">
                    Requested Date
                  </label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field, fieldState }) => {
                      // console.log("field", field);
                      return (
                        <Calendar
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          selectionMode="range"
                          numberOfMonths={2}
                          showIcon
                          iconPos={"left"}
                          readOnlyInput
                          placeholder="Select Date"
                          dateFormat="dd/mm/yy"
                        />
                      );
                    }}
                  />
                </div>
              )}

              {filterFields?.filterFields.includes("role") && (
                <div className="form-group">
                  <label className="form-label filter-label">Role</label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        optionLabel="label"
                        filter
                        className="form-control-select"
                        placeholder="Select a status"
                        onChange={(e) => field.onChange(e.value)}
                        options={[
                          {
                            status: "Active",
                            label: "Active",
                          },
                          {
                            status: "InActive",
                            label: "Inactive",
                          },
                        ]}
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields.includes("team") && (
                <div className="form-group">
                  <label className="form-label filter-label">Team</label>
                  <Controller
                    name="team"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        optionLabel="label"
                        filter
                        className="form-control-select"
                        placeholder="Select a status"
                        onChange={(e) => field.onChange(e.value)}
                        options={[
                          {
                            status: "Active",
                            label: "Active",
                          },
                          {
                            status: "InActive",
                            label: "Inactive",
                          },
                        ]}
                      />
                    )}
                  />
                </div>
              )}

              {filterFields?.filterFields.includes("Distance") && (
                <div className="form-group">
                  <label className="form-label filter-label">Distance</label>
                  <Controller
                    name="distance"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        filter
                        className="form-control-select"
                        optionLabel="label"
                        placeholder="Select a Distance"
                        onChange={(e) => field.onChange(e.value)}
                        options={filterFields?.filterData?.distance}
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields.includes("roleId") && (
                <div className="form-group">
                  <label className="form-label filter-label">Role</label>
                  <Controller
                    name="roleId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        filter
                        className="form-control-select"
                        optionLabel="label"
                        placeholder="Select a Role"
                        onChange={(e) => field.onChange(e.value)}
                        options={filterFields?.filterData?.roleId}
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields.includes("ASP") && (
                <div className="form-group">
                  <label className="form-label filter-label">ASP</label>
                  <Controller
                    name="asp_id"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        {...field}
                        className="form-control"
                        value={field.value}
                        placeholder="Enter ASP Name/Code"
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields.includes("dateRange") && (
                <div className="form-group">
                  <label className="form-label filter-label">Date</label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field, fieldState }) => {
                      // console.log("calendar date", field);
                      return (
                        <Calendar
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          selectionMode="range"
                          numberOfMonths={2}
                          dateFormat="dd/mm/yy"
                          showIcon
                          iconPos={"left"}
                          placeholder="Select Date"
                        />
                      );
                    }}
                  />
                </div>
              )}
              {filterFields?.filterFields?.includes("paymentdate") && (
                <div className="form-group">
                  <label className="form-label filter-label">Date</label>
                  <Controller
                    name="period"
                    control={control}
                    render={({ field, fieldState }) => {
                      // console.log("field", field);
                      return (
                        <Calendar
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          selectionMode="range"
                          numberOfMonths={2}
                          showIcon
                          iconPos={"left"}
                          readOnlyInput
                          placeholder="Select Date"
                          dateFormat="dd/mm/yy"
                        />
                      );
                    }}
                  />
                </div>
              )}

              {filterFields?.filterFields?.includes("transactiontype") && (
                <div className="form-group">
                  <label className="form-label filter-label">
                    Select Transaction Type
                  </label>
                  <Controller
                    name="transactionTypeId"
                    control={control}
                    render={({ field, fieldState }) => {
                      // console.log("calendar date", field);
                      return (
                        <Dropdown
                          value={field.value}
                          filter
                          className="form-control-select"
                          optionLabel="label"
                          // optionValue="value"
                          placeholder="Select Transaction Type"
                          onChange={(e) => field.onChange(e.value)}
                          options={filterFields?.filterData?.transactiontype}
                        />
                      );
                    }}
                  />
                </div>
              )}
              {filterFields?.filterFields?.includes("paymentstauts") && (
                <div className="form-group">
                  <label className="form-label filter-label">
                    Select Payment Status
                  </label>
                  <Controller
                    name="paymentStatusId"
                    control={control}
                    render={({ field, fieldState }) => {
                      // console.log("calendar date", field);
                      return (
                        <Dropdown
                          value={field.value}
                          filter
                          className="form-control-select"
                          optionLabel="label"
                          //optionValue="value"
                          placeholder="Select Payment Status"
                          onChange={(e) => field.onChange(e.value)}
                          options={filterFields?.filterData?.paymentstauts}
                        />
                      );
                    }}
                  />
                </div>
              )}
              {filterFields?.filterFields?.includes("utrno") && (
                <div className="form-group">
                  <label className="form-label filter-label">UTR Number</label>
                  <Controller
                    name="utrNumber"
                    control={control}
                    render={({ field, fieldState }) => {
                      // console.log("calendar date", field);
                      return (
                        <InputText placeholder="Enter UTR Number" {...field} />
                      );
                    }}
                  />
                </div>
              )}
              {filterFields?.filterFields?.includes("state") && (
                <div className="form-group">
                  <label className="form-label filter-label">State</label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        filter
                        optionLabel="label"
                        className="form-control-select"
                        placeholder="Select a State"
                        onChange={(e) => field.onChange(e.value)}
                        options={filterFields?.filterData?.state}
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields.includes("activestatus") && (
                <div className="form-group">
                  <label className="form-label filter-label">Status</label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        filter
                        className="form-control-select"
                        optionLabel="label"
                        placeholder="Select a Status"
                        onChange={(e) => field.onChange(e.value)}
                        options={[
                          {
                            label: "Active",
                            code: 1,
                          },
                          {
                            label: "Inactive",
                            code: 0,
                          },
                        ]}
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields.includes("subject") && (
                <div className="form-group">
                  <label className="form-label filter-label">Subject</label>
                  <Controller
                    name="subjectId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        filter
                        optionLabel="label"
                        className="form-control-select"
                        placeholder="Select a Subject"
                        onChange={(e) => field.onChange(e.value)}
                        options={filterFields?.filterData?.subject}
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields.includes("account") && (
                <div className="form-group">
                  <label className="form-label filter-label">Account</label>
                  <Controller
                    name="clientId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        filter
                        optionLabel="label"
                        className="form-control-select"
                        placeholder="Select a Account"
                        onChange={(e) => field.onChange(e.value)}
                        options={filterFields?.filterData?.account}
                      />
                    )}
                  />
                </div>
              )}
              {filterFields?.filterFields.includes("disposition") && (
                <div className="form-group">
                  <label className="form-label filter-label">Disposition</label>
                  <Controller
                    name="dispositionId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        filter
                        optionLabel="label"
                        className="form-control-select"
                        placeholder="Select a Disposition"
                        onChange={(e) => field.onChange(e.value)}
                        options={filterFields?.filterData?.disposition}
                      />
                    )}
                  />
                </div>
              )}
              <button
                className="btn btn-primary filter-apply-btn gap-3_4"
                type="submit"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default Filters;
