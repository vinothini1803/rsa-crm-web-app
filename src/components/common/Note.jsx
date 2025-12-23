import React from "react";
import {
  NoteInfoDangerIcon,
  NoteInfoGreenIcon,
  NoteInfoIcon,
} from "../../utills/imgConstants";

const Note = ({ type, icon, children, purpose, title, style }) => {
  const Icons = {
    success: <NoteInfoGreenIcon />,
    danger: <NoteInfoDangerIcon />,
    info: <NoteInfoIcon />,
  };
  return (
    <div
      className={`note-container ${purpose} ${
        title ? "flex-column" : "flex-row"
      }   note-${type}`}
      style={style}
    >
      {icon && (
        <div className="note-header">
          <div className="note-icon">{Icons[type]}</div>
          {title && <span className="note-title">Note</span>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Note;
