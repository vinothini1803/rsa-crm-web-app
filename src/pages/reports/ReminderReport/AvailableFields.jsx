import React, { useState, useEffect } from "react";
import Search from "../../../components/common/Search";
import { Checkbox } from "primereact/checkbox";

const AvailableFields = ({
  availableFields,
  onChange,
  onSearchChange,
  onSelectAll,
}) => {
  const [allChecked, setAllChecked] = useState(false);

  // Check if all fields are selected
  useEffect(() => {
    const allSelected = availableFields?.every((field) => field.checked);
    setAllChecked(allSelected);
  }, [availableFields]);

  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleSelectAll = () => {
    onSelectAll(!allChecked); // Pass the inverse of current state
  };

  return (
    <div className="fields-container">
      <div className="fields-header">
        <Search
          placeholder={"Search"}
          expand={true}
          className={"report-field-search"}
          onChange={handleSearchChange}
        />

        <div className={"all-field"}>
          <Checkbox onChange={handleSelectAll} checked={allChecked} />
          <div className="field-name">Select All</div>
        </div>
      </div>

      <div className="fields-body">
        <ul className="fields-list">
          {availableFields?.map((field, i) => (
            <li key={i}>
              <div className={"field"}>
                <Checkbox
                  checked={field?.checked}
                  onChange={() => onChange(field?.id)}
                />
                <div className="field-name">{field?.name}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AvailableFields;
