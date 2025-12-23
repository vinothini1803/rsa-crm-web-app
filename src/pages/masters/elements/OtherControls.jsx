import React, { useEffect, useState } from "react";

import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

import { Controller, useFormContext, useFormState } from "react-hook-form";

const OtherControls = ({ formErrors }) => {
  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let prevMonth = month === 0 ? 11 : month - 1;
  let prevYear = prevMonth === 11 ? year - 1 : year;
  let nextMonth = month === 11 ? 0 : month + 1;
  let nextYear = nextMonth === 0 ? year + 1 : year;

  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext(); // retrieve all hook methods

  const [date, setDate] = useState(null);
  const [dates, setDates] = useState(null);
  const [singleDate, setSingleDate] = useState(null);
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);

  let minDate = new Date();
  // minDate.setMonth(prevMonth);
  // minDate.setFullYear(prevYear);

  let maxDate = new Date();
  maxDate.setMonth(nextMonth);
  maxDate.setFullYear(nextYear);

  const onIngredientsChange = (e) => {
    let _ingredients = [...ingredients];

    if (e.checked) _ingredients.push(e.value);
    else _ingredients.splice(_ingredients.indexOf(e.value), 1);

    setIngredients(_ingredients);
  };

  const dateHandle = (e) => {
    console.log('Handling => ', e);
    setSingleDate(e.value)
  }

  //console.log('Errors => ',errors)
  return (
    <>
      <div className="row row-gap-3_4 mb-3_4">
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Date Picker</label>
            <Controller
              name="date"
              control={control}
              rules={{ required: "Date is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Calendar
                    id="singleDate"
                    name="date"
                    baseZIndex={10}
                    value={singleDate}
                    dateFormat="dd-mm-yy"
                    className={`${fieldState.error ? "p-invalid" : ""}`}
                    onChange={(e) => dateHandle}
                    placeholder="Select Date"
                    showIcon
                    iconPos={"left"}
                    readOnlyInput
                    {...field}
                    
                  />{" "}
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
            <label className="form-label">Date Picker (Min & Max)</label>
            <Calendar
              id="singleDateMin"
              value={date}
              dateFormat="dd-mm-yy"
              onChange={(e) => setDate(e.value)}
              placeholder="Select Date"
              showIcon
              iconPos={"left"}
              showMinMaxRange
              minDate={minDate}
              maxDate={maxDate}
              readOnlyInput
              showTime
              hourFormat="12"
            />
          </div>
        </div>
        {/* <!-- Col --> */}
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Date Range</label>
            <Calendar
              id="dateRange"
              value={dates}
              dateFormat="dd-mm-yy"
              onChange={(e) => setDates(e.value)}
              placeholder="Select Date Range"
              selectionMode="range"
              numberOfMonths={2}
              showIcon
              iconPos={"left"}
              readOnlyInput
            />
          </div>
        </div>
        {/* <!-- Col --> */}
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Date Range (Min & Max)</label>
            <Calendar
              id="dateRangeMin"
              value={dates}
              dateFormat="dd-mm-yy"
              onChange={(e) => setDates(e.value)}
              placeholder="Select Date Range"
              selectionMode="range"
              numberOfMonths={2}
              showIcon
              iconPos={"left"}
              showMinMaxRange
              minDate={minDate}
              maxDate={maxDate}
              readOnlyInput
            />
          </div>
        </div>
        {/* <!-- Col --> */}
      </div>
      {/* <!-- Row --> */}
      <div className="row row-gap-3_4 mb-3_4">
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Radio</label>
            <div className="common-radio-group gap-5">
              <div className="common-radio-item">
                <RadioButton
                  inputId="radio_yes"
                  name="pizza"
                  value="Yes"
                  onChange={(e) => setIngredient(e.value)}
                  checked={ingredient === "Yes"}
                />
                <label htmlFor="radio_yes" className="common-radio-label">
                  Yes
                </label>
              </div>
              <div className="common-radio-item">
                <RadioButton
                  inputId="radio_no"
                  name="pizza"
                  value="No"
                  onChange={(e) => setIngredient(e.value)}
                  checked={ingredient === "No"}
                />
                <label htmlFor="radio_no" className="common-radio-label">
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Col --> */}
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Checkbox</label>
            <div className="common-checkbox-group gap-3">
              <div className="common-checkbox-item">
                <Checkbox
                  inputId="ingredient1"
                  name="pizza"
                  value="Cheese"
                  onChange={onIngredientsChange}
                  checked={ingredients.includes("Cheese")}
                />
                <label htmlFor="ingredient1" className="common-checkbox-label">
                  Cheese
                </label>
              </div>
              <div className="common-checkbox-item">
                <Checkbox
                  inputId="ingredient2"
                  name="pizza"
                  value="Mushroom"
                  onChange={onIngredientsChange}
                  checked={ingredients.includes("Mushroom")}
                />
                <label htmlFor="ingredient2" className="common-checkbox-label">
                  Mushroom
                </label>
              </div>
              <div className="common-checkbox-item">
                <Checkbox
                  inputId="ingredient3"
                  name="pizza"
                  value="Pepper"
                  onChange={onIngredientsChange}
                  checked={ingredients.includes("Pepper")}
                />
                <label htmlFor="ingredient3" className="common-checkbox-label">
                  Pepper
                </label>
              </div>
              <div className="common-checkbox-item">
                <Checkbox
                  inputId="ingredient4"
                  name="pizza"
                  value="Onion"
                  onChange={onIngredientsChange}
                  checked={ingredients.includes("Onion")}
                />
                <label htmlFor="ingredient4" className="common-checkbox-label">
                  Onion
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Col --> */}
      </div>
      {/* <!-- Row --> */}
    </>
  );
};

export default OtherControls;
