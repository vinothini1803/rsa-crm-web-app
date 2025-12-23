import { FileUpload } from "primereact/fileupload";
import React, { useEffect, useRef, useState } from "react";
import { FileFolderIcon } from "../../utills/imgConstants";
import "./style.less";
import { useFormContext } from "react-hook-form";
import AttachmentsDialog from "../../components/common/AttachmentsDialog";

const FileChooseUpload = ({ field, setField, multiple, defaultValues, initalFlag, setInitalFlag }) => {
  // const [files, setFiles] = useState([]);
  const [visible, setVisible] = useState(false);
  // console.log("uploaded field", field);
  const fileChooseRef = useRef(null);
  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    return chooseButton;
  };
  const itemTemplate = (file, fillist, list) => {
    return (
      <>
        {field?.value?.length > 0 ? (
          <>
            <div className="file-select-text">
              {field?.value?.length} Files selected
            </div>
            <button type='button' className="btn-link btn-text" onClick={handleView}>
              View
            </button>
          </>
        ): (
          <></>
        )}
      </>
    );
  };

  // Convert each file object to a File object asynchronously
  const convertToFilesArray = async (data) => {
    const { fileName, filePath, originalName } = data;
    try {
      // Fetch the file blob from the filePath URL
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`);
      }

      // Retrieve blob from response
      const blob = await response.blob();
      // console.log('Converted Blob', blob);
      const url = URL.createObjectURL(blob);
      // Create a File object using the blob
      const file = new File([blob], originalName, { type: blob.type });
      file.objectURL = url;
      // console.log('Converted file:', file);

      return {
        file: file,
        ...(data?.id && {
          id: data?.id
        }),
      }; // Return the created File object
    } catch (error) {
      console.error('Error converting file:', error);
      throw error; // Rethrow the error to propagate it
    }
  };

  // Convert New File object synchronously
  const convertNewFileArray = async (data) => {
    const { name, objectURL, type } = data;
    try {
      // Create a File object using the blob
      const file = new File([objectURL], name, { type: type });
      // console.log('Converted file:', file);
      file.objectURL = objectURL;
      return {
        file: file,
      }; // Return the created File object
    } catch (error) {
      console.error('Error converting file:', error);
      throw error; // Rethrow the error to propagate it
    }
  }

  // Handle View Attachment
  const handleView = () => {
    console.log('handle view', field)
    setVisible(true);
    setInitalFlag(false)
  };
  
  // Handle File Selection
  const onFileSelect = async (e) => {
    // let files = e.files;
    console.log('Selecte Event', e, field);
    const newFiles = e.files.filter((f)=> !field?.value?.map((fil)=> {return fil?.file})?.includes(f));
    console.log('New Files', newFiles);
    const newConvertedFile = await Promise.all(newFiles?.map(value => convertNewFileArray(value)));
    console.log('New Converted Files', newConvertedFile);
    field.onChange([...field?.value, ...newConvertedFile]);
    console.log('After Selecte Event', field);
    // setFiles(files);
  };

  const handleDeleteFile = (index) => {
    // console.log('Delete file', fileToRemove, field?.value?.filter((file) => file?.objectURL !== fileToRemove?.objectURL || fileToRemove?.filePath));
    // setField(field?.value?.filter((file) => file?.objectURL !== (fileToRemove?.objectURL || fileToRemove?.filePath)))
    field?.value?.splice(index, 1);
    setField(field?.value);
    console.log('After Deleted file', field?.value)
    fileChooseRef.current.setFiles(field?.value?.map((value) =>  {return value?.file}));
  }

  useEffect(() => {
    const setDefaultFieldValues = async () => {
      // console.log('Default values', defaultValues, field);
      if(defaultValues?.length > 0 && field?.value?.length == 0 && initalFlag) {
        console.log('Default values', defaultValues, field);
        const convertedFiles = await Promise.all(defaultValues?.map(value => convertToFilesArray(value)));
        console.log('Convert Files', convertedFiles);
        if(convertedFiles) {
          setField(convertedFiles);
          fileChooseRef.current.setFiles(convertedFiles?.map((value) =>  {return value?.file}));
          console.log('Current Field', field)
        }
      }
    }
    setDefaultFieldValues();
  }, [defaultValues ])

  return (
    <>
      <FileUpload
        ref={fileChooseRef}
        multiple= {multiple ? true : false}
        value={field.value}
        className="custom-choose-upload"
        onSelect={onFileSelect}
        itemTemplate={itemTemplate}
        headerTemplate={headerTemplate}
        chooseOptions={{
          label: (
            <div className="labelcontainer">
              <span className="label-text">Choose File</span>
              <span className="label-icon">
                <FileFolderIcon />
              </span>
            </div>
          ),
          icon: null,
          className: "custom-choose-file-btn",
        }}
      ></FileUpload>
      {visible && 
        <AttachmentsDialog
          visible={visible}
          setVisible={setVisible}
          attachments={
            field?.value &&
            field?.value?.map((item) => {
              return {
                ...item,
                fileName: item?.file ? item?.file?.name : item?.name,
                filePath: item?.file ? item?.file?.objectURL : item?.objectURL,
              };
            })
          }
          title={"Attachments"}
          download={true}
          deleteFile={true}
          onDeleteFile={handleDeleteFile}
        />
      }
    </>
  );
};

export default FileChooseUpload;
