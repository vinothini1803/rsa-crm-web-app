import React, { useState } from "react";
import "./style.less";
import { Dropdown } from "primereact/dropdown";
import { PaperDownloadIcon } from "../../utills/imgConstants";

const AgentStatusCard = () => {
  const [selectedActive, setSelectedActive] = useState("Active");
  const [date, setDate] = useState("Today");
  const Active = [
    { name: "Active", id: "NY" },
    { name: "InActive", id: "RM" },
  ];
  const dates = [{ name: "today", id: 2332 }];
  return (
    <div className="agent-status-card">
      <div className="agent-status-header">
        <div className="agent-status-title">Agent Case Status</div>

        <div className="agent-status-header-right">
          <Dropdown
            value={selectedActive}
            onChange={(e) => setSelectedActive(e.value)}
            options={Active}
            optionLabel="name"
            editable
            className="dashboard-dropdown"
            placeholder="Select a Status"
          />
          <Dropdown
            value={date}
            onChange={(e) => setDate(e.value)}
            options={dates}
            optionLabel="name"
            editable
            placeholder="Select a date"
            className="dashboard-dropdown"
          />
          <button
            className="btn btn-primary btn-with-icon"
            style={{ padding: "8px" }}
          >
            <img src={PaperDownloadIcon} />
          </button>
        </div>
      </div>
      <div className="agent-status-body"></div>
    </div>
  );
};

export default AgentStatusCard;
