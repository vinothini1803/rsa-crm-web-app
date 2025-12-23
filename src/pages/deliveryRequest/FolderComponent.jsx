import React from "react";
import { AttachmentFolderIcon } from "../../utills/imgConstants";

const FolderComponent = ({ onClick, name }) => {
  return (
    <div className="attachment-folder" onClick={onClick}>
      <img src={AttachmentFolderIcon} />
      <div className="folder-name">{name}</div>
    </div>
  );
};

export default FolderComponent;
