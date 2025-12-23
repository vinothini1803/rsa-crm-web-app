import React from "react";
import { NoResultsImage } from "../../utills/imgConstants";

const NoDataComponent = ({
  image,
  text,
  btntext,
  onClick,
  addbtn,
  disablebtn,
}) => {
  return (
    <div className="no-result-container">
      <div className="text-center">
        <img className="img-fluid no-result-icon" src={image} />
        <div className={text=="No agent Assigned"?"no-result-red":"no-result-text"}>{text}</div>
      </div>
      {(addbtn !== false && btntext !== undefined) && (
        <button onClick={onClick} disabled={disablebtn ? disablebtn : false}>
          {btntext}
        </button>
      )}
    </div>
  );
};

export default NoDataComponent;
