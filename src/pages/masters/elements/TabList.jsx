import React from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import PageTabHeader from "../../../components/common/PageTabHeader";
import TableActions from "../../../components/common/TableActions";

const TabList = () => {
  const handletabChange = (tabkey) => {
    console.log("tabkey", tabkey);
  };
  const columns = [
    { title: "action", field: "action" },
    { title: "code", field: "code" },
    { title: "name", field: "name" },
    { title: "category", field: "category" },
    { title: "quantity", field: "quantity" },
  ];
  const data = Array.from({ length: 1000 }, (v, i, k) => {
    return {
      id: i,
      action: <TableActions view={{ url: "/master" }} edit={{ url: "" }} />,
      code: i + 1,
      name: "Bamboo Watch",
      category: "Accessories",
      quantity: "24",
    };
  });
  return (
    <div className="page-wrap">
      <PageTabHeader onchange={handletabChange} />
      <div className="page-body">
        <TableWrapper columns={columns} data={data} />
      </div>
    </div>
  );
};

export default TabList;
