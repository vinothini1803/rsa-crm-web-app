import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import {
  DialogCloseSmallIcon,
  ImportFileBaseUrl,
} from "../../../utills/imgConstants";
import { Controller, useForm, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";
import { useMutation, useQuery } from "react-query";
import { Calendar } from "primereact/calendar";
import {
  slaProcessList,
  getSlaProcessFormData,
  saveSlaProcess,
  updateSlaProcessStatus,
  slaImport,
  slaExport,
} from "../../../../services/masterServices";
import { Button } from "primereact/button";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";

const SLAProcess = () => {
  const [visible, setVisible] = useState();
  const [filters, setFilters] = useState();
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState(null);
  const [slaProcessId, setSLAProcessId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const defaultValues = {
    caseTypeId: "",
    typeId: "",
    locationTypeId: "",
    time: null,
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
  const typeId = useWatch({
    control,
    name: "typeId",
  });
  const { data, isFetching, refetch } = useQuery(
    ["slaProcessList", pagination, searchValue, filters],
    () =>
      slaProcessList({
        apiType: "list",
        ...pagination,
        ...filters,
        ...(searchValue && { search: searchValue }),
      })
  );
  const { mutate, isLoading } = useMutation(saveSlaProcess);

  const { mutate: statusMutate, isLoading: statusIsLoading } = useMutation(
    updateSlaProcessStatus
  );
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(slaImport);

  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(slaExport);

  const { data: slaProcessData, refetch: formDataRefetch } = useQuery(
    ["getSlaProcessFormData"],
    () =>
      getSlaProcessFormData({
        slaId: selectedRows[0].id,
      }),
    {
      enabled: !!(selectedRows && selectedRows.length),
      onSuccess: (res) => {
        if (res?.data?.success) {
          Object.keys(defaultValues)?.forEach((field) =>
            setValue(`${field}`, res?.data?.data?.sla[field])
          );
          setValue("locationTypeId", locationTypeId);
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

  const mappedCaseTypes = slaProcessData?.data?.data?.extras?.caseTypes.map(
    (caseType) => ({
      id: caseType.id,
      name: caseType.name,
    })
  );

  const mappedTypes = slaProcessData?.data?.data?.extras?.types.map((type) => ({
    id: type.id,
    name: type.name,
  }));
  const mappedLocationTypes =
    slaProcessData?.data?.data?.extras?.locationTypes?.map((type) => ({
      id: type.id,
      name: type.name,
    }));

  const columns = [
    { title: "Case Type", field: "caseType" },
    { title: "Type", field: "type" },
    { title: "Time", field: "time" },
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

  const handleEdit = (record) => {
    setVisible(true);
    formDataRefetch();
    setSLAProcessId(record?.id);
  };
  const handleAdd = () => {
    setVisible(true);
    setSLAProcessId(null);
  };
  const handleFormSubmit = (values) => {
    if (values.time === 0 || values.time === "0") {
      toast.error("Time should be greater than 0 seconds", { autoClose: 2000 });
      return;
    }

    const convertedValues = {
      ...values,
      status: 1,
    };
    mutate(
      {
        ...(slaProcessId && {
          slaId: slaProcessId,
        }),
        ...convertedValues,
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

  const handleStatusUpdate = (records, status, setVisible) => {
    console.log(records, status);
    statusMutate(
      {
        slaIds: records?.map((row) => row.id),
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

  const convertSecondsToTime = (seconds) => {
    if (isNaN(seconds)) {
      return "00:00";
    }
    const totalSeconds = parseInt(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const result = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    return result;
  };

  const convertTimeToSeconds = (timeString) => {
    if (typeof timeString !== "string") {
      return 0;
    }
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60;
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
          console.log("res?.data?", res?.data);
          toast.success(res?.data?.message);

          setImportVisible(false);
          reset();
          refetch();
          if (res?.data?.errorFilePath) {
            download(
              `${ImportFileBaseUrl}${res?.data?.errorFilePath}`,
              "SLA Process"
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
                "SLA Process"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "SLA Process");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "SLA Process");
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
          title={"SLA Setting"}
          rowSelection
          columns={columns}
          // addbtn={{ onClick: handleAdd }}
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          onPaginationChange={handlepageChange}
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
          isVisible={true}
          onStatusUpdate={handleStatusUpdate}
          statusLoading={statusIsLoading}
          onImport={handleImport}
          onExport={handleExport}
        />
      </div>
      <ImportDialog
        visible={importVisible}
        setVisible={setImportVisible}
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/sla_import_template.xlsx`}
        masterType={"sla"}
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
            <div className="dialog-header-title">Edit SLA Setting</div>
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
                <label className="form-label required">Case Type</label>
                <Controller
                  name="caseTypeId"
                  control={control}
                  rules={{ required: "Case Type is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Case Type"
                        options={mappedCaseTypes}
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
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Type</label>
                <Controller
                  name="typeId"
                  control={control}
                  rules={{ required: "Type is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Type"
                        options={mappedTypes}
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
            {[870, 871, 872, 873].includes(typeId) && (
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Location Type</label>
                  <Controller
                    name="locationTypeId"
                    control={control}
                    rules={{ required: "Location Type is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Location Type"
                          options={mappedLocationTypes}
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
            )}
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label required">Time</label>
                <Controller
                  name="time"
                  control={control}
                  rules={{ required: "Time is required." }}
                  render={({ field, fieldState }) => (
                    <Calendar
                      className={`${fieldState.error ? "p-invalid" : ""}`}
                      value={
                        field.value
                          ? new Date(
                              `1970-01-01T${convertSecondsToTime(field.value)}`
                            )
                          : null
                      }
                      onChange={(e) => {
                        const selectedTime = e.value
                          ? `${e.value.getHours()}:${e.value.getMinutes()}`
                          : null;
                        const convertedValue = selectedTime
                          ? convertTimeToSeconds(selectedTime)
                          : null;
                        field.onChange(convertedValue);
                      }}
                      hourFormat="24"
                      placeholder="Select Time"
                      showIcon
                      timeOnly
                      iconPos={"right"}
                      dateFormat="HH:mm"
                    />
                  )}
                />
              </div>
            </div>
            {/* <div className="col-md-12">
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
            </div> */}
          </div>
          <Button
            className="btn form-submit-btn mt-4"
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

export default SLAProcess;
