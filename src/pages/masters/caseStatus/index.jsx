import React, { useState } from "react";
import StatusBadge from "../../../components/common/StatusBadge";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { DialogCloseSmallIcon, ImportFileBaseUrl, } from "../../../utills/imgConstants";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
  caseStatus,
  caseStatusFormData,
  deleteCaseStatus,
  saveCaseStatus,
  updateCaseStatus,
  caseStatusImportMaster,
  caseStatusExportMaster
} from "../../../../services/masterServices";
import { Button } from "primereact/button";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";


const CaseStatus = () => {
  const [visible, setVisible] = useState(false);
  const [caseStatusId, setCaseStatusId] = useState();
  const [filters, setFilters] = useState();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const defaultValues = {
    name: "",
    status: 1,
  };
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const { data, isFetching, refetch } = useQuery(
    ["caseStatusList", searchValue, pagination, filters],
    () =>
      caseStatus({
        apiType: "list",
        ...pagination,
        ...(searchValue && { search: searchValue }),
        ...filters,
      })
  );

  const { mutate, isLoading } = useMutation(saveCaseStatus);
  const { mutate: deletemutate, isLoading: deleteIsLoading } =
    useMutation(deleteCaseStatus);
  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateCaseStatus);

  const { data: formData, refetch: formDataRefetch } = useQuery(
    ["caseStatusFormData"],
    () =>
      caseStatusFormData({
        caseStatusId: selectedRows[0]?.id,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          Object.keys(defaultValues)?.forEach((field) =>
            setValue(`${field}`, res?.data?.data?.caseStatus[field])
          );
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

  console.log("caseStatusList data", data);

  const handleAdd = () => {
    setVisible(true);
    setCaseStatusId(null);
  };
  const handleEdit = (record) => {
    setVisible(true);
    formDataRefetch();
    setCaseStatusId(record?.id);
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
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(caseStatusImportMaster);

  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(caseStatusExportMaster);

  const columns = [
    { title: "Case Status", field: "name" },
    { title: "Created Date", field: "createdAt" },
    /*     { title: "Created By", field: "createBy", sorter: true },
    { title: "Updated By", field: "updateBy", sorter: true },
    { title: "Updated Date", field: "updateDate" },
    { title: "Deleted By", field: "deletedBy", sorter: true },
    { title: "Deleted Date", field: "deletedDate" },
    { title: "IS Deleted", field: "isDeleted" }, */
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

  const handleFormSubmit = (values) => {
    mutate(
      {
        ...(caseStatusId && { caseStatusId: caseStatusId }),
        ...values,
        name: values.name.trim()
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message, {
              autoClose: 1000,
            });
            setVisible(false);
            reset(defaultValues);
            refetch();
            setSelectedRows(null);
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
  const handleClose = () => {
    setVisible(false);
    reset(defaultValues);
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
  const handleStatusUpdate = (records, status, setVisible) => {
    console.log(records, status);
    statusMutate(
      {
        caseStatusIds: records?.map((row) => row.id),
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
    deletemutate(
      {
        caseStatusIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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
          if (res?.data?.errorFilePath) {
            download(
              `${ImportFileBaseUrl}${res?.data?.errorFilePath}`,
              "Case Status"
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
                "Case Status"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Case Status");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Case Status");
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
          title={"Case Status"}
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
          action={false}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onStatusUpdate={handleStatusUpdate}
          statusLoading={statusIsLoading}
          // onDelete={handleDelete}
          // deleteLoading={deleteIsLoading}
          onImport={handleImport}
          onExport={handleExport}
        />
        <ImportDialog
          visible={importVisible}
          setVisible={setImportVisible}
          sampleExcel={`${ImportFileBaseUrl}/importTemplates/case_status_import_template.xlsx`}
          masterType={"caseStatus"}
          onSubmit={handleImportSubmit}
          loading={importIsLoading}
        />
        <ExportDialog
          visible={exportVisible}
          setVisible={setExportVisible}
          loading={exportIsLoading}
          onSubmit={handleExportSubmit}
          formats="xlsx"
        />
        <Dialog
          header={
            <div className="dialog-header">
              <div className="dialog-header-title">
                {caseStatusId ? "Edit" : "Add"} Case Status
              </div>
            </div>
          }
          visible={visible}
          position={"bottom"}
          onHide={handleClose}
          draggable={false}
          resizable={false}
          closeIcon={<img src={DialogCloseSmallIcon} />}
        >
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="row row-gap-3_4">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Case Status</label>
                  <Controller
                    name="name"
                    rules={{
                      required: "Case Status is required.",
                    }}
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText {...field} placeholder="Enter Case Status" />
                        <div className="p-error">
                          {/* {errors[field.name]?.message} */}
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group radio-form-group">
                  <label className="form-label">Status</label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className="common-radio-group">
                        <div className="common-radio-item">
                          <RadioButton
                            inputId="radio_active"
                            {...field}
                            value={1}
                            checked={field.value === 1}
                          />
                          <label
                            htmlFor="radio_active"
                            className="common-radio-label"
                          >
                            Active
                          </label>
                        </div>
                        <div className="common-radio-item">
                          <RadioButton
                            inputId="radio_inactive"
                            {...field}
                            value={0}
                            checked={field.value === 0}
                          />
                          <label
                            htmlFor="radio_inactive"
                            className="common-radio-label"
                          >
                            Inactive
                          </label>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <Button
              className="btn form-submit-btn"
              type="submit"
              loading={isLoading}
            >
              Save
            </Button>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default CaseStatus;
