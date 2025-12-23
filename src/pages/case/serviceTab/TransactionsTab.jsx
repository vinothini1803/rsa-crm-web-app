import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import {
  getActivityTransactions,
  resendPaymentLink,
  paymentLinkExpire,
  activityCheckPaymentStatus,
  checkRefundStatus,
} from "../../../../services/caseService";
import { toast } from "react-toastify";
import CurrencyFormat from "../../../components/common/CurrencyFormat";
import StatusBadge from "../../../components/common/StatusBadge";
import { Button } from "primereact/button";
import CheckPaymentStatusDialog from "./CheckPaymentStatusDialog";
import InitiateCancellationDialog from "./InitiateCancellationDialog";
import moment from "moment-timezone";
import NoDataComponent from "../../../components/common/NoDataComponent";
import { NoInventoryImage } from "../../../utills/imgConstants";

const TransactionsTab = ({
  activityId,
  aspRefetch,
  caseData,
  activityData,
}) => {
  const [paymentStatusDialogVisible, setPaymentStatusDialogVisible] =
    useState(false);
  const [
    initiateCancellationDialogVisible,
    setInitiateCancellationDialogVisible,
  ] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [resendLinkMap, setResendLinkMap] = useState({});

  // Payment resend mutation
  const { mutate: paymentMutate, isLoading: paymentMutateLoading } =
    useMutation(resendPaymentLink);

  // Check payment status mutation
  const {
    mutate: activityCheckPaymentStatusMutate,
    isLoading: activityCheckPaymentStatusMutateLoading,
  } = useMutation(activityCheckPaymentStatus);

  // Check refund status mutation
  const {
    mutate: checkRefundStatusMutate,
    isLoading: checkRefundStatusLoading,
  } = useMutation(checkRefundStatus);

  // Fetch activity transactions
  const {
    data: transactionsData,
    isLoading,
    refetch: refetchTransactions,
  } = useQuery(
    ["activityTransactions", activityId],
    () => getActivityTransactions(activityId),
    {
      enabled: !!activityId,
      refetchOnWindowFocus: false,
    }
  );

  const transactions = transactionsData?.data?.data || [];

  // Check payment link expiry for all transactions on load
  useEffect(() => {
    if (transactions.length > 0) {
      transactions.forEach((transaction) => {
        if (
          transaction.customerNeedToPay &&
          !transaction.isCustomerInvoiced &&
          transaction.sendPaymentLinkTo
        ) {
          checkPaymentLinkExpiry(transaction);
        }
      });
    }
  }, [transactions]);

  const handleCheckPaymentStatus = (transaction) => {
    setSelectedTransaction(transaction);
    setPaymentStatusDialogVisible(true);
  };

  const handleCheckRefundStatus = (transaction) => {
    if (!transaction?.id) {
      toast.error("Transaction ID not found");
      return;
    }

    checkRefundStatusMutate(
      {
        transactionId: transaction.id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(
              res?.data?.message || "Refund status checked successfully"
            );
            refetchTransactions();
            aspRefetch?.refetch();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.error || "Error checking refund status"
          );
        },
      }
    );
  };

  // Check payment link expiry for a transaction
  const checkPaymentLinkExpiry = (transaction) => {
    if (!transaction?.membershipId) return;

    paymentLinkExpire({
      membershipId: transaction.membershipId,
    })
      .then((res) => {
        if (res?.data?.success && res?.data?.showResendSmsBtn) {
          setResendLinkMap((prev) => ({
            ...prev,
            [transaction.id]: true,
          }));
        }
      })
      .catch(() => {
        // Silently fail - payment link expiry check is optional
      });
  };

  // Handle resend payment link for a transaction
  const handleResendLink = (transaction) => {
    if (!transaction?.id) {
      toast.error("Transaction ID not found");
      return;
    }

    paymentMutate(
      {
        transactionId: transaction.id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setResendLinkMap((prev) => ({
              ...prev,
              [transaction.id]: false,
            }));
            refetchTransactions();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  // Handle check payment status for a transaction
  const handleTransactionCheckPaymentStatus = (transaction) => {
    if (!transaction?.id) {
      toast.error("Transaction ID not found");
      return;
    }

    activityCheckPaymentStatusMutate(
      {
        transactionId: transaction.id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            refetchTransactions();
            aspRefetch?.refetch();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const getPaymentStatusLabel = (paymentStatusId) => {
    const statusMap = {
      190: "Pending",
      191: "Success",
      192: "Failed",
    };
    return statusMap[paymentStatusId] || "Unknown";
  };

  const getRefundStatusBadge = (refundStatusId) => {
    const statusMap = {
      1301: "Pending",
      1302: "Processed",
      1303: "Rejected",
    };
    return statusMap[refundStatusId] || null;
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="border-box bg-white border-transparent">
        <NoDataComponent
          image={NoInventoryImage}
          text="No transactions found for this activity"
        />
      </div>
    );
  }

  return (
    <>
      <div className="transactions-container">
        {transactions.map((transaction, index) => {
          const paymentStatusLabel = getPaymentStatusLabel(
            transaction.paymentStatusId
          );
          const refundStatus = transaction.refundStatusId
            ? getRefundStatusBadge(transaction.refundStatusId)
            : null;

          return (
            <div key={transaction.id} className="transaction-card mb-3">
              <div className="border-box bg-white border-transparent p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-2">Transaction #{transaction.id}</h5>
                    <div className="d-flex gap-3 mb-2">
                      <div>
                        <span className="text-muted">Amount: </span>
                        <strong>
                          <CurrencyFormat amount={transaction.amount} />
                        </strong>
                      </div>
                      {transaction.paymentStatusId && (
                        <div>
                          <span className="text-muted">Payment Status: </span>
                          <StatusBadge
                            text={paymentStatusLabel}
                            statusId={transaction.paymentStatusId}
                            statusType="paymentStatusId"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="transaction-details mb-3">
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <span className="text-muted">Razorpay Order ID: </span>
                      <span className="text-break">
                        {transaction.razorpayOrderId || "--"}
                      </span>
                    </div>
                    <div className="col-md-6 mb-2">
                      <span className="text-muted">Transaction ID: </span>
                      <span className="text-break">
                        {transaction.razorpayTransactionId || "--"}
                      </span>
                    </div>
                    <div className="col-md-6 mb-2">
                      <span className="text-muted">Membership ID: </span>
                      <span>{transaction.membershipId || "--"}</span>
                    </div>
                    <div className="col-md-6 mb-2">
                      <span className="text-muted">Paid At: </span>
                      <span>
                        {transaction.paidAt
                          ? moment
                              .tz(transaction.paidAt, "Asia/Kolkata")
                              .format("DD/MM/YYYY hh:mm A")
                          : "--"}
                      </span>
                    </div>
                    <div className="col-md-6 mb-2">
                      <span className="text-muted">Created: </span>
                      <span>
                        {moment
                          .tz(transaction.createdAt, "Asia/Kolkata")
                          .format("DD/MM/YYYY hh:mm A")}
                      </span>
                    </div>
                  </div>

                  {/* Cancellation Details per Transaction */}
                  {transaction.cancellationStatusId && (
                    <div className="mt-3 pt-3 border-top">
                      <h6 className="mb-3">Refund Approval Details</h6>
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <span className="text-muted">Status: </span>
                          <StatusBadge
                            text={transaction.cancellationStatus}
                            statusId={transaction.cancellationStatusId}
                            statusType="cancellationStatus"
                          />
                        </div>
                        {transaction.cancellationStatusId === 1312 && (
                          <div className="col-md-12 mb-2">
                            <span className="text-muted">
                              Rejected Reason:{" "}
                            </span>
                            <span>
                              {transaction.cancellationRejectedReason || "--"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Refund Details per Transaction */}
                  {transaction.refundStatusId && (
                    <div className="mt-3 pt-3 border-top">
                      <h6 className="mb-3">Refund Details</h6>
                      <div className="row">
                        {transaction.refundId && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Refund ID: </span>
                            <span className="text-break">
                              {transaction.refundId || "--"}
                            </span>
                          </div>
                        )}
                        {transaction.refundType && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Refund Type: </span>
                            <span>{transaction.refundType || "--"}</span>
                          </div>
                        )}
                        {transaction.refundAmount && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Refund Amount: </span>
                            <strong>
                              <CurrencyFormat
                                amount={transaction.refundAmount}
                              />
                            </strong>
                          </div>
                        )}
                        {transaction.refundStatusId && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Refund Status: </span>
                            <StatusBadge
                              text={transaction.refundStatus}
                              statusId={transaction.refundStatusId}
                              statusType="refundStatus"
                            />
                          </div>
                        )}
                        {transaction.refundReason && (
                          <div className="col-md-12 mb-2">
                            <span className="text-muted">Refund Reason: </span>
                            <span>{transaction.refundReason || "--"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="transaction-actions d-flex gap-2 flex-wrap">
                  {/* Resend Payment Link */}
                  {transaction.customerNeedToPay &&
                    !transaction.isCustomerInvoiced &&
                    transaction.sendPaymentLinkTo &&
                    resendLinkMap[transaction.id] && (
                      <Button
                        label="Resend Payment Link"
                        icon="pi pi-send"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleResendLink(transaction)}
                        disabled={paymentMutateLoading}
                        loading={paymentMutateLoading}
                      />
                    )}

                  {/* Check Payment Status */}
                  {transaction.customerNeedToPay &&
                    transaction.sendPaymentLinkTo &&
                    !transaction.razorpayTransactionId && (
                      <Button
                        label="Check Payment Status"
                        icon="pi pi-check-circle"
                        className="btn btn-info btn-sm"
                        onClick={() =>
                          handleTransactionCheckPaymentStatus(transaction)
                        }
                        disabled={activityCheckPaymentStatusMutateLoading}
                        loading={activityCheckPaymentStatusMutateLoading}
                      />
                    )}

                  {/* Initiate Refund */}
                  {transaction.paymentStatusId === 191 && // SUCCESSFUL PAYMENT
                    activityData?.activityStatusId === 4 && //CANCELED ACTIVITY
                    (transaction.cancellationStatusId === 1312 ||
                      !transaction.cancellationStatusId) && ( // CANCELLATION REJECTED OR NOT CANCELLED
                      <Button
                        label="Initiate Refund"
                        icon="pi pi-undo"
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setInitiateCancellationDialogVisible(true);
                        }}
                      />
                    )}

                  {/* Check Refund Status */}
                  {transaction.refundStatusId == 1301 && (
                    <Button
                      label="Check Refund Status"
                      icon="pi pi-info-circle"
                      className="btn btn-info btn-sm"
                      onClick={() => handleCheckRefundStatus(transaction)}
                      disabled={checkRefundStatusLoading}
                      loading={checkRefundStatusLoading}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Check Payment Status Dialog */}
      {paymentStatusDialogVisible && selectedTransaction && (
        <CheckPaymentStatusDialog
          visible={paymentStatusDialogVisible}
          setVisible={setPaymentStatusDialogVisible}
          transaction={selectedTransaction}
        />
      )}

      {/* Initiate Cancellation Dialog */}
      {initiateCancellationDialogVisible && selectedTransaction && (
        <InitiateCancellationDialog
          visible={initiateCancellationDialogVisible}
          setVisible={setInitiateCancellationDialogVisible}
          transaction={selectedTransaction}
          onSuccess={() => {
            refetchTransactions();
            aspRefetch?.refetch();
          }}
        />
      )}
    </>
  );
};

export default TransactionsTab;
