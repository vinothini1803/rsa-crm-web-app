import React, { useState } from "react";
import {
  AddFieldIcon,
  BinIcon,
  BlackSeperatorIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DialogCloseSmallIcon,
  ReportNoteIcon,
  RightIcon,
  ImportFileBaseUrl,
} from "../../../utills/imgConstants";
import { Button } from "primereact/button";
import AvailableFields from "./AvailableFields";
import SelectedFields from "./SelectedFields";
import { Checkbox } from "primereact/checkbox";
import { InputSwitch } from "primereact/inputswitch";
import { Dialog } from "primereact/dialog";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import {
  getReportColumns,
  getReportList,
  downloadReport,
} from "../../../../services/reportService";
import { useMutation, useQuery } from "react-query";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { toast } from "react-toastify";
import { download } from "../../../utills/download";

const ReportConfiguration = ({ id, reportName }) => {
  const [visible, setVisible] = useState(false);
  const [availableList, setAvailableList] = useState([]);
  const [filterAvailableFieldList, setFilterAvailableFieldList] = useState([]);
  const [selectedFieldList, setSelectedFieldList] = useState([]);
  const [filterList, setFilterList] = useState(false);
  const [filterSelectedList, setFilterSelectedList] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [orderList, setOrderList] = useState();
  const [switchValue, setSwitchValue] = useState({ value: true, label: "AND" });
  const [searchTermAvail, setSearchTermAvail] = useState(null);
  const [searchTermSelect, setSearchTermSelect] = useState(null);
  const [showEditQuery, setShowEditQuery] = useState(false);
  const [queryFormData, setQueryFormData] = useState({});

  const { mutate, data: reportData, isLoading } = useMutation(downloadReport);
  const { data, refetch } = useQuery(
    ["getReportColumns", id],
    () => getReportColumns({ reportId: id }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        if (response?.data?.success) {
          const transformedData = response?.data?.data?.reportColumns?.map(
            (column) => ({
              id: column.id,
              name: column.displayName,
              label: column.columnName,
              checked: false, // default unchecked state
            })
          );

          setAvailableList(transformedData);
          setFilterAvailableFieldList(transformedData);
        }
      },
    }
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    resetField,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      conditions: [
        {
          columnName: "",
          conditionTypeId: "",
          inputTypeId: "",
          value: "",
          fromValue: "",
          toValue: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "conditions",
  });

  const onhandleAdd = () => {
    if (
      fields.some(
        (field, index) => watch(`conditions.${index}.columnName`) == ""
      )
    ) {
      toast.error("Please select a field");
      return;
    }
    append({
      columnName: "",
      conditionTypeId: "",
      inputTypeId: "",
      value: "",
      fromValue: "",
      toValue: "",
    });
  };

  // console.log("selectedFieldList", selectedFieldList);
  const handleSelectSearch = (value) => {
    const searchTerm = value.toLowerCase();
    setSearchTermSelect(searchTerm);
    // console.log("searchTermSelect", searchTerm);
    if (searchTerm) {
      const filteredSelectedFields = selectedFieldList.filter((field) =>
        field.name.toLowerCase().includes(searchTermSelect)
      );
      setFilterSelectedList(filteredSelectedFields);

      // console.log("filteredSelectedFields", selectedFieldList);
    } else {
      // console.log("Entered");
      setSearchTermSelect(null);
      setSelectedFieldList(selectedFieldList); // Reset to full list when search is cleared
    }
  };

  const handleSelectedRemove = (field) => {
    // Remove the field from selectedFieldList
    setSelectedFieldList((prev) => prev.filter((el) => el.id !== field.id));

    // Update availableList to mark the field as unchecked and make it visible again
    setAvailableList((prev) =>
      prev.map((el) => (el.id === field.id ? { ...el, checked: false } : el))
    );
    if (searchTermSelect) {
      setFilterSelectedList((prev) => prev.filter((el) => el.id !== field.id));
    }
  };

  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      const selectedItems = availableList.filter((field) => !field.checked);
      setSelectedFieldList((prev) => [...prev, ...selectedItems]);

      setAvailableList((prev) =>
        prev.map((field) => ({
          ...field,
          checked:
            availableList.some((visible) => visible.id === field.id) ||
            field.checked,
        }))
      );
    } else {
      const visibleIds = availableList.map((field) => field.id);
      setSelectedFieldList((prev) =>
        prev.filter((field) => !visibleIds.includes(field.id))
      );

      setAvailableList((prev) =>
        prev.map((field) =>
          visibleIds.includes(field.id) ? { ...field, checked: false } : field
        )
      );
    }
  };
  const handleChange = (id) => {
    // Update availableList by toggling the 'checked' status
    setAvailableList((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, checked: !field.checked } : field
      )
    );

    // Update selectedFieldList instantly by adding/removing the selected item
    setSelectedFieldList((prev) => {
      const isSelected = prev.some((field) => field.id === id);
      if (isSelected) {
        return prev.filter((field) => field.id !== id); // Remove from selected list
      } else {
        const selectedField = availableList.find((field) => field.id === id);
        return selectedField ? [...prev, selectedField] : prev; // Add to selected list
      }
    });
    if (searchTermAvail) {
      setFilterList((prevList) =>
        prevList.map((field) =>
          field.id === id ? { ...field, checked: !field.checked } : field
        )
      );
    }
  };

  // Handles searching within available fields
  const handleAvailableFieldSearch = (value) => {
    const searchTerm = value.toLowerCase();
    setSearchTermAvail(value);
    if (searchTerm) {
      const filteredList = availableList.filter((field) =>
        field.name.toLowerCase().includes(searchTerm)
      );
      setFilterList(filteredList);
    } else {
      // refetch();
      setSearchTermAvail(null);
      setAvailableList(availableList); // Reset availableList when search is cleared
    }
  };
  const conditionTypes = [
    { id: 1130, label: "Equals" },
    { id: 1131, label: "Not Equals" },
    { id: 1132, label: "Less Than" },
    { id: 1133, label: "Greater Than" },
    { id: 1134, label: "Between" },
    { id: 1135, label: "Less than or equal to" },
    { id: 1136, label: "Greater than or equal to" },
  ];

  const onFormSubmit = (formData) => {
    // console.log("formData", formData);
    setQueryFormData(formData);
    handlePayload(formData);
    setVisible(false);
  };

  const handlePayload = (formData) => {
    // console.log("formData", formData);
    // console.log("selectedFieldList", selectedFieldList);
    const payload = {
      reportId: Number(id), // Update dynamically if needed
      reportColumnIds: selectedFieldList?.map((item) => item?.id) || [], // Array of selected field IDs
      operator: switchValue?.label,
      conditions:
        Array.isArray(formData?.conditions) &&
        formData.conditions.length > 0 &&
        formData.conditions.some((condition) => condition?.columnName)
          ? formData.conditions
              .filter((condition) => condition?.columnName)
              ?.map((condition) => {
                // Extract the columnName and conditionTypeId for the current condition
                const choosedColumn = condition?.columnName;
                const choosedConditionType = condition?.conditionTypeId;

                // Get FilterconditionValue based on choosedColumn
                const FilterconditionValue =
                  data?.data?.data?.reportColumns?.filter(
                    (item) => choosedColumn?.id === item.id
                  );

                // Get the queryBuilderConfigs for this column
                const FilterconditionOptions =
                  FilterconditionValue?.[0]?.queryBuilderConfigs?.map(
                    (item) => item?.conditionTypeId
                  );

                // Get the inputTypeId based on the chosen conditionTypeId
                const FilterInputField =
                  FilterconditionValue?.[0]?.queryBuilderConfigs
                    .filter(
                      (inputId) =>
                        choosedConditionType?.id === inputId?.conditionTypeId
                    )
                    .map((item) => item?.inputTypeId);

                // If inputTypeId is not found, fallback to an empty string
                const inputTypeId = FilterInputField?.[0] || "";

                if (condition.fromValue && condition.toValue) {
                  return {
                    columnName: condition?.columnName?.label,
                    conditionTypeId: condition?.conditionTypeId?.id,
                    inputTypeId,
                    fromValue: moment(condition.fromValue).format("YYYY-MM-DD"),
                    toValue: moment(condition.toValue).format("YYYY-MM-DD"),
                  };
                } else {
                  return {
                    columnName: condition?.columnName?.label,
                    conditionTypeId: condition?.conditionTypeId?.id,
                    inputTypeId,
                    value:
                      inputTypeId == 1141
                        ? moment(condition.value).format("YYYY-MM-DD")
                        : condition.value, // Only send value if fromValue/toValue are empty
                  };
                }
              })
          : [],
    };

    if (
      Array.isArray(formData?.conditions) &&
      formData.conditions.length > 0 &&
      formData.conditions.some((condition) => condition?.columnName)
    ) {
      setShowEditQuery(true);
    } else {
      setShowEditQuery(false);
    }

    return payload;
  };

  const runQuery = () => {
    const payloadData = handlePayload(queryFormData); // get the built payload directly
    // console.log("payloadData", payloadData);
    mutate(
      {
        ...payloadData,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, reportName);
            }
          } else {
            if (res?.data?.error) {
              toast?.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((err) => toast?.error(err));
            }
          }
        },
      }
    );
  };

  const handleClearQuery = () => {
    remove();
    onhandleAdd();
    const queryBuilderFormData = {
      conditions: [
        {
          columnName: "",
          conditionTypeId: "",
          inputTypeId: "",
          value: "",
          fromValue: "",
          toValue: "",
        },
      ],
    };
    reset(queryBuilderFormData);
    setQueryFormData(queryBuilderFormData);
    handlePayload(queryBuilderFormData);
    setShowEditQuery(false);
  };

  return (
    <div className="configuration-container">
      {/* <div className="configuration-header">
        <div className="configuration-title">New Report Configiration</div>
        <div className="report-title-container">
          <input placeholder="Enter Report Name" />
          <div className="report-note-container">
            <img src={ReportNoteIcon} alt={"note-img"} />
            <div className="note">
              Before generating, name the report configuration.
            </div>
          </div>
        </div>
        <div className="checkbox-content">
          Use the checkboxes to select the fields you want to include in the
          export.
        </div>
      </div> */}

      <div className="configuration-body">
        <div className="row row-gap-3_4">
          <div className="col-md-12 col-lg-8">
            <div className="row">
              <div className="col-md-5">
                <div className="field-type-container">
                  <div className="field-title">Available Fields</div>
                  <AvailableFields
                    availableFields={
                      searchTermAvail ? filterList : availableList
                    }
                    onSearchChange={handleAvailableFieldSearch}
                    onChange={handleChange}
                    onSelectAll={handleSelectAll}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="field-switch-container">
                  <button className="btn btn-white">
                    <img src={ChevronRightIcon} />
                  </button>
                  <button className="btn btn-white">
                    <img src={ChevronLeftIcon} />
                  </button>
                </div>
              </div>
              <div className="col-md-5">
                <div className="field-type-container">
                  <div className="field-title">Selected Fields</div>
                  <SelectedFields
                    selectedFields={
                      searchTermSelect ? filterSelectedList : selectedFieldList
                    }
                    onSearchChange={handleSelectSearch}
                    onRemove={handleSelectedRemove}
                    setSelectedFieldList={setSelectedFieldList}
                    setOrderList={setOrderList}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4">
            <div className="field-title">Query Builder</div>
            <div className="d-flex flex-direction-col">
              <div className="query-infocontent">
                Get specific information by applying filters to extract relevant
                records.
              </div>

              {!showEditQuery && (
                <button
                  className="add-report-btn  btn-brdr-transparent"
                  onClick={() => setVisible(true)}
                  disabled={selectedFieldList.length > 0 ? false : true}
                >
                  Add Query
                </button>
              )}

              {showEditQuery && (
                <button
                  className="edit-query-btn  btn-brdr-transparent"
                  onClick={() => setVisible(true)}
                >
                  Edit Query
                  <img src={BlackSeperatorIcon} className="ms-auto" />
                </button>
              )}
            </div>
          </div>
          {/* <div className="configuration-footer"> */}
          <div className=" configuration-footer d-flex align-items-center p-1">
            <div className="d-flex report-save ms-auto">
              {/* <div className={"field"}>
                <Checkbox />
                <div className="field-name">Save Report Configuration</div>
              </div> */}
              <Button
                className="btn btn-primary"
                onClick={() => runQuery()}
                loading={isLoading}
              >
                Run Query
              </Button>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>

      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Query</div>
          </div>
        }
        className={"w-800"}
        visible={visible}
        position={"bottom"}
        onHide={() => setVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form id="query-builder" onSubmit={handleSubmit(onFormSubmit)}>
          {/* <div className="custom-switch-container">
        <div
        className={`switch-slider ${switchValue ? "and" : "or"}`}
      ></div>
      <button
        className={`custom-switch-button ${switchValue? "active" : ""}`}
        onClick={(e) => {e.preventDefault();setSwitchValue(true)}}
      >
        AND
      </button>
      <button
        className={`custom-switch-button ${!switchValue ? "active" : ""}`}
        onClick={(e) => {e.preventDefault();setSwitchValue(false)}}
      >
        OR
      </button>
    </div> */}
          <div className="custom-switch">
            <div
              className={`switch-slider ${switchValue?.value ? "and" : "or"}`}
            ></div>
            <button
              className="switch-button"
              onClick={(e) => {
                e.preventDefault();
                setSwitchValue({ value: true, label: "AND" });
              }}
            >
              AND
            </button>
            <button
              className="switch-button"
              onClick={(e) => {
                e.preventDefault();
                setSwitchValue({ value: false, label: "OR" });
              }}
            >
              OR
            </button>
          </div>
          {fields?.map((field, i) => {
            const choosedColumn = watch(`conditions.${i}.columnName`);
            // console.log("choosedColumn", choosedColumn);
            // //for obtaining condition
            // const FilterconditionValue =
            //   data?.data?.data?.reportColumns?.filter(
            //     (item) => choosedColumn?.id == item.id
            //   );
            // const FilterconditionOptions =
            //   FilterconditionValue?.[0]?.queryBuilderConfigs?.map(
            //     (item) => item?.conditionTypeId
            //   );
            // const conditionOptions = conditionTypes?.filter((item) =>
            //   FilterconditionOptions?.includes(item?.id)
            // );
            // //for obtaining input values
            // const choosedConditionType = watch(
            //   `conditions.${i}.conditionTypeId`
            // );
            // const FilterInputField =
            //   FilterconditionValue?.[0]?.queryBuilderConfigs
            //     .filter(
            //       (inputId) =>
            //         choosedConditionType?.id == inputId?.conditionTypeId
            //     )
            //     .map((item) => item?.inputTypeId);

            // For obtaining condition
            const FilterconditionValue =
              data?.data?.data?.reportColumns?.filter(
                (item) => choosedColumn?.id == item.id
              );
            const FilterconditionOptions =
              FilterconditionValue?.[0]?.queryBuilderConfigs?.map(
                (item) => item?.conditionTypeId
              );
            const conditionOptions = conditionTypes?.filter((item) =>
              FilterconditionOptions?.includes(item?.id)
            );

            // For obtaining input values
            const choosedConditionType = watch(
              `conditions.${i}.conditionTypeId`
            );
            const FilterInputField =
              FilterconditionValue?.[0]?.queryBuilderConfigs.filter(
                (inputId) =>
                  choosedConditionType?.id == inputId?.conditionTypeId
              );

            // Get the inputTypeId dynamically
            const inputTypeId = FilterInputField?.[0]?.inputTypeId;
            // console.log("inputTypeId", inputTypeId);
            return (
              <div key={i} className="dyanamicquery-field">
                <div className="field" style={{ display: "block" }}>
                  <Controller
                    name={`conditions.${i}.columnName`}
                    control={control}
                    rules={{
                      validate: (value) => {
                        if (i == 0) {
                          return true;
                        }
                        if (!value) {
                          return "Field is required";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Dropdown
                          {...field}
                          filter
                          options={filterAvailableFieldList}
                          optionLabel="name"
                          valueTemplate={(option, props) => {
                            if (!option) return props.placeholder || "";
                            return (
                              <span 
                                title={option?.name || ""}
                                style={{
                                  display: "block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: "100%"
                                }}
                              >
                                {option?.name || ""}
                              </span>
                            );
                          }}
                          itemTemplate={(option) => (
                            <span 
                              title={option?.name || ""}
                              style={{
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "100%"
                              }}
                            >
                              {option?.name || ""}
                            </span>
                          )}
                          // className="form-control"
                          className={
                            errors?.conditions?.[i]?.columnName?.message
                              ? "p-invalid form-control"
                              : "form-control"
                          }
                          placeholder="Select Field"
                          onChange={(e) => {
                            field.onChange(e.value);

                            setValue(`conditions.${i}.fromValue`, "");
                            setValue(`conditions.${i}.toValue`, "");
                            setValue(`conditions.${i}.value`, "");
                            setValue(`conditions.${i}.conditionTypeId`, "");
                            setValue(`conditions.${i}.inputTypeId`, "");
                          }}
                        />
                        <div className="p-error">
                          {errors?.conditions?.[i]?.columnName?.message || ""}
                        </div>
                      </>
                    )}
                  />
                </div>
                <div className="field" style={{ display: "block" }}>
                  <Controller
                    name={`conditions.${i}.conditionTypeId`}
                    control={control}
                    rules={{
                      validate: (value) => {
                        const colName = watch(`conditions.${i}.columnName`);
                        if (colName && !value) {
                          return "Condition is required";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Dropdown
                          {...field}
                          options={conditionOptions}
                          optionLabel="label"
                          // className="form-control"
                          className={
                            errors?.conditions?.[i]?.conditionTypeId?.message
                              ? "p-invalid form-control"
                              : "form-control"
                          }
                          placeholder="Select Condition"
                          onChange={(e) => {
                            field.onChange(e.value);

                            setValue(`conditions.${i}.fromValue`, "");
                            setValue(`conditions.${i}.toValue`, "");
                            setValue(`conditions.${i}.value`, "");
                            setValue(`conditions.${i}.inputTypeId`, "");
                          }}
                        />
                        <div className="p-error">
                          {errors?.conditions?.[i]?.conditionTypeId?.message ||
                            ""}
                        </div>
                      </>
                    )}
                  />
                </div>
                {/* Hidden Input Field for inputTypeId */}
                <Controller
                  name={`conditions.${i}.inputTypeId`}
                  control={control}
                  defaultValue={inputTypeId}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                {/* Value Input Field - Depends on inputTypeId */}
                <div>
                  {
                    // Ensure FilterInputField is valid and get the first value properly
                    inputTypeId === 1142 ? (
                      // From-To Date Picker for "Between"
                      <div className="field">
                        <Controller
                          name={`conditions.${i}.fromValue`}
                          control={control}
                          rules={{ required: "Input is required." }}
                          render={({ field, fieldState }) => (
                            <>
                              {/* {console.log("field", field)} */}
                              <Calendar
                                inputId={field.name}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.value);

                                  setValue(`conditions.${i}.toValue`, "");
                                }}
                                dateFormat="dd/mm/yy"
                                maxDate={new Date()}
                                showIcon
                                iconPos={"right"}
                                // icon={<img src={PhoneGrayIcon} />}
                                // hourFormat="12"
                                placeholder="From Date"
                                className={
                                  errors?.conditions?.[i]?.fromValue?.message
                                    ? "p-invalid"
                                    : ""
                                }
                              />
                              <div className="p-error">
                                {errors?.conditions?.[i]?.fromValue?.message ||
                                  ""}
                              </div>
                            </>
                          )}
                        />

                        <Controller
                          name={`conditions.${i}.toValue`}
                          control={control}
                          rules={{ required: "Input is required." }}
                          render={({ field, fieldState }) => (
                            <>
                              {/* {console.log("field", field)} */}
                              <Calendar
                                inputId={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                dateFormat="dd/mm/yy"
                                minDate={watch(`conditions.${i}.fromValue`)}
                                showIcon
                                iconPos={"right"}
                                placeholder="To Date"
                                className={
                                  errors?.conditions?.[i]?.toValue?.message
                                    ? "p-invalid"
                                    : ""
                                }
                              />
                              <div className="p-error">
                                {errors?.conditions?.[i]?.toValue?.message ||
                                  ""}
                              </div>
                            </>
                          )}
                        />
                      </div>
                    ) : inputTypeId === 1141 ? (
                      // Date Picker for "Created Date" or similar

                      <Controller
                        name={`conditions.${i}.value`}
                        control={control}
                        rules={{ required: "Input is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            {/* {console.log("field", field)} */}
                            <Calendar
                              inputId={field.name}
                              value={field.value}
                              onChange={field.onChange}
                              dateFormat="dd/mm/yy"
                              maxDate={new Date()}
                              showIcon
                              iconPos={"right"}
                              // icon={<img src={PhoneGrayIcon} />}
                              // hourFormat="12"
                              placeholder="Date"
                              className={
                                errors?.conditions?.[i]?.value?.message
                                  ? "p-invalid"
                                  : ""
                              }
                            />
                            <div className="p-error">
                              {errors?.conditions?.[i]?.value?.message || ""}
                            </div>
                          </>
                        )}
                      />
                    ) : (
                      // Single Text Input for other conditions
                      <Controller
                        name={`conditions.${i}.value`}
                        control={control}
                        rules={{
                          validate: (value) => {
                            const colName = watch(
                              `conditions.${i}.conditionTypeId`
                            );
                            if (colName && !value) {
                              return "Input is required";
                            }
                            return true;
                          },
                        }}
                        render={({ field }) => (
                          <>
                            <input
                              type="text"
                              {...field}
                              className={
                                errors?.conditions?.[i]?.value?.message
                                  ? "p-invalid form-control"
                                  : "form-control"
                              }
                              placeholder="Enter Value"
                            />
                            <div className="p-error">
                              {errors?.conditions?.[i]?.value?.message || ""}
                            </div>
                          </>
                        )}
                      />
                    )
                  }
                </div>

                <div className={`${i == 0 ? "remove-hidden" : ""}`}>
                  <button
                    onClick={() => remove(i)}
                    className="btn-link btn-text btn-with-icon"
                  >
                    <img src={BinIcon} />
                  </button>
                </div>
              </div>
            );
          })}

          {fields?.length !== 5 && (
            <button
              className="btn-link btn-text btn-with-icon mechanic-btn"
              onClick={onhandleAdd}
              type="button"
            >
              <img src={AddFieldIcon} />
              Add Condition
            </button>
          )}

          <div className="savequery-footer">
            <Button
              type="button"
              form="query-builder"
              onClick={handleClearQuery}
            >
              Clear Query
            </Button>
            <Button className="ms-auto" type="submit" form="query-builder">
              Save Query
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ReportConfiguration;
