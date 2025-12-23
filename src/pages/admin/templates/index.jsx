import React, { useContext, useState } from "react";
import "./style.less";
import CustomAccordion from "../roles/CustomAccordion";
import Search from "../../../components/common/Search";
import TemplateCustomAccordion from "./TemplateCustomAccordion";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FolderDocumentIcon } from "../../../utills/imgConstants";
import "./style.less";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Tooltip } from "bootstrap";
import { toast } from "react-toastify";

const Templates = () => {
  const [value, setValue] = useState();

  const methods = useForm({
    defaultValues: {
      firstname: "",
      insert_fields: "",
      message: "",
      subject: "",
      templates: [
        { title: "TVS Auto Assist" },

        {
          title: "TATA Motors Limited",
          children: [
            { 
              title: "SMS",
              image: FolderDocumentIcon,
              child: [
                {
                  title: "ASP",
                  subchild: [
                    {
                      id: 2,
                      title: "Case Cancellation",
                    },
                    {
                      id: 3,
                      title: "Notification",
                    },
                    {
                      id: 4,
                      title: "Customer on the Way - Info",
                    },
                    {
                      id: 5,
                      title: "ASP to wait at BD Spot - Info",
                    },
                    {
                      id: 6,
                      title: "Vehicle Damaged During the Towing",
                    },
                  ],
                },
              ],
            },
            {
              title: "Customer",
            },
            {
              title: "Regional Manager",
            },
            {
              title: "Zonal Manager",
            },
            {
              title: "Dealer",
            },
            {
              title: "Email",
              image: FolderDocumentIcon,
            },
          ],
        },
        { title: "Royal Sundaramc" },
      ],
    },
  });
  const errors = methods?.formState?.errors;
  const FormSubmit = (values) => {
    if (values) {
      toast.success("Saved Successfully", {
        autoClose: 1000,
      });
      methods.reset()
    }
  };

  const handleSearch = (values) => {};
  console.log("vlae", value);

  return (
    <div className="page-wrap">
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="template-page-content-body">
            <div>
              <h4 className="templates-title">Templates</h4>
              <div>
                <FormProvider id="template-form" {...methods}>
                  <div className="row row-gap-3_4">
                    <div className="col-md-4">
                      <div className="form-group">
                        <div className="template-search">
                          <Search onChange={handleSearch} expand={true} />
                        </div>
                        <div className="template-accordion">
                          <TemplateCustomAccordion setValue={setValue} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="form-group">
                        <form onSubmit={methods.handleSubmit(FormSubmit)} id="template-form">
                          <div className="form-container">
                            <h5 className="template-form-title">SMS Content</h5>
                            <div className="col-md-6 mb-4_5">
                              <div className="form-group">
                                <label className="form-label">
                                  Insert Fields
                                </label>
                                <Controller
                                  name="insert_fields"
                                  control={methods.control}
                                  rules={{ required: "SMS Content is required." }}
                                  render={({ field, fieldState }) => (
                                    <>
                                    <Dropdown
                                      value={field.value}
                                      placeholder="Select Call  Center"
                                      options={[
                                        { label: "Center 1", value: "center1" },
                                        { label: "Center 2", value: "center2" },
                                      ]}
                                      optionLabel="label"
                                      onChange={(e) => field.onChange(e.value)}
                                    />
                                    <div className="p-error">
                                    {/* {errors[field.name]?.message} */}
                                    {errors && errors[field.name]?.message}
                                  </div>
                                  </>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-4_5">
                              <div className="form-group column-gap-3">
                                <label className="form-label">Subject</label>
                                <Controller
                                  name="subject"
                                  control={methods.control}
                                  rules={{ required: "Subject is required." }}
                                  render={({ field, fieldState }) => (
                                    <>
                                    <InputText
                                      {...field}
                                      placeholder="Eg : Arun Kumar"
                                    />
                                    {console.log("fiedstate",fieldState)}
                                    <div className="p-error">
                                    {/* {errors[field.name]?.message} */}
                                    {errors && errors[field.name]?.message}
                                  </div>
                                  </>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-4_5">
                              <div className="form-group">
                                <label className="form-label">Message</label>
                                <Controller
                                  name="message"
                                  control={methods.control}
                                  render={({ field, fieldState }) => (
                                    <InputTextarea
                                      {...field}
                                      cols={4}
                                      rows={5}
                                      placeholder="Dear ASP, Note tkt no: {vehicle_reg_no}has been cancelled hence do not proceed further. Call ASP toll free no: {asp_toll_free} and update"
                                      
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 template-bn">
                              <div>
                                <div className="d-flex gap-2 ms-auto">
                                  <button
                                    type={"submit"}
                                    className="btn btn-primary"
                                    form="template-form"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </FormProvider>
              </div>
            </div>
          </div>
          {/* <div className="page-content-footer">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex gap-2 ms-auto">
              <button className="btn btn-primary" form="permission-form">
                Save
              </button>
            </div>
          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default Templates;
