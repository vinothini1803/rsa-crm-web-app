import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useMutation } from "react-query";
import { useParams } from "react-router";
import { getDealersByGroupCode } from "../../../../services/masterServices";

const BasicInfoForm = ({ formErrors, clients, types, financeAdminUsers }) => {
  const { control } = useFormContext();
  console.log("formError", formErrors);
  const { dealerId } = useParams();
  const [DropDealersList, setDropDealerList] = useState([]);

  const { mutate, data } = useMutation(getDealersByGroupCode);
  const groupCode = useWatch({
    control,
    name: "groupCode",
  });
  const changePassword = useWatch({
    control,
    name: "changePassword",
  });

  const validateUppercase = (value) => {
    return (
      /[A-Z]/.test(value) ||
      "Password must contain at least one uppercase letter"
    );
  };

  const validateLowercase = (value) => {
    return (
      /[a-z]/.test(value) ||
      "Password must contain at least one lowercase letter"
    );
  };

  const validateSpecialCharacter = (value) => {
    return (
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value) ||
      "Password must contain at least one special character"
    );
  };

  const handledropDealerSearch = (e) => {
    console.log("drop search e", e);
    mutate({
      dealerId: dealerId ?? null,
      search: e.query,
      groupCode: groupCode,
    });
  };

  console.log("dropDealerSearch data", data);

  return (
    <div className="row row-gap-3_4">
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">Group Code</label>
          <Controller
            name="groupCode"
            control={control}
            // rules={{ required: "Group Code is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  {...field}
                  placeholder="Enter Group Code"
                />
                {/* <div className="p-error">
                 
                  {formErrors && formErrors[field.name]?.message}
                </div> */}
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Dealer Code</label>
          <Controller
            name="code"
            control={control}
            rules={{ required: "Dealer Code is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  {...field}
                  placeholder="Enter Dealer Code"
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Type</label>
          <Controller
            name="typeId"
            control={control}
            rules={{ required: "Type is required." }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select Type"
                  options={types}
                  className={`form-control-select ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  optionLabel="name"
                  optionValue={"id"}
                  onChange={(e) => field.onChange(e.value)}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>

      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Dealer Name</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Dealer Name is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter Dealer Name"
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Legal Name</label>
          <Controller
            name="legalName"
            control={control}
            rules={{ required: "Legal Name is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter Legal Name"
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Trade Name</label>
          <Controller
            name="tradeName"
            control={control}
            rules={{ required: "Trade Name is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter Trade Name"
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>

      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Mobile Number</label>
          <Controller
            name="mobileNumber"
            control={control}
            rules={{
              required: "Mobile Number is required.",
              validate: {
                matchPattern: (v) =>
                  /^([+]\d{2})?\d{10}$/.test(v) ||
                  "Mobile Number must be a valid number",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter Mobile Number"
                  maxLength={10}
                  keyfilter={"pnum"}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Email</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required.",
              validate: {
                matchPattern: (v) =>
                  v == "" ||
                  v == undefined ||
                  v == null ||
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                  "Email address must be a valid address",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter Email"
                  keyfilter={"email"}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">GSTIN</label>
          <Controller
            name="gstin"
            control={control}
            rules={{ required: "GST IN is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter GSTIN"
                  maxLength={15}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">PAN</label>
          <Controller
            name="pan"
            control={control}
            rules={{ required: "PAN is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter PAN"
                  maxLength={10}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">CIN</label>
          <Controller
            name="cin"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter CIN"
                  maxLength={21}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>

      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">Mechanical Type</label>
          <Controller
            name="mechanicalType"
            control={control}
            render={({ field, fieldState }) => (
              <div className="common-radio-group">
                <div className="common-radio-item">
                  <RadioButton
                    inputId="mechanical_yes"
                    {...field}
                    value={1}
                    checked={field.value == 1}
                  />
                  <label
                    htmlFor="mechanical_yes"
                    className="common-radio-label"
                  >
                    Yes
                  </label>
                </div>
                <div className="common-radio-item">
                  <RadioButton
                    inputId="mechanical_no"
                    {...field}
                    value={0}
                    checked={field.value == 0}
                  />
                  <label htmlFor="mechanical_no" className="common-radio-label">
                    No
                  </label>
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">Is Exclusive</label>
          <Controller
            name="isExclusive"
            control={control}
            render={({ field, fieldState }) => (
              <div className="common-radio-group">
                <div className="common-radio-item">
                  <RadioButton
                    inputId="exclusive_yes"
                    {...field}
                    value={1}
                    checked={field.value == 1}
                  />
                  <label htmlFor="exclusive_yes" className="common-radio-label">
                    Yes
                  </label>
                </div>
                <div className="common-radio-item">
                  <RadioButton
                    inputId="exclusive_no"
                    {...field}
                    value={0}
                    checked={field.value == 0}
                  />
                  <label htmlFor="exclusive_no" className="common-radio-label">
                    No
                  </label>
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">Body Part Type</label>
          <Controller
            name="bodyPartType"
            control={control}
            render={({ field, fieldState }) => (
              <div className="common-radio-group">
                <div className="common-radio-item">
                  <RadioButton
                    inputId="body_yes"
                    {...field}
                    value={1}
                    checked={field.value == 1}
                  />
                  <label htmlFor="body_yes" className="common-radio-label">
                    Yes
                  </label>
                </div>
                <div className="common-radio-item">
                  <RadioButton
                    inputId="body_no"
                    {...field}
                    value={0}
                    checked={field.value == 0}
                  />
                  <label htmlFor="body_no" className="common-radio-label">
                    No
                  </label>
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Client</label>
          <Controller
            name="clientId"
            control={control}
            rules={{ required: "Client is required." }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select Client"
                  options={clients}
                  className={`form-control-select ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  optionLabel="name"
                  optionValue={"id"}
                  onChange={(e) => field.onChange(e.value)}
                />
                {formErrors && (
                  <div className="p-error">
                    {formErrors[field.name]?.message}
                    {/*  {errors[field.name]?.message}*/}
                  </div>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">RSA Person Name</label>
          <Controller
            name="rsaPersonName"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter RSA Person Name"
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">RSA Person Number</label>
          <Controller
            name="rsaPersonNumber"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter RSA Person Number"
                  maxLength={10}
                  keyfilter={"pnum"}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">RSA Person Alternate Number</label>
          <Controller
            name="rsaPersonAlternateNumber"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter RSA Person Alternate Number"
                  maxLength={10}
                  keyfilter={"pnum"}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">SM Name</label>
          <Controller
            name="smName"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter SM Name"
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">SM Number</label>
          <Controller
            name="smNumber"
            control={control}
            /*  rules={{
              required: "SM Number is required.",
              validate: {
                matchPattern: (v) =>
                  /^([+]\d{2})?\d{10}$/.test(v) ||
                  "SM Number must be a valid number",
              },
            }} */
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter SM Number"
                  maxLength={10}
                  keyfilter={"pnum"}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">SM Alternate Number</label>
          <Controller
            name="smAlternateNumber"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter SM Alternate Number"
                  maxLength={10}
                  keyfilter={"pnum"}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">OEM ASM Name</label>
          <Controller
            name="oemAsmName"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter OEM ASM Name"
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">OEM ASM Number</label>
          <Controller
            name="oemAsmNumber"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter OEM ASM Number"
                  maxLength={10}
                  keyfilter={"pnum"}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">OEM ASM Alternate Number</label>
          <Controller
            name="oemAsmAlternateNumber"
            control={control}
            maxLength={10}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter OEM ASM Alternate Number"
                  keyfilter={"pnum"}
                  maxLength={10}
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">
            Auto Cancel For Delivery
          </label>
          <Controller
            name="autoCancelForDelivery"
            control={control}
            render={({ field, fieldState }) => (
              <div className="common-radio-group">
                <div className="common-radio-item">
                  <RadioButton
                    inputId="autoCancelForDelivery_yes"
                    {...field}
                    value={1}
                    checked={field.value == 1}
                  />
                  <label
                    htmlFor="autoCancelForDelivery_yes"
                    className="common-radio-label"
                  >
                    Yes
                  </label>
                </div>
                <div className="common-radio-item">
                  <RadioButton
                    inputId="autoCancelForDelivery_no"
                    {...field}
                    value={0}
                    checked={field.value == 0}
                  />
                  <label
                    htmlFor="autoCancelForDelivery_no"
                    className="common-radio-label"
                  >
                    No
                  </label>
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">Drop Dealers</label>
          <Controller
            name="dropDealerIds"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <AutoComplete
                  inputId={field.name}
                  value={field.value}
                  field="name"
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  inputRef={field.ref}
                  suggestions={
                    data?.data?.success
                      ? data?.data?.data?.map((el) => {
                          return {
                            id: el?.id,
                            name: el?.name,
                          };
                        })
                      : [{ name: data?.data?.error }]
                  }
                  completeMethod={handledropDealerSearch}
                  className="form-control-select"
                  placeholder="Enter Drop Dealer"
                  pt={{
                    list: {
                      className: `${data?.data?.success ? "" : "empty-state"}`,
                    },
                  }}
                  multiple
                  disabled={groupCode == "" ? true : false}
                />
              </>
            )}
          />
        </div>
      </div>

      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">Finance Admin</label>
          <Controller
            name="financeAdminUserId"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select Finance Admin"
                  options={financeAdminUsers}
                  className={`form-control-select ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  optionLabel="name"
                  optionValue={"id"}
                  onChange={(e) => field.onChange(e.value)}
                  filter
                  showClear
                />
                {formErrors && (
                  <div className="p-error">
                    {formErrors[field.name]?.message}
                    {/*  {errors[field.name]?.message}*/}
                  </div>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Username</label>
          <Controller
            name="userName"
            control={control}
            rules={{
              required: "UserName is required.",
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter Username"
                />
                <div className="p-error">
                  {/* {errors[field.name]?.message} */}
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      {!dealerId ? (
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required.",
                minLength: {
                  value: 12,
                  message: "Password must have at least 12 characters",
                },
                validate: {
                  validateUppercase,
                  validateSpecialCharacter,
                  validateLowercase,
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    placeholder="Enter Password"
                    autoComplete="off"
                    {...field}
                  />
                  <div className="p-error">
                    {" "}
                    {formErrors && formErrors[field.name]?.message}
                  </div>
                </>
              )}
            />
          </div>
        </div>
      ) : (
        <div className="col-md-3">
          <div className="form-group radio-form-group">
            <label className="form-label required">Change Password</label>
            <Controller
              name="changePassword"
              control={control}
              rules={{ required: "Change Password is required" }}
              render={({ field, fieldState }) => (
                <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radio_yes"
                      {...field}
                      value={1}
                      checked={field.value === 1}
                    />
                    <label className="common-radio-label">Yes</label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="radio_no"
                      {...field}
                      value={0}
                      checked={field.value === 0}
                    />
                    <label className="common-radio-label">No</label>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )}

      {changePassword ? (
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required.",
                minLength: {
                  value: 12,
                  message: "Password must have at least 12 characters",
                },
                validate: {
                  validateUppercase,
                  validateSpecialCharacter,
                  validateLowercase,
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    placeholder="Enter Password"
                    autoComplete="off"
                    {...field}
                  />
                  <div className="p-error">
                    {" "}
                    {formErrors && formErrors[field.name]?.message}
                  </div>
                </>
              )}
            />
          </div>
        </div>
      ) : null}
      <div className="col-md-3">
        <div className="form-group radio-form-group">
          <label className="form-label required">Status</label>
          <Controller
            name="status"
            control={control}
            rules={{ required: "Active is required" }}
            render={({ field, fieldState }) => (
              <div className="common-radio-group">
                <div className="common-radio-item">
                  <RadioButton
                    inputId="active_yes"
                    {...field}
                    value={1}
                    checked={field.value == 1}
                  />
                  <label htmlFor="active_yes" className="common-radio-label">
                    Active
                  </label>
                </div>
                <div className="common-radio-item">
                  <RadioButton
                    inputId="active_no"
                    {...field}
                    value={0}
                    checked={field.value == 0}
                  />
                  <label htmlFor="active_no" className="common-radio-label">
                    Inactive
                  </label>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
