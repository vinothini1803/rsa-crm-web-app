import { Dialog } from "primereact/dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { DialogCloseSmallIcon } from "../../utills/imgConstants";
import Note from "./Note";


const ChangeActivityDialog = ({ visible, setVisible }) => {
  const { handleSubmit, control, getValues, formState, reset } = useForm();

  const handleFormSubmit = (values) => {
    console.log("values", values);
  };
  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Change Activity</div>
        </div>
      }
      pt={{
        root: { className: "w-372" },
      }}
      visible={visible}
      position={"bottom"}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <form
        className="change-activity-form"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="row row-gap-3_4">
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
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label">Remarks</label>
              <Controller
                name="remarks"
                control={control}
                render={({ field, fieldState }) => {
                  console.log("text area field", field);
                  return (
                    <InputTextarea
                      placeholder="comments"
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
        <div className="change-activity-note-container">
          <Note type={"dark"} icon={false} purpose={"detail"}>
            <div>
              Ask the ASP to capture his current location, though the SMS which
              will be sent after updating status.
            </div>
          </Note>
        </div>
        <button className="btn update-btn" type="submit">
          Update
        </button>
      </form>
    </Dialog>
  );
};

export default ChangeActivityDialog;
