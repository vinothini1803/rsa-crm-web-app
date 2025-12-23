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
  console.log("caseData",caseData)
  return (
    <div className="case-card">
      <div className={`case-card-highlight ${caseData?.status == "In Progress" ? "success" :"danger"}`}></div>
      <div className="case-card-header d-flex">
        <img src={CaseIcon} />
        <div className="case-title">
  
          {caseData?.subject}
          <span className="case-number">- {caseData?.caseNumber}</span>
          <br />
          <Chip label={caseData?.status} className={`info-chip ${caseData?.status == "In Progress" ? caseData?.status == "Open" ?"violet":"success" :"danger"}`} />
        </div>
        <div className="case-date">{caseData?.createdAt} </div>
      </div>
      <div className="case-card-body  mt-3_4">
        <div>{caseData?.voiceOfCustomer}</div>
        <div className="case-actions-container mt-3_4">
          <Chip label={caseData?.service} className="info-chip" />
          <Chip
            label={caseData?.channel}
            icon={<CallIcon key={'callIcon'} />}
            className="info-chip link"
          />
          <Chip 
          // label="ASP - Delhi  Kumar A" 
          label={caseData?.policyType}
          className="info-chip green" />

          <Chip label={caseData?.registrationNumber} className="info-chip default" />
{/* 
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
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
