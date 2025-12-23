import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";
import { Controller, useForm } from "react-hook-form";
import { DialogCloseSmallIcon } from "../../utills/imgConstants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
  getCustomerFeedbackFormData,
  getCustomerFeedbackQuestions,
  saveCustomerFeedback,
  getCustomerFeedbackByCaseId,
} from "../../../services/caseService";

const CustomerFeedbackModal = ({
  visible,
  setVisible,
  caseDetailId,
  clientId,
  clientName,
  psfStatus,
  lastContactedAt,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    languages: [],
    callStatuses: [],
  });
  const [questions, setQuestions] = useState([]);
  const [selectedCallStatusId, setSelectedCallStatusId] = useState(null);
  const [selectedCustomerFeedback, setSelectedCustomerFeedback] =
    useState(null);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      languageId: null,
      callStatusId: null,
      customerFeedbackId: null,
      notConnectedReasonId: null,
      comments: "",
      answers: {},
    },
  });

  const watchedCallStatusId = watch("callStatusId");
  const watchedCustomerFeedback = watch("customerFeedbackId");

  // Fetch form data on mount
  useEffect(() => {
    if (visible) {
      const viewMode = psfStatus === 2;
      setIsViewMode(viewMode);
      fetchFormData();
      if (viewMode && caseDetailId) {
        fetchExistingFeedback();
      } else {
        setExistingFeedback(null);
      }
    }
  }, [visible, psfStatus, caseDetailId]);

  // Load questions when call status changes
  useEffect(() => {
    if (watchedCallStatusId) {
      setSelectedCallStatusId(watchedCallStatusId);
      // Reset all form fields related to questions when call status changes
      setValue("customerFeedbackId", null);
      setValue("notConnectedReasonId", null);
      setValue("answers", {});
      setSelectedCustomerFeedback(null);
      // Load questions for the new call status
      loadQuestions(watchedCallStatusId);
    } else {
      setQuestions([]);
      setSelectedCallStatusId(null);
      setValue("customerFeedbackId", null);
      setValue("notConnectedReasonId", null);
      setValue("answers", {});
      setSelectedCustomerFeedback(null);
    }
  }, [watchedCallStatusId, setValue]);

  // Update selected customer feedback when form value changes
  useEffect(() => {
    // Only process if we have questions loaded (to avoid issues during loading)
    if (watchedCustomerFeedback && questions.length > 0) {
      // Clear previous answers when customer feedback changes
      const currentAnswers = watch("answers") || {};
      const customerFeedbackQuestion = questions.find(
        (q) => q.questionType === "customer_feedback"
      );

      // Clear all child question answers when customer feedback changes
      if (customerFeedbackQuestion) {
        const childQuestions = questions.filter(
          (q) => q.parentQuestionId === customerFeedbackQuestion.id
        );
        const updatedAnswers = { ...currentAnswers };
        childQuestions.forEach((q) => {
          delete updatedAnswers[q.id];
          delete updatedAnswers[`${q.id}_reason`];
          delete updatedAnswers[`${q.id}_text`];
        });
        setValue("answers", updatedAnswers);
      }

      setSelectedCustomerFeedback(watchedCustomerFeedback);
      // Load child questions if customer feedback is selected
      loadChildQuestions(watchedCustomerFeedback);
    } else if (!watchedCustomerFeedback) {
      setSelectedCustomerFeedback(null);
    }
  }, [watchedCustomerFeedback, questions, setValue, watch]);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      reset();
      setQuestions([]);
      setSelectedCallStatusId(null);
      setSelectedCustomerFeedback(null);
    }
  }, [visible, reset]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await getCustomerFeedbackFormData();
      if (response.data.success) {
        setFormData({
          languages: response.data.data.languages || [],
          callStatuses: response.data.data.callStatuses || [],
        });
      } else {
        toast.error(response.data.error || "Failed to load form data");
      }
    } catch (error) {
      toast.error("Failed to load form data");
      console.error("Error fetching form data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingFeedback = async () => {
    try {
      setLoading(true);
      const response = await getCustomerFeedbackByCaseId(caseDetailId);
      if (response.data.success && response.data.data) {
        // Response now returns a single object instead of an array
        const feedbackDetail = response.data.data;
        setExistingFeedback(feedbackDetail);
        
        // Populate form with existing data
        if (feedbackDetail.callStatusId) {
          setValue("callStatusId", feedbackDetail.callStatusId);
          setSelectedCallStatusId(feedbackDetail.callStatusId);
          await loadQuestions(feedbackDetail.callStatusId);
        }
        if (feedbackDetail.languageId) {
          setValue("languageId", feedbackDetail.languageId);
        }
        if (feedbackDetail.customerFeedback) {
          setValue("customerFeedbackId", feedbackDetail.customerFeedback);
          setSelectedCustomerFeedback(feedbackDetail.customerFeedback);
        }
        if (feedbackDetail.notConnectedReason) {
          setValue("notConnectedReasonId", feedbackDetail.notConnectedReason);
        }
        if (feedbackDetail.comments) {
          setValue("comments", feedbackDetail.comments);
        }
        
        // Populate answers
        if (feedbackDetail.answers && feedbackDetail.answers.length > 0) {
          const answersObj = {};
          feedbackDetail.answers.forEach((answer) => {
            try {
              // Try to parse JSON if it's a complex answer
              const parsed = JSON.parse(answer.answerText);
              if (parsed.option) {
                answersObj[answer.feedbackQuestionId] = parsed.option;
                if (parsed.text) {
                  answersObj[`${answer.feedbackQuestionId}_reason`] = parsed.text;
                }
              } else {
                answersObj[answer.feedbackQuestionId] = answer.answerText;
              }
            } catch {
              // If not JSON, use as is
              answersObj[answer.feedbackQuestionId] = answer.answerText;
            }
          });
          setValue("answers", answersObj);
        }
      }
    } catch (error) {
      console.error("Error fetching existing feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async (callStatusId) => {
    try {
      setLoading(true);
      // Clear questions first to ensure clean state
      setQuestions([]);
      const response = await getCustomerFeedbackQuestions(
        callStatusId,
        clientId
      );
      if (response.data.success) {
        const loadedQuestions = response.data.data || [];
        setQuestions(loadedQuestions);
      } else {
        toast.error(response.data.error || "Failed to load questions");
        setQuestions([]);
      }
    } catch (error) {
      toast.error("Failed to load questions");
      console.error("Error loading questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadChildQuestions = (customerFeedbackOptionValue) => {
    // Find the customer feedback question
    const customerFeedbackQuestion = questions.find(
      (q) => q.questionType === "customer_feedback"
    );

    if (!customerFeedbackQuestion) return;

    // Options are now stored in answerType.options as array of strings
    // Check if the selected value exists in the options
    const answerTypeOptions =
      customerFeedbackQuestion.answerType?.options || [];
    const selectedOption = answerTypeOptions.find(
      (opt) => opt === customerFeedbackOptionValue
    );

    if (!selectedOption) return;

    // Load child questions based on the selected option value
    // "Satisfied" or "Not Satisfied" will have child questions
    const optionValue = selectedOption?.toLowerCase();
    if (optionValue === "satisfied" || optionValue === "not satisfied") {
      const childQuestions = questions.filter(
        (q) =>
          q.parentQuestionId === customerFeedbackQuestion.id &&
          ((optionValue === "satisfied" &&
            q.questionType === "satisfied_question") ||
            (optionValue === "not satisfied" &&
              q.questionType === "not_satisfied_question"))
      );
      // Child questions are already in the questions array, just need to filter them
    }
  };

  const getQuestionByType = (questionType) => {
    return questions.find((q) => q.questionType === questionType);
  };

  const getChildQuestions = (parentQuestionId, questionType) => {
    return questions.filter(
      (q) =>
        q.parentQuestionId === parentQuestionId &&
        q.questionType === questionType
    );
  };

  const renderQuestionField = (question) => {
    if (!question) return null;

    const fieldName = `answers.${question.id}`;
    const fieldType = question.answerType?.fieldType;

    // Handle "rating" fieldType
    if (fieldType === "rating") {
      // Get rating options from answerType.options (e.g., ["1","2","3","4","5"])
      const ratingOptions = question.answerType?.options || [
        "1",
        "2",
        "3",
        "4",
        "5",
      ];
      const maxRating =
        ratingOptions.length > 0
          ? parseInt(ratingOptions[ratingOptions.length - 1])
          : 5;
      const minRating =
        ratingOptions.length > 0 ? parseInt(ratingOptions[0]) : 1;

      return (
        <div key={question.id} className="col-md-12">
          <div className="form-group">
            <label className="form-label required">{question.question}</label>
            <Controller
              name={fieldName}
              control={control}
              rules={{
                required: "This field is required",
                min: {
                  value: minRating,
                  message: `Rating must be at least ${minRating}.`,
                },
                max: {
                  value: maxRating,
                  message: `Rating must be at most ${maxRating}.`,
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <div className="d-flex align-items-center gap-2">
                    <Rating
                      value={field.value || 0}
                      onChange={(e) => field.onChange(e.value)}
                      stars={maxRating}
                      cancel={false}
                      readOnly={isViewMode}
                      className={fieldState.error ? "p-invalid" : ""}
                    />
                    {field.value && (
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>
                        {field.value}/{maxRating}
                      </span>
                    )}
                  </div>
                  <div className="p-error">
                    {errors.answers?.[question.id]?.message}
                  </div>
                </>
              )}
            />
          </div>
        </div>
      );
    }

    // Handle "option" fieldType
    if (fieldType === "option") {
      // Render Dropdown
      // Use answerType.options array directly
      const answerTypeOptions = question.answerType?.options || [];
      const dropdownOptions = answerTypeOptions.map((opt) => ({
        label: opt,
        value: opt,
      }));

      return (
        <div key={question.id} className="col-md-12">
          <div className="form-group">
            <label className="form-label required">{question.question}</label>
            <Controller
              name={fieldName}
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({ field, fieldState }) => (
                <>
                  <Dropdown
                    value={field.value}
                    options={dropdownOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select"
                    filter
                    filterPlaceholder="Search"
                    disabled={isViewMode}
                    className={`form-control-select ${
                      fieldState.error ? "p-invalid" : ""
                    }`}
                    onChange={(e) => {
                      field.onChange(e.value);
                      // If this is customer feedback question, update the form value
                      if (question.questionType === "customer_feedback") {
                        setValue("customerFeedbackId", e.value);
                      }
                      // If this is not connected reason, update the form value
                      if (question.questionType === "not_connected_reason") {
                        setValue("notConnectedReasonId", e.value);
                      }
                    }}
                  />
                  <div className="p-error">
                    {errors.answers?.[question.id]?.message}
                  </div>
                </>
              )}
            />
          </div>
        </div>
      );
    }

    // Handle "option_conditional" fieldType
    if (fieldType === "option_conditional") {
      const conditionalOptions = question.answerType?.conditionalOptions || [];
      const dropdownOptions = question.answerType?.options || [];
      const optionList = dropdownOptions.map((opt) => ({
        label: opt,
        value: opt,
      }));

      return (
        <div key={question.id} className="col-md-12">
          <div className="form-group">
            <label className="form-label required">{question.question}</label>
            <Controller
              name={fieldName}
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({ field, fieldState }) => (
                <>
                  <Dropdown
                    value={field.value}
                    options={optionList}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select"
                    filter
                    filterPlaceholder="Search"
                    disabled={isViewMode}
                    className={`form-control-select ${
                      fieldState.error ? "p-invalid" : ""
                    }`}
                    onChange={(e) => {
                      field.onChange(e.value);
                      // Clear the reason text if selected option is not in conditionalOptions
                      if (!conditionalOptions.includes(e.value)) {
                        setValue(`${fieldName}_reason`, "");
                      }
                    }}
                  />
                  <div className="p-error">
                    {errors.answers?.[question.id]?.message}
                  </div>
                  {/* Show reason text field if selected option is in conditionalOptions */}
                  {field.value && conditionalOptions.includes(field.value) && (
                    <div className="mt-2">
                      <Controller
                        name={`${fieldName}_reason`}
                        control={control}
                        rules={{
                          required: "This field is required",
                        }}
                        render={({
                          field: reasonField,
                          fieldState: reasonFieldState,
                        }) => (
                          <>
                            <label className="form-label required">
                              Reason
                            </label>
                            <InputTextarea
                              {...reasonField}
                              placeholder="Enter reason"
                              rows={3}
                              disabled={isViewMode}
                              className={`form-control ${
                                reasonFieldState.error ? "p-invalid" : ""
                              }`}
                            />
                            <div className="p-error">
                              {
                                errors.answers?.[`${question.id}_reason`]
                                  ?.message
                              }
                            </div>
                          </>
                        )}
                      />
                    </div>
                  )}
                </>
              )}
            />
          </div>
        </div>
      );
    }

    // Handle "text" fieldType
    if (fieldType === "text") {
      return (
        <div key={question.id} className="col-md-12">
          <div className="form-group">
            <label className="form-label required">{question.question}</label>
            <Controller
              name={fieldName}
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({ field, fieldState }) => (
                <>
                  <InputTextarea
                    {...field}
                    placeholder="Enter answer"
                    disabled={isViewMode}
                    rows={3}
                    className={`form-control ${
                      fieldState.error ? "p-invalid" : ""
                    }`}
                  />
                  <div className="p-error">
                    {errors.answers?.[question.id]?.message}
                  </div>
                </>
              )}
            />
          </div>
        </div>
      );
    }

    // Handle "option_text" fieldType
    if (fieldType === "option_text") {
      // Use answerType.options array directly
      const answerTypeOptions = question.answerType?.options || [];
      const dropdownOptions = answerTypeOptions.map((opt) => ({
        label: opt,
        value: opt,
      }));

      return (
        <div key={question.id} className="col-md-12">
          <div className="form-group">
            <label className="form-label required">{question.question}</label>
            <Controller
              name={fieldName}
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({ field, fieldState }) => (
                <>
                  <Dropdown
                    value={field.value?.option || field.value}
                    options={dropdownOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select"
                    filter
                    filterPlaceholder="Search"
                    className={`form-control-select ${
                      fieldState.error ? "p-invalid" : ""
                    }`}
                    onChange={(e) => {
                      const currentValue = field.value || {};
                      field.onChange({
                        ...currentValue,
                        option: e.value,
                      });
                    }}
                  />
                  <div className="p-error">
                    {errors.answers?.[question.id]?.message}
                  </div>
                  <div className="mt-2">
                    <Controller
                      name={`${fieldName}_text`}
                      control={control}
                      rules={{
                        required: "This field is required",
                      }}
                      render={({
                        field: textField,
                        fieldState: textFieldState,
                      }) => (
                        <>
                          <label className="form-label required">Details</label>
                          <InputTextarea
                            {...textField}
                            placeholder="Enter details"
                            rows={3}
                            className={`form-control ${
                              textFieldState.error ? "p-invalid" : ""
                            }`}
                            onChange={(e) => {
                              textField.onChange(e.target.value);
                              const currentValue = field.value || {};
                              field.onChange({
                                ...currentValue,
                                text: e.target.value,
                              });
                            }}
                          />
                          <div className="p-error">
                            {errors.answers?.[`${question.id}_text`]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </>
              )}
            />
          </div>
        </div>
      );
    }

    // Default fallback
    return null;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Prepare answers array
      const answers = [];
      // Filter out keys that end with "_reason" or "_text" as they are handled as part of the main question
      const questionKeys = Object.keys(data.answers || {}).filter(
        (key) => !key.endsWith("_reason") && !key.endsWith("_text")
      );

      questionKeys.forEach((questionId) => {
        const answerValue = data.answers[questionId];
        const answerReason = data.answers[`${questionId}_reason`];
        const answerText = data.answers[`${questionId}_text`];

        if (
          answerValue !== undefined &&
          answerValue !== null &&
          answerValue !== ""
        ) {
          const question = questions.find((q) => q.id === parseInt(questionId));
          if (question) {
            const answerData = {
              feedbackQuestionId: parseInt(questionId),
            };

            const fieldType = question.answerType?.fieldType;

            // Format answer based on fieldType
            // All answers are now stored in answerText (ratings as strings, others as strings or JSON)
            if (fieldType === "rating") {
              // For "rating" type, store as string in answerText
              answerData.answerText = String(answerValue);
            } else if (fieldType === "option") {
              // For "option" type, store as string (option value from answerType.options)
              answerData.answerText = String(answerValue);
            } else if (fieldType === "text") {
              // For "text" type, store as string
              answerData.answerText = String(answerValue);
            } else if (fieldType === "option_text") {
              // For "option_text" type, store as object {option: string, text: string}
              answerData.answerText = JSON.stringify({
                option: String(answerValue?.option || answerValue),
                text: String(answerText || ""),
              });
            } else if (fieldType === "option_conditional") {
              // For "option_conditional" type, store as object {option: string, text?: string}
              const answerObj = {
                option: String(answerValue),
              };
              if (answerReason) {
                answerObj.text = String(answerReason);
              }
              answerData.answerText = JSON.stringify(answerObj);
            }

            answers.push(answerData);
          }
        }
      });

      // Find call status name from formData.callStatuses
      const selectedCallStatus = formData.callStatuses.find(
        (status) => status.id === data.callStatusId
      );
      const callStatusName = selectedCallStatus ? selectedCallStatus.name : "";

      const payload = {
        caseDetailId: caseDetailId,
        languageId: data.languageId,
        callStatusId: data.callStatusId,
        callStatusName: callStatusName,
        clientName: clientName || "",
        customerFeedbackId: data.customerFeedbackId,
        notConnectedReasonId: data.notConnectedReasonId,
        comments: data.comments,
        answers: answers,
        createdById: JSON.parse(localStorage.getItem("user"))?.id || null,
      };

      const response = await saveCustomerFeedback(payload);

      if (response.data.success) {
        toast.success("Feedback submitted successfully!");
        setVisible(false);
        // Call onSuccess callback to refresh data
        if (onSuccess) {
          onSuccess();
        }
        // Redirect to My Cases page if call status is "Answered" (1180)
        if (data.callStatusId === 1180) {
          navigate("/cases");
        }
      } else {
        toast.error(response.data.error || "Failed to submit feedback");
      }
    } catch (error) {
      toast.error("Failed to submit feedback");
      console.error("Error submitting feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const customerFeedbackQuestion = getQuestionByType("customer_feedback");
  const notConnectedReasonQuestion = getQuestionByType("not_connected_reason");
  const isConnected = selectedCallStatusId && customerFeedbackQuestion;
  const isNotConnected = selectedCallStatusId && notConnectedReasonQuestion;

  // Get customer feedback option value to determine if satisfied/not satisfied
  // Options are now stored in answerType.options as array of strings
  const customerFeedbackValue = watchedCustomerFeedback;
  const isSatisfied = customerFeedbackValue?.toLowerCase() === "satisfied";
  const isNotSatisfied =
    customerFeedbackValue?.toLowerCase() === "not satisfied";

  const satisfiedQuestions = isSatisfied
    ? getChildQuestions(
        customerFeedbackQuestion?.id,
        "satisfied_question"
      ).sort((a, b) => a.sequence - b.sequence)
    : [];

  const notSatisfiedQuestions = isNotSatisfied
    ? getChildQuestions(
        customerFeedbackQuestion?.id,
        "not_satisfied_question"
      ).sort((a, b) => a.sequence - b.sequence)
    : [];

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">
            {isViewMode ? "View PSF" : "Feedback Collection"}
          </div>
        </div>
      }
      visible={visible}
      className="w-480"
      position={"bottom"}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      {lastContactedAt && (
        <div className="mb-3" style={{ fontSize: "12px", color: "#6c757d" }}>
          Last Contacted at: {lastContactedAt}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row row-gap-3_4">
          {/* Language Dropdown */}
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label required">Language</label>
              <Controller
                name="languageId"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      options={formData.languages.map((lang) => ({
                        label: lang.name,
                        value: lang.id,
                      }))}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Select Language"
                      filter
                      filterPlaceholder="Search Language"
                      disabled={isViewMode || loading}
                      className={`form-control-select ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      onChange={(e) => field.onChange(e.value)}
                    />
                    <div className="p-error">{errors.languageId?.message}</div>
                  </>
                )}
              />
            </div>
          </div>

          {/* Call Status Dropdown */}
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label required">Call Status</label>
              <Controller
                name="callStatusId"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      options={formData.callStatuses.map((status) => ({
                        label: status.name,
                        value: status.id,
                      }))}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Select Call Status"
                      filter
                      filterPlaceholder="Search Call Status"
                      className={`form-control-select ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      onChange={(e) => field.onChange(e.value)}
                      disabled={isViewMode || loading}
                    />
                    <div className="p-error">
                      {errors.callStatusId?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>

          {/* Customer Feedback Question (when Connected) */}
          {isConnected && renderQuestionField(customerFeedbackQuestion)}

          {/* Not Connected Reason Question (when Not Connected) */}
          {isNotConnected && renderQuestionField(notConnectedReasonQuestion)}

          {/* Satisfied Questions */}
          {isSatisfied &&
            satisfiedQuestions.map((question) => renderQuestionField(question))}

          {/* Not Satisfied Questions */}
          {isNotSatisfied &&
            notSatisfiedQuestions.map((question) =>
              renderQuestionField(question)
            )}

          {/* Comments Textarea */}
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label required">Comments</label>
              <Controller
                name="comments"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextarea
                      {...field}
                      placeholder="Enter Comments"
                      rows={4}
                      disabled={isViewMode}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                    />
                    <div className="p-error">{errors.comments?.message}</div>
                  </>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          {!isViewMode && (
            <div className="col-md-12 d-flex justify-content-end">
              <Button
                type="submit"
                className="confirm-btn"
                label="Submit"
                disabled={loading}
              />
            </div>
          )}
        </div>
      </form>
    </Dialog>
  );
};

export default CustomerFeedbackModal;
