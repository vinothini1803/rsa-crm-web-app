import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Note from "../../components/common/Note";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import { DropDownBlueIcon } from "../../utills/imgConstants";
import { vehiclePatternValidation } from "../../utills/patternValidation";

const QuickSearch = ({ onSearch, clientOptions, selectedAccount, onSelectedAccount, submitLoading, initialSearchCaseData, showSearchResults, setShowSearchResults }) => {
  const defaultValues = {
    selectAccount: '',
    vin_vrn: '',
    mobileNumber: '',
    policyNumber: '',
    caseNumber: ''
  }
  const user = useSelector(CurrentUser);
  // console.log('Current User => ', user);

  const [fieldEdited, setFieldEdited] = useState(['vin_vrn', 'mobileNumber', 'policyNumber', 'caseNumber']);

  const { handleSubmit, control, setValue, resetField, formState: { errors }, reset } = useForm({ defaultValues });
  
  const onSubmit = (values) => {
    console.log("Search Component values", values);
    if(values?.vin_vrn || values?.mobileNumber || values?.policyNumber || values?.caseNumber){
      console.log("Search Component values condition passed");
      onSearch(values);
    } else {
      toast.error('Please fill at least one field to conduct a search.');
    }
  };

  const handleInputChange = (fieldName, value) => {
    if(value) {
      // Disable and clear other fields
      const otherFields = Object.keys(defaultValues).filter(name => name !== fieldName);
      setFieldEdited(otherFields);
      // console.log('otherFields', otherFields);
    } else {
      setFieldEdited([]);
    }
    console.log('Enetered field', fieldName, value);
  };

  const clearFilterForm = () => {
    resetField("vin_vrn");
    resetField("mobileNumber");
    resetField("policyNumber");
    resetField("caseNumber");
    setValue("selectAccount", '');
    onSelectedAccount('');
    setFieldEdited(['vin_vrn','mobileNumber', 'policyNumber', 'caseNumber']);
    setShowSearchResults(false);
  }

  useEffect(() => {
    if(initialSearchCaseData) {
      resetField("vin_vrn");
      resetField("mobileNumber");
      resetField("policyNumber");
      resetField("caseNumber");
      if(initialSearchCaseData?.selectAccount) {
        setValue("selectAccount", initialSearchCaseData?.selectAccount);
        onSelectedAccount(initialSearchCaseData?.selectAccount);
      }
      if(initialSearchCaseData?.vin_vrn){setValue("vin_vrn", initialSearchCaseData?.vin_vrn)};
      if(initialSearchCaseData?.mobileNumber){setValue("mobileNumber", initialSearchCaseData?.mobileNumber)};
      if(initialSearchCaseData?.policyNumber){setValue("policyNumber", initialSearchCaseData?.policyNumber)};
      if(initialSearchCaseData?.caseNumber){setValue("caseNumber", initialSearchCaseData?.caseNumber)};
      const searchFields = Object.keys(initialSearchCaseData);
      const otherFields = Object.keys(defaultValues).filter(name => !searchFields?.includes(name));
      console.log('Other Fields => ', otherFields);
      setFieldEdited(otherFields)
    }
  }, [initialSearchCaseData]);

  console.log('Edit Field => ', fieldEdited);

  return (
    <div className="custom-card">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex align-items-center gap-3">
          <div className="custom-card-header">Quick Search</div>
          <div className="d-flex align-items-center gap-3">
            <Controller
              name="selectAccount"
              control={control}
              rules={{ required: "Account is required." }}
              render={({ field, fieldState }) => (
                <Dropdown
                  className="account-select"
                  value={field.value}
                  placeholder="Select Account"
                  options={clientOptions}
                  dropdownIcon={(options) => (
                    <DropDownBlueIcon {...options.iconProps} />
                  )}
                  optionLabel="name"
                  onChange={(e) => {
                    field.onChange(e.value);
                    onSelectedAccount(e.value);
                    setFieldEdited([]);
                  }}
                />
              )}
            />
            
            {!selectedAccount && (
              <Note
                type={"danger"}
                icon={true}
                purpose={"note"}
                style={{ minWidth: '250px', padding: "6px 16px 6px 10px" }}
              >
                <div className="account-note">
                  Select Account to search.
                </div>
              </Note>
            )}
          </div>
          {showSearchResults && 
            <div className="ms-auto">
              <Button type="button" className="btn" text severity="danger" onClick={clearFilterForm}>Clear</Button>
            </div>
          }
          
        </div>
      
        <div className="custom-card-body mt-2_3">
          <div className="row row-gap-3_4">
            <div className="col-md-11">
              <div className="row row-gap-3_4">
                <div className="col-md-3">
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
                            disabled={fieldEdited?.includes('mobileNumber') ? true : false}
                            {...field}
                            maxLength={10}
                            keyfilter="pnum"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleInputChange('mobileNumber', e.target.value);
                            }}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
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
                            {...field}
                            placeholder="Enter Vehicle/VIN Number"
                            keyfilter={"alphanum"}
                            maxLength={17}
                            disabled={(fieldEdited?.includes('vin_vrn')) ? true : false}
                            // value={field.value.toUpperCase()} // Convert value to uppercase
                            onChange={(e) => {
                              field.onChange(e.target.value.toUpperCase());
                              handleInputChange('vin_vrn', e.target.value);
                            }} // Convert input to Upper case on change
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                

                <div className="col-md-3">
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
                            disabled={fieldEdited?.includes('policyNumber') ? true : false}
                            {...field}
                            maxLength={30}
                            keyfilter={/[^ ]$/}
                            onChange={(e) => {
                              field.onChange(e.target.value?.toUpperCase());
                              handleInputChange('policyNumber', e.target.value);
                            }}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                {user?.role?.id !== 3 && 
                  <div className="col-md-3">
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
                              disabled={fieldEdited?.includes('caseNumber') ? true : false}
                              {...field}
                              maxLength={30}
                              keyfilter={/[^ ]$/}
                              onChange={(e) => {
                                field.onChange(e.target.value?.toUpperCase());
                                handleInputChange('caseNumber', e.target.value);
                              }}
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>
                }
                
              </div>
            </div>

            <div className="col-md-1 mt-auto">
              <Button type="submit" className="btn btn-primary" loading={submitLoading} disabled={selectedAccount ? false : true}>Search</Button>             
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuickSearch;
