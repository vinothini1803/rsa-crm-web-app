import React from "react";

const NameComponent = ({ name, email }) => {
  let AvatarText = name
    ?.split(/\s/)?.slice(0,2)
    ?.reduce((response, word) => (response += word.slice(0, 1)), "");

  return (
    <div className="name-container">
      <div className="name-avatar">{AvatarText?.toString()?.toUpperCase()}</div>
      <div className="detail-content-container">
        <div className="text-name">{name}</div>
        <div className="text-email">{(email &&  email?.toString()?.toLowerCase() !== 'null') ? email  : "--"}</div>
      </div>
    </div>
  );
};

export default NameComponent;
