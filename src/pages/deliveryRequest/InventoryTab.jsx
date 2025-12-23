import React, { useState } from "react";
import FolderComponent from "./FolderComponent";
import {
  AttachmentSeperatorIcon,
  FileBaseUrl,
  ImgDownloadIcon,
} from "../../utills/imgConstants";

const InventoryTab = ({ inventoryDetails, data }) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const AttachmentsFolders = [
    {
      name: "Pickup Inventory",
      files: data
        ?.filter((item) => item?.attachmentTypeId == 62)
        ?.map((attachment) => {
          return {
            custom_name: "Pickup Inventory",
            file_name: `${attachment?.fileName}`,
          };
        }),
      inventoryItems: inventoryDetails?.filter((item) => item.typeId == 160),
    },
    {
      name: "Drop Inventory",
      files: data
        ?.filter((item) => item?.attachmentTypeId == 79)
        ?.map((attachment) => {
          return {
            custom_name: "Drop Inventory",
            file_name: `${attachment?.fileName}`,
          };
        }),
      inventoryItems: inventoryDetails?.filter((item) => item.typeId == 161),
    },
  ];
  const handleDownload = (baseUrl, activity, file_name) => {
    const imageUrl = `${baseUrl}${activity}`;
    const fileName = file_name ?? "inventory-image.jpg";

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
  return (
    <div className="inventory-tab-container">
      <div className="activity-container">
        <>
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
            <>
              <div className="attachment-header">
                <div onClick={() => setSelectedFolder(null)}>Back</div>
                <img
                  className="img-fluid"
                  src={AttachmentSeperatorIcon}
                  alt="Separator Icon"
                />
                <div>{selectedFolder?.name}</div>
              </div>
              <div className="">
                <div className="inventory-item-title">Inventory Items</div>
                {selectedFolder?.inventoryItems?.length > 0 && (
                  <div className="inventoryitem-list">
                    {selectedFolder?.inventoryItems?.map((item, i) => (
                      <div
                        className="d-flex align-items-center inventoryname"
                        key={i}
                      >
                        {item?.inventoryName}
                      </div>
                    ))}
                  </div>
                )}
                <div className="inventory-attachmentlist">
                  {selectedFolder?.files?.length > 0 ? (
                    selectedFolder?.files?.map((file, i) => (
                      <>
                        <div
                          div
                          className="signature-card-container  image-container"
                          onClick={() =>
                            handleDownload(
                              FileBaseUrl,
                              file?.file_name,
                              file?.custom_name
                            )
                          }
                        >
                          <img
                            src={`${FileBaseUrl}${file?.file_name}`}
                            className="activity-upload-img"
                            key={i}
                          />
                          <div className="activity-download-overlay">
                            <img
                              src={ImgDownloadIcon}
                              alt="download-icon"
                              className="activity-download-icon"
                            />
                          </div>
                        </div>
                      </>
                    ))
                  ) : (
                    <h4>No Attachments</h4>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default InventoryTab;
