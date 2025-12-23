import React from "react";
import "./components.less";
import {
  ViewIcon,
  EditIcon,
  AddIcon,
  DownloadIcon,
} from "../../utills/imgConstants";
import { useNavigate } from "react-router";

const TableActions = ({ edit, view, add, download }) => {
  const navigate = useNavigate();
  const handleNavigate = (e, action) => {
    e.preventDefault();
    if (action == "view") {
      navigate(view.url);
    } else if (action == "edit") {
      navigate(edit.url);
    } else {
      navigate(add.url);
    }
  };
  return (
    <div className="table-action-container">
      {edit && (
        <div className="action-icon">
          <a href={edit.url} onClick={(e) => handleNavigate(e, "edit")}>
            <EditIcon />
          </a>
        </div>
      )}
      {view && (
        <div className="action-icon">
          <a href={view.url} onClick={(e) => handleNavigate(e, "view")}>
            <ViewIcon />
          </a>
        </div>
      )}
      {add && (
        <div className="action-icon">
          <a href={add.url} onClick={(e) => handleNavigate(e, "add")}>
            <AddIcon />
          </a>
        </div>
      )}
      {download && (
        <div className="action-icon">
          <a href={download.url} download target="_blank">
            <DownloadIcon />
          </a>
        </div>
      )}
    </div>
  );
};

export default TableActions;
