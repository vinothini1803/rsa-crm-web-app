import React from "react";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { CloseIcon, UserShieldIcon } from "../../../utills/imgConstants";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";

const AddMechanic = () => {
  const navigate = useNavigate();
  const { handleSubmit, control, getValues, formState, reset } = useForm();
  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/admin/asp-master")}>ASP Master</div>
      ),
    },
    {
      label: (
        <div onClick={() => navigate("/admin/asp-master/view")}>View ASP</div>
      ),
    },
    {
      label: <div> Add Mechanic</div>,
    },
  ];
  const handleFormSubmit = () => {};
  const handleClose = () => {
    navigate("/admin/asp-master/view");
  };
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          {" "}
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={UserShieldIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">Add Mechanic</h5>
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
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <Controller
                      name={`name`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          {...field}
                          placeholder="Eg : (TIER 1, TIER 2, TIER 3)"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Code</label>
                    <Controller
                      name={`code`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          {...field}
                          placeholder="Eg : AD Automobiles"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Email ID</label>
                    <Controller
                      name={`email_id`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          {...field}
                          placeholder="Eg : example@gmail.com"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Contact Number 1</label>
                    <Controller
                      name={`contact_number_1`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText {...field} placeholder="Eg : 987654311" />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">
                      Alternate Contact Number
                    </label>
                    <Controller
                      name={`alternate_contact_number`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText {...field} placeholder="Eg : 987654311" />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Business Hours</label>
                    <Controller
                      name={`business_hours`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Dropdown
                          value={field.value}
                          placeholder="Select Business Hours"
                          options={[
                            { label: "Center 1", value: "center1" },
                            { label: "Center 2", value: "center2" },
                          ]}
                          optionLabel="label"
                          onChange={(e) => field.onChange(e.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <Controller
                      name={`role`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Dropdown
                          value={field.value}
                          placeholder="Select Role"
                          options={[
                            { label: "Center 1", value: "center1" },
                            { label: "Center 2", value: "center2" },
                          ]}
                          optionLabel="label"
                          onChange={(e) => field.onChange(e.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Axapta Code</label>
                    <Controller
                      name={`axapta_code`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText {...field} placeholder="Eg : 9876" />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Latitude</label>
                    <Controller
                      name={`latitude`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          {...field}
                          placeholder="Eg : 987.69.87.69.876"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Longitude</label>
                    <Controller
                      name={`longitude`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          {...field}
                          placeholder="Eg : 987.69.87.69.876"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Performance</label>
                    <Controller
                      name={`performance`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Dropdown
                          value={field.value}
                          placeholder="Select Performance"
                          options={[
                            { label: "Center 1", value: "center1" },
                            { label: "Center 2", value: "center2" },
                          ]}
                          optionLabel="label"
                          onChange={(e) => field.onChange(e.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <Controller
                      name={`priority`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Dropdown
                          value={field.value}
                          placeholder="Select Priority"
                          options={[
                            { label: "Center 1", value: "center1" },
                            { label: "Center 2", value: "center2" },
                          ]}
                          optionLabel="label"
                          onChange={(e) => field.onChange(e.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Own Patrol</label>
                    <Controller
                      name={`own_patrol`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Dropdown
                          value={field.value}
                          placeholder="Select Own Patrol"
                          options={[
                            { label: "Center 1", value: "center1" },
                            { label: "Center 2", value: "center2" },
                          ]}
                          optionLabel="label"
                          onChange={(e) => field.onChange(e.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <Controller
                      name={`address`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText {...field} placeholder="Eg : Address" />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group radio-form-group">
                    <label className="form-label">Status</label>
                    <Controller
                      name="activeStatus"
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
                              Active
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
                              InActive
                            </label>
                          </div>
                        </div>
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
                <button className="btn btn-primary">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMechanic;
