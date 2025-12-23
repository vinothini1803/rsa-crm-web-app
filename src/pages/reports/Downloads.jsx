import React, { useState } from "react";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";

const Downloads = () => {
  const [searchValue, setSearchValue] = useState(null);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const columns = [
    {
      title: "Date",
      field: "date",
    },
    {
      title: "Report",
      field: "report",
    },
    {
      title: "Request name",
      field: "name",
    },
    {
      title: "Action",
      field: "",
      body: (record, field) => (
        <a className="link-text" download>
          Download
        </a>
      ),
    },
  ];

  const data = [
    {
      date: "12-06-2024, 8:43 AM",
      report: "Client Report",
      name: "Arun Kumar R",
    },
  ];
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };

  const handleSearchChange = () => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    setSearchValue(value == "" ? null : value);
  };
  return (
    <TableWrapper
      title={"Downloads"}
      columns={columns}
      totalRecords={120}
      data={data}
      className="tab-page"
      onPaginationChange={handlepageChange}
      action={false}
      onSearch={handleSearchChange}
    />
  );
};

export default Downloads;
