import React, { useEffect, useState } from "react";
import {
  useFormContext,
  Controller,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const Entitlement = ({ services }) => {
  const { control, setValue, trigger } = useFormContext();
  const [lastClientServiceEntitlementId, setLastClientServiceEntitlementId] =
    useState(1);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "entitlements",
  });

  const ENTITLEMENT_OPTIONS =
    services?.map((item) => ({
      id: item?.id,
      name: item?.name,
      unit: [item?.unit] || [], // should be array of { id, name }
    })) || [];

  const entitlements = useWatch({ control, name: "entitlements" }) || [];

  useEffect(() => {
    if (fields.length === 0 && services?.length > 0) {
      const newFields = services.map((ent) => ({
        entitlementId: ent.id,
        unit: null,
        limit: "",
      }));
      append(newFields); // Initial append
      setLastClientServiceEntitlementId(services.length);
      // Add this timeout to trigger validation after append
      setTimeout(() => {
        newFields.forEach((_, index) => {
          trigger(`entitlements.${index}.limit`);
        });
      }, 100);
    }
  }, [append, fields.length, services, trigger]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fields.length > 0) {
        trigger(); // This will trigger validation for all fields
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [fields.length, trigger]);

  const getFilteredEntitlementOptions = (currentIndex) => {
    const selectedIds = entitlements
      .filter((_, idx) => idx !== currentIndex)
      .map((e) => e.entitlementId)
      .filter(Boolean); // Remove nulls
    return ENTITLEMENT_OPTIONS.filter((opt) => !selectedIds.includes(opt.id));
  };

  useEffect(() => {
    entitlements?.forEach((entitlement, index) => {
      if (entitlement?.entitlementId && !entitlement?.unit) {
        const matchedEntitlement = ENTITLEMENT_OPTIONS.find(
          (opt) => opt.id === entitlement.entitlementId
        );

        const firstUnitId = matchedEntitlement?.unit?.[0]?.id || null;

        if (firstUnitId) {
          setValue(`entitlements.${index}.unit`, firstUnitId);
          trigger(`entitlements.${index}.limit`);
        }
      }
    });
  }, [entitlements, ENTITLEMENT_OPTIONS, setValue, trigger]);

  return (
    <div className="row row-gap-3_4">
      {fields.map((field, index) => {
        const selectedEntitlementId = entitlements?.[index]?.entitlementId;

        const selectedEntitlement = ENTITLEMENT_OPTIONS.find(
          (item) => item?.id === selectedEntitlementId
        );

        const unitOptions =
          selectedEntitlement?.unit?.map((u) => ({
            id: u.id,
            name: u.name,
          })) || [];

        return (
          <React.Fragment key={field.id}>
            {/* Entitlement Dropdown */}
            <div className="col-md-4">
              <div className="form-group ">
                <label className="form-label required">Entitlement</label>
                <Controller
                  name={`entitlements.${index}.entitlementId`}
                  control={control}
                  rules={{ required: "Entitlement is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        {...field}
                        options={getFilteredEntitlementOptions(index)}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select Entitlement"
                        className={fieldState.error ? "p-invalid" : ""}
                        onChange={(e) => {
                          const selectedId = e.value;
                          field.onChange(e.value);

                          const selected = ENTITLEMENT_OPTIONS.find(
                            (item) => item.id === selectedId
                          );
                          const firstUnit = selected?.unit?.[0] || null;
                          //  console.log("firstUnit",selected)
                          setValue(
                            `entitlements.${index}.unit`,
                            firstUnit?.id || null
                          );
                        }}
                        disabled
                        // showClear
                      />
                      {fieldState.error && (
                        <div className="p-error">
                          {fieldState.error.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Unit Dropdown */}
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label required">Unit</label>
                <Controller
                  name={`entitlements.${index}.unit`}
                  control={control}
                  rules={{ required: "Unit is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        {...field}
                        options={unitOptions}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select Unit"
                        className={fieldState.error ? "p-invalid" : ""}
                        disabled
                      />

                      {fieldState.error && (
                        <div className="p-error">
                          {fieldState.error.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Limit Input */}
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label required">Limit</label>
                <Controller
                  name={`entitlements.${index}.limit`}
                  control={control}
                  rules={{ required: "Limit is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        keyfilter="pint"
                        placeholder="Enter Limit"
                        className={`form-control ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                        {...field}
                      />
                      {fieldState.error && (
                        <div className="p-error">
                          {fieldState.error.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Remove Button */}
            {/* <div className="col-md-1 d-flex align-items-end">
              <Button
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => remove(index)}
                type="button"
              >
                remove
              </Button>
            </div> */}
          </React.Fragment>
        );
      })}

      {/* Add Button */}
      {/* <div className="col-12">
        <Button
          label="Add Entitlement"
          type="button"
          onClick={() =>
            append({
              entitlementId: null,
              unit: null,
              limit: "",
            })
          }
        />
      </div> */}
    </div>
  );
};

export default Entitlement;
