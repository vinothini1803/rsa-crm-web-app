import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import RequestSent from "./RequestSent";
import { useMutation } from "react-query";
import { deleteAccount } from "../../../services/authService";
import { useNavigate } from "react-router";

const DeleteAccount = () => {
  const { control, handleSubmit, formState: { errors },} = useForm();
  const [requestSent, SetRequestSent] = useState(false);
  const {mutate, isLoading} = useMutation(deleteAccount)
  const navigate = useNavigate();
  const handleSendRequest = (values) => {
    
  mutate({
    ...values
  },{
    onSuccess:(res)=>{
      if(res?.data?.success){
        SetRequestSent(true);
      }else{
        SetRequestSent(false);
      }
    }

  })
   
  };
const handleCancel = ()=>{
  navigate("/login") 
}
  return (
    <div>
      {requestSent ? (
        <RequestSent />
      ) : (
        <>
          <div className="delete-account-title">Delete Account !</div>
          <div className="delete-confirmation">
            Are you sure? You won't be able to retrieve your account and all of
            the data will be lost.
          </div>
          <form
            className={`d-flex flex-column ${Object.keys(errors)?.length > 0 ? "gap-0" : "gap-2"}`}
            onSubmit={handleSubmit(handleSendRequest)}
          >
            <div className="form-group">
              <label className="form-label">Name</label>
              <Controller
                name="username"
                control={control}
                rules={{
                  required: "Name is required.",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      type="text"
                      placeholder="Enter Name"
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                    />
                     <div className="p-error">{errors[field.name]?.message}</div>
                  </>
                )}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Id</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required.",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      type="text"
                      placeholder="Enter Email Id"
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      keyfilter={"email"}
                    />
                    <div className="p-error">{errors[field.name]?.message}</div>
                  </>
                )}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <Controller
                name="mobileno"
                control={control}
                rules={{
                  required: "Mobile Number is required.",
                  validate: {
                    matchPattern: (v) =>
                      /^([+]\d{2})?\d{10}$/.test(v) ||
                      "Mobile Number must be a valid number",
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      type="text"
                      placeholder="Enter Mobile Number"
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                      maxLength={10}
                      keyfilter={"pnum"}
                    />
                    <div className="p-error">{errors[field.name]?.message}</div>
                  </>
                )}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Reason</label>
              <Controller
                name="reason"
                control={control}
                rules={{
                  required: "Reason is required.",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextarea
                      rows={8}
                      cols={30}
                      type="text"
                      placeholder="Enter Reason"
                      {...field}
                      className={`form-control ${
                        fieldState.error ? "p-invalid" : ""
                      }`}
                    />
                     <div className="p-error">{errors[field.name]?.message}</div>
                  </>
                )}
              />
            </div>
            <div className="d-flex gap">
              <Button className="btn btn-white ms-auto" label="Cancel" onClick={handleCancel}></Button>
              <Button label="Submit Request" type="submit" loading={isLoading}></Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default DeleteAccount;
