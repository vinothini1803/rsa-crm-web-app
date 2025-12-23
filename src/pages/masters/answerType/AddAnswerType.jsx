import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import {
  CloseIcon,
  RedCancelIcon,
  CollapsePlusIcon,
} from "../../../utills/imgConstants";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import {
  getAnswerTypeFormData,
  addAnswerType,
} from "../../../../services/masterServices";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";

const AddAnswerType = () => {
  const { answerTypeId } = useParams();
  const [optionsList, setOptionsList] = useState([""]);
  const [conditionalOptions, setConditionalOptions] = useState([]);
  const [optionsError, setOptionsError] = useState("");
  const [conditionalOptionsError, setConditionalOptionsError] = useState("");
  const defaultValues = {
    name: "",
    fieldType: "",
    options: "",
    status: 1,
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
    setError,
  } = useForm({
    defaultValues,
  });

  const fieldTypeValue = watch("fieldType");

  const { data } = useQuery(
    ["answerTypeFormData", answerTypeId],
    () => getAnswerTypeFormData({ answerTypeId: answerTypeId ?? "" }),
    {
      refetchOnWindowFocus: false,
      enabled: !!answerTypeId,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (answerTypeId) {
            const answerTypeData = res?.data?.data?.answerType;
            if (answerTypeData) {
              setValue("name", answerTypeData.name);
              setValue("fieldType", answerTypeData.fieldType);
              setValue("status", answerTypeData.status);

              // Parse options if it's a JSON string
              if (answerTypeData.options) {
                try {
                  const parsedOptions = Array.isArray(answerTypeData.options)
                    ? answerTypeData.options
                    : JSON.parse(answerTypeData.options);
                  if (Array.isArray(parsedOptions)) {
                    setOptionsList(
                      parsedOptions.length > 0 ? parsedOptions : [""]
                    );
                    setValue("options", answerTypeData.options);
                  } else {
                    setValue("options", answerTypeData.options);
                  }
                } catch (e) {
                  setValue("options", answerTypeData.options);
                }
              }

              // Parse conditionalOptions if it's a JSON string
              if (answerTypeData.conditionalOptions) {
                try {
                  const parsedConditionalOptions = Array.isArray(
                    answerTypeData.conditionalOptions
                  )
                    ? answerTypeData.conditionalOptions
                    : JSON.parse(answerTypeData.conditionalOptions);
                  if (Array.isArray(parsedConditionalOptions)) {
                    setConditionalOptions(parsedConditionalOptions);
                  }
                } catch (e) {
                  console.error("Error parsing conditionalOptions:", e);
                }
              }
            }
          }
        }
      },
    }
  );

  const { mutate, isLoading } = useMutation(addAnswerType);
  const navigate = useNavigate();

  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/master/answer-type")}>Answer Type</div>
      ),
    },
    { label: <div>{answerTypeId ? "Edit" : "Add"} Answer Type</div> },
  ];

  const fieldTypeOptions = [
    { label: "Option", value: "option" },
    { label: "Text", value: "text" },
    { label: "Option + Text", value: "option_text" },
    { label: "Option + Conditional", value: "option_conditional" },
    { label: "Rating", value: "rating" },
  ];

  const handleClose = () => {
    navigate("/master/answer-type");
    reset(defaultValues);
  };

  const handleAddOption = () => {
    setOptionsList([...optionsList, ""]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = optionsList.filter((_, i) => i !== index);
    setOptionsList(newOptions.length > 0 ? newOptions : [""]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...optionsList];
    newOptions[index] = value;
    setOptionsList(newOptions);
    // Clear error when user starts typing
    if (optionsError) {
      setOptionsError("");
    }
  };

  const handleFormSubmit = (values) => {
    let optionsValue = [];

    // For fieldType 'option', 'option_text', 'option_conditional', or 'rating', use optionsList
    if (
      values.fieldType === "option" ||
      values.fieldType === "option_text" ||
      values.fieldType === "option_conditional" ||
      values.fieldType === "rating"
    ) {
      // Validate that at least one option is provided
      const validOptions = optionsList.filter(
        (opt) => opt && opt.trim() !== ""
      );

      if (validOptions.length === 0) {
        setOptionsError("At least one option is required for this field type.");
        toast.error("At least one option is required for this field type.");
        return;
      }

      setOptionsError("");
      optionsValue = validOptions;
    } else if (values.options) {
      try {
        optionsValue =
          typeof values.options === "string"
            ? JSON.parse(values.options)
            : values.options;
      } catch (e) {
        optionsValue = [];
      }
    }

    // Validate conditionalOptions for option_conditional field type
    if (values.fieldType === "option_conditional") {
      if (!conditionalOptions || conditionalOptions.length === 0) {
        setConditionalOptionsError(
          "At least one option must be selected to trigger the text field."
        );
        toast.error(
          "At least one option must be selected to trigger the text field."
        );
        return;
      }
      setConditionalOptionsError("");
    }

    mutate(
      {
        answerTypeId: answerTypeId ?? null,
        name: values.name.trim(),
        fieldType: values.fieldType,
        options: optionsValue,
        conditionalOptions:
          values.fieldType === "option_conditional" ? conditionalOptions : [],
        status: values.status,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            navigate("/master/answer-type");
          } else {
            if (res?.data?.error) {
              // Check if it's a duplicate name error
              if (res?.data?.error.toLowerCase().includes("already taken")) {
                setError("name", {
                  type: "manual",
                  message: "Answer type name is already taken",
                });
              }
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  useEffect(() => {
    // Reset options list when fieldType changes
    if (
      fieldTypeValue === "option" ||
      fieldTypeValue === "option_text" ||
      fieldTypeValue === "option_conditional" ||
      fieldTypeValue === "rating"
    ) {
      // Only reset if the list is empty or has only one empty option
      // This ensures we don't interfere with existing options
      if (
        optionsList.length === 0 ||
        (optionsList.length === 1 && optionsList[0] === "")
      ) {
        setOptionsList([""]);
      }
    }
    // Reset conditionalOptions when fieldType changes away from option_conditional
    if (fieldTypeValue !== "option_conditional") {
      setConditionalOptions([]);
    }
    // Clear options error when fieldType changes
    setOptionsError("");
    // Clear conditionalOptions error when fieldType changes
    setConditionalOptionsError("");
  }, [fieldTypeValue]);

  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div>
                  <h5 className="page-content-title">
                    {answerTypeId ? "Edit" : "Add"} Answer Type
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
              id="answer-type-form"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <div className="row row-gap-3_4">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6">
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
                            className={`w-100 ${
                              errors && errors[field.name] ? "p-invalid" : ""
                            }`}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <label className="form-label required">Field Type</label>
                    <Controller
                      name="fieldType"
                      control={control}
                      rules={{
                        required: "Field Type is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Field Type"
                            options={fieldTypeOptions}
                            optionLabel="label"
                            optionValue="value"
                            onChange={(e) => field.onChange(e.value)}
                            className="w-100"
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>

                {(fieldTypeValue === "option" ||
                  fieldTypeValue === "option_text" ||
                  fieldTypeValue === "option_conditional" ||
                  fieldTypeValue === "rating") && (
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label required">Options</label>
                      {optionsList.map((option, index) => (
                        <div
                          key={index}
                          className="row row-gap-3_4 mb-2 align-items-center"
                        >
                          <div
                            className={
                              optionsList.length > 1
                                ? "col-12 col-sm-12 col-md-11 col-lg-11"
                                : "col-12"
                            }
                          >
                            <InputText
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                              }
                              placeholder={`Enter option ${index + 1}`}
                              className="w-100"
                            />
                          </div>
                          {optionsList.length > 1 && (
                            <div className="col-12 col-sm-12 col-md-1 col-lg-1 d-flex align-items-center justify-content-start justify-content-md-center mt-2 mt-md-0">
                              <img
                                src={RedCancelIcon}
                                alt="cancel"
                                onClick={() => handleRemoveOption(index)}
                                type="button"
                                style={{
                                  cursor: "pointer",
                                  width: "20px",
                                  height: "20px",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        className="btn btn-icon mt-2"
                        icon={<CollapsePlusIcon />}
                        text
                        label="Add Option"
                        onClick={handleAddOption}
                        style={{ backgroundColor: "transparent" }}
                      />
                      {fieldTypeValue === "rating" && (
                        <small className="text-muted d-block mt-1">
                          Enter rating values (e.g., 1, 2, 3, 4, 5 or Poor,
                          Fair, Good, Very Good, Excellent).
                        </small>
                      )}
                      {optionsError && (
                        <div className="p-error mt-1">{optionsError}</div>
                      )}
                    </div>
                  </div>
                )}

                {fieldTypeValue === "option_conditional" &&
                  optionsList.filter((opt) => opt && opt.trim() !== "").length >
                    0 && (
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                      <div className="form-group">
                        <label className="form-label required">
                          Select Options that Trigger Text Field
                          <span
                            className="text-muted ms-2 d-block d-sm-inline"
                            style={{ fontSize: "12px" }}
                          >
                            (Select which options should show the text field)
                          </span>
                        </label>
                        <MultiSelect
                          value={conditionalOptions}
                          options={optionsList
                            .filter((opt) => opt && opt.trim() !== "")
                            .map((opt) => ({ label: opt, value: opt }))}
                          onChange={(e) => {
                            setConditionalOptions(e.value || []);
                            // Clear error when user selects an option
                            if (conditionalOptionsError) {
                              setConditionalOptionsError("");
                            }
                          }}
                          placeholder="Select options that trigger text field"
                          display="chip"
                          className={`w-100 form-control-select ${
                            conditionalOptionsError ? "p-invalid" : ""
                          }`}
                        />
                        {conditionalOptionsError && (
                          <div className="p-error mt-1">
                            {conditionalOptionsError}
                          </div>
                        )}
                        <small className="text-muted d-block mt-1">
                          When these options are selected, the text field will
                          be shown and required.
                        </small>
                      </div>
                    </div>
                  )}

                {fieldTypeValue === "text" && (
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label text-muted">
                        Text field type does not require options configuration.
                      </label>
                    </div>
                  </div>
                )}

                <div className="col-12 col-sm-12 col-md-6 col-lg-6">
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
                  form="answer-type-form"
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

export default AddAnswerType;
