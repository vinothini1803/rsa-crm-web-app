import React from "react";
import { StarIcon } from "../../utills/imgConstants";
import { Rating } from "primereact/rating";
import { Chip } from "primereact/chip";
import NameComponent from "../../components/common/NameComponent";
const CustomerPreviewCard = ({ customerData }) => {
  const client = customerData?.client;
  // Extract customer index fields with null checks
  const overAllRating = customerData?._source?.overAllRating;
  const totalCaseCount = customerData?._source?.totalCaseCount;
  const previousCaseRating = customerData?._source?.previousCaseRating;
  const customerExperience =
    customerData?._source?.customerExperienceForPreviousCases;

  // Format ratings to one decimal place
  const formattedOverallRating =
    overAllRating != null ? parseFloat(overAllRating).toFixed(1) : null;
  const formattedPreviousRating =
    previousCaseRating != null
      ? parseFloat(previousCaseRating).toFixed(1)
      : null;

  // Check if we have previous case rating to show stars
  const hasPreviousRating =
    previousCaseRating != null && previousCaseRating > 0;

  // console.log("Customer Data => ", customerData)
  return (
    <div className="search-results-card customer-preview-card">
      <div className="rating-container">
        <div className="rating-detail-header">
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <img src={StarIcon} />
            <div className="rating-count">
              {formattedOverallRating || "N/A"}
            </div>
          </div>
          <div className="rating-service">
            {totalCaseCount > 0
              ? `Based on ${totalCaseCount} ${
                  totalCaseCount === 1 ? "Service" : "Services"
                }`
              : "No Service History"}
          </div>
        </div>
        <div className="rating-detail-body">
          <div className="detail-container">
            <div className="detail-title">Previous Case Rating</div>
            <div className="rating">
              {hasPreviousRating ? (
                <>
                  <Rating value={previousCaseRating} readOnly cancel={false} />
                  <div className="rating-value">{formattedPreviousRating}</div>
                </>
              ) : (
                <div className="detail-content">Not Available</div>
              )}
            </div>
          </div>
          <div className="divider"></div>
          <div className="detail-container">
            <div className="detail-title">Customer Experience</div>
            <div className="detail-content">
              {customerExperience || "No PSF Record"}
            </div>
          </div>
        </div>
      </div>
      <Chip
        label={client?.toUpperCase()}
        className="info-chip blue align-self-start"
      />
      <NameComponent
        name={customerData?._source?.policies?.name || "--"}
        email={customerData?._source?.policies?.email || "--"}
      />
      <div className="customer-detail-container">
        <div className="info-container">
          <div className="info-title">Mobile Number</div>
          <div className="info-content">
            :{" "}
            {customerData?._source?.isMobileNoExists == "true"
              ? customerData?._source?.mobileNumber
              : "--"}
          </div>
        </div>
        <div className="info-container">
          <div className="info-title">Preferred Language</div>
          <div className="info-content">
            : {customerData?._source?.preferedLanguage || "--"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPreviewCard;
