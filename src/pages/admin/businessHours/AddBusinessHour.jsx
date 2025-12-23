import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { Steps } from "primereact/steps";
import { BusinessHourIcon, CloseIcon } from "../../../utills/imgConstants";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BusinessHours from "./BusinessHours";
import OperatingHours from "./OperatingHours";
import HolidayList from "./HolidayList";
import { toast } from "react-toastify";
import { ProgressBar } from "primereact/progressbar";

const AddBusinessHour = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const methods = useForm({
    defaultValues: {
      mode: "onChange",
      name: "",
      timezone: "",
      description: "",
      opreatinghours: "customize",
      holidayList: [{ date: "", holidayName: "", status: "" }],
      customhoursList: [
        {
          status: "",
          day: "Monday",
          startTime: "",
          endTime: "",
        },
        {
          status: "",
          day: "Tuesday",
          startTime: "",
          endTime: "",
        },
        {
          status: "",
          day: "Wednesday",
          startTime: "",
          endTime: "",
        },
        {
          status: "",
          day: "Thursday",
          startTime: "",
          endTime: "",
        },
        {
          status: "",
          day: "Friday",
          startTime: "",
          endTime: "",
        },
        {
          status: "",
          day: "Saturday",
          startTime: "",
          endTime: "",
        },
        {
          status: "",
          day: "Sunday",
          startTime: "",
          endTime: "",
        },
      ],
    },
  });
  const errors = methods.formState.errors;
  const [formFields, setFormFields] = useState({
    Basic: {},
    Operatinghours: {},
    HolidayList:{},
  });
  const [formStateTab, setFormStateTab] = useState(null);
  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/admin/business-hours")}>
          Business Hours
        </div>
      ),
    },
    { label: <div>Add Business Hours</div> },
  ];
  
  const items = [
    {
      label: "Business Hours",
      content: <BusinessHours formErrors={formFields?.Basic?.errors} />,
      className:
        formFields?.Basic.errors &&
        Object.keys(formFields?.Basic.errors).length == 0
          ? "step-complete"
          : "not-complete",
    },
    {
      label: "Operating Hours",
      content: <OperatingHours />,
      className:
      formFields?.Operatinghours.errors &&
      Object.keys(formFields?.Operatinghours.errors).length == 0
        ? "step-complete"
        : "not-complete",
    },
    {
      label: "Holiday list",
      content: <HolidayList formErrors={formFields?.HolidayList?.errors}/>,
      className:
      formFields?.HolidayList.errors &&
      Object.keys(formFields?.HolidayList.errors).length == 0
        ? "step-complete"
        : "not-complete",
    },
  ];
  const formValidate = () => {
    methods.trigger(Object.keys(methods.getValues()));
    setFormStateTab(activeIndex);
  };
  const handleClose = () => {
    navigate("/admin/business-hours");
    methods.reset()
  };
  const handleNext = () => {
    // methods.getValues('uaser')
    formValidate();
    setActiveIndex(activeIndex + 1);
  };
  const handleBack = () => {
    setActiveIndex(activeIndex - 1);
  };

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

  const onErrorTab = () => {
    let errorTabs = Object.values(formFields);
    errorTabs.splice(-1); // For Ignore Last Tab errors
    console.log("error Tabs", errorTabs);
    const Errortabkey = errorTabs?.find(
      (el) => Object.values(el.errors).length > 0
    )?.tabkey;
    console.log("error tab key", Errortabkey);
    if (Errortabkey !== undefined) {
      setActiveIndex(Errortabkey);
    } else {
      //API Mutation
      console.log("API Mutation");
    }
  };

  const onSubmit = (data) => {
    console.log("data", data);
    setFormStateTab(activeIndex);
    onErrorTab(); //To Move error Tab
    if (data) {
      toast.success("Added Successfully", {
        autoClose: 1000,
      });
      navigate("/admin/business-hours");
   
      methods.reset()
    }
   
  };

  const onError = () => {
    setFormStateTab(activeIndex);
    onErrorTab(); //To Move error Tab
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
                    src={BusinessHourIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">Add Business Hours</h5>
                </div>
              </div>
              <div className="page-content-header-right">
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
                  }
                }}
                readOnly={false}
              />
            </div>
          </div>
          <div className="page-content-body">
            <FormProvider {...methods}>
              <form
                id="business-hour-form"
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
                    <button
                      className="btn btn-primary"
                      type="submit"
                      form="business-hour-form"
                    >
                      Save
                    </button>
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

export default AddBusinessHour;
