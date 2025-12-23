import React from "react";

const PaymentNote = ({ description, type }) => {
  return (
    <div className={`payment-note-container ${type ? type : ""}`}>
      <div className="info-title">Payment Info</div>
      <div className="info-description">{description}</div>
    </div>
  );
};

export default PaymentNote;
