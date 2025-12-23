import React from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { DialogCloseSmallIcon } from "../../utills/imgConstants";
import Note from "../../components/common/Note";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { updateAccidentalDocumentRemarks } from "../../../services/caseService";

const ASPDialog = ({ visible, setVisible, caseDetailId,activityData }) => {

  const navigate = useNavigate();
  const defaultValues = {
    documents: "",
    remarks: "",
  };
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
  });

  const selectedDocument = useWatch({control: control, name: "documents"});
  // console.log('selectedDocument', selectedDocument);

  const {data: updateAccidentalDocumentRemarksData, mutate: updateAccidentalDocumentRemarksMutate, isLoading: updateAccidentalDocumentRemarksLoading} = useMutation(updateAccidentalDocumentRemarks);

  const handleFormSubmit = (values) => {
    console.log("ASP Assigned Remarks", values);
    updateAccidentalDocumentRemarksMutate({
      caseDetailId: caseDetailId,
      withoutAccidentalDocument: values?.documents,
      withoutAccidentalDocumentRemarks: values?.remarks
    }, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast?.success(res?.data?.message);
          setVisible(false);
          reset(defaultValues);
          // navigate(`/cases/asp-assignment/${caseDetailId}`);
          const url = `/cases/asp-assignment/${caseDetailId}/${activityData}`;
          window.open(url, '_blank');
        }
      },
      onError: (err) => {
        console.log(err);
      }
    })
  };

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Assign ASP</div>
        </div>
      }
      pt={{
        root:{className: "w-574"},
        header: { className: "asp-dialog-header" },
        content: { className: "asp-dialog-content" },
      }}
      visible={visible}
      position={"bottom"}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <Note type={"danger"} icon={false} purpose={"note"}>
        <div>
          <span style={{ fontWeight: 700, marginRight: "7px" }}>NOTE :</span>
          Collect accidental documents to proceed with ASP assignment.
        </div>
      </Note>
      <form className="asp-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="row row-gap-3_4">
          <div className="col-md-12">
            <div className="form-group checkbox-form-item">
              <Controller
                name="documents"
                control={control}
                rules={{ required: "Input is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      inputId={field.name}
                      checked={field.value}
                      inputRef={field.ref}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                    <label htmlFor={field.name} className="checkbox-label">
                      Would you like to proceed with the ASP assignment without
                      any accidental documents?
                    </label>
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label required">Remarks</label>
              <Controller
                name="remarks"
                control={control}
                rules={{ required: "Remarks is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextarea
                      placeholder="Enter the Remarks"
                      rows={5}
                      cols={30}
                      // inputRef={field.ref}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      id={field.name}
                      {...field}
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
        </div>
        <Button type="submit" className="confirm-btn" disabled={!selectedDocument} loading={updateAccidentalDocumentRemarksLoading}>Confirm</Button>
      </form>
    </Dialog>
  );
};

export default ASPDialog;
