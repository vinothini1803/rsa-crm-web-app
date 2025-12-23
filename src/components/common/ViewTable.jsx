import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import EmptyComponent from "./TableWrapper/EmptyComponent";
import {
  AscentSortIcon,
  DescentSortIcon,
  NextImage,
  PrevImage,
  SortIcon,
} from "../../utills/imgConstants";
import { Dropdown } from "primereact/dropdown";

const ViewTable = ({
  data,
  rows,
  setRows,
  setFirst,
  first,
  Columns,
  scrollable,
  handlePagination,
  className,
  pagination,
  paginator,
}) => {
  const handlepageChange = (e) => {
    console.log("page change event", e);
    setRows(e.rows);
    setFirst(first ? e.rows * e.page : e.first);
  };
  const handlejumppage = (e, options) => {
    console.log("jump options", options);
    if (options.page > options.currentPage || options.currentPage == 0) {
      setFirst((options.currentPage + 4) * options.props.rows); //To set Page ---> update with index of data
    } else {
      setFirst((options.currentPage - 4) * options.props.rows);
    }
  };
  const paginatorTemplate = {
    layout: "RowsPerPageDropdown PrevPageLink PageLinks NextPageLink",
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={"paginator-prev"}
          onClick={options.onClick}
        >
          <img src={PrevImage} />
          <span className="p-3">Prev</span>
        </button>
      );
    },
    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={"paginator-next"}
          onClick={options.onClick}
        >
          <span className="p-3">Next</span>
          <img src={NextImage} />
        </button>
      );
    },
    PageLinks: (options) => {
      console.log("page link options", options);
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        return (
          <button
            type="button"
            className={options.className}
            onClick={(e) => handlejumppage(e, options)}
          >
            ...
          </button>
        );
      }
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
        >
          {options.page + 1}
        </button>
      );
    },
    RowsPerPageDropdown: (options) => {
      console.log("row per page classname", options);
      const dropdownOptions = [
        { label: "10 per page", value: 10 },
        { label: "20 per page", value: 20 },
        { label: "50 per page", value: 50 },
        { label: "100 per page", value: 100 },
      ];

      return (
        <Dropdown
          value={options.value}
          defaultValue={10}
          options={dropdownOptions}
          onChange={options.onChange}
          className="pagination-dropdown"
          style={{ marginRight: "auto" }}
        />
      );
    },
  };
  return (
    <DataTable
      value={data}
      scrollable={scrollable == false ? false : true}
      paginator={paginator}
      rows={rows}
      onPage={handlepageChange}
      rowsPerPageOptions={[10, 20, 50, 100]}
      paginatorTemplate={!pagination && paginatorTemplate}
      first={first}
      dataKey="id"
      sortIcon={(options) => {
        console.log("sort options", options?.sortOrder);
        if (options?.sortOrder == 1) {
          return <img src={AscentSortIcon} {...options.iconProps} />;
        } else if (options?.sortOrder == -1) {
          return <img src={DescentSortIcon} {...options.iconProps} />;
        } else {
          return <img src={SortIcon} {...options.iconProps} />;
        }
      }}
      className={className}
      // loading={loading}
      emptyMessage={<EmptyComponent />}
    >
      {Columns?.map(({ field, title, body, sorter }, index) => (
        <Column
          field={field}
          header={title}
          body={body}
          sortable={sorter}
        ></Column>
      ))}
    </DataTable>
  );
};

export default ViewTable;
