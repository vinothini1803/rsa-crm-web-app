import React, { useState } from "react";
import { useForm } from "react-hook-form";
import StatusBadge from "../../components/common/StatusBadge";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import TableActions from "../../components/common/TableActions";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "react-query";
import {
  client,
  clientStatusUpdate,
  deleteClient,
  clientImport,
  clientExport,
  serviceImport,
  serviceExport,
  clientEntitlementImport,
  clientEntitlementExport,
} from "../../../services/masterServices";
import { toast } from "react-toastify";
import { ImportFileBaseUrl } from "../../utills/imgConstants";
import ImportDialog from "../../components/common/ImportDialog";
import ExportDialog from "../../components/common/ExportDialog";
import { download } from "../../utills/download";

const Accounts = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState();
  const [selectedRows, setSelectedRows] = useState(null);
  const [importVisible, setImportVisible] = useState(false);
  const [importServiceVisible, setImportServiceVisible] = useState(false);
  const [importClientEntitlementVisible, setImportClientEntitlementVisible] =
    useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [exportServiceVisible, setExportServiceVisible] = useState(false);
  const [exportClientEntitlementVisible, setExportClientEntitlementVisible] =
    useState(false);

  const { data, isFetching, refetch } = useQuery(
    ["clientList", searchValue, filters],
    () =>
      client({
        apiType: "list",
        ...pagination,
        ...filters,
        ...(searchValue && { search: searchValue }),
      })
  );
  const { mutate: deletemutate, isLoading: deleteIsLoading } =
    useMutation(deleteClient);
  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(clientStatusUpdate);
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(clientImport);
  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(clientExport);
  const { mutate: importServiceMutate, isLoading: importServiceIsLoading } =
    useMutation(serviceImport);
  const { mutate: exportServiceMutate, isLoading: exportServiceIsLoading } =
    useMutation(serviceExport);
  const {
    mutate: importClientEntitlementMutate,
    isLoading: importClientEntitlementIsLoading,
  } = useMutation(clientEntitlementImport);
  const {
    mutate: exportClientEntitlementMutate,
    isLoading: exportClientEntitlementIsLoading,
  } = useMutation(clientEntitlementExport);

  const columns = [
    /*  { title: "S.no", field: "id" }, */
    {
      title: "Actions",
      field: "actions",
      body: (record, field) => (
        <TableActions view={{ url: `/clients/view/${record.id}` }} />
      ),
    },
    { title: "Name", field: "name" },
    { title: "Axapta Code", field: "axaptaCode" },
    { title: "Business Category", field: "businessCategoryName" },
    { title: "Legal Name", field: "legalName" },
    { title: "Trade Name", field: "tradeName" },
    /*  { title: "Service Contract", field: "service_contract" },
    { title: "Account Code", field: "account_code" },
    { title: "Dealer Option", field: "dealer_option" }, */
    { title: "Invoice Name", field: "invoiceName" },
    { title: "Invoice Code", field: "invoiceCode" },
    { title: "GSTIN", field: "gstin" },
    { title: "Customer Toll Free", field: "customerTollFreeNumber" },
    { title: "Created Date", field: "createdAt" },
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

  // Form Add function
  const handleAdd = () => {
    navigate("/clients/add");
    window.location.reload();
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
  const filterData = {
    service: [
      {
        code: 1,
        label: "Towing",
      },
      {
        code: 2,
        label: "Mechanical",
      },
    ],
  };
  // pagination change function
  const handlepageChange = (offset, limit) => {
    // console.log("offset", offset, limit);
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
  const handleDelete = (records, setVisible) => {
    // console.log("deleted record", records);
    deletemutate(
      {
        clientIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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
  const handleStatusUpdate = (records, status, setVisible) => {
    // console.log(records, status);
    statusMutate(
      {
        clientIds: records?.map((row) => row.id),
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

  const handleEdit = (record) => {
    navigate(`/clients/edit/${record.id}`);
  };
  const handleImport = () => {
    setImportVisible(true);
  };
  const handleExport = () => {
    setExportVisible(true);
  };
  const handleServiceImport = () => {
    setImportServiceVisible(true);
  };
  const handleServiceExport = () => {
    setExportServiceVisible(true);
  };

  const handleClientEntitlementImport = () => {
    setImportClientEntitlementVisible(true);
  };
  const handleClientEntitlementExport = () => {
    setExportClientEntitlementVisible(true);
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
              "Clients"
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
                "Clients"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Clients");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Clients");
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };
  // Service Entitlement import and export
  const handleImportServiceSubmit = (formData, reset) => {
    importServiceMutate(formData, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setImportServiceVisible(false);
          reset();
          refetch();
          if (res?.data?.errorFilePath) {
            download(
              `${ImportFileBaseUrl}${res?.data?.errorFilePath}`,
              "Service"
            );
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setImportServiceVisible(false);
            reset();
            refetch();
            if (res?.data?.errorFilePath) {
              download(
                `${ImportFileBaseUrl}${res?.data?.errorFilePath}`,
                "Service"
              );
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };

  const handleExportServiceSubmit = (values, reset) => {
    exportServiceMutate(values, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setExportServiceVisible(false);
          reset();
          if (res?.data?.path) {
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Service");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportServiceVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Service");
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };
  // console.log("importVisible", importVisible);

  const handleImportClientEntitlementSubmit = (formData, reset) => {
    importClientEntitlementMutate(formData, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setImportClientEntitlementVisible(false);
          reset();
          refetch();
          if (res?.data?.path) {
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Entitlement");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setImportClientEntitlementVisible(false);
            reset();
            refetch();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Entitlement");
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };

  const handleExportClientEntitlementSubmit = (values, reset) => {
    exportClientEntitlementMutate(values, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setExportClientEntitlementVisible(false);
          reset();
          if (res?.data?.path) {
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Entitlement");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportClientEntitlementVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Entitlement");
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
          title={"Account"}
          rowSelection
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          columns={columns}
          loading={isFetching}
          /* filterFields={{
            filterFields: ["service", "date", "Status"],
            filterData: filterData,
          }}
          onFilterApply={handleApplyFilter} */
          filterFields={{
            filterFields: ["activestatus"],
            filterData: filterData,
          }}
          onFilterApply={handleApplyFilter}
          onSearch={handleSearchChange}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onPaginationChange={handlepageChange}
          addbtn={{ onClick: handleAdd }}
          onEdit={handleEdit}
          onStatusUpdate={handleStatusUpdate}
          statusLoading={statusIsLoading}
          action={true}
          /* onDelete={handleDelete}
          deleteLoading={deleteIsLoading} */
          onImport={handleImport}
          onExport={handleExport}
          onServiceImport={handleServiceImport}
          onServiceExport={handleServiceExport}
          onClientEntitlementImport={handleClientEntitlementImport}
          onClientEntitlementExport={handleClientEntitlementExport}
        />
      </div>
      <ImportDialog
        // visible={importVisible ? importVisible : importServiceVisible}
        visible={
          importVisible
            ? importVisible
            : importServiceVisible
            ? importServiceVisible
            : importClientEntitlementVisible
        }
        // setVisible={importVisible ? setImportVisible : setImportServiceVisible}
        setVisible={
          importVisible
            ? setImportVisible
            : importServiceVisible
            ? setImportServiceVisible
            : setImportClientEntitlementVisible
        }
        // sampleExcel={`${ImportFileBaseUrl}/importTemplates/${
        //   importVisible
        //     ? "client_import_template.xlsx"
        //     : "clientServiceEntitlement_import_template.xlsx"
        // }`}
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/${
          importVisible
            ? "client_import_template.xlsx"
            : importServiceVisible
            ? "clientServiceEntitlement_import_template.xlsx"
            : "clientEntitlement_import_template.xlsx"
        }`}
        // masterType={importVisible ? "client" : "clientServiceEntitlement"}
        masterType={
          importVisible
            ? "client"
            : importServiceVisible
            ? "clientServiceEntitlement"
            : "clientEntitlement"
        }
        // onSubmit={
        //   importVisible ? handleImportSubmit : handleImportServiceSubmit
        // }
        onSubmit={
          importVisible
            ? handleImportSubmit
            : importServiceVisible
            ? handleImportServiceSubmit
            : handleImportClientEntitlementSubmit
        }
        // loading={importVisible ? importIsLoading : importServiceIsLoading}
        loading={
          importVisible
            ? importIsLoading
            : importServiceVisible
            ? importServiceIsLoading
            : importClientEntitlementIsLoading
        }
      />
      <ExportDialog
        // visible={exportVisible ? exportVisible : exportServiceVisible}
        visible={
          exportVisible
            ? exportVisible
            : exportServiceVisible
            ? exportServiceVisible
            : exportClientEntitlementVisible
        }
        // setVisible={exportVisible ? setExportVisible : setExportServiceVisible}
        setVisible={
          exportVisible
            ? setExportVisible
            : exportServiceVisible
            ? setExportServiceVisible
            : setExportClientEntitlementVisible
        }
        // loading={exportVisible ? exportIsLoading : exportServiceIsLoading}
        loading={
          exportVisible
            ? exportIsLoading
            : exportServiceVisible
            ? exportServiceIsLoading
            : exportClientEntitlementIsLoading
        }
        // onSubmit={
        //   exportVisible ? handleExportSubmit : handleExportServiceSubmit
        // }
        onSubmit={
          exportVisible
            ? handleExportSubmit
            : exportServiceVisible
            ? handleExportServiceSubmit
            : handleExportClientEntitlementSubmit
        }
        formats="xlsx"
        dateRangeOptional={true}
      />
    </div>
  );
};

export default Accounts;
