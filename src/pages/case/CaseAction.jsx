import React, { useRef } from "react";
import { DropdownIcon } from "../../utills/imgConstants";
import { Menu } from "primereact/menu";

const CaseAction = ({ onSendNotification, onAddReminder, items }) => {
  const actionmenu = useRef(null);

  return (
    <>
      <Menu
        model={items}
        popup
        ref={actionmenu}
        popupAlignment={"right"}
        className="case-action-menu"
      />
      <button
        className="btn-with-icon btn-text"
        onClick={(event) => actionmenu.current.toggle(event)}
        aria-controls="popup_menu_right"
        aria-haspopup
        disabled
      >
        <span>Actions</span>
        <img src={DropdownIcon} />
      </button>
    </>
  );
};

export default CaseAction;
