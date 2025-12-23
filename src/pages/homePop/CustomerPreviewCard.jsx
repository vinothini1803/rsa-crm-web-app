import React, { useState } from "react";
import { StarIcon } from "../../utills/imgConstants";
import { Rating } from "primereact/rating";
import { Chip } from "primereact/chip";
import NameComponent from "../../components/common/NameComponent";
const CustomerPreviewCard = ({customerData}) => {
  const [value, setValue] = useState(4);
  const client = customerData?.client;
  // console.log("Customer Data => ", customerData)
  return (
    <div className="search-results-card customer-preview-card">
      {/* <div className="rating-container">
        <div className="rating-detail-header">
          <img src={StarIcon} />
          <div className="rating-count">4.0</div>
          <div className="rating-service">
            Based on <span>15 Services</span>
          </div>
        </div>
        <div className="rating-detail-body">
          <div className="detail-container" style={{display:"inline-flex",flexGrow: 1,flexDirection:"column"}}>
            <div className="detail-title">Previous Cases Rating</div>
            <div className="rating">
              <Rating
                value={value}
                onChange={(e) => setValue(e.value)}
                cancel={false}
              />
              <div className="rating-value">{value}</div>
            </div>
          </div>
          <div className="divider" style={{marginLeft:"14px",marginRight: "14px"}}></div>
          <div className="detail-container"style={{display:"inline-flex",flexGrow: 1,flexDirection:"column"}}>
            <div className="detail-title">Customer Experience</div>
            <div className="detail-content">Satisfied</div>
          </div>
        </div>
      </div> */}
      <Chip
        label={client?.toUpperCase() }
        className="info-chip blue align-self-start"
      />
      <NameComponent name={customerData?._source?.policies?.name || '--'} email={customerData?._source?.policies?.email || '--'} />
      <div className="customer-detail-container">
        <div className="info-container">
          <div className="info-title">Mobile Number</div>
          <div className="info-content">: {customerData?._source?.mobileNumber || '--'}</div>
        </div>
        <div className="info-container">
          <div className="info-title">Preferred Language</div>
          <div className="info-content">: {customerData?._source?.preferedLanguage || '--'}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPreviewCard;
