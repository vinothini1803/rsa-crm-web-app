import React, { useState } from "react";
import {
  AddtionalChargeBaseUrl,
  AttachmentSeperatorIcon,
  FileBaseUrl,
  ImgDownloadIcon,
} from "../../utills/imgConstants";
import { useQuery } from "react-query";
import { attachments } from "../../../services/inventoryViewService";
import FolderComponent from "./FolderComponent";

const AttachmentsTab = ({ locationTypeId, data }) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  // console.log("attachments data", data);
  const BeforeIds = {
    "E Way Bill": 608,
    "Lorry Receipt": 609,
    "Front Side": 63,
    "Rear Side": 64,
    "Driver side": 65,
    "Passenger Side": 66,
    "Damaged Area": 67,
    Others: 68,
  };

  const AfterIds = {
    "E Way Bill": 610,
    "Lorry Receipt": 611,
    "Front Side": 71,
    "Rear Side": 72,
    "Driver side": 73,
    "Passenger Side": 74,
    "Damaged Area": 75,
    Others: 76,
  };

  const AttachmentsFolders = [
    {
      name: "Before Activity Photos",
      files: Object.entries(BeforeIds)
        .map(([key, value]) => {
          const match = data?.find((item) => item.attachmentTypeId === value);
          return match
            ? {
                file_name: key,
                file: match.fileName,
              }
            : null; // no match for this id, skip it
        })
        .filter(Boolean), // remove nulls (no match found)
    },
    // {
    //   name: "Before Activity Photos",
    //   files: data
    //     ?.filter(({ attachmentTypeId }) =>
    //       Object.values(BeforeIds).includes(attachmentTypeId)
    //     )
    //     ?.map(({ attachmentTypeId, fileName }) => {
    //       return {
    //         file_name: Object.entries(BeforeIds).find(
    //           (item) => item[1] == attachmentTypeId
    //         )[0],
    //         file: fileName,
    //       };
    //     })
    // },
    {
      name: "After Activity Photos",
      files: Object.entries(AfterIds)
        .map(([key, value]) => {
          const match = data?.find((item) => item.attachmentTypeId === value);
          return match
            ? {
                file_name: key,
                file: match.fileName,
              }
            : null;
        })
        .filter(Boolean), // Removes nulls where no matching file found
    },
    // {
    //   name: "After Activity Photos",
    //   files: data
    //     ?.filter(({ attachmentTypeId }) =>
    //       Object.values(AfterIds).includes(attachmentTypeId)
    //     )
    //     ?.map(({ attachmentTypeId, fileName }) => {
    //       return {
    //         file_name: Object.entries(AfterIds).find(
    //           (item) => item[1] == attachmentTypeId
    //         )[0],
    //         file: fileName,
    //       };
    //     }),
    // },

    {
      name: "Actual Additional Charges",
      attachmenttype: "charges",
      files: data?.filter((item) => item.hasOwnProperty("chargeId")),
      //files:[]
    },
    {
      name: "Pickup Signatures",
      attachmenttype: "signature",
      files: data
        ?.filter(
          (item, i) =>
            item?.attachmentTypeId == 69 || item?.attachmentTypeId == 70
        )
        ?.map((attachment, i) => {
          return {
            file_name:
              attachment?.attachmentTypeId == 69
                ? locationTypeId == 451
                  ? "Customer"
                  : "Dealer"
                : "Driver",
            file: `${attachment?.fileName}`,
          };
        }),
    },
    {
      name: "Drop Signatures",
      attachmenttype: "signature",
      files: data
        ?.filter(
          (item, i) =>
            item?.attachmentTypeId == 78 || item?.attachmentTypeId == 77
        )
        ?.map((attachment, i) => {
          return {
            file_name:
              attachment?.attachmentTypeId == 77
                ? locationTypeId == 451
                  ? "Customer"
                  : "Dealer"
                : "Driver",
            file: `${attachment?.fileName}`,
          };
        }),
    },
  ];
  // console.log("AttachmentsFolders", AttachmentsFolders);
  // console.log("selectedFolder", selectedFolder);
  const handleDownload = (baseUrl, activity, file_name) => {
    const imageUrl = `${baseUrl}${activity}`;
    const fileName = file_name ?? "downloaded-image.jpg";

    fetch(imageUrl, {
      mode: "cors",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("Download failed:", err);
      });
  };
  // console.log("AttachmentsFolders", AttachmentsFolders);
  return (
    <div className="inventory-tab-container">
      {data?.length > 0 ? (
        <div className="activity-container">
          {!selectedFolder && (
            <div className="folders-container">
              {AttachmentsFolders?.map((folder) => (
                <div className="folder">
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
                    {/* Signature Attachments */}
                    {selectedFolder?.attachmenttype == "signature" && (
                      <div className="signature-main-container">
                        <div
                          className="signature-card-container  image-container"
                          onClick={() =>
                            handleDownload(
                              FileBaseUrl,
                              activity?.file,
                              activity?.file_name
                            )
                          }
                        >
                          <img
                            src={`${FileBaseUrl}${activity?.file}`}
                            alt="signature-img"
                            className="signature-img"
                          />
                          <div className="activity-download-overlay">
                            <img
                              src={ImgDownloadIcon}
                              alt="download-icon"
                              className="activity-download-icon"
                            />
                          </div>
                        </div>
                        <span className="activity-upload-title">
                          {activity?.file_name}
                        </span>
                      </div>
                    )}

                    {selectedFolder?.attachmenttype !== "charges" &&
                      selectedFolder?.attachmenttype !== "signature" && (
                        <div className="activity-upload" key={i}>
                          <div
                            className="image-container"
                            onClick={() =>
                              handleDownload(
                                FileBaseUrl,
                                activity?.file,
                                activity?.file_name
                              )
                            }
                          >
                            <img
                              src={`${FileBaseUrl}${activity?.file}`}
                              alt="activity-img"
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
                          <span className="activity-upload-title">
                            {activity?.file_name ?? ""}
                          </span>
                        </div>
                      )}
                    {/*  charges Attachments*/}

                    {selectedFolder?.attachmenttype == "charges" && (
                      <div className="d-flex gap-3 flex-column">
                        <div className="charge-name">
                          {activity?.chargeName}
                        </div>
                        <div className="d-flex gap-3 flex-wrap">
                          {activity?.files?.length > 0 ? (
                            activity?.files?.map((charge) => (
                              <div className="activity-upload" key={i}>
                                <div
                                  className="image-container"
                                  onClick={() =>
                                    handleDownload(
                                      AddtionalChargeBaseUrl,
                                      charge?.fileName,
                                      "charge-img"
                                    )
                                  }
                                >
                                  <img
                                    src={`${AddtionalChargeBaseUrl}${charge?.fileName}`}
                                    alt="charge-img"
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
      )}
    </div>
  );
};

export default AttachmentsTab;
