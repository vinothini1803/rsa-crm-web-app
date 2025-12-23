import React, { useState, useEffect } from "react";
import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import { CloseIcon, ImportFileBaseUrl } from "../../utills/imgConstants";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import DragDropFieldList from "../../components/common/DragDropFieldList";
import ReportFieldsList from "../../components/common/ReportFieldsList";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
  checkreportColumnsList,
  checkCaseReport,
} from "../../../services/deliveryRequestService";
import { client, dealer } from "../../../services/masterServices";
// import { aspList } from "../../../services/adminService";
import { download } from "../../utills/download";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";

const CustomReport = () => {
  const [reportFields, setReportFields] = useState([]);
  const [selectedRange, setSelectedRange] = useState();
  const [filteredAllFields, setFilteredAllFields] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchReportQuery, setSearchReportQuery] = useState("");
  const [allReportFields, setAllReportFields] = useState([]);
  const navigate = useNavigate();
  const user = useSelector(CurrentUser);

  const Ranges = [
    {
      label: "Today",
      dateRange: [moment().startOf("day").toDate()],
    },
    {
      label: "This Week",
      dateRange: [
        moment().startOf("week").toDate(),
        moment().endOf("week").toDate(),
      ],
    },
    {
      label: "This Month",
      dateRange: [
        moment().startOf("month").toDate(),
        moment().endOf("month").toDate(),
      ],
    },
    {
      label: "Clear",
    },
  ];
  /*   const { data: aspOptionsData } = useQuery(["aspList"], () =>
    aspList({
      limit: 100,
      offset: 0,
      status: "Active",
      apiType: "dropdown",
    })
  ); */

  const {
    data: reportColumnListData,
    isFetching,
    refetch,
  } = useQuery(
    ["checkreportColumnsList"],
    () =>
      checkreportColumnsList({
        filter: true,
      }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          setAllFields(
            res?.data?.data.map((item) => ({
              id: item.id,
              name: item.columnName,
            }))
          );
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    }
  );

  const defaultValues = {
    columns: [],
    // asps: [],
  };

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });
  const handleClose = () => {
    navigate("/delivery-request");
  };

  const MenuItems = [
    {
      label: <div onClick={handleClose}>Delivery Requests</div>,
    },
    { label: <div className="text-caps">Reports</div> },
  ];

  const { mutate, isLoading } = useMutation(checkCaseReport);

  const onFormSubmit = (values) => {
    console.log("values", values);
    if (!allReportFields || allReportFields.length === 0) {
      toast.error("Columns are required to download report.");
      return;
    }
    const agentIds = user?.role?.id == 3 ? [user?.id] : [];
    const dealerIds = user?.role?.id == 2 ? [user?.entityId] : [];
    // const aspIds = Array.isArray(values.asps) ? values.asps : values.asps ? [values.asps.id] : [];
    const startDate = values.date ? moment(values.date[0]).format() : "";
    const endDate = values.date
      ? values.date[1]
        ? moment(values.date[1]).format()
        : moment(values.date[0]).format()
      : "";
    const columnIds = allReportFields
      .filter((field) => !allFields.some((f) => f.id === field.id))
      .map((field) => field.id);

    mutate(
      {
        columns: columnIds,
        // asps: aspIds,
        startDate: startDate,
        endDate: endDate,
        agents: agentIds,
        dealers: dealerIds,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            refetch();
            if (res?.data?.path) {
              console.log(res?.data?.path, "res?.data?.path");
              download(
                `${ImportFileBaseUrl}${res?.data?.path}`,
                "customReport"
              );
            }
            setReportFields([]);
            reset();
          } else {
            if (res?.data?.errors) {
              toast.error(res?.data?.errors);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleReportFieldChange = (id) => {
    console.log("allFields", allFields, id);
    const selectedField = allFields.find((field) => field.id === id);
    const updatedAllFields = allFields.filter((field) => field.id !== id);
    console.log("updatedAllFields", updatedAllFields);
    setAllFields(updatedAllFields);
    const selectedFieldToAdd = [
      { ...selectedField, checked: true },
      ...reportFields,
    ];
    setReportFields(selectedFieldToAdd);
    setAllReportFields(selectedFieldToAdd);
    setValue(
      "columns",
      selectedFieldToAdd?.map((item) => item.id)
    );
  };

  console.log(allReportFields, "hereallReportFields");

  const handleAllFieldSearch = (value) => {
    console.log(value, "value");
    setSearchQuery(value);
    const filteredAll = reportColumnListData?.data?.data
      .filter((el) => el.columnName.toLowerCase().includes(value.toLowerCase()))
      .filter((item) => !reportFields.some((sel) => sel.id === item.id))
      ?.map((item) => {
        return {
          id: item.id,
          name: item.columnName,
          checked: false,
        };
      });
    setAllFields(
      value !== ""
        ? filteredAll
        : reportColumnListData?.data?.data
            .filter((item) => !reportFields.some((sel) => sel.id == item.id))
            ?.map((el) => ({
              id: el.id,
              name: el.columnName,
            }))
    );
  };

  const handleSelectFieldChange = (index, field) => {
    const selectedField = reportFields[index];
    const updatedReportFields = [...reportFields];
    updatedReportFields.splice(index, 1);
    const { checked, ...selectedFieldWithoutChecked } = selectedField;
    setReportFields(updatedReportFields);
    setAllFields([selectedFieldWithoutChecked, ...allFields]);
    field.onChange(updatedReportFields?.map((field) => field.id));
  };

  const areArraysEqual = (arr1, arr2) => {
    if (arr1?.length !== arr2?.length) {
      return false;
    }

    for (let i = 0; i < arr1?.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  };

  const handleReportFieldSearch = (value) => {
    setSearchReportQuery(value);
    console.log(allReportFields, "all");
    const filteredFields = allReportFields
      .filter((el) => el.name.toLowerCase().includes(value.toLowerCase()))
      .filter((item) => !allFields.some((sel) => sel.id === item.id));
    setReportFields(
      value !== ""
        ? filteredFields
        : allFields?.length == 0
        ? allReportFields
        : reportColumnListData?.data?.data
            .filter((item) => !allFields.some((sel) => sel.id == item.id))
            ?.map((el) => ({
              id: el.id,
              name: el.columnName,
              checked: true,
            }))
    );
  };
  console.log(reportFields, "results");
  console.log(allFields, "allFields");
  const handleSelectAll = () => {
    setReportFields(
      reportColumnListData?.data?.data?.map((item) => {
        return {
          id: item.id,
          name: item.columnName,
          checked: true,
        };
      })
    );
    setValue(
      "columns",
      reportColumnListData?.data?.data?.map((item) => item.id)
    );
    setAllFields([]);
    setAllReportFields(
      reportColumnListData?.data?.data?.map((item) => {
        return {
          id: item.id,
          name: item.columnName,
          checked: true,
        };
      })
    );
  };

  const handleUnSelectAll = () => {
    setAllFields(
      reportColumnListData?.data?.data?.map((item) => {
        return {
          id: item.id,
          name: item.columnName,
        };
      })
    );
    setValue("columns", []);
    setReportFields([]);
  };
  console.log(reportFields, "reportFields");
  const handleClearDate = () => {
    setValue("date", []);
  };

  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page without-step">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="d-flex gap-1_2 align-items-center">
                  <h5 className="page-content-title text-caps">Report</h5>
                </div>
              </div>
              <div className="page-content-header-right">
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
          </div>
          <div className="page-content-body">
            <form onSubmit={handleSubmit(onFormSubmit)} id="formName">
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label filter-label">Date</label>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <Calendar
                            value={field.value}
                            onChange={(e) => {
                              console.log(
                                "today selection",
                                e.value
                                  ?.filter((sel) => sel !== null)
                                  ?.map((el) => moment(el).format("DD-MM-YYYY"))
                                  ?.every(
                                    (item) =>
                                      item ==
                                      moment()
                                        .startOf("day")
                                        .format("DD-MM-YYYY")
                                  )
                              );
                              field.onChange(e.value);
                              setSelectedRange(() => {
                                return e.value
                                  ?.filter((sel) => sel !== null)
                                  ?.map((el) => moment(el).format("DD-MM-YYYY"))
                                  ?.every(
                                    (item) =>
                                      item ==
                                      moment()
                                        .startOf("day")
                                        .format("DD-MM-YYYY")
                                  )
                                  ? 0
                                  : Ranges.findIndex((el) => {
                                      return areArraysEqual(
                                        el.dateRange?.map((el) =>
                                          moment(el).format("DD-MM-YYYY")
                                        ),
                                        e.value?.map((el) => {
                                          return moment(el).format(
                                            "DD-MM-YYYY"
                                          );
                                        })
                                      );
                                    });
                              });
                            }}
                            pt={{
                              panel: {
                                className: "defined-rangepicker",
                              },
                            }}
                            selectionMode="range"
                            numberOfMonths={2}
                            showIcon
                            iconPos={"left"}
                            readOnlyInput
                            placeholder="Select Date"
                            dateFormat="dd/mm/yy"
                            footerTemplate={() => {
                              return (
                                <div className="rangecontainer">
                                  {Ranges?.map((range, i) => {
                                    return (
                                      <div
                                        key={i}
                                        onClick={() => {
                                          if (range.clearDate) {
                                            handleClearDate();
                                          } else {
                                            field.onChange(range.dateRange);
                                            setSelectedRange(i);
                                          }
                                        }}
                                        className={`rangelabel ${
                                          selectedRange === i ? "selected" : ""
                                        }`}
                                      >
                                        {range?.label}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
                {/* {user?.role?.id === 1 ||
                  user?.role?.id === 3 ||
                  user?.role?.id === 7 ? (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label">ASP</label>
                      <Controller
                        name="asps"
                        control={control}
                        rules={{ required: "" }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              value={field.value}
                              filter
                              placeholder="Select"
                              className="form-control-select"
                              options={aspOptionsData?.data?.data}
                              optionLabel={(option) => `${option.code} - ${option.name.length > 10 ? option.name.substring(0, 10) + "..." : option.name}`}
                              onChange={(e) => field.onChange(e.value)}
                              showClear={field.value.length !== 0}
                            />
                            <div className="p-error">
                              {errors && errors[field.name]?.message}
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>
                ) : null} */}

                <div className="col-md-3"></div>
                <div className="font-md fnt-sbd">Report Headers</div>
                <div className="col-md-5 col-xxl-3">
                  <div className="form-group">
                    <label className="form-label required">
                      Select fields to add
                    </label>
                    <ReportFieldsList
                      allFields={allFields}
                      onChange={handleReportFieldChange}
                      onSearchChange={handleAllFieldSearch}
                      onSelectAll={handleSelectAll}
                      searchQuery={searchQuery}
                    />
                  </div>
                </div>
                <div className="col-md-5 col-xxl-3">
                  <div className="form-group">
                    <label className="form-label required">
                      Fields in report
                    </label>
                    <Controller
                      name="columns"
                      rules={""}
                      control={control}
                      render={({ field, fieldState }) => {
                        return (
                          <>
                            <DragDropFieldList
                              fields={reportFields}
                              setReportFields={setReportFields}
                              setAllReportFields={setAllReportFields}
                              onSearchChange={handleReportFieldSearch}
                              onChange={(index) =>
                                handleSelectFieldChange(index, field)
                              }
                              onUnSelectAll={handleUnSelectAll}
                              searchQuery={searchReportQuery}
                            />{" "}
                            <div className="p-error">
                              {errors && errors[field.name]?.message}
                            </div>
                          </>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary"
                  type="submit"
                  form="formName"
                  loading={isLoading}
                >
                  Download Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomReport;
