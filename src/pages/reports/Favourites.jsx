import React, { useState } from "react";
import { ActionIcon, AddReportIcon } from "../../utills/imgConstants";

const Favourites = ({ initialFavourites, OnReportClick }) => {
  const [activeReport, setActiveReport] = useState();
  const [favourites, setFavourites] = useState(initialFavourites || []);
  const handleAddReport = () => {
    const newReport = { name: `Report ${favourites.length + 1}` }; // Example new report
    setFavourites([...favourites, newReport]);
  };

  return (
    <div className="favourite-container">
      <div className="title">Favourites</div>

      <ul className="reports-list">
        {favourites?.map((el, i) => (
          <li
            className={`report ${i == activeReport ? `report-active` : ""} ${
              i == activeReport - 1 ? "brder-none" : ""
            }`}
            key={i}
            onClick={() => {
              setActiveReport(i);
              OnReportClick();
            }}
          >
            {el?.name}
            <button className="btn-text">
              <img src={ActionIcon} />
            </button>
          </li>
        ))}
      </ul>

      <button className="add-report-btn  btn-brdr-transparent"  onClick={handleAddReport}>
        <img src={AddReportIcon} className="plus-icon" />
        Add New Report
      </button>
    </div>
  );
};

export default Favourites;
