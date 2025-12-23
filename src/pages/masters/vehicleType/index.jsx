import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  deleteVehicleType,
  saveVehicleType,
  updateVehicleTypeStatus,
  vehicleType,
  vehicleTypeFormData,
  vehicleTypeImportMaster,
  vehicleTypeExportMaster
} from "../../../../services/masterServices";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { DialogCloseSmallIcon, ImportFileBaseUrl } from "../../../utills/imgConstants";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";


const VehicleType = () => {
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState(null);
  const [vehicleTypeId, setVehicleTypeId] = useState(null);
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [filters, setFilters] = useState();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
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

  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(vehicleTypeImportMaster);

  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(vehicleTypeExportMaster);

  const columns = [
    { title: "Vehicle Type", field: "name" },
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
  const { data, isFetching, refetch } = useQuery(
    ["vehicleTypeList", searchValue, pagination, filters],
    () =>
      vehicleType({
        apiType: "list",
        ...pagination,
        ...filters,
        ...(searchValue && { search: searchValue }),
      })
  );

  console.log("vehicleTypeId", vehicleTypeId);
  const { data: formData, refetch: formDataRefetch } = useQuery(
    ["vehicleTypeFormData"],
    () =>
      vehicleTypeFormData({
        vehicleTypeId: selectedRows[0]?.id,
      }),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (res?.data?.data?.vehicleType) {
            Object.keys(defaultValues)?.forEach((field) =>
              setValue(`${field}`, res?.data?.data?.vehicleType[field])
            );
          }
        }
      },
    }
  );
  const { mutate, isLoading } = useMutation(saveVehicleType);
  const { mutate: deletemutate, isLoading: deleteIsLoading } =
    useMutation(deleteVehicleType);
  const { mutate: statusMutate, isLoading: statusIsLoading } = useMutation(
    updateVehicleTypeStatus
  );

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
  const handleAdd = () => {
    console.log("add vehicle model");
    setVisible(true);
    setVehicleTypeId(null);
  };
  const handleEdit = (record) => {
    setVisible(true);
    setVehicleTypeId(record.id);
    formDataRefetch();
  };
  const handleFormSubmit = (values) => {
    mutate(
      {
        ...(vehicleTypeId && { vehicleTypeId: vehicleTypeId }),
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
  const handleStatusUpdate = (records, status, setVisible) => {
    console.log(records, status);
    statusMutate(
      {
        vehicleTypeIds: records?.map((row) => row.id),
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
        vehicleTypeIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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
  const handleClose = () => {
    setVisible(false);
    reset(defaultValues);
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
              "Vehicle Type"
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
                "Vehicle Type"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Vehicle Type");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Vehicle Type");
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
          title={"Vehicle Type"}
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
          filterFields={{
            filterFields: ["activestatus"],
          }}
          onFilterApply={handleApplyFilter}
          addbtn={{ onClick: handleAdd }}
          onEdit={handleEdit}
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
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/vehicle_type_import_template.xlsx`}
        masterType={"vehicleType"}
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
              {vehicleTypeId ? "Edit" : "Add"} Vehicle Type
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
                <label className="form-label required">Vehicle Type Name</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Vehicle Type Name is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        placeholder="Enter Vehicle Type Name"
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

export default VehicleType;
