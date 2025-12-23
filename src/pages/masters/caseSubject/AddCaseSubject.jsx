import React, { useState } from "react";
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
  getsubjectFormData,
  addSubject,
} from "../../../../services/masterServices";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";

const AddCaseSubject = () => {
  const { caseSubjectId } = useParams();
  const [questionnaires, setQuestionnaires] = useState([
    { question: "", answerTypeId: "", sequence: 0 },
  ]);

  const defaultValues = {
    name: "",
    status: 1,
    serviceIds: [],
    clientId: "",
    caseTypeId: "",
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues,
  });

  const { data } = useQuery(
    ["caseSubjectFormData", caseSubjectId],
    () =>
      getsubjectFormData({
        caseSubjectId: caseSubjectId ?? "",
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!caseSubjectId,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (caseSubjectId) {
            const caseSubjectData = res?.data?.data?.caseSubject;
            if (caseSubjectData) {
              setValue("name", caseSubjectData.name);
              setValue("clientId", caseSubjectData.clientId);
              setValue("caseTypeId", caseSubjectData.caseTypeId || "");
              setValue("status", caseSubjectData.status);

              const matchedServices = caseSubjectData.serviceIds
                .map((serviceId) => {
                  return res?.data?.data?.extras?.services.find(
                    (service) => service.id === serviceId
                  );
                })
                .filter((service) => service !== undefined);
              setValue("serviceIds", matchedServices);

              // Set questionnaires - sort by sequence
              if (
                caseSubjectData.questionnaires &&
                caseSubjectData.questionnaires.length > 0
              ) {
                const sortedQuestionnaires = [
                  ...caseSubjectData.questionnaires,
                ].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
                setQuestionnaires(
                  sortedQuestionnaires.map((q) => ({
                    id: q.id,
                    question: q.question,
                    answerTypeId: q.answerTypeId,
                    sequence:
                      q.sequence !== undefined && q.sequence !== null
                        ? q.sequence
                        : 0,
                  }))
                );
              } else {
                setQuestionnaires([
                  { question: "", answerTypeId: "", sequence: 0 },
                ]);
              }
            }
          }
        }
      },
    }
  );

  const { mutate, isLoading } = useMutation(addSubject);
  const navigate = useNavigate();

  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/master/case-subject")}>Case Subject</div>
      ),
    },
    { label: <div>{caseSubjectId ? "Edit" : "Add"} Case Subject</div> },
  ];

  const handleClose = () => {
    navigate("/master/case-subject");
    reset(defaultValues);
  };

  const handleAddQuestionnaire = () => {
    // Get the maximum sequence number and add 1
    const maxSequence =
      questionnaires.length > 0
        ? Math.max(...questionnaires.map((q) => q.sequence || 0))
        : -1;
    setQuestionnaires([
      ...questionnaires,
      { question: "", answerTypeId: "", sequence: maxSequence + 1 },
    ]);
  };

  const handleRemoveQuestionnaire = (index) => {
    const newQuestionnaires = questionnaires.filter((_, i) => i !== index);
    // Reorder sequences after removal
    const reorderedQuestionnaires = newQuestionnaires.map((q, idx) => ({
      ...q,
      sequence: idx,
    }));
    setQuestionnaires(
      reorderedQuestionnaires.length > 0
        ? reorderedQuestionnaires
        : [{ question: "", answerTypeId: "", sequence: 0 }]
    );
  };

  const handleQuestionnaireChange = (index, field, value) => {
    const newQuestionnaires = [...questionnaires];
    newQuestionnaires[index] = {
      ...newQuestionnaires[index],
      [field]: value,
    };
    setQuestionnaires(newQuestionnaires);
  };

  const handleFormSubmit = (values) => {
    // Filter and validate questionnaires (optional)
    const validQuestionnaires = questionnaires.filter(
      (q) => q.question.trim() !== "" && q.answerTypeId !== ""
    );

    // Sort by sequence before submitting
    const sortedQuestionnaires = [...validQuestionnaires].sort(
      (a, b) => (a.sequence || 0) - (b.sequence || 0)
    );

    mutate(
      {
        caseSubjectId: caseSubjectId ?? null,
        serviceIds: values?.serviceIds?.map((service) => service?.id) || [],
        clientId: values?.clientId,
        caseTypeId: values?.caseTypeId || null,
        name: values.name.trim(),
        status: values?.status,
        questionnaires: sortedQuestionnaires.map((q, index) => ({
          id: q.id || null,
          question: q.question.trim(),
          answerTypeId: q.answerTypeId,
          sequence:
            q.sequence !== undefined && q.sequence !== null
              ? q.sequence
              : index,
        })),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            navigate("/master/case-subject");
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
                    {caseSubjectId ? "Edit" : "Add"} Case Subject
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
              id="case-subject-form"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Name</label>
                    <Controller
                      name="name"
                      rules={{
                        required: "Name is required.",
                      }}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText {...field} placeholder="Enter Name" />
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
                    <label className="form-label required">Select Client</label>
                    <Controller
                      name="clientId"
                      control={control}
                      rules={{ required: "Client is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Client"
                            options={data?.data?.data?.extras?.clients}
                            optionLabel="name"
                            optionValue="id"
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

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Case Type</label>
                    <Controller
                      name="caseTypeId"
                      control={control}
                      rules={{ required: "Case Type is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select Case Type"
                            options={
                              data?.data?.data?.extras?.caseCreationTypes
                            }
                            optionLabel="name"
                            optionValue="id"
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

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">
                      Select Service
                    </label>
                    <Controller
                      name="serviceIds"
                      control={control}
                      rules={{ required: "Service is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <MultiSelect
                            value={field.value}
                            placeholder="Select Service"
                            options={data?.data?.data?.extras?.services}
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

                <div className="col-md-6">
                  <div className="form-group radio-form-group">
                    <label className="form-label">Status</label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_active"
                              {...field}
                              value={1}
                              checked={field.value === 1}
                            />
                            <label
                              htmlFor="radio_active"
                              className="common-radio-label"
                            >
                              Active
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_inactive"
                              {...field}
                              value={0}
                              checked={field.value === 0}
                            />
                            <label
                              htmlFor="radio_inactive"
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

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label">Questionnaires</label>
                    {[...questionnaires]
                      .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                      .map((questionnaire, sortedIndex) => {
                        const originalIndex = questionnaires.findIndex(
                          (q) =>
                            q === questionnaire ||
                            (q.id && q.id === questionnaire.id)
                        );
                        return (
                          <div
                            key={questionnaire.id || originalIndex}
                            className="card mb-3 p-3"
                          >
                            <div className="row row-gap-3_4 align-items-center">
                              <div className="col-12 col-sm-12 col-md-1 col-lg-1">
                                <div className="form-group">
                                  <label className="form-label">Sequence</label>
                                  <InputNumber
                                    value={
                                      questionnaire.sequence !== undefined &&
                                      questionnaire.sequence !== null
                                        ? questionnaire.sequence
                                        : sortedIndex
                                    }
                                    onValueChange={(e) =>
                                      handleQuestionnaireChange(
                                        originalIndex,
                                        "sequence",
                                        e.value !== null ? e.value : sortedIndex
                                      )
                                    }
                                    min={0}
                                    showButtons
                                    className="w-100"
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-7 col-lg-7">
                                <div className="form-group">
                                  <label className="form-label">Question</label>
                                  <InputTextarea
                                    value={questionnaire.question}
                                    onChange={(e) =>
                                      handleQuestionnaireChange(
                                        originalIndex,
                                        "question",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter question"
                                    rows={2}
                                    className="w-100"
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <div className="form-group">
                                  <label className="form-label">
                                    Answer Type
                                  </label>
                                  <Dropdown
                                    value={questionnaire.answerTypeId}
                                    placeholder="Select Answer Type"
                                    options={
                                      data?.data?.data?.extras?.answerTypes
                                    }
                                    optionLabel="name"
                                    optionValue="id"
                                    filter
                                    resetFilterOnHide={true}
                                    onChange={(e) =>
                                      handleQuestionnaireChange(
                                        originalIndex,
                                        "answerTypeId",
                                        e.value
                                      )
                                    }
                                    className="w-100"
                                  />
                                </div>
                              </div>
                              {questionnaires.length > 1 && (
                                <div className="col-12 col-sm-12 col-md-1 col-lg-1 d-flex align-items-center justify-content-start justify-content-md-center mt-2 mt-md-0">
                                  <div className="form-group mb-0">
                                    <img
                                      src={RedCancelIcon}
                                      alt="cancel"
                                      onClick={() =>
                                        handleRemoveQuestionnaire(originalIndex)
                                      }
                                      type="button"
                                      style={{
                                        cursor: "pointer",
                                        width: "20px",
                                        height: "20px",
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    <Button
                      type="button"
                      className="btn btn-icon"
                      icon={<CollapsePlusIcon />}
                      text
                      label="Add Questionnaire"
                      onClick={handleAddQuestionnaire}
                      style={{ backgroundColor: "transparent" }}
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
                  form="case-subject-form"
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

export default AddCaseSubject;
