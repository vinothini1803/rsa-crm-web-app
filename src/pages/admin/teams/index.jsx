import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { useNavigate } from "react-router";

const Teams = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const columns = [
    { title: "Team Name", field: "teamName" ,body: (record, field) => (
      <div className="text-blue" onClick={() => navigate("/admin/teams/view")}>
        {record.teamName}
      </div>
    ), },
    { title: "Business Hours", field: "busineshours" },
    { title: "Number of agents", field: "numberOfAgents" },
  ];
  const data = Array.from({ length: 30 }, (e, i) => {
    return {
      teamName: "TVS Mobility",
      busineshours: "24/7",
      numberOfAgents: "12",
    };
  });
  const handleAdd = () => {
    navigate("/admin/teams/add");
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
          title={"Team"}
          rowSelection
          columns={columns}
          data={data}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          filterFields={{
            filterFields: ["Status", "date",],
          }}
          addbtn={{label: "New Team" ,onClick: handleAdd}}
        />
      </div>
    </div>
  );
};

export default Teams;
