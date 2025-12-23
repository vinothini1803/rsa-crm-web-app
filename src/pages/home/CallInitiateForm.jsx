import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import Note from "../../components/common/Note";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import { DropDownBlueIcon } from "../../utills/imgConstants";
import { vehiclePatternValidation } from "../../utills/patternValidation";
import SelectableButtons from "../case/serviceTab/SelectableButtons";
import {
  getFormDataCallInitiation,
  getFormDataDisposition,
  createCallIntiate,
} from "../../../services/caseService";
import { useNavigate } from "react-router";
import {
  checkSupport,
  firebaseToken,
  onMessageListener,
} from "../../../services/firebaseService";
import { SearchCall } from "../../../store/slices/searchSlice";

const CallInitiateForm = ({
  onSearch,
  clientOptions,
  selectedAccount,
  onSelectedAccount,
  submitLoading,
  initialSearchCaseData,
  showSearchResults,
  setShowSearchResults,
}) => {
  const defaultValues = {
    selectAccount: "",
    subjectId: [],
    dispositionId: "",
    contactName: "",
    contactNumber: "",
    callFromId: "",
    vin_vrn: "",
    mobileNumber: "",
    policyNumber: "",
    caseNumber: "",
    remarks: "",
  };
  const {
    handleSubmit,
    control,
    setValue,
    resetField,
    formState: { errors },
    reset,
    getValues,
  } = useForm({ defaultValues });
  const navigate = useNavigate();
  const user = useSelector(CurrentUser);
  const [getFormData, setGetFormData] = useState(null);
  const [getAccount, setGetAccount] = useState(null);
  const searchField = ["vin_vrn", "mobileNumber", "policyNumber", "caseNumber"];
  const [fieldEdited, setFieldEdited] = useState([
    "vin_vrn",
    "mobileNumber",
    "policyNumber",
    "caseNumber",
  ]);
  const subjectId = useWatch({ control: control, name: "subjectId" });
  const dispositionId = useWatch({ control: control, name: "dispositionId" });
  const [subjectIdSelect, setSubjectIdSelect] = useState();
  const permissions = user?.role?.permissions?.map((perm) => perm.name) || [];
  //console.log('Current User => ', subjectId);
  // console.log('selectAccountId =>', selectedAccount);
  const searchData = useSelector(SearchCall);
  // console.log("selectAccountId =>", searchData);
  //Get Form Initall Data API
  const { isLoading: getFormDataLoading } = useQuery(
    ["getFormDataCallInitiation"],
    () => getFormDataCallInitiation({ id: "" }),
    {
      onSuccess: (response) => {
        // console.log('Form Data Response => ', response?.data?.data);
        if (response?.data?.success) {
          setGetFormData(response?.data?.data);
          // setValue('subjectId', [response?.data?.data?.subjects[0]?.id]);
          sessionStorage.setItem(
            "formData",
            JSON.stringify(response.data.data)
          );
          // console.log(
          //   "Storing formData in sessionStorage:",
          //   response.data.data
          // );
        } else {
          if (response?.data?.error) {
            toast.error(response?.data?.error);
          } else {
            response?.data?.errors?.forEach((el) => toast.error(el));
          }
        }
      },
      refetchOnWindowFocus: false,
    }
  );
  // Get Dispostion Dropdown Options API
  const { data: dispositionData } = useQuery(
    ["getFormDataDisposition", subjectId],
    () =>
      getFormDataDisposition({
        apiType: "dropdown",
        typeId: subjectId,
      }),
    {
      enabled: subjectId.length > 0 ? true : false,
    }
  );
  // console.log("+++++++++", dispositionData?.data?.data);

  // Create Call Initiate API
  const {
    mutate: createCallInitiateMutate,
    isLoading: createCallInitiateLoading,
  } = useMutation(createCallIntiate, {
    onSuccess: (response) => {
      // console.log("Form Data Response => ", response?.data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        reset(defaultValues);
        navigate("/call-initiation");
      } else {
        if (response?.data?.error) {
          toast.error(response?.data?.error);
        } else {
          response?.data?.errors?.forEach((el) => toast.error(el));
        }
      }
    },
  });

  // Handle Disposition
  const handleDisposition = (e) => {
    if (e?.value && e?.value?.id !== 3) {
      resetField("vin_vrn");
      resetField("mobileNumber");
      resetField("policyNumber");
      resetField("caseNumber");
    } else {
      resetField("contactName");
      resetField("contactNumber");
      resetField("callFromId");
      resetField("remarks");
    }
  };

  const onSubmit = (values) => {
    // console.log("Search Component values", values);
    if (subjectId.includes(392) && dispositionId?.id == 3) {
      if (
        values?.vin_vrn ||
        values?.mobileNumber ||
        values?.policyNumber ||
        values?.caseNumber
      ) {
        // console.log("Search Component values condition passed");
        onSearch({ ...values, isSearchFromCallInitiation: true });
      } else {
        toast.error("Please fill at least one field to conduct a search.");
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

  //   const handleQuickSearch = (payload) => {
  //     console.log("payload", payload, JSON.parse(payload?.data?.searchData))
  //     const searchCall = JSON.parse(payload?.data?.searchData)
  //     console.log("searchCall", searchCall)
  //     const fromId = parseInt(payload?.from, 10);

  //     // const matchedAccount = getFormData?.clients?.find(
  //     //   (account) => account.name == searchCall?.client
  //     // );

  //     // const matchedDisposition = dispositionData?.data?.data?.find(
  //     //   (account) => account.name == searchCall?.disposition
  //     // );
  //     console.log("getFormData", fromId)
  //      console.log("====>>>>", dispositionData?.data?.data?.find(
  //       (account) => account.name == searchCall?.disposition
  //     ))

  //     setValue("selectAccount", getFormData?.clients?.find(
  //       (account) => account.name == searchCall?.client
  //     ) || defaultValues.selectAccount);
  //     const matchedSubject = getFormData?.subjects?.find(
  //       (account) => account.name == searchCall?.subject
  //     );
  //   setValue("subjectId",  matchedSubject ? [matchedSubject?.id] : []);
  //   setSubjectIdSelect(matchedSubject?.id)
  //   // setValue("dispositionId", dispositionData?.data?.data?.find(
  //   //   (account) => account.name == searchCall?.disposition
  //   // ) || defaultValues.dispositionId);
  //   setValue("dispositionId", {
  //     "id": 3,
  //     "name": "Breakdown"
  // })
  //   setValue("contactName", searchCall?.contactName || defaultValues.contactName);
  //   setValue("contactNumber", searchCall?.mobileNumber || defaultValues.mobileNumber);
  //   setValue("callFromId", "");
  //   setValue("vin_vrn", searchCall?.vin_vrn || defaultValues.vin_vrn);
  //   setValue("mobileNumber", searchCall?.contactNumber);
  //   setValue("policyNumber", searchCall?.policyNumber || defaultValues.policyNumber);
  //   setValue("caseNumber", searchCall?.caseNumber || defaultValues.caseNumber);
  //   setValue("remarks", searchCall?.remarks || defaultValues.remarks);
  //   const allValues = getValues();
  //   console.log("=====>>>>", allValues)
  //   onSearch({...allValues, isSearchFromCallInitiation: true});
  //   }

  // const handleNavigate = () => {

  //   sessionStorage.setItem('formData', JSON.stringify(getFormData));

  // }
  // handleNavigate();
  //   useEffect(() => {

  //     const storedSearchData = sessionStorage.getItem("searchData");
  //     const storedFormData = sessionStorage.getItem('formData');
  // console.log("storedFormData", storedFormData)
  //     if (searchData) {
  //       //const searchData = JSON.parse(storedSearchData);
  //       const formData = JSON.parse(storedFormData);
  //       const clients = formData?.clients || [];
  //       console.log("Clients:", clients);
  //       // Set form values using the `setValue` function
  //       const matchedAccount = clients?.find(account => account.name === searchData?.client);

  //       console.log("matchedAccount", matchedAccount)
  //       setValue("selectAccount", matchedAccount || defaultValues.selectAccount);
  //       //setValue("selectAccount", {id:2,name:"Renault"} || defaultValues.selectAccount);
  //       const matchedSubject = getFormData?.subjects?.find(account => account.name === searchData?.subject);
  //       //setValue("subjectId", matchedSubject ? [matchedSubject?.id] : []);
  //       setValue("subjectId", [392]);
  //       //setSubjectIdSelect(matchedSubject?.id);
  //       setValue("dispositionId", { id: 3, name: "Breakdown" });
  //       setValue("contactName", searchData?.contactName || defaultValues.contactName);
  //       setValue("contactNumber", searchData?.mobileNumber || defaultValues.mobileNumber);
  //       setValue("callFromId", "");
  //       setValue("vin_vrn", searchData?.vin_vrn || defaultValues.vin_vrn);
  //       const mobileNumber = searchData?.contactNumber;
  // const last10Digits = mobileNumber ? mobileNumber.slice(-10) : "";
  //       setValue("mobileNumber", last10Digits);
  //       setValue("policyNumber", searchData?.policyNumber || defaultValues.policyNumber);
  //       setValue("caseNumber", searchData?.caseNumber || defaultValues.caseNumber);
  //       setValue("remarks", searchData?.remarks || defaultValues.remarks);

  //       // Trigger search after form is populated (optional, depending on your flow)
  //       const allValues = getValues();
  //       console.log("All form values after setting:", allValues);
  //       onSearch({ ...allValues, isSearchFromCallInitiation: true });
  //     }
  //   }, []);

  // const handleSocketMessage = (payload) => {
  //   console.log("Socket Message", payload);

  //   if (payload?.data?.searchData) {
  //     handleNavigate(payload)

  //   }
  // }
  // useEffect(() => {
  //   // Request notification permission

  //   // Handle incoming messages
  //   const unSubscribe = onMessageListener(handleSocketMessage);
  //   // Ensure unSubscribe is a function before attempting to call it
  //   if (typeof unSubscribe === 'function') {
  //     return () => {
  //       unSubscribe(); // Call the cleanup function directly
  //     };
  //   }

  //   // If unSubscribe is not a function, log a warning
  //   console.warn('Unexpected value returned by onMessageListener:', unSubscribe);

  // }, [getFormData, dispositionData]);

  const handleInputChange = (fieldName, value) => {
    if (value) {
      // Disable and clear other fields
      // const otherFields = Object.keys(defaultValues).filter(name => name !== fieldName);
      const otherFields = searchField?.filter((name) => name !== fieldName);
      setFieldEdited(otherFields);
      // console.log('otherFields', otherFields);
    } else {
      setFieldEdited([]);
    }
    // console.log("Enetered field", fieldName, value);
  };

  const clearFilterForm = () => {
    resetField("contactName");
    resetField("contactNumber");
    resetField("callFromId");
    resetField("remarks");
    resetField("vin_vrn");
    resetField("mobileNumber");
    resetField("policyNumber");
    resetField("caseNumber");
    resetField("subjectId");
    resetField("dispositionId");
    setValue("selectAccount", "");
    // setValue('subjectId', []);
    onSelectedAccount("");
    setFieldEdited(searchField);
    setShowSearchResults(false);
  };

  useEffect(() => {
    if (initialSearchCaseData) {
      // console.log("Initial Search Data=>", initialSearchCaseData);
      resetField("vin_vrn");
      resetField("mobileNumber");
      resetField("policyNumber");
      resetField("caseNumber");
      resetField("subjectId");
      resetField("dispositionId");
      // if(initialSearchCaseData?.selectAccount) {
      //   setValue("selectAccount", initialSearchCaseData?.selectAccount);
      //   onSelectedAccount(initialSearchCaseData?.selectAccount);
      //   setValue('subjectId', [392]);
      //   setValue("dispositionId", dispositionData?.data?.data?.some((item)=>item?.id == 3) ? dispositionData?.data?.data?.find((item)=>item?.id == 3) : undefined);
      // }
      // if(initialSearchCaseData?.vin_vrn){setValue("vin_vrn", initialSearchCaseData?.vin_vrn)};
      // if(initialSearchCaseData?.mobileNumber){setValue("mobileNumber", initialSearchCaseData?.mobileNumber)};
      // if(initialSearchCaseData?.policyNumber){setValue("policyNumber", initialSearchCaseData?.policyNumber)};
      // if(initialSearchCaseData?.caseNumber){setValue("caseNumber", initialSearchCaseData?.caseNumber)};
      const incomingSearchFields = Object.keys(initialSearchCaseData);
      const otherFields = searchField.filter(
        (name) => !incomingSearchFields?.includes(name)
      );
      // console.log("Other Fields => ", otherFields);
      setFieldEdited(otherFields);
    }
  }, [initialSearchCaseData]);

  // console.log('Edit Field => ', fieldEdited);

  if (!permissions?.includes("call-initiation-creation")) {
    return null;
  }

  return (
    <div className="custom-card">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex align-items-center gap-3">
          <div className="custom-card-header">Call Initiation</div>
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
                  options={getFormData?.clients}
                  dropdownIcon={(options) => (
                    <DropDownBlueIcon {...options.iconProps} />
                  )}
                  optionLabel="name"
                  onChange={(e) => {
                    field.onChange(e.value);
                    onSelectedAccount(e.value);
                    setFieldEdited(
                      fieldEdited?.length == searchField?.length
                        ? []
                        : fieldEdited
                    );
                  }}
                />
              )}
            />

            {!selectedAccount && (
              <Note
                type={"danger"}
                icon={true}
                purpose={"note"}
                style={{ minWidth: "250px", padding: "6px 16px 6px 10px" }}
              >
                <div className="account-note">Select Account to initiate.</div>
              </Note>
            )}
          </div>
        </div>

        <div className="custom-card-body mt-2_3">
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="row row-gap-3_4">
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="form-label required">Subject</label>
                    <Controller
                      name="subjectId"
                      control={control}
                      rules={{ required: "Subject is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <div className="subject-container ">
                            <SelectableButtons
                              items={getFormData?.subjects?.map((subject) => {
                                return { id: subject.id, label: subject.name };
                              })}
                              onSelect={(ids) => {
                                //handleSubjectSelect(ids);
                                field.onChange(ids);
                                resetField("dispositionId");
                              }}
                              multiple={false}
                              defaultItems={field.value}
                              type="button"
                              disabled={selectedAccount ? false : true}
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
                <div className="col-md-2">
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
                            disabled={selectedAccount ? false : true}
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
                {dispositionId?.id !== 3 && (
                  <>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label className="form-label required">
                          Contact Name
                        </label>
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
                                disabled={selectedAccount ? false : true}
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
                        <label className="form-label required">
                          Contact Number
                        </label>
                        <Controller
                          name="contactNumber"
                          control={control}
                          rules={{
                            required: "Contact Number is required.",
                            validate: {
                              matchPattern: (v) => {
                                if (v.length > 0) {
                                  return (
                                    /^([+]\d{2})?\d{10}$/.test(v) ||
                                    "Contact Number must be a valid number"
                                  );
                                } else {
                                  return Promise.resolve();
                                }
                              },
                            },
                          }}
                          render={({ field, fieldState }) => (
                            <>
                              {" "}
                              <InputText
                                {...field}
                                // keyfilter="pint"
                                maxLength="10"
                                keyfilter="pnum"
                                className={`form-control ${
                                  fieldState.error ? "p-invalid" : ""
                                }`}
                                placeholder="Enter Contact Number"
                                disabled={selectedAccount ? false : true}
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
                                disabled={selectedAccount ? false : true}
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
                    <div className="col-md-2">
                      <div className="form-group">
                        <label className="form-label">Mobile No</label>
                        <Controller
                          name="mobileNumber"
                          control={control}
                          rules={{
                            validate: {
                              matchPattern: (v) => {
                                if (v.length > 0) {
                                  return (
                                    /^([+]\d{2})?\d{10}$/.test(v) ||
                                    "Mobile Number must be a valid number"
                                  );
                                } else {
                                  return Promise.resolve();
                                }
                              },
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
                                disabled={
                                  fieldEdited?.includes("mobileNumber")
                                    ? true
                                    : false
                                }
                                {...field}
                                maxLength={10}
                                keyfilter="pnum"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  handleInputChange(
                                    "mobileNumber",
                                    e.target.value
                                  );
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
                              if (value?.length > 0) {
                                const isVIN = /^[A-HJ-NPR-Z0-9]{17}$/i.test(
                                  value
                                ); // VIN pattern
                                const isVRN = vehiclePatternValidation(value); // VRN pattern
                                const isBharatFormat1 =
                                  /^[A-Z]\d[A-Z]\d{5}$/i.test(value); // M6L64492 format
                                const isBharatFormat2 =
                                  /^\d{2}[A-Z]{2}\d{4}[A-Z]$/i.test(value);

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
                                disabled={
                                  fieldEdited?.includes("vin_vrn")
                                    ? true
                                    : false
                                }
                                // value={field.value.toUpperCase()} // Convert value to uppercase
                                onChange={(e) => {
                                  field.onChange(e.target.value.toUpperCase());
                                  handleInputChange("vin_vrn", e.target.value);
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
                        <label className="form-label">
                          Policy / Membership No
                        </label>
                        <Controller
                          name="policyNumber"
                          control={control}
                          render={({ field, fieldState }) => (
                            <>
                              <InputText
                                type="text"
                                className="form-control"
                                placeholder="Eg : 9876 54321 8941"
                                disabled={
                                  fieldEdited?.includes("policyNumber")
                                    ? true
                                    : false
                                }
                                {...field}
                                maxLength={30}
                                keyfilter={/[^ ]$/}
                                onChange={(e) => {
                                  field.onChange(e.target.value?.toUpperCase());
                                  handleInputChange(
                                    "policyNumber",
                                    e.target.value
                                  );
                                }}
                              />
                            </>
                          )}
                        />
                      </div>
                    </div>
                    {user?.role?.id !== 3 && (
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
                                  disabled={
                                    fieldEdited?.includes("caseNumber")
                                      ? true
                                      : false
                                  }
                                  {...field}
                                  maxLength={30}
                                  keyfilter={/[^ ]$/}
                                  onChange={(e) => {
                                    field.onChange(
                                      e.target.value?.toUpperCase()
                                    );
                                    handleInputChange(
                                      "caseNumber",
                                      e.target.value
                                    );
                                  }}
                                />
                              </>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="col-md-6">
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
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                className="btn btn-primary"
                loading={submitLoading}
                disabled={selectedAccount ? false : true}
              >
                {subjectId.includes(392) && dispositionId?.id == 3
                  ? "Search"
                  : "Submit"}
              </Button>
              {showSearchResults && (
                <Button
                  type="button"
                  className="btn"
                  text
                  severity="danger"
                  onClick={clearFilterForm}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CallInitiateForm;
