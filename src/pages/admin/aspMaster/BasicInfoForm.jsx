import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useParams } from "react-router";

const BasicInfoForm = ({
  formErrors,
  errors,
  salutations,
  workingHours,
  priorities,
  performances,
  serviceRegionalManagers,
  tiers,
  financeAdminList,
  aspValues,
}) => {
  const { control, setValue } = useFormContext();
  const { aspId } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const changePassword = useWatch({
    control,
    name: "changePassword",
  });
  const isOwnPatrol = useWatch({
    control,
    name: "isOwnPatrol",
  });
  const isFinanceAdmin = useWatch({
    control,
    name: "isFinanceAdmin",
  });
  const financeAdmin = useWatch({
    control,
    name: "financeAdminId",
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

  const handleStatusChange = (e, field) => {
    field.onChange(e.value);
    if (!aspId) {
      setValue(`aspMechanics[${0}].status`, e.value);
    }
  };

  useEffect(() => {
    let shouldShowPassword = false;
    // EDIT FORM (THIRD PARTY ASP ONLY)
    if (aspValues) {
      // ASP EXISTS WITH FINANCE ADMIN AS 1
      if (aspValues.isFinanceAdmin == 1) {
        shouldShowPassword = isFinanceAdmin == 0 && !financeAdmin; // FINANCE ADMIN AS 0 AND FINANCE ADMIN IS NOT SELECTED
      } else if (aspValues.isFinanceAdmin == 0) {
        // ASP EXISTS WITH FINANCE ADMIN AS 0
        shouldShowPassword =
          isFinanceAdmin == 1 ||
          (!aspValues.user && isFinanceAdmin == 0 && !financeAdmin); // FINANCE ADMIN AS 1 || (USER DOES NOT EXIST AND FINANCE ADMIN AS 0 AND FINANCE ADMIN IS NOT SELECTED)
      }
    } else {
      // ADD FORM (THIRD PARTY ASP ONLY)
      shouldShowPassword =
        isOwnPatrol == 0 &&
        (isFinanceAdmin == 1 || (isFinanceAdmin == 0 && !financeAdmin)); // FINANCE ADMIN AS 1 || FINANCE ADMIN AS 0 AND FINANCE ADMIN IS NOT SELECTED
    }

    setShowPassword(shouldShowPassword);
    setValue("changePassword", shouldShowPassword ? 1 : 0);
  }, [isFinanceAdmin, aspValues, financeAdmin, isOwnPatrol, setValue]);
  // console.log("financeAdminList", financeAdmin);
  return (
    <div className="row row-gap-3_4">
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Tier</label>
          <Controller
            name="tierId"
            control={control}
            rules={{ required: "Tier is required." }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select Tier"
                  options={tiers}
                  optionLabel="name"
                  optionValue="id"
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
          <label className="form-label required">Axapta Code</label>
          <Controller
            name="axaptaCode"
            control={control}
            rules={{ required: "Axapta Code is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Axapta Code"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
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
          <label className="form-label required">Salutation</label>
          <Controller
            name="salutationId"
            control={control}
            rules={{ required: "Salutation is required." }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select Salutation"
                  options={salutations}
                  optionLabel="name"
                  optionValue="id"
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
          <label className="form-label required">Name</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Name"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
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
          <label className="form-label required">ASP Code</label>
          <Controller
            name="code"
            rules={{ required: "ASP Code is required." }}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter ASP Code"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
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
          <label className="form-label required">Workshop Name</label>
          <Controller
            name="workshopName"
            control={control}
            rules={{ required: "Workshop Name is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Workshop Name"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
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
          <label className="form-label">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  value={field.value || ""}
                  placeholder="Enter Email"
                  keyfilter={"email"}
                />
                <div className="p-error">
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">WhatsApp Number</label>
          <Controller
            name="whatsAppNumber"
            control={control}
            //rules={{ required: "WhatsApp Number is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  value={field.value || ""}
                  placeholder="Enter WhatsApp Number"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
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
          <label className="form-label required">Contact Number</label>
          <Controller
            name="contactNumber"
            control={control}
            rules={{ required: "Contact Number is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Contact Number"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
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
          <label className="form-label required">Working Hours</label>
          <Controller
            name="workingHourId"
            rules={{ required: "Working Hours is required." }}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select Working Hours"
                  options={workingHours}
                  optionLabel="name"
                  optionValue="id"
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
          <label className="form-label required">Performance</label>
          <Controller
            name="performanceId"
            control={control}
            rules={{ required: "Performance is required." }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select Performance"
                  options={performances}
                  optionLabel="name"
                  optionValue="id"
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
          <label className="form-label required">Priority</label>
          <Controller
            name="priorityId"
            control={control}
            rules={{ required: "Priority is required." }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select Priority"
                  options={priorities}
                  optionLabel="name"
                  optionValue="id"
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
          <label className="form-label required">Regional Manager</label>
          <Controller
            name="rmId"
            control={control}
            rules={{ required: "Regional Manager is required." }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select Regional Manager"
                  options={serviceRegionalManagers}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => field.onChange(e.value)}
                  filter
                  filterBy="name"
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
          <label className="form-label required">Own Patrol</label>
          <Controller
            name="isOwnPatrol"
            control={control}
            render={({ field, fieldState }) => (
              <div className="common-radio-group">
                <div className="common-radio-item">
                  <RadioButton
                    inputId="ownpatrol_yes"
                    {...field}
                    value={1}
                    checked={field.value === 1}
                    onChange={(e) => {
                      field.onChange(e.value);
                      setValue("hasMechanic", 1);
                      setValue("isFinanceAdmin", 0);
                      setValue("financeAdminId", null);
                      setValue("userName", "");
                      setValue("password", "");
                    }}
                  />
                  <label htmlFor="ownpatrol_yes" className="common-radio-label">
                    Yes
                  </label>
                </div>
                <div className="common-radio-item">
                  <RadioButton
                    inputId="ownpatrol_no"
                    {...field}
                    value={0}
                    checked={field.value === 0}
                    onChange={(e) => {
                      field.onChange(e.value);
                      setValue("hasMechanic", 1);
                      setValue("isFinanceAdmin", 1);
                      setValue("financeAdminId", null);
                      setValue("userName", "");
                      setValue("password", "");
                    }}
                  />
                  <label htmlFor="ownpatrol_no" className="common-radio-label">
                    No
                  </label>
                </div>
              </div>
            )}
          />
        </div>
      </div>
      {/*  <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">RM Name</label>
          <Controller
            name="rm_name"
            control={control}
            rules={{ required: "RM Name is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Eg : RM"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                />
                <div className="p-error">
                
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">RM Number</label>
          <Controller
            name="rm_number"
            rules={{ required: "Axapta Code is required." }}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Eg : RM"
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                />
                <div className="p-error">
                
                  {formErrors && formErrors[field.name]?.message}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Business Hours</label>
          <Controller
            name="business_hours"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select Business Hours"
                  options={[
                    { label: "Center 1", value: "center1" },
                    { label: "Center 2", value: "center2" },
                  ]}
                  optionLabel="label"
                  onChange={(e) => field.onChange(e.value)}
                />
              </>
            )}
          />
        </div>
      </div> */}

      {!isOwnPatrol && (
        <div className="col-md-3">
          <div className="form-group radio-form-group">
            <label className="form-label required">Has Mechanic</label>
            <Controller
              name="hasMechanic"
              control={control}
              render={({ field, fieldState }) => (
                <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="hasmechanic_yes"
                      {...field}
                      value={1}
                      checked={field.value === 1}
                    />
                    <label
                      htmlFor="hasmechanic_yes"
                      className="common-radio-label"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="hasmechanic_no"
                      {...field}
                      value={0}
                      checked={field.value === 0}
                    />
                    <label
                      htmlFor="hasmechanic_no"
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
      )}

      {!isOwnPatrol && (
        <div className="col-md-3">
          <div className="form-group radio-form-group">
            <label className="form-label required">Is Finance Admin?</label>
            <Controller
              name="isFinanceAdmin"
              control={control}
              render={({ field, fieldState }) => (
                <div className="common-radio-group">
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="isFinanceAdmin_yes"
                      {...field}
                      value={1}
                      checked={field.value === 1}
                      onChange={(e) => {
                        field.onChange(e.value);
                        setValue("financeAdminId", null);
                        setValue("userName", "");
                        setValue("password", "");
                      }}
                    />
                    <label
                      htmlFor="isFinanceAdmin_yes"
                      className="common-radio-label"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="common-radio-item">
                    <RadioButton
                      inputId="isFinanceAdmin_no"
                      {...field}
                      value={0}
                      checked={field.value === 0}
                      onChange={(e) => {
                        field.onChange(e.value);
                        setValue("financeAdminId", null);
                        setValue("userName", "");
                        setValue("password", "");
                      }}
                    />
                    <label
                      htmlFor="isFinanceAdmin_no"
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
      )}
      {isFinanceAdmin == 0 && !isOwnPatrol && (
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Finance Admin</label>
            <Controller
              name="financeAdminId"
              control={control}
              // rules={{ required: "Finance Admin is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Dropdown
                    value={field.value ?? null} // ✅ ensure RHF sees null correctly
                    placeholder="Select Finance Admin"
                    options={financeAdminList}
                    optionLabel="code"
                    optionValue="id"
                    filter
                    filterBy="code"
                    showClear
                    onChange={(e) => {
                      field.onChange(e.value ?? null); // ✅ propagate null on clear
                      setValue("userName", "");
                      setValue("password", "");
                    }}
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
      )}

      {(isFinanceAdmin == 1 && isOwnPatrol == 0) ||
      (financeAdmin == null && isFinanceAdmin == 0 && isOwnPatrol == 0) ? (
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Username</label>
            <Controller
              name="userName"
              control={control}
              rules={{ required: "Username is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    {...field}
                    placeholder="Enter Contact Number"
                    className={`form-control ${
                      fieldState.error ? "p-invalid" : ""
                    }`}
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
      ) : null}
      {((isFinanceAdmin == 1 && isOwnPatrol == 0) ||
        (financeAdmin == null && isFinanceAdmin == 0 && isOwnPatrol == 0)) &&
        aspId &&
        showPassword && (
          <div className="col-md-3">
            <div className="form-group">
              <label className="form-label required">Password</label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required.",
                  minLength: {
                    // value: 12,
                    // message: "Password must have at least 12 characters",

                    value: 3,
                    message: "Password must have at least 3 characters",
                  },
                  validate: {
                    // validateUppercase,
                    // validateSpecialCharacter,
                    // validateLowercase,
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
        )}
      {((isFinanceAdmin == 1 && isOwnPatrol == 0) ||
        (financeAdmin == null && isFinanceAdmin == 0 && isOwnPatrol == 0)) && (
        <>
          {!aspId ? (
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label required">Password</label>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required.",
                    minLength: {
                      // value: 12,
                      // message: "Password must have at least 12 characters",
                      value: 3,
                      message: "Password must have at least 3 characters",
                    },
                    validate: {
                      // validateUppercase,
                      // validateSpecialCharacter,
                      // validateLowercase,
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
            <>
              {!showPassword && (
                <div className="col-md-3">
                  <div className="form-group radio-form-group">
                    <label className="form-label required">
                      Change Password
                    </label>
                    <Controller
                      name="changePassword"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="common-radio-group">
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_yes"
                              {...field}
                              value={1}
                              checked={field.value === 1}
                            />
                            <label
                              htmlFor="radio_yes"
                              className="common-radio-label"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="common-radio-item">
                            <RadioButton
                              inputId="radio_no"
                              {...field}
                              value={0}
                              checked={field.value === 0}
                            />
                            <label
                              htmlFor="radio_no"
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
              )}
            </>
          )}
        </>
      )}

      {changePassword &&
      !showPassword &&
      (isFinanceAdmin == 1 || (isFinanceAdmin == 0 && financeAdmin == null)) &&
      !isOwnPatrol ? (
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required.",
                minLength: {
                  // value: 12,
                  // message: "Password must have at least 12 characters",
                  value: 3,
                  message: "Password must have at least 3 characters",
                },
                validate: {
                  // validateUppercase,
                  // validateSpecialCharacter,
                  // validateLowercase,
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
            rules={{ required: "Status is required" }}
            render={({ field, fieldState }) => (
              <div className="common-radio-group">
                <div className="common-radio-item">
                  <RadioButton
                    inputId="radio_active"
                    {...field}
                    value={1}
                    checked={field.value === 1}
                    onChange={(e) => handleStatusChange(e, field)}
                  />
                  <label htmlFor="radio_active" className="common-radio-label">
                    Active
                  </label>
                </div>
                <div className="common-radio-item">
                  <RadioButton
                    inputId="radio_inactive"
                    {...field}
                    value={0}
                    checked={field.value === 0}
                    onChange={(e) => handleStatusChange(e, field)}
                  />
                  <label
                    htmlFor="radio_inactive"
                    className="common-radio-label"
                  >
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
