import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { CloseIcon, FolderIcon } from "../../../utills/imgConstants";
import { Dropdown } from "primereact/dropdown";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { useMutation, useQuery } from "react-query";
import { roleList } from "../../../../services/roleService";
import { roleBasedColumn } from "../../../../services/masterServices";
import { checkreportColumnsList } from "../../../../services/deliveryRequestService";
import ReportFieldsList from "../../../components/common/ReportFieldsList";
import { toast } from "react-toastify";

const AddColumnReport = () => {
  const navigate = useNavigate();
  const [allFields, setAllFields] = useState([]);
  const [selectedField, setSelectedField] = useState([]);
  const { roleId } = useParams();
  const { id } = useParams();

  const defaultValues = {
    roleId: "",
    reportColumn: [],
  };
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const handleClose = () => {
    navigate("/admin/deliveryRequestReport");
    reset();
  };

  const {
    data: reportColumnListData,
    isFetching,
    refetch,
  } = useQuery(
    ["checkreportColumnsList", roleId],
    () =>
      checkreportColumnsList({
        roleId: roleId ? roleId : null,
        filter: false,
      }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          setAllFields(
            res?.data?.data.map((item) => ({
              id: item.id,
              name: item.columnName,
              checked: roleId ? item.checked : false,
            }))
          );
          if (roleId) {
            setValue(
              "roleId",
              rolesListData?.data?.data?.find((role) => parseInt(roleId) === role.id)
            );
            setValue('reportColumn', res?.data?.data.filter((item) => item.checked)?.map((item) => item.id))
            setSelectedField(res?.data?.data.filter((item) => item.checked));
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

  const { mutate, isLoading } = useMutation(roleBasedColumn);

  const { data: rolesListData } = useQuery(["roleList"], () =>
    roleList({
      limit: 100,
      offset: 0,
      status: "Active",
      apiType: "dropdown",
      report: true,
    })
  );

  const onFormSubmit = (values) => {
    if (!values.reportColumn || values.reportColumn.length === 0) {
      toast.error("Report columns are required.");
      return;
    }
    const checkedIds = allFields
      .filter((field) => field.checked)
      .map((field) => field.id);
    console.log(checkedIds, 'checkedIds');
    const payload = {
      id: id ? id : null,
      roleId: values.roleId?.id,
      reportColumn: checkedIds,
    };
    mutate(payload, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          navigate("/admin/deliveryRequestReport");
          refetch();
        } else {
          if (res?.data?.errors) {
            toast.error(res?.data?.errors);
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };

  const handleReportFieldChange = (id, field) => {
    const updatedAllFields = allFields.map((field) =>
      field.id === id ? { ...field, checked: !field.checked } : field
    );
    setAllFields(updatedAllFields);

    const reportselectedFields = selectedField.some((el) => el.id == id)
      ? selectedField.filter((e) => e.id !== id)
      : [
        ...selectedField,
        ...reportColumnListData?.data?.data?.filter(
          (field) => field.id === id
        ),
      ];

    setSelectedField(reportselectedFields);

    field.onChange(reportselectedFields?.map((item) => item.id));
  };

  console.log("selected all field", selectedField);

  console.log("selected field");

  const handleAllFieldSearch = (value) => {
    const filteredFields = reportColumnListData?.data?.data.filter((el) =>
      el.columnName.toLowerCase().includes(value.toLowerCase())
    )?.map(item => {
      return {
        id: item.id,
        name: item.columnName,
        checked: item.checked,
      }
    })
    setAllFields(
      value !== ""
        ? filteredFields
        : reportColumnListData?.data?.data.map((item) => {
          return {
            id: item.id,
            name: item.columnName,
            checked: selectedField?.some((el) => el.id == item?.id),
          };
        })
    );
  };

  console.log("selectedField", selectedField);

  const handleSelectAll = (e) => {
    setAllFields(
      reportColumnListData?.data?.data.map((item) => ({
        id: item.id,
        name: item.columnName,
        checked: e,
      }))
    );
    setValue("reportColumn", e ? allFields.map(field => field.id) : []);
  };

  useEffect(() => {
    if (roleId) {
      setValue(
        "roleId",
        rolesListData?.data?.data?.find((role) => parseInt(roleId) === role.id)
      );
    }
  }, [roleId, rolesListData]);


  console.log(allFields, 'allFields');
  console.log(rolesListData?.data?.data, roleId, 'rolesListData?.data?.data');

  return (
    <div className="page-wrap">
      <div className="page-body">
        <div className="page-content-wrap form-page without-step">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={FolderIcon}
                    alt="Title Icon"
                  />
                </div>
                <div className="d-flex gap-1_2 align-items-center">
                  <h5 className="page-content-title text-caps">
                    {roleId ? "Edit" : "Add"} Report Columns
                  </h5>
                </div>
              </div>
              <div className="page-content-header-right">
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
          </div>
          <div className="page-content-body">
            <form onSubmit={handleSubmit(onFormSubmit)} id="formName">
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Role</label>
                    <Controller
                      name="roleId"
                      control={control}
                      rules={{ required: "Role is Required" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select Role"
                            className="form-control-select"
                            options={rolesListData?.data?.data}
                            optionLabel="name"
                            onChange={(e) => field.onChange(e.value)}
                            defaultValue={1}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3"></div>
                <div className="font-md fnt-sbd">Report Headers</div>
                <div className="col-md-5 col-xxl-3">
                  <div className="form-group">
                    <label className="form-label required">Select fields to add</label>
                    <Controller
                      name="reportColumn"
                      control={control}
                      rules={""}
                      render={({ field, fieldState }) => (
                        <>
                          <ReportFieldsList
                            allFields={allFields}
                            onChange={(id) =>
                              handleReportFieldChange(id, field)
                            }
                            onSearchChange={handleAllFieldSearch}
                            onSelectAll={handleSelectAll}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary"
                  type="submit"
                  form="formName"
                  loading={isLoading}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddColumnReport;
