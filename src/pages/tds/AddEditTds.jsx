import React, { useState } from "react";
import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import { useNavigate, useParams } from "react-router";
import { Button } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { CloseIcon, FolderIcon } from "../../utills/imgConstants";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import CustomFileUpload from "../../components/common/CustomFileUpload";
import { useMutation, useQuery } from "react-query";
import { getTdsFormData, saveTds } from "../../../services/tdsService";
import moment from "moment";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import { fileFromUrl } from "../../utills/fileFromUrl";

const AddEditTdS = () => {
  const navigate = useNavigate();
  const user = useSelector(CurrentUser);
  const [files, setFiles] = useState();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const { id } = useParams();

  const { mutate, isLoading } = useMutation(saveTds);

  const { data } = useQuery(
    ["gettdsformData"],
    () =>
      getTdsFormData({
        id,
      }),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          const formValues = {
            amount: res?.data?.data?.amount,
            description: res?.data?.data?.description,
            period: res?.data?.data?.period
              ?.split(" - ")
              ?.map((el) => moment(el, "DD-MM-YYYY").toDate()),
          };
          console.log("formValues", formValues);
          Object.entries(formValues)?.forEach(([key, value]) =>
            setValue(key, value)
          );
          fileFromUrl(
            res?.data?.data?.tdsLogAttachmentUrl,
            res?.data?.data?.attachment
          )?.then((file) => {
            if (file) {
              setValue("file", [file]);
              setFiles({ file: [file] });
            } else {
              console.log("Failed to create File object from URL.");
            }
          });
        }
      },
    }
  );

  const MenuItems = [
    { label: <div onClick={() => navigate("/tds")}>TDS</div> },
    { label: <div>{id ? "Edit" : "Add"} TDS</div> },
  ];

  const onFormSubmit = (values) => {
    console.log("tds form values", values);
    let formData = new FormData();

    Object.entries({
      ...values,
      period: `${moment(values.period[0]).format("DD-MM-YYYY")} - ${
        values.period[1]
          ? moment(values.period[1]).format("DD-MM-YYYY")
          : moment(values.period[0]).format("DD-MM-YYYY")
      }`,
      file: values.file[0],
      dealerCode: user?.code,
      from: "api",
      ...(id ? { id: id } : {}),
      ...(id && files?.deletedFilePath
        ? { deletedFilePath: files?.deletedFilePath }
        : {}),
    })?.forEach(([key, value]) => formData.append(key, value));

    mutate(formData, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          navigate("/tds");
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    });
  };

  const handleClose = () => {
    navigate("/tds");
    reset({});
  };

  const handleFileSelect = () => {
    if (id) {
      setFiles({
        ...files,
        deletedFilePath: data?.data?.data?.crmAttachmentPath,
      });
    }
  };
  return (
    <div className="page-wrap">
      {<CustomBreadCrumb items={MenuItems} milestone={false} />}

      <div className="page-body">
        <div className="page-content-wrap form-page without-step">
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
                <div className="d-flex gap-1_2 align-items-center">
                  <h5 className="page-content-title text-caps">
                    {id ? "Edit" : "New"} TDS
                  </h5>
                </div>
              </div>
              <div className="page-content-header-right">
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
          </div>
          <div className="page-content-body">
            <form onSubmit={handleSubmit(onFormSubmit)} id="formName">
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Period</label>
                    <Controller
                      name="period"
                      rules={{
                        required: "Period is required",
                      }}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <Calendar
                            id="dateRange"
                            value={field.value}
                            hourFormat="24"
                            dateFormat="dd-mm-yy"
                            {...field}
                            placeholder="Select Period"
                            showIcon
                            iconPos={"left"}
                            selectionMode="range"
                            numberOfMonths={2}
                            maxDate={new Date()}
                          />
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Amount</label>
                    <Controller
                      name="amount"
                      rules={{
                        required: "Amount is required",
                      }}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            className={`form-control`}
                            placeholder="Enter Amount"
                            keyfilter={"pnum"}
                          />

                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label required">Description</label>
                    <Controller
                      name="description"
                      rules={{
                        required: "Description is required",
                      }}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <InputTextarea rows={1} cols={10} {...field} />

                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">Attachments</label>
                    <Controller
                      name="file"
                      control={control}
                      rules={{ required: "Attachment is required" }}
                      render={({ field, fieldState }) => {
                        return (
                          <>
                            <CustomFileUpload
                              //multiple={true}
                              name={field.name}
                              field={field}
                              accept="application/pdf"
                              defaultValues={files?.file}
                              onFileSelect={handleFileSelect}
                            />
                            <div className="p-error">
                              {errors && errors[field.name]?.message}
                            </div>
                          </>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary"
                  type="submit"
                  form="formName"
                  loading={isLoading}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTdS;
