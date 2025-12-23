import React, { useState } from "react";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";

const Interactions = () => {
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const columns = [
    { title: "Subject", field: "subject" },
    { title: "Account Name", field: "accountName" },
    { title: "Contact Name", field: "contactName" },
    { title: "Contact Mobile", field: "contactMobile" },
    { title: "Created Date", field: "createdDate" },
  ];
  const data = Array.from({ length: 3 }, (e, i) => {
    return {
      subject: "RSA",
      accountName: "Royal Sundaram - Diversion",
      contactName: "Balaji",
      contactMobile: "9876543211,7894563211",
      createdDate: "03-03-2023, 9:30 AM",
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
          title={"Interactions"}
          columns={columns}
          data={data}
          action={false}
          expand={true}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
        />
      </div>
    </div>
  );
};

export default Interactions;
