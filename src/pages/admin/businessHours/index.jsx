import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { useNavigate } from "react-router";
import StatusBadge from "../../../components/common/StatusBadge";

const BusinessHours = () => {
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/admin/business-hours/add");
  };
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const columns = [
    { title: "Business Hours", field: "business_hours" },
    { title: "Description", field: "description" },
    { title: "Created", field: "created" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
    },
  ];
  
  const data = Array.from({ length: 20 }, (e, index) => {
    return {
      business_hours: "24/7",
      description: "Monday work day",
      created: "19-01-2023 9:00AM",
      status: index % 2 == 0 ? "inActive" : "active",
      statusId: index % 2 == 0 ? 6 : 1,
    };
  });
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  }
  return (
    <div className="page-wrap">
      <div className="page-body">
        <TableWrapper
          title={"Business Hours"}
          rowSelection
          columns={columns}
          data={data}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          filterFields={{
            filterFields: ["Status", "date",],
        
          }}
          addbtn={{ label: "New", onClick: handleAdd }}
          action={false}
        />
      </div>
    </div>
  );
};

export default BusinessHours;
