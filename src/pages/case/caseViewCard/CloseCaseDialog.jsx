import React from "react";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { toast } from "react-toastify";

const CloseCaseDialog = ({ visible, setVisible }) => {
  // console.log("CloseCaseDialog");
  const { handleSubmit, control, getValues, formState, reset } = useForm();
  const handleFormSubmit = (values) => {
    // console.log("values", values);
    reset();
  };
  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Close Case</div>
        </div>
      }
      visible={visible}
      position={"bottom"}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <form
        className="agent-follwup-form"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="row row-gap-3_4">
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label">Service Status</label>
              <Controller
                name="serviceStatus"
                control={control}
                render={({ field, fieldState }) => (
                  <Dropdown
                    value={field.value}
                    placeholder="Select"
                    options={[
                      { label: "status1", value: "status1" },
                      { label: "status2", value: "status2" },
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
              <label className="form-label">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <Dropdown
                    value={field.value}
                    placeholder="Select"
                    options={[
                      { label: "status1", value: "status1" },
                      { label: "status2", value: "status2" },
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
              <label className="form-label">Customer Experience</label>
              <Controller
                name="customerExperience"
                control={control}
                render={({ field, fieldState }) => (
                  <Dropdown
                    value={field.value}
                    placeholder="Select"
                    options={[
                      { label: "status1", value: "status1" },
                      { label: "status2", value: "status2" },
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
              <label className="form-label">Remarks</label>
              <Controller
                name="remarks"
                control={control}
                render={({ field, fieldState }) => {
                  // console.log("text area field", field);
                  return (
                    <InputTextarea
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      id={field.name}
                      {...field}
                      rows={4}
                      cols={30}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
        <button className="btn-danger confirm-btn" type="submit">
          Close Case
        </button>
      </form>
    </Dialog>
  );
};

export default CloseCaseDialog;
