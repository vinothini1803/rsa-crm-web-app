import React, { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import moment from "moment";

const NewCaseFilters = ({ 
  visible, 
  onHide, 
  onApply,
  filterOptions = {}, 
  fieldsConfig = [],
  newFilters
}) => {
  console.log("newFilters", newFilters)
  const [filters, setFilters] = useState({});
  useEffect(() => {
    if (Object.keys(newFilters).length === 0) {
      // Optional: if no filters at all
      setFilters({
        calendar: [],
      });
    } else {
      setFilters({
        ...newFilters,
        calendar: newFilters?.calendar?.length ? newFilters.calendar : [],
      });
    }
  }, [newFilters]);
  const handleChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value
    }));
  };
      const handleApply = () => onApply(filters);
      const handleClear = () => {
        const clearedFilters = {};
      
        fieldsConfig.forEach(({ key, type }) => {
          switch (type) {
            case "multiSelect":
              clearedFilters[key] = null;
              break;
            case "calendar":
              // Always generate new date instances
              clearedFilters[key] = null;
              break;
            case "text":
            case "dropdown":
            default:
              clearedFilters[key] = null;
              break;
          }
        });
      
        setFilters(clearedFilters);
        onApply(clearedFilters);
      };

      const renderField = (field) => {
        const { key, label, type = "dropdown" } = field;
        const options = filterOptions[key] || [];
    
        switch (type) {
          case "calendar":
  const Ranges = [
    {
      label: "Today",
      dateRange: [
        moment().startOf("day").toDate(),
        moment().startOf("day").toDate(),
      ],
    },
    {
      label: "This Week",
      dateRange: [
        moment().startOf("week").toDate(),
        moment().endOf("week").toDate(),
      ],
    },
    {
      label: "This Month",
      dateRange: [
        moment().startOf("month").toDate(),
        moment().endOf("month").toDate(),
      ],
    },
    {
      label: "Clear",
      clearDate: true,
    },
  ];

  const areDatesEqual = (a, b) =>
    moment(a).format("DD-MM-YYYY") === moment(b).format("DD-MM-YYYY");

  const areArraysEqual = (arr1, arr2) => {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    return arr1.every((el, i) => areDatesEqual(el, arr2[i]));
  };

  return (
    <div className="col-md-12" key={key}>
      <div className="form-group">
        <label className="form-label">{label}</label>
        <Calendar
          value={filters[key] || null}
          onChange={(e) => {
            handleChange(key, e.value);
          }}
          selectionMode="range"
          numberOfMonths={2}
          showIcon
          readOnlyInput
          placeholder="Select Date"
          dateFormat="dd/mm/yy"
          pt={{
            panel: { className: "defined-rangepicker" },
          }}
          footerTemplate={() => {
            return (
              <div className="rangecontainer">
                {Ranges.map((range, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (range.clearDate) {
                        handleChange(key, []);
                      } else {
                        handleChange(key, range.dateRange);
                      }
                    }}
                    className={`rangelabel ${
                      areArraysEqual(filters[key], range.dateRange)
                        ? "selected"
                        : ""
                    }`}
                  >
                    {range.label}
                  </div>
                ))}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
    
          case "text":
            return (
              <div className="col-md-12" key={key}>
                <div className="form-group"> 
                <label className="form-label">{label}</label>
                <InputText 
                  value={filters[key] || ""} 
                  onChange={(e) => handleChange(key, e.target.value)} 
                  placeholder="Enter" 
                />
                </div>
              </div>
            );
    
          case "multiSelect":
            return (
              <div className="col-md-12" key={key}>
                <div className="form-group">
                <label className="form-label">{label}</label>
                <MultiSelect 
                  value={filters[key] || []}
                  options={options}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => handleChange(key, e.value)}
                  placeholder="Select"
                  filter
                  //display="chip"
                  maxSelectedLabels={1}
                  className="form-control-select"
                />
                </div>
              </div>
            );
    
          case "dropdown":
          default:
            return (
              <div className="col-md-12" key={key}>
                <div className="form-group">
                <label className="form-label">{label}</label>
                <Dropdown 
                  value={filters[key] || null}
                  options={options}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => handleChange(key, e.value)}
                  placeholder="Select"
                />
                </div>
              </div>
            );
        }
      };
    
    return (
      <Sidebar visible={visible} position="right" className="filter-sidebar" onHide={onHide}>
        <h3 className="filter-title">Filters</h3>
        <div className="filter-containers">
          {fieldsConfig.map(renderField)}
        </div>
  
        <Divider />
  
        <div className="filter-buttons">
          <Button label="Clear All" className="p-button-text p-button-danger" onClick={handleClear} />
          <Button label="Apply Filter" className="p-button" onClick={handleApply} />
        </div>
      </Sidebar>
    );
  };
    

export default NewCaseFilters;
