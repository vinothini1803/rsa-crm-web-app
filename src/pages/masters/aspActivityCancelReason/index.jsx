import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { DialogCloseSmallIcon, ImportFileBaseUrl, } from "../../../utills/imgConstants";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
  getAspACtivityCancel,
  saveAspACtivityCancel,
  deleteAspACtivityCancel,
  aspACtivityCancelData,
  updateAspACtivityCancel,
  aspACtivityCancelExport,
  aspACtivityCancelImport
} from "../../../../services/masterServices";
import { Button } from "primereact/button";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";

const ASPActivityCancelReason = () => {
  const [visible, setVisible] = useState();
  const [filters, setFilters] = useState();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState(null);
  const [aspAcitivityId, setAspActivityId] =
    useState(null);
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
    ["getAspACtivityCancel", pagination, searchValue, filters],
    () =>
      getAspACtivityCancel({
        apiType: "list",
        ...pagination,
        ...filters,
        ...(searchValue && { search: searchValue }),
      })
  );
  const { mutate, isLoading } = useMutation(saveAspACtivityCancel);
  const { mutate: deletemutate, isLoading: deleteIsLoading } = useMutation(
    deleteAspACtivityCancel
  );
  const { mutate: statusMutate, isLoading: statusIsLoading } = useMutation(
    updateAspACtivityCancel
  );

  const { data: aspActivityForm, refetch: formDataRefetch } = useQuery(
    ["aspACtivityCancelData"],
    () =>
      aspACtivityCancelData({
        aspActivityCancelReasonId: selectedRows[0].id,
      }),
    {
      enabled: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          //console.log("response", res)
          Object.keys(defaultValues)?.forEach((field) =>
            setValue(
              `${field}`,
              res?.data?.data?.aspActivityCancelReason[field]
            )
          );
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
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(aspACtivityCancelImport);

  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(aspACtivityCancelExport);

  const columns = [
    { title: "Name", field: "name" },
    { title: "Created Date", field: "createdAt" },
    /*     { title: "Created By", field: "createdBy", sorter: true },
    { title: "Updated By", field: "updatedBy", sorter: true },
    { title: "Updated Date", field: "UpdatedDate" },
    { title: "Deleted By", field: "deletedBy", sorter: true },
    { title: "Deleted Date", field: "deletedDate" },
    { title: "IS Deleted", field: "isDeleted" }, */
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        //console.log("record", record, field);

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
    setVisible(true);
    setAspActivityId(null);
  };
  const handleEdit = (record) => {
    setVisible(true);
    formDataRefetch();
    setAspActivityId(record?.id);
  };

  const handleFormSubmit = (values) => {
    mutate(
      {
        ...(aspAcitivityId && {
          aspActivityCancelReasonId: aspAcitivityId,
        }),
        ...values,
        name: values.name.trim()
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message, {
              autoClose: 1000,
            });
            refetch();
            setVisible(false);
            reset(defaultValues);
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
  const handleClose = () => {
    setVisible(false);
    reset(defaultValues);
  };
  const handlepageChange = (offset, limit) => {
    //console.log("offset", offset, limit);
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
    //console.log("deleted record", records);
    deletemutate(
      {
        aspActivityCancelReasonIds: records?.reduce(
          (acc, el) => acc.concat(el.id),
          []
        ),
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
    //console.log(records, status);
    statusMutate(
      {
        aspActivityCancelReasonIds: records?.map((row) => row.id),
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
          if (res?.data?.path) {
            download(
              `${ImportFileBaseUrl}${res?.data?.path}`,
              "ASP Activity Cancel Reason"
            );
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setImportVisible(false);
            reset();
            refetch();
            if (res?.data?.path) {
              download(
                `${ImportFileBaseUrl}${res?.data?.path}`,
                "ASP Activity Cancel Reason"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "ASP Activity Cancel Reason");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "ASP Activity Cancel Reason");
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
          title={"ASP Activity Cancel Reason"}
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
          // onDelete={handleDelete}
          // deleteLoading={deleteIsLoading}
          onImport={handleImport}
          onExport={handleExport}
        />
      </div>
      <ImportDialog
        visible={importVisible}
        setVisible={setImportVisible}
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/aspActivityCancelReason_import_template.xlsx`}
        masterType={"aspActivityCancelReason"}
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
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">{aspAcitivityId ? "Edit" : "Add"} ASP Acitivity Cancel Reason</div>
          </div>
        }
        visible={visible}
        position={"bottom"}
        className="w-460"
        onHide={handleClose}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">ASP Acitivity Cancel Reason</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "ASP Activity Cancel Reason is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText placeholder="Enter ASP Activity Cancel Reason" {...field} />
                      <div className="p-error">
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
                          inputId="radio_allow"
                          {...field}
                          value={1}
                          checked={field.value === 1}
                        />
                        <label
                          htmlFor="radio_allow"
                          className="common-radio-label"
                        >
                          Active
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_deny"
                          {...field}
                          value={0}
                          checked={field.value === 0}
                        />
                        <label
                          htmlFor="radio_deny"
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
  );
};

export default ASPActivityCancelReason;
