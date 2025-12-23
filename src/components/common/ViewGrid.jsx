import React from "react";
import StatusBadge from "./StatusBadge";
import { Button } from "primereact/button";
import { ContactImage } from "../../utills/imgConstants";

const ViewGrid = ({ items, className }) => {
  const col = {
    "grid-4": 4,
    "grid-5": 5,
    "grid-3": 3,
  };
  // const col = className == "grid-4" ? 4 : "grid-5" ? 5 : 3;
  const groupedArray = [];

  for (let i = 0; i < items?.length; i += col[className]) {
    groupedArray?.push(items?.slice(i, i + col[className]));
  }
  // console.log("groupedArray", groupedArray);
  const Items = groupedArray
    ?.map((items, i) => {
      if (groupedArray?.length - 1 == i) {
        return items.map((el, i) => {
          return {
            ...el,
            itemClassName: "separator-none",
          };
        });
      }

      return items;
    })
    .flat();

  return (
    <>
      <ul className={`view-grid ${className ? className : ""}`}>
        {Items?.map((gridData, i) => (
          <li
            className={`view-grid-item ${
              gridData?.itemClassName ? gridData?.itemClassName : ""
            }`}
            key={i}
          >
            <div className="view-grid-item-wrap">
              <p className="view-grid-item-label">
                {gridData?.label && <span>{gridData.label}</span>}
                {gridData?.subLabel && (
                  <span className="sub-label">{gridData.subLabel}</span>
                )}
                {gridData?.labelIcon && (
                  <img
                    className={`img-fluid ${gridData?.labelIconClassname}`}
                    src={gridData?.labelIcon}
                  />
                )}
              </p>
              <div className="d-flex flex-wrap align-items-center gap-2">
                {gridData?.value && (
                  <div
                    className={`view-grid-item-value ${
                      gridData?.vlaueClassName ? gridData?.vlaueClassName : ""
                    }`}
                  >
                    {gridData.value}
                  </div>
                )}
                {gridData?.badge && (
                  <StatusBadge
                    className={"badge-view"}
                    text={gridData?.badge}
                    statusId={
                      gridData.statusId ? gridData?.statusId : gridData?.badge
                    }
                    statusType={gridData?.statusType}
                  />
                )}
                {gridData?.action && (
                  <>
                    {gridData.action == "Call" ? (
                      <a
                        className="view-grid-item-action"
                        // href={`tel:${gridData?.actionClick}`}
                        // onClick={(e) => e.preventDefault()}
                        // style={{
                        //   pointerEvents: "visible",
                        //   opacity: "0.6",
                        //   cursor: "not-allowed",
                        // }}
                      >
                        <img className="img-fluid" src={ContactImage} />
                        <span>{gridData.action}</span>
                      </a>
                    ) : (
                      <a
                        className="view-grid-item-action"
                        onClick={gridData?.actionClick}
                      >
                        {gridData.action}
                      </a>
                    )}
                  </>
                )}
                {gridData?.btnLink && (
                  <Button
                    link
                    className="btn-link"
                    onClick={gridData?.btnLinkAction}
                    disabled={
                      gridData?.btnDisabled ? gridData?.btnDisabled : false
                    }
                  >
                    {gridData?.btnLink}
                  </Button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ViewGrid;
