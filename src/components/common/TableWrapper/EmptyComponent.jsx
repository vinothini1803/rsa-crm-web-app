import React from "react";
import { TableEmptyImage } from "../../../utills/imgConstants";

const EmptyComponent = ({text}) => {
  return (
    <div className={"table-empty-container"}>
      <img src={TableEmptyImage} />
      <p className={"table-empty-text"}>{text ? text : 'There are no Data on your list.'}</p>
    </div>
  );
};

export default EmptyComponent;
