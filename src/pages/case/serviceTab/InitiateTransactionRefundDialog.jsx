import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../../store/slices/userSlice";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { initiateCancellation } from "../../../../services/caseService";
import { getConfigList } from "../../../../services/masterServices";
import { toast } from "react-toastify";
import CurrencyFormat from "../../../components/common/CurrencyFormat";

const InitiateTransactionRefundDialog = ({
  visible,
  setVisible,
  transaction,
  onSuccess,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({});

  const refundTypeId = watch("refundTypeId");
  const { id: authUserId } = useSelector(CurrentUser);

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

  useEffect(() => {
    if (visible) {
      reset();
      // Set default refund amount to full amount when dialog opens
      const transactionAmount = parseFloat(transaction.amount || 0);
      if (transactionAmount > 0) {
        setValue("refundAmount", transactionAmount);
      }
    }
  }, [visible, transaction.amount, reset, setValue]);

  useEffect(() => {
    // When refund type changes to Full, set refund amount to transaction amount
    if (refundTypeId === 1201) {
      const transactionAmount = parseFloat(transaction.amount || 0);
      if (transactionAmount > 0) {
        setValue("refundAmount", transactionAmount);
      }
    }
  }, [refundTypeId, transaction.amount, setValue]);

  // Process Refund API
  const { mutate: initiateRefundMutate, isLoading } = useMutation(
    initiateCancellation,
    {
      onSuccess: (response) => {
        if (response?.data?.success) {
          toast.success(
            response.data.message || "Refund initiated successfully"
          );
          setVisible(false);
          reset();
          if (onSuccess) {
            onSuccess();
          }
        } else {
          toast.error(response?.data?.error || "Failed to initiate refund");
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.error || "Error initiating refund");
      },
    }
  );

  const onSubmit = (values) => {
    const selectedRefundType =
      refundTypeOptions.find(
        (item) => String(item.id) === String(values.refundTypeId)
      ) || null;

    const transactionAmount = parseFloat(transaction.amount || 0);

    const payload = {
      transactionId: transaction.id,
      refundTypeId: values.refundTypeId,
      refundTypeName: selectedRefundType?.name || null,
      refundAmount:
        values.refundTypeId === 1201
          ? transactionAmount
          : parseFloat(values.refundAmount || 0),
      refundReason: values.refundReason,
      authUserId: authUserId,
    };

    // Validate partial refund amount
    if (values.refundTypeId === 1202) {
      const refundAmount = parseFloat(values.refundAmount || 0);
      if (refundAmount <= 0) {
        toast.error("Refund amount must be greater than 0");
        return;
      }
      if (refundAmount > transactionAmount) {
        toast.error(
          `Refund amount cannot exceed transaction amount (${transactionAmount})`
        );
        return;
      }
    }

    initiateRefundMutate(payload);
  };

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Initiate Refund</div>
        </div>
      }
      visible={visible}
      onHide={() => {
        setVisible(false);
        reset();
      }}
      className="w-600"
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex flex-column gap-3">
          <div className="mb-3">
            <div className="mb-2">
              <strong>Transaction ID:</strong> {transaction.id}
            </div>
            <div className="mb-2">
              <strong>Transaction Amount:</strong>{" "}
              <CurrencyFormat amount={transaction.amount} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Refund Type <span className="text-danger">*</span>
            </label>
            <Controller
              name="refundTypeId"
              control={control}
              rules={{ required: "Refund type is required" }}
              render={({ field, fieldState }) => (
                <>
                  <Dropdown
                    {...field}
                    options={refundTypeOptions}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select Refund Type"
                    className="w-100"
                  />
                  <div className="p-error">{fieldState.error?.message}</div>
                </>
              )}
            />
          </div>

          {refundTypeId === 1202 && (
            <div className="form-group">
              <label className="form-label">
                Refund Amount <span className="text-danger">*</span>
              </label>
              <Controller
                name="refundAmount"
                control={control}
                rules={{
                  required: "Refund amount is required",
                  min: {
                    value: 0.01,
                    message: "Refund amount must be greater than 0",
                  },
                  max: {
                    value: parseFloat(transaction.amount || 0),
                    message: `Refund amount cannot exceed transaction amount`,
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="Enter refund amount"
                      className="w-100"
                    />
                    <div className="p-error">{fieldState.error?.message}</div>
                  </>
                )}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Refund Reason <span className="text-danger">*</span>
            </label>
            <Controller
              name="refundReason"
              control={control}
              rules={{ required: "Refund reason is required" }}
              render={({ field, fieldState }) => (
                <>
                  <InputTextarea
                    {...field}
                    rows={4}
                    placeholder="Enter refund reason"
                    className="w-100"
                  />
                  <div className="p-error">{fieldState.error?.message}</div>
                </>
              )}
            />
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <Button
              label="Cancel"
              className="btn btn-white"
              onClick={() => {
                setVisible(false);
                reset();
              }}
              type="button"
            />
            <Button
              label="Initiate Refund"
              className="btn btn-primary"
              type="submit"
              loading={isLoading}
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default InitiateTransactionRefundDialog;



