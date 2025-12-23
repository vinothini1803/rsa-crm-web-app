import React from "react";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { useNavigate } from "react-router";
import { CloseIcon, ServiceContractIcon } from "../../../utills/imgConstants";
import { InputText } from "primereact/inputtext";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import DynamicFormCard from "../../../components/common/DynamicFormCard";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import "./style.less";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { toast } from "react-toastify";

const AddServiceContracts = () => {
  const navigate = useNavigate();
  const { control, handleSubmit,reset } = useForm({
    defaultValues: {
      aspreachtimings: [{ type: "", business_hours: "", type1: "", type2: "" }],
      reminders: [
        {
          assignedTeam: "",
          contact: "",
          asp: "",
          dealer: "",
          rm: "",
          zm: "",
          countryHead: "",
          assignedAgent: "",
          owner: "",
          others: "",
          otherstext: "",
          time: "",
          pattern: "",
          sendVia: "",
        },
      ],
      escalations: [
        {
          assignedTeam: "",
          contact: "",
          asp: "",
          dealer: "",
          rm: "",
          zm: "",
          countryHead: "",
          assignedAgent: "",
          owner: "",
          others: "",
          otherstext: "",
          time: "",
          pattern: "",
          sendVia: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "aspreachtimings",
  });

  const {
    fields: reminderFields,
    append: appendReminder,
    remove: removeReminder,
  } = useFieldArray({
    control,
    name: "reminders",
  });

  const {
    fields: escalationsFields,
    append: appendescalation,
    remove: removeescalation,
  } = useFieldArray({
    control,
    name: "escalations",
  });

  const MenuItems = [
    {
      label: <div onClick={() => navigate("/admin/service-contracts")}>Service Contracts</div>,
    },
    { label: <div>Add Service Contracts</div> },
  ];

  const handleClose = () => {
    navigate("/admin/service-contracts");
    reset();
  };

  const handleAdd = (e, formField) => {
    if (formField == "ASP Reach timings") {
      append({ type: "", business_hours: "", type1: "", type2: "" });
    }
    if (formField == "Reminders") {
      appendReminder({
        assignedTeam: "",
        contact: "",
        asp: "",
        dealer: "",
        rm: "",
        zm: "",
        countryHead: "",
        assignedAgent: "",
        owner: "",
        others: "",
        otherstext: "",
      });
    }
    if (formField == "ESCALATIONS") {
      appendescalation({
        assignedTeam: "",
        contact: "",
        asp: "",
        dealer: "",
        rm: "",
        zm: "",
        countryHead: "",
        assignedAgent: "",
        owner: "",
        others: "",
        otherstext: "",
      });
    }
  };

  const handleRemove = (e, index, formField) => {
    if (formField == "ASP Reach timings") {
      remove(index);
    }
    if (formField == "Reminders") {
      removeReminder(index);
    }
    if (formField == "ESCALATIONS") {
      removeescalation(index);
    }
  };

  const handleFormSubmit = (values) => {
    console.log("form values", values);
    if(values){
      toast.success("Added Successfully",{
        autoClose: 1000,
      })
      navigate("/admin/service-contracts");
      reset();
    }
  };
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-card-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={ServiceContractIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">New Service Contracts</h5>
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
            <form
              id="service-contract-form"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label"> Name</label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText {...field} placeholder="Eg : City limit" />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputTextarea
                          placeholder="comments"
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          id={field.name}
                          {...field}
                          rows={1}
                          cols={30}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="dynamic-cards-container">
                <DynamicFormCard
                  title={"ASP Reach timings"}
                  addLabel={"Add Reach Time"}
                  onAdd={(e) => handleAdd(e, "ASP Reach timings")}
                >
                  {fields?.map((item, index) => (
                    <div className="fields-row" key={item.id}>
                      <div className="form-field">
                        <div className="field-title-text">
                          ASP Reach Time:
                          <button
                            className="btn-link btn-text-danger ms-1_2"
                            type="button"
                            onClick={(e) =>
                              handleRemove(e, index, "ASP Reach timings")
                            }
                          >
                            Remove
                          </button>
                        </div>
                        <div className="row">
                          <div className="col-md-3">
                            <div className="form-group">
                              <label className="form-label">Type</label>
                              <Controller
                                name={`aspreachtimings.${index}.type`}
                                //name="type"
                                control={control}
                                render={({ field, fieldState }) => (
                                  <Dropdown
                                    value={field.value}
                                    placeholder="Select"
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
                              <label className="form-label">
                                Business Hours
                              </label>
                              <Controller
                                name={`aspreachtimings.${index}.business_hours`}
                                //name="business_hours"
                                control={control}
                                render={({ field, fieldState }) => (
                                  <Dropdown
                                    value={field.value}
                                    placeholder="Select"
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
                              <label className="form-label">Type</label>
                              <Controller
                                name={`aspreachtimings.${index}.type1`}
                                //name="type"
                                control={control}
                                render={({ field, fieldState }) => (
                                  <Dropdown
                                    value={field.value}
                                    placeholder="Select"
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
                              <label className="form-label">Type</label>
                              <Controller
                                name={`aspreachtimings.${index}.type2`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <Dropdown
                                    value={field.value}
                                    placeholder="Select"
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
                        </div>
                      </div>
                      <Divider />
                    </div>
                  ))}
                </DynamicFormCard>

                <DynamicFormCard
                  title={"Reminders"}
                  addLabel={"Add Reminder"}
                  onAdd={(e) => handleAdd(e, "Reminders")}
                >
                  {reminderFields?.map((item, index) => (
                    <div className="fields-row" key={item.id}>
                      <div className="form-field">
                        <div className="field-title-text">
                          Response Time Reminders:
                          <button
                            className="btn-link btn-text-danger ms-1_2"
                            type="button"
                            onClick={(e) => handleRemove(e, index, "Reminders")}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="row row-gap-3_4">
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                //name="assignedTeam"
                                name={`reminders.${index}.assignedTeam`}
                                control={control}
                                //////rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Assigned team
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`reminders.${index}.contact`}
                                //name="contact"
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Contact
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                // name="asp"
                                name={`reminders.${index}.asp`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      ASP
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`reminders.${index}.dealer`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Dealer{" "}
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <Controller
                                //name="rm"
                                name={`reminders.${index}.rm`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">RM</label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>

                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                //name="zm"
                                name={`reminders.${index}.zm`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">ZM</label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                //name="countryHead"
                                name={`reminders.${index}.countryHead`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Country Head
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                //name="assignedAgent"
                                name={`reminders.${index}.assignedAgent`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Assigned Agent
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`reminders.${index}.owner`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Owner
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`reminders.${index}.others`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Others
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`reminders.${index}.otherstext`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <InputText placeholder="Others" />
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <label className="form-label">After</label>
                              <div className="p-inputgroup">
                                <Controller
                                  //name="time"
                                  name={`reminders.${index}.time`}
                                  control={control}
                                  render={({ field, fieldState }) => (
                                    <InputText
                                      {...field}
                                      placeholder="00:00"
                                      pt={{
                                        root: {
                                          className: "border-right-hidden",
                                        },
                                      }}
                                    />
                                  )}
                                />

                                <Controller
                                  //name="pattern"
                                  name={`reminders.${index}.pattern`}
                                  control={control}
                                  render={({ field, fieldState }) => (
                                    <Dropdown
                                      value={field.value}
                                      placeholder="mins"
                                      options={[
                                        { label: "Mins", value: "mins" },
                                        { label: "Sec", value: "sec" },
                                      ]}
                                      optionLabel="label"
                                      onChange={(e) => field.onChange(e.value)}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <label className="form-label">Send Via</label>
                              <Controller
                                name={`reminders.${index}.sendVia`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <Dropdown
                                    value={field.value}
                                    placeholder="Select"
                                    options={[
                                      { label: "Email", value: "email" },
                                      { label: "Phone", value: "phone" },
                                    ]}
                                    optionLabel="label"
                                    onChange={(e) => field.onChange(e.value)}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Divider />
                    </div>
                  ))}
                </DynamicFormCard>

                <DynamicFormCard
                  title={"ESCALATIONS"}
                  addLabel={"Add Escalation"}
                  onAdd={(e) => handleAdd(e, "ESCALATIONS")}
                >
                  {escalationsFields?.map((item, index) => (
                    <div className="fields-row" key={item.id}>
                      <div className="form-field">
                        <div className="field-title-text">
                          Response Time Escalations:
                          <button
                            className="btn-link btn-text-danger ms-1_2"
                            type="button"
                            onClick={(e) =>
                              handleRemove(e, index, "ESCALATIONS")
                            }
                          >
                            Remove
                          </button>
                        </div>
                        <div className="row row-gap-3_4">
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`escalations.${index}.assignedTeam`}
                                //name="assignedTeam"
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Assigned team
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`escalations.${index}.contact`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Contact
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`escalations.${index}.asp`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      ASP
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`escalations.${index}.dealer`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Dealer{" "}
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <Controller
                                //name="rm"
                                name={`escalations.${index}.rm`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">RM</label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>

                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                //name="zm"
                                name={`escalations.${index}.zm`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">ZM</label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`escalations.${index}.countryHead`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Country Head
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`escalations.${index}.assignedAgent`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Assigned Agent
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`escalations.${index}.owner`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Owner
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`escalations.${index}.others`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <div className="checkbox-item">
                                    <Checkbox
                                      inputId={field.name}
                                      checked={field.value}
                                      inputRef={field.ref}
                                      onChange={(e) =>
                                        field.onChange(e.checked)
                                      }
                                    />
                                    <label className="checkbox-label">
                                      Others
                                    </label>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <Controller
                                name={`escalations.${index}.otherstext`}
                                control={control}
                                //rules={{ required: "Input is required." }}
                                render={({ field, fieldState }) => (
                                  <InputText placeholder="Others" />
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <label className="form-label">After</label>
                              <div className="p-inputgroup">
                                <Controller
                                  // name="time"
                                  name={`escalations.${index}.time`}
                                  control={control}
                                  render={({ field, fieldState }) => (
                                    <InputText
                                      {...field}
                                      placeholder="00:00"
                                      pt={{
                                        root: {
                                          className: "border-right-hidden",
                                        },
                                      }}
                                    />
                                  )}
                                />

                                <Controller
                                  name={`escalations.${index}.pattern`}
                                  //name="pattern"
                                  control={control}
                                  render={({ field, fieldState }) => (
                                    <Dropdown
                                      value={field.value}
                                      placeholder="mins"
                                      options={[
                                        { label: "Mins", value: "mins" },
                                        { label: "Sec", value: "sec" },
                                      ]}
                                      optionLabel="label"
                                      onChange={(e) => field.onChange(e.value)}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <label className="form-label">Send Via</label>
                              <Controller
                                name={`escalations.${index}.send_via`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <Dropdown
                                    value={field.value}
                                    placeholder="Select"
                                    options={[
                                      { label: "Email", value: "email" },
                                      { label: "Phone", value: "phone" },
                                    ]}
                                    optionLabel="label"
                                    onChange={(e) => field.onChange(e.value)}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Divider />
                    </div>
                  ))}
                </DynamicFormCard>
              </div>
            </form>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 ms-auto">
                <button
                  className="btn btn-primary"
                  type="submit"
                  form="service-contract-form"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceContracts;
