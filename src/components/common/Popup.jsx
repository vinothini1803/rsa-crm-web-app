import React,{useState} from "react";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import { lazy } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import Loadable from "./Loadable";
import { add } from "../../utills/imgConstants";
import "../../../src/assets/styles/pop.less"

const Popup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [isMinimized, setIsMinimized] = useState(false);
  const [popupRoute, setPopupRoute] = useState("/home");
  const [hasOpened, setHasOpened] = useState(false)

  // Define routes for popup navigation
  const Home = Loadable(lazy(() => import("../../pages/homePop")));
  const CaseCreation = Loadable(lazy(() => import("../../pages/caseCreationPop")));

  const renderPopupContent = () => {
    switch (popupRoute) {
      case "/home":
        return <Home navigateTo={setPopupRoute} onClose={onClose} hasOpened={hasOpened}/>;
      case "/case-creation":
        return <CaseCreation navigateTo={setPopupRoute} />;
      default:
        return <div>Page Not Found</div>;
    }
  };

  //const popupContent = useRoutes(popupRoutes);

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
    setHasOpened(true);
  };
  if (isMinimized) {
    return (
      <div
        className="minimize"
        onClick={toggleMinimize}
      >
        <img src={add}/>
      </div>
    );
  }

  return (
    <div
    className="pop flex flex-col items-center justify-center min-h-screen bg-gray-100"
    >
      <div
        className="pop-propagation"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <div className="min-close">
          {/* Minimize button */}
          <button
            className="min"
            onClick={toggleMinimize}
          >
            &#x2212; {/* Minus sign for minimize */}
          </button>
          {/* Close button */}
          <button
            className="close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div style={{ overflow: "auto", height: "100%" }}>

          {/* Example of navigation inside the popup */}
          {renderPopupContent()}
            </div>
     </div>
    </div>
  );
};

export default Popup;
