import React, { useState, useEffect } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import {
  DialogCloseSmallIcon,
  ImportFileBaseUrl,
  CloseIcon,
  CloseTagIcon,
} from "../../../utills/imgConstants";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
  slaViolateReasons,
  slaViolateAllReasons,
  rolesDropdown,
  allrolesDropdown,
  deleteSlaViolateReason,
  slaViolationReasonFormData,
  saveSlaViolationReason,
  updateSlaViolationReasonStatus,
  slaViolateReasonImport,
  slaViolateReasonExport,
} from "../../../../services/masterServices";
import { Button } from "primereact/button";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";

const SlaReasons = () => {
  const [visible, setVisible] = useState();
  const [filters, setFilters] = useState();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState(null);
  const [slaViolationReasonId, setSlaViolationReasonId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const defaultValues = {
    name: "",
    roleId: "",
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
    ["slaViolationReasonList", pagination, searchValue, filters],
    () =>
      slaViolateReasons({
        apiType: "list",
        ...pagination,
        ...filters,
        ...(searchValue && { search: searchValue }),
      })
  );

  //Roles Dropdown data api
  const { data: roles = [] } = useQuery(
    ["roleList"],
    () =>
      allrolesDropdown({
        apiType: "dropdown",
      }),

    {
      enabled: visible,
    }
  );

  const { mutate, isLoading } = useMutation(saveSlaViolationReason);
  const { mutate: deletemutate, isLoading: deleteIsLoading } = useMutation(
    deleteSlaViolateReason
  );
  const { mutate: statusMutate, isLoading: statusIsLoading } = useMutation(
    updateSlaViolationReasonStatus
  );

  const { data: slaViolationReasonData, refetch: formDataRefetch } = useQuery(
    ["slaViolationReasonFormData"],
    () =>
      slaViolationReasonFormData({
        slaViolateReasonId: selectedRows[0].id,
      }),
    {
      enabled: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          const violationData = res?.data?.data?.slaViolateReason;

          Object.keys(defaultValues)?.forEach((field) => {
            if (field === "roleId" && violationData?.roleId) {
              const splitRoleId = violationData.roleId.split(",");
              const roleIdArray = splitRoleId.map((id) => {
                const foundRole = roles?.data?.data.find(
                  (role) => role.id === parseInt(id)
                );
                return foundRole;
              });
              setValue(field, roleIdArray);
            } else {
              setValue(field, violationData[field]);
            }
          });
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
  const { mutate: importMutate, isLoading: importIsLoading } = useMutation(
    slaViolateReasonImport
  );

  const { mutate: exportMutate, isLoading: exportIsLoading } = useMutation(
    slaViolateReasonExport
  );

  const columns = [
    { title: "SLA Violation Reason", field: "name" },
    { title: "Role Name", field: "roleNames" },
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
  const handleAdd = () => {
    setVisible(true);
    setSlaViolationReasonId(null);
  };
  const handleEdit = (record) => {
    setVisible(true);
    formDataRefetch();
    setSlaViolationReasonId(record?.id);
    // console.log("slaViolationReasonId ", slaViolationReasonId);
  };

  const handleFormSubmit = (values) => {
    const roleIdAsString = values.roleId.map((role) => role.id).join(",");
    mutate(
      {
        ...(slaViolationReasonId && {
          slaViolateReasonId: slaViolationReasonId,
        }),
        ...values,
        roleId: roleIdAsString,
        name: values.name.trim(),
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
        slaViolateReasonIds: records?.reduce(
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
    // console.log(records, status);
    statusMutate(
      {
        slaViolateReasonIds: records?.map((row) => row.id),
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
      roleId: values?.roleId?.code,
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
              "SLA Reasons"
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
                "SLA Reasons"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "SLA Reasons");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "SLA Reasons");
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
          title={"SLA Reason"}
          rowSelection
          columns={columns}
          data={
            data?.data?.data?.rows
              ? data.data.data.rows.map((item) => ({
                  ...item,
                  roleNames: item.roleNames.join(", "),
                }))
              : []
          }
          totalRecords={data?.data?.data?.count}
          onPaginationChange={handlepageChange}
          addbtn={{ onClick: handleAdd }}
          filterFields={{
            filterFields: ["activestatus", "roleId"],
            filterData: {
              roleId: roles?.data?.data.map((role) => {
                return {
                  code: role?.id,
                  label: role?.name,
                };
              }),
            },
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
          /* onDelete={handleDelete}
          deleteLoading={deleteIsLoading} */
          onImport={handleImport}
          onExport={handleExport}
        />
      </div>
      <ImportDialog
        visible={importVisible}
        setVisible={setImportVisible}
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/slaViolateReason_import_template.xlsx`}
        masterType={"slaViolateReason"}
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
            <div className="dialog-header-title">
              {slaViolationReasonId ? "Edit" : "Add"} SLA Violate Reason
            </div>
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
                <label className="form-label required">Reason</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Reason is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText placeholder="Enter Reason" {...field} />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Roles</label>
                <Controller
                  name="roleId"
                  control={control}
                  rules={{ required: "Role Name is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <MultiSelect
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={roles?.data?.data}
                        optionLabel="name"
                        display="chip"
                        placeholder="Select Roles"
                        maxSelectedLabels={3}
                        className="custom-multiselect"
                        removeIcon={(options) => (
                          <img src={CloseIcon} {...options.iconProps} />
                        )}
                        filter
                        filterBy="name"
                      />
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

export default SlaReasons;
