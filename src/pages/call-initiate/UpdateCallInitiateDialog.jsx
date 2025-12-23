import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import SelectableButtons from '../case/serviceTab/SelectableButtons';
import { createCallIntiate, getFormDataCallInitiation, getFormDataDisposition, saveTempCaseFormDetail } from '../../../services/caseService';
import { DialogCloseSmallIcon } from '../../utills/imgConstants';
import { CurrentUser } from '../../../store/slices/userSlice';
// import { vehiclePatternValidation } from '../../utills/patternValidation';

const UpdateCallInitiateDialog = ({callinitiateVisible, setCallInitiateVisible, record, tableRefetch}) => {

  const [getFormData, setGetFormData] = useState(null);
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [originalSubjectId, setOriginalSubjectId] = useState(null);
  const [originalDispositionId, setOriginalDispositionId] = useState(null);
  const [hasCaseId, setHasCaseId] = useState(false);
  const defaultValues = {
    subjectId: [],
    dispositionId: "",
    selectAccount: "",
    contactName: "",
    contactNumber: "",
    callFromId: "",
    remarks: "",
    // vin_vrn: "",
    // policyNumber: "",
  };
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    resetField,
    formState: { errors },
  } = useForm({ defaultValues });

  const navigate = useNavigate();
  const user = useSelector(CurrentUser);
  const subjectId = useWatch({control: control, name: 'subjectId'});
  const dispositionId = useWatch({control: control, name: 'dispositionId'});

  // Identify Vehicle Type (VIN or VRN)
  // const identifyVehicleType = (inputValue) => {
  //   if (inputValue) {
  //     const trimmedValue = inputValue.trim().toUpperCase();
  //     const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/i;
  //     if (trimmedValue.length === 17 && vinPattern.test(trimmedValue)) {
  //       return "VIN";
  //     } else if (vehiclePatternValidation(trimmedValue)) {
  //       return "VRN";
  //     } else {
  //       return "Unknown";
  //     }
  //   }
  // };

  // Edit Call Initate API
  const {mutate: createCallInitiateMutate, isLoading: createCallInitiateLoading} = useMutation(createCallIntiate);

  // Case Creation API
  const {mutate: tempCaseMutate, isLoading: tempCaseMutateLoading} = useMutation(saveTempCaseFormDetail); 

  // Diposition Dropdown API
  const { data: dispositionData, mutate: dispositionMutate } = useMutation(getFormDataDisposition);

  //Get Form Initall Data
  const {isLoading: getFormDataLoading} = useQuery(["getUpdateFormDataCallInitiation", record], () => getFormDataCallInitiation({id:record?.id}), {
    enabled: record ? true : false,
    refetchOnWindowFocus: false,
    onSuccess: (response) => {
      console.log('Form Data Response => ', response?.data?.data);
      if(response?.data?.success) {
        setGetFormData(response?.data?.data);
        const originalSubject = response?.data?.data?.callInitiation?.subjectId;
        const originalDisposition = response?.data?.data?.callInitiation?.dispositionId;
        const existingCaseId = response?.data?.data?.callInitiation?.caseId;
        
        // Store original values
        setOriginalSubjectId(originalSubject);
        setOriginalDispositionId(originalDisposition);
        setHasCaseId(!!existingCaseId); // Set to true if caseId exists
        
        setValue('subjectId', [originalSubject]);
        setValue('contactName', response?.data?.data?.callInitiation?.contactName);
        setValue('contactNumber', response?.data?.data?.callInitiation?.mobileNumber);
        if(response?.data?.data?.callInitiation?.remarks) {
          setValue('remarks', response?.data?.data?.callInitiation?.remarks);
        }
        dispositionMutate({
          apiType: "dropdown",
          typeId: originalSubject,
        }, {
          onSuccess: (res) => {
            if(res?.data?.success) {
              setValue('dispositionId', res?.data?.data?.find((item) => item?.id == originalDisposition));
            } else {
              if (response?.data?.error) {
                toast.error(response?.data?.error);
              } else {
                response?.data?.errors?.forEach((el) => toast.error(el));
              }
            }
          }
        })
        setValue('selectAccount', response?.data?.data?.clients?.find((item)=>item?.id == response?.data?.data?.callInitiation?.clientId));
        setValue('callFromId', response?.data?.data?.callFrom?.find((item)=>item?.id == response?.data?.data?.callInitiation?.callFromId));
        // Set Call From to "Customer" (375) by default if subject is RSA and disposition is Breakdown
        if (originalSubject == 392 && originalDisposition == 3) {
          const customerCallFrom = response?.data?.data?.callFrom?.find((item)=>item?.id == 375);
          if (customerCallFrom) {
            setValue('callFromId', customerCallFrom);
          }
        }
      } else {
        if (response?.data?.error) {
          toast.error(response?.data?.error);
        } else {
          response?.data?.errors?.forEach((el) => toast.error(el));
        }
      }
    },
  });

  

  // Handle Create Case
  const handleCreateCase = (values) => {
    setIsCreatingCase(true);
    // First, update the call initiation record (without vehicle/policy fields)
    createCallInitiateMutate({
      id: record?.id,
      subjectId: values?.subjectId[0],
      clientId: values?.selectAccount?.id,
      contactName: values?.contactName,
      mobileNumber: values?.contactNumber,
      callFromId: values?.callFromId?.id,
      dispositionId: values?.dispositionId?.id,
      remarks: values?.remarks,
    }, {
      onSuccess: (response) => {
        if (response?.data?.success) {
          // After call initiation is updated, create the case with vehicle/policy fields
          // const vehicleType = identifyVehicleType(values?.vin_vrn);
          tempCaseMutate(
            {
              existCustomer: false,
              createdById: user?.id,
              clientId: values?.selectAccount?.id,
              subjectId: 392,
              dispositionId: 3,
              callFromId: 375, // Customer
              channelId: null,
              contactLanguageId: null,
              currentContactLanguageId: null,
              contactName: values?.contactName,
              mobileNumber: values?.contactNumber,
              callInitiationId: record?.id,
              // ...(values?.vin_vrn &&
              //   vehicleType === "VIN" && {
              //     vin: values?.vin_vrn,
              //   }),
              // ...(values?.vin_vrn &&
              //   vehicleType === "VRN" && {
              //     vehicleRegistrationNumber: values?.vin_vrn,
              //   }),
              // ...(values?.policyNumber && {
              //   policyNumber: values?.policyNumber,
              // }),
            },
            {
              onSuccess: (res) => {
                if (res?.data?.success) {
                  setIsCreatingCase(false);
                  setOriginalSubjectId(null);
                  setOriginalDispositionId(null);
                  setHasCaseId(false);
                  setCallInitiateVisible(false);
                  navigate(`/case-creation/${res?.data?.data?.id}`);
                } else {
                  setIsCreatingCase(false);
                  if (res?.data?.error) {
                    toast.error(res?.data?.error);
                  } else {
                    res?.data?.errors?.forEach((el) => toast.error(el));
                  }
                }
              },
              onError: () => {
                setIsCreatingCase(false);
              },
            }
          );
        } else {
          setIsCreatingCase(false);
          if (response?.data?.error) {
            toast.error(response?.data?.error);
          } else {
            response?.data?.errors?.forEach((el) => toast.error(el));
          }
        }
      },
      onError: () => {
        setIsCreatingCase(false);
      },
    });
  };

  // Check if subject and disposition changed to RSA and Breakdown
  const isChangedToRsaBreakdown = () => {
    // If caseId already exists, don't show Create Case button
    if (hasCaseId) {
      return false;
    }
    
    const currentSubject = subjectId?.includes(392);
    const currentDisposition = dispositionId?.id == 3;
    const wasNotRsa = originalSubjectId != 392;
    const wasNotBreakdown = originalDispositionId != 3;
    
    // Only enable create case if changed FROM something else TO RSA and Breakdown
    return currentSubject && currentDisposition && wasNotRsa && wasNotBreakdown;
  };

  // Handle Form Submit
  const handleCallFormSubmit = (values) => {
    // Check if subject changed to RSA (392) and disposition changed to Breakdown (3)
    if (isChangedToRsaBreakdown()) {
      handleCreateCase(values);
    } else {
      createCallInitiateMutate({
        id: record?.id,
        subjectId: values?.subjectId[0],
        clientId: values?.selectAccount?.id,
        contactName: values?.contactName,
        mobileNumber: values?.contactNumber,
        callFromId: values?.callFromId?.id,
        dispositionId: values?.dispositionId?.id,
        remarks: values?.remarks,
      }, {
          onSuccess: (response) => {
          console.log('Form Data Response => ', response?.data);
          if(response?.data?.success) {
            setCallInitiateVisible(false);
            toast.success(response?.data?.message);
            reset(defaultValues);
            setOriginalSubjectId(null);
            setOriginalDispositionId(null);
            setHasCaseId(false);
            tableRefetch();
          } else {
            if (response?.data?.error) {
              toast.error(response?.data?.error);
            } else {
              response?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        }
      });
    }
  };

  /* useEffect(() => {
    if(getFormData) {
      setValue('dispositionId', getFormData?.callInitiation?.dispositionId);
      setValue('selectAccount', getFormData?.callInitiation?.clientId);
      setValue('callFromId', getFormData?.callInitiation?.callFromId);
    }
  }, [getFormData]) */

  return (
    <Dialog
      visible={callinitiateVisible}
      position={"bottom"}
      className="w-574 border-header call-initaite-dialog"
      onHide={() => setCallInitiateVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
      header={
        <div className="dialog-header">
          <div className="dialog-header-title ">Edit Call Initiation</div>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit(handleCallFormSubmit)}
        className={"callform"}
        id="editCallform"
      >
        <div className="row row-gap-3_4">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Subject</label>
              <Controller
                name="subjectId"
                control={control}
                rules={{ required: "Subject is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <div className="subject-container">
                      <SelectableButtons
                        items={getFormData?.subjects?.map((subject) => { return { id: subject.id, label: subject.name}})}
                        onSelect={(ids) => {
                          console.log('ids', ids);
                          field.onChange(ids);
                          resetField("dispositionId");
                          // Reset vin_vrn and policyNumber when subject changes
                          // resetField("vin_vrn");
                          // resetField("policyNumber");
                          // // Set Call From to "Customer" (375) when subject is RSA
                          // if (ids?.includes(392)) {
                          //   const customerCallFrom = getFormData?.callFrom?.find((item)=>item?.id == 375);
                          //   if (customerCallFrom) {
                          //     setValue('callFromId', customerCallFrom);
                          //   }
                          // }
                          dispositionMutate({
                            apiType: "dropdown",
                            typeId: ids[0],
                          })
                        }}
                        multiple={false}
                        defaultItems={field?.value}
                        type="button"
                      />
                    </div>
                    {errors && (
                      <div className="p-error">
                        {errors[field.name]?.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Disposition</label>
              <Controller
                name="dispositionId"
                control={control}
                rules={{ required: "Disposition is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      filter
                      placeholder="Select Disposition "
                      className="form-control-select"
                      options={dispositionData?.data?.data}
                      optionLabel="name"
                      onChange={(e) => {
                        field.onChange(e.value);
                        // Set Call From to "Customer" (375) when subject is RSA and disposition is Breakdown
                        if (subjectId?.includes(392) && e.value?.id == 3) {
                          const customerCallFrom = getFormData?.callFrom?.find((item)=>item?.id == 375);
                          if (customerCallFrom) {
                            setValue('callFromId', customerCallFrom);
                          }
                        }
                      }}
                      resetFilterOnHide={true}
                    />
                    {errors && (
                      <div className="p-error">
                        {errors[field.name]?.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Account</label>
              <Controller
                name="selectAccount"
                control={control}
                rules={{ required: "Accounts is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      filter
                      placeholder="Select Account"
                      className="form-control-select"
                      options={getFormData?.clients}
                      optionLabel="name"
                      onChange={(e) => {
                        field.onChange(e.value);
                      }}
                      resetFilterOnHide={true}
                    />
                    <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Contact Name</label>
              <Controller
                name="contactName"
                control={control}
                rules={{ 
                  required: "Contact Name is required.",
                  validate: {
                    matchPattern: (v) =>
                      /^[a-zA-Z\s'-]+$/.test(v) ||
                      "Contact Name must be a Alphabets",
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    {" "}
                    <InputText
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      placeholder="Enter Contact Name"
                    />
                    <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Contact Number</label>
              <Controller
                name="contactNumber"
                control={control}
                rules={{ 
                  required: "Contact Number is required.",
                  validate: {
                    matchPattern: (v) => {
                      if(v.length > 0) {
                        return /^([+]\d{2})?\d{10}$/.test(v) || "Contact Number must be a valid number";
                      } else {
                        return Promise.resolve();
                      }
                    }
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    {" "}
                    <InputText
                      {...field}
                      // keyfilter="pint"
                      maxLength="10"
                      keyfilter="alphanum"
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      placeholder="Enter Contact Number"
                    />
                    <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label required">Call From</label>
              <Controller
                name="callFromId"
                control={control}
                rules={{ required: "Call from is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      filter
                      placeholder="Select Call From"
                      className="form-control-select"
                      options={getFormData?.callFrom}
                      optionLabel="name"
                      resetFilterOnHide={true}
                      onChange={(e) => field.onChange(e.value)}
                    />
                    <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
          {/* {isChangedToRsaBreakdown() && (
            <>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Vehicle/VIN Number</label>
                  <Controller
                    name="vin_vrn"
                    control={control}
                    rules={{
                      validate: (value) => {
                        if (value?.length > 0) {
                          const isVIN = /^[A-HJ-NPR-Z0-9]{17}$/i.test(value);
                          const isVRN = vehiclePatternValidation(value);
                          const isBharatFormat1 = /^[A-Z]\d[A-Z]\d{5}$/i.test(value);
                          const isBharatFormat2 = /^\d{2}[A-Z]{2}\d{4}[A-Z]$/i.test(value);

                          return (
                            isVIN ||
                            isVRN ||
                            isBharatFormat1 ||
                            isBharatFormat2 ||
                            "Please enter a valid Vehicle/VIN Number."
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          type="text"
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          {...field}
                          placeholder="Enter Vehicle/VIN Number"
                          keyfilter={"alphanum"}
                          maxLength={17}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
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
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Policy / Membership No</label>
                  <Controller
                    name="policyNumber"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          type="text"
                          className="form-control"
                          placeholder="Eg : 9876 54321 8941"
                          {...field}
                          maxLength={30}
                          keyfilter={/[^ ]$/}
                          onChange={(e) => {
                            field.onChange(e.target.value?.toUpperCase());
                          }}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            </>
          )} */}
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label required">Remarks</label>
              <Controller
                name="remarks"
                control={control}
                rules={{ required: "Remarks is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextarea
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      placeholder="Enter Remarks"
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
      </form>
      <div className={"form-footer"}>
        <Button
          className="btn btn-primary"
          type="submit"
          form="editCallform"
          loading={isChangedToRsaBreakdown() ? (createCallInitiateLoading || tempCaseMutateLoading) : createCallInitiateLoading}
        >
          {isChangedToRsaBreakdown() ? "Create Case" : "Update"}
        </Button>
      </div>
    </Dialog>
  )
}

export default UpdateCallInitiateDialog