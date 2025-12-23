import React, { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { CloseIcon, TowingVehicleIcon } from "../../../utills/imgConstants";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
  aspList,
  getVehicleFormData,
  saveVehicle,
} from "../../../../services/adminService";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { vehicleModal } from "../../../../services/masterServices";
import { vehicleNumberValidation } from "../../../utills/patternValidation";

const AddVehicleMaster = () => {
  const { vehicleId } = useParams();
  const [aspListData, setAspDataList] = useState([]);
  const [aspQuery, setASPQuery] = useState(null);
  const defaultValues = {
    vehicleRegistrationNumber: "",
    vehicleTypeId: "",
    vehicleMakeId: "",
    vehicleModelId: "",
    aspId: "",
    gpsDeviceId: "",
    serviceOrganisationId: "",
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
  const { data } = useQuery(
    ["vehicleformData"],
    () => getVehicleFormData({ ownPatrolVehicleId: vehicleId ?? "" }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (vehicleId) {
            Object.keys(defaultValues)?.forEach((field) => {
              if (field == "aspId") {
                setValue(`${field}`, res?.data?.data?.ownPatrolVehicle?.asp);
              } else
                setValue(`${field}`, res?.data?.data?.ownPatrolVehicle[field]);
            });
          }
        }
      },
    }
  );

  const {
    data: aspData,
    isFetching,
    refetch,
  } = useQuery(
    ["ownpatrolaspList", aspQuery],
    () =>
      aspList({
        filterOwnPatrol: 1,
        apiType: "dropdown",
        search: aspQuery,
      }),
    {
      enabled: aspQuery ? true : false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          // console.log("asp data List", res);
          setAspDataList(res?.data?.data);
        } else {
          setAspDataList([{ name: "No data found" }]);
        }
      },
    }
  );
  const { mutate } = useMutation(saveVehicle);

  const navigate = useNavigate();

  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/admin/vehicle-master")}>
          Vehicle Master
        </div>
      ),
    },
    { label: <div>{vehicleId ? "Edit" : "Add"} Vehicle</div> },
  ];
  // console.log("errors", errors);
  const handleClose = () => {
    navigate("/admin/vehicle-master");
    reset(defaultValues);
  };
  const handleFormSubmit = (values) => {
    // console.log("values", values);
    mutate(
      {
        id: vehicleId ?? null,
        ...values,
        gpsDeviceId: values?.gpsDeviceId ? values?.gpsDeviceId : null,
        aspId: values?.aspId?.id,
        vehicleMakeId: values?.vehicleMakeId || null,
        vehicleModelId: values?.vehicleModelId || null,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            navigate("/admin/vehicle-master");
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

  const handleASPChange = (event) => {
    setASPQuery(event.query);
  };

  const selectedVehicleMakeId = useWatch({
    control,
    name: "vehicleMakeId",
  });

  const { data: vehicleModels } = useQuery(
    ["vehicleModelDropDown", selectedVehicleMakeId],
    () =>
      vehicleModal({
        apiType: "dropdown",
        vehicleMakeId: selectedVehicleMakeId,
      }),
    {
      enabled: selectedVehicleMakeId ? true : false,
    }
  );

  // console.log("data", data);
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
                  <h5 className="page-content-title">
                    {vehicleId ? "Edit" : "Add"} Vehicle
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
            <form
              id="vehicle-master-form"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">
                      Vehicle Reg No
                    </label>
                    <Controller
                      name="vehicleRegistrationNumber"
                      control={control}
                      rules={{
                        required: "Vehicle Reg No is required.",
                        validate: {
                          matchPattern: (v) => {
                            if (v && v.length > 0) {
                              return (
                                vehicleNumberValidation(v) ||
                                "Please enter a valid Vehicle Registration Number"
                              );
                            }
                            return true;
                          },
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            value={field.value?.toUpperCase() || ""}
                            keyfilter={"alphanum"}
                            placeholder="Enter Vehicle Reg No"
                            maxLength={15}
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
                    <label className="form-label required">Vehicle Type</label>
                    <Controller
                      name="vehicleTypeId"
                      rules={{
                        required: "Vehicle Type is required.",
                      }}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Vehicle Type"
                            options={data?.data?.data?.extras?.vehicleTypes}
                            optionLabel="name"
                            optionValue={"id"}
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
                    <label className="form-label">Vehicle Make</label>
                    <Controller
                      name="vehicleMakeId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select Vehicle Make"
                            options={data?.data?.data?.extras?.vehicleMakes}
                            optionLabel="name"
                            optionValue={"id"}
                            onChange={(e) => {
                              field.onChange(e.value);
                              setValue("vehicleModelId", "");
                            }}
                            resetFilterOnHide={true}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Vehicle Model</label>
                    <Controller
                      name="vehicleModelId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select Vehicle Model"
                            options={vehicleModels?.data?.data}
                            optionLabel="name"
                            optionValue={"id"}
                            onChange={(e) => field.onChange(e.value)}
                            resetFilterOnHide={true}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">ASP Code</label>
                    <Controller
                      name="aspId"
                      control={control}
                      rules={{ required: "ASP is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <AutoComplete
                            inputId={field.code}
                            value={field.value}
                            field="code"
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            inputRef={field.ref}
                            suggestions={aspListData}
                            itemTemplate={(item) => (
                              <div>
                                <strong>{item.code}</strong> {"-" + item.name}
                              </div>
                            )}
                            completeMethod={handleASPChange}
                            className="form-control-select"
                            placeholder="Enter ASP Code"
                            pt={{
                              list: {
                                className: `${
                                  aspData?.data?.success ? "" : "empty-state"
                                }`,
                              },
                            }}
                          />
                          {/*  <Dropdown
                  value={field.value}
                  placeholder="Select City"
                  options={data?.data?.data}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => field.onChange(e.value)}
                /> */}
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
                    <label className="form-label ">GPS Device ID</label>
                    <Controller
                      name="gpsDeviceId"
                      // rules={{
                      //   required: "GPS Device ID is required.",
                      // }}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter GPS Device ID"
                          />
                          {/* <div className="p-error">
                           
                            {errors && errors[field.name]?.message}
                          </div> */}
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Service Org</label>
                    <Controller
                      name="serviceOrganisationId"
                      control={control}
                      rules={{
                        required: "Service Org is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select Service Org"
                            options={
                              data?.data?.data?.extras?.serviceOrganisations
                            }
                            optionLabel="name"
                            optionValue={"id"}
                            onChange={(e) => field.onChange(e.value)}
                            resetFilterOnHide={true}
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
                  form="vehicle-master-form"
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

export default AddVehicleMaster;
