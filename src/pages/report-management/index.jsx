import React, { useState } from "react";
import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import { CloseIcon } from "../../utills/imgConstants";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import DragDropFieldList from "../../components/common/DragDropFieldList";
import ReportFieldsList from "../../components/common/ReportFieldsList";

const ReportManagement = () => {
  const [reportFields, setReportFields] = useState([]);
  const [allFields, setAllFields] = useState([
    { id: "1", name: "Delivery Request Created Dealer ID" },
    { id: "2", name: "Delivery Request Created At" },
    { id: "3", name: "Delivery Request Updated At" },
    { id: "4", name: "Agent ID" },
    { id: "5", name: "Agent Assigned At" },
    { id: "6", name: "Case Number" },
    { id: "7", name: "Registration Number" },
    { id: "8", name: "Subject" },
    { id: "9", name: "Delivery Request SubService" },
  ]);
  const navigate = useNavigate();
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const defaultValues = {};
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });
  const handleClose = () => {
    navigate("/delivery-request");
  };

  const MenuItems = [
    {
      label: <div onClick={handleClose}>Delivery Requests</div>,
    },
    { label: <div className="text-caps">Reports</div> },
  ];

  const onFormSubmit = () => {};

  console.log("Report Fields", reportFields);

  const handleReportFieldChange = (index) => {
    const selectedField = allFields.splice(index, 1);
    console.log("selectedField", selectedField);
    setAllFields([...allFields]);
    setReportFields([{ ...selectedField[0], checked: true }, ...reportFields]);
  };

  const handleSelectFieldChange = (index) => {
    console.log("handle drag drop change");
    const selectedField = reportFields.splice(index, 1);
    console.log("selectedField", selectedField);
    setReportFields([...reportFields]);
    delete selectedField[0]["checked"];
    setAllFields([...selectedField, ...allFields]);
  };

  const handleAllFieldSearch = (value) => {
    console.log("AllFieldSearch", value);
    setAllFields(() =>
      allFields?.filter((el) =>
        el.name.toLowerCase().includes(value?.toLowerCase())
      )
    );
  };

  const handleReportFieldSearch = (value) => {
    setReportFields(() =>
      reportFields?.filter((el) =>
        el.name.toLowerCase().includes(value?.toLowerCase())
      )
    );
  };
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page without-step">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="d-flex gap-1_2 align-items-center">
                  <h5 className="page-content-title text-caps">Report</h5>
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
                    <label className="form-label">Role</label>
                    <Controller
                      name="role"
                      control={control}
                      rules={{ required: "" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select"
                            className="form-control-select"
                            options={[]}
                            optionLabel="name"
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

                <div className="font-md fnt-sbd">Report Headers</div>
                <div className="col-md-5 col-xxl-3">
                  <div className="form-group">
                    <label className="form-label">Select fields to add</label>
                    <ReportFieldsList
                      allFields={allFields}
                      onChange={handleReportFieldChange}
                      onSearchChange={handleAllFieldSearch}
                    />
                  </div>
                </div>
                <div className="col-md-5 col-xxl-3">
                  <div className="form-group">
                    <label className="form-label">Fields in report</label>
                    <DragDropFieldList
                      fields={reportFields}
                      setReportFields={setReportFields}
                      onSearchChange={handleReportFieldSearch}
                      onChange={handleSelectFieldChange}
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

                  //loading
                >
                  Download Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
