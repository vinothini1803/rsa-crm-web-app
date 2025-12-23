import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { VehicleConditionIcon, ImportFileBaseUrl, } from "../../../utills/imgConstants";
import { RadioButton } from "primereact/radiobutton";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
    saveConditionOfVehicle,
    conditionOfVehicleFormData,
    conditionOfVehicle,
    deleteConditionOfVehicle,
    updateConditionOfVehicleStatus,
    conditionOfVehicleImportMaster,
    conditionOfVehicleExportMaster
} from "../../../../services/masterServices";
import { Button } from "primereact/button";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";
import { Dropdown } from "primereact/dropdown";


const ConditionOfVehicle = () => {
    const [visible, setVisible] = useState(false);
    const [filters, setFilters] = useState();
    const [conditionOfVehicleId,setConditionOfVehicleId]=useState(null)
    const defaultValues = {
        name: "",
        status: 1,
    };
    const [pagination, setPagination] = useState({
        offset: 0,
        limit: 10,
    });
    const [importVisible, setImportVisible] = useState(false);
    const [exportVisible, setExportVisible] = useState(false);
    const [selectedRows, setSelectedRows] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const {
        handleSubmit,
        control,
        getValues,
        setValue,
        formState: { errors },
        reset,
    } = useForm({ defaultValues });
    const { data, isFetching, refetch } = useQuery(
        ["aspRejectedCcDetailReasonList", pagination, searchValue, filters],
        () =>
            conditionOfVehicle({
                apiType: "list",
                ...pagination,
                ...(searchValue && { search: searchValue }),
                ...filters,
            })
    );
    const { data: formData, refetch: formDataRefetch } = useQuery(
        ["aspRejectedCcDetailReasonFormData"],
        () =>
            conditionOfVehicleFormData({
                conditionOfVehicleId: selectedRows[0].id,
            }),
        {
            enabled: false,
            onSuccess: (res) => {
                if (res?.data?.success) {
                    if (selectedRows?.length == 1) {
                        console.log("defaultValues", defaultValues);

                        Object.keys(defaultValues)?.forEach((field) =>
                            setValue(`${field}`, res?.data?.data?.conditionOfVehicle[field])
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

    const { mutate, isLoading } = useMutation(saveConditionOfVehicle);
    const { mutate: statusMutate, isLoading: statusIsLoading } =
        useMutation(updateConditionOfVehicleStatus);
    const { mutate: deletemutate, isLoading: deleteIsLoading } =
        useMutation(deleteConditionOfVehicle);
    const { mutate: importMutate, isLoading: importIsLoading } =
        useMutation(conditionOfVehicleImportMaster);
    const { mutate: exportMutate, isLoading: exportIsLoading } =
        useMutation(conditionOfVehicleExportMaster);

    const handleStatusUpdate = (records, status, setVisible) => {
        console.log(records, status);
        statusMutate(
            {
                conditionOfVehicleIds: records?.map((row) => row.id),
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
    const columns = [
        { title: "Condition of vehicle", field: "name" },
        { title: "Created Date", field: "createdAt" },
        /* { title: "Created By", field: "createdBy" },
        { title: "Updated By", field: "updatedBy" },
        { title: "Updated Date", field: "updatedDate" },
        { title: "Deleted By", field: "deletedBy" },
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
    /*  const data = Array.from({ length: 30 }, (element, index, k) => {
      return {
        languages: "English",
        createdDate: "19-01-2023 9:00AM",
        createdBy: "Abhi",
        updatedBy: "Aru",
        updatedDate: "19-01-2023 9:00AM",
        deletedBy: "Abhi",
        deletedDate: "19-01-2023 9:00AM",
        status: index % 2 == 0 ? "inActive" : "active",
        statusId: index % 2 == 0 ? 6 : 1,
      };
    }); */
    const handleAdd = () => {
        setVisible(true);
        reset();
        setConditionOfVehicleId(null)
    };
    const handleEdit = (record) => {
        setVisible(true);
        formDataRefetch();
        setConditionOfVehicleId(record?.id)
    };
    const handleFormSubmit = (values) => {
        mutate(
            {
                conditionOfVehicleId: selectedRows?.length == 1 ? selectedRows[0]?.id : null,
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
    const handleDelete = (records, setVisible) => {
        console.log("deleted record", records);
        deletemutate(
            {
                conditionOfVehicleIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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
                            "Condition of Vehicle"
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
                                "Condition of Vehicle"
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
                        download(`${ImportFileBaseUrl}${res?.data?.path}`, "Condition of Vehicle");
                    }
                } else {
                    if (res?.data?.error) {
                        toast.error(res?.data?.error);
                        setExportVisible(false);
                        reset();
                        if (res?.data?.path) {
                            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Condition of Vehicle");
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
                    title={"Condition of vehicle"}
                    rowSelection
                    columns={columns}
                    data={data?.data?.data?.rows}
                    totalRecords={data?.data?.data?.count}
                    onPaginationChange={handlepageChange}
                    addbtn={{ onClick: handleAdd }}
                    onEdit={handleEdit}
                    filterFields={{
                        filterFields: ["activestatus"],
                    }}
                    onFilterApply={handleApplyFilter}
                    action={true}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    onSearch={handleSearchChange}
                    loading={isFetching}
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
                sampleExcel={`${ImportFileBaseUrl}/importTemplates/conditionOfVehicle_import_template.xlsx`}
                masterType={"conditionofvehicle"}
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
                        <div className="dialog-header-title">{conditionOfVehicleId ? "Edit":"Add"} Condition of vehicle</div>
                    </div>
                }
                visible={visible}
                position={"bottom"}
                className="w-460"
                onHide={handleClose}
                draggable={false}
                resizable={false}
            // closeIcon={<img src={VehicleConditionIcon} />}
            >
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="row row-gap-3_4">
                        <div className="col-md-12">
                            <div className="form-group">
                                <div lassName="form-group">
                                    <label className="form-label required">Condition of vehicle</label>
                                    <Controller
                                        name="name"
                                        rules={{
                                            required: "Condition of vehicle is required.",
                                        }}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <InputText {...field} placeholder="Enter Condition of vehicle" />
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
    );
};

export default ConditionOfVehicle;
