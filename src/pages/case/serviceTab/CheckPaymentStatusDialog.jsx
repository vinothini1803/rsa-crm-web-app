import React, { useState } from "react";
import { useMutation } from "react-query";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { activityCheckPaymentStatus } from "../../../../services/caseService";
import { toast } from "react-toastify";
import StatusBadge from "../../../components/common/StatusBadge";
import CurrencyFormat from "../../../components/common/CurrencyFormat";

const CheckPaymentStatusDialog = ({ visible, setVisible, transaction }) => {
  const [paymentStatusData, setPaymentStatusData] = useState(null);

  const { mutate: checkPaymentStatus, isLoading } = useMutation(
    activityCheckPaymentStatus,
    {
      onSuccess: (response) => {
        if (response?.data?.success) {
          setPaymentStatusData(response.data);
        } else {
          toast.error(
            response?.data?.error || "Failed to check payment status"
          );
        }
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.error || "Error checking payment status"
        );
      },
    }
  );

  const handleCheck = () => {
    if (!transaction?.id) {
      toast.error("Transaction ID not found");
      return;
    }
    checkPaymentStatus({ transactionId: transaction.id });
  };

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Check Payment Status</div>
        </div>
      }
      visible={visible}
      onHide={() => {
        setVisible(false);
        setPaymentStatusData(null);
      }}
      className="w-600"
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <div className="payment-status-dialog">
        <div className="mb-3">
          <div className="mb-2">
            <strong>Transaction ID:</strong> {transaction.id}
          </div>
          <div className="mb-2">
            <strong>Razorpay Order ID:</strong>{" "}
            {transaction.razorpayOrderId || "--"}
          </div>
          <div className="mb-2">
            <strong>Amount:</strong>{" "}
            <CurrencyFormat amount={transaction.amount} />
          </div>
        </div>

        {!paymentStatusData && (
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

        {paymentStatusData && (
          <div className="payment-status-result mt-3">
            <div className="mb-3">
              <strong>Payment Status:</strong>{" "}
              <StatusBadge
                label={
                  paymentStatusData.paymentCaptured
                    ? "Captured"
                    : "Not Captured"
                }
                severity={
                  paymentStatusData.paymentCaptured ? "success" : "warning"
                }
              />
            </div>
            {paymentStatusData.data && (
              <div className="payment-details">
                <h6 className="mb-2">Payment Details:</h6>
                <pre
                  className="bg-light p-3 rounded"
                  style={{ fontSize: "12px" }}
                >
                  {JSON.stringify(paymentStatusData.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default CheckPaymentStatusDialog;
