import React, { useState ,useEffect} from "react";
import Search from "./Search";
import { Checkbox } from "primereact/checkbox";

const ReportFieldsList = ({
  allFields,
  onChange,
  onSearchChange,
  onSelectAll,
  searchQuery,
}) => {

  const [checked,setChecked]=useState(false);
console.log('allFields on report',allFields)
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };


  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    onSelectAll(isChecked);
  };

  useEffect(() => {
    const allChecked=allFields.length > 0 && allFields.every(field =>field.checked);
    setChecked(allChecked);
  },[allFields])

  return (
    <div className="report-fieldlist-container">
      <div className="field-search-container">
        <Search
          placeholder={"Search Fields"}
          expand={true}
          className={"report-list-search"}
          onChange={handleSearchChange}
        />
      </div>

      <div className="report-field-list">
        {allFields.length === 0 ? (
          <div className="no-data">No data found</div>
        ) : (
          <>
            {!searchQuery && ( 
              <div className={"report-field"}>
                <Checkbox onChange={handleSelectAll} checked={checked}/>
                <div className="field-name">Select All</div>
              </div>
            )}

            {allFields.map((field, index) => (
              <div key={index} className={"report-field"}>
                <Checkbox
                  checked={field.checked}
                  onChange={() => onChange(field.id)}
                />
                <div className="field-name">{field?.name}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportFieldsList;
