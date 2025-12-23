import React from "react";

const TabMenuItem = ({ label, badge, badgeClassName }) => {
  return (
    <div className="tab-menu-item">
      <span className="tab-menu-item-text">{label}</span>
      {badge && (
        <span className={`tab-menu-item-badge ${badgeClassName}`}>{badge}</span>
      )}
    </div>
  );
};

export default TabMenuItem;
