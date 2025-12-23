import React, { useState, useEffect } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Controller, useForm, useWatch } from "react-hook-form";
import { DialogCloseSmallIcon, ImportFileBaseUrl } from "../../../utills/imgConstants";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { useMutation, useQuery } from "react-query";
import {
  deleteSubService,
  saveSubService,
  services,
  subService,
  subServiceFormData,
  subject,
  updateSubServiceStatus,
  subServiceImportMaster,
  subServiceExportMaster
} from "../../../../services/masterServices";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";
import { MultiSelect } from "primereact/multiselect";


const SubService = () => {
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState(null);
  const [filters, setFilters] = useState();
  const [subServiceId, setSubServiceId] = useState("");
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const defaultValues = {
    name: "",
    serviceId: "",
    status: 1,
    hasLimit: 1,
    hasEntitlement: 1,
    hasAspAssignment: 1,
    entitlementIds: [],
  }
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    reset,
    resetField,
  } = useForm({ defaultValues });

  const clientId = useWatch({
    control,
    name: "clientId",
  });
  const subjectId = useWatch({
    control,
    name: "subjectId",
  });
  const hasEntitlement = useWatch({
    control,
    name: "hasEntitlement",
  });
  useEffect(() => {
    if (hasEntitlement === 0) {
      // Set entitlementIds to an empty array when hasEntitlement is "No"
      // setValue("entitlementIds", []);
      resetField('entitlementIds')
    }
  }, [hasEntitlement, setValue]);
  console.log("clientId", clientId);
  const { data, isFetching, refetch } = useQuery(
    ["subServiceList", searchValue, pagination, filters],
    () =>
      subService({
        apiType: "list",
        ...pagination,
        ...(searchValue && { search: searchValue }),
        ...filters
      })
  );

  const { mutate, isLoading } = useMutation(saveSubService);
  const { mutate: deletemutate, isLoading: deleteIsLoading } =
    useMutation(deleteSubService);
  const { mutate: statusMutate, isLoading: statusIsLoading } = useMutation(
    updateSubServiceStatus
  );

  const { data: formData, refetch: formDataRefetch } = useQuery(
    ["subServiceFormData", visible],
    () =>
      subServiceFormData({
        subServiceId: subServiceId,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: visible,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (res?.data?.data?.subService) {
            Object.keys(defaultValues)?.forEach((field) =>
              setValue(`${field}`, res?.data?.data?.subService[field])
            );
            // Match entitlement IDs with extras.entitlements
            const entitlementIds = res.data.data.subService.entitlements.map(
              (subEnt) =>
                res.data.data.extras.entitlements.find(
                  (extraEnt) => extraEnt.id === subEnt.entitlementId
                )?.id
            );
            console.log("entitlementIds", entitlementIds)
            setValue("entitlementIds", entitlementIds)
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
        console.log("res?.data?.data?.subService", res?.data?.data?.subService)
      },

    }
  );
  console.log("formData", formData)
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
  const { data: serviceData } = useQuery(
    ["service", clientId, subjectId],
    () =>
      services({
        apiType: "dropdown",
        clientId: clientId,
        subjectId: subjectId,
      }),
    {
      enabled: clientId !== "" && subjectId !== "" ? true : false,
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
  console.log("serviceData", serviceData)
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(subServiceImportMaster);

  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(subServiceExportMaster);

  const columns = [
    { title: "Name", field: "name" },
    { title: "Service", field: "serviceName" },
    { title: "Has ASP Assignment", field: "hasAspAssignment" },
    { title: "Has Limit", field: "hasLimit" },
    { title: "Has Entitlement", field: "hasEntitlement" },
    /* {
      title: "Client",
      field: "clientName",
    },
    {
      title: "Subject",
      field: "subjectName",
    }, */
    /*   { title: "Service Type", field: "serviceType" },
    { title: "Activity Time", field: "activityTime" }, */
    /*   { title: "Created By", field: "createdBy", sorter: true },
    { title: "Updated By", field: "updatedBy", sorter: true },
    { title: "Updated Date", field: "updatedDate", sorter: true },
    { title: "Deleted By", field: "deletedBy" },
    { title: "Deleted Date", field: "deletedDate" },
    { title: "IS Deleted", field: "isDeleted" }, */
    { title: "Created Date", field: "createdAt" },
    {
      title: "status",
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
    setSubServiceId("");
  };
  const handleEdit = () => {
    setVisible(true);
    setSubServiceId(selectedRows[0]?.id);
  };
  const handleFormSubmit = (values) => {
    console.log("values", values)
    mutate(
      {
        subServiceId: subServiceId,
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
          }
          else {
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
        subServiceIds: records?.map((row) => row.id),
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
  /*  const handleDelete = (records, setVisible) => {
     console.log("deleted record", records);
     deletemutate(
       {
         subServiceIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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
              "Sub Service"
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
                "Sub Service"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Sub Service");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "Sub Service");
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
          title={"Sub Services"}
          data={data?.data?.data?.rows}
          rowSelection
          totalRecords={data?.data?.data?.count}
          columns={columns}
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
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/sub_service_import_template.xlsx`}
        masterType={"subService"}
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
            <div className="dialog-header-title">Add Sub Service</div>
          </div>
        }
        className="w-576"
        visible={visible}
        position={"bottom"}
        onHide={handleClose}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row row-gap-3_4">
            {" "}
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Name</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Name is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText {...field} placeholder="Enter Name" />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Client</label>
                <Controller
                  name="clientId"
                  control={control}
                  rules={{ required: "Client is required." }}
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
                        {errors[field.name]?.message}
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div> */}
            {" "}
            {/* <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Subject</label>
                <Controller
                  name="subjectId"
                  control={control}
                  rules={{ required: "Subject is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Subject"
                        options={subjectData?.data?.data}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(e) => {
                          field.onChange(e.value);
                          setValue("serviceId", "");
                        }}
                      />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div> */}
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Select Service</label>
                <Controller
                  name="serviceId"
                  control={control}
                  rules={{ required: "Service is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Service"
                        options={serviceData?.data?.data}
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
                <label className="form-label required">has Asp Assignment</label>
                <Controller
                  name="hasAspAssignment"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_yes_hasAspAssignment"
                          {...field}
                          value={1}
                          checked={field.value === 1}
                        />
                        <label
                          htmlFor="radio_yes_hasAspAssignment"
                          className="common-radio-label"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_no_hasAspAssignment"
                          {...field}
                          value={0}
                          checked={field.value === 0}
                        />
                        <label
                          htmlFor="radio_no_hasAspAssignment"
                          className="common-radio-label"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group radio-form-group">
                <label className="form-label required">has Limit</label>
                <Controller
                  name="hasLimit"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_yes_hasLimit"
                          {...field}
                          value={1}
                          checked={field.value === 1}
                        />
                        <label
                          htmlFor="radio_yes_hasLimit"
                          className="common-radio-label"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_no_hasLimit"
                          {...field}
                          value={0}
                          checked={field.value === 0}
                        />
                        <label
                          htmlFor="radio_no_hasLimit"
                          className="common-radio-label"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group radio-form-group">
                <label className="form-label required">has Entitlement</label>
                <Controller
                  name="hasEntitlement"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_yes_hasEntitlement"
                          {...field}
                          value={1}
                          checked={field.value === 1}
                        />
                        <label
                          htmlFor="radio_yes_hasEntitlement"
                          className="common-radio-label"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_no_hasEntitlement"
                          {...field}
                          value={0}
                          checked={field.value === 0}
                        />
                        <label
                          htmlFor="radio_no_hasEntitlement"
                          className="common-radio-label"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
            {hasEntitlement == 1 &&
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">Select Entitlement</label>
                  <Controller
                    name="entitlementIds"
                    control={control}
                    rules={{ required: "Entitlement is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <MultiSelect
                          value={field.value}
                          placeholder="Select Entitlements"
                          options={formData?.data?.data?.extras?.entitlements}
                          optionLabel="name"
                          optionValue="id"
                          onChange={(e) => { field.onChange(e.value); console.log("e.value", e.value) }}
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
            }
            <div className="col-md-6">
              <div className="form-group radio-form-group">
                <label className="form-label required">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_yes_status"
                          {...field}
                          value={1}
                          checked={field.value === 1}
                        />
                        <label
                          htmlFor="radio_yes_status"
                          className="common-radio-label"
                        >
                          Active
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_no_status"
                          {...field}
                          value={0}
                          checked={field.value === 0}
                        />
                        <label
                          htmlFor="radio_no_status"
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

export default SubService;
