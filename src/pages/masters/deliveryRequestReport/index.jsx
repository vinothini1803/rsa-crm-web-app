import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { useNavigate } from "react-router";
import moment from "moment";
import { useQuery,useMutation } from "react-query";
import {
    roleBasedColumnList,
    delRoleBasedColumn
} from "../../../../services/masterServices";
import { toast } from "react-toastify";

const CustomReportColumns = () => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [filters, setFilters] = useState({
        startDate: moment().startOf("month").format("YYYY-MM-DD"),
        endDate: moment().endOf("month").format("YYYY-MM-DD"),
    });
    const [pagination, setPagination] = useState({
        offset: 0,
        limit: 10,
    });
    const { mutate, isLoading } = useMutation(delRoleBasedColumn);

    const { data, isFetching, refetch } = useQuery(
        ["roleBasedColumnList", pagination, searchValue, filters],
        () =>
            roleBasedColumnList({
                ...pagination,
                ...(searchValue && { search: searchValue }),
                // ...filters,
            })
    );

    const columns = [
        {
            title: "Role",
            field: "name",
        },
        { title: "Column Count", field: "columnCount" },
        { title: "Created Date", field: "createdAt" },
    ];

    //handle Pagination
    const handlepageChange = (offset, limit) => {
        console.log("offset", offset, limit);
        setPagination({
            offset: offset,
            limit: limit,
        });
    };

    const handleAdd = () => {
        navigate("/admin/deliveryRequestReport/add");
    };
    const handleEdit = () => {
        navigate(`/admin/deliveryRequestReport/edit/${selectedRows[0].roleId}/${selectedRows[0].id}`);
    };

    console.log()

    //handle Search change
    const handleSearchChange = (value) => {
        setPagination({
            limit: 10,
            offset: 0,
        });
        setSearchValue(value);
    };
    //handle Filters change
    const handleApplyFilter = (values) => {
        setPagination({
            limit: 10,
            offset: 0,
        });
        setFilters({
            ...(values.date && {
                startDate: moment(values.date.value[0]).format("YYYY-MM-DD"),
                endDate: moment(values.date.value[1]).format("YYYY-MM-DD"),
            }),
        });
    };

      //handle Delete Dealer
  const handleDelete = (records, setVisible) => {
    console.log("deleted record", records);
    mutate(
      {
        id: records?.reduce((acc, el) => acc.concat(el.id), []),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setSelectedRows();
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
    return (
        <div className="page-wrap">
            <div className="page-body">
                <TableWrapper
                    title={"Delivery Request Report Setting"}
                    rowSelection
                    columns={columns}
                    data={data?.data?.data?.rows}
                    loading={isFetching}
                    totalRecords={data?.data?.data?.count}
                    onPaginationChange={handlepageChange}
                    addbtn={{ onClick: handleAdd }}
                    onEdit={handleEdit}
                    // filterFields={{
                    //     filterFields: ["date"],
                    //   }}
                    onFilterApply={handleApplyFilter}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    onSearch={handleSearchChange}
                    action={false}
                    isVisible={true}
                    /* deleteLoading={isLoading}
                    onDelete={handleDelete} */
                />
            </div>
        </div>
    );
};

export default CustomReportColumns;
