import React from "react";
import { BreadCrumb } from "primereact/breadcrumb";
import { RightIcon, DropdownIcon, CloseIcon } from "../../utills/imgConstants";

const CustomBreadCrumb = ({ items, milestone, handleClose }) => {
  return (
    <div className="custombreadcrumb-container">
      <BreadCrumb
        model={items}
        separatorIcon={
          <img className="img-fluid" src={DropdownIcon} alt="Separator Icon" />
        }
      />
      {milestone !== false && (
        <div className="milestone-container">
          Upcoming Milestone :
          <span className="milestone-content">Assign ASP</span>
        </div>
      )}
      {handleClose && (
        <div className="ms-auto">
          <button className="btn btn-close" onClick={handleClose?.onClick}>
            <img className="img-fluid" src={CloseIcon} alt="Close" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomBreadCrumb;
