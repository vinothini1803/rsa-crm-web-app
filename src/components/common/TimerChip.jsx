import React from "react";
import { Chip } from "primereact/chip";
import {
  ViolatedTimerIcon,
  WarningTimerIcon,
  SuccessTimerIcon,
  TimerClockIcon,
} from "../../utills/imgConstants";

const TimerChip = ({ label, type }) => {
  const timerIcons = {
    red: ViolatedTimerIcon,
    orange: WarningTimerIcon,
    green: SuccessTimerIcon,
   
  };
  const timerTemplate = (
    <>
      <span className="timer-chip-icon">
        <img src={timerIcons[type]} />
      </span>
      <span className="timer-chip-label">{label}</span>
    </>
  );

  return <Chip className={`timer-chip ${type}`} template={timerTemplate} />;
};

export default TimerChip;
