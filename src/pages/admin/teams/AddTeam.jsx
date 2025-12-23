import React, { useState } from "react";
import { useNavigate } from "react-router";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { CloseIcon, UserGroup } from "../../../utills/imgConstants";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { toast } from "react-toastify";

const AddTeam = () => {
  const navigate = useNavigate();
  const defaultValues = {
    name: "",
    business_hours: "",
    call_centers: "",
    description: "",
    own_cases: "Yes",
  };

  const { handleSubmit, control, getValues, formState: { errors }, reset } = useForm({defaultValues});
  const MenuItems = [
    { label: <div onClick={() => navigate("/admin/teams")}>Teams</div> },
    { label: <div>Add Teams</div> },
  ];

  const handleClose = () => {
    navigate("/admin/teams");
    reset(defaultValues);
  };
  const onFormSubmit = (data) => {
    if(data){
      toast.success("Added Successfully",{
        autoClose: 1000,
      })
      navigate("/admin/teams");
      reset(defaultValues);
    }
  };
  const onFileSelect = (e, field) => {
    field.onChange(e.files);
  };
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img className="img-fluid" src={UserGroup} alt="Title Icon" />
                </div>
                <div>
                  <h5 className="page-content-title">Add Team</h5>
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
            <form onSubmit={handleSubmit(onFormSubmit)} id="form_team">
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "Name is required." }}
                      render={({ field, fieldState }) => (
                        <>
                        <InputText {...field}   value={field.value} placeholder="Eg : Arun Kumar" />
                        <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                          </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Business Hours</label>
                    <Controller
                      name="business_hours"
                      control={control}
                      rules={{ required: "Business Hours is required." }}
                      render={({ field, fieldState }) => (
                        <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select "
                          options={[
                            { label: "Center 1", value: "center1" },
                            { label: "Center 2", value: "center2" },
                          ]}
                          optionLabel="label"
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
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Call Centers</label>
                    <Controller
                      name="call_centers"
                      control={control}
                      rules={{ required: "Call Centers is required." }}
                      render={({ field, fieldState }) => (
                        <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select "
                          options={[
                            { label: "Center 1", value: "center1" },
                            { label: "Center 2", value: "center2" },
                          ]}
                          optionLabel="label"
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
                <div className="col-md-3">
                  <div className="form-group radio-form-group">
                    <label className="form-label">Can own Cases</label>
                    <Controller
                      name="own_cases"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_yes"
                              {...field}
                              value="Yes"
                              checked={field.value === "Yes"}
                            />
                            <label
                              htmlFor="radio_yes"
                              className="common-radio-label"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_no"
                              {...field}
                              value="No"
                              checked={field.value === "No"}
                            />
                            <label
                              htmlFor="radio_no"
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
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: "Description is required." }}
                      render={({ field, fieldState }) => (
                        <>
                        <InputText {...field} value={field.value}placeholder="Eg : AI" />
                        
                         
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
            </form>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 ms-auto">
                <button className="btn btn-primary" type="submit" form="form_team">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeam;
