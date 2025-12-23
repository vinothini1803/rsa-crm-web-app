import { Dialog } from "primereact/dialog";
import React, { useEffect } from "react";
import { Button } from "primereact/button";
import { DialogCloseSmallIcon } from "../../utills/imgConstants";
import { FileGreenMediumIcon } from "../../utills/imgConstants";
import "./components.less";
import { Controller, useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";

const DealerDocumentAttachmentsDialog = ({
  title,
  visible,
  setVisible,
  attachments,
  download,
  deleteFile,
  onDeleteFile,
  footer,
  userTypeId,
  caseStatusId,
  onFormSubmit,
  submitLoading,
  fieldName,
  dealerDocumentComments,
  activityStatusId,
  role,
}) => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    if (attachments?.length == 0) {
      setVisible(false);
    }
  }, [attachments]);

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">{title}</div>
        </div>
      }
      // pt={{
      //   root: { className: "w-480" },
      // }}
      visible={visible}
      position={"bottom"}
      className={`w-576 ${footer ? "custom-footer" : ""}`}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
      footer={footer || null}
    >
      <div className="attachment-container-data">
        {attachments &&
          attachments?.map((item, index) => (
            <div
              className="attachment-item"
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="attachment-data">
                <img src={FileGreenMediumIcon} />
                <div className="attachment-name" style={{ width: "280px" }}>
                  {item?.name ? item?.name : item?.fileName}
                </div>
              </div>
              <div>
                {" "}
                {deleteFile && (
                  <>
                    {download ? (
                      <a
                        className="view-attachment-text"
                        href={item?.url ? item?.url : item?.filePath}
                        download={item?.name ? item?.name : item?.fileName}
                        target="blank"
                      >
                        Download
                      </a>
                    ) : (
                      <a
                        href={item?.url ? item?.url : item?.filePath}
                        target="blank"
                        className="view-attachment-text"
                      >
                        View Attachment
                      </a>
                    )}
                  </>
                )}
              </div>
              <div>
                {deleteFile ? (
                  <Button
                    label="Delete"
                    severity="danger"
                    text
                    onClick={() => onDeleteFile(index)}
                  />
                ) : download ? (
                  <a
                    className="view-attachment-text"
                    href={item?.url ? item?.url : item?.filePath}
                    download={item?.name ? item?.name : item?.fileName}
                    target="blank"
                  >
                    Download
                  </a>
                ) : (
                  <a
                    href={item?.url ? item?.url : item?.filePath}
                    target="blank"
                    className="view-attachment-text"
                  >
                    View Attachment
                  </a>
                )}
              </div>
            </div>
          ))}
      </div>
      <br />
      {role?.id == 31 || userTypeId == 140 ? (
        <>
          {dealerDocumentComments ? (
            <div className="row row-gap-3_4">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label">Comments</label>
                  <Controller
                    name={fieldName}
                    control={control}
                    defaultValue={dealerDocumentComments}
                    rules={{
                      required: "Comments is Required",
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextarea
                          {...field}
                          rows={3}
                          className={`form-control`}
                          placeholder="Enter Comments"
                          disabled
                        />
                        <div className="p-error">
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          ) : (
            []
          )}
        </>
      ) : (
        <>
          {caseStatusId == 2 &&
          (activityStatusId == 3 ||
            activityStatusId == 7 ||
            activityStatusId == 10 ||
            activityStatusId == 11 ||
            activityStatusId == 12) ? (
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <div className="row row-gap-3_4">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label">Comments</label>
                    <Controller
                      name={fieldName}
                      control={control}
                      // defaultValue={dealerDocumentComments}
                      defaultValue=""
                      rules={{
                        required: "Comments is Required",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputTextarea
                            {...field}
                            // value={field?.value?.toUpperCase()}
                            rows={3}
                            className={`form-control`}
                            placeholder="Enter Comments"
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
              <Button
                className="btn form-submit-btn mt-4"
                type="submit"
                loading={submitLoading}
              >
                Save
              </Button>
            </form>
          ) : (
            []
          )}
        </>
      )}
    </Dialog>
  );
};

export default DealerDocumentAttachmentsDialog;
