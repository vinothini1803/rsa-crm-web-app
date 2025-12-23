import React, { useEffect, useMemo, useState } from "react";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { useNavigate, useParams } from "react-router";
import { CallCentreIcon, CloseIcon } from "../../../utills/imgConstants";
import { Steps } from "primereact/steps";
import { FormProvider, useForm } from "react-hook-form";
import BasicInfoForm from "./BasicInfoForm";
import AddressDetailsForm from "./AddressDetailsForm";
import { toast } from "react-toastify";
import { ProgressBar } from "primereact/progressbar";
import { useMutation, useQuery } from "react-query";
import {
  getdealerFormData,
  saveDealer,
} from "../../../../services/masterServices";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";
import { usersList } from "../../../../services/adminService";

const AddDealer = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [formFields, setFormFields] = useState({
    Basic: {},
    Address: {},
  });
  const [formStateTab, setFormStateTab] = useState(null);
  const { dealerId } = useParams();
  const defaultValues = {
    groupCode: "",
    code: "",
    name: "",
    legalName: "",
    tradeName: "",
    mobileNumber: "",
    email: "",
    gstin: "",
    pan: "",
    cin: "",
    typeId: "",
    clientId: "",
    isExclusive: 1,
    mechanicalType: 1,
    bodyPartType: 1,
    rsaPersonName: "",
    rsaPersonNumber: "",
    rsaPersonAlternateNumber: "",
    smName: "",
    smNumber: "",
    smAlternateNumber: "",
    oemAsmName: "",
    oemAsmNumber: "",
    oemAsmAlternateNumber: "",
    autoCancelForDelivery: 0,
    addressLineOne: "",
    addressLineTwo: "",
    correspondenceAddress: "",
    stateId: "",
    cityId: "",
    area: "",
    pincode: "",
    lat: "",
    long: "",
    zoneId: "",
    userName: "",
    password: "",
    changePassword: 0,
    status: 1,
    dropDealerIds: [],
    financeAdminUserId: "",
  };
  const methods = useForm({ defaultValues });
  const { data } = useQuery(
    ["dealerformData"],
    () =>
      getdealerFormData({
        dealerId: dealerId ? dealerId : "",
      }),
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (dealerId) {
            Object.keys(defaultValues)?.forEach((field) => {
              methods.setValue(`${field}`, res?.data?.data?.dealer[field]);
            });
            methods.setValue("changePassword", 0);
            methods.setValue("cityId", res?.data?.data?.dealer?.city);
            methods.setValue(
              "dropDealerIds",
              res?.data?.data?.dealer?.dropDealers?.map((el) => el?.dropDealer)
            );
            setFormFields({
              Basic: {
                errors: {},
                tabkey: 0,
              },
              Address: {
                errors: {},
                tabkey: 1,
              },
            });
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
      refetchOnWindowFocus: false,
    }
  );
  const { mutate, isLoading } = useMutation(saveDealer);

  //Get Finance Admin Users
  const { data: financeAdminUserData } = useQuery(
    ["financeAdminUserList"],
    () =>
      usersList({
        apiType: "dropdown",
        roleId: 31, //Finance Admin Role
      })
  );

  const errors = methods.formState.errors;

  const MenuItems = [
    { label: <div onClick={() => navigate("/admin/dealers")}>Dealer</div> },
    { label: <div>{dealerId ? "Edit" : "Add"} Dealer</div> },
  ];

  const items = [
    {
      label: "Basic Info",
      content: (
        <BasicInfoForm
          formErrors={formFields?.Basic?.errors}
          clients={data?.data?.data?.extras?.clients}
          types={data?.data?.data?.extras?.types}
          financeAdminUsers={financeAdminUserData?.data?.data}
        />
      ),
      className:
        formFields?.Basic.errors &&
        Object.keys(formFields?.Basic.errors).length == 0
          ? "step-complete"
          : "not-complete",

      command: (event) => {},
    },
    {
      label: "Address Details",
      content: (
        <AddressDetailsForm
          formErrors={formFields?.Address?.errors}
          states={data?.data?.data?.extras?.states}
          zones={data?.data?.data?.extras?.zones}
        />
      ),
      className:
        formFields?.Address.errors &&
        Object.keys(formFields?.Address.errors).length == 0
          ? "step-complete"
          : "not-complete",

      command: (event) => {},
    },
  ];

  const handleClose = () => {
    navigate("/admin/dealers");
    methods.reset();
  };
  const formValidate = () => {
    methods.trigger(Object.keys(methods.getValues()));
    setFormStateTab(activeIndex);
  };
  const handleNext = () => {
    // methods.getValues('uaser')
    formValidate();
    setActiveIndex(activeIndex + 1);
  };

  const handleBack = () => {
    setActiveIndex(activeIndex - 1);
  };

  console.log("formFields", formFields);
  useEffect(() => {
    //To get and set Tab errors
    if (
      (formStateTab && Object.keys(errors).length > 0) ||
      formStateTab !== null
    ) {
      console.log("error completed");
      const Tabname = Object.keys(formFields)[formStateTab];

      const TabErrors = {
        [Tabname]: { errors: { ...errors }, tabkey: formStateTab },
      };
      console.log("tab name", Tabname, TabErrors);

      setFormFields({
        ...formFields,
        ...TabErrors,
      });
    }
  }, [JSON.stringify(errors), formStateTab]);

  const onErrorTab = (formErrors) => {
    let errorTabs = Object.values(formFields);
    errorTabs.splice(-1); // For Ignore Last Tab errors
    const Errortabkey = errorTabs?.find(
      (el) => Object.values(el.errors).length > 0
    )?.tabkey;
    console.log("error tab key", Errortabkey);
    if (Errortabkey !== undefined && activeIndex == items.length - 1) {
      setActiveIndex(Errortabkey);
    } else {
      //API Mutation
      if (formErrors?.length == 0) {
        console.log("form values", methods.getValues());
        const formValues = methods.getValues();
        if (dealerId && !formValues.changePassword) {
          delete formValues.password;
        }
        mutate(
          {
            dealerId: dealerId ? dealerId : null,
            ...(dealerId && { userId: data?.data?.data?.dealer?.user.id }),
            ...formValues,
            cityId: formValues?.cityId?.id,
            ...(dealerId &&
              formValues.changePassword && { password: formValues.password }),
            dropDealerIds:
              formValues?.dropDealerIds?.length > 0
                ? formValues?.dropDealerIds?.map((dealer) => dealer?.id)
                : [],
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success) {
                toast.success(res?.data?.message);
                navigate("/admin/dealers");
              } else {
                if (res?.data?.error) {
                  toast.error(res?.data?.error);
                } else {
                  res?.data?.errors.forEach((el) => toast.error(el));
                }
              }
            },
          }
        );
      }
    }
  };

  const onSubmit = (data) => {
    setFormStateTab(activeIndex);
    onErrorTab([]); //To Move error Tab
  };

  const onError = (errors) => {
    setFormStateTab(activeIndex);

    onErrorTab(Object.keys(errors)); //To Move error Tab
  };
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page with-step">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={CallCentreIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">
                    {dealerId ? "Edit" : "Add"} Dealer
                  </h5>
                </div>
              </div>
              <div className="page-content-header-right">
                {/* <div className="header-progressbar-wrap">
                  <div className="header-progressbar-details  ">
                    <span className="header-progressbar-label">
                      Completion Percentage
                    </span>
                    <span className="header-progressbar-value">50 %</span>
                  </div>
                  <ProgressBar value={50} showValue={false}></ProgressBar>
                </div> */}
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>

            <div>
              <Steps
                model={items}
                activeIndex={activeIndex}
                onSelect={(e) => {
                  if (e.index !== activeIndex) {
                    //To avoid State update on same Index Click
                    setActiveIndex(e.index);
                    formValidate();
                    const formValues = methods.getValues();
                  }
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
                    <button className="btn btn-white" onClick={handleBack}>
                      Back
                    </button>
                  </div>
                )}
                {items.length - 1 !== activeIndex && (
                  <div className="ms-auto">
                    <button className="btn btn-primary" onClick={handleNext}>
                      Next
                    </button>
                  </div>
                )}
                {items.length - 1 == activeIndex && (
                  <div>
                    <Button
                      className="btn btn-primary"
                      type="submit"
                      form="hook-form"
                      loading={isLoading}
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

export default AddDealer;
