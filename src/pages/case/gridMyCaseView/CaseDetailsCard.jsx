import React, { useRef } from "react";
import Avatar from "../../../components/common/Avatar";
import {
  AcceptedIcon,
  AssignIcon,
  BDIcon,
  MoreIcon,
  RescheduleIcon,
  UserGreyIcon,
  phoneGreyIcon,
} from "../../../utills/imgConstants";
import { Menu } from "primereact/menu";
import StatusBadge from "../../../components/common/StatusBadge";

const CaseDetailsCard = ({
  avatarbg,
  //innerRef,
  //provided,
  caseDetails,
  statusId,
}) => {
  const actionmenu = useRef(null);
  const items = [
    {
      label: "Send Notification",
    },
    {
      label: "Add Task",
    },

    {
      label: "Add Interaction",
    },
  ];

  const AvatarText = caseDetails?.customerContactName
    ?.split(" ")
    ?.splice(0, 2)
    .reduce((el, i) => `${el}${i.charAt(0).toUpperCase()}`, "");
  //console.log('caseDetails?.bdStatus', caseDetails?.bdStatus)
  return (
    <div
      className="casedetails-card p-4"
      //ref={innerRef}
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
    >
      <Menu
        model={items}
        popup
        //ref={actionmenu}
        popupAlignment={"right"}
        className="case-action-menu"
      ></Menu>
      <div className="case-detail-header">
        <Avatar
          text={AvatarText}
          backgroundColor={avatarbg}
          className={"case-avatar"}
        />
        <div className="case-title">
          <div className="case-name">{caseDetails?.service}</div>
          <div className="case-no">{caseDetails?.caseNumber}</div>
        </div>

        {/* <div
          className="more-action"
          onClick={(event) => actionmenu.current.toggle(event)}
        >
          <img src={MoreIcon} />
        </div> */}
      </div>
      <div className="case-detail-body">
        <div
          className="case-description"
           >
          {caseDetails?.subject}
        </div>

        <div className="badge-container">
          {caseDetails?.irateCustomer &&
            <StatusBadge
              text={"Irate Customer"}
              statusId={4}
              className={"rounded"}
              statusType="activityStatus"
            />
          }
          {caseDetails?.womenAssist &&
            <StatusBadge
              text={"Women Assist"}
              statusId={2}
              className={"rounded"}
              statusType="activityStatus"
            />
           }
        </div>

        <div className="content-with-icon">
          <img src={UserGreyIcon} />
          <div>{caseDetails?.customerContactName}</div>
        </div>

        <div className="content-with-icon">
          <img src={phoneGreyIcon} />
          <div>{caseDetails?.customerMobileNumber}</div>
        </div>
      </div>
      <div className="case-detail-footer ">
        <div className="case-date">{caseDetails?.createdAt}</div>
        {/* {statusId == 2 && (
          <button className="btn btn-with-icon btn-action case-card-btn">
            <img src={AssignIcon} alt="asp" />
            <span>Assign ASP</span>
          </button>
        )} */}

        {/* {statusId == 4 && (
          <button className="btn btn-with-icon btn-action case-card-btn">
            <img src={RescheduleIcon} alt="asp" />
            <span>Rescedule</span>
          </button>
        )} */}

        {statusId == 3 && (
          <>
            {caseDetails?.bdStatus == '1' && (
              <button className="btn btn-with-icon btn-action case-card-btn">
                <img src={BDIcon} alt="asp" />
                <span>Started to BD</span>
              </button>
            )}
            {caseDetails?.bdStatus == '2' && (
              <button className="btn btn-with-icon btn-action case-card-btn">
                <img src={BDIcon} alt="asp" />
                <span>Reached to BD</span>
              </button>
            )}
            {caseDetails?.bdStatus == '3' && (
              <button className="btn btn-with-icon btn-action success-btn case-card-btn">
                <img src={AcceptedIcon} alt="asp" />
                <span>Accepted</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CaseDetailsCard;
