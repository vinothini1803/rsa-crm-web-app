import React from "react";
import {
  DialogCloseSmallIcon,
  ImportDialogIcon,
} from "../../utills/imgConstants";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import CustomFileUpload from "./CustomFileUpload";
import { Button } from "primereact/button";

const ImportDialog = ({
  visible,
  setVisible,
  sampleCSV,
  sampleExcel,
  onSubmit,
  loading,
  masterType,
}) => {
  const defaultValues = {
    files: "",
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const onFormSubmit = (values) => {
    const formValues = {
      files: values.files[0],
      masterType: masterType,
    };
    let formData = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });
    onSubmit(formData, reset);
  };

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <img src={ImportDialogIcon} />
          <div className="dialog-header-title">Import</div>
        </div>
      }
      pt={{
        root: { className: "w-480" },
      }}
      visible={visible}
      position={"bottom"}
      onHide={() => {
        setVisible(false);
        reset();
      }}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <div className="import-sample-container">
        <div className="sample-main-content">
          Download a{" "}
          {sampleCSV && (
            <>
              <a href={sampleCSV} download>
                sample csv file
              </a>{" "}
              or{" "}
            </>
          )}
          <a href={sampleExcel} download>
            sample XLS/XLSX file
          </a>{" "}
          and compare it to your import file to ensure you have the same format.
        </div>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="row row-gap-3_4">
          <div className="col-md-12">
            <div className="form-group">
              <Controller
                name="files"
                control={control}
                rules={{ required: "File is required" }}
                render={({ field, fieldState }) => {
                  console.log("text area field", field);
                  return (
                    <>
                      <CustomFileUpload
                        name={field.name}
                        accept={
                          ".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        }
                        field={field}
                      />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  );
                }}
              />
            </div>
          </div>
        </div>
        <Button
          className="form-submit-btn mt-2"
          type="submit"
          loading={loading}
        >
          Import
        </Button>
      </form>
    </Dialog>
  );
};

export default ImportDialog;
