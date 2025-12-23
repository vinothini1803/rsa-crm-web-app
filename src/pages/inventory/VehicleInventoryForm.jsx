import React, { useRef, useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Controller, useFormContext } from "react-hook-form";
import FileChooseUpload from "./FileChooseUpload";
import { FileUpload } from "primereact/fileupload";
import {
  FileFolderIcon,
  CalendarClockIcon,
  CalendarTimeIcon,
} from "../../utills/imgConstants";
import moment from "moment";

const VehicleInventoryForm = ({ caseFullData, typeOfId }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const fileUploadRef = useRef(null);
  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    return chooseButton;
  };
  const [initalFlag, setInitalFlag] = useState(true);
  // let reachedMinDate = new Date();
  const [reachedMinDate, setReachedMinDate] = useState(null);

  useEffect(() => {
    if (caseFullData) {
      if (caseFullData?.caseDetail?.caseCreatedDateTime && typeOfId == 162) {
        setReachedMinDate(
          moment(
            caseFullData?.caseDetail?.caseCreatedDateTime,
            "DD/MM/YYYY hh:mm A"
          ).toDate()
        );
      } else {
        // console.log(
        //   "caseFullData?.aspReachedToBreakdownAt",
        //   caseFullData?.aspReachedToBreakdownAt
        // );
        setReachedMinDate(
          moment(
            caseFullData?.aspReachedToBreakdownAt
              ? caseFullData?.aspReachedToBreakdownAt
              : caseFullData?.caseDetail?.caseCreatedDateTime,
            "DD/MM/YYYY hh:mm A"
          ).toDate()
        );
      }
    }
  }, [caseFullData]);

  // Handle Remove Attached files
  const handleRemoveFile = (field, files) => {
    setValue(field, files);
  };

  return (
    <div className="row row-gap-3_4">
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Hub Caps</label>
          <Controller
            name="hubCaps"
            control={control}
            rules={{ required: "Hub Caps is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  keyfilter="int"
                  placeholder="Enter Hub Caps"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                />
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">Spare Wheel</label>
          <Controller
            name="spareWheel"
            control={control}
            rules={{ required: "Spare Wheel is required." }}
            render={({ field, fieldState }) => (
              <>
                <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radio_available"
                      {...field}
                      value="true"
                      checked={field.value === "true"}
                    />
                    <label
                      htmlFor="radio_available"
                      className="common-radio-label"
                    >
                      Available
                    </label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radio_not_available"
                      {...field}
                      value="false"
                      checked={field.value === "false"}
                    />
                    <label
                      htmlFor="radio_not_available"
                      className="common-radio-label"
                    >
                      Not Available
                    </label>
                  </div>
                </div>
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">Jack & Jack Rod</label>
          <Controller
            name="jackAndJackRoad"
            control={control}
            rules={{ required: "Jack & Jack Rod is required." }}
            render={({ field, fieldState }) => (
              <>
                <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioJackAvailable"
                      {...field}
                      value="true"
                      checked={field.value === "true"}
                    />
                    <label
                      htmlFor="radioJackAvailable"
                      className="common-radio-label"
                    >
                      Available
                    </label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioJackNotAvailable"
                      {...field}
                      value="false"
                      checked={field.value === "false"}
                    />
                    <label
                      htmlFor="radioJackNotAvailable"
                      className="common-radio-label"
                    >
                      Not Available
                    </label>
                  </div>
                </div>
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">Audio System</label>
          <Controller
            name="audioSystem"
            control={control}
            rules={{ required: "Audio System is required." }}
            render={({ field, fieldState }) => (
              <>
                <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioAudioAvailable"
                      {...field}
                      value="true"
                      checked={field.value === "true"}
                    />
                    <label
                      htmlFor="radioAudioAvailable"
                      className="common-radio-label"
                    >
                      Available
                    </label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioAudioNotAvailable"
                      {...field}
                      value="false"
                      checked={field.value === "false"}
                    />
                    <label
                      htmlFor="radioAudioNotAvailable"
                      className="common-radio-label"
                    >
                      Not Available
                    </label>
                  </div>
                </div>
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">Reverse Parking System</label>
          <Controller
            name="reverseParkingSystem"
            control={control}
            rules={{ required: "Reverse Parking System is required." }}
            render={({ field, fieldState }) => (
              <>
                <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioParkingAvailable"
                      {...field}
                      value="true"
                      checked={field.value === "true"}
                    />
                    <label
                      htmlFor="radioParkingAvailable"
                      className="common-radio-label"
                    >
                      Available
                    </label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioParkingNotAvailable"
                      {...field}
                      value="false"
                      checked={field.value === "false"}
                    />
                    <label
                      htmlFor="radioParkingNotAvailable"
                      className="common-radio-label"
                    >
                      Not Available
                    </label>
                  </div>
                </div>
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Speakers</label>
          <Controller
            name="speakers"
            control={control}
            rules={{ required: "Speakers is required." }}
            render={({ field, fieldState }) => (
              <>
                {/* <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radiorSpeakersAvailable"
                      {...field}
                      value="true"
                      checked={field.value === "true"}
                    />
                    <label
                      htmlFor="radiorSpeakersAvailable"
                      className="common-radio-label"
                    >
                      Available
                    </label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioSpeakersNotAvailable"
                      {...field}
                      value="false"
                      checked={field.value === "false"}
                    />
                    <label
                      htmlFor="radioSpeakersNotAvailable"
                      className="common-radio-label"
                    >
                      Not Available
                    </label>
                  </div>
                </div> */}
                <InputText
                  {...field}
                  keyfilter="int"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter Speakers"
                  maxLength={3}
                />
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">Key With Remote</label>
          <Controller
            name="keyWithRemote"
            control={control}
            rules={{ required: "Key With Remote is required." }}
            render={({ field, fieldState }) => (
              <>
                <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radiorRemoteAvailable"
                      {...field}
                      value="true"
                      checked={field.value === "true"}
                    />
                    <label
                      htmlFor="radiorRemoteAvailable"
                      className="common-radio-label"
                    >
                      Available
                    </label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioRemoteNotAvailable"
                      {...field}
                      value="false"
                      checked={field.value === "false"}
                    />
                    <label
                      htmlFor="radioRemoteNotAvailable"
                      className="common-radio-label"
                    >
                      Not Available
                    </label>
                  </div>
                </div>
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">Aerial</label>
          <Controller
            name="aerial"
            control={control}
            rules={{ required: "Aerial is required." }}
            render={({ field, fieldState }) => (
              <>
                <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioAerialAvailable"
                      {...field}
                      value="true"
                      checked={field.value === "true"}
                    />
                    <label
                      htmlFor="radioAerialAvailable"
                      className="common-radio-label"
                    >
                      Available
                    </label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioAerialNotAvailable"
                      {...field}
                      value="false"
                      checked={field.value === "false"}
                    />
                    <label
                      htmlFor="radioAerialNotAvailable"
                      className="common-radio-label"
                    >
                      Not Available
                    </label>
                  </div>
                </div>
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Floor Mat</label>
          <Controller
            name="floorMat"
            control={control}
            rules={{ required: "Floor Mat is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  keyfilter="int"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter Floor Mat"
                  maxLength={3}
                />
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">
            Fixed Idol / Hanging Idol
          </label>
          <Controller
            name="fixedOrHangingIdol"
            control={control}
            rules={{ required: "Fixed Idol / Hanging Idol is required." }}
            render={({ field, fieldState }) => (
              <>
                <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioIdolAvailable"
                      {...field}
                      value="true"
                      checked={field.value === "true"}
                    />
                    <label
                      htmlFor="radioIdolAvailable"
                      className="common-radio-label"
                    >
                      Available
                    </label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioIdolNotAvailable"
                      {...field}
                      value="false"
                      checked={field.value === "false"}
                    />
                    <label
                      htmlFor="radioIdolNotAvailable"
                      className="common-radio-label"
                    >
                      Not Available
                    </label>
                  </div>
                </div>
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>
      {typeOfId == 161 &&
        caseFullData?.caseDetail?.caseInformation?.dropDealerId && (
          <>
            {/* <div className="col-md-3">
            <div className="form-group">
              <label className="form-label required">
                Vehicle arrival status at dealership
              </label>
              <Controller
                name="vehicleArrivalStatusAtDealership"
                control={control}
                rules={{ required: "Vehicle arrival status is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText 
                      {...field} 
                      placeholder="Enter" 
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                    />
                    {errors && 
                      <div className="p-error">{errors[field.name]?.message}
                    </div>}
                  </>
                )}
              />
            </div>
          </div> */}
            <div className="col-md-3">
              <div className="form-group radio-form-group">
                <label className="form-label required">
                  Reached dealership status
                </label>
                <Controller
                  name="reachedDealershipStatus"
                  control={control}
                  rules={{ required: "Reached dealership status is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <div className="common-radio-group">
                        <div className="common-radio-item">
                          <RadioButton
                            inputId="radioDealerAvailable"
                            {...field}
                            value="true"
                            checked={field.value === "true"}
                          />
                          <label
                            htmlFor="radioDealerAvailable"
                            className="common-radio-label"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="common-radio-item">
                          <RadioButton
                            inputId="radioDealerNotAvailable"
                            {...field}
                            value="false"
                            checked={field.value === "false"}
                          />
                          <label
                            htmlFor="radioDealerNotAvailable"
                            className="common-radio-label"
                          >
                            No
                          </label>
                        </div>
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
          </>
        )}

      {typeOfId == 162 ? (
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Reached at Breakdown</label>
            <Controller
              name="aspReachedToBreakdownAt"
              control={control}
              rules={{ required: "Reach at Breakdown is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Calendar
                    inputId={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    showTime
                    showIcon
                    hourFormat="12"
                    iconPos={"left"}
                    dateFormat="dd-mm-yy"
                    placeholder="Select Reach Date & Time"
                    icon={<img src={CalendarTimeIcon} />}
                    minDate={reachedMinDate}
                    pt={{
                      input: {
                        className: "border-right-hidden",
                      },
                    }}
                  />
                  {errors && (
                    <div className="p-error">{errors[field.name]?.message}</div>
                  )}
                </>
              )}
            />
          </div>
        </div>
      ) : (
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Reached at Drop</label>
            <Controller
              name="aspReachedToDropAt"
              control={control}
              rules={{ required: "Reach at Drop is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Calendar
                    inputId={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    showTime
                    showIcon
                    hourFormat="12"
                    iconPos={"left"}
                    dateFormat="dd-mm-yy"
                    placeholder="Select Reach Date & Time"
                    icon={<img src={CalendarTimeIcon} />}
                    minDate={reachedMinDate}
                    pt={{
                      input: {
                        className: "border-right-hidden",
                      },
                    }}
                  />
                  {errors && (
                    <div className="p-error">{errors[field.name]?.message}</div>
                  )}
                </>
              )}
            />
          </div>
        </div>
      )}
      {typeOfId == 161 && (
        <>
          <div className="col-md-3">
            <div className="form-group">
              <label className="form-label required">
                Vehicle Acknowledged by
              </label>
              <Controller
                name="vehicleAcknowledgedBy"
                control={control}
                rules={{ required: "Vehicle Acknowledged by is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      placeholder="Enter"
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
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
          <div className="col-md-3">
            <div className="form-group">
              <label className="form-label required">
                Mobile Number of Receiver
              </label>
              <Controller
                name="mobileNumberOfReceiver"
                control={control}
                rules={{
                  required: "Mobile Number is required.",
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
                      {...field}
                      maxLength={10}
                      keyfilter="num"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
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
        </>
      )}

      {/* <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Signature of ASP</label>
          <Controller
            name="signatureOfAsp"
            control={control}
            rules={{ required: "Signature of ASP is required." }}
            render={({ field, fieldState }) => (
              <>
                <FileChooseUpload 
                  multiple={false} 
                  field={field} 
                  setField={(files) => handleRemoveFile(field?.name, files)} 
                  defaultValues={caseFullData?.rsaActivityInventoryAttachments?.filter((data) => data?.attachmentTypeId == (typeOfId == 162 ? 87 : 93))}
                  initalFlag={initalFlag}
                  setInitalFlag={setInitalFlag}
                />
                {errors && 
                  <div className="p-error">{errors[field.name]?.message}
                </div>}
              </>
            )}
          />
        </div>
      </div> */}
      {typeOfId == 161 &&
      caseFullData?.caseDetail?.caseInformation?.dropDealerId ? (
        <>
          {/* <div className="col-md-3">
            <div className="form-group">
              <label className="form-label required">Signature of Dealer</label>
              <Controller
                name="signatureOfDealership"
                control={control}
                rules={{ required: "Signature of Dealer is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <FileChooseUpload 
                      multiple={false} 
                      field={field} 
                      setField={(files) => handleRemoveFile(field?.name, files)} 
                      defaultValues={caseFullData?.rsaActivityInventoryAttachments?.filter((data) => data?.attachmentTypeId == 99)}
                      initalFlag={initalFlag}
                      setInitalFlag={setInitalFlag}
                    />
                    {errors && 
                      <div className="p-error">{errors[field.name]?.message}
                    </div>}
                  </>
                )}
              />
            </div>
          </div> */}
          <div className="col-md-3">
            <div className="form-group">
              <label className="form-label required">
                Vehicle with Dealer Background
              </label>
              <Controller
                name="vehicleWithDealerBackground"
                control={control}
                rules={{
                  required: "Vehicle with Dealer Background is required.",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <FileChooseUpload
                      multiple={true}
                      field={field}
                      setField={(files) => handleRemoveFile(field?.name, files)}
                      defaultValues={caseFullData?.rsaActivityInventoryAttachments?.filter(
                        (data) => data?.attachmentTypeId == 95
                      )}
                      initalFlag={initalFlag}
                      setInitalFlag={setInitalFlag}
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
        </>
      ) : // <div className="col-md-3">
      //   <div className="form-group">
      //     <label className="form-label required">Signature of Customer</label>
      //     <Controller
      //       name="signatureOfCustomer"
      //       control={control}
      //       rules={{ required: "Signature of Customer is required." }}
      //       render={({ field, fieldState }) => (
      //         <>
      //           <FileChooseUpload
      //             multiple={false}
      //             field={field}
      //             setField={(files) => handleRemoveFile(field?.name, files)}
      //             defaultValues={caseFullData?.rsaActivityInventoryAttachments?.filter((data) => data?.attachmentTypeId == (typeOfId == 162 ? 88 : 94))}
      //             initalFlag={initalFlag}
      //             setInitalFlag={setInitalFlag}
      //           />
      //           {errors &&
      //             <div className="p-error">{errors[field.name]?.message}
      //           </div>}
      //         </>
      //       )}
      //     />
      //   </div>
      // </div>
      null}
      <div className="col-md-3">
        <div className="form-group">
          {/* <label className="form-label required">Image of car in Towing Vehicle</label> */}
          <label className="form-label required">Image of Cluster</label>
          <Controller
            // name="imageOfCarInTowingVehicle"
            name="imageOfCluster"
            control={control}
            defaultValue={null}
            rules={{ required: "Image of cluster is required." }}
            render={({ field, fieldState }) => {
              // console.log("file upload field", field);
              return (
                <>
                  {/* <FileChooseUpload 
                    multiple={true} 
                    field={field} 
                    setField={(files) => handleRemoveFile(field?.name, files)} 
                    defaultValues={caseFullData?.rsaActivityInventoryAttachments?.filter((data) => data?.attachmentTypeId == (typeOfId == 162 ? 92 : 98))}
                    initalFlag={initalFlag}
                    setInitalFlag={setInitalFlag}
                  /> */}
                  <FileChooseUpload
                    multiple={true}
                    field={field}
                    setField={(files) => handleRemoveFile(field?.name, files)}
                    defaultValues={caseFullData?.rsaActivityInventoryAttachments?.filter(
                      (data) =>
                        data?.attachmentTypeId == (typeOfId == 162 ? 91 : 97)
                    )}
                    initalFlag={initalFlag}
                    setInitalFlag={setInitalFlag}
                  />
                  {errors && (
                    <div className="p-error">{errors[field.name]?.message}</div>
                  )}
                </>
              );
            }}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Image of Inner Cabin</label>
          <Controller
            name="imageOfInnerCabin"
            control={control}
            rules={{ required: "Image of Inner Cabin is required." }}
            render={({ field, fieldState }) => (
              <>
                <FileChooseUpload
                  multiple={true}
                  field={field}
                  setField={(files) => handleRemoveFile(field?.name, files)}
                  defaultValues={caseFullData?.rsaActivityInventoryAttachments?.filter(
                    (data) =>
                      data?.attachmentTypeId == (typeOfId == 162 ? 90 : 96)
                  )}
                  initalFlag={initalFlag}
                  setInitalFlag={setInitalFlag}
                />
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">Terms and Conditions</label>
          <Controller
            name="termsAndConditions"
            control={control}
            rules={{ required: "Terms and Conditions is required." }}
            render={({ field, fieldState }) => (
              <>
                <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioTermsAccepted"
                      {...field}
                      value="true"
                      checked={field.value === "true"}
                    />
                    <label
                      htmlFor="radioTermsAccepted"
                      className="common-radio-label"
                    >
                      Accepted
                    </label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radioTermsNotAccepted"
                      {...field}
                      value="false"
                      checked={field.value === "false"}
                    />
                    <label
                      htmlFor="radioTermsNotAccepted"
                      className="common-radio-label"
                    >
                      Not Accepted
                    </label>
                  </div>
                </div>
                {errors && (
                  <div className="p-error">{errors[field.name]?.message}</div>
                )}
              </>
            )}
          />
        </div>
      </div>
      {/* {typeOfId == 161 && 
        <div className="col-md-3">
          <div className="form-group radio-form-group">
            <label className="form-label required">Request Dealership Signature</label>
            <Controller
              name="requestDealershipSignature"
              control={control}
              rules={{ required: "Request Dealership Signature is required." }}
              render={({ field, fieldState }) => (
                <>
                  <div className="common-radio-group">
                    <div className="common-radio-item">
                      <RadioButton
                        inputId="radioDealershipSignatureYes"
                        {...field}
                        value="true"
                        checked={field.value === "true"}
                      />
                      <label
                        htmlFor="radioDealershipSignatureYes"
                        className="common-radio-label"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="common-radio-item">
                      <RadioButton
                        inputId="radioDealershipSignatureNo"
                        {...field}
                        value="false"
                        checked={field.value === "false"}
                      />
                      <label
                        htmlFor="radioDealershipSignatureNo"
                        className="common-radio-label"
                      >
                        No
                      </label>
                    </div>
                  </div>
                  {errors && 
                    <div className="p-error">{errors[field.name]?.message}
                  </div>}
                </>
              )}
            />
          </div>
        </div>
      } */}
    </div>
  );
};

export default VehicleInventoryForm;
