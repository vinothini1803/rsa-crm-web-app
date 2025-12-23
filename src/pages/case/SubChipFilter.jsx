import { Chip } from "primereact/chip";
import React, { useState, useEffect } from "react";
import { caseStatus } from "../../../services/masterServices";
import { useQuery } from "react-query";

const SubChipFilter = ({ onFilterChange, selectedFilter }) => {
  const [activeChip, setActiveChip] = useState(" ");
  // console.log(selectedFilter);
  useEffect(() => {
    if (selectedFilter) {
      setActiveChip(selectedFilter);
    }
  }, [selectedFilter]);

  const activityStatusList = [
    {
      id: 1,
      name: "AGENT UNASSIGNED",
    },
    {
      id: 2,
      name: "NOT PICKED",
    },
    {
      id: 3,
      name: "ASP NOT ASSIGNED",
    },
    {
      id: 9,
      name: "ASP NOT REACHED BEYOND SLA",
    },
    {
      id: 4,
      name: "INPROGRESS",
    },
    {
      id: 5,
      name: "CANCELED",
    },
    {
      id: 6,
      name: "REJECTED",
    },
    {
      id: 7,
      name: "CLOSED",
    },
  ];
  const handleChipClick = (id) => {
    setActiveChip(id); // Set the clicked chip as active
    onFilterChange(id); // Trigger filter change
  };

  return (
    <div className="chip-filter-wrap">
      <Chip
        label={"All"}
        onClick={() => handleChipClick(" ")}
        className={`chip-filter ${activeChip === " " ? "chip-active" : ""}`}
      />
      {activityStatusList?.map((item, i) => (
        <Chip
          key={i}
          label={item?.name}
          onClick={() => handleChipClick(item?.id)}
          className={`chip-filter ${
            activeChip === item.id ? "chip-active" : ""
          }`}
        />
      ))}
    </div>
  );
};

export default SubChipFilter;
