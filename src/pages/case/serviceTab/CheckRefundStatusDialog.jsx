import React, { useState } from "react";
import { useMutation } from "react-query";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { checkRefundStatus } from "../../../../services/caseService";
import { toast } from "react-toastify";
import StatusBadge from "../../../components/common/StatusBadge";
import CurrencyFormat from "../../../components/common/CurrencyFormat";

const CheckRefundStatusDialog = ({ visible, setVisible, transaction }) => {
  const [refundStatusData, setRefundStatusData] = useState(null);

  const { mutate: checkRefundStatusMutate, isLoading } = useMutation(
    checkRefundStatus,
    {
      onSuccess: (response) => {
        if (response?.data?.success) {
          // Find the result for this specific transaction
          const transactionResult = response.data.results?.find(
            (result) => result.transactionId === transaction.id
          );
          if (transactionResult) {
            setRefundStatusData(transactionResult);
          } else {
            setRefundStatusData(response.data);
          }
        } else {
          toast.error(response?.data?.error || "Failed to check refund status");
        }
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.error || "Error checking refund status"
        );
      },
    }
  );

  const handleCheck = () => {
    checkRefundStatusMutate({ transactionId: transaction.id });
  };

  const getRefundStatusBadge = (refundStatusId) => {
    const statusMap = {
      1301: { label: "Pending", severity: "warning" },
      1302: { label: "Processed", severity: "success" },
      1303: { label: "Rejected", severity: "danger" },
    };
    return statusMap[refundStatusId] || { label: "Unknown", severity: "info" };
  };

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Check Refund Status</div>
        </div>
      }
      visible={visible}
      onHide={() => {
        setVisible(false);
        setRefundStatusData(null);
      }}
      className="w-600"
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <div className="refund-status-dialog">
        <div className="mb-3">
          <div className="mb-2">
            <strong>Transaction ID:</strong> {transaction.id}
          </div>
          <div className="mb-2">
            <strong>Membership ID:</strong> {transaction.membershipId || "--"}
          </div>
          {transaction.refundAmount && (
            <div className="mb-2">
              <strong>Refund Amount:</strong>{" "}
              <CurrencyFormat amount={transaction.refundAmount} />
            </div>
          )}
        </div>

        {!refundStatusData && (
          <div className="d-flex justify-content-end">
            <Button
              label="Check Status"
              icon="pi pi-check"
              className="btn btn-primary"
              onClick={handleCheck}
              loading={isLoading}
            />
          </div>
        )}

        {refundStatusData && (
          <div className="refund-status-result mt-3">
            <div className="mb-3">
              <strong>Refund Status:</strong>{" "}
              <StatusBadge
                label={
                  getRefundStatusBadge(refundStatusData.refundStatusId).label
                }
                severity={
                  getRefundStatusBadge(refundStatusData.refundStatusId).severity
                }
              />
            </div>
            {refundStatusData.refundId && (
              <div className="mb-2">
                <strong>Refund ID:</strong> {refundStatusData.refundId}
              </div>
            )}
            {refundStatusData.message && (
              <div className="mb-2">
                <strong>Message:</strong> {refundStatusData.message}
              </div>
            )}
            {refundStatusData.data && (
              <div className="refund-details">
                <h6 className="mb-2">Refund Details:</h6>
                <pre
                  className="bg-light p-3 rounded"
                  style={{ fontSize: "12px" }}
                >
                  {JSON.stringify(refundStatusData.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default CheckRefundStatusDialog;



