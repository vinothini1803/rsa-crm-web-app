import React, { useRef, useState, useEffect } from "react";
import { Controller, useForm, useWatch, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";

import {
  client,
  languages,
  callCenterList,
} from "../../../../services/masterServices";
import {
  CloseIcon,
  ImageFile,
  ProfileUrl,
  UsersIcon,
} from "../../../utills/imgConstants";
import { FileUpload } from "primereact/fileupload";
import "./style.less";
import "../serviceContracts/style.less";
import { toast } from "react-toastify";
import { Password } from "primereact/password";
import {
  getUserFormData,
  replacementUser,
  saveuser,
  usersList,
} from "../../../../services/adminService";
import { useMutation, useQuery } from "react-query";
import { Button } from "primereact/button";
import { fileFromUrl } from "../../../utills/fileFromUrl";
import DynamicFormCard from "../../../components/common/DynamicFormCard";
import StatusBadge from "../../../components/common/StatusBadge";

const AddUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const defaultValues = {
    roleId: "",
    code: "",
    name: "",
    mobileNumber: "",
    email: "",
    userName: "",
    password: "",
    file: "",
    callCenterId: "",
    changePassword: "",
    address: "",
    status: 1,
    replacementUserId: "",
    languages: [{ languageSpoken: "", isPrimaryLanguage: null, rating: null }],
    levelId: "",
  };

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    reset,
    resetField,
  } = useForm({ defaultValues });

  const fileref = useRef(null);
  const MenuItems = [
    { label: <div onClick={() => navigate("/admin/users")}>Users</div> },
    { label: <div>{userId ? "Edit" : "Add"} User</div> },
  ];
  const uploadfile = useWatch({
    control,
    name: "file",
  });

  const changePassword = useWatch({
    control,
    name: "changePassword",
  });
  const status = useWatch({
    control,
    name: "status",
  });

  const roleId = useWatch({
    control,
    name: "roleId",
  });

  const { data: replacementData, refetch: replacementRefetch } = useQuery(
    ["replacementUser", roleId],
    () =>
      replacementUser({
        roleId: roleId,
      }),
    {
      enabled: roleId ? true : false,
    }
  );
  const replacementUserId = useWatch({
    control,
    name: "replacementUserId",
  });
  const { data } = useQuery(
    ["userFormData", userId],
    () =>
      getUserFormData({
        userId: userId ? userId : "",
      }),
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (userId) {
            // console.log("userData", Object.entries(res?.data?.data?.user));
            Object.keys(defaultValues).forEach((el) => {
              return setValue(`${el}`, res?.data?.data?.user[el]);
            });
            setValue("changePassword", 0);
            // console.log("fileref", fileref);

            setValue("clientIds", res?.data?.data?.user?.clientIds);
            setValue(
              "serviceRmIds",
              res?.data?.data?.user?.serviceRmUserDetails
            );
            setValue(
              "serviceZmIds",
              res?.data?.data?.user?.serviceZmUserDetails
            );
            setValue("teamLeaderId", res?.data?.data?.user?.tlId);
            setValue("smeUserId", res?.data?.data?.user?.smeUserId);
            if (res?.data?.data?.user?.languages) {
              const languages = res.data.data.user.languages;
              const primaryLanguageIndex = languages.findIndex(
                (language) => language.isPrimaryLanguage === 1
              );

              if (primaryLanguageIndex !== -1) {
                const primaryLanguage = languages[primaryLanguageIndex];

                // Remove the primary language from its original position
                languages.splice(primaryLanguageIndex, 1);

                // Insert the primary language at the beginning
                languages.unshift(primaryLanguage);
              }
              // console.log("Formatted Languages:", languages);
              const formattedLanguages = languages.map((language, index) => ({
                languageSpoken: {
                  id: language?.languageId,
                  name: language?.languageSpoken,
                },
                rating: language?.skillLevel,
                isPrimaryLanguage: language?.isPrimaryLanguage,
              }));
              setValue("languages", formattedLanguages);
            }
            if (res?.data?.data?.user?.profileName) {
              fileFromUrl(
                `${ProfileUrl}${res?.data?.data?.user?.profileName}`,
                res?.data?.data.user.profileName
              ).then((file) => {
                if (file) {
                  // File object is created, you can use it as needed
                  // console.log("File object:", file);
                  setValue("file", [file]);
                  fileref.current.setUploadedFiles([file]);
                } else {
                  console.log("Failed to create File object from URL.");
                }
              });
            }
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors?.forEach((el) => toast.error(el));
          }
        }
      },
      refetchOnWindowFocus: false,
    }
  );
  // console.log("data ", data);
  const { data: callCenterData } = useQuery(
    ["callCenterList"],
    () =>
      callCenterList({
        apiType: "dropdown",
      }),
    {
      enabled: roleId == 3 || roleId == 8,
    }
  );

  const selectedCallCenterId = useWatch({
    control,
    name: "callCenterId",
  });

  const { data: clientOptionsData } = useQuery(
    ["getClientOptions", selectedCallCenterId],
    () =>
      client({
        apiType: "dropdown",
        callCenterId: selectedCallCenterId,
      }),
    {
      enabled: selectedCallCenterId ? true : false,
    }
  );
  // console.log("roleId", roleId);
  const modifiedRoleId = (() => {
    switch (roleId) {
      case 12:
        return 11; // If roleId is 12, send 11
      case 11:
        return 6; // If roleId is 11, send 6
      case 3:
        return 7;
      default:
        return roleId; // Otherwise, keep the same roleId
    }
  })();

  const { data: agents, refetch: refetchAgents } = useQuery(
    ["agentList", modifiedRoleId],
    () => usersList({ apiType: "dropdown", roleId: modifiedRoleId }),
    {
      enabled: roleId == 12 || roleId == 11 || roleId == 3 ? true : false,
    }
  );
  const { data: smeData, refetch: refetchSme } = useQuery(
    ["smeList"],
    () => usersList({ apiType: "dropdown", roleId: 14 }),
    {
      enabled: roleId == 3 ? true : false,
    }
  );
  // console.log("smeData", smeData);
  const { data: languageOptions } = useQuery(
    ["languageList"],
    () => languages({ apiType: "dropdown" }),
    {
      enabled: roleId == 3 || roleId == 8,
    }
  );

  // console.log("roles", agents?.data?.data);

  const { mutate, isLoading } = useMutation(saveuser);
  const handleClose = () => {
    navigate("/admin/users");
    reset(defaultValues);
  };
  const emptyTemplate = () => (
    <div className="upload-empty-container">
      {/* <img src={ImageFile} /> */}
      <div className="upload-empty-container-title" onClick={() => {}}>
        Add Photo
      </div>
    </div>
  );

  const chooseOption = {
    icon: null,
    className: "add-btn",
    label: "upload",
  };

  const itemTemplate = (file, props) => {
    // console.log("file Template", uploadfile, file);
    return (
      <div>
        <img src={file.objectURL} className="preview-image" />
      </div>
    );
  };

  const handleUpload = (e) => {
    // console.log("upload event", e);
  };
  const onFormSubmit = (value) => {
    // console.log("user form value", value);
    const FormValues = new FormData();
    if (changePassword !== "" && !changePassword) {
      delete value.password;
    }
    const values = {
      ...value,
      callCenterId: value.callCenterId ? value.callCenterId : "",
      ...(value?.mobileNumber && { mobileNumber: value?.mobileNumber }),
      ...(userId && {
        userId: userId,
      }),
      existingProfileName:
        userId && data?.data?.data?.user?.profileName
          ? data?.data?.data?.user?.profileName
          : "",
      ...(userId && changePassword && { password: value.password }),
    };
    if (value.roleId === 3 || value.roleId === 8) {
      value.clientIds
        ?.map((client) => client.id)
        .forEach((id) => {
          FormValues.append("clientIds[]", id);
        });

      //FormValues.append("languages[]", JSON.stringify(value?.languages));
      value.languages?.forEach((language, index) => {
        const languageData = {
          languageId: language?.languageSpoken?.id,
          languageSpoken: language?.languageSpoken?.name,
          skillLevel: language?.rating,
          isPrimaryLanguage: index === 0 ? 1 : 0,
        };
        // console.log("user form languageData", languageData);
        FormValues.append("languages[]", JSON.stringify(languageData));
      });
    }

    // Remove clientIds, serviceZmIds, and serviceRmIds from values
    delete values.clientIds;
    delete values.serviceZmIds;
    delete values.serviceRmIds;
    delete values?.languages;
    delete values?.replacementUserId;
    delete values?.levelId;
    delete values?.teamLeaderId;
    delete values?.smeUserId;
    if (value.roleId == 3) {
      delete values?.email;
      delete values?.mobileNumber;
    }

    //for agent
    if (value.roleId == 3) {
      FormValues.append("levelId", value.levelId);
      FormValues.append("teamLeaderId", value.teamLeaderId);
      if (value.smeUserId) {
        FormValues.append("smeUserId", value.smeUserId);
      }
      if (value.email) {
        FormValues.append("email", value.email);
      }
      if (value.mobileNumber) {
        FormValues.append("mobileNumber", value.mobileNumber);
      }
    }
    // Append serviceZmIds as integers if roleId is 12
    if (value.roleId === 12) {
      value.serviceZmIds
        ?.map((zonal) => zonal.id)
        .forEach((id) => {
          FormValues.append("serviceZmIds[]", id);
        });
    }

    // Append serviceRmIds as integers if roleId is 11
    if (value.roleId === 11) {
      value.serviceRmIds
        ?.map((rm) => rm.id)
        .forEach((id) => {
          FormValues.append("serviceRmIds[]", id);
        });
    }

    if (
      status == 0 &&
      (value.roleId === 6 || value.roleId === 11 || value.roleId === 12)
    ) {
      FormValues.append("replacementUserId", replacementUserId);
    } else {
      FormValues.append("replacementUserId", "");
    }
    Object.entries(values)?.forEach((el) => {
      if (el[0] == "file") {
        return FormValues.append(el[0], Array.isArray(el[1]) ? el[1][0] : "");
      }
      return FormValues.append(el[0], el[1]);
    });
    for (let [key, value] of FormValues.entries()) {
      // console.log("user form form data", `${key}: ${value}`);
    }

    mutate(FormValues, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          navigate("/admin/users");
          reset(defaultValues);
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors?.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };
  const onFileSelect = (e, field) => {
    // console.log("onFileSelect", e, e.files);
    field.onChange(e.files);
    if (userId && data?.data?.data?.user?.profileName) {
      fileref.current.setUploadedFiles([]);
    }
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
  // console.log("data?.data?.extras", data?.data?.data?.extras?.roles);
  // console.log("errorrrr ***", errors);
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });
  // console.log("languageFields", languageFields);
  const handleAdd = () => {
    appendLanguage({
      languageSpoken: "",
      isPrimaryLanguage: null,
      rating: null,
    });
  };

  const handleRemove = (e, index) => {
    removeLanguage(index);
  };
  const languagesWatch = useWatch({
    control,
    name: "languages", // Specify the field you want to watch
    defaultValue: [], // Default value in case the field is not set yet
  });

  // console.log("languagesWatch", languagesWatch);
  // console.log("errors", errors);
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img className="img-fluid" src={UsersIcon} alt="Title Icon" />
                </div>
                <div>
                  <h5 className="page-content-title">
                    {userId ? "Edit" : "New"} User
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
            <form onSubmit={handleSubmit(onFormSubmit)} id="userform">
              <div className="row row-gap-3_4">
                <div className="col-md-12">
                  <div className="form-group">
                    <Controller
                      name="file"
                      control={control}
                      //defaultValue={null}
                      // rules={{ required: "Photo is required." }}
                      render={({ field, fieldState }) => {
                        // console.log("file upload field", field);
                        return (
                          <>
                            <FileUpload
                              ref={fileref}
                              field={field}
                              multiple={false}
                              contentStyle={{
                                width: "max-content",
                                padding: "0px",
                                borderRadius: "4px",
                              }}
                              onSelect={(e) => onFileSelect(e, field)}
                              headerTemplate={({ chooseButton }) =>
                                chooseButton
                              }
                              emptyTemplate={emptyTemplate}
                              itemTemplate={itemTemplate}
                              onBeforeUpload={handleUpload}
                              chooseOptions={chooseOption}
                              pt={{
                                root: {
                                  className: `profile-preview-upload ${
                                    uploadfile ? "change-upload" : ""
                                  }`,
                                },
                              }}
                            ></FileUpload>
                          </>
                        );
                      }}
                    />

                    {/* 
                    <FileUpload
                      multiple={false}
                      contentStyle={{
                        width: "max-content",
                        padding: "0px",
                        borderRadius: "4px",
                      }}
                      //className="custom-preview-image"
                      name="upload_demo[]"
                      headerTemplate={({ chooseButton }) => chooseButton}
                      emptyTemplate={emptyTemplate}
                      itemTemplate={itemTemplate}
                      onBeforeUpload={handleUpload}
                      chooseOptions={chooseOption}
                      pt={{
                        root: {
                          className: `profile-preview-upload ${
                            1 ? "change-upload" : ""
                          }`,
                        },
                      }}
                    ></FileUpload> */}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Name</label>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "Name is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText {...field} placeholder="Enter Name" />
                          {/* {console.log("errors", errors[field.name])} */}
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
                    <label className="form-label required">Code</label>
                    <Controller
                      name="code"
                      control={control}
                      rules={{ required: "Code is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText {...field} placeholder="Enter Code" />
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
                    <label className="form-label required">Role</label>
                    <Controller
                      name="roleId"
                      control={control}
                      rules={{ required: "Role is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Role"
                            options={data?.data?.data?.extras?.roles}
                            optionLabel="name"
                            optionValue="id"
                            onChange={(e) => {
                              field.onChange(e.value);
                              setValue("callCenterId", "");
                              // replacementRefetch();
                              resetField("replacementUserId");
                              resetField("teamLeaderId");
                              resetField("smeUserId");
                              setValue("clientIds", []);
                            }}
                            filter
                            filterBy="name"
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
                    <label
                      className={
                        roleId == 3 ? "form-label " : "form-label required"
                      }
                    >
                      Email ID
                    </label>
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
                      rules={{
                        required:
                          roleId !== 3
                            ? {
                                value: true,
                                message: "Email ID is required",
                              }
                            : false, // Set to false when roleId is 3
                        validate:
                          roleId !== 3
                            ? {
                                matchPattern: (v) =>
                                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                                    v
                                  ) || "Email address must be a valid address",
                              }
                            : undefined, // Set to undefined when roleId is 3
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            value={field.value}
                            placeholder="Enter Email ID"
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
                    <label
                      className={
                        roleId == 3 ? "form-label " : "form-label required"
                      }
                    >
                      Mobile Number
                    </label>
                    <Controller
                      name="mobileNumber"
                      control={control}
                      // rules={
                      //   roleId === 3
                      //     ? { required: [] } // No validation for roleId 3
                      //     : {
                      //         required: "Mobile Number is required.",

                      //         validate: {
                      //           matchPattern: (v) =>
                      //             /^([+]\d{2})?\d{10}$/.test(v) ||
                      //             "Mobile Number must be a valid number",
                      //         },
                      //       }
                      // }
                      rules={{
                        required:
                          roleId !== 3
                            ? {
                                value: true,
                                message: "Mobile Number is required",
                              }
                            : false, // Set to false when roleId is 3
                        validate:
                          roleId !== 3
                            ? {
                                matchPattern: (v) =>
                                  /^([+]\d{2})?\d{10}$/.test(v) ||
                                  "Mobile Number must be a valid number",
                              }
                            : undefined, // Set to undefined when roleId is 3
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter Mobile Number"
                            maxLength={10}
                            keyfilter={"pnum"}
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
                          <InputText {...field} placeholder="Enter Username" />
                          {/* {console.log("errors", errors[field.name])} */}
                          <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>

                {!userId ? (
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
                {roleId == 3 && (
                  <>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-label required">
                          Team Leader
                        </label>
                        <Controller
                          name="teamLeaderId"
                          control={control}
                          rules={{ required: "Team Leader is required." }}
                          render={({ field, fieldState }) => (
                            <>
                              <Dropdown
                                value={field.value}
                                placeholder="Select"
                                options={agents?.data?.data}
                                optionLabel="name"
                                optionValue="id"
                                onChange={(e) => {
                                  field.onChange(e.value);
                                }}
                                filter
                                filterBy="name"
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
                        <label className="form-label ">SME</label>
                        <Controller
                          name="smeUserId"
                          control={control}
                          // rules={{ required: "SME is required." }}
                          render={({ field, fieldState }) => (
                            <>
                              <Dropdown
                                value={field.value}
                                placeholder="Select"
                                options={smeData?.data?.data}
                                optionLabel="name"
                                optionValue="id"
                                onChange={(e) => {
                                  field.onChange(e.value);
                                }}
                                filter
                                filterBy="name"
                              />
                              {/* <div className="p-error">
                               
                                {errors && errors[field.name]?.message}
                              </div> */}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}
                {(roleId == 3 || roleId == 8) && (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label required">Call Center</label>
                      <Controller
                        name="callCenterId"
                        control={control}
                        rules={{ required: "Call Center is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              value={field.value}
                              placeholder="Select Call Center"
                              options={callCenterData?.data?.data}
                              optionLabel="name"
                              optionValue="id"
                              onChange={(e) => {
                                field.onChange(e.value);
                                setValue("clientIds", []);
                              }}
                              filter
                              filterBy="name"
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
                )}
                {(roleId == 3 || roleId == 8) && (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label required">Clients</label>
                      <Controller
                        name={`clientIds`}
                        control={control}
                        rules={{ required: "Clients is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <MultiSelect
                              value={field.value}
                              onChange={(e) => field.onChange(e.value)}
                              options={clientOptionsData?.data?.data}
                              optionLabel="name"
                              // display="chip"
                              placeholder="Select Clients"
                              maxSelectedLabels={3}
                              className="form-control-select"
                              removeIcon={(options) => (
                                <img src={CloseIcon} {...options.iconProps} />
                              )}
                              filter
                              filterBy="name"
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

                {/* Enable Zonal Manager and Regional */}
                {roleId == 12 && (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label required">
                        Zonal Managers
                      </label>
                      <Controller
                        name="serviceZmIds"
                        control={control}
                        rules={{
                          required: "Zonal Manger reqired",
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <MultiSelect
                              value={field.value}
                              onChange={(e) => field.onChange(e.value)}
                              options={agents?.data?.data}
                              optionLabel="name"
                              // display="chip"
                              placeholder="Select Zonal Manager"
                              maxSelectedLabels={3}
                              className="form-control-select"
                              removeIcon={(options) => (
                                <img src={CloseIcon} {...options.iconProps} />
                              )}
                              filter
                              filterBy="name"
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
                {roleId == 11 && (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label required">
                        Regional Managers
                      </label>
                      <Controller
                        name="serviceRmIds"
                        control={control}
                        rules={{
                          required: "Regional Manager Required",
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <MultiSelect
                              value={field.value}
                              onChange={(e) => field.onChange(e.value)}
                              options={agents?.data?.data}
                              optionLabel="name"
                              // display="chip"
                              placeholder="Select Regional Managers"
                              maxSelectedLabels={3}
                              className="form-control-select"
                              removeIcon={(options) => (
                                <img src={CloseIcon} {...options.iconProps} />
                              )}
                              filter
                              filterBy="name"
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
                            r
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
                {roleId == 3 && (
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label required">Level</label>
                      <Controller
                        name="levelId"
                        control={control}
                        rules={{ required: "Level is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              value={field.value}
                              placeholder="Select Level"
                              options={data?.data?.data?.extras?.agentLevels}
                              optionLabel="name"
                              optionValue="id"
                              onChange={(e) => {
                                field.onChange(e.value);
                              }}
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
                )}
                <div className="col-md-3">
                  <div className="form-group radio-form-group">
                    <label className="form-label required">Status</label>
                    <Controller
                      name="status"
                      control={control}
                      rules={{ required: "Status is required" }}
                      render={({ field, fieldState }) => (
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_yes"
                              {...field}
                              value={1}
                              checked={field.value == 1}
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
                              value={0}
                              checked={field.value == 0}
                            />
                            <label
                              htmlFor="radio_no"
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

                {status == 0 &&
                  (roleId == 6 || roleId == 11 || roleId == 12) && (
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-label required">
                          Replacement User
                        </label>
                        <Controller
                          name="replacementUserId"
                          control={control}
                          rules={{ required: "Replacement user is required." }}
                          render={({ field, fieldState }) => (
                            <>
                              <Dropdown
                                value={field.value}
                                placeholder="Select Replacement user"
                                options={replacementData?.data?.data}
                                optionLabel="name"
                                optionValue="id"
                                onChange={(e) => {
                                  field.onChange(e.value);
                                }}
                                filter
                                filterBy="name"
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
                  )}
              </div>
              {(roleId == 3 || roleId == 8) && (
                <div className="dynamic-cards-container">
                  <DynamicFormCard
                    title={"Languages Known"}
                    addLabel={"Add Language"}
                    onAdd={handleAdd}
                  >
                    {languageFields?.map((item, index) => (
                      <div className="fields-row" key={item.id}>
                        <div className="form-field">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label
                                  className={`${
                                    index == 0 ? "required" : ""
                                  }  form-label`}
                                >
                                  Language {index + 1}
                                  {index === 0 && (
                                    <StatusBadge
                                      text={"Primary"}
                                      statusId={1}
                                    />
                                  )}
                                </label>
                                <Controller
                                  name={`languages.${index}.languageSpoken`}
                                  control={control}
                                  // rules={index === 0 &&
                                  //  {required: "Primary language is required."}
                                  // }
                                  {...(index === 0
                                    ? {
                                        rules: {
                                          required:
                                            "Primary language is required",
                                        },
                                      }
                                    : { rules: { required: false } })}
                                  render={({ field, fieldState }) => (
                                    <>
                                      <Dropdown
                                        value={field.value}
                                        placeholder="Select"
                                        options={languageOptions?.data?.data}
                                        optionLabel="name"
                                        //optionValue="id"
                                        onChange={(e) => {
                                          field.onChange(e.value);
                                        }}
                                        filter
                                        filterBy="name"
                                      />

                                      <div className="p-error">
                                        {index == 0 &&
                                          errors &&
                                          errors?.languages?.length &&
                                          errors.languages[0]?.languageSpoken
                                            ?.message}
                                      </div>
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label
                                  className={`${
                                    index == 0 ? "required" : ""
                                  }  form-label`}
                                >
                                  Rating
                                </label>
                                <Controller
                                  name={`languages.${index}.rating`}
                                  control={control}
                                  rules={
                                    index == 0 && {
                                      required: "Primary rating is required.",
                                    }
                                  }
                                  render={({ field, fieldState }) => (
                                    <>
                                      <InputNumber
                                        {...field}
                                        value={field.value || null}
                                        onChange={(e) =>
                                          field.onChange(e.value)
                                        }
                                        className="input-design form-control no-border"
                                        placeholder="Enter Rating"
                                        mode="decimal"
                                        showButtons
                                        min={0}
                                        max={10}
                                      />
                                      {/* {console.log(
                                        "rating field ***",
                                        field,
                                        errors
                                      )} */}
                                      <div className="p-error error-font">
                                        {index == 0 &&
                                          errors &&
                                          errors?.languages?.length &&
                                          errors?.languages[0]?.rating?.message}
                                      </div>
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                            {index != 0 && (
                              <div className="col-md-3 mt-4">
                                <button
                                  className="btn-link btn-text-danger"
                                  type="button"
                                  onClick={(e) =>
                                    handleRemove(e, index, "ASP Reach timings")
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <Divider />
                      </div>
                    ))}
                  </DynamicFormCard>
                </div>
              )}
            </form>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center">
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary"
                  type="submit"
                  form="userform" //to intiaite form submission
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

export default AddUser;
