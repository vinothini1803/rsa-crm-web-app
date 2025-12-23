import React, { useEffect, useState } from "react";
import {
  DialogCloseSmallIcon,
  DocumentIcon,
} from "../../../utills/imgConstants";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import CustomFileUpload from "../../../components/common/CustomFileUpload";
import { Button } from "primereact/button";

const UploadDocsDialog = ({
  visible,
  setVisible,
  onFormSubmit,
  submitLoading,
  defaultValues,
}) => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const [convertedFiles, setConvertedFiles] = useState(null);

  const onSubmit = (values) => {
    // console.log("Accidental Documents => ", values);
    // setVisible(false);
    onFormSubmit(values);
  };

  // Convert each file object to a File object asynchronously
  const convertToFilesArray = async (data) => {
    const { fileName, filePath, originalName, id } = data;
    try {
      // Fetch the file blob from the filePath URL
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${filePath}: ${response.status} ${response.statusText}`
        );
      }

      // Retrieve blob from response
      const blob = await response.blob();
      // console.log('Converted Blob', blob);
      const url = URL.createObjectURL(blob);
      // Create a File object using the blob
      const file = new File([blob], originalName, { type: blob.type });
      file.objectURL = url;
      file.id = id;
      // console.log('Converted file:', file);

      return file; // Return the created File object
    } catch (error) {
      console.error("Error converting file:", error);
      throw error; // Rethrow the error to propagate it
    }
  };

  useEffect(() => {
    const setDefaultFieldValues = async () => {
      const convertedFilesType = await Promise.all(
        defaultValues?.map((value) => convertToFilesArray(value))
      );
      // console.log("Convert Files", convertedFilesType);
      if (convertedFilesType) {
        setValue("attachments", convertedFilesType);
        setConvertedFiles(convertedFilesType);
      }
    };
    if (defaultValues) {
      // console.log("defaultValues => ", defaultValues);
      setDefaultFieldValues();
    }
  }, [defaultValues]);

  return (
    <Dialog
      pt={{
        root: { className: "upload-doc-dialog w-556" },
      }}
      header={
        <div className="dialog-header">
          <img src={DocumentIcon} />
          <div className="dialog-header-title">Upload Documents</div>
        </div>
      }
      visible={visible}
      position={"bottom"}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row row-gap-3_4 mb-2">
          <div className="col-md-12">
            <div className="form-group">
              <Controller
                name="attachments"
                control={control}
                rules={{ required: "Attachment is required." }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <CustomFileUpload
                        name={field.name}
                        field={field}
                        multiple={true}
                        maxFileSize={5000000}
                        defaultValues={convertedFiles}
                        accept=".pdf,.doc,.docx,image/*"
                      />

                      {errors && (
                        <div className="p-error">
                          {errors[field.name]?.message}
                        </div>
                      )}
                    </>
                  );
                }}
              />
            </div>
          </div>
        </div>
        <Button className="confirm-btn" type="submit" loading={submitLoading}>
          Upload
        </Button>
      </form>
    </Dialog>
  );
};

export default UploadDocsDialog;
