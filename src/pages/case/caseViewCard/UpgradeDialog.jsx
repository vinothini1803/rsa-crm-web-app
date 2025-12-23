import React from "react";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";

const UpgradeDialog = ({ visible, setVisible, onFormSubmit, submitLoading }) => {
  const { handleSubmit, control, getValues, formState: { errors }, reset } = useForm();
  // console.log('UpgradeDialog');

  const onSubmit = (values) => {
    console.log('Policy Update => ', values);
    // setVisible(false);
    onFormSubmit(values);
  }

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Upgrade Request</div>
        </div>
      }
      visible={visible}
      position={"bottom"}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <div className="confirm-upgrade-text">
        Customer is interested in upgrading membership?
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row row-gap-3_4">
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label required">Remarks</label>
              <Controller 
                name="remarks"
                control={control}
                rules={{ required: "Remarks is required." }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <InputTextarea
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        id={field.name}
                        {...field}
                        rows={4}
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
        </div>
        <Button className="confirm-btn" type="submit" loading={submitLoading}>
          Confirm
        </Button>
      </form>
    </Dialog>
  );
};

export default UpgradeDialog;
