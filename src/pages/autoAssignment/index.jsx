import React, { useState } from "react";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../components/common/StatusBadge";

const AutoAssignment = () => {
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const columns = [
    {
      title: "Case ID",
      field: "caseId",
    },
    {
      title: "Workshop Name",
      field: "workshopName",
    },
    {
      title: "Account Name",
      field: "accountName",
    },
    {
      title: "Vehicle No",
      field: "vehicleNo",
    },
    {
      title: "Contact No",
      field: "contactNo",
    },
    {
      title: "Created Date",
      field: "createdDate",
    },

    {
      title: "SMS STATUS",
      field: "smsStatus",
      body: (record, field) => (
        <StatusBadge text={record.smsStatus} statusId={record.smsStausId} />
      ),

      sorter: true,
    },

    {
      title: "Notification Status",
      field: "notificationStatus",
      body: (record, field) => (
        <StatusBadge
          text={record.notificationStatus}
          statusId={record.notificationStatusId}
        />
      ),

      sorter: true,
    },
  ];

  const handleAdd = () => {};
  const data = Array.from({ length: 60 }, (e, i) => {
    return {
      caseId: "f2d71937-73ba-4861-915c-457a26c1fefa",
      workshopName: "INP Mapp/Mango Towing",
      accountName: "Renualtaa",
      vehicleNo: "TN70AM2694",
      contactNo: "9876543211,7894563211",
      createdDate: "03-03-2023, 9:30 AM",
      smsStatus: "Sent",
      smsStausId: 1,
      notificationStatus: "Not Sent",
      notificationStatusId: 6,
    };
  });
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };
  return (
    <div className="page-wrap">
      <div className="page-body">
        <TableWrapper
          title={"Auto Assignments"}
          columns={columns}
          data={data}
          addbtn={{ label: "Add" }}
          action={false}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          filterFields={{
            filterFields: ["date", "Status"],
          }}
        />
      </div>
    </div>
  );
};

export default AutoAssignment;
