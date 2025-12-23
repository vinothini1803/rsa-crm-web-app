import { Dialog } from "primereact/dialog";
import React from "react";
import {
  DialogCloseSmallIcon,
  ExportDialogIcon,
} from "../../utills/imgConstants";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import moment from "moment";
import { Dropdown } from "primereact/dropdown";

const ExportDialog = ({
  visible,
  setVisible,
  loading,
  onSubmit,
  formats,
  status,
  transactionType,
  dateRangeOptional = false,
}) => {
  const defaultValues = {
    format: "",
    date: "",
    status: "",
    transactionType: "",
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const onFormSubmit = (values) => {
    console.log("values", values);
    const submitData = {
      format: values?.format ? values?.format : formats,
      ...(status && { status: values?.status }),
      ...(transactionType && { transactionType: values?.transactionType }),
    };
    
    // Only include date range if provided
    if (values?.date && values?.date[0] && values?.date[1]) {
      submitData.startDate = moment(values?.date[0]).format("YYYY-MM-DD");
      submitData.endDate = moment(values?.date[1]).format("YYYY-MM-DD");
    }
    
    onSubmit(submitData, reset);
  };
  const handleChange = (e, field) => {
    if (e.checked) {
      field.onChange(e.value);
    } else {
      field.onChange("");
    }

    console.log("checkbox value", e);
  };
  console.log("formats", formats);
  return (
    <Dialog
      header={
        <div className="dialog-header">
          <img src={ExportDialogIcon} />
          <div className="dialog-header-title">Export</div>
        </div>
      }
      pt={{
        root: { className: "w-480" },
      }}
      visible={visible}
      position={"bottom"}
      onHide={() => {
        setVisible(false);
        reset();
      }}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="row row-gap-3_4">
          {!formats && (
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Export As</label>
                <Controller
                  name="format"
                  control={control}
                  rules={{ required: "Export As is required" }}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <div className="export-checkbox-group">
                          {(!formats || formats.includes("csv")) && (
                            <div className="common-checkbox-item">
                              <></>
                              <Checkbox
                                inputId="csv"
                                name="csv"
                                value="csv"
                                checked={field.value == "csv"}
                                onChange={(e) => handleChange(e, field)}
                              />
                              <label
                                htmlFor="csv"
                                className="common-checkbox-label"
                              >
                                CSV (Comma Separated Value)
                              </label>
                            </div>
                          )}
                          {/*   <div className="common-checkbox-item">
                        <Checkbox
                          inputId="xls"
                          name="xls"
                          value="xls"
                          checked={field.value == "xls"}
                          onChange={(e) => {
                            console.log("e", e);
                            field.onChange(e.value);
                          }}
                        />
                        <label htmlFor="xls" className="common-checkbox-label">
                          XLS (Microsoft Excel 1997-2004 Compatible)
                        </label>
                      </div> */}
                          <div className="common-checkbox-item">
                            <Checkbox
                              inputId="xlsx"
                              name="xlsx"
                              value="xlsx"
                              checked={field.value == "xlsx"}
                              onChange={(e) => handleChange(e, field)}
                            />
                            <label
                              htmlFor="xlsx"
                              className="common-checkbox-label"
                            >
                              XLSX (Microsoft Excel )
                            </label>
                          </div>
                        </div>
                        <div className="p-error">
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    );
                  }}
                />
              </div>
            </div>
          )}
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label">Date Range{dateRangeOptional ? " (Optional)" : ""}</label>
              <Controller
                name="date"
                control={control}
                rules={dateRangeOptional ? {} : { required: "Date Range is required" }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <Calendar
                        dateFormat="dd-mm-yy"
                        onChange={field.onChange}
                        value={field.value}
                        placeholder="Select Date Range"
                        selectionMode="range"
                        numberOfMonths={2}
                        showIcon
                        iconPos={"left"}
                        readOnlyInput
                      />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  );
                }}
              />
            </div>
          </div>
          {status && (
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label filter-label">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      //filter
                      className="form-control-select"
                      optionLabel="name"
                      placeholder="Select a Status"
                      onChange={(e) => field.onChange(e.value)}
                      options={status}
                    />
                  )}
                />
              </div>
            </div>
          )}

          {transactionType && (
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label filter-label">
                  Transaction Type
                </label>
                <Controller
                  name="transactionType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      className="form-control-select"
                      optionLabel="name"
                      placeholder="Select a Transaction Type"
                      onChange={(e) => field.onChange(e.value)}
                      options={transactionType}
                    />
                  )}
                />
              </div>
            </div>
          )}
        </div>
        <Button
          className="form-submit-btn mt-4"
          type="submit"
          loading={loading}
        >
          Export
        </Button>
      </form>
    </Dialog>
  );
};

export default ExportDialog;
