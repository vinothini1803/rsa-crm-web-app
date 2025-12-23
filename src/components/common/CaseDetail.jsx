import React from "react";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
const CaseDetail = ({
  reminderId,
  title,
  content,
  date,
  caseChips,
  caseStatus,
  casePriority,
  caseStatusId,
  caseType,
  caseActions,
  btn1text,
  btn2text,
  btn1Click,
  btn2Click,
  btn1Loading,
  btn2Loading,
}) => {
  return (
    <div className="case-detail-container">
      <div className="case-detail-header">
        <div className="case-title">{title || "Assigned"}</div>
        {(caseChips) && (
          <Chip label={caseStatus ? caseStatus : '--'} className={`info-chip ${caseStatusId !== 571 ? "green" : "blue"} case-status-chip`} />
        )}
        <div className="case-date">{date || "06-06-2022 11:32"}</div>
      </div>
      <div className="case-content">
        {content || (
          <>
            Case ID <span>F23MDSOTRP00014</span> has been assigned, pick the
            case and Assign ASP.
          </>
        )}
      </div>
      {caseChips && 
        <div className="case-chip-container">
          <Chip
            label={casePriority ? casePriority : '--'}
            className="info-chip danger case-status-chip"
          />
          <Chip
            label={caseType ? caseType : '--'}
            className="info-chip violet case-status-chip"
          />
          {/* <Chip
            label={"Cases"}
            className="info-chip green case-status-chip"
          /> */}
        </div>
      }
      {caseActions && (
        <div className="case-actions">
          <Button className="btn" onClick={() => btn1Click()} loading={btn1Loading}>
            {btn1text || "Assign ASP"}
          </Button>
          <Button className="btn btn-white" onClick={() => btn2Click()} loading={btn2Loading}>
            {btn2text || "Add Reminder"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CaseDetail;
