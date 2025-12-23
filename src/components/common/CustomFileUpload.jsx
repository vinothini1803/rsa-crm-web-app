import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";

import {
  CloseCircleIcon,
  FileGreenMediumIcon,
} from "../../utills/imgConstants";

const CustomFileUpload = ({
  name,
  accept,
  maxFileSize,
  field,
  multiple,
  defaultValues,
  onFileSelect,

}) => {
  const fileUploadRef = useRef(null);

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    //console.log("chooseButton", chooseButton);
    return <div className={className}>{chooseButton}</div>;
  };

  const onTemplateSelect = (e) => {
    console.log("files List =>", e, e.files, field);
    field.onChange(e.files);
    if (onFileSelect) {
      onFileSelect(e.files);
    }
  };

  useEffect(() => {
    if (defaultValues) {
      fileUploadRef.current.setFiles(
        defaultValues?.map((value) => {
          return value;
        })
      );
    }
  }, [defaultValues]);

  const itemTemplate = (file, props) => {
    console.log("File =>", file);
    const fileTypeArray = file.type.split("/");
    const fileType = fileTypeArray[0];
    //console.log('Type => ', fileType);
    return (
      <div className="p-fileupload-row-item">
        <div className="p-fileupload-row-item-wrap">
          <img
            className="img-fluid p-fileupload-row-item-img"
            alt={file.name}
            role="presentation"
            src={fileType == "image" ? file.objectURL : FileGreenMediumIcon}
          />
          <div className="p-fileupload-row-item-details">
            <span className="p-fileupload-row-item-name">{file.name}</span>
            <span className="p-fileupload-row-item-size">
              {props.formatSize}
            </span>
          </div>
        </div>
        <Button
          type="button"
          className="btn-icon bg-transparent"
          onClick={() => {
            props.onRemove();

            if (!multiple) {
              field.onChange([]);
            } else {
              const updatedFiles = field.value.filter((f) => f !== file);
              field.onChange(updatedFiles);
            }
          }}
        >
          <img className="img-fluid" src={CloseCircleIcon} alt="Remove" />
        </Button>
      </div>
    );
  };

  return (
    <>
      <FileUpload
        ref={fileUploadRef}
        name={name}
        multiple={multiple ? multiple : false}
        accept={accept}
        maxFileSize={maxFileSize}
        headerTemplate={headerTemplate}
        onSelect={(e) => onTemplateSelect(e, field)}
        chooseLabel="choose file"
        itemTemplate={itemTemplate}
        className="custom-file-multiple"
      />
    </>
  );
};

export default CustomFileUpload;
