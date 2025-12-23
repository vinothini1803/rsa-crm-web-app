import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { useNavigate, useLocation } from "react-router";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCaseData } from '../../../store/slices/caseSlice';
import SelectableButtons from '../../pages/case/serviceTab/SelectableButtons';
import { DialogCloseSmallIcon } from '../../utills/imgConstants';
import { vehiclePatternValidation } from '../../utills/patternValidation';
import { 
  getFormDataCallInitiation, 
  getFormDataDisposition,
  createCallIntiate, 
} from '../../../services/caseService';
import { useSelector } from 'react-redux';
import { CurrentUser } from '../../../store/slices/userSlice';

const CallInitiateDialog = ({callinitiateVisible, setCallInitiateVisible}) => {

  console.log("CallInitiate => ", callinitiateVisible)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(CurrentUser);
  const [getFormData, setGetFormData] = useState(null);
  const { pathname } = useLocation();
  console.log("CallInitiate Path Location => ", pathname);

  const defaultValues = {
    subjectId: [391],
    dispositionId: "",
    selectAccount: "",
    contactName: "",
    contactNumber: "",
    callFromId: "",
    remarks: "",
    vin: "",
    vehicleRegistrationNumber: "",
    channel: "",
    contactLanguage: "",
    currentContactLanguage: "",
    vin_vrn: "",
    mobileNumber: "",
    policyNumber: "",
    caseNumber: ""
  };
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    resetField,
    formState: { errors },
  } = useForm({ defaultValues });

  const subjectId = useWatch({control: control, name: 'subjectId'});
  const dispositionId = useWatch({control: control, name: 'dispositionId'});
  const [fieldEdited, setFieldEdited] = useState(['vin_vrn', 'mobileNumber', 'policyNumber', 'caseNumber']);

  console.log('Form Changes => ', subjectId, dispositionId);

  //Get Form Initall Data
  const {isLoading: getFormDataLoading} = useQuery(["getFormDataCallInitiation"], () => getFormDataCallInitiation({id:''}), {
    onSuccess: (response) => {
      console.log('Form Data Response => ', response?.data?.data);
      if(response?.data?.success) {
        setGetFormData(response?.data?.data);
        setValue('subjectId', [response?.data?.data?.subjects[0]?.id]);
      } else {
        if (response?.data?.error) {
          toast.error(response?.data?.error);
        } else {
          response?.data?.errors?.forEach((el) => toast.error(el));
        }
      }
    },
    refetchOnWindowFocus:false
  });

  const { data: dispositionData } = useQuery(["getFormDataDisposition", subjectId], () => getFormDataDisposition({
    apiType: "dropdown",
    typeId: subjectId,
  }), {
    enabled: subjectId ? true : false,
  });

  const {mutate: createCallInitiateMutate, isLoading: createCallInitiateLoading} = useMutation(createCallIntiate, {
    onSuccess: (response) => {
      console.log('Form Data Response => ', response?.data);
      if(response?.data?.success) {
        setCallInitiateVisible(false);
        toast.success(response?.data?.message);
        reset(defaultValues);
        if(pathname == '/call-initiation') {
          navigate("/call-initiation?refetch=true");
        } else {
          navigate("/call-initiation");
        }
        
      } else {
        if (response?.data?.error) {
          toast.error(response?.data?.error);
        } else {
          response?.data?.errors?.forEach((el) => toast.error(el));
        }
      }
    }
  }); 

  const handleCallFormSubmit = (values) => {
    if(subjectId.includes(392) && dispositionId?.id == 3) {
      if(values?.vin_vrn || values?.mobileNumber || values?.policyNumber || values?.caseNumber){
        dispatch(setCaseData({searchCaseData: {
          subjectId: values?.subjectId[0],
          dispositionId: values?.dispositionId,
          selectAccount: values?.selectAccount,
          ...((values?.vin_vrn) && {
            vin_vrn: values?.vin_vrn,
          }),
          ...(values?.mobileNumber && {
            mobileNumber: values?.mobileNumber
          }),
          ...(values?.policyNumber && {
            policyNumber: values?.policyNumber
          }),
          ...(values?.caseNumber && {
            caseNumber: values?.caseNumber
          }),
          ...(values?.remarks && {
            caseRemarks: values?.remarks
          }),
        }}));
        navigate("/");
        setCallInitiateVisible(false);
      } else {
        toast.error('Please fill at least one field to conduct a search.');
      }
    } else {
      createCallInitiateMutate({
        subjectId: values?.subjectId[0],
        clientId: values?.selectAccount?.id,
        contactName: values?.contactName,
        mobileNumber: values?.contactNumber,
        callFromId: values?.callFromId?.id,
        dispositionId: values?.dispositionId?.id,
        remarks: values?.remarks || null,
      });
    }
  };

  const handleDisposition = (e) => {
    if(e?.value && e?.value?.id !== 3) {
      // resetField("vin");
      // resetField("vehicleRegistrationNumber");
      // resetField("channel");
      // resetField("contactLanguage");
      // resetField('currentContactLanguage');
      resetField('vin_vrn');
      resetField('mobileNumber');
      resetField('policyNumber');
      resetField('caseNumber')
    } else {
      resetField('contactName');
      resetField('contactNumber');
      resetField('callFromId');
      resetField('remarks');
    }
  }

  const handleAccountSelection = (value) => {
    if(value) {
      setFieldEdited([]);
    }
  }

  const handleInputChange = (fieldName, value) => {
    if(value) {
      // Disable and clear other fields
      const otherFields = Object.keys(defaultValues).filter(name => name !== fieldName);
      setFieldEdited(otherFields);
      console.log('otherFields', otherFields);
    } else {
      setFieldEdited([]);
    }
    console.log('Enetered field', fieldName, value);
  };

  /* useEffect(() => {
    getFormDataMutate();
  }, []); */

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
          <div className="dialog-header-title "> Call Initiation</div>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit(handleCallFormSubmit)}
        className={"callform"}
        id="callform"
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
                        /* items={[
                          { id: 1, label: "RSA" },
                          { id: 2, label: "NON-RSA" },
                        ]} */
                        items={getFormData?.subjects?.map((subject) => { return { id: subject.id, label: subject.name}})}
                        onSelect={(ids) => {
                          //handleSubjectSelect(ids);
                          field.onChange(ids);
                          resetField("dispositionId")
                        }}
                        multiple={false}
                        defaultItems={field.value}
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
                        handleDisposition(e);
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
                        handleAccountSelection(e.value);
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
          {dispositionId?.id !== 3 && (
            <>
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
              
            </>
          )}
          
          {subjectId.includes(392) && dispositionId?.id == 3 && (
            <>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Mobile No</label>
                  <Controller
                    name="mobileNumber"
                    control={control}
                    rules={{
                      validate: {
                        matchPattern: (v) => {
                          if(v.length > 0) {
                            return /^([+]\d{2})?\d{10}$/.test(v) || "Mobile Number must be a valid number";
                          } else {
                            return Promise.resolve();
                          }
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
                          placeholder="Eg : 987654321"
                          {...field}
                          keyfilter="alphanum"
                          maxLength={10}
                          disabled={fieldEdited?.includes('mobileNumber') ? true : false}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            handleInputChange('mobileNumber', e.target.value);
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
                  <label className="form-label">Vehicle/VIN Number</label>
                  <Controller
                    name="vin_vrn"
                    control={control}
                    rules={{
                      validate: (value) => {
                        if(value?.length > 0) {
                          const isVIN = /^[A-HJ-NPR-Z0-9]{17}$/i.test(value); // VIN pattern
                          const isVRN = vehiclePatternValidation(value); // VRN pattern

                          return isVIN || isVRN || 'Please enter a valid Vehicle/VIN Number.';
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
                          placeholder="Enter Vehicle/VIN Number"
                          {...field}
                          maxLength={17}
                          keyfilter="alphanum"
                          disabled={(fieldEdited?.includes('vin_vrn')) ? true : false}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                            handleInputChange('vin_vrn', e.target.value);
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
                          disabled={fieldEdited?.includes('policyNumber') ? true : false}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                            handleInputChange('policyNumber', e.target.value);
                          }}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
              {user?.role?.id !== 3 && 
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Case ID</label>
                    <Controller
                      name="caseNumber"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            type="text"
                            className="form-control"
                            placeholder="Eg: CSID38955780"
                            {...field}
                            maxLength={30}
                            keyfilter={/[^ ]$/}
                            disabled={fieldEdited?.includes('caseNumber') ? true : false}
                            onChange={(e) => {
                              field.onChange(e.target.value.toUpperCase());
                              handleInputChange('caseNumber', e.target.value);
                            }}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
              }
            </>
          )}

          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label">Remarks</label>
              <Controller
                name="remarks"
                control={control}
                // rules={{ required: "Remarks is required." }}
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
          form="callform"
          loading={createCallInitiateLoading}
        >
          {subjectId.includes(392) && dispositionId?.id == 3 ? 'Search' : 'Submit'}
        </Button>
      </div>
    </Dialog>
  )
}

export default CallInitiateDialog