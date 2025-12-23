import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { useNavigate } from "react-router";
import StatusBadge from "../../../components/common/StatusBadge";
import { useMutation, useQuery } from "react-query";
import {
  callCenters,
  deleteCallCenter,
  updateCallCenter,
  callCenterImportMaster,
  callCenterExportMaster
} from "../../../../services/masterServices";
import { toast } from "react-toastify";
import {
  ImportFileBaseUrl
} from "../../../utills/imgConstants";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";

const CallCentre = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const columns = [
    { title: "Call Center Name", field: "name" },
    { title: "Address", field: "address" },
    //{ title: "Mapped City", field: "mappedCity" },
    { title: "E-mail", field: "email" },
    { title: "Phone Number", field: "phoneNumber" },
    { title: "Command Center", field: "isCommandCenter" },
    { title: "WhatsApp Number", field: "whatsappNumber" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
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
    ["callCenterList", pagination, searchValue, filters],
    () =>
      callCenters({
        apiType: "list",
        ...pagination,
        ...(searchValue && { search: searchValue }),
        ...filters,
      })
  );

  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateCallCenter);
  const { mutate: deletemutate, isLoading: deleteIsLoading } =
    useMutation(deleteCallCenter);

  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(callCenterImportMaster);

  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(callCenterExportMaster);

  const handleStatusUpdate = (records, status, setVisible) => {
    console.log(records, status);
    statusMutate(
      {
        callCenterIds: records?.map((row) => row.id),
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

  /* const data = Array.from({ length: 22 }, (e, i) => {
    return {
      centreName: "My TVS",
      address: "84/A, Ram Nagar,Hosur,635110",
      mappedCity: "Anekal, kelamangalam,Whitefield,Malur.",
      status: i % 2 == 0 ? "InActive" : "Active",
      statusId: i % 2 == 0 ? 6 : 1,
    };
  }); */
  const handleAdd = () => {
    navigate("/admin/call-centers/add");
  };
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
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
    console.log("deleted record", records);
    deletemutate(
      {
        callCenterIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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

  const handleEdit = (record) => {
    navigate(`/admin/call-centers/edit/${record.id}`);
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
              "Call Center"
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
                "Call Center"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Call Center");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Call Center");
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
          title={"Call Center"}
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          rowSelection
          columns={columns}
          onPaginationChange={handlepageChange}
          addbtn={{ onClick: handleAdd }}
          filterFields={{
            filterFields: ["activestatus"],
          }}
          onFilterApply={handleApplyFilter}
          action={true}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onSearch={handleSearchChange}
          loading={isFetching}
          onStatusUpdate={handleStatusUpdate}
          statusLoading={statusIsLoading}
          /* onDelete={handleDelete}
          deleteLoading={deleteIsLoading} */
          onEdit={handleEdit}
          onImport={handleImport}
          onExport={handleExport}
        />
      </div>
      <ImportDialog
        visible={importVisible}
        setVisible={setImportVisible}
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/call_center_import_template.xlsx`}
        masterType={"callCenter"}
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
  );
};

export default CallCentre;
