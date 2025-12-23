import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import {
  BuildingIcon,
  CallCentreIcon,
  CloseIcon,
} from "../../utills/imgConstants";
import { Steps } from "primereact/steps";
import { ProgressBar } from "primereact/progressbar";
import BasicInfoForm from "./BasicInfoForm";
import Service from "./Service";
import AccountDetailForm from "./AccountDetailsForm";
import AddressDetailForm from "./AddressDetailForm";
import { useMutation, useQuery } from "react-query";
import {
  clientFormData,
  entitlements,
  saveClient,
  subService,
} from "../../../services/masterServices";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import {
  subServiceClient,
  memberShipType,
} from "../../../services/masterServices";
import { usersList } from "../../../services/adminService";
import Entitlement from "./Entitlement";

const AddAccount = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [formStateTab, setFormStateTab] = useState(null);
  const [formValues, setFormValues] = useState();
  const [formFields, setFormFields] = useState({
    BasicInfo: {},
    Account: {},
    Address: {},
    Service: { clientServices: [], subServices: [] },
    entitlements: {},
  });
  const [hasEntitlement, setEntitlement] = useState(null);
  const defaultValues = {
    //clientId: null, //null for add
    name: "",
    serialNumberCategoryId: null,
    invoiceCode: "",
    invoiceName: "",
    businessCategoryId: "",
    legalName: "",
    tradeName: "",
    axaptaCode: "",
    financialDimension: "",
    gstin: "",
    customerTollFreeNumber: "",
    asmTollFreeNumber: "",
    nmTollFreeNumber: "",
    fhTollFreeNumber: "",
    aspTollFreeNumber: "",
    rmTollFreeNumber: "",
    didNumber: "",
    dialerCampaignName: "",
    callCenterIds: "",
    spocUserId: "",
    email: "",
    contactNumber: "",
    vehicleTypeIds: "",
    vehicleMakeIds: "",
    status: 1,
    //billingAddressId: 23, //the value will come at edit case
    billingAddress: "",
    billingAddressCountryId: "",
    billingAddressStateId: "",
    billingAddressCityId: "",
    billingAddressPincode: "",
    //shippingAddressId: 24, //the value will come at edit case
    shippingAddress: "",
    shippingAddressCountryId: "",
    shippingAddressStateId: "",
    shippingAddressCityId: "",
    shippingAddressPincode: "",
    clientServices: [
      {
        clientServiceId: null, // null for add
        serviceId: "",
        policyTypeId: "",
        membershipTypeId: null,
        membershipTypeName: "",
        totalService: "",
        subServices: [
          {
            clientServiceEntitlementId: null, // null for add
            subServiceId: "",
            limit: "",
            entitlementId: "",
          },
        ],
      },
    ],
    entitlements: [],
  };
  // console.log("hasEntitlement==",hasEntitlement)
  const methods = useForm({
    mode: "onChange",
    defaultValues,
  });
  const nameValue = useWatch({
    control: methods.control, // 'control' is necessary to specify which form to watch
    name: "name", // The field name you want to watch
  });
  const errors = methods.formState.errors;
  // console.log("errors", errors);

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
  const { data: managerData, refetch: refetchManagerData } = useQuery(
    ["managerList"],
    () => usersList({ apiType: "dropdown", roleId: 21 }) // Tvs Spoc id is 21 //call center Manager Id is 16
  );
  const { mutate: saveMutate, isLoading } = useMutation(saveClient);

  const { data } = useQuery(
    ["clientFormData"],
    () =>
      clientFormData({
        clientId: clientId ? clientId : "",
      }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (res?.data?.data?.client) {
            //console.log("response ==>>", res?.data?.data?.client);
            setEntitlement(res?.data?.data?.extras?.hasLimitEntitlements);
            const clientService = res?.data?.data?.client?.clientServices?.map(
              (services, i) => {
                return services?.membershipTypeId;
              }
            );
            // console.log("Form Keys =>", Object.keys(defaultValues));

            Object.keys(defaultValues)?.forEach((field) => {
              if (
                field === "entitlements" &&
                Array.isArray(res?.data?.data?.client?.clientEntitlements)
              ) {
                methods.setValue(
                  "entitlements",
                  res?.data?.data?.client?.clientEntitlements?.map((item) => ({
                    entitlementId: item?.entitlementId,
                    unit: null,
                    limit: item?.limit,
                  }))
                );
              } else {
                methods.setValue(`${field}`, res?.data?.data?.client?.[field]);
              }
            });
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    }
  );

  const MenuItems = [
    { label: <div onClick={() => navigate("/clients")}>Accounts</div> },
    { label: <div>{clientId ? "Edit" : "Add"} Account</div> },
  ];

  const items = [
    {
      label: "Basic Info",
      content: <BasicInfoForm formErrors={formFields?.BasicInfo?.errors} />,
      className:
        formFields?.BasicInfo.errors &&
        Object.keys(formFields?.BasicInfo.errors).length == 0
          ? "step-complete"
          : "not-complete",
    },
    {
      label: "Account Details",
      content: (
        <AccountDetailForm
          formErrors={formFields?.Account?.errors}
          callCenters={data?.data?.data?.extras?.callCenters}
          businessCategory={data?.data?.data?.extras?.businessCategories}
          spocList={managerData?.data?.data}
          vehicleType={data?.data?.data?.extras?.vehicleTypes}
          vehicleMake={data?.data?.data?.extras?.vehicleMakes}
        />
      ),
      className:
        formFields?.Account.errors &&
        Object.keys(formFields?.Account.errors).length == 0
          ? "step-complete"
          : "not-complete",
    },
    {
      label: "Address Details",
      content: (
        <AddressDetailForm
          country={data?.data?.data?.extras?.countries}
          formErrors={formFields?.Address?.errors}
        />
      ),
      className:
        formFields?.Address.errors &&
        Object.keys(formFields?.Address.errors).length == 0
          ? "step-complete"
          : "not-complete",
    },
    {
      label: "Service Info",
      content: (
        <Service
          services={data?.data?.data?.extras?.services}
          policyTypes={data?.data?.data?.extras?.policyTypes?.filter(
            (policy) => policy.name !== "Non Member"
          )}
          entitlements={data?.data?.data?.extras?.entitlements}
          nameValue={nameValue}
          formErrors={formFields?.Service?.errors}
        />
      ),
      className:
        formFields?.Service.errors &&
        Object.keys(formFields?.Service?.errors).length == 0
          ? "step-complete"
          : "not-complete",
      // className:
      // formFields?.Service?.errors &&
      // (Object.keys(formFields?.Service?.errors).length > 0 ||
      //  (formFields?.Service?.errors?.subServices &&
      //    formFields?.Service?.errors?.subServices.some(
      //      (subService) => Object.keys(subService.errors || {}).length > 0
      //    )))
      //   ? "not-complete"
      //   : "step-complete",
    },
    {
      label: "Entitlement",
      content: (
        <Entitlement
          services={data?.data?.data?.extras?.hasLimitEntitlements}
          formErrors={formFields?.entitlements?.errors}
        />
      ),
      className:
        formFields?.entitlements.errors &&
        Object.keys(formFields?.entitlements?.errors).length == 0
          ? "step-complete"
          : "not-complete",
    },
  ];

  // console.log("formFields?.Service?.errors", formFields?.Service?.errors);
  const formValidate = () => {
    methods.trigger(Object.keys(methods.getValues()));
    setFormStateTab(activeIndex);
  };

  const handleClose = () => {
    navigate("/clients");
  };
  useEffect(() => {
    //To get and set Tab errors
    if (
      (formStateTab && Object.keys(errors).length > 0) ||
      formStateTab !== null
    ) {
      // console.log("error completed");
      const Tabname = Object.keys(formFields)[formStateTab];

      const TabErrors = {
        [Tabname]: { errors: { ...errors }, tabkey: formStateTab },
      };
      // console.log("tab name", Tabname, TabErrors);

      setFormFields({
        ...formFields,
        ...TabErrors,
      });
    }
    const clientService = data?.data?.data?.client?.clientServices?.map(
      (services, i) => {
        return services?.membershipTypeId;
      }
    );

    clientService?.map((item, i) => {
      methods.setValue(`clientServices[${i}].membershipTypeId`, item);
    });
  }, [JSON.stringify(errors), formStateTab, data, methods]);

  // console.log("Methods", methods.getValues());
  const onErrorTab = async () => {
    let errorTabs = Object.values(formFields);
    errorTabs.splice(-1); // For Ignore Last Tab errors
    // console.log("error Tabs", errorTabs);

    const Errortabkey = errorTabs?.find(
      (el) => el?.errors && Object.values(el.errors).length > 0
    )?.tabkey;
    // console.log("error tab key", Errortabkey);
    const isValid = await methods.trigger();
    const formErrors = await methods.formState.errors;
    // console.log("Form Errors:", formErrors);

    if (Errortabkey !== undefined) {
      setActiveIndex(Errortabkey);
    } else {
      if (isValid) {
        //API
        //const formValues = methods.getValues();
        setFormValues(methods.getValues());

        // console.log("methods.getValues()", methods.getValues());
        const getUpdatedFormValues = (formValues) => {
          // console.log("formValues", formValues, subService?.subServiceId?.id);
          return {
            ...formValues,
            clientServices: formValues?.clientServices?.map(
              (clientService) => ({
                ...clientService,
                membershipTypeId: clientService?.membershipTypeId
                  ? clientService?.membershipTypeId
                  : null,
                membershipTypeName:
                  clientService?.membershipTypeId != null
                    ? memberShipData?.data?.membership_types.filter(
                        (x) => x.id == clientService?.membershipTypeId
                      )[0]?.name
                    : "",
                subServices: clientService?.subServices?.map((subService) => ({
                  clientServiceEntitlementId:
                    subService?.clientServiceEntitlementId,
                  subServiceId: subService?.subServiceId,
                  limit: subService?.limit ? subService.limit : null,
                  entitlementId: subService?.entitlementId
                    ? subService.entitlementId
                    : null,
                })),
              })
            ),
          };
        };

        const updatedFormValues = getUpdatedFormValues(methods.getValues());

        const clientData = {
          ...(clientId && {
            serialNumberCategoryId:
              data?.data?.data?.client?.serialNumberCategoryId,
            billingAddressId: data?.data?.data?.client?.billingAddressId,
            shippingAddressId: data?.data?.data?.client?.shippingAddressId,
          }),
          // clientId: 190,
          // entitlementId: data?.data?.clientServices?.subServices?.entitlementId ?? null,
          ...updatedFormValues,
        };
        // console.log("updatedFormValues==>>", updatedFormValues);
        // console.log("Client Data Payload:", clientData);
        saveMutate(
          {
            ...(clientId && {
              serialNumberCategoryId:
                data?.data?.data?.client?.serialNumberCategoryId,
              billingAddressId: data?.data?.data?.client?.billingAddressId,
              shippingAddressId: data?.data?.data?.client?.shippingAddressId,
            }),

            clientId: clientId ?? null,
            ...(updatedFormValues?.clientServices?.subServices
              ?.entitlementId && {
              entitlementId:
                updatedFormValues?.clientServices?.subServices?.entitlementId,
            }),
            ...updatedFormValues,
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success) {
                toast.success(res?.data?.message);
                navigate("/clients");
                methods.reset();
              } else {
                if (res?.data?.error) {
                  toast.error(res?.data?.error);
                } else {
                  res?.data?.errors.forEach((err) => toast.error(err));
                }
              }
            },
          }
        );
      }
    }
  };
  const nextStep = () => {
    // methods.getValues('uaser')
    formValidate();
    setActiveIndex(activeIndex + 1);
  };

  const backStep = () => {
    setActiveIndex(activeIndex - 1);
  };
  const onSubmit = (data) => {
    // console.log("data", data);
    setFormStateTab(activeIndex);
    onErrorTab(); //To Move error Tab
  };
  const onError = () => {
    setFormStateTab(activeIndex);
    onErrorTab(); //To Move error Tab
  };
  // console.log("form state tab", formStateTab);
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap mb-3">
                <div className="page-content-title-icon bg-blue">
                  <img
                    className="img-fluid"
                    src={BuildingIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title ">New Account</h5>
                </div>
              </div>
              {/*  <div className="page-content-header-right">
                <div className="header-progressbar-wrap">
                  <div className="header-progressbar-details  ">
                    <span className="header-progressbar-label">
                      Completion Percentage
                    </span>
                    <span className="header-progressbar-value">50 %</span>
                  </div>
                  <ProgressBar value={50} showValue={false}></ProgressBar>
                </div>
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div> */}
            </div>

            <div>
              <Steps
                model={items}
                activeIndex={activeIndex}
                onSelect={(e) => {
                  if (e.index !== activeIndex) {
                    //To avoid State update on same Index Click
                    setActiveIndex(e.index);
                    formValidate();
                  }
                  /*  if(clientId == undefined && clientId == null && activeIndex+1 == activeIndex){
                    methods.reset();
                    //window.location.reload();
                  } */
                }}
                readOnly={false}
              />
            </div>
          </div>
          <div className="page-content-body">
            <FormProvider {...methods}>
              <form
                id="hook-form"
                onSubmit={methods.handleSubmit(onSubmit, onError)}
              >
                {items[activeIndex]["content"]}
              </form>
            </FormProvider>
          </div>

          <div className="page-content-footer">
            <div>
              <div className="d-flex align-items-center justify-content-between">
                {activeIndex !== 0 && (
                  <div>
                    <button className="btn btn-white" onClick={backStep}>
                      Back
                    </button>
                  </div>
                )}
                {items.length - 1 !== activeIndex && (
                  <div className="ms-auto">
                    <button className="btn btn-primary" onClick={nextStep}>
                      Next
                    </button>
                  </div>
                )}
                {items.length - 1 == activeIndex && (
                  <div>
                    <Button
                      loading={isLoading}
                      className="btn btn-primary"
                      form="hook-form"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccount;
