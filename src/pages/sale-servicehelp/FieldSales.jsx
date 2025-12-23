import React, { useState } from "react";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";

const FieldSales = () => {
  const data = [
    {
      sno: "1",
      name: "Deepak Jha ",
      role: "ZM- North, Central & East",
      zone: "North, Cental & East",
      base_location: "Delhi",
      state: "North, Cental & East",
      contact_number: "7400087137",
      email: "deepak.kumar@tvs.in",
    },
    {
      sno: "2",
      name: "Ashfaque",
      role: "RM-Sales",
      zone: "North  ",
      base_location: "Delhi",
      state: "DL, NCR, HR , CH, PB , J&K & HP",
      contact_number: "9952042994",
      email: "ashfaque.alam@tvs.in ",
    },
    {
      sno: "3",
      name: "Kuldeep Yadav",
      role: "RM-Sales",
      zone: "North",
      base_location: "Chandigarh",
      state: "PB,CH,J&K, HP",
      contact_number: "9569701057",
      email: "kuldeep.yadav@tvs.in",
    },
    {
      sno: "4",
      name: "Ashish Tiwari",
      role: "RM-Sales",
      zone: "Central",
      base_location: "Lucknow",
      state: "UK,UP, MP & CG",
      contact_number: "9807222023",
      email: "Ashish.tiwari@tvs.in",
    },
    {
      sno: "5",
      name: "Manishankar",
      role: "RM-Sales",
      zone: "Central",
      base_location: "Indore",
      state: "MP & CG",
      contact_number: "7869006876",
      email: "Manishankar.sahu@tvs.in",
    },
    {
      sno: "6",
      name: "Abdul Razique",
      role: "RM-Sales",
      zone: "East",
      base_location: "Patna",
      state: "East Region (BR, JH, OD, WB, SK,AS & North East State)",
      contact_number: "9911047578",
      email: "abdul.razique@@tvs.in",
    },
    {
      sno: "7",
      name: "Debarpito Mondal",
      role: "RM-Sales",
      zone: "East",
      base_location: "Kolkata",
      state: "WB, SK,AS & North East State",
      contact_number: "8370887141",
      email: "debarpito.mondal@tvs.in",
    },
    {
      sno: "8",
      name: "Jitendra Kumar",
      role: "ZM - West",
      zone: "West",
      base_location: "Jaipur",
      state: "GJ, RJ,MH",
      contact_number: "7665555939",
      email: "Jitendrakumar.Sharma@tvs.in",
    },
    {
      sno: "9",
      name: "Narender",
      role: "RM - Sales",
      zone: "West",
      base_location: "Jaipur",
      state: "RJ",
      contact_number: "9799143698",
      email: "narendra.kumawat@tvs.in",
    },
    {
      sno: "10",
      name: "Aravind Yesodharan",
      role: "RM - Sales",
      zone: "West",
      base_location: "Ahemdabad",
      state: "GJ",
      contact_number: "8433971334",
      email: "aravind.yesodharan@tvs.in",
    },
    {
      sno: "11",
      name: "Karan Bagkar",
      role: "RM - Sales",
      zone: "West",
      base_location: "Mumbai",
      state: "MUMBAI",
      contact_number: "8108527378",
      email: "karan.bagkar@tvs.in",
    },
    {
      sno: "12",
      name: "Genovinith",
      role: "RM - Sales",
      zone: "West",
      base_location: "Pune",
      state: "Rest of MH",
      contact_number: "9920056057",
      email: "genovinith.gnanmony@tvs.in",
    },
    {
      sno: "13",
      name: "Vimalraj",
      role: "ZM- South",
      zone: "South",
      base_location: "Coimbatore",
      state: "AP,TL,KA,KL,GA",
      contact_number: "9626667771",
      email: "vimalraj.mani@tvs.in",
    },
    {
      sno: "14",
      name: "Kunal Kumar",
      role: "RM-Sales",
      zone: "South",
      base_location: "Bengaluru",
      state: "KA, GA",
      contact_number: "9108466875",
      email: "kunal.kumar@tvs.in",
    },
    {
      sno: "15",
      name: "Ravindra",
      role: "RM-Sales",
      zone: "South",
      base_location: "Hyderabad",
      state: "AP, TL",
      contact_number: "9642210506",
      email: "Ravindra.kadebagil@tvs.in",
    },
    {
      sno: "16",
      name: "Ravikumar",
      role: "RM-Sales",
      zone: "South",
      base_location: "Chennai",
      state: "TN 1",
      contact_number: "9840097451",
      email: "ravikumar.elumalai@tvs.in",
    },
  ];
  const [tableData, setTableData] = useState(data?.slice(0, 10));
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const columns = [
    { title: "SL No", field: "sno" },
    { title: "Name", field: "name" },
    { title: "Role", field: "role" },
    { title: "Zone", field: "zone" },
    { title: "State", field: "state" },
    { title: "Base Location", field: "base_location" },
    { title: "Contact Number", field: "contact_number" },
    {
      title: "Email ID",
      field: "email",
      body: (record, field, value) => (
        <a className="text-blue text-decoration-underline">{record?.email}</a>
      ),
    },
  ];

  console.log(
    "sliced data",
    data?.slice(pagination.offset, pagination?.offset + pagination?.limit)
  );

  //handle pagination change
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
    setTableData(() => data?.slice(offset, offset + limit));
  };
  const handleSearchChange = (value) => {
    setPagination({
      limit: 10,
      offset: 0,
    });

    console.log("searchterm", value?.toLowerCase());
    setTableData(() =>
      data?.filter((el) => el.name.toLowerCase().includes(value?.toLowerCase()))
    );
  };
  return (
    <TableWrapper
      title={"Field Sales"}
      className="tab-page"
      action={false}
      columns={columns}
      data={tableData}
      onPaginationChange={handlepageChange}
      onSearch={handleSearchChange}
      totalRecords={data?.length}
    />
  );
};

export default FieldSales;
