import { Chip } from "primereact/chip";
import React, { useState, useEffect } from "react";
import { caseStatus } from "../../../services/masterServices";
import { useQuery } from "react-query";

const ChipFilter = ({ onFilterChange, selectedFilter, isPSFUser }) => {
  const [activeChip, setActiveChip] = useState(" ");
  useEffect(() => {
    if (selectedFilter) {
      setActiveChip(selectedFilter);
    }
  }, [selectedFilter]);

  const { data: activityStatusData } = useQuery(["caseActiveStatus"], () =>
    caseStatus({
      apiType: "dropdown",
    })
  );
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
      {isPSFUser && (
        <>
          <Chip
            label={"PSF Completed"}
            onClick={() => handleChipClick("psf-completed")}
            className={`chip-filter ${
              activeChip === "psf-completed" ? "chip-active" : ""
            }`}
          />
          <Chip
            label={"PSF Not Completed"}
            onClick={() => handleChipClick("psf-not-completed")}
            className={`chip-filter ${
              activeChip === "psf-not-completed" ? "chip-active" : ""
            }`}
          />
        </>
      )}
      {activityStatusData?.data?.data?.map((item, i) => (
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

export default ChipFilter;
