import React, { useState } from "react";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { useNavigate } from "react-router";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import TableActions from "../../../components/common/TableActions";
import RequestResponeDialoag from "./RequestResponeDialoag";

const AddAspSyncCall = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [viewVisible, setViewVisible] = useState(false);
  const MenuItems = [
    { label: <div onClick={() => navigate("/reports")}>Reports</div> },
    { label: <div>ASP Sync Calls</div> },
  ];
  const handleView = () => {
    setViewVisible(true)
  };
  const columns = [
    { title: "Actions", field: "actions" },
    { title: "Case ID", field: "case_id" },
    {
      title: "Request & Response",
      field: "req_res",
      body: (record, field) => (
        <button className="btn-link btn-text" onClick={handleView}>
          View
        </button>
      ),
    },
    { title: "Created Date & time", field: "created_dt" },

    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
    },
  ];
  const data = Array.from({ length: 20 }, (e, i) => {
    return {
      id: i,
      actions: <TableActions  add={{url: ""}}/>,
      case_id: "CSE92746",
      created_dt: "19-01-2023 9:00AM",
     
      req_res: "--",
      status: i % 2 == 0 ? "closed" : "open",
      statusId: i % 2 == 0 ? 6 : 1,
    };
  });
  const handleDateChange = (value) => {
    console.log("dateValue",value)
    setDate(value)
  }
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };
  
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <TableWrapper
          title={"ASP Sync Calls"}
          columns={columns}
          
          data={data}
          expand={true}
          handleDateChange={handleDateChange}
          date={date}
          datepicker={true}
          filter={false}
          action={false}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          className={"table-with-profile"}
        />
      </div>
      <RequestResponeDialoag
        visible={viewVisible}
        setVisible={setViewVisible}
      />
    </div>
  );
};

export default AddAspSyncCall;
