import React from "react";
import { RequestSentIcon } from "../../utills/imgConstants";

const RequestSent = () => {
  return (
    <div className="request-sent-container">
      <img src={RequestSentIcon} />
      <div className="request-sent-title">Request Sent</div>

      <div className="request-content">
        Your request has been received, and our administrative team will get in
        touch with you shortly.
      </div>
    </div>
  );
};

export default RequestSent;
