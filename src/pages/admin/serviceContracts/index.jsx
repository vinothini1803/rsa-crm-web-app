import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { useNavigate } from "react-router";

const ServiceContracts = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const columns = [
    { title: "Service Contracts", field: "serviceContracts" },
    { title: "Description", field: "description" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
      sorter: true,
    },
  ];
  const data = Array.from({ length: 3 }, (e, i) => {
    return {
      serviceContracts: "City Limit",
      description: "Distance To Dropdown",
      status: i % 2 == 0 ? "inActive" : "active",
      statusId: i % 2 == 0 ? 6 : 1,
    };
  });

  const handleAdd = () => {
    navigate("/admin/service-contracts/add");
  };
  const filterData = {
    service: [
      {
        code: 1,
        label: "Towing",
      },
      {
        code: 2,
        label: "Mechanical",
      },
    ],
    activityStatus: [
      {
        code: 2,
        label: "Active",
      },
      {
        code: 3,
        label: "Inactive",
      },
    ],
  };

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
          title={"Service Contracts Summary"}
          rowSelection
          columns={columns}
          data={data}
          action={false}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          filterFields={{
            filterFields: ["service", "activityStatus", "date",],
            filterData: filterData,
          }}
         importAction={true}
          addbtn={{label: "Add New",  onClick: handleAdd }}
        />
      </div>
    </div>
  );
};

export default ServiceContracts;
