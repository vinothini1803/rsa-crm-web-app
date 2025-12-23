import React from "react";
import {
  AssignIcon,
  CallIcon,
  CaseIcon,
  ChatIcon,
  ReminderIcon,
  TaskIcon,
} from "../../utills/imgConstants";
import { Chip } from "primereact/chip";

const  CaseCard = ({
  caseTitle,
  caseNo,
  date,
  description,
  statusId,
  status,
  caseData
}) => {
  return (
    <div className="case-card">
      <div className={`case-card-highlight ${statusId}`}></div>
      <div className="case-card-header d-flex">
        <img src={CaseIcon} />
        <div className="case-title">
          {caseTitle}
          <span className="case-number">- {caseNo}</span>
          <br />
          <Chip label={status} className={`info-chip ${statusId}`} />
        </div>
        <div className="case-date">{date}</div>
      </div>
      <div className="case-card-body  mt-3_4">
        <div>{description}</div>
        <div className="case-actions-container mt-3_4">
          <Chip label="Pradeep Kumar" className="info-chip" />
          <Chip
            label="9876543211"
            icon={<CallIcon key={'callIcon'} />}
            className="info-chip link"
          />
          <Chip label="ASP - Delhi  Kumar A" className="info-chip green" />

          <Chip label="TN 70 AM 2694" className="info-chip default" />

          <button className="btn btn-with-icon btn-action">
            <img src={AssignIcon} alt="asp" />
            <span>Assign ASP</span>
          </button>
          <button className="btn btn-with-icon btn-action">
            <img src={ReminderIcon} alt="reminder" />
            <span>Add Reminder</span>
          </button>
          <button className="btn btn-with-icon btn-action">
            <img src={ChatIcon} alt="interaction" />
            <span>Add Interaction</span>
          </button>
          <button className="btn btn-with-icon btn-action">
            <img src={AssignIcon} alt="reassign-asp" />
            <span>Re-Assign ASP</span>
          </button>
          <button className="btn btn-with-icon btn-action">
            <img src={TaskIcon} alt="task" />
            <span>Add task</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
