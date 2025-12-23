import React, { useState } from "react";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../components/common/StatusBadge";

const FieldService = () => {
  const data = [
    {
      level: "Level 1",
      name: "Mr Prakash ( Dedicated SME)",
      contact_number: "7002080883",
      email: "prakash.nath@tvs.in",
      levelId: "1",
    },
    {
      level: "Level 2",
      name: "Mr. Suchitra Pradhan",
      contact_number: "6380352643",
      email: "Suchitra.pradhan@tvs.in",
      levelId: "2",
    },
    {
      level: "Level 3",
      name: "Mr. Karthik Mahendran",
      contact_number: "9894935241",
      email: "karthik.mahendiran@tvs.in",
      levelId: "3",
    },
    {
      level: "Level 4",
      name: "Mr Sriram",
      contact_number: "9600072770",
      email: "sriram.v@tvs.in",
      levelId: "4",
    },
  ];
  const [tableData, setTableData] = useState(data);
  const columns = [
    {
      title: "Level",
      field: "level",
      body: (record, field) => (
        <StatusBadge
          text={record?.level}
          className={"brdr-transparent level-badge"}
          statusId={record?.levelId}
          statusType={'levelstatus'}
        />
      ),
    },
    { title: "Name", field: "name", body: "" },
    { title: "Contact Number", field: "contact_number", body: "" },
    {
      title: "Email ID",
      field: "email",
      body: (record, field, value) => (
        <a className="text-blue text-decoration-underline">{record?.email}</a>
      ),
    },
  ];
  const handleSearchChange = (value) => {
    console.log("searchterm", value?.toLowerCase());
    setTableData(() =>
      data?.filter((el) => el.name.toLowerCase().includes(value?.toLowerCase()))
    );
  };
  return (
    <TableWrapper
      title={"Field Service"}
      className="tab-page"
      action={false}
      columns={columns}
      onSearch={handleSearchChange}
      data={tableData}
      totalRecords={tableData?.length}
    />
  );
};

export default FieldService;
