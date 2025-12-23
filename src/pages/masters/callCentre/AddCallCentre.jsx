import React from "react";
import { CallCentreIcon, CloseIcon } from "../../../utills/imgConstants";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { useNavigate, useParams } from "react-router";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Controller, useForm } from "react-hook-form";
import { RadioButton } from "primereact/radiobutton";
import PinCodesCard from "./PinCodesCard";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { useMutation, useQuery } from "react-query";
import {
  callCenterFormData,
  saveCallCenter,
} from "../../../../services/masterServices";
import { usersList } from "../../../../services/adminService";
import { Dropdown } from "primereact/dropdown";

const AddCallCentre = () => {
  const navigate = useNavigate();
  const { callCenterId } = useParams();
  const defaultValues = {
    name: "",
    address: "",
    callCentreHeadId: null,
    managerIds: [],
    isCommandCenter: 1,
    email: "",
    phoneNumber: "",
    tollFreeNumber: "",
    whatsappNumber: "",
    spocEmailIds: null,
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

  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/admin/call-centers")}>Call Center</div>
      ),
    },
    { label: <div>{callCenterId ? "Edit" : "Add"} Call Center</div> },
  ];

  const { mutate, isLoading } = useMutation(saveCallCenter);
  const { data } = useQuery(
    ["callCenterFormData"],
    () =>
      callCenterFormData({
        callCenterId: callCenterId,
      }),
    {
      enabled: callCenterId ? true : false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          Object.keys(defaultValues)?.forEach((field) => {
            return setValue(`${field}`, res?.data?.data?.callCenter[field]);
          });
          let managers = res?.data?.data?.callCenter["managers"].map(
            (item) => item.managerId
          );
          setValue("managerIds", managers);
        }
      },
    }
  );
  const { data: managerData, refetch: refetchManagerData } = useQuery(
    ["managerList"],
    () => usersList({ apiType: "dropdown", roleId: 16 }) //call center Manager Id is 16
  );
  const { data: callCenterHeadData, refetch: refetchcallCenterHeadData } =
    useQuery(
      ["callCenterHeadList"],
      () => usersList({ apiType: "dropdown", roleId: 25 }) //call center Manager Id is 16
    );
  //console.log("callCenterHeadData", callCenterHeadData?.data?.data)
  const handleFormSubmit = (values) => {
    mutate(
      {
        ...(callCenterId && { callCenterId: callCenterId }),
        ...values,
        name: values.name.trim(),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message, {
              autoClose: 1000,
            });
            navigate("/admin/call-centers");
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
    navigate("/admin/call-centers");
    reset(defaultValues);
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
                  <img
                    className="img-fluid"
                    src={CallCentreIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">
                    {callCenterId ? "Edit" : "Add"} Call Center
                  </h5>
                </div>
              </div>
              <div className="page-content-header-right">
                {/* <div className="header-progressbar-wrap">
              <div className="header-progressbar-details  ">
                <span className="header-progressbar-label">
                  Completetion Percentage
                </span>
                <span className="header-progressbar-value">50 %</span>
              </div>
              <ProgressBar value={50} showValue={false}></ProgressBar>
            </div> */}
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
          </div>
          <div className="page-content-body">
            <form onSubmit={handleSubmit(handleFormSubmit)} id="add-form">
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group required">
                    <label className="form-label">Call Center Name</label>
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: "Call Center Name is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Eg : Call Center"
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
                    <label className="form-label required">Manager</label>
                    <Controller
                      name={`managerIds`}
                      control={control}
                      rules={{ required: "Clients is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <MultiSelect
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            options={managerData?.data?.data}
                            optionLabel="name"
                            optionValue="id"
                            // display="chip"
                            placeholder="Select Managers"
                            maxSelectedLabels={3}
                            className="form-control-select"
                            removeIcon={(options) => (
                              <img src={CloseIcon} {...options.iconProps} />
                            )}
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
                    <label className="form-label required">
                      Call Center Head
                    </label>
                    <Controller
                      name="callCentreHeadId"
                      control={control}
                      rules={{ required: "Call Center Head is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select"
                            options={callCenterHeadData?.data?.data}
                            optionLabel="name"
                            optionValue="id"
                            onChange={(e) => field.onChange(e.value)}
                            filter
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
                    <label className="form-label required">
                     Is Command Center
                    </label>
                    <Controller
                      name="isCommandCenter"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_yes_isCommandCenter"
                              {...field}
                              value={1}
                              checked={field.value === 1}
                            />
                            <label
                              htmlFor="radio_yes_isCommandCenter"
                              className="common-radio-label"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_no_isCommandCenter"
                              {...field}
                              value={0}
                              checked={field.value === 0}
                            />
                            <label
                              htmlFor="radio_no_isCommandCenter"
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
                    <label className="form-label required">E-mail</label>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "E-mail is required.",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid e-mail address.",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText {...field} placeholder="Enter E-mail" />
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
                    <label className="form-label required">Phone Number</label>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      rules={{
                        required: "Phone Number is required.",
                        pattern: {
                          value: /^\+?[1-9]\d{1,9}$/,
                          message: "Please enter a valid phone number.",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter Phone Number"
                            onKeyPress={(e) => {
                              // Allow only numbers
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
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
                    <label className="form-label required">
                      Toll Free Number
                    </label>
                    <Controller
                      name="tollFreeNumber"
                      control={control}
                      rules={{
                        required: "Toll Free Number is required.",
                        // pattern: {
                        //   // value: /^1800\d{6}$/,

                        //   message: "Please enter a valid toll-free number.",
                        // },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter Toll Free Number"
                            onKeyPress={(e) => {
                              // Allow only numbers and hyphen
                              if (!/[0-9-]/.test(e.key)) {
                                e.preventDefault();
                              }
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
                    <label className="form-label required">
                      WhatsApp Number
                    </label>
                    <Controller
                      name="whatsappNumber"
                      control={control}
                      rules={{
                        required: "WhatsApp Number is required.",
                        pattern: {
                          value: /^\+?[1-9]\d{1,9}$/,
                          message: "Please enter a valid phone number.",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter WhatsApp Number"
                            onKeyPress={(e) => {
                              // Allow only numbers
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
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
                    <label className="form-label">SPOC Email Ids</label>
                    <Controller
                      name="spocEmailIds"
                      control={control}
                      rules={{
                        validate: (value) => {
                          if (!value || value.trim() === "") {
                            return true; // Optional field
                          }
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          const emails = value.split(",").map((email) => email.trim()).filter((email) => email.length > 0);
                          const invalidEmails = emails.filter((email) => !emailRegex.test(email));
                          if (invalidEmails.length > 0) {
                            return `Invalid email: ${invalidEmails.join(", ")}`;
                          }
                          return true;
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter email IDs (comma separated)"
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group required">
                    <label className="form-label required">Address</label>
                    <Controller
                      name="address"
                      control={control}
                      rules={{ required: "Addres is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText {...field} placeholder="Enter Address" />
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
            </form>
            {/*   <div className="pincodes-container">
              <PinCodesCard />
            </div> */}
          </div>

          <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary"
                  type="submit"
                  form="add-form"
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

export default AddCallCentre;
