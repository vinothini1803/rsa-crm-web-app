import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import StatusBadge from "../components/common/StatusBadge";
import CustomBreadCrumb from "../components/common/CustomBreadCrumb";
import CustomFileUpload from "../components/common/CustomFileUpload";
import { AvatarColors } from "../utills/avatarColors";
import Avatar from "../components/common/Avatar";
import Note from "../components/common/Note";
import TimerChip from "../components/common/TimerChip";
import { CloseIcon, DialogCloseIcon, FolderIcon } from "../utills/imgConstants";
import CaseDetail from "../components/common/CaseDetail";
import NameComponent from "../components/common/NameComponent";
import PercentageBar from "../components/common/PercentageBar";

const Components = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState("center");
  const [primaryModalVisible, setPrimaryModalVisible] = useState(false);
  const breadcrumbItems = [
    {
      label: <div onClick={() => navigate("/master")}>ASP</div>,
      //url: "/master",
    },
    { label: "View ASP" },
    { label: "ASP" },
    { label: "View ASP" },
  ];

  const handleRemove = (event) => {
    console.log("remove event", event);
  };

  //Modal Footer Content
  const modalFooterContent = (
    <div>
      <Button
        label="Cancel"
        className="p-button-secondary p-button-text"
        onClick={() => setModalVisible(false)}
      />
      <Button label="Save" onClick={() => setModalVisible(false)} autoFocus />
    </div>
  );

  // Open Modal
  const showModal = (position) => {
    setModalPosition(position);
    setModalVisible(true);
  };

  //Go Back
  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={breadcrumbItems} />
      <div
        className="page-body"
        //style={{ height: "calc(100vh - 135px)", overflowY: "auto" }}
      >
        <div className="page-content-wrap view-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={FolderIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">Components</h5>
                </div>
              </div>
              <div className="page-content-header-right">
                <button className="btn btn-close" onClick={goBack}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
          </div>
          {/* <!-- Page Content Header --> */}
          <div className="page-content-body">
            <div className="page-content-body-view">
              {/* StatusBadge */}
              <div className="mb-5">
                <h5>StatusBadge</h5>
                <div className="d-flex gap-3_4">
                  <StatusBadge text={"Open"} statusId={1} />
                  <StatusBadge text={"UnAssigned"} statusId={2} />
                  <StatusBadge text={"Inprogress"} statusId={3} />
                  <StatusBadge text={"Irate Customer"} statusId={4} />
                  <StatusBadge text={"On-Hold"} statusId={5} />
                  <StatusBadge text={"Closed"} statusId={6} />
                </div>
              </div>
              {/* BreadCrumb */}
              <div className="mb-5">
                <h5>BreadCrumb</h5>
                <CustomBreadCrumb items={breadcrumbItems} />
              </div>
              {/* Timer Chip */}
              <div className="mb-5">
                <h5>Timer Chip</h5>
                <div className="d-flex gap-3_4">
                  <TimerChip label="SLA Violated" type="danger" />
                  <TimerChip label="5 min left" type="warning" />
                  <TimerChip label="14 min left" type="success" />
               
                </div>
              </div>
              {/* Custom Upload */}
              <div className="mb-5">
                <h5>Custom Upload</h5>
                <div>
                  <CustomFileUpload />
                </div>
              </div>
              {/* Avatar */}
              <div className="d-flex flex-column gap-3_4 mb-5">
                <h5>Avatar</h5>
                <div className="d-flex gap-3_4">
                  {Object.keys(AvatarColors).map((text, i) => (
                    <Avatar text={text} key={i} />
                  ))}
                </div>
              </div>
              {/* Note */}
              <div className="d-flex flex-column gap-3_4 mb-5">
                <h5>Note</h5>

                <Note type={"info"} icon={true} purpose={"note"}>
                  <div>
                    Comparison of ASP’s based on distance, travel time and many
                    more parameters. Comparison between ASP’s have been carried
                    out to help you identify to make best decision for selecting
                    the nearest ASP.
                  </div>
                </Note>
                <Note type={"dark"} icon={false} purpose={"detail"}>
                  <div>
                    Ask the ASP to capture his current location, though the SMS
                    which will be sent after updating status.
                  </div>
                </Note>

                <Note type={"info"} icon={false} purpose={"detail"}>
                  <div className="d-flex flex-column" style={{ gap: "8px" }}>
                    <div style={{ color: "#A06218", fontWeight: 600 }}>
                      Previous Case Feedback
                    </div>
                    <div>
                      Good towing assistance and customer handling, quick action
                      has been taken from the action has View More.
                    </div>
                  </div>
                </Note>
                <Note type={"danger"} icon={false} purpose={"note"}>
                  <div>
                    <span style={{ fontWeight: 700, marginRight: "7px" }}>
                      NOTE :
                    </span>
                    Add a new service after completion or when an additional
                    service is requested.
                  </div>
                </Note>
              </div>
              {/* Tag */}
              <div className="mb-5">
                <h5>Custom tag</h5>
                <Chip
                  label="filter1"
                  removable
                  onRemove={handleRemove}
                  className="closeable-chip"
                ></Chip>
              </div>
              {/* Modal */}
              <div className="card p-3">
                <h5>Modal Dialog</h5>
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-2">
                  <Button
                    label="Left"
                    icon="pi pi-arrow-right"
                    onClick={() => showModal("left")}
                    className="p-button-help"
                    style={{ minWidth: "10rem" }}
                  />
                  <Button
                    label="Center"
                    icon="pi pi-arrows-h"
                    onClick={() => showModal("center")}
                    className="p-button-help"
                    style={{ minWidth: "10rem" }}
                  />
                  <Button
                    label="Right"
                    icon="pi pi-arrow-left"
                    onClick={() => showModal("right")}
                    className="p-button-help"
                    style={{ minWidth: "10rem" }}
                  />
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-2">
                  <Button
                    label="TopLeft"
                    icon="pi pi-arrow-down-right"
                    onClick={() => showModal("top-left")}
                    className="p-button-warning"
                    style={{ minWidth: "10rem" }}
                  />
                  <Button
                    label="Top"
                    icon="pi pi-arrow-down"
                    onClick={() => showModal("top")}
                    className="p-button-warning"
                    style={{ minWidth: "10rem" }}
                  />
                  <Button
                    label="TopRight"
                    icon="pi pi-arrow-down-left"
                    onClick={() => showModal("top-right")}
                    className="p-button-warning"
                    style={{ minWidth: "10rem" }}
                  />  
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-2">
                  <Button
                    label="BottomLeft"
                    icon="pi pi-arrow-up-right"
                    onClick={() => showModal("bottom-left")}
                    className="p-button-success"
                    style={{ minWidth: "10rem" }}
                  />
                  <Button
                    label="Bottom"
                    icon="pi pi-arrow-up"
                    onClick={() => showModal("bottom")}
                    className="p-button-success"
                    style={{ minWidth: "10rem" }}
                  />
                  <Button
                    label="BottomRight"
                    icon="pi pi-arrow-up-left"
                    onClick={() => showModal("bottom-right")}
                    className="p-button-success"
                    style={{ minWidth: "10rem" }}
                  />
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <Button
                    label="Custom Modal"
                    icon="pi pi-arrows-h"
                    onClick={() => setPrimaryModalVisible(true)}
                    className="p-button-primary"
                    style={{ minWidth: "10rem" }}
                  />
                </div>

                <Dialog
                  header="Header"
                  className="modal-lg"
                  visible={modalVisible}
                  position={modalPosition}
                  onHide={() => setModalVisible(false)}
                  footer={modalFooterContent}
                  draggable={false}
                  resizable={false}
                >
                  <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                </Dialog>

                <Dialog
                  header="Header"
                  visible={primaryModalVisible}
                  closeIcon={<DialogCloseIcon />}
                  position="bottom"
                  onHide={() => setPrimaryModalVisible(false)}
                  footer={modalFooterContent}
                  draggable={false}
                  resizable={false}
                >
                  <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                </Dialog>
              </div>
              <div className="d-flex flex-column gap-3_4">
                <h5>case Detail</h5>
                <CaseDetail />
              </div>
              <div className="d-flex flex-column gap-3_4">
                <h5>Name component</h5>
                <NameComponent
                  name={"Ajay Sharma"}
                  email={"ajaysharma@gmail.com"}
                />
              </div>
              <div className="d-flex flex-column gap-3_4">
                <h5>PercentageBar</h5>
                <PercentageBar
                  items={[
                    { label: "Towing", value: 6, color: "#794B2F" },
                    { label: "Cab", value: 3, color: "#AC2A25" },
                    { label: "Hotel", value: 2, color: "#FF762A" },
                    { label: "Fuel", value: 8, color: "#FECC3F" },
                    { label: "BreakDown", value: 8, color: "#1BA9D2" },
                  ]}
                />
              </div>
            </div>
          </div>
          {/* <!-- Page Content Body --> */}
        </div>
        {/* <!-- Page Content Wrap --> */}
      </div>
      {/* <!-- Page Body --> */}
    </div>
  );
};

export default Components;
