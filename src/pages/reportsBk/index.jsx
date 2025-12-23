import React, { useState } from "react";
import DashBoardMenuItem from "../../components/common/DashBoardMenuItem";
import { MenuList } from "../../utills/menuList";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import {
  CalendarTimeIcon,
  DialogCloseSmallIcon,
} from "../../utills/imgConstants";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
const ReportHomeBk = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(null);
  const [reportLabel, setReportLabel] = useState("");
  const defaultValues = {
    daterange: "",
    callcenter: "",
    client_name: "",
    state: "",
    nearst_city_district: "",
    location_category: "",
    asp_status: "",
    case_id: "",
  };
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });
  const Allmenu = MenuList?.map((el) => el.menus);
  const ReportSubmenu = Allmenu?.flat()?.find(
    (el) => el.code == "reports"
  ).submenus;

  // form Submittion
  const handleFormSubmit = (values) => {
    console.log("formValues", values);
    if (values) {
      setVisible(false);
      reset(defaultValues);
      toast.success(" Submitted Successfully", {
        autoClose: 1000,
      });
    }
  };

  const handleMenuClick = (e, label) => {
    setReportLabel(label);
    setVisible(true);
    console.log("others");
  };
  console.log("reportLabel", reportLabel);
  return (
    <div className="page-wrap">
      <div className="page-body">
        <div className="border-box bg-white border-transparent">
          <div className="dashboard-content-scroll">
            <div className="row gy-4">
              {ReportSubmenu?.map(({ label, description, icon, url }, i) => (
                <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6" key={i}>
                  <DashBoardMenuItem
                    title={label}
                    description={description}
                    icon={icon}
                    onClick={(e) => handleMenuClick(e, label)}
                    {...(label == "ASP Sync Calls" && { link: url })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">{reportLabel}</div>
          </div>
        }
        className={
          reportLabel == "Login / Logout Report" ||
          reportLabel == "Attendance Report" ||
          reportLabel == "Mechanic Status Report" ||
          reportLabel == "ASP Portal Report" ||
          reportLabel == "Interaction Report"
            ? "w-372"
            : reportLabel == "Summary Report"
            ? ""
            : "w-460"
        }
        visible={visible}
        position={"bottom"}
        onHide={() => setVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row row-gap-3_4">
            {reportLabel !== "Interaction Report" && (
              <>
                <div
                  className={`${
                    reportLabel == "Summary Report" ? "col-md-3" : "col-md-12"
                  }`}
                >
                  <div className="form-group">
                    <label className="form-label">Date Range</label>
                    <Controller
                      name="daterange"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Calendar
                            value={date}
                            dateFormat="dd-mm-yy"
                            onChange={(e) => setDate(e.value)}
                            placeholder="Select start and end Date"
                            selectionMode="range"
                            numberOfMonths={2}
                            showIcon
                            {...field}
                            iconPos={"left"}
                            readOnlyInput
                            icon={<img src={CalendarTimeIcon} />}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
              </>
            )}
            {(reportLabel == "Reminder Report" ||
              reportLabel == "Client Report" ||
              reportLabel == "Financial Report" ||
              reportLabel == "ASP Accept / Reject Report" ||
              reportLabel == "Client Report With Mobile Number" ||
              reportLabel == "Auto Allocated ASP" ||
              reportLabel == "Delivery Request Report" ||
              reportLabel == "Summary Report") && (
              <>
                <div
                  className={`${
                    reportLabel == "Summary Report" ? "col-md-3" : "col-md-12"
                  }`}
                >
                  <div className="form-group">
                    <label className="form-label">Call Centre </label>
                    <Controller
                      name="callcenter"
                      control={control}
                      rules={{ required: "Call Centre is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            {...field}
                            value={field.value}
                            placeholder="Select Call Centre"
                            options={[
                              { label: "Center 1", value: "center1" },
                              { label: "Center 2", value: "center2" },
                            ]}
                            optionLabel="label"
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              </>
            )}
            {(reportLabel == "Client Report" ||
              reportLabel == "Client Report With Mobile Number" ||
              reportLabel == "Auto Allocated ASP" ||
              reportLabel == "Summary Report") && (
              <div
                className={`${
                  reportLabel == "Summary Report" ? "col-md-3" : "col-md-12"
                }`}
              >
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <Controller
                    name="client_name"
                    control={control}
                    rules={{ required: "Client Name is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Client Name"
                          options={[
                            { label: "Center 1", value: "center1" },
                            { label: "Center 2", value: "center2" },
                          ]}
                          {...field}
                          optionLabel="label"
                          onChange={(e) => field.onChange(e.value)}
                        />
                        <div className="p-error">
                          {/* {errors[field.name]?.message} */}
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            )}

            {reportLabel == "Summary Report" && (
              <>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <Controller
                      name="state"
                      control={control}
                      rules={{ required: "State is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            {...field}
                            value={field.value}
                            placeholder="Select State"
                            options={[
                              { label: "Center 1", value: "center1" },
                              { label: "Center 2", value: "center2" },
                            ]}
                            optionLabel="label"
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Nearest City/District</label>
                    <Controller
                      name="nearst_city_district"
                      control={control}
                      rules={{ required: "Nearest City/District is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            {...field}
                            value={field.value}
                            placeholder="Select Nearest City/District"
                            options={[
                              { label: "Center 1", value: "center1" },
                              { label: "Center 2", value: "center2" },
                            ]}
                            optionLabel="label"
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Location Category</label>
                    <Controller
                      name="location_category"
                      control={control}
                      rules={{ required: "Location Category is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            {...field}
                            value={field.value}
                            placeholder="Select Location Category"
                            options={[
                              { label: "Center 1", value: "center1" },
                              { label: "Center 2", value: "center2" },
                            ]}
                            optionLabel="label"
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">ASP Status</label>
                    <Controller
                      name="asp_status"
                      control={control}
                      rules={{ required: "ASP Status is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            {...field}
                            value={field.value}
                            placeholder="Select ASP Status"
                            options={[
                              { label: "Center 1", value: "center1" },
                              { label: "Center 2", value: "center2" },
                            ]}
                            optionLabel="label"
                            onChange={(e) => field.onChange(e.value)}
                          />
                          <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              </>
            )}
            {reportLabel == "Interaction Report" && (
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label">Case ID</label>
                  <Controller
                    name="case_id"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText {...field} placeholder="Enter Case Id" />
                        <div className="p-error">
                          {/* {errors[field.name]?.message} */}
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
          <button className="btn form-submit-btn" type="submit">
            Save
          </button>
        </form>
      </Dialog>
    </div>
  );
};

export default ReportHomeBk;
