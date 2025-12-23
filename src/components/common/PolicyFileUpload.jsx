import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { CloseCircleIcon, FileGreenMediumIcon } from "../../utills/imgConstants";

const PolicyFileUpload = ({
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
      return <div className={className}>{chooseButton}</div>;
    };
  
    const onTemplateSelect = (e) => {
      console.log("files List =>", e, e.files, field);
      field.onChange(e.files);
      if (onFileSelect) {
        onFileSelect(e.files);
      }
    };
  
    const handleDownload = (file) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file); // Create a download link for the file
      link.download = file.name; // Set download file name
      link.click(); // Trigger the download
    };
  
    const handleView = (file) => {
      const fileTypeArray = file.type.split("/");
      const fileType = fileTypeArray[0];
  
      if (fileType === "image") {
        const imageURL = URL.createObjectURL(file);
        window.open(imageURL, "_blank"); // Open the image in a new tab
      } else if (fileType === "application" && file.type.includes("pdf")) {
        const pdfURL = URL.createObjectURL(file);
        window.open(pdfURL, "_blank"); // Open PDF in a new tab
      } else {
        alert("File type not supported for viewing.");
      }
    };
  
    useEffect(() => {
      if (defaultValues) {
        fileUploadRef.current.setFiles(defaultValues?.map((value) => value));
      }
    }, [defaultValues]);
  
    const itemTemplate = (file, props) => {
      return (
        <div className="p-fileupload-row-item">
          <div className="p-fileupload-row-item-wrap">
            <img
              className="img-fluid p-fileupload-row-item-img"
              alt={file.name}
              role="presentation"
              src={FileGreenMediumIcon} // Generic file icon
            />
            <div className="p-fileupload-row-item-details">
              <span className="p-fileupload-row-item-name">{file.name}</span>
              <span className="p-fileupload-row-item-size">{props.formatSize}</span>
            </div>
          </div>
          <Button
            type="button"
            className="btn-icon bg-transparent"
            onClick={() => {
              props.onRemove();
              const updatedFiles = field.value.filter((f) => f !== file);
              field.onChange(updatedFiles);
            }}
          >
            <img className="img-fluid" src={CloseCircleIcon} alt="Remove" />
          </Button>
          {/* View Button */}
          <div className="custom-file-actions">
          <Button
            type="button"
            className="bg-transparent"
            onClick={() => handleView(file)}
          >
            <span>View</span>
          </Button>
          {/* Download Button */}
          <Button
            type="button"
            className="bg-transparent"
            onClick={() => handleDownload(file)}
          >
            <span>Download</span>
          </Button>
          </div>
        </div>
      );
    };
  
    return (
      <>
        <FileUpload
          ref={fileUploadRef}
          name={name}
          multiple={multiple}
          accept={accept}
          maxFileSize={maxFileSize}
          headerTemplate={headerTemplate}
          onSelect={(e) => onTemplateSelect(e, field)}
          chooseLabel="Choose File"
          itemTemplate={itemTemplate}
          className="custom-file-multiple"
        />
      </>
    );
  };

export default PolicyFileUpload;