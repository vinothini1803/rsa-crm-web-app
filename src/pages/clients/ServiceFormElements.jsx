// ServiceFormElements.js
import React, { useEffect, useState } from "react";
import {
  Controller,
  useFormContext,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import DynamicFormCard from "../../components/common/DynamicFormCard";
import SubServiceFormElements from "./SubServiceFormElements";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { CollapsePlusIcon } from "../../utills/imgConstants";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import {
  subServiceClient,
  memberShipType,
} from "../../../services/masterServices";

const ServiceFormElements = ({
  item,
  control,
  resetField,
  index,
  removeField,
  formErrors,
  services,
  policyTypes,
  entitlements,
  lastClientServiceEntitlementId,
  setLastClientServiceEntitlementId,
  nameValue,
}) => {
  console.log("ServiceFormErrors", formErrors);
  const { control: controlService } = useFormContext();
  const selectedServiceId = useWatch({
    control,
    name: `clientServices[${index}].serviceId`,
  });
  const selectedPolicyType = useWatch({
    control,
    name: `clientServices[${index}].policyTypeId`,
  });
  const [lastSubServiceEntitlementId, setLastSubServiceEntitlementId] =
    useState(lastClientServiceEntitlementId);

  const {
    fields: subServiceFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `clientServices[${index}].subServices`,
  });
  //effect
  useEffect(() => {
    // Only add initial sub-service item if there are no existing sub-services
    if (subServiceFields.length === 0) {
      append({
        serviceId: "",
        entitlementId: "",
        limit: null,
        //clientServiceEntitlementId: lastSubServiceEntitlementId + 1
        clientServiceEntitlementId: null,
      });
      setLastSubServiceEntitlementId(lastSubServiceEntitlementId + 1);
    }
  }, [append, subServiceFields.length]);

  //subservice api
  const { data } = useQuery(
    ["subServiceClient", selectedServiceId],
    () =>
      subServiceClient({
        apiType: "dropdown",
        caseType: 31,
        serviceId: selectedServiceId,
      }),
    { enabled: selectedServiceId ? true : false }
  );

  const { data: memberShipData } = useQuery(
    ["memberShipType"],
    () =>
      memberShipType({
        clientName: nameValue,
      }),
    {
      enabled:
        nameValue !== undefined && nameValue !== null && nameValue !== ""
          ? true
          : false,
    }
  );

  const subServiceOptions = data?.data?.data;
  const memberShipTypeOptions = memberShipData?.data?.membership_types;
  //   console.log("member ship type", memberShipTypeOptions);
  const addSubService = (e) => {
    e.preventDefault();
    const newEntitlementId = lastSubServiceEntitlementId + 1;
    append({
      subServiceId: "",
      entitlementId: "",
      limit: null,
      //clientServiceEntitlementId: newEntitlementId ,
      clientServiceEntitlementId: null,
    });
    setLastSubServiceEntitlementId(newEntitlementId);
    setLastClientServiceEntitlementId(newEntitlementId);
  };
  //   console.log("==>>", subServiceFields.length);

  return (
    <DynamicFormCard
      title={`SERVICE - ${index + 1}`}
      addLabel={false}
      onRemove={removeField}
      removeIcon={index !== 0}
    >
      <div className="fields-row">
        <div className="form-field">
          <div className="row row-gap-3_4">
            <div className="col-md-2">
              <div className="form-group">
                <label className="form-label required">Service</label>
                <Controller
                  name={`clientServices[${index}].serviceId`}
                  control={control}
                  rules={{ required: "Service Name is required." }}
                  render={({ field }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        filter
                        placeholder="Select Service"
                        options={services}
                        optionValue="id"
                        optionLabel="name"
                        onChange={(e) => field.onChange(e.value)}
                      />

                      <div className="p-error">
                        {/* {errors[field.name]?.message} */}
                        {formErrors &&
                          formErrors?.clientServices?.[index]?.serviceId
                            ?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label className="form-label required">Policy Type</label>
                <Controller
                  name={`clientServices[${index}].policyTypeId`}
                  //name="type"
                  control={control}
                  rules={{ required: "Policy Type is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      {/* {console.log("field", field)} */}
                      <Dropdown
                        value={field.value}
                        filter
                        placeholder="Select Policy Type"
                        options={policyTypes}
                        optionValue="id"
                        optionLabel="name"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {/* {errors[field.name]?.message} */}
                        {formErrors &&
                          formErrors?.clientServices?.[index]?.policyTypeId
                            ?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            {selectedPolicyType == 433 && (
              <div className="col-md-2">
                <div className="form-group">
                  <label className="form-label required">Membership Type</label>
                  <Controller
                    name={`clientServices[${index}].membershipTypeId`}
                    //name="type"
                    control={control}
                    rules={{ required: "Membership Type  is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          filter
                          placeholder="Select Membership Type"
                          options={memberShipTypeOptions}
                          optionValue="id"
                          optionLabel="name"
                          onChange={(e) => field.onChange(e.value)}
                        />
                        <div className="p-error">
                          {/* {errors[field.name]?.message} */}
                          {formErrors &&
                            formErrors?.clientServices?.[index]
                              ?.membershipTypeId?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            )}
            <div className="col-md-2">
              <div className="form-group">
                <label className="form-label required">Total Service</label>
                <Controller
                  name={`clientServices[${index}].totalService`}
                  //name="type"
                  control={control}
                  rules={{ required: "Total Service  is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        value={field.value}
                        placeholder="Enter"
                        onKeyPress={(e) => {
                          if (!/^[0-9]$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      <div className="p-error">
                        {/* {errors[field.name]?.message} */}
                        {formErrors &&
                          formErrors?.clientServices?.[index]?.totalService
                            ?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="service-header">
              <div className="service-title form-label required">
                Sub Services
              </div>
            </div>
          </div>

          {/* Other fields such as Policy Type and Total Service */}
          {/* <div>Sub Services</div> */}
          {subServiceFields?.map((subItem, subIndex) => (
            <>
              {/* {console.log("sub index", subIndex)} */}
              <SubServiceFormElements
                key={subItem?.id}
                control={control}
                resetField={resetField}
                index={`${index}.subServices[${subIndex}]`}
                item={subItem}
                removeSubService={() => remove(subIndex)}
                formErrors={formErrors}
                entitlements={entitlements}
                subServiceOptions={subServiceOptions}
                showRemoveButton={subIndex != 0}
                subServiceIndex={subIndex}
                i={index}
              />
            </>
          ))}
          <Button
            className="btn btn-icon"
            icon={<CollapsePlusIcon />}
            text
            label="Add Sub Service"
            onClick={(e) => addSubService(e)}
            style={{ backgroundColor: "transparent" }}
          />
        </div>
      </div>
    </DynamicFormCard>
  );
};

export default ServiceFormElements;
