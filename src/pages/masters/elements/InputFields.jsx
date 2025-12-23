import React, { useEffect, useState } from "react";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";

import { Controller, useFormContext } from "react-hook-form";
import Search from "../../../components/common/Search";

const InputFields = ({ formErrors }) => {
  const { control } = useFormContext(); // retrieve all hook methods

  return (
    <>
      <div className="row row-gap-3_4">
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label required">First Name</label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Input is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    type="text"
                    className={`form-control ${
                      fieldState.error ? "p-invalid" : ""
                    }`}
                    placeholder="Enter"
                    {...field}
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
            <label className="form-label">Last Name</label>
            <Controller
              name="lastname"
              control={control}
              // rules={{ required: "Last Name is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText type="text" placeholder="Enter" {...field} />
                </>
              )}
            />
          </div>
        </div>
        {/* <!-- Col --> */}
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Send Link</label>
            <div className="p-inputgroup">
              <Controller
                name="link"
                control={control}
                rules={{ required: "Link is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      // keyfilter="int"
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      placeholder="Enter Link"
                      {...field}
                    />
                  </>
                )}
              />
              <Button icon="pi pi-send" />
            </div>
            <div className="p-error">
              {/* {errors[field.name]?.message} */}
              {formErrors && formErrors["link"]?.message}
            </div>
          </div>
        </div>
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Search Location</label>
            <div className="p-inputgroup">
              <InputText keyfilter="int" placeholder="Enter Location" />
              <Button icon="pi pi-search" />
            </div>
          </div>
        </div> */}
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Search Location</label>
            <div className="p-inputgroup">
              <span className="p-input-icon-right">
                <i className="pi pi-spin pi-spinner" />
                <InputText placeholder="Enter Location" />
              </span>
              <Button icon="pi pi-search" />
            </div>
          </div>
        </div> */}
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Mask</label>
            <InputMask id="mask" mask="G-9999" placeholder="G-9999" required></InputMask>
          </div>
        </div> */}
        {/* <!-- Col --> */}
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Phone</label>
            <Controller
              name="phone"
              control={control}
              rules={{ required: "Phone is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    keyfilter="int"
                    maxLength="10"
                    placeholder="9999999999"
                    className={`form-control ${
                      fieldState.error ? "p-invalid" : ""
                    }`}
                    {...field}
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
        {/* <!-- Col --> */}
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Vechile No</label>
            <InputText
              className="text-uppercase"
              name="vechile"
              type="text"
              maxLength="10"
              placeholder="Enter"
              required
            />
          </div>
        </div>
        {/* <!-- Col --> */}
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Integer Only</label>
            <InputNumber placeholder="Enter" name="intnumber" />
          </div>
        </div>
        {/* <!-- Col --> */}
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Textarea</label>
            <Controller
              name="textarea"
              control={control}
              rules={{ }}
              render={({ field, fieldState }) => (
                <>
                  <InputTextarea
                    // rows={3}
                    readOnly
                    placeholder="Enter"
                    className={`form-control ${
                      fieldState.error ? "p-invalid" : ""
                    }`}
                    {...field}
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
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Without Grouping</label>
            <InputNumber placeholder="Enter" useGrouping={false} />
          </div>
        </div> */}
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Min-Max Fraction Digits</label>
            <InputNumber placeholder="Enter" minFractionDigits={2} maxFractionDigits={5} required />
          </div>
        </div> */}
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Currency</label>
            <InputNumber mode="currency" currency="INR" currencyDisplay="code" locale="en-IN" placeholder='Enter' />
          </div>
        </div> */}
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Percent</label>
            <InputNumber placeholder="Enter" suffix=" %" />
          </div>
        </div> */}
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Ruppe</label>
            <InputNumber placeholder="Enter" prefix="₹ " />
          </div>
        </div> */}
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Expiry</label>
            <InputNumber placeholder="Enter" prefix="Expires in " suffix=" days" />
          </div>
        </div> */}
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Password</label>
            <Password toggleMask />
          </div>
        </div> */}
        {/* <!-- Col --> */}
      </div>
      {/* <!-- Row --> */}
    </>
  );
};

export default InputFields;
