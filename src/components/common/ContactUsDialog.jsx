import React from "react";
import { DialogCloseSmallIcon } from "../../utills/imgConstants";
import { Dialog } from "primereact/dialog";

const ContactUsDialog = ({ visible, setVisible }) => {
  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title" style={{fontWeight:"600"}}>Contact</div>
        </div>
      }
      visible={visible}
      position={"center"}
      className="w-400 border-header"
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >

       
      <div className="contactus-main-container">
        <div className="contactus-title-content">
          <div className="getintouch-text">Get in Touch</div>
          <div className="gateway-text">Your Gateway to Connection.</div>
        </div>

        <div className="contact-info">
          <div className="contact-info-title">E-Mail ID</div>
          <div className="contact-info-content">support@uitoux.in</div>
        </div>
        <div className="contact-info">
          <div className="contact-info-title">Phone Number</div>
          <div className="contact-info-content">04448139000</div>
        </div>
      </div>
    </Dialog>
  );
};

export default ContactUsDialog;
