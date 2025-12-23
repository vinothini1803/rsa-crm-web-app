import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MultiSelect } from "primereact/multiselect";

const AccountDetailForm = ({
  formErrors,
  callCenters,
  spocList,
  businessCategory,
  vehicleMake,
  vehicleType,
}) => {
  const { control } = useFormContext;
  // console.log("vehicleMake", vehicleMake);

  return (
    <div className="row row-gap-3_4">
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Axapta Code</label>
          <Controller
            name="axaptaCode"
            control={control}
            rules={{
              required: "Axapta Code is required.",
              // pattern: {
              //   value: /^[a-zA-Z0-9 ]*$/,
              //   message: "Only letters, Numbers and spaces are allowed.",
              // },
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText {...field} placeholder="Enter Axapta" />
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
                  placeholder="Enter Legal Name"
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z ]$/.test(e.key)) {
                      e.preventDefault();
                    }
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
                  placeholder="Enter Trade Name"
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z ]$/.test(e.key)) {
                      e.preventDefault();
                    }
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Invoice Code</label>
          <Controller
            name="invoiceCode"
            control={control}
            rules={{ required: "Invoice Code is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Invoice Code"
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z0-9 ]$/.test(e.key)) {
                      e.preventDefault();
                    }
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Financial Dimension</label>
          <Controller
            name="financialDimension"
            control={control}
            rules={{ required: "Financial Dimension is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Financial Dimension"
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z0-9 ]$/.test(e.key)) {
                      e.preventDefault();
                    }
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Invoice Name</label>
          <Controller
            name="invoiceName"
            control={control}
            rules={{ required: "Invoice Name is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Invoice Name"
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z ]$/.test(e.key)) {
                      e.preventDefault();
                    }
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">GSTIN</label>
          <Controller
            name="gstin"
            control={control}
            rules={{
              required: "GST IN is required.",
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "p-invalid" : ""
                  }`}
                  placeholder="Enter GSTIN"
                  maxLength={15}
                  onKeyPress={(e) => {
                    if (!/^[0-9]$/.test(e.key)) {
                      e.preventDefault();
                    }
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

      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">
            Customer Toll Free Number
          </label>
          <Controller
            name="customerTollFreeNumber"
            control={control}
            rules={{
              required: "Customer Toll Free is required.",
              pattern: {
                value: /^1800\d{7}$/,
                message: "Enter a valid toll-free number (e.g., 18001234567)",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Customer Toll Free Number"
                  maxLength={11} // Depends on pattern
                  //keyfilter={"pnum"}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">ASM Toll Free Number</label>
          <Controller
            name="asmTollFreeNumber"
            control={control}
            rules={{
              // required: "ASM Toll Free is required.",
              pattern: {
                value: /^1800\d{7}$/,
                message: "Enter a valid toll-free number (e.g., 18001234567)",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter ASM Toll Free Number"
                  maxLength={11}
                  //keyfilter={"pnum"}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
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

      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">NM Toll Free Number</label>
          <Controller
            name="nmTollFreeNumber"
            control={control}
            rules={{
              // required: "NM Toll Free is required.",
              pattern: {
                value: /^1800\d{7}$/,
                message: "Enter a valid toll-free number (e.g., 18001234567)",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter NM Toll Free Number"
                  maxLength={11}
                  //keyfilter={"pnum"}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">FH Toll Free Number</label>
          <Controller
            name="fhTollFreeNumber"
            control={control}
            rules={{
              // required: "FH Toll Free is required.",
              pattern: {
                value: /^1800\d{7}$/,
                message: "Enter a valid toll-free number (e.g., 18001234567)",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter FH Toll Free Number"
                  maxLength={11}
                  //keyfilter={"pnum"}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">ASP Toll Free Number</label>
          <Controller
            name="aspTollFreeNumber"
            control={control}
            rules={{
              // required: "ASP Toll Free is required.",
              pattern: {
                value: /^1800\d{7}$/,
                message: "Enter a valid toll-free number (e.g., 18001234567)",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter ASP Toll Free Number"
                  maxLength={11}
                  //keyfilter={"pnum"}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">RM Toll Free Number</label>
          <Controller
            name="rmTollFreeNumber"
            control={control}
            rules={{
              // required: "RM Toll Free is required.",
              pattern: {
                value: /^1800\d{7}$/,
                message: "Enter a valid toll-free number (e.g., 18001234567)",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter RM Toll Free Number"
                  maxLength={11}
                  //keyfilter={"pnum"}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">DID Number</label>
          <Controller
            name="didNumber"
            control={control}
            //rules={{ required: "DID Number is required." }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter DID Number"
                  maxLength={12}
                  //keyfilter={"pnum"}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
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
      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label">Dialer Campaign Name</label>
          <Controller
            name="dialerCampaignName"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Enter Dialer Campaign Name"
                  maxLength={199}
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
          <label className="form-label required">Call Center</label>
          <Controller
            name="callCenterIds"
            control={control}
            rules={{ required: "Call Center is required." }}
            render={({ field, fieldState }) => (
              <>
                <MultiSelect
                  value={Array.isArray(field.value) ? field.value : []}
                  placeholder="Select"
                  options={callCenters}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => field.onChange(e.value)}
                  display="chip"
                  filter
                  filterBy="name"
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
          <label className="form-label required">TVS SPOC</label>
          <Controller
            name="spocUserId"
            control={control}
            rules={{ required: " TVS SPOC is required." }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value || null}
                  placeholder="Select"
                  options={spocList}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => field.onChange(e.value)}
                />
                {formErrors && (
                  <div className="p-error">
                    {formErrors[field.name]?.message}
                  </div>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className="col-md-3">
        <div className="form-group">
          <label className="form-label required">Business Category</label>
          <Controller
            name="businessCategoryId"
            control={control}
            rules={{ required: "Business Category is required." }}
            render={({ field, fieldState }) => (
              <>
                <Dropdown
                  value={field.value}
                  placeholder="Select"
                  options={businessCategory}
                  optionLabel="name"
                  optionValue="id"
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
          <label className="form-label required">Vehicle Type</label>
          <Controller
            name="vehicleTypeIds"
            control={control}
            rules={{ required: "Vehicle Type is required." }}
            render={({ field, fieldState }) => (
              <>
                <MultiSelect
                  value={Array.isArray(field.value) ? field.value : []}
                  placeholder="Select"
                  options={vehicleType}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => field.onChange(e.value)}
                  display="chip"
                  filter
                  filterBy="name"
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
          <label className="form-label required">Vehicle Make</label>
          <Controller
            name="vehicleMakeIds"
            control={control}
            rules={{ required: "Vehicle Make is required." }}
            render={({ field, fieldState }) => (
              <>
                <MultiSelect
                  value={Array.isArray(field.value) ? field.value : []}
                  placeholder="Select"
                  options={vehicleMake}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => field.onChange(e.value)}
                  display="chip"
                  filter
                  filterBy="name"
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
        <div className="form-group radio-form-group">
          <label className="form-label required">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <div className="common-radio-group">
                <div className="common-radio-item">
                  <RadioButton
                    inputId="radio_yes"
                    {...field}
                    value={1}
                    checked={field.value === 1}
                    defaultChecked
                  />
                  <label htmlFor="radio_yes" className="common-radio-label">
                    Active
                  </label>
                </div>
                <div className="common-radio-item">
                  <RadioButton
                    inputId="radio_no"
                    {...field}
                    value={0}
                    checked={field.value === 0}
                  />
                  <label htmlFor="radio_no" className="common-radio-label">
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

export default AccountDetailForm;
