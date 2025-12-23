import React, { useState ,useEffect} from "react";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "react-query";
import {
  deleteTds,
  exportTds,
  getTdsFilterData,
  tdsList,
} from "../../../services/tdsService";
import CurrencyFormat from "../../components/common/CurrencyFormat";
import TableActions from "../../components/common/TableActions";
import { toast } from "react-toastify";
import ExportDialog from "../../components/common/ExportDialog";
import { useSelector,useDispatch } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import moment from "moment";
import { download } from "../../utills/download";
import { SearchCall,setSearch } from "../../../store/slices/searchSlice";

const TDSList = () => {
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [exportVisible, setExportVisible] = useState(false);

  const [selectedRows, setSelectedRows] = useState(null);
  // const [searchValue, setSearchValue] = useState("");
    const dispatch = useDispatch();
    const searchValue = useSelector(SearchCall) || "";
  const [filters, setFilters] = useState({
    period: `${moment().startOf("month").format("DD-MM-YYYY")} - ${moment()
      .endOf("month")
      .format("DD-MM-YYYY")}`,
  });
  const navigate = useNavigate();
  const user = useSelector(CurrentUser);

  // console.log("user", user);
  const { data, isFetching, refetch } = useQuery(
    ["tdslist", pagination, searchValue, filters],
    () =>
      tdsList({
        ...(user?.userTypeId == 140 && { dealerCode: user?.code }),
        ...pagination,
        ...(searchValue && { searchKey: searchValue }),
        ...filters,
      }),
    {
      onSuccess: (response) => {
        if (!response?.data?.success) {
          if (response?.data?.error) {
            toast.error(response.data.error);
          } else {
            response?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    }
  );

  const { mutate, isLoading } = useMutation(deleteTds);

  const { data: filterData } = useQuery(["tdsfilterData"], () =>
    getTdsFilterData()
  );

  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(exportTds);
  // console.log("tdsList data", data);

  // console.log(
  //   "filterData",
  //   filterData,
  //   filterData?.data.data.extras.status_list
  // );
  const columns = [
    {
      title: "Actions",
      field: "actions",
      body: (record, field) => (
        <TableActions
          view={{
            url: `/tds/view/${record?.id}`,
          }}
          download={{
            url: record?.tdsCrmAttachmentUrl,
          }}
        />
      ),
    },
    {
      title: "From date",
      field: "from_date",
    },
    {
      title: "to Date",
      field: "to_date",
    },
    {
      title: "Customer code",
      field: "vendor_code",
    },
    {
      title: "Attachment Name",
      field: "attachment_name",
    },
    {
      title: "Amount",
      field: "amount",
      body: (record, field) =>
        record?.amount ? <CurrencyFormat amount={record?.amount} /> : "--",
    },
    {
      title: "Status",
      field: "status",
    },
    {
      title: "Done By",
      field: "done_by",
    },
    {
      title: "Created Date",
      field: "createdAt",
    },
  ];

  const handlepageChange = (offset, limit) => {
    // console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };

  const handleAdd = () => {
    navigate("/tds/addtds");
  };
  useEffect(() => {
     
      dispatch(setSearch(searchValue)); // Store search value in Redux
    }, []);
  const handleSearchChange = (value) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    // setSearchValue(value);
    dispatch(setSearch(value)); 
  };

  const handleDelete = (records, setVisible) => {
    // console.log();
    mutate(
      {
        ids: records?.reduce((acc, el) => acc.concat(String(el.id)), []),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVisible(false);
            refetch();
            setSelectedRows();
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

  const handleEdit = (record) => {
    navigate(`/tds/edittds/${record.id}`);
  };
  const handleExport = () => {
    setExportVisible(true);
  };
  const handleExportSubmit = (values, reset) => {
    // console.log("values", values);
    exportMutate(
      {
        ...(user?.role?.id == 2 && { dealerCode: user?.code }),
        filterPeriod: `${moment(values?.startDate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        )} - ${moment(values?.endDate, "YYYY-MM-DD").format("DD-MM-YYYY")}`,
        statusId: values?.status?.id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setExportVisible(false);
            reset();
            if (res?.data?.exportUrl) {
              download(`${res?.data?.exportUrl}`, "tdsreport");
            }
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

  const filterDataList = {
    activityStatus: filterData?.data.data.extras.status_list?.map(
      (activity) => {
        return {
          code: activity?.id,
          label: activity?.name,
        };
      }
    ),
  };

  const handleApplyFilter = (values) => {
    // console.log("delivery filterd values", values);
    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      ...(values.date && {
        period: `${moment(values.date.value[0]).format(
          "DD-MM-YYYY"
        )} - ${moment(values.date.value[1]).format("DD-MM-YYYY")}`,
      }),
      ...(values?.activityStatus && {
        statusId: values?.activityStatus?.code,
      }),
    });
  };

  const isRowSelectable = (e) => {
    // console.log("isRowSelectable", e);
    return e?.data?.status_id !== 2 ? true : false;
  };
  return (
    <div className="page-wrap">
      <div className="page-body">
        <TableWrapper
          title={"TDS"}
          columns={columns}
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          onPaginationChange={handlepageChange}
          exportAction={false}
          addbtn={
            user?.role?.id == 2 ? { label: "Add", onClick: handleAdd } : false
          }
          onEdit={handleEdit}
          onExport={handleExport}
          action
          onSearch={handleSearchChange}
          loading={isFetching}
          {...(user?.role?.id == 2
            ? {
                selectedRows: selectedRows,
                setSelectedRows: setSelectedRows,
                selectionMode: null,
                rowSelection: true,
              }
            : {})}
          isVisible
          onDelete={handleDelete}
          deleteLoading={isLoading}
          filterFields={{
            filterFields: ["activityStatus", "date"],
            filterData: filterDataList,
          }}
          onFilterApply={handleApplyFilter}
          isDataSelectable={isRowSelectable}
        />
        <ExportDialog
          visible={exportVisible}
          setVisible={setExportVisible}
          loading={exportIsLoading}
          onSubmit={handleExportSubmit}
          status={filterData?.data?.data?.extras?.status_list}
          formats="xlsx"
        />
      </div>
    </div>
  );
};

export default TDSList;
