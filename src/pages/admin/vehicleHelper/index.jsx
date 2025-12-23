import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { useNavigate } from "react-router";
import StatusBadge from "../../../components/common/StatusBadge";
import { useMutation, useQuery } from "react-query";
import {
  deleteHelper,
  deleteVehicle,
  getVehicleList,
  gethelperlist,
  updateHelperStatus,
  updateVehicleStatus,
} from "../../../../services/adminService";
import { toast } from "react-toastify";
import { download } from "../../../utills/download";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { ownPatrolHelperExportMaster } from "../../../../services/adminService";
import { ownPatrolHelperImportMaster } from "../../../../services/adminService";
import { ImportFileBaseUrl } from "../../../utills/imgConstants";

const VehicleHelper = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState();
  const [selectedRows, setSelectedRows] = useState(null);
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);

  const { data, isFetching, refetch } = useQuery(
    ["helperlist", pagination, searchValue, filters],
    () =>
      gethelperlist({
        ...pagination,
        apiType: "list",
        ...(searchValue && { search: searchValue }),
        ...filters,
      })
  );
  const { mutate, isLoading } = useMutation(deleteHelper);

  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateHelperStatus);
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(ownPatrolHelperImportMaster);
  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(ownPatrolHelperExportMaster);
  const columns = [
    {
      title: "name",
      field: "name",
    },
    {
      title: "code",
      field: "code",
    },
    {
      title: "mobile number",
      field: "mobileNumber",
    },
    {
      title: "email",
      field: "email",
    },
    {
      title: "city",
      field: "cityName",
    },
    { title: "Created  Date & Time", field: "createdAt" },

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

  const handleAdd = () => {
    navigate("/admin/helper/add");
  };
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
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
    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      status: values?.status?.label,
    });
  };
  const handleEdit = () => {
    navigate(`/admin/helper/edit/${selectedRows[0].id}`);
  };
  //handle status update
  const handleStatusUpdate = (records, status, setVisible) => {
    console.log(records, status);
    statusMutate(
      {
        ownPatrolVehicleHelperIds: records?.map((row) => row.id),
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
  const handleDelete = (records, setVisible) => {
    console.log("deleted record", records);
    mutate(
      {
        ownPatrolVehicleHelperIds: records?.map((row) => row.id),
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "vehicle helper");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setImportVisible(false);
            reset();
            refetch();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "vehicle helper");
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "vehicle helper");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "vehicle helper");
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
          title={"COCO Vehicle Helper"}
          columns={columns}
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          onPaginationChange={handlepageChange}
          filterFields={{
            filterFields: ["activestatus"],
          }}
          rowSelection
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onEdit={handleEdit}
          // onDelete={handleDelete}
          action={true}
          loading={isFetching}
          statusLoading={statusIsLoading}
          // deleteLoading={isLoading}
          onFilterApply={handleApplyFilter}
          onSearch={handleSearchChange}
          addbtn={{ label: "New", onClick: handleAdd }}
          onStatusUpdate={handleStatusUpdate}
          onExport={handleExport}
          onImport={handleImport}
        />

        <ImportDialog
          visible={importVisible}
          setVisible={setImportVisible}
          //sampleCSV={`${ImportFileBaseUrl}/importTemplates/aspMechanic_import_template.csv `}
          sampleExcel={`${ImportFileBaseUrl}/importTemplates/ownPatrolVehicleHelper_import_template.xlsx`}
          masterType={"ownPatrolVehicleHelper"}
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

export default VehicleHelper;