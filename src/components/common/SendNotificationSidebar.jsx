import React, { useState } from "react";
import {
  DialogCloseIcon,
  NotificationSidebarIcon,
} from "../../utills/imgConstants";
import { Sidebar } from "primereact/sidebar";
import InfoComponent from "./InfoComponent";
import StatusBadge from "./StatusBadge";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import SelectableButtons from "../../pages/case/serviceTab/SelectableButtons";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const SendNotificationSidebar = ({ visible, setVisible, Details }) => {
  const { handleSubmit, control, reset } = useForm();
  const [selectedmessageOptions, setSelectedMessageOption] = useState([1]);
  const handleMessageOptionSelect = (items) => {
    setSelectedMessageOption(items);
  };
  // console.log("selectedmessageOptions", selectedmessageOptions);
  const handleFormSubmit = () => {};
  return (
    <Sidebar
      visible={visible}
      position="right"
      closeIcon={<DialogCloseIcon />}
      onHide={() => setVisible(false)}
      pt={{
        root: { className: "w-600 custom-sidebar" },
        header: { className: "brdr-bottom" },
      }}
      icons={
        <>
          <img src={NotificationSidebarIcon} />
          <div className="sidebar-title">Send Notification</div>
        </>
      }
    >
      <div className="sidebar-content-wrap">
        <div className="sidebar-content-body">
          <div className="details-container">
            {Details?.map((data, i) => (
              <InfoComponent key={i} title={data?.title} info={data?.info} />
            ))}
          </div>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="send-notification-form"
            id="hook-form"
          >
            <div className="row row-gap-3_4">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">SMS To</label>
                  <Controller
                    name=""
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        options={[
                          { label: "Center 1", value: "center1" },
                          { label: "Center 2", value: "center2" },
                        ]}
                        optionLabel="label"
                        onChange={(e) => field.onChange(e.value)}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Sent to</label>
                  <Controller
                    name=""
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        options={[
                          { label: "Center 1", value: "center1" },
                          { label: "Center 2", value: "center2" },
                        ]}
                        optionLabel="label"
                        onChange={(e) => field.onChange(e.value)}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Send Message Through</label>
                  <div className="message-way-container">
                    <SelectableButtons
                      multiple={false}
                      items={[
                        { id: 1, label: "SMS" },
                        { id: 2, label: "Email" },
                        { id: 3, label: "WhatsApp" },
                      ]}
                      onSelect={handleMessageOptionSelect}
                      //defaultItems={selectedmessageOptions}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Select SMS Template</label>
                  <Controller
                    name=""
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        options={[
                          { label: "Center 1", value: "center1" },
                          { label: "Center 2", value: "center2" },
                        ]}
                        optionLabel="label"
                        onChange={(e) => field.onChange(e.value)}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <Controller
                    name=""
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <InputText type="text" placeholder="" {...field} />
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label">Select SMS Subject</label>
                  <Controller
                    name=""
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        type="text"
                        placeholder="Dear Customer, For Ticket no: {vehicle_reg_no}, Our Service person has reached near the breakdown location, Will need your guidance to reach the exact spot. Please call toll free : {cust_toll_free} for support. Team TVS Auto Assist"
                        {...field}
                        rows={4}
                        cols={30}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="sidebar-content-footer">
          <div className="d-flex align-items-center justify-content-center">
            <button className="btn save-btn" form="hook-form">
              Save
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default SendNotificationSidebar;
