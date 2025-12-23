import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { Dialog } from "primereact/dialog";
import { DialogCloseSmallIcon, ImportFileBaseUrl, } from "../../../utills/imgConstants";
import { Controller, useForm, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
  deleteService,
  saveService,
  serviceFormData,
  services,
  subject,
  updateServiceStatus,
  serviceImportMaster,
  serviceExportMaster
} from "../../../../services/masterServices";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";


const Services = () => {
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState();
  const [serviceId, setServiceId] = useState("");
  const [selectedRows, setSelectedRows] = useState(null);
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const defaultValues = {
    name: "",
    status: 1,
    clientId: "",
    subjectId: "",
  };
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const clientId = useWatch({
    control,
    name: "clientId",
  });

  const { data, isFetching, refetch } = useQuery(
    ["serviceList", searchValue, pagination, filters],
    () =>
      services({
        apiType: "list",
        ...pagination,
        ...filters,
        ...(searchValue && { search: searchValue }),
      })
  );
  const { mutate, isLoading } = useMutation(saveService);
  const { mutate: deletemutate, isLoading: deleteIsLoading } =
    useMutation(deleteService);
  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateServiceStatus);

  const { data: formData, refetch: formDataRefetch } = useQuery(
    ["serviceFormData", visible],
    () =>
      serviceFormData({
        serviceId: serviceId,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: visible,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (res?.data?.data?.service) {
            Object.keys(defaultValues)?.forEach((field) =>
              setValue(`${field}`, res?.data?.data?.service[field])
            );
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    }
  );

  const { data: subjectData } = useQuery(
    ["subjects", clientId],
    () =>
      subject({
        apiType: "dropdown",
        clientId: clientId,
      }),
    {
      enabled: clientId !== "" ? true : false,
      onSuccess: (res) => {
        if (!res?.data?.success) {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    }
  );

  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(serviceImportMaster);

  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(serviceExportMaster);

  const columns = [
    { title: "Services", field: "name" },
    { title: "Created Date", field: "createdAt" },
    /* { title: "Created By", field: "createdBy", sorter: true },
    { title: "Updated By", field: "updatedBy", sorter: true },
    { title: "Updated Date", field: "updatedDate" },
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

  const handleAdd = () => {
    setVisible(true);
    setServiceId("");
  };
  const handleEdit = () => {
    setVisible(true);
    setServiceId(selectedRows[0]?.id);
  };
  /* form handle function */
  const handleFormSubmit = (values) => {
    mutate(
      {
        ...(serviceId && { serviceId: serviceId }),
        ...values,
        name: values.name.trim(),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
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
  // Form Colse Function
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
        serviceIds: records?.map((row) => row.id),
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
  /* const handleDelete = (records, setVisible) => {
    console.log("deleted record", records);
    deletemutate(
      {
        serviceIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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
  }; */
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
              "Services"
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
                "Services"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Services");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Services");
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
          title={"Services"}
          rowSelection
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          columns={columns}
          loading={isFetching}
          onSearch={handleSearchChange}
          action={true}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onPaginationChange={handlepageChange}
          addbtn={{ onClick: handleAdd }}
          filterFields={{
            filterFields: ["activestatus"],
          }}
          onFilterApply={handleApplyFilter}
          onEdit={handleEdit}
          onStatusUpdate={handleStatusUpdate}
          statusLoading={statusIsLoading}
          //onDelete={handleDelete}
          //deleteLoading={deleteIsLoading}
          onImport={handleImport}
          onExport={handleExport}
        />
      </div>
      <ImportDialog
        visible={importVisible}
        setVisible={setImportVisible}
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/service_import_template.xlsx`}
        masterType={"service"}
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
            <div className="dialog-header-title">Add Service</div>
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
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Service</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Service is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText {...field} placeholder="Enter Service" />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group radio-form-group">
                <label className="form-label required">Client</label>
                <Controller
                  name="clientId"
                  control={control}
                  rules={{ required: "Client is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Client"
                        options={formData?.data?.data?.extras?.clients}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(e) => {
                          field.onChange(e.value);
                          setValue("subjectId", "");
                        }}
                      />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group radio-form-group">
                <label className="form-label required">Subject</label>
                <Controller
                  name="subjectId"
                  control={control}
                  rules={{ required: "Subject is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Subject"
                        options={subjectData?.data?.data}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group radio-form-group">
                <label className="form-label">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_yes"
                          {...field}
                          value={1}
                          checked={field.value === 1}
                        />
                        <label
                          htmlFor="radio_yes"
                          className="common-radio-label"
                        >
                          Active
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_no"
                          {...field}
                          value={0}
                          checked={field.value === 0}
                        />
                        <label
                          htmlFor="radio_no"
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

export default Services;
