import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { initiateCancellation } from "../../../../services/caseService";
import { getConfigList } from "../../../../services/masterServices";
import { toast } from "react-toastify";

const InitiateCancellationDialog = ({
  transaction,
  aspResultData,
  activeServiceIndex,
  visible,
  setVisible,
  onSuccess,
  aspRefetch,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({});

  const refundTypeId = useWatch({
    control,
    name: "refundTypeId",
  });

  // Support both patterns: transaction prop (new) or aspResultData (old)
  const customerPaidAmount = transaction
    ? parseFloat(transaction?.amount || 0)
    : parseFloat(
        aspResultData?.[activeServiceIndex]?.estimatedTotalAmount || 0
      );

  useEffect(() => {
    if (visible) {
      reset();
      // Set default refund amount to full amount when dialog opens
      if (customerPaidAmount > 0) {
        setValue("refundAmount", customerPaidAmount);
      }
    }
  }, [visible, customerPaidAmount, reset, setValue]);

  useEffect(() => {
    // When refund type changes to Full, set refund amount to customer paid amount
    if (refundTypeId === 1201 && customerPaidAmount > 0) {
      setValue("refundAmount", customerPaidAmount);
    }
  }, [refundTypeId, customerPaidAmount, setValue]);

  // Get Refund Type Options from API
  const { data: refundTypeData } = useQuery(
    ["refundTypeList"],
    () =>
      getConfigList({
        typeId: 92, // Refund Type
      }),
    {
      enabled: visible,
    }
  );

  // Transform API response to dropdown format
  const refundTypeOptions =
    refundTypeData?.data?.success && refundTypeData?.data?.data
      ? refundTypeData.data.data.map((item) => ({
          id: item.id,
          name: item.name,
        }))
      : [];

  // Process Refund API
  const { mutate: initiateCancellationMutate, isLoading } =
    useMutation(initiateCancellation);

  const onSubmit = (values) => {
    const selectedRefundType =
      refundTypeOptions.find(
        (item) => String(item.id) === String(values.refundTypeId)
      ) || null;

    // Support both patterns: transaction prop (new) or find from aspResultData (old)
    let targetTransaction = transaction;
    if (!targetTransaction && aspResultData) {
      // Get the first non-membership transaction (paymentTypeId: 174)
      targetTransaction = aspResultData[
        activeServiceIndex
      ]?.data?.data?.transactions?.find((txn) => txn?.paymentTypeId === 174);
    }

    if (!targetTransaction?.id) {
      toast.error("Transaction not found");
      return;
    }

    const payload = {
      transactionId: targetTransaction.id,
      refundTypeId: values.refundTypeId,
      refundTypeName: selectedRefundType?.name || null,
      refundAmount:
        values.refundTypeId === 1201
          ? customerPaidAmount
          : parseFloat(values.refundAmount || 0),
      refundReason: values.refundReason,
    };

    // Validate partial refund amount
    if (values.refundTypeId === 1202) {
      const refundAmount = parseFloat(values.refundAmount || 0);
      if (refundAmount <= 0) {
        toast.error("Refund amount must be greater than 0");
        return;
      }
      if (refundAmount > customerPaidAmount) {
        toast.error(
          `Refund amount cannot exceed customer paid amount (${customerPaidAmount})`
        );
        return;
      }
    }

    initiateCancellationMutate(payload, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          setVisible(false);
          reset();
          toast.success(
            res?.data?.message || "Cancellation initiated successfully"
          );
          // Support both patterns: onSuccess callback (new) or aspRefetch (old)
          if (onSuccess) {
            onSuccess();
          } else if (aspRefetch && activeServiceIndex !== undefined) {
            aspRefetch[activeServiceIndex]?.refetch();
          }
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
          error?.response?.data?.error || "Error initiating cancellation"
        );
      },
    });
  };

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Initiate Refund</div>
        </div>
      }
      style={{ width: "566px" }}
      visible={visible}
      position={"center"}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closable={true}
    >
      <form
        className="change-activity-form"
        onSubmit={handleSubmit(onSubmit)}
        id="initiate-cancellation-form"
      >
        <div className="row row-gap-3_4">
          <div className="col-md-12">
            <div className="form-group">
              <div className="p-field">
                <label className="form-label required">Refund Type</label>
                <Controller
                  name="refundTypeId"
                  control={control}
                  rules={{ required: "Refund Type is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        placeholder="Select Refund Type"
                        options={refundTypeOptions}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(e) => {
                          field.onChange(e.value);
                        }}
                        className={fieldState.error ? "p-invalid" : ""}
                      />
                      {fieldState?.error && (
                        <small className="p-error">
                          {fieldState?.error?.message}
                        </small>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group">
              <div className="p-field">
                <label className="form-label required">Refund Amount</label>
                <Controller
                  name="refundAmount"
                  control={control}
                  rules={{
                    required: "Refund Amount is required.",
                    validate: (value) => {
                      const amount = parseFloat(value || 0);
                      if (amount <= 0) {
                        return "Refund amount must be greater than 0";
                      }
                      if (amount > customerPaidAmount) {
                        return `Refund amount cannot exceed customer paid amount (${customerPaidAmount})`;
                      }
                      // For partial refund, ensure amount is less than or equal to estimatedTotalAmount
                      if (
                        refundTypeId === 1202 &&
                        amount > customerPaidAmount
                      ) {
                        return `Refund amount must be less than or equal to ${customerPaidAmount}`;
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        max={customerPaidAmount}
                        placeholder="Enter Refund Amount"
                        className={fieldState.error ? "p-invalid" : ""}
                        disabled={refundTypeId === 1201} // Disable for Full refund
                        value={field.value || ""}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          // Allow empty string while typing
                          if (
                            inputValue === "" ||
                            inputValue === null ||
                            inputValue === undefined
                          ) {
                            field.onChange("");
                            return;
                          }
                          // Parse the value
                          let value = parseFloat(inputValue);
                          // If not a valid number, allow the input (user might be typing)
                          if (isNaN(value)) {
                            field.onChange(inputValue);
                            return;
                          }
                          // Restrict to maximum customer paid amount
                          if (value > customerPaidAmount) {
                            value = customerPaidAmount;
                          }
                          // Ensure value is not negative
                          if (value < 0) {
                            value = 0;
                          }
                          field.onChange(value);
                        }}
                        onBlur={(e) => {
                          let value = parseFloat(e.target.value) || 0;
                          // Restrict to maximum customer paid amount on blur
                          if (value > customerPaidAmount) {
                            value = customerPaidAmount;
                          }
                          // Ensure value is not negative
                          if (value < 0) {
                            value = 0;
                          }
                          field.onChange(value);
                        }}
                      />
                      {fieldState?.error && (
                        <small className="p-error">
                          {fieldState?.error?.message}
                        </small>
                      )}
                      {customerPaidAmount > 0 && (
                        <small className="p-text-secondary">
                          Customer Paid Amount: {customerPaidAmount}
                        </small>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group">
              <div className="p-field">
                <label className="form-label required">Refund Reason</label>
                <Controller
                  name="refundReason"
                  control={control}
                  rules={{ required: "Refund reason is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextarea
                        {...field}
                        rows={4}
                        placeholder="Enter Refund Reason"
                        className={fieldState.error ? "p-invalid" : ""}
                      />
                      {fieldState?.error && (
                        <small className="p-error">
                          {fieldState?.error?.message}
                        </small>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <Button
              className="form-submit-btn mt-2"
              type="submit"
              loading={isLoading}
              form="initiate-cancellation-form"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default InitiateCancellationDialog;
