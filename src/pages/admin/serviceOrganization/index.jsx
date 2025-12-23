import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { DialogCloseSmallIcon, ImportFileBaseUrl, } from "../../../utills/imgConstants";
import { toast } from "react-toastify";
import moment from "moment";
import { useMutation, useQuery } from "react-query";
import {
  deleteServiceOrganisation,
  saveServiceOrganisations,
  serviceOrganisationFormData,
  serviceOrganisations,
  updateServiceOrganisationStatus,
  serviceOrganisationExport,
  serviceOrganisationImport
} from "../../../../services/masterServices";
import { Button } from "primereact/button";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";


const ServiceOrgMaster = () => {
  const [visible, setVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState(null);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [serviceOrganisationId, setServiceOrganisationId] = useState(null);
  const navigate = useNavigate();
  const [filters, setFilters] = useState();
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
    ["serviceOrganisationsList", pagination, searchValue, filters],
    () =>
      serviceOrganisations({
        apiType: "list",
        ...pagination,
        ...(searchValue && { search: searchValue }),
        ...filters,
      })
  );

  const { mutate, isLoading } = useMutation(saveServiceOrganisations);
  const { mutate: deletemutate, isLoading: deleteIsLoading } = useMutation(
    deleteServiceOrganisation
  );
  const { mutate: statusMutate, isLoading: statusIsLoading } = useMutation(
    updateServiceOrganisationStatus
  );

  const { data: formData, refetch: formDataRefetch } = useQuery(
    ["serviceOrganisationFormData"],
    () =>
      serviceOrganisationFormData({
        serviceOrganisationId: selectedRows[0]?.id,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          Object.keys(defaultValues)?.forEach((field) =>
            setValue(`${field}`, res?.data?.data?.serviceOrganisation[field])
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
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(serviceOrganisationImport);

  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(serviceOrganisationExport);
  const columns = [
    { title: "Service Org", field: "name" },

    /*  { title: "Created By", field: "", }, */
    { title: "Created Date", field: "createdAt" },
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
    setServiceOrganisationId(null);
  };
  /* Form close function */
  const handleClose = () => {
    setVisible(false);
    reset(defaultValues);
  };
  /* Form Submit function */
  const handleFormSubmit = (values) => {
    mutate(
      {
        ...(serviceOrganisationId && {
          serviceOrganisationId: serviceOrganisationId,
        }),
        ...values,
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
  const handleEdit = (record) => {
    formDataRefetch();
    setVisible(true);
    setServiceOrganisationId(record?.id)
  };
  const handleStatusUpdate = (records, status, setVisible) => {
    console.log(records, status);
    statusMutate(
      {
        serviceOrganisationIds: records?.map((row) => row.id),
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
        serviceOrganisationIds: records?.reduce(
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
  const handleApplyFilter = (values) => {
    console.log("values", values);

    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      status: values?.status?.label,
    });
    refetch();
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
              "Service Org"
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
                "Service Org"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Service Org");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Service Org");
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
          title={"Service Org Master"}
          rowSelection
          columns={columns}
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          onAdd={handleAdd}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onEdit={handleEdit}
          loading={isFetching}
          onSearch={handleSearchChange}
          filterFields={{
            filterFields: ["activestatus"],
          }}
          onFilterApply={handleApplyFilter}
          action={true}
          onPaginationChange={handlepageChange}
          addbtn={{ label: "New", onClick: handleAdd }}
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
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/service_organisation_import_template.xls`}
        masterType={"serviceOrganisation"}
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
            <div className="dialog-header-title">{serviceOrganisationId ? "Edit" :"Add"} Service Organisation</div>
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
            <div className="col-md-24">
              <div className="form-group">
                <div lassName="form-group">
                  <label className="form-label required">
                    Service Organisation Name
                  </label>
                  <Controller
                    name="name"
                    rules={{
                      required: "Service Organisation Name is required.",
                    }}
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          placeholder="Enter Service Organisation Name"
                          autoComplete="off"
                        />
                        <div className="p-error">
                          {/* {errors[field.name]?.message} */}
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group radio-form-group">
                <label className="form-label required">Status</label>
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

export default ServiceOrgMaster;