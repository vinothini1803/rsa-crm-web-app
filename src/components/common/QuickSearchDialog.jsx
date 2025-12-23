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
import Note from './Note';
import SelectableButtons from '../../pages/case/serviceTab/SelectableButtons';
import { DialogCloseSmallIcon, DropDownBlueIcon } from '../../utills/imgConstants';
import { vehiclePatternValidation } from '../../utills/patternValidation';
import { client, userClients } from '../../../services/masterServices';
import { 
  getFormDataCallInitiation, 
  getFormDataDisposition,
  createCallIntiate, 
} from '../../../services/caseService';
import { useSelector } from 'react-redux';
import { CurrentUser } from '../../../store/slices/userSlice';

const QuickSearchDialog = ({callinitiateVisible, setCallInitiateVisible}) => {

  console.log("CallInitiate => ", callinitiateVisible)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(CurrentUser);
  const [getFormData, setGetFormData] = useState(null);
  const { pathname } = useLocation();
  console.log("CallInitiate Path Location => ", pathname);

  const defaultValues = {
    selectAccount: "",
    vin_vrn: "",
    mobileNumber: "",
    policyNumber: "",
    caseNumber: "",
    // remarks: "",
  };
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    resetField,
    formState: { errors },
  } = useForm({ defaultValues });

  const [selectedAccount,  setSelectedAccount] = useState();
  const [fieldEdited, setFieldEdited] = useState(['vin_vrn', 'mobileNumber', 'policyNumber', 'caseNumber']);

  // Account Options
  // const {data: clientOptionsData} = useQuery(["getClientOptions"], () => client({
  //   apiType: "dropdown",
  // }), {
  //   refetchOnWindowFocus:false
  // });

  const { data: userClientOptions  } = useQuery(
    ["clientList"],
    () => userClients({ apiType: "dropdown", userId: user?.id}),
    {
      refetchOnWindowFocus:false,
    }
  );

  const handleCallFormSubmit = (values) => {
    if(values?.vin_vrn || values?.mobileNumber || values?.policyNumber || values?.caseNumber){
      dispatch(setCaseData({searchCaseData: {
        selectAccount: selectedAccount,
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
  };


  const handleAccountSelection = (value) => {
    console.log('Select Account =>', value);
    if(value) {
      setSelectedAccount(value);
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
        <>
        <div className="dialog-header">
          <div className="dialog-header-title ">Quick Search</div>
          <div>
            <Dropdown
              className="account-select"
              value={selectedAccount}
              placeholder="Select Account"
              options={userClientOptions?.data?.data}
              dropdownIcon={(options) => (
                <DropDownBlueIcon {...options.iconProps} />
              )}
              optionLabel="name"
              onChange={(e) => {
                // field.onChange(e.value);
                handleAccountSelection(e.value);
              }}
            />
          </div>
          
        </div>
        <div className='col-md-3 mt-2'>
          {!selectedAccount && (
            <Note
              type={"danger"}
              icon={true}
              purpose={"note"}
              style={{ minWidth: '250px', padding: "6px 16px 6px 10px" ,fontSize:"14px"}}
            >
              <div className="account-note">
                Select Account to initiate.
              </div>
            </Note>
          )}
        </div>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(handleCallFormSubmit)}
        className={"callform"}
        id="callform"
      >
        <div className="row row-gap-3_4">
          
          {/* <div className="col-md-6">
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
                      options={clientOptionsData?.data?.data}
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
          </div> */}
          
          
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

          {/* <div className="col-md-12">
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
                      disabled={selectedAccount ? false : true}
                    />
                    <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div> */}
        </div>
      </form>
      <div className={"form-footer d-flex justify-content-end"}>
   
        
        <Button
          className="btn btn-primary"
          type="submit"
          form="callform"
          // loading={createCallInitiateLoading}
        >
          Search
        </Button>
      </div>
    </Dialog>
  )
}

export default QuickSearchDialog