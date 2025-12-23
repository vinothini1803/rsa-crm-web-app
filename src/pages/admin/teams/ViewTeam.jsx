import React, { useState } from "react";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { useNavigate } from "react-router";
import {
  CloseIcon,
  NextImage,
  PrevImage,
  ProfileImage,
  UserGroup,
} from "../../../utills/imgConstants";
import ViewGrid from "../../../components/common/ViewGrid";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import EmptyComponent from "../../../components/common/TableWrapper/EmptyComponent";
import StatusBadge from "../../../components/common/StatusBadge";
import { Dropdown } from "primereact/dropdown";
import "./style.less";
import ViewTable from "../../../components/common/ViewTable";

const ViewTeam = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(10);
  const [first, setFirst] = useState(0);
  const MenuItems = [
    { label: <div onClick={() => navigate("/admin/teams")}>Teams</div> },
    { label: <div>View Team</div> },
  ];
  const handleClose = () => {
    navigate("/admin/teams");
  };
  const BasicDetailsData = [
    {
      label: "Name",
      value: "sudipta.ghish1@concentrix.com",
    },
    {
      label: "Call Center",
      value: "Call Center 1",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Business Hours",
      value: "24 × 7",
      vlaueClassName: "info-badge info-badge-purple",
    },

    {
      label: "Can Own Cases",
      value: "No",
      vlaueClassName: "info-badge info-badge-red",
    },

    { label: "Description", value: "Supervisory Team, Supervisory Team" },
  ];
  const columns = [
    {
      title: "Photo",
      field: "photo",
      body: (record, field) => {
        console.log("record", record, field);
        return <img src={ProfileImage} className="agent-table-list-photo" />;
      },
    },
    { title: "First Name", field: "firstName" },
    { title: "Designation", field: "designation" },
    { title: "Role", field: "role" },
    { title: "Email ID", field: "emailID" },
    { title: "Phone Number", field: "phoneNumber" },
    { title: "Last Login", field: "lastLogin" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
    },
  ];

  const data = Array.from({ length: 25 }, (element, index, k) => {
    return {
      firstName: "Arun Kumar",
      designation: "ASP",
      role: "Agent",
      emailID: "arun1234@gmail.com",
      phoneNumber: "9876543211",
      lastLogin: "19-01-2023  9:00AM",
      status: index % 2 == 0 ? "inActive" : "active",
      statusId: index % 2 == 0 ? 6 : 1,
    };
  });

  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img className="img-fluid" src={UserGroup} alt="Title Icon" />
                </div>
                <div>
                  <h5 className="page-content-title">TVS Mobility</h5>
                </div>
              </div>
              <div className="page-content-header-right">
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
          </div>
          <div className="page-content-body">
            <div className="border-box bg-white">
              <ViewGrid items={BasicDetailsData} className="grid-4" />
            </div>
            <div>
              <div className="agent-list-title">Agent List</div>
              <ViewTable
                data={data}
                Columns={columns}
                first={first}
                setFirst={setFirst}
                rows={rows}
                setRows={setRows}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTeam;
