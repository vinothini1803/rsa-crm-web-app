import React, { useEffect, useState } from "react";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { CloseIcon, UserShieldIcon } from "../../../utills/imgConstants";
import { useNavigate, useParams } from "react-router";
import { ProgressBar } from "primereact/progressbar";
import { Steps } from "primereact/steps";
import { classNames } from "primereact/utils";
import BasicInfoForm from "./BasicInfoForm";
import AddressDetails from "./AddressDetails";
import MechanicsForm from "./MechanicsForm";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { aspFormData, saveAsp } from "../../../../services/adminService";
import { Button } from "primereact/button";

const AddASPMaster = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [aspValues, setAspValues] = useState([]);
  const { aspId } = useParams();

  const defaultValues = {
    //aspId: null,
    tier: "",
    axaptaCode: "",
    salutationId: "",
    workingHourId: "",
    code: "",
    name: "",
    workshopName: "",
    email: "",
    whatsAppNumber: "",
    contactNumber: "",
    performanceId: "",
    priorityId: "",
    isOwnPatrol: 1,
    rmId: "",
    businessHourId: null,
    latitude: "",
    longitude: "",
    addressLineOne: "",
    addressLineTwo: "",
    stateId: "",
    cityId: "",
    location: "",
    pincode: "",
    hasMechanic: 1,
    isFinanceAdmin: 0,
    financeAdminId: null,
    // "userId": null,
    userName: "",
    password: "",
    //"changePassword": 1,
    status: 1,
    /*  aspMechanics: [
      {
        //"aspMechanicId": null,
        name: "",
        code: "",
        email: "",
        contactNumber: "",
        alternateContactNumber: "",
        businessHourId: null,
        latitude: "",
        longitude: "",
        performanceId: "",
        priorityId: "",
        address: "",
        //"userId": null,
        userName: "",
        password: "",
        // "changePassword": 1,
        status: 1,
      },
    ], */
  };
  const methods = useForm({ defaultValues });
  const errors = methods.formState.errors;

  // console.log("errors", errors);
  const control = methods.control;
  const hasMechanic = useWatch({
    control,
    name: "hasMechanic",
  });
  const isOwnPatrol = useWatch({
    control,
    name: "isOwnPatrol",
  });

  const [formFields, setFormFields] = useState({
    Basic: {},
    Address: {},
  });
  const [formStateTab, setFormStateTab] = useState(null);

  const { data } = useQuery(
    ["aspFormData", aspId],
    () =>
      aspFormData({
        aspId: aspId ? aspId : "",
      }),
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (aspId) {
            const aspValues = res?.data?.data?.asp;
            setAspValues(aspValues);

            const formValues = methods.getValues();

            if (isOwnPatrol == 1) {
              formValues.userName = "";
              formValues.password = "";
              methods.setValue("userName", ""); // Ensure form state is updated
              methods.setValue("password", "");
            }

            Object.keys(formValues)?.forEach((field, i) => {
              // console.log("dealer field", field, i);
              methods.setValue(`${field}`, res?.data?.data?.asp?.[field]);
            });

            methods.setValue("cityId", res?.data?.data?.asp?.city);
            methods.setValue("changePassword", 0);
            /*    methods.setValue(
              "aspMechanics",
              res?.data?.data?.asp?.aspMechanics?.map((item) => {
                const newObj = {};
                Object.keys(defaultValues.aspMechanics[0]).forEach((key) => {
                  newObj[key] = item[key]; // Assign values from `rest` based on `defaultValues` keys
                });
                return {
                  aspMechanicId: item?.id,
                  ...newObj,
                  changePassword: 0,
                  userId: item?.user?.id,
                };
              })
            ); */
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
            res?.data?.errors?.forEach((el) => toast.error(el));
          }
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const { mutate, isLoading } = useMutation(saveAsp);
  // console.log("aspformdata", data);
  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/admin/asp-master")}>ASP Master</div>
      ),
    },
    { label: <div>{aspId ? "Edit" : "Add"} ASP</div> },
  ];
  // console.log("formFields", formFields);
  const items = [
    {
      label: "Basic Info",
      content: (
        <BasicInfoForm
          formErrors={formFields?.Basic?.errors}
          errors={errors}
          salutations={data?.data?.data?.extras?.salutations}
          workingHours={data?.data?.data?.extras?.workingHours}
          priorities={data?.data?.data?.extras?.priorities}
          performances={data?.data?.data?.extras?.performances}
          serviceRegionalManagers={
            data?.data?.data?.extras?.serviceRegionalManagers
          }
          tiers={data?.data?.data?.extras?.tiers}
          financeAdminList={data?.data?.data?.extras?.financeAdminList}
          aspValues={aspValues}
        />
      ),
      className:
        formFields?.Basic.errors &&
        Object.keys(formFields?.Basic.errors).length == 0
          ? "step-complete"
          : "not-complete",
    },
    {
      label: "Address Details",
      content: (
        <AddressDetails
          formErrors={formFields?.Address?.errors}
          states={data?.data?.data?.extras?.states}
        />
      ),
      className:
        formFields?.Address.errors &&
        Object.keys(formFields?.Address.errors).length == 0
          ? "step-complete"
          : "not-complete",
    },

    /*     ...(hasMechanic
      ? [
          {
            label: "Mechanics",
            content: (
              <MechanicsForm
                formErrors={formFields?.mechanic?.errors}
                priorities={data?.data?.data?.extras?.priorities}
                performances={data?.data?.data?.extras?.performances}
              />
            ),
            className:
              formFields?.mechanic?.errors &&
              Object.keys(formFields?.mechanic?.errors).length == 0
                ? "step-complete"
                : "not-complete",
          },
        ]
      : []), */
  ];

  const formValidate = () => {
    // console.log("form validated", activeIndex);
    methods.trigger(Object.keys(methods.getValues()));
    setFormStateTab(activeIndex);
  };

  const handleBack = () => {
    setActiveIndex(activeIndex - 1);
    //setFormStateTab(activeIndex - 1);
  };
  const handleNext = () => {
    formValidate();
    setActiveIndex(activeIndex + 1);
  };

  useEffect(() => {
    // console.log("formStateTab useEffect", formStateTab);
    // console.log("errors", errors);
    // const formErrors = methods.formState.errors;
    if (
      (formStateTab && Object.keys(errors).length > 0) ||
      formStateTab !== null
    ) {
      const tabName = Object.keys(formFields)[formStateTab];
      // console.log("tabName", tabName);
      const tabErrors = {
        [tabName]: { errors: { ...errors }, tabkey: formStateTab },
      };
      // console.log("tabErrors", tabErrors);
      // Update only the specific key without altering other keys
      setFormFields((prevFormFields) => {
        return {
          ...prevFormFields,
          ...tabErrors,
        };
      });
    }
  }, [JSON.stringify(errors), formStateTab]);

  // console.log("userId", data?.data?.data?.asp?.user?.id);

  const onErrorTab = (formerrors) => {
    // console.log("onerror tab");

    let errorTabs = Object.values(formFields);

    errorTabs.splice(-1); // For Ignore Last Tab errors
    // console.log("error Tabs", errorTabs);
    const Errortabkey = errorTabs?.find(
      (el) => Object?.values(el.errors)?.length > 0
    )?.tabkey;
    // console.log("error tab key", Errortabkey);

    if (Errortabkey !== undefined && activeIndex == items.length - 1) {
      setActiveIndex(Errortabkey);
    } else {
      //API Mutation
      if (formerrors?.length == 0) {
        const formValues = methods.getValues();
        // console.log("asp form values", formValues);

        if (isOwnPatrol == 1) {
          if (aspId || !aspId) {
            // Delete fields if the condition is met
            formValues.userName = "";
            formValues.password = "";
            methods.setValue("userName", ""); // Ensure form state is updated
            methods.setValue("password", "");
          }
        }

        if (aspId && !formValues.changePassword) {
          delete formValues.password;
        }

        mutate(
          {
            ...formValues,
            cityId: formValues.cityId?.id,
            /*   aspMechanics: methods.getValues()?.hasMechanic
            
            aspMechanics: methods.getValues()?.hasMechanic
              ? methods.getValues()?.aspMechanics?.map((mech) => {
                  if (!mech.changePassword && mech.aspMechanicId) {
                    delete mech.password;
                    return mech;
                  }
                  return mech;
                })
              : [], */
            ...(aspId && {
              aspId: aspId,
              userId: data?.data?.data?.asp?.user?.id,
            }),
            hasMechanic: formValues?.isOwnPatrol
              ? formValues?.isOwnPatrol
              : formValues?.hasMechanic,
            ...(aspId &&
              formValues.changePassword && { password: formValues.password }),
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success) {
                toast.success(res?.data?.message);
                navigate("/admin/asp-master");
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

  // const onErrorTab = (formerrors) => {
  //   console.log("onerror tab");
  //   let errorTabs = Object.values(formFields);

  //   errorTabs.splice(-1); // For Ignore Last Tab errors
  //   console.log("error Tabs", errorTabs);
  //   const Errortabkey = errorTabs?.find(
  //     (el) => Object?.values(el.errors)?.length > 0
  //   )?.tabkey;
  //   console.log("error tab key", Errortabkey);

  //   if (Errortabkey !== undefined && activeIndex == items.length - 1) {
  //     setActiveIndex(Errortabkey);
  //   } else {

  //     //API Mutation
  //     if (formerrors?.length == 0) {
  //       const formValues = methods.getValues();
  //       console.log("asp form values", formValues);

  //           if (isOwnPatrol == 1) {
  //     if (aspId || !aspId) {
  //       // Delete fields if the condition is met
  //        formValues.userName ="";
  //        formValues.password="";
  //        methods.setValue("userName", "");  // Ensure form state is updated
  //        methods.setValue("password", "");

  //     }
  //   }

  //       if (aspId && !formValues.changePassword) {
  //         delete formValues.password;
  //       }

  //       mutate(
  //         {
  //           ...methods.getValues(),
  //           cityId: formValues.cityId?.id,
  //           aspMechanics: methods.getValues()?.hasMechanic
  //             ? methods.getValues()?.aspMechanics?.map((mech) => {
  //                 if (!mech.changePassword && mech.aspMechanicId) {
  //                   delete mech.password;
  //                   return mech;
  //                 }
  //                 return mech;
  //               })
  //             : [],

  //           ...(aspId && {
  //             aspId: aspId,
  //             userId: data?.data?.data?.asp?.user?.id,
  //           }),

  //         },
  //         {
  //           onSuccess: (res) => {
  //             if (res?.data?.success) {
  //               toast.success(res?.data?.message);
  //               navigate("/admin/asp-master");
  //               methods.reset();
  //             } else {
  //               if (res?.data?.error) {
  //                 toast.error(res?.data?.error);
  //               } else {
  //                 res?.data?.errors.forEach((err) => toast.error(err));
  //               }
  //             }
  //           },
  //         }
  //       );
  //     }
  //   }
  // };

  const onSubmit = (data) => {
    // console.log("data onsubmission", data);

    setFormStateTab(activeIndex);
    onErrorTab([]); //To Move error Tab
  };
  const onError = (errors) => {
    // console.log("onerror occured", errors);
    setFormStateTab(activeIndex);
    onErrorTab(Object.keys(errors)); //To Move error Tab
  };
  const handleClose = () => {
    navigate("/admin/asp-master");
  };
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap steps-form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={UserShieldIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">
                    {aspId ? "Edit" : "Add"} ASP
                  </h5>
                </div>
              </div>
              <div className="page-content-header-right">
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
              {/*    <div className="page-content-header-right">
                <div className="header-progressbar-wrap">
                  <div className="header-progressbar-details  ">
                    <span className="header-progressbar-label">
                      Completion Percentage
                    </span>
                    <span className="header-progressbar-value">50 %</span>
                  </div>
                  <ProgressBar value={50} showValue={false}></ProgressBar>
                </div>
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div> */}
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
  );
};

export default AddASPMaster;
