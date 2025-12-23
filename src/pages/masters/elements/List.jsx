import React from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import TableActions from "../../../components/common/TableActions";

const List = () => {
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
      action: <TableActions view={{ url: "/static/view" }} edit={{ url: "" }} />,
      code: i + 1,
      name: "Bamboo Watch",
      category: "Accessories",
      quantity: "24",
    };
  });
  const handleFilters = () => {
    console.log("filter applied successfully");
  };
  return (
    <div className="page-wrap">
      <div className="page-body">
        <TableWrapper
          columns={columns}
          data={data}
          rowSelection={true}
          loading={false}
          onFilterApply={handleFilters}
        />
      </div>
    </div>
  );
};

export default List;
