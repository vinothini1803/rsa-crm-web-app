import React, { useState} from "react";
import StatusBadge from "../../components/common/StatusBadge";
import TableActions from "../../components/common/TableActions";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import {
  client,
} from "../../../services/masterServices";
import { useMutation, useQuery } from "react-query";

const Customers = () => {
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const { data, isFetching, refetch } = useQuery(
    ["clientList", pagination],
    () =>
      client({
        apiType: "list",
        ...pagination,
      })
  );
  console.log("data", data)

  const columns = [
    //{ title: "Actions", field: "actions" },
    //{ title: "Contact ID", field: "contact_id" },
    { title: "First Name", field: "legalName" },
    { title: "Email ID", field: "email" },
    { title: "Phone Number", field: "contactNumber" },
    { title: "Owner Name", field: "tradeName" },
    //{ title: "Social", field: "social" },
    // { title: "Contact Role", field: "contact_role" },
    // { title: "Contact Status", field: "contact_status" },
    // { title: "Language", field: "language" },
    // { title: "Job Title", field: "job_title" },
    // { title: "City", field: "city" },
    // { title: "Dynamic Attributes", field: "dynamic_attributes" },
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
  };
  // const data = Array.from({ length: 1 }, (e, i) => {
  //   return {
  //     id: i,
  //     actions: <TableActions view={{ url: "/master" }} edit={{ url: "" }} />,
  //     contact_id: "C0001",
  //     first_name: "Arun Kumar",
  //     email_id: "arun1234@gmail.com",
  //     phone_number: "9876543211",
  //     owner_name: "--",
  //     social: "--",
  //     contact_role: "--",
  //     contact_status: "",
  //     language: "--",
  //     job_title: "--",
  //     city: "--",
  //     dynamic_attributes: "--",
  //     status: i % 2 == 0 ? "Active" : "Inactive",
  //     statusId: i % 2 == 0 ? 1 : 6,
  //   };
  // });
  
  const handleAdd = () => {};
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  }
  return (
    <TableWrapper
      title={"Customers"}
      columns={columns}
      data={data?.data?.data?.rows}
      totalRecords={data?.data?.data?.count}
      filterFields={{
        filterFields: ["service", "date", "Status"],
        filterData: filterData,
      }}
      onPaginationChange={handlepageChange}
      //totalRecords={data.length}
      className="tab-page"
      action={false}
      loading={isFetching}
    />
  );
};

export default Customers;
