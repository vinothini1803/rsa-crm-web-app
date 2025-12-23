import { Chip } from "primereact/chip";
import React from "react";

const CaseStatusCard = ({ status, statusId, totalCases }) => {
  const statusColors = {
    1: "green",
    2: "yellow",
    3: "red",
    4: "black",
  };
  const totalCase = totalCases ? `${totalCases} Cases` : "0 cases"
  //console.log("statusId", statusId)
  return (
    <div className={`case-status-card-container`}>
      <div className={`case-status ${statusColors[statusId]}`}>{status}</div>
      <div className="ms-auto">
        <Chip label={totalCase} className="case-chip" />
      </div>
    </div>
  );
};

export default CaseStatusCard;
