// SubServiceFormElements.js
import React, { useState, useEffect } from "react";
import { Controller, useWatch, useFormContext } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { RedCancelIcon } from "../../utills/imgConstants";
import { entitlementDropdown } from "../../../services/masterServices";
import { useQuery, useMutation } from "react-query";

const SubServiceFormElements = ({
  control,
  resetField,
  index,
  item,
  removeSubService,
  formErrors,
  entitlements,
  subServiceOptions,
  showRemoveButton,
  i,
  subServiceIndex,
}) => {
  const [hasLimitValue, setHasLimitValue] = useState(null);
  const { getValues } = useFormContext();
  console.log("SubServiceFormErrors==", formErrors);
  const enableLimit = useWatch({
    control,
    name: `clientServices[${index}].subServiceId`,
  });
  useEffect(() => {
    if (subServiceOptions !== undefined && subServiceOptions !== null) {
      const selectedOption = subServiceOptions.find((x) => x.id == enableLimit);
      setHasLimitValue(selectedOption);
    }
  }, [enableLimit, subServiceOptions]);

  // console.log("has limit id", hasLimitValue, enableLimit);
  const { data: entitlementData } = useQuery(
    [entitlementDropdown],
    () =>
      entitlementDropdown({
        subServiceId: enableLimit,
      }),
    { enabled: hasLimitValue?.hasEntitlement == true ? true : false }
  );
  // console.log("entitlementData", enableLimit);
  return (
    <div className="row row-gap-3_4">
      <div className="col-md-2 mb-3">
        <label className="form-label">Sub Service</label>
        <Controller
          name={`clientServices[${index}].subServiceId`}
          control={control}
          rules={{ required: " Sub service Name is required." }}
          render={({ field }) => (
            <Dropdown
              value={field.value}
              options={subServiceOptions}
              optionValue="id"
              optionLabel="name"
              onChange={(e) => {
                field.onChange(e);
                resetField(`clientServices[${index}].limit`);
                resetField(`clientServices[${index}].entitlementId`);
                // console.log('Ent Limit =>', getValues(`clientServices[${index}].limit`));
              }}
              placeholder="Select Sub Service"
            />
          )}
        />
        {formErrors?.clientServices?.[i]?.subServices?.[subServiceIndex]
          ?.subServiceId && (
          <div className="p-error">
            {
              formErrors?.clientServices[i]?.subServices[subServiceIndex]
                ?.subServiceId?.message
            }
          </div>
        )}
      </div>
      {(hasLimitValue?.hasLimit || enableLimit?.hasLimit) && (
        <div className="col-md-2 mb-3">
          <label className="form-label">Limit</label>
          <Controller
            name={`clientServices[${index}].limit`}
            control={control}
            rules={{ required: "Limit is required." }}
            render={({ field }) => (
              <InputText {...field} placeholder="Enter Limit" />
            )}
          />
          {formErrors?.clientServices?.[i]?.subServices?.[subServiceIndex]
            ?.limit && (
            <div className="p-error">
              {
                formErrors?.clientServices[i]?.subServices[subServiceIndex]
                  ?.limit?.message
              }
            </div>
          )}
        </div>
      )}
      {(hasLimitValue?.hasEntitlement || enableLimit?.hasEntitlement) && (
        <div className="col-md-2 mb-3">
          <label className="form-label">Entitlement</label>
          <Controller
            name={`clientServices[${index}].entitlementId`}
            control={control}
            rules={{ required: " Entitlement is required." }}
            render={({ field }) => (
              <Dropdown
                value={field.value}
                options={entitlementData?.data?.data}
                optionValue="id"
                optionLabel="name"
                onChange={(e) => {
                  field.onChange(e.value);
                }}
                placeholder="Select Entitlement"
              />
            )}
          />
          {formErrors?.clientServices?.[i]?.subServices?.[subServiceIndex]
            ?.entitlementId && (
            <div className="p-error">
              {
                formErrors?.clientServices[i]?.subServices[subServiceIndex]
                  ?.entitlementId?.message
              }
            </div>
          )}
        </div>
      )}

      {showRemoveButton && (
        <div className="d-flex col-md-1 align-items-center pt-3">
          <div className="form-group">
            <img
              src={RedCancelIcon}
              alt="cancel"
              onClick={removeSubService}
              type="button"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubServiceFormElements;
