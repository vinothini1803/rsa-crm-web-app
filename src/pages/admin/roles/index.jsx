import React from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { useNavigate } from "react-router";
import StatusBadge from "../../../components/common/StatusBadge";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  deleteRole,
  roleList,
  updateStatus,
} from "../../../../services/roleService";
import { toast } from "react-toastify";

const Roles = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState(null);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState();
  const [searchValue, setSearchValue] = useState(null);

  const { data, isFetching, refetch } = useQuery(
    ["rolelist", pagination, filters, searchValue],
    () =>
      roleList({
        ...pagination,
        ...filters,
        ...(searchValue && { search: searchValue }),
        apiType: "list",
      })
  );
  const { mutate, isLoading } = useMutation(deleteRole);
  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateStatus);
  const columns = [
    {
      title: "Role name",
      field: "name",
    },
    { title: "Display Name", field: "displayName" },
    { title: "Created At", field: "createdAt" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        // console.log("record", record, field);
        return (
          <StatusBadge
            text={record.status}
            statusId={record.statusId}
            statusType={"roleStatus"}
          />
        );
      },
    },
  ];
  // const data = Array.from({ length: 30 }, (e, index) => {
  //   return {
  //     roleName: "Super Admin",
  //     created: "19-01-2023 9:00AM",
  //     numberOfUsers: "12",
  //     status: index % 2 == 0 ? "inActive" : "active",
  //     statusId: index % 2 == 0 ? 6 : 1,
  //   };
  // });
  const handleAdd = () => {
    navigate("/admin/roles/add");
  };
  const handlepageChange = (offset, limit) => {
    // console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };

  const handleRowSelect = (rows) => {
    // console.log("selected rows", rows);
    setSelectedRows(rows);
  };

  const handleEdit = (record) => {
    navigate(`/admin/roles/edit/${record?.id}`);
  };

  const handleDelete = (records, setVisible) => {
    // console.log("deleted record", records);
    mutate(
      {
        roleIds: records?.reduce((acc, el) => acc.concat(el.id), []),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setSelectedRows(null);
            setVisible(false);
            refetch();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleStatusUpdate = (records, status, setVisible) => {
    statusMutate(
      {
        roleIds: records?.reduce((acc, el) => acc.concat(el.id), []),
        status: status,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setSelectedRows(null);
            setVisible(false);
            refetch();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };
  const handleApplyFilter = (values) => {
    // console.log("asp filter", values);
    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      statusId: values?.status?.code,
    });
  };
  const handleSearchChange = (value) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    setSearchValue(value);
  };
  return (
    <div className="page-wrap">
      <div className="page-body">
        <TableWrapper
          title={"Roles"}
          rowSelection
          columns={columns}
          data={data?.data?.data?.rows}
          // filterFields={{
          //   filterFields: ["activestatus"],
          // }}
          // onFilterApply={handleApplyFilter}
          onSearch={handleSearchChange}
          loading={isFetching}
          totalRecords={data?.data?.data?.count}
          onPaginationChange={handlepageChange}
          addbtn={{ label: "New Role", onClick: handleAdd }}
          action={false}
          onEdit={handleEdit}
          // onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
          deleteLoading={isLoading}
          statusLoading={statusIsLoading}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
    </div>
  );
};

export default Roles;
