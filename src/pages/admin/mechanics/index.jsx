import React, { useState } from "react";
import { useNavigate } from "react-router";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { useMutation, useQuery } from "react-query";
import { ProfileUrl } from "../../../utills/imgConstants";
import {
  mechanicsList,
  aspMechanicImportMaster,
  aspMechanicExportMaster,
  updateMechanicStatus,
  deleteAspMechanics,
} from "../../../../services/adminService";
import { toast } from "react-toastify";
import Avatar from "../../../components/common/Avatar";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";
import { ImportFileBaseUrl } from "../../../utills/imgConstants";

const Mechanics = () => {
  const navigate = useNavigate();
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState();
  const { data, isFetching, refetch } = useQuery(
    ["mechanicsList", pagination, searchValue, filters],
    () =>
      //Need to update the Axios List
      mechanicsList({
        ...pagination,
        ...(searchValue && { search: searchValue }),
        ...filters,
        apiType: "list",
      })
  );

  const { mutate, isLoading } = useMutation(deleteAspMechanics);
  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateMechanicStatus);
  // console.log("user data", data?.data?.data?.rows);
  const { mutate: importMutate, isLoading: importIsLoading } = useMutation(
    aspMechanicImportMaster
  );
  const { mutate: exportMutate, isLoading: exportIsLoading } = useMutation(
    aspMechanicExportMaster
  );
  const columns = [
    { title: "MECHANIC CODE", field: "code" },
    { title: "MECHANIC Name", field: "name" },
    {
      title: "ASP TYPE",
      field: "aspType",
      body: (record, field) => record?.aspType?.name ?? "--",
    },
    { title: "Contact Number", field: "contactNumber" },
    {
      title: "Email ID",
      field: "email",
      body: (record, field) => record?.email ?? "--",
    },
    {
      title: "ADDRESS",
      field: "address",
      body: (record, field) => record?.address ?? "--",
    },
    {
      title: "Last Login",
      field: "lastLoginDateTime",
      body: (record, field) => record?.lastLoginDateTime ?? "--",
    },
    {
      title: "Login Status",
      field: "loginStatus",
      body: (record, field) => {
        // console.log("record?.loginStatus", record?.loginStatus);
        return (
          <>
            {record?.loginStatus ? (
              <StatusBadge
                text={record?.loginStatus}
                statusId={record?.loginStatus == "Active" ? 1 : 0}
                statusType={"activestatus"}
              />
            ) : (
              "--"
            )}
          </>
        );
      },
    },
    {
      title: "Mechanic Status",
      field: "mechanicStatus",
      body: (record, field) => {
        // console.log("record", record, field);
        return (
          <StatusBadge
            text={record?.status}
            statusId={record?.status == "Active" ? 1 : 0}
            statusType={"activestatus"}
          />
        );
      },
    },
  ];

  const handleAdd = () => {
    navigate("/admin/mechanics/add");
  };
  const handlepageChange = (offset, limit) => {
    // console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };
  const handleClose = () => {
    navigate("/admin/mechanics");
    reset(defaultValues);
  };
  const handleSearchChange = (value) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    setSearchValue(value);
  };

  const handleEdit = (record) => {
    navigate(`edit/${record.id}`);
  };

  const handleDelete = (records, setVisible) => {
    mutate(
      {
        aspMechanicIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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

  const handleStatusUpdate = (records, status, setVisible) => {
    // console.log(records, status);
    statusMutate(
      {
        aspMechanicIds: records?.map((row) => row.id),
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
              es?.data?.errors?.forEach((el) => toast.error(el));
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Mechanics");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setImportVisible(false);
            reset();
            refetch();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Mechanics");
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Mechanics");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Mechanics");
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };
  const handleApplyFilter = (values) => {
    // console.log("asp filter", values);
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
          title={"Mechanics"}
          className={"table-with-profile"}
          rowSelection
          columns={columns}
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          onPaginationChange={handlepageChange}
          // filterFields={{
          //   filterFields: ["designation", "role", "team", "Status"],
          // }}
          filterFields={{
            filterFields: ["activestatus"],
          }}
          exportAction={false}
          addbtn={{ label: "Add", onClick: handleAdd }}
          onSearch={handleSearchChange}
          onClick={handleClose}
          loading={isFetching}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onEdit={handleEdit}
          //onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
          //deleteLoading={isLoading}
          statusLoading={statusIsLoading}
          action={true}
          onImport={handleImport}
          onExport={handleExport}
          onFilterApply={handleApplyFilter}
        />
        <ImportDialog
          visible={importVisible}
          setVisible={setImportVisible}
          //sampleCSV={`${ImportFileBaseUrl}/importTemplates/aspMechanic_import_template.csv `}
          sampleExcel={`${ImportFileBaseUrl}/importTemplates/aspMechanic_import_template.xlsx `}
          masterType={"aspMechanics"}
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

export default Mechanics;
