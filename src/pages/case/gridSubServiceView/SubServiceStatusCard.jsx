import { Chip } from "primereact/chip";
import React from "react";

const CaseStatusCard = ({ status, statusId, totalCases }) => {
  const statusColors = {
    1: "blue",
    2: "grey",
    3: "orange",
    4: "red",
    5: "violet",
    6: "yellow",
    7: "black",
  };
  const totalCase = totalCases ? `${totalCases} Cases` : "0 cases"
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
