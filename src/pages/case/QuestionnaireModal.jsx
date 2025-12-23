import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { DialogCloseSmallIcon } from "../../utills/imgConstants";
import { getQuestionnaireAnswersByCaseId } from "../../../services/caseService";
import { toast } from "react-toastify";

const QuestionnaireModal = ({ visible, setVisible, caseId }) => {
  const [loading, setLoading] = useState(false);
  const [questionnaires, setQuestionnaires] = useState([]);

  const fetchQuestionnaireAnswers = async () => {
    if (!caseId) {
      toast.error("Case ID is required to load questionnaire answers");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getQuestionnaireAnswersByCaseId(caseId);

      if (response?.data?.success) {
        const data = response.data.data || [];
        setQuestionnaires(data);
      } else {
        const errorMsg =
          response?.data?.error || "Failed to load questionnaire answers";
        toast.error(errorMsg);
        setQuestionnaires([]);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to load questionnaire answers"
      );
      setQuestionnaires([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && caseId) {
      fetchQuestionnaireAnswers();
    } else {
      setQuestionnaires([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, caseId]);

  const formatAnswer = (questionnaire) => {
    if (!questionnaire.answer) {
      return "--";
    }

    const answer = questionnaire.answer;
    const answerType = questionnaire.answerType;
    const fieldType = answerType?.fieldType;

    // Handle different answer types
    if (fieldType === "option_text" || fieldType === "option_conditional") {
      // Answer is an object with option and text
      if (typeof answer === "object" && answer.option) {
        let displayText = answer.option;
        if (answer.text) {
          displayText += ` - ${answer.text}`;
        }
        return displayText;
      }
      return String(answer);
    } else if (fieldType === "option") {
      // Answer is a single option value
      return String(answer);
    } else if (fieldType === "text") {
      // Answer is plain text
      return String(answer);
    } else if (fieldType === "rating") {
      // Answer is a rating number
      return `${answer}/5`;
    } else {
      // Default: convert to string
      return String(answer);
    }
  };

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Probing Questions</div>
        </div>
      }
      visible={visible}
      onHide={() => setVisible(false)}
      closable={true}
      draggable={false}
      style={{ width: "650px", maxWidth: "90vw", maxHeight: "80vh" }}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <div
        className="questionnaire-modal-content"
        style={{
          maxHeight: "60vh",
          overflowY: "auto",
          paddingRight: "10px",
        }}
      >
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : !questionnaires || questionnaires.length === 0 ? (
          <div className="text-center p-4">
            No questionnaire answers found for this case.
          </div>
        ) : (
          questionnaires
            .filter((q) => q && q.question) // Filter out any invalid entries
            .sort((a, b) => (a.sequence || 0) - (b.sequence || 0)) // Sort by sequence
            .map((questionnaire, index) => (
              <div
                key={questionnaire.id || index}
                className="mb-4 pb-3 border-bottom"
              >
                <label className="form-label mb-2 d-block">
                  {index + 1}. {questionnaire.question}
                </label>
                <div className="questionnaire-answer">
                  {formatAnswer(questionnaire)}
                </div>
              </div>
            ))
        )}
      </div>
    </Dialog>
  );
};

export default QuestionnaireModal;
