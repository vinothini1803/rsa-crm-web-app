import React, { useRef, useState } from "react";
import { useQuery } from "react-query";
import { FileUpload } from "primereact/fileupload";
import FolderComponent from "../../deliveryRequest/FolderComponent";
import {
  ImageFile,
  SystemTimeLineIcon,
  VehicleActivityImage,
  AttachmentSeperatorIcon,
  AddtionalChargeBaseUrl,
  FileBaseUrl,
  ImgDownloadIcon,
} from "../../../utills/imgConstants";
import { attachments } from "../../../../services/inventoryViewService";
import { chargesAttachments } from "../../../../services/deliveryRequestViewService";

const AttachmentsTab = ({ activityId, serviceId }) => {
  // serviceId is optional - if not provided or not 1 (towing), After Photos section will be hidden
  const fileploadRef = useRef(null);
  // const [selectedFolder, setSelectedFolder] = useState(null);
  // const BeforeIds = {
  //   "Rear Side": 64,
  //   "Front Side": 63,
  //   "Driver side": 65,
  //   "Passenger Side": 66,
  //   "Damaged Area": 67,
  //   Others: 68,
  // };

  // const AfterIds = {
  //   "Rear Side": 72,
  //   "Front Side": 71,
  //   "Driver side": 73,
  //   "Passenger Side": 74,
  //   "Damaged Area": 75,
  //   Others: 76,
  // };

  const chooseOption = {
    icon: null,
    className: "add-btn",
    label: "upload",
  };

  // Get Attachments Data
  const { data: attachmentsData } = useQuery(
    ["caseServiceAttachments", activityId],
    () =>
      attachments({
        entityId: activityId,
        attachmentOfId: 102,
      }),
    {
      enabled: activityId ? true : false,
    }
  );
  // const { data: attachmentsChargeData } = useQuery(
  //   ["caseServiceAttachmentsCharge", activityId],
  //   () =>
  //     chargesAttachments({
  //       activityId: activityId,
  //     }),
  //   {
  //     enabled: activityId ? true : false,
  //   }
  // );

  const emptyTemplate = () => (
    <div className="empty-template-container">
      <img src={ImageFile} />
      <div className="add-photo-text" onClick={() => {}}>
        Add Photo
      </div>
    </div>
  );

  const itemTemplate = (file, props) => {
    // console.log("file", file);
    return (
      <div>
        <img src={file.objectURL} className="preview-image" />
      </div>
    );
  };

  const handleUpload = (e) => {
    // console.log("upload event", e);
  };

  // const AttachmentsFolders = [
  //   {
  //     name: "Before Activity Photos",
  //     files: attachmentsData?.data?.data
  //       ?.filter(({ attachmentTypeId }) =>
  //         Object.values(BeforeIds).includes(attachmentTypeId)
  //       )
  //       ?.map(({ attachmentTypeId, fileName }) => {
  //         return {
  //           file_name: Object.entries(BeforeIds).find(
  //             (item) => item[1] == attachmentTypeId
  //           )[0],
  //           file: fileName,
  //         };
  //       }),
  //   },
  //   {
  //     name: "After Activity Photos",
  //     files: attachmentsData?.data?.data
  //       ?.filter(({ attachmentTypeId }) =>
  //         Object.values(AfterIds).includes(attachmentTypeId)
  //       )
  //       ?.map(({ attachmentTypeId, fileName }) => {
  //         return {
  //           file_name: Object.entries(AfterIds).find(
  //             (item) => item[1] == attachmentTypeId
  //           )[0],
  //           file: fileName,
  //         };
  //       }),
  //   },
  //   {
  //     name: "Actual Additional Charges",
  //     attachmenttype: "charges",
  //     files: attachmentsChargeData?.data?.data?.filter((item) =>
  //       item.hasOwnProperty("chargeId")
  //     ),
  //     //files:[]
  //   },
  //   {
  //     name: "Breakdown Signatures",
  //     attachmenttype: "signature",
  //     files: attachmentsData?.data?.data
  //       ?.filter(
  //         (item, i) =>
  //           item?.attachmentTypeId == 84 || item?.attachmentTypeId == 70
  //       )
  //       ?.map((attachment, i) => {
  //         return {
  //           file_name:
  //             attachment?.attachmentTypeId == 84 ? "Customer" : "Driver",
  //           file: `${attachment?.fileName}`,
  //         };
  //       }),
  //   },
  //   {
  //     name: "Drop Signatures",
  //     attachmenttype: "signature",
  //     files: attachmentsData?.data?.data
  //       ?.filter(
  //         (item, i) =>
  //           item?.attachmentTypeId == 77 ||
  //           item?.attachmentTypeId == 602 ||
  //           item?.attachmentTypeId == 78
  //       )
  //       ?.map((attachment, i) => {
  //         return {
  //           file_name:
  //             attachment?.attachmentTypeId == 77
  //               ? "Dealer"
  //               : attachment?.attachmentTypeId == 602
  //               ? "Customer"
  //               : "Driver",
  //           file: `${attachment?.fileName}`,
  //         };
  //       }),
  //   },
  // ];
  // console.log("AttachmentsFolders", AttachmentsFolders);
  // console.log("selectedFolder", selectedFolder);

  // console.log("Attachments Data => ", attachmentsData?.data?.data);

  // Filter and sort attachments by attachmentTypeId and ID ascending
  const beforePhotos =
    attachmentsData?.data?.data
      ?.filter((item) => item.attachmentTypeId === 614)
      ?.sort((a, b) => (a.id || 0) - (b.id || 0)) || [];

  const afterPhotos =
    attachmentsData?.data?.data
      ?.filter((item) => item.attachmentTypeId === 615)
      ?.sort((a, b) => (a.id || 0) - (b.id || 0)) || [];

  const handleDownload = (baseUrl, fileName, file_name) => {
    const imageUrl = `${baseUrl}${fileName}`;
    const downloadFileName = file_name ?? fileName ?? "downloaded-image.jpg";

    fetch(imageUrl, {
      mode: "cors",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadFileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("Download failed:", err);
      });
  };

  return (
    <div className="attachment-tab-content-container">
      {/* {attachmentsData?.data?.data?.length > 0 ? (
        <div className="activity-container">
          {!selectedFolder && (
            <div className="folders-container">
              {AttachmentsFolders?.map((folder, i) => (
                <div className="folder" key={i}>
                  <FolderComponent
                    name={folder?.name}
                    onClick={(e) => setSelectedFolder(folder)}
                  />
                </div>
              ))}
            </div>
          )}

          {selectedFolder && (
            <div className="attachment-header">
              <div onClick={() => setSelectedFolder(null)}>Back</div>
              <img
                className="img-fluid"
                src={AttachmentSeperatorIcon}
                alt="Separator Icon"
              />
              <div>{selectedFolder?.name}</div>
            </div>
          )}

          {selectedFolder && (
            <div className="d-flex gap-3 flex-wrap">
              {selectedFolder && selectedFolder?.files?.length > 0 ? (
                selectedFolder?.files?.map((activity, i) => (
                  <>
                    {selectedFolder?.attachmenttype == "signature" && (
                      <div className="signature-main-container">
                        <div className="signature-card-container">
                          <img
                            src={`${FileBaseUrl}${activity?.file}`}
                            alt="signature-img"
                            className="signature-img"
                          />
                        </div>
                        <span className="activity-upload-title">
                          {activity?.file_name}
                        </span>
                      </div>
                    )}

                    {selectedFolder?.attachmenttype !== "charges" &&
                      selectedFolder?.attachmenttype !== "signature" && (
                        <div className="activity-upload" key={i}>
                          <img
                            src={`${FileBaseUrl}${activity?.file}`}
                            alt="activity-img"
                            className="activity-upload-img"
                          />
                          <span className="activity-upload-title">
                            {activity?.file_name ?? ""}
                          </span>
                        </div>
                      )}

                    {selectedFolder?.attachmenttype == "charges" && (
                      <div className="d-flex gap-3 flex-column">
                        <div className="charge-name">
                          {activity?.chargeName}
                        </div>
                        <div className="d-flex gap-3 flex-wrap">
                          {activity?.files?.length > 0 ? (
                            activity?.files?.map((charge) => (
                              <div className="activity-upload" key={i}>
                                <img
                                  src={`${AddtionalChargeBaseUrl}${charge?.fileName}`}
                                  alt="charge-img"
                                  className="activity-upload-img"
                                />
                              </div>
                            ))
                          ) : (
                            <h5>No Attachments</h5>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ))
              ) : (
                <h5>No Attachments</h5>
              )}
            </div>
          )}
        </div>
      ) : (
        <h5>No Attachments</h5>
      )} */}

      {/* <div className="before-activity-container">
        <div className="activity-title">Before Activity Photos</div>
        <div className="uploads-container">
          {Array.from({ length: 4 }, (v, i) => (
            <img src={VehicleActivityImage} key={i} />
          ))}

          <FileUpload
            multiple={false}
            // fileLimit="1"
            headerTemplate={({ chooseButton }) => chooseButton}
            contentStyle={{
              width: "max-content",
              padding: "0px",
              borderRadius: "4px",
            }}
            pt={{
              root: {
                className: "custom-preview-image",
              },
            }}
            name="upload_demo[]"
            //url="https://primefaces.org/primereact/showcase/upload.php"
            emptyTemplate={emptyTemplate}
            itemTemplate={itemTemplate}
            onBeforeUpload={handleUpload}
            chooseOptions={chooseOption}
            //auto
          ></FileUpload>
        </div>
      </div>
      <div className="after-activity-container">
        <div className="activity-title">After Activity Photos</div>
        <div className="uploads-container">
          {Array.from({ length: 4 }, (v, i) => (
            <img src={VehicleActivityImage} key={i} />
          ))}
          <FileUpload
            headerTemplate={({ chooseButton }) => chooseButton}
            contentStyle={{
              width: "max-content",
              padding: "0px",
              borderRadius: "4px",
            }}
            className="custom-preview-image"
            name="upload_demo[]"
            url="https://primefaces.org/primereact/showcase/upload.php"
            emptyTemplate={emptyTemplate}
            itemTemplate={itemTemplate}
            onBeforeUpload={handleUpload}
            chooseOptions={chooseOption}
            // auto
          ></FileUpload>
        </div>
      </div> */}

      <div className="activity-container">
        <div className="d-flex gap-3">
          {/* Before Photos - Left Side, Vertical List */}
          <div style={{ flex: 1 }}>
            <div className="activity-title" style={{ marginBottom: "1rem" }}>
              Before Photos
            </div>
            <div className="d-flex flex-column gap-3">
              {beforePhotos.length > 0 ? (
                beforePhotos.map((photo, i) => (
                  <div className="activity-upload" key={photo.id || i}>
                    <div
                      className="image-container"
                      onClick={() =>
                        handleDownload(
                          FileBaseUrl,
                          photo.fileName,
                          photo.originalName || photo.fileName
                        )
                      }
                    >
                      <img
                        src={`${FileBaseUrl}${photo.fileName}`}
                        alt="before-photo"
                        className="activity-upload-img"
                      />
                      <div className="activity-download-overlay">
                        <img
                          src={ImgDownloadIcon}
                          alt="download-icon"
                          className="activity-download-icon"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h5>No Attachments</h5>
              )}
            </div>
          </div>

          {/* After Photos - Right Side, Vertical List - Only for Towing Service */}
          {serviceId === 1 && (
            <div style={{ flex: 1 }}>
              <div className="activity-title" style={{ marginBottom: "1rem" }}>
                After Photos
              </div>
              <div className="d-flex flex-column gap-3">
                {afterPhotos.length > 0 ? (
                  afterPhotos.map((photo, i) => (
                    <div className="activity-upload" key={photo.id || i}>
                      <div
                        className="image-container"
                        onClick={() =>
                          handleDownload(
                            FileBaseUrl,
                            photo.fileName,
                            photo.originalName || photo.fileName
                          )
                        }
                      >
                        <img
                          src={`${FileBaseUrl}${photo.fileName}`}
                          alt="after-photo"
                          className="activity-upload-img"
                        />
                        <div className="activity-download-overlay">
                          <img
                            src={ImgDownloadIcon}
                            alt="download-icon"
                            className="activity-download-icon"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h5>No Attachments</h5>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentsTab;
