import React from "react";

const PercentageBar = ({ items }) => {
  return (
    <div className="bar-container">
      {items?.map((bar, i) => (
        <div
          key={i}
          className="bar"
          style={{ width: "20%", background: bar.color }}
        ></div>
      ))}
    </div>
  );
};

export default PercentageBar;
