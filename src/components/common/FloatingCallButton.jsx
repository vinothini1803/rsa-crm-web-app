import React, { useState, useRef } from "react";
import { FloatingCallButtonIcon } from "../../utills/imgConstants";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useSelector } from "react-redux";
import { selectCurrentPassword } from "../../../store/slices/passwordSlice";
import "../../../src/assets/styles/pop.less";

const FloatingCallButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const iframeRef = useRef(null);

  const toggleIframe = () => {
    setIsVisible(!isVisible);
  };

  const user = useSelector(CurrentUser);
  const password = useSelector(selectCurrentPassword);

  const loginUrl = `https://agent.cloudagent.ozonetel.com/login?customer=ki_mobility&agentid=${user?.userName}&phoneNumber=511654&pin=${password}&action=formLogin`;
console.log("loginUrl", loginUrl)
  return (
    <div className="floating-call-container">
      {/* Floating Button */}
      <button onClick={toggleIframe} className="floating-icon-button">
        <img src={FloatingCallButtonIcon} alt="Floating Call Button" />
      </button>

      {/* Iframe remains mounted but visibility toggles */}
      <div className={`iframe-container ${isVisible ? "visible" : "hidden"}`}>
        {/* <button className="close-button" onClick={toggleIframe}>✖</button> */}
        <iframe
          ref={iframeRef}
          src={loginUrl}
          title="Agent Login"
          allow="microphone; notifications; autoplay; accelerometer; camera; geolocation; encrypted-media; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          className="responsive-iframe"
        ></iframe>
      </div>
    </div>
  );
};

export default FloatingCallButton;
