import React from "react";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";

const RequestResponeDialoagBk = ({ visible, setVisible }) => {
  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Request Response</div>
        </div>
      }
      pt={{
        root: { className: "w-460" },
      }}
      visible={visible}
      position={"bottom"}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <div className="row row-gap-3_4">
        <div className="col-md-12">
          <div className="form-group">
            <label className="form-label">Request</label>
            <InputTextarea
              rows={4}
              autoResize
              placeholder="[{“ContactName”:”Raja”,”MobileNumber”:9876543211,”
                    VehicleNo”:”TN37CM0617”}]"
            />
          </div>
        </div>
        <div className="col-md-12">
          <div className="form-group">
            <label className="form-label">Response</label>
            <InputTextarea autoResize rows={4} cols={40} placeholder="{}" />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default RequestResponeDialoagBk;
