import React from "react";
import {
  DialogCloseSmallIcon,
  VehicleActivityImage,
} from "../../../utills/imgConstants";
import { Dialog } from "primereact/dialog";

const ASPAttachmentDialog = ({ visible, setVisible }) => {
  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Attachments</div>
        </div>
      }
      pt={{
        root: { className: "w-480" },
      }}
      visible={visible}
      position={"bottom"}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <div className="asp-attachment-container">
        <div>
          <div className="photos-text">Before Photos</div>
          <div className="asp-attachments-image-container">
            <img src={VehicleActivityImage} />
            <img src={VehicleActivityImage} />
            <img src={VehicleActivityImage} />
            <img src={VehicleActivityImage} />
          </div>
        </div>
        <div>
          <div className="photos-text">After Photos</div>
          <div className="asp-attachments-image-container">
            <img src={VehicleActivityImage} />
            <img src={VehicleActivityImage} />
            <img src={VehicleActivityImage} />
            <img src={VehicleActivityImage} />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ASPAttachmentDialog;
