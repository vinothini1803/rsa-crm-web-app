import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { Dialog } from "primereact/dialog";
import {
  DialogCloseSmallIcon,
  ImportFileBaseUrl,
} from "../../../utills/imgConstants";
import { Controller, set, useForm } from "react-hook-form";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import StatusBadge from "../../../components/common/StatusBadge";
import { toast } from "react-toastify";
import {
  deleteState,
  saveState,
  state,
  stateData,
  updateStateStatus,
  stateImportMaster,
  stateExportMaster,
} from "../../../../services/masterServices";
import { useMutation, useQuery } from "react-query";
import { Button } from "primereact/button";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";

const State = () => {
  const [visible, setVisible] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState(null);
  const [filters, setFilters] = useState();
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [stateId, setStateId] = useState(null);
  const defaultValues = {
    code: "",
    name: "",
    countryId: "",
    status: 1,
  };
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ defaultValues });
  const { data, isFetching, refetch } = useQuery(
    ["stateList", pagination, searchValue, filters],
    () =>
      state({
        apiType: "list",
        ...pagination,
        ...(searchValue && { search: searchValue }),
        ...filters,
      })
  );

  const { mutate, isLoading } = useMutation(saveState);
  const { data: stateFormData } = useQuery(
    ["stateFormData", selectedRows],
    () =>
      stateData({
        stateId: selectedRows?.length == 1 ? selectedRows[0]?.id : "",
      }),
    {
      refetchOnWindowFocus: false,
      enabled: visible,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (selectedRows?.length == 1) {
            console.log(res?.data?.data?.state);

            Object.keys(defaultValues)?.forEach((field) =>
              setValue(`${field}`, res?.data?.data?.state[field])
            );
          }
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
  const { mutate: deletemutate, isLoading: deleteIsLoading } =
    useMutation(deleteState);
  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateStateStatus);
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(stateImportMaster);
  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(stateExportMaster);
  const columns = [
    {
      title: "State Code",
      field: "code",
      body: (record, field) => record?.code ?? "--",
    },

    { title: "State", field: "name" },
    { title: "Country", field: "countryName" },
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
    setStateId(null);
  };

  const handleFormSubmit = (values) => {
    mutate(
      {
        stateId: selectedRows?.length == 1 ? selectedRows[0]?.id : null,
        ...values,
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
    setVisible(true);
    setStateId(record?.id);
  };

  const handleDelete = (records, setVisible) => {
    console.log("deleted record", records);
    deletemutate(
      {
        stateIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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
    console.log(records, status);
    statusMutate(
      {
        stateIds: records?.map((row) => row.id),
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
          if (res?.data?.errorFilePath) {
            download(
              `${ImportFileBaseUrl}${res?.data?.errorFilePath}`,
              "State"
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
                "State"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "State");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "State");
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };
  return (
    <>
      <TableWrapper
        title={"State"}
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
        className="tab-page"
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
      <ImportDialog
        visible={importVisible}
        setVisible={setImportVisible}
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/state_import_template.xlsx`}
        masterType={"state"}
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
        pt={{
          root: { className: "w-560" },
        }}
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">
              {stateId ? "Edit" : "Add"} State
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
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">State Code</label>
                <Controller
                  name="code"
                  rules={{
                    required: "State Code is required.",
                    pattern: {
                      value: /^[A-Za-z](?=.*[A-Za-z])[A-Za-z0-9]*$/, // Alphanumeric validation (letters and numbers only)
                      message: "Only alphanumeric characters are allowed.",
                    },
                  }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText {...field} placeholder="Enter State Code" />
                      <div className="p-error">
                        {/* {errors[field.name]?.message} */}
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">State Name</label>
                <Controller
                  name="name"
                  rules={{
                    required: "State Name is required.",
                  }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText {...field} placeholder="Enter State Name" />
                      <div className="p-error">
                        {/* {errors[field.name]?.message} */}
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Country</label>
                <Controller
                  name="countryId"
                  control={control}
                  rules={{ required: "Country is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Country"
                        options={stateFormData?.data?.data?.extras?.countries}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(e) => field.onChange(e.value)}
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
    </>
  );
};

export default State;
