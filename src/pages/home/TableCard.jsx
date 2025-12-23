import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import {
  AscentSortIcon,
  DescentSortIcon,
  SortIcon,
} from "../../utills/imgConstants";
import EmptyComponent from "../../components/common/TableWrapper/EmptyComponent";

const TableCard = ({ icon, title, columns, data }) => {
  console.log("TableCard Data => ", data);

  // Only apply irate customer highlighting for Case History table
  const isCaseHistory = title === "Case History";

  return (
    <div className="table-card">
      <div className="table-card-header">
        <img src={icon} />
        <div className="table-card-title">{title}</div>
      </div>
      <div className="table-card-body">
        <DataTable
          value={data}
          className="table-card-table hide-last-row-border"
          rowClassName={
            isCaseHistory
              ? (rowData) => {
                  // Check if case is irate customer
                  if (
                    rowData?._source?.irateCustomer === true ||
                    rowData?._source?.irateCustomer === "Yes"
                  ) {
                    return "irate-customer-row";
                  }
                  return "";
                }
              : undefined
          }
          sortIcon={(options) => {
            // console.log("sort options", options?.sortOrder);
            if (options?.sortOrder == 1) {
              return <img src={AscentSortIcon} {...options.iconProps} />;
            } else if (options?.sortOrder == -1) {
              return <img src={DescentSortIcon} {...options.iconProps} />;
            } else {
              return <img src={SortIcon} {...options.iconProps} />;
            }
          }}
          emptyMessage={<EmptyComponent />}
        >
          {columns?.map((column, i) => (
            <Column
              key={i}
              field={column.field}
              header={column.title}
              body={column.body}
              sortable={column.sorter}
            ></Column>
          ))}
        </DataTable>
      </div>
    </div>
  );
};

export default TableCard;
