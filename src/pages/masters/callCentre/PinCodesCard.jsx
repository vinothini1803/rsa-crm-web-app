import React, { useState } from "react";
import "./style.less";
import { AutoComplete } from "primereact/autocomplete";
import { Chip } from "primereact/chip";
import { ChipCloseIcon, SearchIcon } from "../../../utills/imgConstants";

const PinCodesCard = () => {
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const search = (event) => {
    setItems([635110, 635111, 635112, 635113, 635114]);
  };
  const [selectedPinCodes, setSelectedPinCodes] = useState([
    635110, 635111, 635112, 635113, 635114, 635110, 635111, 635112, 635113,
    635114, 635110, 635111, 635112, 635113, 635114, 635110, 635111, 635112,
    635113, 635114, 635110, 635111, 635112, 635113, 635114,
  ]);

  const handleClearAll = () => {
    setSelectedPinCodes([]);
  };

  const handleRemove = (e, item) => {
    console.log("remove item", item);
    selectedPinCodes.splice(selectedPinCodes.indexOf(item), 1);

    setSelectedPinCodes([...selectedPinCodes]);
  };
  console.log("selectedPinCodes", selectedPinCodes);
  return (
    <div className="pincode-card">
      <div className="pincode-card-header">Add Pin codes</div>
      <div className="pincode-card-body">
        <AutoComplete
          className="pincode-autocomplete"
          value={value}
          suggestions={items}
          completeMethod={search}
          onChange={(e) => setValue(e.value)}
          pt={{
            panel: {
              className: "pincode-autocomplete-panel",
            },
          }}
          dropdown
          dropdownIcon={(options) => <img src={SearchIcon} />}
        />
        <div className="pincode-chip-container">
          {selectedPinCodes?.length > 0 &&
            selectedPinCodes?.map((item) => (
              <Chip
                label={item}
                removable
                removeIcon={
                  <div
                    onClick={(e) => handleRemove(e, item)}
                    className="chip-close-icon"
                  >
                    <ChipCloseIcon />
                  </div>
                }
                className="blue-closeable-chip"
                // onRemove={(e) => handleRemove(e, item)}
              ></Chip>
            ))}

          {selectedPinCodes?.length > 0 && (
            <button
              className="btn-link btn-text clear-all-btn"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinCodesCard;
