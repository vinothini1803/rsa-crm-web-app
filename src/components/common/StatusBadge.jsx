import React from "react";

const StatusBadge = ({
  text,
  statusId,
  className,
  color,
  backgroundColor,
  statusType,
}) => {
  let badgeStatus;
  // const defaultIds = [1,'default']

  const obj = {
    caserequestStatus: {
      1: "purple",
      2: "warning",
      3: "danger",
      4: "success",
    },
    activityStatus: {
      1: "purple",
      2: "info",
      3: "warning", //Inprogress
      4: "danger",
      5: "danger",
      6: "orange",
      7: "success",
      8: "danger",
      9: "pastelorange",
      10: "success",
      11: "lightblue",
      12: "gold",
      13: "grey",// Not Picked
      14:"success"
    },
    paymentStatus: {
      980: "warning", //pending
      981: "success", //success
      982: "danger", //failed
    },
    levelstatus: {
      1: "success",
      2: "yellow",
      3: "purple",
      4: "danger",
      5: "info"
    },
    roleStatus: {
      0: "danger",
      1: "success",
      
    },
    activestatus:{
      1:"success",
      0:"danger"
    },
    agentProductivityStatus: {
      1: "success",  // Active
      2: "warning",  // Idle
      3: "info",     // Present
      4: "danger",   // Absent
      5: "orange",   // Break
      6: "lightblue" // Lunch
    },
    paymentStatusId: {
      190: "warning", //pending
      191: "success", //success
      192: "danger", //failed
    },
    psfStatus: {
      1: "danger", // Not Completed
      2: "success", // Completed
    },
    refundStatus: {
      1301: "warning", // Pending
      1302: "success", // Processed
      1303: "danger", // Failed
    },
    cancellationStatus: {
      1311: "warning", // Waiting for BO Approval
      1312: "danger", // Cancellation Rejected
      1313: "success", // Cancelled
    },
   };

  //console.log("<<<<<",statusType, statusId)

  let statusColor = obj[statusType]?.[String(statusId)];

  return (
    <div
      className={`status-badge-container badge-${statusColor} ${
        className ? className : ""
      }`}
    >
      <div>{text}</div>
    </div>
  );
};

export default StatusBadge;
