import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { Dialog } from "primereact/dialog";
import {
  DialogCloseSmallIcon,
  ImportFileBaseUrl,
} from "../../../utills/imgConstants";
import { Controller, useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import "./style.less";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
  deleteVechicleMake,
  saveVechicleMake,
  updateVechicleMakeStatus,
  vehicleMakeFormData,
  vehicleMakes,
  vehicleMakeImport,
  vehicleMakeExport,

} from "../../../../services/masterServices";
import { Button } from "primereact/button";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";

const VehicleManufacturer = () => {
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState(null);
  const [vehicleMakeId, setVechiclMakeId] = useState(null);
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
    ["vehicleMakesList", pagination, searchValue, filters],
    () =>
      vehicleMakes({
        apiType: "list",
        ...pagination,
        ...filters,
        ...(searchValue && { search: searchValue }),
      })
  );

  const { data: formData, refetch: formDataRefetch } = useQuery(
    ["vehicleMakeFormData"],
    () =>
      vehicleMakeFormData({
        vehicleMakeId: selectedRows[0].id,
      }),
    {
      enabled: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (selectedRows?.length == 1) {
            console.log(res?.data?.data?.state);

            Object.keys(defaultValues)?.forEach((field) =>
              setValue(`${field}`, res?.data?.data?.vehicleMake[field])
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
  const { mutate, isLoading } = useMutation(saveVechicleMake);

  const { mutate: deletemutate, isLoading: deleteIsLoading } =
    useMutation(deleteVechicleMake);
  const { mutate: statusMutate, isLoading: statusIsLoading } = useMutation(
    updateVechicleMakeStatus
  );
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(vehicleMakeImport);

  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(vehicleMakeExport);
  const columns = [
    { title: "Vehicle Manufacturer Name", field: "name" },
    { title: "Created Date", field: "createdAt" },
    /*   { title: "Created By", field: "createBy", sorter: true },
    { title: "Updated By", field: "updateBy", sorter: true },
    { title: "Updated Date", field: "updateDate" },
    { title: "Deleted By", field: "deletedBy", sorter: true },
    { title: "Deleted Date", field: "deletedDate" }, */
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
    console.log("vechicle Manufaturer add");
    setVisible(true);
    setVechiclMakeId(null);
  };
  const handleEdit = (record) => {
    console.log("record", record);
    setVechiclMakeId(record?.id);
    setVisible(true);
    formDataRefetch();
  };

  const handleFormSubmit = (values) => {
    mutate(
      {
        vehicleMakeId: vehicleMakeId ? vehicleMakeId : null,
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
        vehicleMakeIds: records?.map((row) => row.id),
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
        vehicleMakeIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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
              "Vehicle Manufacturer"
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
                "Vehicle Manufacturer"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Vehicle Manufacturer");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Vehicle Manufacturer");
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
          title={"Vehicle Manufacturer"}
          rowSelection
          columns={columns}
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          loading={isFetching}
          onSearch={handleSearchChange}
          filterFields={{
            filterFields: ["activestatus"],
          }}
          onFilterApply={handleApplyFilter}
          action={true}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onPaginationChange={handlepageChange}
          addbtn={{ onClick: handleAdd }}
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
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/vehicle_make_import_template.xlsx`}
        masterType={"vehicleModel"}
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
              {vehicleMakeId ? "Edit" : "Add"} Vehicle Manufacturer
            </div>
          </div>
        }
        visible={visible}
        className="w-460"
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
                <label className="form-label required">
                  Vehicle Manufacturer Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Vehicle Manufacturer Name is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        placeholder="Enter Manufacturer Name"
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

export default VehicleManufacturer;
