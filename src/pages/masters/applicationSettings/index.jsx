import React from "react";
import "./style.less";
import { Checkbox } from "primereact/checkbox";
import { InfoGreyIcon, NoteInfoIcon } from "../../../utills/imgConstants";
import { InputSwitch } from "primereact/inputswitch";
import { Tooltip } from "primereact/tooltip";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ApplicationSettings = () => {
  const defaultValues = {
    time: "12",
    date: "DD/MM/YYYY",
    pushNotification: "",
    reminders: "",
    alerts: "",
  };
  const { handleSubmit, control, reset } = useForm({defaultValues});

  const handleFormSubmit = (values) => {
    console.log("form values", values);
    if(values){
       toast.success("Added Successfully",{
        autoClose: 1000,
      })
      reset(defaultValues);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-body">
        <div className="settings-main-container">
          <div className="settings-header">
            <div className="settings-title">Application Settings</div>
          </div>
          <div className="settings-body">
            <form id="settings-form" onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="date-time-setting">
                <div className="setting-container">
                  <div className="settings-title">Date and Time</div>
                  <div className="settings-subtitle">
                    Date and time format display settings
                  </div>
                </div>

                <div className="setting-options-container">
                  <div className="row">
                    <div className="col-lg-2">
                      <div className="option-label">Display Time</div>
                    </div>
                    <div className="col-lg-8">
                      <Controller
                        name="time"
                        control={control}
                        render={({ field, fieldState }) => (
                          <div className="checkbox-container">
                            <div className="chechbox-item">
                              <Checkbox
                                inputId="12hours"
                                name="12 Hours"
                                value="12"
                                {...field}
                                onChange={(e) => {
                                  console.log("time checked", e.checked);
                                  field.onChange(e.checked ? "12" : "");
                                }}
                                checked={field.value === "12"}
                              />
                              <label
                                htmlFor="12hours"
                                className="checkbox-label"
                              >
                                12 Hours
                              </label>
                            </div>
                            <div className="chechbox-item">
                              <Checkbox
                                inputId="12hours"
                                name="12 Hours"
                                value="24"
                                onChange={(e) =>
                                  field.onChange(e.checked ? "24" : "")
                                }
                                checked={field.value === "24"}
                              />
                              <label
                                htmlFor="12hours"
                                className="checkbox-label"
                              >
                                24 Hours
                              </label>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="setting-options-container">
                  <div className="row">
                    <div className="col-lg-2">
                      <div className="option-label">Display Date</div>
                    </div>

                    <div className="col-lg-8">
                      <Controller
                        name="date"
                        control={control}
                        render={({ field, fieldState }) => (
                          <div className="checkbox-container">
                            <div className="chechbox-item">
                              <Checkbox
                                inputId="DD/MM/YYYY"
                                name=""
                                value="DD/MM/YYYY"
                                onChange={(e) =>
                                  field.onChange(e.checked ? "DD/MM/YYYY" : "")
                                }
                                checked={field.value === "DD/MM/YYYY"}
                              />
                              <label
                                htmlFor="DD/MM/YYYY"
                                className="checkbox-label"
                              >
                                DD/MM/YYYY
                              </label>
                              <img
                                src={InfoGreyIcon}
                                className={"info-icon format1"}
                              />
                              <Tooltip
                                target=".format1"
                                position="bottom"
                                // autoHide={false}
                                pt={{
                                  root: {
                                    className: "date-format-tooltip",
                                  },
                                  arrow: {
                                    className: "hide-arrow",
                                  },
                                }}
                              >
                                <div className="format-title">DD/MM/YYYY</div>
                                <div className="format-content">
                                  Date, month, and year format, prevalent in many
                                  countries such as the United Kingdom, India,
                                  and Australia.
                                </div>
                              </Tooltip>
                            </div>
                            <div className="chechbox-item">
                              <Checkbox
                                inputId="Month DD, YYYY"
                                name=""
                                value="Month DD, YYYY"
                                onChange={(e) =>
                                  field.onChange(
                                    e.checked ? "Month DD, YYYY" : ""
                                  )
                                }
                                checked={field.value === "Month DD, YYYY"}
                              />
                              <label
                                htmlFor=" Month DD, YYYY"
                                className="checkbox-label"
                              >
                                Month DD, YYYY
                              </label>
                              <img
                                src={InfoGreyIcon}
                                className={"info-icon format2"}
                              />
                              <Tooltip
                                target=".format2"
                                position="bottom"
                                // autoHide={false}
                                pt={{
                                  root: {
                                    className: "date-format-tooltip",
                                  },
                                  arrow: {
                                    className: "hide-arrow",
                                  },
                                }}
                              >
                                <div className="format-title">
                                  Month DD, YYYY
                                </div>
                                <div className="format-content">
                                  Date format using the full month name,
                                  followed by the day and year. For example, May
                                  23, 2023.
                                </div>
                              </Tooltip>
                            </div>
                            <div className="chechbox-item">
                              <Checkbox
                                inputId="DD/MM/YY"
                                name=""
                                value="DD/MM/YY"
                                onChange={(e) =>
                                  field.onChange(e.checked ? "DD/MM/YY" : "")
                                }
                                checked={field.value === "DD/MM/YY"}
                              />
                              <label
                                htmlFor="DD/MM/YY"
                                className="checkbox-label"
                              >
                                DD/MM/YY
                              </label>
                              <img
                                src={InfoGreyIcon}
                                className={"info-icon format3"}
                              />
                              <Tooltip
                                target=".format3"
                                position="bottom"
                                // autoHide={false}
                                pt={{
                                  root: {
                                    className: "date-format-tooltip",
                                  },
                                  arrow: {
                                    className: "hide-arrow",
                                  },
                                }}
                              >
                                <div className="format-title">DD/MM/YY</div>
                                <div className="format-content">
                                  Using a two-digit year, for example, 23/05/23
                                </div>
                              </Tooltip>
                            </div>
                            <div className="chechbox-item">
                              <Checkbox
                                inputId="MM/DD/YYYY"
                                name=""
                                value="MM/DD/YYYY"
                                onChange={(e) =>
                                  field.onChange(e.checked ? "MM/DD/YYYY" : "")
                                }
                                checked={field.value === "MM/DD/YYYY"}
                              />
                              <label
                                htmlFor="MM/DD/YYYY"
                                className="checkbox-label"
                              >
                                MM/DD/YYYY
                              </label>
                              <img
                                src={InfoGreyIcon}
                                className={"info-icon format4"}
                              />
                              <Tooltip
                                target=".format4"
                                position="bottom"
                                // autoHide={false}
                                pt={{
                                  root: {
                                    className: "date-format-tooltip",
                                  },
                                  arrow: {
                                    className: "hide-arrow",
                                  },
                                }}
                              >
                                <div className="format-title">MM/DD/YYYY</div>
                                <div className="format-content">
                                  Month, date, and year format, for example,
                                  05/23/2023
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="notification-setting">
                <div className="setting-container">
                  <div className="settings-title">Notifications</div>
                  <div className="settings-subtitle">
                    Get in-app notifications and reminders to perform your
                    actions instantly.
                  </div>
                </div>
                <div className="notifications-setting-options">
                  <div className="row">
                    <div className="col-lg-2">
                      <label className="settings-subtitle">
                        Push Notifications
                      </label>
                    </div>
                    <Controller
                      name="pushNotification"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="col-lg-2">
                          <InputSwitch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.value)}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="row">
                    <div className="col-lg-2">
                      <label className="settings-subtitle">Reminders</label>
                    </div>

                    <Controller
                      name="reminders"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="col-lg-2">
                          <InputSwitch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.value)}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="row">
                    <div className="col-lg-2">
                      <label className="settings-subtitle">Alerts</label>
                    </div>
                    <Controller
                      name="alerts"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="col-lg-2">
                          <InputSwitch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.value)}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="settings-footer">
            <button form="settings-form" type="submit">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSettings;
