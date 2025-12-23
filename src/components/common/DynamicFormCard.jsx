import React from "react";
import { AddFieldIcon } from "../../utills/imgConstants";

const DynamicFormCard = ({
  title,
  addLabel,
  onAdd,
  children,
  subtitle,
  onClick,
  onRemove,
  removeIcon,
}) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <div className="dynamic-form-card">
      <div className="dynamic-card-header  d-flex align-items-center justify-content-between">
        {title}
        <span className="dynamic-card-header-left" onClick={handleClick}>
          {subtitle}
        </span>

        {removeIcon &&

          <button
            className="btn-text  text-danger"
            onClick={onRemove}
            type="button"

          >
            REMOVE
          </button>
        }
      </div>
      <div className="dynamic-card-body">{children}</div>
      <div className="dynamic-card-footer">
        {addLabel && (
          <button
            className="btn-link btn-text btn-with-icon add-btn"
            onClick={onAdd}
            type="button"
          >
            <img src={AddFieldIcon} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default DynamicFormCard;
