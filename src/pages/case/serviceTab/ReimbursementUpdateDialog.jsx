import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { reimbursementDetailsUpdate,reimbursementPayment, verifyVPA } from "../../../../services/otherService";
import { toast } from 'react-toastify';
import FileChooseUpload from "../../inventory/FileChooseUpload";
import { Dropdown } from "primereact/dropdown";

const ReimbursementUpdateDialog = ({
  aspResultData,
  activeServiceIndex,
  visible,
  setVisible,
  aspRefetch,
}) => {
  
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue
  } = useForm({});

  //Get Payment Method Api
  const { data: paymentData } = useQuery(["getPaymentOptions"], () =>
    reimbursementPayment()
  );

  const paymentMethodId = useWatch({
    control,
    name: "paymentMethodId",
  });

  const [verifiedCustomerName, setVerifiedCustomerName] = useState("");
  const [isMobileNumberVerified, setIsMobileNumberVerified] = useState(false);
  const [originalMobileNumber, setOriginalMobileNumber] = useState(null);
  const [verifiedMobileNumber, setVerifiedMobileNumber] = useState(null);
  const [deleteAttachments, setDeleteAttachments] = useState([]);
  const upiMobileNumber = useWatch({
    control,
    name: "upiLinkedMobileNumber",
  });

  // Clear verified customer name and verification status when mobile number changes
  useEffect(() => {
    // Only clear if mobile number actually changed and doesn't match verified/original
    const isMatchingOriginal = originalMobileNumber && upiMobileNumber === originalMobileNumber;
    const isMatchingVerified = verifiedMobileNumber && upiMobileNumber === verifiedMobileNumber;
    
    // If mobile number changed from what was verified/original, clear verification status
    if (upiMobileNumber && !isMatchingOriginal && !isMatchingVerified) {
      setVerifiedCustomerName("");
      setIsMobileNumberVerified(false);
    }
    
    // If mobile number matches original (edit mode, unchanged), keep verification status
    if (isMatchingOriginal) {
      setIsMobileNumberVerified(true);
      setVerifiedMobileNumber(originalMobileNumber);
    }
    
    // If mobile number matches the verified mobile number, keep verification status
    if (isMatchingVerified) {
      setIsMobileNumberVerified(true);
    }
  }, [upiMobileNumber, originalMobileNumber, verifiedMobileNumber]);
  
  useEffect(()=>{
    if(aspResultData[activeServiceIndex]?.reimbursementDetails?.accountNumber || 
       aspResultData[activeServiceIndex]?.reimbursementDetails?.upiLinkedMobileNumber){
   
      setValue("paymentMethodId",aspResultData[activeServiceIndex]?.reimbursementDetails?.paymentMethodId);
      setValue("accountHolderName",aspResultData[activeServiceIndex]?.reimbursementDetails?.accountHolderName);
      setValue("accountNumber",aspResultData[activeServiceIndex]?.reimbursementDetails?.accountNumber);
      setValue("ifscCode",aspResultData[activeServiceIndex]?.reimbursementDetails?.ifscCode);
      const existingMobileNumber = aspResultData[activeServiceIndex]?.reimbursementDetails?.upiLinkedMobileNumber;
      setValue("upiLinkedMobileNumber", existingMobileNumber);
      setValue("remarks",aspResultData[activeServiceIndex]?.reimbursementDetails?.remarks);
      setValue("amount",aspResultData[activeServiceIndex]?.reimbursementDetails?.amount);
      
      // Store original mobile number and mark as verified if it exists (edit mode)
      if (existingMobileNumber) {
        setOriginalMobileNumber(existingMobileNumber);
        setVerifiedMobileNumber(existingMobileNumber); // Store as verified since it's from DB
        setIsMobileNumberVerified(true); // Existing data is considered pre-verified
      } else {
        setOriginalMobileNumber(null);
        setVerifiedMobileNumber(null);
        setIsMobileNumberVerified(false);
      }
      
      // Verified customer name is not stored in DB, so we don't load it from reimbursement details
      // It will only be set when user verifies the mobile number
    }
  },[])
 
  //Update Api
  const { mutate: reimbursementUpdateMutate, isLoading } = useMutation(
    reimbursementDetailsUpdate
  );

  //Verify VPA API
  const { mutate: verifyVPAMutate, isLoading: isVerifying } = useMutation(verifyVPA);

  const handleVerifyVPA = () => {
    if (!upiMobileNumber || upiMobileNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    verifyVPAMutate(
      { mobileNumber: upiMobileNumber },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            const customerName = res?.data?.customerName || "";
            if (customerName && customerName.trim().length > 0) {
              setVerifiedCustomerName(customerName.trim());
              setIsMobileNumberVerified(true);
              setVerifiedMobileNumber(upiMobileNumber); // Store the verified mobile number
              toast.success("Mobile number verified successfully");
            } else {
              setVerifiedCustomerName("");
              setIsMobileNumberVerified(false);
              setVerifiedMobileNumber(null);
              toast.error("Customer name not found in verification response");
            }
          } else {
            setVerifiedCustomerName("");
            setIsMobileNumberVerified(false);
            setVerifiedMobileNumber(null);
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

  const handleRemoveFile = (fieldName, files) => {
    setValue(fieldName, files);
  };

  const handleDeleteFile = (attachmentId) => {
    setDeleteAttachments([...deleteAttachments, attachmentId]);
  };

  const updateReimbursement = (values) => {
    // Validate mobile number verification for UPI payments
    if (values.paymentMethodId === 4 && values.upiLinkedMobileNumber) {
      // Check if mobile number matches original (edit mode with unchanged number)
      const isOriginalNumber = originalMobileNumber && 
                              values.upiLinkedMobileNumber === originalMobileNumber;
      
      // Check if mobile number matches the verified mobile number
      const isVerifiedNumber = verifiedMobileNumber && 
                              values.upiLinkedMobileNumber === verifiedMobileNumber;
      
      // If not original number and not verified number, require verification
      if (!isOriginalNumber && !isVerifiedNumber) {
        toast.error("Please verify the mobile number before submitting");
        return;
      }
    }

    // Validate bank detail attachments for Bank payment method
    if (values.paymentMethodId === 3) {
      const bankDetailAttachments = aspResultData[activeServiceIndex]?.bankDetailAttachments || [];
      const hasExistingAttachments = bankDetailAttachments.length > 0;
      const allDeleted = hasExistingAttachments && deleteAttachments.length > 0 && 
                        deleteAttachments.length === bankDetailAttachments.length;
      const isRequired = !hasExistingAttachments || allDeleted;
      const newFiles = values.bankDetailAttachments || [];
      const hasNewFiles = Array.isArray(newFiles) && newFiles.length > 0;

      if (isRequired && !hasNewFiles) {
        toast.error("Bank Detail Attachment is required");
        return;
      }
    }

    // Create FormData for file uploads
    const formValues = new FormData();
    formValues.append("activityId", aspResultData[activeServiceIndex]?.activityId);
    const selectedPaymentMethod = paymentData?.data?.data?.find(
      (method) => method.id === values.paymentMethodId
    );
    const paymentMethodName = selectedPaymentMethod?.name || "";
    formValues.append("paymentMethodName", paymentMethodName);
    
    // Append all form values except files
    Object.entries(values).forEach(([key, value]) => {
      if (key === "bankDetailAttachments" && Array.isArray(value) && value.length > 0) {
        // Append files with field name "files" to match uploadMiddleware
        value.forEach((file) => {
          formValues.append("files", file);
        });
      } else if (key !== "bankDetailAttachments") {
        // Append other values normally
        formValues.append(key, value);
      }
    });

    // Handle existing attachments - append attachmentIds to keep or empty array
    // If payment method is UPI, always set isFileOptional = true (bank attachments not applicable)
    if (values.paymentMethodId === 4) {
      // UPI payment method - bank detail attachments not applicable
      formValues.append("isFileOptional", true);
    } else if (values.paymentMethodId === 3) {
      // Bank payment method - handle bank detail attachments
      const bankDetailAttachments = aspResultData[activeServiceIndex]?.bankDetailAttachments || [];
      const hasExistingAttachments = bankDetailAttachments.length > 0;
      
      if (deleteAttachments && deleteAttachments.length > 0) {
        const remainingAttachments = bankDetailAttachments.filter(
          (attachment) => !deleteAttachments.includes(attachment.id)
        );
        if (remainingAttachments.length > 0) {
          remainingAttachments.forEach((attachment) => {
            formValues.append("attachmentIds[]", attachment.id);
          });
          // If there are remaining attachments, make file optional
          formValues.append("isFileOptional", true);
        } else {
          // All existing attachments deleted - file is required
          formValues.append("attachmentIds[]", []);
        }
      } else {
        if (hasExistingAttachments) {
          // There are existing attachments and none deleted - file is optional
          bankDetailAttachments.forEach((attachment) => {
            formValues.append("attachmentIds[]", attachment.id);
          });
          formValues.append("isFileOptional", true);
        }
      }
    }

    reimbursementUpdateMutate(
      formValues,
      {
        onSuccess: (res) => {
          console.log("response tech", res);
          if (res?.data?.success) {
           setVisible(false)
            aspRefetch[ activeServiceIndex]?.refetch();
            reset();
            setVerifiedCustomerName("");
            setIsMobileNumberVerified(false);
            setOriginalMobileNumber(null);
            setVerifiedMobileNumber(null);
            setDeleteAttachments([]);
            toast.success(res?.data?.message);
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
  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Reimbursement</div>
        </div>
      }
      style={{ width: "566px" }}
      visible={visible}
      position={"center"}
      onHide={() => {
        setVisible(false);
        reset();
        setVerifiedCustomerName("");
        setIsMobileNumberVerified(false);
        setOriginalMobileNumber(null);
        setVerifiedMobileNumber(null);
        setDeleteAttachments([]);
      }}
      draggable={false}
      resizable={false}
      closable={true}
    >
      <form
        className="change-activity-form"
        onSubmit={handleSubmit(updateReimbursement)} 
        id="update-reimbursement"
      >
      
          <div className="row row-gap-3_4">
            <div className="col-md-6">
              <div className="form-group">
                <div className="p-field">
                  <label className="form-label required">Payment Method</label>
                  <Controller
                    name="paymentMethodId"
                    control={control}
                    rules={{ required: "Payment Method is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          filter
                          placeholder="Select Payment Type"
                          options={paymentData?.data?.data}
                          optionLabel="name"
                          optionValue="id"
                          onChange={(e) => {
                            field.onChange(e.value);
                          }}
                        />
                        <div className="p-error">
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
            {paymentMethodId== 3 && <div className="col-md-6">
              <div className="form-group">
                <div className="p-field">
                  <label className="form-label required">
                    Account Holder Name
                  </label>
                  <Controller
                    name="accountHolderName"
                    control={control}
                    rules={{ required: "Account Holder Name is required" }}
                    render={({ field }) => (
                      <>
                      <InputText
                        id="name"
                        {...field}
                        placeholder="Enter Name"
                        onKeyPress={(e) => {
                          if (!/^[a-zA-Z\s]$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className={errors.name ? "p-invalid" : ""}
                      />
                      <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                    </>
                    )}
                  />
              
                </div>
              </div>
            </div>}
            {paymentMethodId == 3 && <div className="col-md-6">
              <div className="form-group">
                <div className="p-field">
                  <label className="form-label required">Account Number</label>
                  <Controller
                    name="accountNumber"
                    control={control}
                    rules={{
                      required: "Account Number is required",
                      pattern: {
                        value: /^[a-zA-Z0-9]{1,18}$/,  // Only alphanumeric characters (letters and numbers) with a length of 1 to 16
                        message: "Enter valid account number.",
                      },
                    }}
                    render={({ field }) => (
                      <>
                      <InputText
                        id="name"
                        {...field}
                        placeholder="Enter Account Number"
                        onKeyPress={(e) => {
                          if (!/[0-9A-Za-z]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className={errors.name ? "p-invalid" : ""}
                      />
                      <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                    </>
                    )}
                  />
              
                </div>
              </div>
            </div>}
            {paymentMethodId == 3 && <div className="col-md-6">
              <div className="form-group">
                <div className="p-field">
                  <label className="form-label required">IFSC Code</label>
                  <Controller
                    name="ifscCode"
                    control={control}
                    rules={{
                      required: "IFSC code is required",
                      pattern: {
                        value: /^[A-Z]{4}0\d{6}$/,
                        message: "Enter the Valid Code",
                      },
                    }}
                    render={({ field }) => (
                      <>
                      <InputText
                        id="name"
                        {...field}
                        placeholder="Enter IFSC code"
                        className={errors.name ? "p-invalid" : ""}
                        onKeyPress={(e) => {
                          if (!/^[0-9A-Za-z]$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                    </>
                    )}
                  />
                  {errors.name && (
                    <div className="p-error">{errors.name.message}</div>
                  )}
                </div>
              </div>
            </div>}
            {paymentMethodId == 3 && <div className="col-md-12">
              <div className="form-group">
                <div className="p-field">
                  <label className="form-label">
                    Bank Detail Attachment
                    {(() => {
                      const bankDetailAttachments = aspResultData[activeServiceIndex]?.bankDetailAttachments || [];
                      const hasExistingAttachments = bankDetailAttachments.length > 0;
                      const allDeleted = hasExistingAttachments && deleteAttachments.length > 0 && 
                                        deleteAttachments.length === bankDetailAttachments.length;
                      const isRequired = !hasExistingAttachments || allDeleted;
                      return isRequired ? <span className="text-danger">*</span> : null;
                    })()}
                  </label>
                  <Controller
                    name="bankDetailAttachments"
                    control={control}
                    rules={{
                      validate: (value) => {
                        const bankDetailAttachments = aspResultData[activeServiceIndex]?.bankDetailAttachments || [];
                        const hasExistingAttachments = bankDetailAttachments.length > 0;
                        const allDeleted = hasExistingAttachments && deleteAttachments.length > 0 && 
                                          deleteAttachments.length === bankDetailAttachments.length;
                        const isRequired = !hasExistingAttachments || allDeleted;
                        
                        if (isRequired && (!value || (Array.isArray(value) && value.length === 0))) {
                          return "Bank Detail Attachment is required";
                        }
                        return true;
                      }
                    }}
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <FileChooseUpload
                            multiple={true}
                            field={field}
                            setField={(files) =>
                              handleRemoveFile(field?.name, files)
                            }
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      );
                    }}
                  />
                </div>
                {aspResultData[activeServiceIndex]?.bankDetailAttachments?.length > 0 &&
                  aspResultData[activeServiceIndex]?.bankDetailAttachments
                    ?.filter((files) => !deleteAttachments.includes(files.id))
                    ?.map((files, index) => (
                      <div key={files.id || index} className="d-flex align-items-center gap-3 mt-2">
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            flexGrow: 1,
                          }}
                        >
                          {files.fileName || files.originalName}
                        </div>
                        <div
                          className="p-error"
                          onClick={() => handleDeleteFile(files.id)}
                          style={{ cursor: "pointer" }}
                        >
                          Delete
                        </div>
                      </div>
                    ))}
              </div>
            </div>}
            {paymentMethodId == 4 && <div className="col-md-6">
              <div className="form-group">
                <div className="p-field">
                  <label className="form-label required">UPI Linked Mobile Number</label>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ flex: 1 }}>
                      <Controller
                        name="upiLinkedMobileNumber"
                        control={control}
                        rules={{ 
                          required: "UPI Linked Mobile Number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Enter a valid 10-digit mobile number",
                          },
                        }}
                        render={({ field }) => (
                          <>
                            <InputText
                              id="upiMobileNumber"
                              {...field}
                              placeholder="Enter UPI Linked Mobile No"
                              maxLength={10}
                              keyfilter="num"
                              className={errors.upiLinkedMobileNumber ? "p-invalid" : ""}
                            />
                            <div className="p-error">
                              {errors && errors[field.name]?.message}
                            </div>
                          </>
                        )}
                      />
                    </div>
                    <span
                      onClick={handleVerifyVPA}
                      style={{
                        color: (!upiMobileNumber || upiMobileNumber.length !== 10 || isVerifying) ? "#999" : "#007bff",
                        cursor: (!upiMobileNumber || upiMobileNumber.length !== 10 || isVerifying) ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        pointerEvents: (!upiMobileNumber || upiMobileNumber.length !== 10 || isVerifying) ? "none" : "auto"
                      }}
                    >
                      {isVerifying ? "Verifying..." : "Verify"}
                    </span>
                  </div>
                  {verifiedCustomerName && (
                    <div className="mt-2" style={{ color: "#28a745", fontSize: "14px" }}>
                      <strong>Customer Name:</strong> {verifiedCustomerName}
                    </div>
                  )}
                </div>
              </div>
            </div>}
            <div className="col-md-6">
              <div className="form-group">
                <div className="p-field">
                  <label className="form-label required">
                    Reimbursement Amount
                  </label>
                  <Controller
                    name="amount"
                    control={control}
                    rules={{ required: "Reimbursement Amount is required" }}
                    render={({ field }) => (
                      <>
                      <InputText
                        id="name"
                        {...field}
                        placeholder="Enter Amount"
                        keyfilter="pnum"
                        className={errors.name ? "p-invalid" : ""}
                      />
                           <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                      </>
                    )}
                  />
             
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <div className="p-field">
                  <label className="form-label required">Remarks</label>
                  <Controller
                    name="remarks"
                    control={control}
                    rules={{ required: "Remarks is required" }}
                    render={({ field }) => (
                      <>
                      <InputText
                        id="name"
                        {...field}
                        placeholder="Enter Remarks"
                        className={errors.name ? "p-invalid" : ""}
                      />
                      <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                    </>
                    )}
                  />
              
                </div>
              </div>
            </div>
            <div className="">
              <Button
                className="form-submit-btn mt-2"
                type="submit"
                loading={isLoading}
                form="update-reimbursement"
              >
                Confirm
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
  );
};

export default ReimbursementUpdateDialog;
