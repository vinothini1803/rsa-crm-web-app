import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useFormState } from "react-hook-form";

import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";

import { CountryService } from "../../../utills/countries";

const Dropdowns = ({ formErrors }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCities, setSelectedCities] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null);

  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredCountries;

      if (!event.query.trim().length) {
        _filteredCountries = [...countries];
      } else {
        _filteredCountries = countries.filter((country) => {
          return country.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredCountries(_filteredCountries);
    }, 250);
  };

  const {
    control,
    formState: { errors },
  } = useFormContext(); // retrieve all hook methods

  useEffect(() => {
    CountryService.getCountries().then((data) => setCountries(data));
  }, []);

  return (
    <>
      <div className="row row-gap-3_4">
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Select</label>
            <Controller
              name="cityname"
              control={control}
              rules={{ required: "Please Select city" }}
              render={({ field, fieldState }) => (
                <>
                  <Dropdown
                    filter
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.value)}
                    options={cities}
                    optionLabel="name"
                    placeholder="Select a City"
                    className={`form-control-select ${
                      fieldState.error ? "p-invalid" : ""
                    }`}
                    {...field}
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
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Multi Select</label>
            <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name" 
            filter placeholder="Select Cities" maxSelectedLabels={3} className="form-control-select" />
          </div>
        </div> */}
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Autocomplete</label>
            <AutoComplete dropdown field="name" virtualScrollerOptions={{ itemSize: 38 }} value={selectedCountry} suggestions={filteredCountries} 
            completeMethod={search} onChange={(e) => setSelectedCountry(e.value)} placeholder="Enter to Search" />
          </div>
        </div> */}
        {/* <!-- Col --> */}
        {/* <div className='col-md-3'>
          <div className='form-group'>
            <label className='form-label'>Send Link</label>
            <div className="p-inputgroup">
              <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" 
              placeholder="Select a City" className="form-control-select" />
              <Button icon="pi pi-send" />
            </div>
          </div>
        </div> */}
        {/* <!-- Col --> */}
      </div>
      {/* <!-- Row --> */}
    </>
  );
};

export default Dropdowns;
