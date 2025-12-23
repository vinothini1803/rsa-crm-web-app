import React from "react";
import { Chip } from "primereact/chip";
import { LocationArrowIcon, MapIcon } from "../../utills/imgConstants";

const ChipWithIcon = ({ label, type, icon }) => {
  // const timerIcons = {
  //   yellow: MapIcon,
  //   gray: LocationArrowIcon,
  // };
  const timerTemplate = (
    <>
      <span className="chip-with-icon">
        <img src={icon} />
      </span>
      <span className="chip-with-label">{label}</span>
    </>
  );

  return <Chip className={`chip-with-icon ${type}`} template={timerTemplate} />;
};

export default ChipWithIcon;
