import React, { useState } from "react";
import { useRef } from "react";
import { greyUpdateIcon } from "../../../utills/imgConstants";
import { useQuery, useMutation } from "react-query";
import ViewGrid from "../../../components/common/ViewGrid";
import StatusBadge from "../../../components/common/StatusBadge";
import { OverlayPanel } from "primereact/overlaypanel";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { getReimbursementStatus } from "../../../../services/otherService";
import { reimbursementStatusSave } from "../../../../services/otherService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../../store/slices/userSlice";
import AttachmentsDialog from "../../../components/common/AttachmentsDialog";
const ReimbursementTab = ({
  activeServiceIndex,
  aspResultData,
  aspRefetch,
  caseData,
}) => {
  const statusChangePanel = useRef(null);
  const user = useSelector(CurrentUser);
  const permissions = user?.role?.permissions?.map((perm) => perm.name) || [];
  const [bankDetailAttachmentsDialogVisible, setBankDetailAttachmentsDialogVisible] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({});
  console.log("USER", user);
  //Status change API
  const { data: statusData } = useQuery(
    ["caseReminderFormData"],
    () => getReimbursementStatus(),
    {
      enabled: true,
    }
  );
  console.log("=====", statusData?.data?.data);
  const { mutate: reimbursementStatusMutate, isLoading } = useMutation(
    reimbursementStatusSave
  );
  const handleStatusChange = (values) => {
    // console.log("handleAspCancel", values);
    reimbursementStatusMutate(
      {
        activityId: aspResultData[activeServiceIndex]?.activityId,
        statusId: values?.statusId?.id,
        statusName: (values?.statusId?.name).toString(),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            statusChangePanel?.current?.hide();
            aspRefetch[activeServiceIndex]?.refetch();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleViewBankDetailAttachments = () => {
    setBankDetailAttachmentsDialogVisible(true);
  };

  const reimbursementItems = [
    {
      label: "Reimbursement Amount",
      value: aspResultData[activeServiceIndex]?.reimbursementDetails?.amount
        ? `${
            "₹" +
            " " +
            aspResultData[activeServiceIndex]?.reimbursementDetails?.amount
          }`
        : "--",
    },
    {
      label: "Reimbursement Status",
      value: aspResultData[activeServiceIndex]?.reimbursementDetails
        ?.paymentStatus ? (
        <StatusBadge
          text={
            aspResultData[activeServiceIndex]?.reimbursementDetails
              ?.paymentStatus
          }
          statusId={
            aspResultData[activeServiceIndex]?.reimbursementDetails
              ?.paymentStatusId
          }
          statusType="paymentStatusId"
        />
      ) : (
        "--"
      ),
      // Commented out reimbursement status change option
      // ...(aspResultData[activeServiceIndex]?.reimbursementDetails
      //   ?.paymentStatus &&
      // aspResultData[activeServiceIndex]?.reimbursementDetails.paymentStatusId !=
      //   191 &&
      // aspResultData[activeServiceIndex]?.reimbursementDetails.paymentStatusId !=
      //   192 &&
      // user?.levelId != 1045 &&
      // user?.id == caseData?.agentId &&
      // permissions?.includes("activity-reimbursement-status-change-web")
      //   ? {
      //       btnLink: " Change",
      //       btnLinkAction: (e) => {
      //         statusChangePanel?.current?.toggle(e);
      //       },
      //       // btnDisabled:
      //       //   aspResultData[activeServiceIndex]?.reimbursementDetails
      //       //     ?.accountNumber ||
      //       //   aspResultData[activeServiceIndex]?.reimbursementDetails?.upiId
      //       //     ? false
      //       //     : true,
      //       btnDisabled:
      //       aspResultData[activeServiceIndex]?.reimbursementDetails
      //         ?.accountNumber ||
      //       aspResultData[activeServiceIndex]?.reimbursementDetails?.upiLinkedMobileNumber
      //         ? false
      //         : true,
      //     }
      //   : {}),
    },
    {
      label: "Account Holder Name",
      value: aspResultData[activeServiceIndex]?.reimbursementDetails
        ?.accountHolderName
        ? aspResultData[activeServiceIndex]?.reimbursementDetails?.accountHolderName
        : "--",
    },
    {
      label: "Account Number",
      value: aspResultData[activeServiceIndex]?.reimbursementDetails
        ?.accountNumber
        ? aspResultData[activeServiceIndex]?.reimbursementDetails
            ?.accountNumber
        : "--",
    },
    {
      label: "IFSC Code",
      value: aspResultData[activeServiceIndex]?.reimbursementDetails?.ifscCode
        ? aspResultData[activeServiceIndex]?.reimbursementDetails?.ifscCode
        : "--",
    },
    {
      label: "UPI Linked Mobile Number",
      value: aspResultData[activeServiceIndex]?.reimbursementDetails?.upiLinkedMobileNumber
        ? aspResultData[activeServiceIndex]?.reimbursementDetails?.upiLinkedMobileNumber
        : "--",
    },
    ...(aspResultData[activeServiceIndex]?.reimbursementDetails?.paymentMethodId === 3 &&
    aspResultData[activeServiceIndex]?.bankDetailAttachments?.length > 0
      ? [
          {
            label: "Bank Detail Attachments",
            value: (
              <>
                <button
                  onClick={() => handleViewBankDetailAttachments()}
                  className="btn-link"
                >
                  View
                </button>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="service-cost-main-container"></div>
      <div className="service-cost-main-container">
        <div className="service-cost-tab-container">
          <ViewGrid items={reimbursementItems} className="grid-3" />
        </div>
      </div>
      <OverlayPanel ref={statusChangePanel} className="form-overlay-panel">
        <div className="filter-header">
          <div className="filter-title">Reimbursement Status Change</div>
        </div>
        <div className="filter-body">
          <form onSubmit={handleSubmit(handleStatusChange)} id="status-change">
            <div className="d-flex flex-column gap-3_4">
              <div className="form-group">
                <label className="form-label filter-label required">
                  Status{" "}
                </label>
                <Controller
                  name="statusId"
                  control={control}
                  rules={{
                    required: "Status is required.",
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={statusData?.data?.data}
                        optionLabel="name"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary gap-3_4"
                  loading={isLoading}
                  type="submit"
                  form="status-change"
                >
                  Update
                </Button>
              </div>
            </div>
          </form>
        </div>
      </OverlayPanel>
      <AttachmentsDialog
        visible={bankDetailAttachmentsDialogVisible}
        setVisible={setBankDetailAttachmentsDialogVisible}
        attachments={aspResultData[activeServiceIndex]?.bankDetailAttachments?.map((attachment) => ({
          fileName: attachment.fileName,
          originalName: attachment.originalName,
          filePath: attachment.filePath,
          name: attachment.fileName,
        })) || []}
        title="Bank Detail Attachments"
      />
    </>
  );
};

export default ReimbursementTab;
