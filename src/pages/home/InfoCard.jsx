import React from "react";
import ViewGrid from "../../components/common/ViewGrid";

const InfoCard = ({ title, items }) => {
  return (
    <div className="info-card">
      <div className="info-card-header">
        <div className="info-card-title">{title}</div>
      </div>
      <div className="info-card-body">
        <ViewGrid items={items} className={'grid-4'}/>
      </div>
    </div>
  );
};

export default InfoCard;
