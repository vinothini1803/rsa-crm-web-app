import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { useNavigate } from "react-router";
import StatusBadge from "../../../components/common/StatusBadge";
import { useMutation, useQuery } from "react-query";
import {
  aspFilterData,
  aspList,
  deleteAsp,
  exportASP,
  importASP,
  updateAspStatus,
} from "../../../../services/adminService";
import { toast } from "react-toastify";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { ImportFileBaseUrl } from "../../../utills/imgConstants";
import { download } from "../../../utills/download";

const ASPMaster = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState(null);
  const [filters, setFilters] = useState();
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const columns = [
    {
      title: "ASP Code",
      field: "code",
      body: (record, field) => (
        <div
          className="text-blue"
          onClick={() => navigate(`/admin/asp-master/view/${record?.id}`)}
        >
          {record.code}
        </div>
      ),
    },

    { title: "ASP Name", field: "name" },
    { title: "Workshop Name", field: "workshopName" },
    { title: "Contact Number", field: "contactNumber" },
    { title: "Own Patrol", field: "isOwnPatrol" },

    { title: "State", field: "stateName" },
    { title: "city", field: "cityName" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        // console.log("record", record, field);
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
  const { data, isFetching, refetch } = useQuery(
    ["aspmasterList", pagination, filters, searchValue],
    () =>
      aspList({
        ...pagination,
        ...filters,
        ...(searchValue && { search: searchValue }),
        apiType: "list",
      })
  );
  const { mutate, isLoading } = useMutation(deleteAsp);
  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateAspStatus);

  const { data: filterData } = useQuery(["aspFilterData"], () =>
    aspFilterData()
  );
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(importASP);
  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(exportASP);

  const handleAdd = () => {
    navigate("/admin/asp-master/add");
  };
  const handlepageChange = (offset, limit) => {
    // console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  const handleApplyFilter = (values) => {
    // console.log("asp filter", values);
    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      stateId: values?.state?.code,
      status: values?.status?.label,
    });
  };

  const handleEdit = (record) => {
    navigate(`/admin/asp-master/edit/${record?.id}`);
  };
  //handle Delete Dealer
  const handleDelete = (records, setVisible) => {
    // console.log("deleted record", records);
    mutate(
      {
        aspIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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
    // console.log(records, status);
    statusMutate(
      {
        aspIds: records?.map((row) => row.id),
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
          if (res?.data?.errorFilePath) {
            download(
              `${ImportFileBaseUrl}${res?.data?.errorFilePath}`,
              "ASP master"
            );
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setImportVisible(false);
            reset();
            refetch();
            if (res?.data?.errorFilePath) {
              download(
                `${ImportFileBaseUrl}${res?.data?.errorFilePath}`,
                "ASP master"
              );
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "ASP master");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "ASP master");
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
          title={"ASP Master"}
          columns={columns}
          data={data?.data?.data?.rows}
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
          rowSelection
          loading={isFetching}
          importAction={false}
          totalRecords={data?.data?.data?.count}
          onPaginationChange={handlepageChange}
          onSearch={handleSearch}
          addbtn={{ label: "New", onClick: handleAdd }}
          onFilterApply={handleApplyFilter}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onEdit={handleEdit}
          //onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
          // deleteLoading={isLoading}
          statusLoading={statusIsLoading}
          action={true}
          onImport={handleImport}
          onExport={handleExport}
        />
        <ImportDialog
          visible={importVisible}
          setVisible={setImportVisible}
          sampleExcel={`${ImportFileBaseUrl}/importTemplates/asp_master_import_template.xlsx`}
          masterType={"asp"}
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

export default ASPMaster;
