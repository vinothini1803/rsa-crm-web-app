import React, { useState } from 'react'
import TableWrapper from '../../../components/common/TableWrapper/TableWrapper';
import StatusBadge from '../../../components/common/StatusBadge';

const Customers = () => {
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const columns = [
    { title: "Customer ID", field: "customerID" },
    { title: "Customer Name", field: "customerName" },
    { title: "Contact Number", field: "contactNumber" },
    { title: "Email ID", field: "emailID" },
    { title: "State", field: "state" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
      sorter: true
    },
  ];
  const data = Array.from({ length: 30 }, (element, index, k) => {
    return {
      customerID: "English",
      customerName: "19-01-2023 9:00AM",
      contactNumber: "9876543211 , 9867453212",
      emailID: "afroze22@gmail.com",
      state: "19-01-2023 9:00AM",
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
      <div  className="page-body">
      <TableWrapper
          title={"Customers"}
          rowSelection
          columns={columns}
          data={data}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          // onAdd={handleAdd}
        />
      </div>
    </div>
  )
}

export default Customers;