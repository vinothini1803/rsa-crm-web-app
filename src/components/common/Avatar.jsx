import React from "react";
import { AvatarColors } from "../../utills/avatarColors";

const Avatar = ({ text, backgroundColor, className }) => {
  // console.log("backgroundColor", backgroundColor);
  return (
    <div className={`avatar-wrap ${className !== undefined ? className : ""}`}>
      <div
        className="avatar-content"
        style={
          backgroundColor !== undefined
            ? { backgroundColor: backgroundColor }
            : AvatarColors[text]
        }
      >
        {text}
      </div>
    </div>
  );
};

export default Avatar;
