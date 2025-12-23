import React, { useState, useEffect } from "react";
import DynamicFormCard from "../../components/common/DynamicFormCard";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { cities, state } from "../../../services/masterServices";
import { useQuery } from "react-query";

const AddressDetailForm = ({ formErrors, country }) => {
  const { control, setValue, getValues } = useFormContext();
  // console.log("country", country);
  const BillingCoutryId = useWatch({
    control,
    name: "billingAddressCountryId",
  });
  const ShippingCoutryId = useWatch({
    control,
    name: "shippingAddressCountryId",
  });

  const BillingStateId = useWatch({
    control,
    name: "billingAddressStateId",
  });
  const ShippingStateId = useWatch({
    control,
    name: "shippingAddressStateId",
  });
  const handleCopyBillingAddress = () => {
    console.log("billing address copied");
    [
      { field: "shippingAddress", copyfromField: "billingAddress" },
      {
        field: "shippingAddressCountryId",
        copyfromField: "billingAddressCountryId",
      },
      {
        field: "shippingAddressStateId",
        copyfromField: "billingAddressStateId",
      },

      { field: "shippingAddressCityId", copyfromField: "billingAddressCityId" },
      {
        field: "shippingAddressPincode",
        copyfromField: "billingAddressPincode",
      },
    ].forEach((item) =>
      setValue(`${item?.field}`, getValues(item?.copyfromField))
    );
  };

  const { data: stateData } = useQuery(
    ["billingstates", BillingCoutryId],
    () =>
      state({
        apiType: "dropdown",
        countryId: BillingCoutryId,
      }),
    {
      enabled: BillingCoutryId ? true : false,
    }
  );
  const { data: shippingStateData } = useQuery(
    ["shippingtates", ShippingCoutryId],
    () =>
      state({
        apiType: "dropdown",
        countryId: ShippingCoutryId,
      }),
    {
      enabled: ShippingCoutryId ? true : false,
    }
  );
  const { data: cityData } = useQuery(
    ["billingcities", BillingStateId],
    () =>
      cities({
        apiType: "dropdown",
        stateId: BillingStateId,
      }),
    {
      enabled: BillingStateId ? true : false,
    }
  );
  const { data: shippingCityData } = useQuery(
    ["shippingcities", ShippingStateId],
    () =>
      cities({
        apiType: "dropdown",
        stateId: ShippingStateId,
      }),
    {
      enabled: ShippingStateId ? true : false,
    }
  );
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    if (cityData?.data?.data) {
      setFilteredCities(cityData.data.data);
    }
  }, [cityData]);
  return (
    <div className="address-detail-card row row-gap-3_4">
      <DynamicFormCard
        title={"BILLING ADDRESS"}
        addLabel={false}
        removeIcon={false}
      >
        <div className="fields-row">
          <div className="form-field">
            <div className="row row-gap-3_4">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">Address</label>
                  <Controller
                    name="billingAddress"
                    control={control}
                    rules={{ required: "Address is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          value={field.value}
                          placeholder="Enter Address"
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
                  <label className="form-label required">Country</label>
                  <Controller
                    name={`billingAddressCountryId`}
                    //name="type"
                    control={control}
                    rules={{ required: "Country is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          filter
                          placeholder="Select Country"
                          options={country}
                          optionValue="id"
                          optionLabel="name"
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
                  <label className="form-label required">State</label>
                  <Controller
                    name={`billingAddressStateId`}
                    //name="business_hours"
                    control={control}
                    rules={{ required: "State is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          filter
                          placeholder="Select State"
                          options={stateData?.data?.data}
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
                  <label className="form-label required">City</label>
                  <Controller
                    name={`billingAddressCityId`}
                    //name="business_hours"
                    control={control}
                    rules={{ required: "City is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          filter
                          placeholder="Select City "
                          options={filteredCities}
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
                  <label className="form-label required">Zip Code</label>
                  <Controller
                    name="billingAddressPincode"
                    control={control}
                    rules={{ required: "Zip Code is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          value={field.value}
                          placeholder="Enter Zip Code"
                          maxLength={6}
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
            </div>
          </div>
          {/* <Divider /> */}
        </div>
      </DynamicFormCard>
      <DynamicFormCard
        title={"SHIPPING ADDRESS"}
        subtitle={"Copy Billing Address"}
        addLabel={false}
        onClick={handleCopyBillingAddress}
        removeIcon={false}
      >
        <div className="fields-row">
          <div className="form-field">
            <div className="row row-gap-3_4">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">Address</label>
                  <Controller
                    name="shippingAddress"
                    rules={{ required: "Address is required." }}
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          value={field.value}
                          placeholder="Enter Address"
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
                  <label className="form-label required">Country</label>
                  <Controller
                    name={`shippingAddressCountryId`}
                    //name="type"
                    rules={{ required: "Country is required." }}
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Country"
                          filter
                          options={country}
                          optionValue="id"
                          optionLabel="name"
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
                  <label className="form-label required">State</label>
                  <Controller
                    name={`shippingAddressStateId`}
                    filter
                    //name="business_hours"
                    control={control}
                    rules={{ required: "State is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select State"
                          filter
                          options={shippingStateData?.data?.data}
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
                  <label className="form-label required">City</label>
                  <Controller
                    name={`shippingAddressCityId`}
                    filter
                    //name="business_hours"
                    control={control}
                    rules={{ required: "City is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          filter
                          placeholder="Select City "
                          options={shippingCityData?.data?.data}
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
                  <label className="form-label required">Zip Code</label>
                  <Controller
                    name="shippingAddressPincode"
                    control={control}
                    rules={{ required: "Zip Code is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          {...field}
                          value={field.value}
                          placeholder="Enter Zip Code"
                          maxLength={6}
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
            </div>
          </div>
          {/* <Divider /> */}
        </div>
      </DynamicFormCard>
    </div>
  );
};

export default AddressDetailForm;
