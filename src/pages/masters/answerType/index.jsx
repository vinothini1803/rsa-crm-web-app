import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { useNavigate } from "react-router";
import StatusBadge from "../../../components/common/StatusBadge";
import { toast } from "react-toastify";
import {
  answerType,
  updateAnswerTypeStatus,
} from "../../../../services/masterServices";
import { useMutation, useQuery } from "react-query";

const AnswerType = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState(null);
  const [filters, setFilters] = useState();
  const [searchValue, setSearchValue] = useState("");

  const { data, isFetching, refetch } = useQuery(
    ["answerTypeList", pagination, searchValue, filters],
    () =>
      answerType({
        apiType: "list",
        ...pagination,
        ...(searchValue && { search: searchValue }),
        ...filters,
      })
  );

  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateAnswerTypeStatus);

  const columns = [
    { title: "Name", field: "name" },
    { title: "Field Type", field: "fieldType" },
    { title: "Created Date", field: "createdAt" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        return (
          <StatusBadge
            text={record.status}
            statusId={record.status == "Active" ? 1 : 0}
            statusType={"activestatus"}
          />
        );
      },
    },
  ];

  const handleAdd = () => {
    navigate("/master/answer-type/add");
  };

  const handleEdit = (record) => {
    navigate(`/master/answer-type/edit/${record.id}`);
  };

  const handlepageChange = (offset, limit) => {
    setPagination({
      offset: offset,
      limit: limit,
    });
  };

  const handleSearchChange = (value) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    setSearchValue(value);
  };

  const handleStatusUpdate = (records, status, setVisible) => {
    statusMutate(
      {
        answerTypeIds: records?.map((row) => row.id),
        status: status,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            refetch();
            setVisible(false);
            setSelectedRows();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleApplyFilter = (values) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      status: values?.status?.label,
    });
  };

  return (
    <div className="page-wrap">
      <div className="page-body">
        <TableWrapper
          title={"Answer Type"}
          rowSelection
          columns={columns}
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          onPaginationChange={handlepageChange}
          addbtn={{ onClick: handleAdd }}
          filterFields={{
            filterFields: ["activestatus"],
          }}
          onFilterApply={handleApplyFilter}
          onEdit={handleEdit}
          loading={isFetching}
          onSearch={handleSearchChange}
          action={true}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onStatusUpdate={handleStatusUpdate}
          statusLoading={statusIsLoading}
        />
      </div>
    </div>
  );
};

export default AnswerType;

