import React, { useState, useEffect } from "react";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";

const ReminderItem = ({
  title,
  content,
  date,
  scheduleTime,
  reminderChips,
  reminderPriority,
  reminderPriorityId,
  reminderStatus,
  reminderStatusId,
  reminderType,
  btn1text,
  btn2text,
  btn1Click,
  btn2Click,
  btn1Loading,
  btn2Loading,
  reminderId
}) => {
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    if (scheduleTime) {
      console.log('scheduleTime',scheduleTime)
      const scheduledTime = new Date(scheduleTime);
      const currentTime = new Date();

      const timerId = setInterval(() => {
        if (currentTime >= scheduledTime) {
          setShowActions(true);
          clearInterval(timerId);
        }
        else{
          setShowActions(false)
        }
        // console.log('time running')
      }, 100);
      console.log('time updated')

      return () => clearInterval(timerId);
    }
  }, [scheduleTime, btn1Loading]);

  console.log('showActions',showActions,reminderId)

  return (
    <div className="case-detail-container">
      <div className="case-detail-header">
        <div className="case-title">{title || "Assigned"}</div>
        {reminderChips && (
          <Chip
            label={reminderPriority ? reminderPriority : "--"}
            className={`info-chip case-status-chip ${
              reminderPriorityId == '552' ? "danger" : "warning"
            } case-status-chip`}
          />
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
      {/* {reminderChips && (
        <div className="case-chip-container">
          <Chip
            label={reminderStatus ? reminderStatus : "--"}
            className="info-chip danger case-status-chip"
          />
          <Chip
            label={reminderType ? reminderType : "--"}
            className="info-chip violet case-status-chip"
          />
          <Chip
            label={"Cases"}
            className="info-chip green case-status-chip"
          />
        </div>
      )} */}
      {showActions && (
        <div className="case-actions">
          <Button
            className="btn"
            onClick={() => btn1Click()}
            loading={btn1Loading}
          >
            {btn1text || "Assign ASP"}
          </Button>
          <Button
            className="btn btn-white"
            onClick={() => btn2Click()}
            loading={btn2Loading}
          >
            {btn2text || "Add Reminder"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReminderItem;
