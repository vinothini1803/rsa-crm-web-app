import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "react-query";
import {
  dealer,
  dealerFilterData,
  deleteDealer,
  exportDealer,
  importDealer,
  updateDelearStatus,
} from "../../../../services/masterServices";
import { toast } from "react-toastify";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";
import { ImportFileBaseUrl } from "../../../utills/imgConstants";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../../store/slices/userSlice";

const Dealers = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [filters, setFilters] = useState();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });

  const { data, isFetching, refetch } = useQuery(
    ["dealerList", pagination, searchValue, filters],
    () =>
      dealer({
        ...pagination,
        apiType: "list",
        ...(searchValue && { search: searchValue }),
        ...filters,
      })
  );

  const { data: filterData } = useQuery(["dealerFilters"], () =>
    dealerFilterData()
  );
  const { mutate, isLoading } = useMutation(deleteDealer);
  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateDelearStatus);
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(importDealer);
  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(exportDealer);

  const loggedUser = useSelector(CurrentUser);
  const columns = [
    {
      title: "Dealer Code",
      field: "code",
      body: (record, field) => (
        <div
          className="text-blue"
          onClick={() =>
            loggedUser?.role?.id != 31
              ? navigate(`/admin/dealers/view/${record?.id}`)
              : navigate(`/dealers/view/${record?.id}`)
          }
        >
          {record.code}
        </div>
      ),
    },
    { title: "Dealer Name", field: "name" },
    { title: "Client Name", field: "clientName" },
    {
      title: "State",
      field: "stateName",
    },
    {
      title: "City",
      field: "cityName",
    },
    { title: "created at", field: "createdAt" },
    // { title: "RSA Person Name", field: "rsapersonName" },
    // { title: "RSA Person Number", field: "rsapersonNumber", sorter: true },
    // { title: "Mechanical Type", field: "mechanicalType", sorter: true },
    // { title: "Body Part Type", field: "bodypartType" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return (
          <StatusBadge
            text={record.status}
            statusType={"activestatus"}
            statusId={record.status == "Active" ? 1 : 0}
          />
        );
      },
    },
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
    navigate("/admin/dealers/add");
  };
  const handleEdit = () => {
    navigate(`/admin/dealers/edit/${selectedRows[0].id}`);
  };
  //handle Delete Dealer
  const handleDelete = (records, setVisible) => {
    console.log("deleted record", records);
    mutate(
      {
        dealerIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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
  //handle status update
  const handleStatusUpdate = (records, status, setVisible) => {
    console.log(records, status);
    statusMutate(
      {
        dealerIds: records?.map((row) => row.id),
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
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  //handle Search change
  const handleSearchChange = (value) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    setSearchValue(value);
  };
  const handleApplyFilter = (values) => {
    console.log("asp filter", values);
    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      stateId: values?.state?.code,
      status: values?.status?.label,
    });
  };

  const handleImport = () => {
    setImportVisible(true);
  };
  const handleExport = () => {
    setExportVisible(true);
  };

  const handleImportSubmit = (formData, reset) => {
    importMutate(formData, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setImportVisible(false);
          reset();
          refetch();
          if (res?.data?.path) {
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Dealers");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setImportVisible(false);
            reset();
            refetch();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Dealers");
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };
  const handleExportSubmit = (values, reset) => {
    exportMutate(values, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setExportVisible(false);
          reset();
          if (res?.data?.path) {
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Dealers");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Dealers");
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };
  return (
    <div className="page-wrap">
      <div className="page-body">
        <TableWrapper
          title={"Dealer"}
          // rowSelection
          {...(loggedUser?.role?.id != 31 ? { rowSelection: true } : {})}
          columns={columns}
          data={data?.data?.data?.rows}
          loading={isFetching}
          filterFields={{
            filterFields: ["state", "activestatus"],
            filterData: {
              state: filterData?.data?.data.extras.states?.map((state) => {
                return {
                  label: state.name,
                  code: state.id,
                };
              }),
            },
          }}
          totalRecords={data?.data?.data?.count}
          onPaginationChange={handlepageChange}
          // addbtn={{ onClick: handleAdd }}
          {...(loggedUser?.role?.id != 31
            ? { addbtn: { onClick: handleAdd } }
            : {})}
          onEdit={handleEdit}
          // onDelete={handleDelete}
          onFilterApply={handleApplyFilter}
          onStatusUpdate={handleStatusUpdate}
          // deleteLoading={isLoading}
          statusLoading={statusIsLoading}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onSearch={handleSearchChange}
          action={true}
          {...(loggedUser?.role?.id != 31
            ? { onImport: { handleImport } }
            : {})}
          onExport={handleExport}
        />
        <ImportDialog
          visible={importVisible}
          setVisible={setImportVisible}
          //sampleCSV={`${ImportFileBaseUrl}/importTemplates/dealer_master_import_template.csv`}
          sampleExcel={`${ImportFileBaseUrl}/importTemplates/dealer_master_import_template.xlsx`}
          masterType={"dealer"}
          onSubmit={handleImportSubmit}
          loading={importIsLoading}
        />
        <ExportDialog
          visible={exportVisible}
          setVisible={setExportVisible}
          loading={exportIsLoading}
          onSubmit={handleExportSubmit}
          formats="xlsx"
          dateRangeOptional={true}
        />
      </div>
    </div>
  );
};

export default Dealers;
