import { Dialog } from "primereact/dialog";
import React, { useEffect } from "react";
import { Button } from "primereact/button";
import { DialogCloseSmallIcon } from "../../utills/imgConstants";
import { FileGreenMediumIcon } from "../../utills/imgConstants";
import "./components.less";
const AttachmentsDialog = ({
  title,
  visible,
  setVisible,
  attachments,
  download,
  deleteFile,
  onDeleteFile,
  footer,
}) => {
  // console.log("AttachmentsDialog", attachments);

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
    </Dialog>
  );
};

export default AttachmentsDialog;
