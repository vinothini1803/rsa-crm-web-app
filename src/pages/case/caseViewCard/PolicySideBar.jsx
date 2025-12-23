import React, { useState, useEffect } from "react";
import {
  DialogCloseIcon,
  PolicySidebarIcon,
} from "../../../utills/imgConstants";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import PolicyFileUpload from "../../../components/common/PolicyFileUpload";
import {
  savePolicyType,
  policyTypeData,
} from "../../../../services/caseService";
import { useMutation, useQuery } from "react-query";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { toast } from "react-toastify";
import moment from "moment";
import { fileFromUrl } from "../../../utills/fileFromUrl";
import { DialogCloseSmallIcon } from "../../../../src/utills/imgConstants";

const PolicySideBar = ({
  visible,
  setVisible,
  caseDetailId,
  caseViewRefetch,
  setEditVisible,
  editVisible,
}) => {
  const {
    handleSubmit,
    watch,
    trigger,
    control,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [files, setFiles] = useState();
  const [uploadedFiles, setUploadedFiles] = useState(files?.file || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileToPreview, setFileToPreview] = useState(null);
  const [existingPolicy, setExistingPolicy] = useState();
  const policyStartDate = watch("policyStartDate");
  const selectedPolicyType = useWatch({
    control,
    name: "policyTypes",
  });
  useEffect(() => {
    if (selectedPolicyType?.id !== 433) {
      setValue("serviceEligibility", null); // Reset the serviceEligibility field value
    }
  }, [selectedPolicyType, setValue]);
  useEffect(() => {
    // Trigger validation after setting the values
    trigger("policyEndDate");
  }, [policyStartDate, trigger]);
  const mapResponseToFormValues = (data) => ({
    policyNumber: data?.policyNumber || "",
    policyStartDate: new Date(data?.policyStartDate) || "",
    policyEndDate: new Date(data?.policyEndDate) || "",
    policyTypes:
      data?.extras?.policyTypes?.find((pt) => pt?.id === data?.policyTypeId) ||
      null,
    serviceEligibility:
      data?.extras?.membershipTypes?.find(
        (service) => service?.id === data?.serviceEligibilityId
      ) || null,
    states:
      data.extras?.states?.find(
        (state) => state?.id === data?.customerPolicyStateId
      ) || null,
    policyAttachments: data?.policyAttachments || [],
  });

  const { mutate } = useMutation(savePolicyType);

  const { data: policyData } = useQuery(
    ["policyTypeData"],
    () =>
      policyTypeData({
        caseDetailId: caseDetailId,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: visible,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (editVisible) {
            const formValues = mapResponseToFormValues(res.data.data);
            setExistingPolicy(res?.data?.data?.policyTypeId);
            // console.log("Mapped Form Values:", formValues);
            const fileUrls = res?.data?.data?.policyAttachments?.map(
              (item) => item?.filePath
            );
            // console.log("File URLs:", fileUrls);
            Object.keys(formValues).forEach((key) => {
              setValue(key, formValues[key]);
            });
            fileFromUrl(fileUrls, (files) => {
              // console.log("Callback invoked with files:", files); // Debugging
              if (files && files.length > 0) {
                setValue(
                  "policyAttachments",
                  res?.data?.data?.policyAttachments
                );
                setFiles({ file: files });
                setUploadedFiles(files);
                // console.log("Files set in state:", files); // Debugging
              } else {
                console.log("Failed to create File objects from URLs.");
              }
            });
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
  // console.log(">>>>>>>", existingPolicy);

  const fileFromUrl = (fileUrls, callback) => {
    if (!fileUrls || fileUrls.length === 0) {
      console.log("No file URLs provided.");
      return;
    }

    // console.log("File URLs received in fileFromUrl:", fileUrls); // Debugging

    const fetchFile = async (url) => {
      try {
        // console.log("Fetching file from URL:", url); // Debugging
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch file from ${url}`);
        }

        const blob = await response.blob();
        const file = new File([blob], url.split("/").pop(), {
          type: blob.type,
        });
        // console.log("File created from URL:", file); // Debugging
        return file;
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    Promise.all(fileUrls.map(fetchFile)).then((files) => {
      // console.log("Fetched files:", files); // Debugging
      callback(files);
    });
  };

  const onPolicyTypeSubmit = (values) => {
    // console.log("form data === >>>", values);
    let formData = new FormData();
    const formValues = {
      existingPolicyTypeId: existingPolicy ? existingPolicy : null,
      policyNumber: values?.policyNumber,
      policyStartDate: moment(values?.policyStartDate).format("YYYY-MM-DD"),
      policyEndDate: moment(values?.policyEndDate).format("YYYY-MM-DD"),
      policyTypeId: values?.policyTypes?.id,
      policyTypeName: values?.policyTypes?.name,
      serviceEligibilityId: values?.serviceEligibility?.id
        ? values?.serviceEligibility?.id
        : null,
      serviceEligibilityName: values?.serviceEligibility?.name,
      customerStateId: values?.states?.id,
      customerStateName: values?.states?.name,
    };

    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // console.log("====>>>>", formValues);
    // Append the caseDetailId separately to the FormData
    formData.append("caseDetailId", caseDetailId);
    values?.policyAttachments
      ?.filter((file) => file?.id == undefined)
      ?.map((file) => {
        formData.append("files", file);
      });
    values?.policyAttachments
      ?.filter((file) => file?.id !== undefined)
      ?.map((file) => {
        formData.append("attachmentIds[]", file?.id);
      });
    if (
      values?.policyAttachments?.filter((file) => file?.id == undefined)
        ?.length == 0
    ) {
      formData.append("isFileOptional", true);
    }
    for (let [key, value] of formData.entries()) {
      // console.log("====>>>>", `${key}:`, value);
    }
    mutate(formData, {
      onSuccess: (res) => {
        // console.log("response tech", res);
        if (res?.data?.success) {
          //onHide();
          //nearASPRefetch();
          toast.success(res?.data?.message);
          reset();
          setVisible(false);
          caseViewRefetch();
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
  // console.log("=====>case", policyData?.data?.data);
  // console.log("uploadedFiles", uploadedFiles);

  return (
    <Sidebar
      visible={visible}
      position="right"
      closeIcon={<DialogCloseIcon />}
      onHide={() => setVisible(false)}
      pt={{
        root: { className: "w-582 custom-sidebar" },
        header: { className: "brdr-bottom" },
      }}
      icons={
        <>
          <img src={PolicySidebarIcon} />
          <div className="sidebar-title">Add Policy Info</div>
        </>
      }
    >
      <div className="sidebar-content-wrap">
        <div className="sidebar-content-body">
          <form
            className="policy-form"
            onSubmit={handleSubmit(onPolicyTypeSubmit)}
          >
            <div className="row row-gap-3_4">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">
                    Policy/Membership No
                  </label>
                  <Controller
                    name="policyNumber"
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          type="text"
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          placeholder="Enter Policy/Membership"
                          {...field}
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
                <div className="form-group">
                  <label className="form-label required">
                    Policy Start Date
                  </label>
                  <Controller
                    name="policyStartDate"
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        {/* {console.log("field", field)} */}
                        <Calendar
                          inputId={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          dateOnly
                          dateFormat="dd-mm-yy"
                          showIcon
                          iconPos={"right"}
                          // icon={<img src={PhoneGrayIcon} />}
                          // hourFormat="12"
                          placeholder="Select Start Time"
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
                <div className="form-group">
                  <label className="form-label required">Policy End Date</label>
                  <Controller
                    name="policyEndDate"
                    control={control}
                    rules={{
                      required: "Input is required.",
                      validate: {
                        greaterThanStartDate: (value) => {
                          if (!value) return true;
                          if (new Date(value) <= new Date(policyStartDate)) {
                            return "End Date must be greater than Start Date";
                          }
                          return true;
                        },
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <Calendar
                          inputId={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          dateOnly
                          dateFormat="dd-mm-yy"
                          showIcon
                          iconPos={"right"}
                          placeholder="Select End Time"
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
                <div className="form-group">
                  <label className="form-label required">Policy Type</label>
                  <Controller
                    name="policyTypes"
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          filter
                          placeholder="Enter Policy Type"
                          options={policyData?.data?.data?.extras?.policyTypes}
                          optionLabel="name"
                          onChange={(e) => {
                            field.onChange(e.value);
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
              {selectedPolicyType?.id == 433 && (
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">
                      Service Eligibility
                    </label>
                    <Controller
                      name="serviceEligibility"
                      control={control}
                      rules={{ required: "Input is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Enter Service Eligibility"
                            options={
                              policyData?.data?.data?.extras?.membershipTypes
                            }
                            optionLabel="name"
                            onChange={(e) => {
                              field.onChange(e.value);
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
              )}
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">State</label>
                  <Controller
                    name="states"
                    control={control}
                    rules={{ required: "Input is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          filter
                          placeholder="Enter State"
                          options={policyData?.data?.data?.extras?.states}
                          optionLabel="name"
                          onChange={(e) => {
                            field.onChange(e.value);
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
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required policy-documents-label">
                    Policy Documents
                  </label>
                  <Controller
                    name="policyAttachments"
                    control={control}
                    rules={{ required: "Attachment is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <PolicyFileUpload
                          name={field.name}
                          field={field}
                          accept="image/*,application/pdf"
                          maxFileSize={5000000}
                          multiple={false}
                          defaultValues={uploadedFiles}
                          onFileSelect={(files) =>
                            console.log("Files selected:", files)
                          }
                        />
                        <div className="p-error">
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="">
                <Button
                  className="form-submit-btn mt-3"
                  type="submit"
                  //loading={isLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Sidebar>
  );
};

export default PolicySideBar;
