// Service.js
import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import ServiceFormElements from "./ServiceFormElements";
import { Button } from "primereact/button";
import { CollapsePlusIcon } from "../../utills/imgConstants";

const Service = ({
  formErrors,
  services,
  policyTypes,
  entitlements,
  nameValue,
}) => {
  console.log("formErrors", formErrors);
  const { control, resetField } = useFormContext();
  const [lastClientServiceEntitlementId, setLastClientServiceEntitlementId] =
    useState(1);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "clientServices",
  });

  useEffect(() => {
    // Only add initial service item if there are no existing services
    if (fields.length === 0) {
      // console.log("Appending first item with clientServiceId 1");
      append({
        serviceId: "",
        policyTypeId: "",
        totalService: "",
        membershipTypeId: null,
        membershipTypeName: "",
        //clientServiceId: 1,
        clientServiceId: null,
        subServices: [
          {
            //clientServiceEntitlementId: 1,
            clientServiceEntitlementId: null,
            subServiceId: "",
            limit: null,
            entitlementId: "",
          },
        ],
        //subService: [],
      });
      setLastClientServiceEntitlementId(1);
    }
  }, [append, fields.length]);
  // console.log("field length", fields.length);

  const addFormItem = (e) => {
    e.preventDefault();
    const newEntitlementId = lastClientServiceEntitlementId + 1;
    append({
      //clientServiceId: fields.length + 1,
      clientServiceId: null,
      serviceId: "",
      policyTypeId: "",
      membershipTypeId: null,
      membershipTypeName: "",
      totalService: "",
      subServices: [
        {
          //clientServiceEntitlementId: newEntitlementId,
          clientServiceEntitlementId: null,
          subServiceId: "",
          limit: null,
          entitlementId: "",
        },
      ],
      //subService: [],
    });
    setLastClientServiceEntitlementId(newEntitlementId);
  };

  return (
    <div>
      <div className="row row-gap-3_4">
        {fields.map((item, i) => (
          <ServiceFormElements
            key={i}
            index={i}
            item={item}
            control={control}
            resetField={resetField}
            removeField={() => remove(i)}
            formErrors={formErrors}
            services={services}
            policyTypes={policyTypes}
            entitlements={entitlements}
            lastClientServiceEntitlementId={lastClientServiceEntitlementId}
            setLastClientServiceEntitlementId={
              setLastClientServiceEntitlementId
            }
            nameValue={nameValue}
          />
        ))}
      </div>
      <Button
        className="btn btn-icon"
        icon={<CollapsePlusIcon />}
        text
        label="Add New Service"
        onClick={(e) => addFormItem(e)}
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
};

export default Service;
