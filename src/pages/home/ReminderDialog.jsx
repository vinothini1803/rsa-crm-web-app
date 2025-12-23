// import React from "react";
// import { Dialog } from "primereact/dialog";
// import {
//   CloseCircleIcon,
//   CloseIcon,
//   DialogCloseSmallIcon,
//   ReminderDialogIcon,
//   UserShieldIcon,
// } from "../../utills/imgConstants";
// import { Chip } from "primereact/chip";
// const ReminderDialog = ({ visible, setVisible }) => {
//   return (
//     <Dialog
//       header={
//         <div className="dialog-header">
//           <img src={ReminderDialogIcon} />
//           <div className="dialog-header-title">Reminder</div>
//         </div>
//       }
//       closeIcon={<img src={DialogCloseSmallIcon} />}
//       className="reminder-dialog"
//       visible={!visible}
//       position={"bottom-right"}
//       modal={false}
//       draggable={false}
//       onHide={()=>setVisible(false)}
//     >
//       <div className="dialog-main-content">
//         <Chip
//           label="Royal Sundaram Diversion"
//           className="info-chip blue reminder-chip"
//         />

//         <div className="asp-detail-container">
//           <img src={UserShieldIcon} />

//           <span className="asp-name">Ajay Sharma</span>
//         </div>
//         <div>Call ASP to collect activity status.</div>
//         <div className="reminder-actions">
//           <button className="btn btn-primary">Call</button>
//           <button className="btn btn-white">Update Status</button>
//           <button className="btn btn-link view-case-btn">View Case</button>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default ReminderDialog;
