import React, { useMemo, useState, useEffect } from "react";
import '../style.less';

const SelectableButtons = ({ items, onSelect, defaultItems, multiple, className, disabled }) => {
  const [selectedItems, setSelectedItems] = useState(defaultItems || []);

  const handleChannels = (e, id) => {
    e.preventDefault();
    console.log("channel id", id);
    if (multiple) {
      const index = selectedItems.indexOf(id);
      console.log("selected Index", index);
      if (index == -1) {
        setSelectedItems((prev) => [...prev, id]);
        onSelect([...selectedItems, id]);
      } else {
        setSelectedItems((prev) =>
          prev.filter((channelId) => id !== channelId)
        );
        onSelect(selectedItems.filter((channelId) => id !== channelId));
      }
    } else {
      console.log("selected id", id);
      setSelectedItems([id]);
      onSelect([id]);
    }
  };
  // console.log("selectedBtns", selectedItems, "compont render", defaultItems);

  useEffect(() => {
    if(defaultItems?.length > 0) {
      setSelectedItems(defaultItems);
    } else {
      setSelectedItems([]);
    }
  }, [defaultItems])

  return items?.map((item, i) => (
    <button
      className={`btn-white select-btn ${className ? className : ""} ${
        selectedItems.includes(item.id) ? "btn-selected" : "btn-not-selected"
      }`}
      key={i}
      onClick={(e) => handleChannels(e, item.id)}
      disabled={disabled ? true : false}
    >
      {item.label}
    </button>
  ));
};
export default SelectableButtons;
