import React, { useEffect, useMemo, useState } from "react";
import {
  Controller,
  useForm,
  FormProvider,
  useFormState,
} from "react-hook-form";
import { ProgressBar } from "primereact/progressbar";
import { Steps } from "primereact/steps";

import { FolderIcon, CloseIcon } from "../../../utills/imgConstants";

import InputFields from "./InputFields";
import Dropdowns from "./Dropdowns";
import FileUploads from "./FileUploads";
import OtherControls from "./OtherControls";
import { InputText } from "primereact/inputtext";

const Element = () => {
  const defaultValues = {
    username: "",
    phone: "",
    link: "",
    date: "",
  };

  const methods = useForm({
    mode: "onChange",
    defaultValues,
  });
  const errors = methods.formState.errors;

  const [activeIndex, setActiveIndex] = useState(0);
  const [formFields, setFormFields] = useState({
    Input: {},
    Dropdown: {},
    Others: {},
  });
  const [formStateTab, setFormStateTab] = useState(null);
  console.log("formFields", formFields, formFields?.Input.errors);
  const items = [
    {
      label: "Input",
      data: <InputFields formErrors={formFields?.Input?.errors} />,
      className:
        formFields?.Input.errors &&
        Object.keys(formFields?.Input.errors).length == 0
          ? "step-complete"
          : "not-complete",

      command: (event) => {},
    },
    {
      label: "Dropdown",
      data: (
        <Dropdowns
          control={methods.control}
          formErrors={formFields?.Dropdown?.errors}
        />
      ),
      className:
        formFields?.Dropdown.errors &&
        Object.keys(formFields?.Dropdown.errors).length == 0
          ? "step-complete"
          : "not-complete",

      command: (event) => {},
    },
    {
      label: "Others",
      data: <OtherControls formErrors={formFields?.Others?.errors} />,
      className:
        formFields?.Others.errors &&
        Object.keys(formFields?.Others.errors).length == 0
          ? "step-complete"
          : "not-complete",
      command: (event) => {},
    },
    {
      label: "Payment",
      data: <FileUploads control={methods.control} />,
      command: (event) => {},
    },
  ];

  const formValidate = () => {
    methods.trigger(Object.keys(methods.getValues()));
    setFormStateTab(activeIndex);
  };

  const nextStep = () => {
    // methods.getValues('uaser')

    formValidate();
    setActiveIndex(activeIndex + 1);
  };

  const backStep = () => {
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
    console.log('data',data)
    setFormStateTab(activeIndex);
    onErrorTab(); //To Move error Tab
  };
  const onError = () => {
    setFormStateTab(activeIndex);
    onErrorTab(); //To Move error Tab
  };

  return (
    <div className="page-wrap">
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={FolderIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">Elements</h5>
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
                <button className="btn btn-close">
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
          {/* <!-- Page Content Header --> */}
          <div className="page-content-body">
            <FormProvider {...methods}>
              <form
                id="hook-form"
                onSubmit={methods.handleSubmit(onSubmit, onError)}
              >
                {items[activeIndex]["data"]}
              </form>
            </FormProvider>
          </div>
          {/* <!-- Page Content Body --> */}
          <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-between">
              
              <div className="d-flex gap-2">
                {activeIndex !== 0 && (
                  <button className="btn btn-white" onClick={backStep}>
                    Back
                  </button>
                )}
                {items.length - 1 !== activeIndex && (
                  <button className="btn btn-primary" onClick={nextStep}>
                    Next
                  </button>
                )}
                {items.length - 1 == activeIndex && (
                  <button className="btn btn-primary" form="hook-form">
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* <!-- Page Content Footer --> */}
        </div>
        {/* <!-- Page Content Wrap --> */}
      </div>
      {/* <!-- Page Body --> */}
    </div>
  );
};

export default Element;
