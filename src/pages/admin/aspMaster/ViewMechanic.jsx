import React, { useState } from "react";
import { useNavigate } from "react-router";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import {
  CloseIcon,
  UserRightArrowIcon,
  UserShieldIcon,
} from "../../../utills/imgConstants";
import ViewGrid from "../../../components/common/ViewGrid";
import ViewTable from "../../../components/common/ViewTable";
import StatusBadge from "../../../components/common/StatusBadge";
import "./style.less";
const ViewMechanic = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(10);
  const [first, setFirst] = useState(0);
  const columns = [
    { title: "Device Name", field: "device_name" },
    { title: "OS", field: "os" },
    { title: "Created Date", field: "created_date" },
    { title: "Last Active Time", field: "last_active_time" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
    },
  ];

  const data = Array.from({ length: 5 }, (element, index, k) => {
    return {
      device_name: "Redmi Note 15",
      os: "Android",
      created_date: "19-01-2023 9:00AM",
      last_active_time: "19-01-2023 9:00AM",
      status: index % 2 == 0 ? "inActive" : "active",
      statusId: index % 2 == 0 ? 6 : 1,
    };
  });
  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/admin/asp-master")}>ASP Master</div>
      ),
    },
    {
      label: (
        <div onClick={() => navigate("/admin/asp-master/view")}>
          {" "}
          View ASP Master
        </div>
      ),
    },
    {
      label: (
        <div onClick={() => navigate("/admin/asp-master/view")}>
          {" "}
          View Mechanic
        </div>
      ),
    },
  ];
  const handleClose = () => {
    navigate("/admin/asp-master/view");
  };
  const BasicDetailsData = [
    {
      label: "Name",
      value: "Third Party ASP",
    },
    {
      label: "Code",
      value: "ART456",
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "Contact Number 1",
      value: "9876543211",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Alternate Contact Number",
      value: "9876543211",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Email ID",
      value: "Lokeshkumar@gmail.com",
    },
    {
      label: "Business Hours",
      value: "Mon, Tues, Wed, Thu, Fri, Saturday Sunday",
    },
    {
      label: "Role",
      value: "Mechanic",
    },
    {
      label: "Login status",
      value: "False",
      vlaueClassName: "info-badge info-badge-red",
    },
    {
      label: "Axapta Code",
      value: "MYSCTS0001",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Longitude",
      value: "98.428.4242.44",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Latitude",
      value: "98.428.4242.44",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Status",
      value: "Active",
      vlaueClassName: "info-badge info-badge-green",
    },
    {
      label: "Performance",
      value: "--",
    },
    {
      label: "Priority",
      value: "Normal",
      vlaueClassName: "info-badge info-badge-green",
    },
    {
      label: "Own Patrol",
      value: "--",
    },
    {
      label: "Regional Manager",
      value: "Kishore Kumar R",
    },
    {
      label: "Regional Manager  Number",
      value: "9876543211",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Address",
      value: "12/23, Shop 4, Titan township,Mathigiri, Hosur, Krishnagiri.",
    },
  ];
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={UserRightArrowIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">Mechanic</h5>
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
              <div className="view-table-title">Agent List</div>
              <ViewTable
                data={data}
                Columns={columns}
                first={first}
                setFirst={setFirst}
                rows={rows}
                // className={"asp-mechanic-table"}
                setRows={setRows}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMechanic;
