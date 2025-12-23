import React, { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { InputText } from "primereact/inputtext";
import { CloseIcon, TowingVehicleIcon } from "../../../utills/imgConstants";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
  getHelperFormData,
  saveHelper,
} from "../../../../services/adminService";
import { RadioButton } from "primereact/radiobutton";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import { cities } from "../../../../services/masterServices";
import { Button } from "primereact/button";
 
const AddEditHelper = () => {
  const { helperId } = useParams();
  const [cityQuery, setCityQuery] = useState();
  const [cityList, setCityList] = useState([]);
 
  const defaultValues = {
    code: "",
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    stateId: "",
    cityId: "",
    userName: "",
    password: "",
    changePassword: 0,
    status: 1,
  };
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues,
  });
  const StateId = useWatch({
    control,
    name: "stateId",
  });
 
  const { data: cityData } = useQuery(
    ["cities", StateId, cityQuery],
    () =>
      cities({
        apiType: "dropdown",
        stateId: StateId,
        ...(cityQuery && { search: cityQuery }),
      }),
    {
      enabled: StateId ? true : false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          console.log("city data List", res);
          setCityList(res?.data?.data);
        } else {
          setCityList([{ name: "No data found" }]);
        }
      },
    }
  );
  const changePassword = useWatch({
    control,
    name: "changePassword",
  });
 
  const { data } = useQuery(
    ["helperformData"],
    () => getHelperFormData({ ownPatrolVehicleHelperId: helperId ?? "" }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (helperId) {
            const { cityId, changePassword, userName, ...rest } = defaultValues;
            Object.keys(rest)?.forEach((field) => {
              setValue(
                `${field}`,
                res?.data?.data?.ownPatrolVehicleHelper?.[field]
              );
            });
            setValue("changePassword", 0);
            setValue("cityId", res?.data?.data?.ownPatrolVehicleHelper?.city);
            setValue(
              "userName",
              res?.data?.data?.ownPatrolVehicleHelper?.user?.userName
            );
          }
        }
      },
    }
  );
 
  const { mutate, isLoading } = useMutation(saveHelper);
 
  const navigate = useNavigate();
 
  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/admin/helper")}>Vehicle Helper</div>
      ),
    },
    { label: <div>{helperId ? "Edit" : "Add"} Helper</div> },
  ];
  console.log("errors", errors);
  const handleClose = () => {
    navigate("/admin/helper");
    reset(defaultValues);
  };
  const handleFormSubmit = (values) => {
    mutate(
      {
        ownPatrolVehicleHelperId: helperId ?? null,
        userId: data?.data?.data?.ownPatrolVehicleHelper?.user?.id ?? null,
        ...values,
        cityId: values?.cityId?.id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            navigate("/admin/helper");
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
 
  const validateUppercase = (value) => {
    return (
      /[A-Z]/.test(value) ||
      "Password must contain at least one uppercase letter"
    );
  };
 
  const validateLowercase = (value) => {
    return (
      /[a-z]/.test(value) ||
      "Password must contain at least one lowercase letter"
    );
  };
 
  const validateSpecialCharacter = (value) => {
    return (
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value) ||
      "Password must contain at least one special character"
    );
  };
  const handleCityChange = (event) => {
    setCityQuery(event.query);
  };
  console.log("data", data);
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={TowingVehicleIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">{helperId ? "Edit" : "Add"} Helper</h5>
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
            <form id="helper-form" onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="row row-gap-3_4">
                <div className="col-md-3">
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
                          <InputText
                            {...field}
                            placeholder="Enter Name"
                            autoComplete="off"
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Code</label>
                    <Controller
                      name="code"
                      rules={{
                        required: "Code is required.",
                      }}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter Code"
                            autoComplete="off"
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Email ID</label>
                    <Controller
                      name="email"
                      control={control}
                      // rules={{
                      //   required: "Email ID is required.",
                      //   validate: {
                      //     matchPattern: (v) =>
                      //       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                      //         v
                      //       ) || "Email address must be a valid address",
                      //   },
                      // }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            value={field.value}
                            placeholder="Enter Email Id"
                            autoComplete="off"
                          />
                         
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Mobile Number</label>
                    <Controller
                      name="mobileNumber"
                      control={control}
                      rules={{
                        required: "Mobile Number is required.",
 
                        validate: {
                          matchPattern: (v) =>
                            /^([+]\d{2})?\d{10}$/.test(v) ||
                            "Mobile Number must be a valid number",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter Mobile Number"
                            maxLength={10}
                            keyfilter={"pnum"}
                            autoComplete="off"
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
                    <label className="form-label required">Address</label>
                    <Controller
                      name="address"
                      control={control}
                      rules={{ required: "Address is required" }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            value={field.value}
                            placeholder="Enter address"
                            autoComplete="off"
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">State</label>
                    <Controller
                      name="stateId"
                      control={control}
                      rules={{ required: "State is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select State"
                            options={data?.data?.data?.extras?.states}
                            optionLabel={"name"}
                            optionValue={"id"}
                            className={`form-control-select ${
                              fieldState.error ? "p-invalid" : ""
                            }`}
                            onChange={(e) => {
                              field.onChange(e.value);
                              setValue("cityId", "");
                            }}
                            filter
                          />
 
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">City</label>
                    <Controller
                      name="cityId"
                      control={control}
                      rules={{ required: "City is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <AutoComplete
                            inputId={field.name}
                            value={field.value}
                            field="name"
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            inputRef={field.ref}
                            suggestions={cityList}
                            completeMethod={handleCityChange}
                            className="form-control-select"
                            placeholder="Enter City Name"
                            pt={{
                              list: {
                                className: `${
                                  data?.data?.success ? "" : "empty-state"
                                }`,
                              },
                            }}
                          />
 
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
 
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Username</label>
                    <Controller
                      name="userName"
                      control={control}
                      rules={{ required: "UserName is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText {...field} placeholder="Enter Username"  autoComplete="off"/>
                          {console.log("errors", errors[field.name])}
                          <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
 
                {!helperId ? (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label required">Password</label>
                      <Controller
                        name="password"
                        control={control}
                        rules={{
                          required: "Password is required.",
                          minLength: {
                            value: 12,
                            message:
                              "Password must have at least 12 characters",
                          },
                          validate: {
                            validateUppercase,
                            validateSpecialCharacter,
                            validateLowercase,
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <InputText
                              placeholder="Enter Password"
                              autoComplete="off"
                              {...field}
                            />
                            <div className="p-error">
                              {errors[field.name]?.message}
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="col-md-3">
                    <div className="form-group radio-form-group">
                      <label className="form-label">Change Password</label>
                      <Controller
                        name="changePassword"
                        control={control}
                        render={({ field, fieldState }) => (
                          <div className="common-radio-group">
                            <div className="common-radio-item">
                              <RadioButton
                                inputId="password_yes"
                                {...field}
                                value={1}
                                checked={field.value === 1}
                              />
                              <label
                                htmlFor="password_yes"
                                className="common-radio-label"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="common-radio-item">
                              <RadioButton
                                inputId="password_no"
                                {...field}
                                value={0}
                                checked={field.value === 0}
                              />
                              <label
                                htmlFor="password_no"
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
                )}
 
                {changePassword ? (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label required">Password</label>
                      <Controller
                        name="password"
                        control={control}
                        rules={{
                          required: "Password is required.",
                          minLength: {
                            value: 12,
                            message:
                              "Password must have at least 12 characters",
                          },
                          validate: {
                            validateUppercase,
                            validateSpecialCharacter,
                            validateLowercase,
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <InputText
                              placeholder="Enter Password"
                              autoComplete="off"
                              {...field}
                            />
                            <div className="p-error">
                              {errors[field.name]?.message}
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>
                ) : null}
 
                <div className="col-md-3">
                  <div className="form-group radio-form-group">
                    <label className="form-label required">Status</label>
                    <Controller
                      name="status"
                      control={control}
                      rules={{ required: "Is Active is required" }}
                      render={({ field, fieldState }) => (
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="active_yes"
                              {...field}
                              value={1}
                              checked={field.value == 1}
                            />
                            <label
                              htmlFor="active_yes"
                              className="common-radio-label"
                            >
                              Active
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="active_no"
                              {...field}
                              value={0}
                              checked={field.value == 0}
                            />
                            <label
                              htmlFor="active_no"
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
            </form>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary"
                  type="submit"
                  form="helper-form"
                  loading={isLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default AddEditHelper;