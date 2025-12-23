import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";
import { LeftIcon, SuccessMsgIconEle } from "../../utills/imgConstants";
import { useMutation } from "react-query";
import { forgotPassword } from "../../../services/authService";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  useEffect(() => {
    document.title = "Forgot Password | RSA CRM";
  }, []);
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(forgotPassword);
  const msgs = useRef(null);
  const defaultValues = {
    userName: "",
    emailOrMobile: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    console.log("Forgot Form Values => ", data);
    mutate(data, {
      onSuccess: (res) => {
        console.log("res", res);
        if (res?.data?.success) {
          msgs.current.show({
            icon: <SuccessMsgIconEle />,
            severity: "success",
            summary: res?.data?.message,
            closable: false,
          });

          reset();
        } else {
          if (res?.data?.error) {
            toast?.error(res?.data?.error);
          } else {
            res?.data?.errors?.forEach((err) => toast?.error(err));
          }
        }
      },
    });
  };

  return (
    <>
      <div className="forgot-wrap">
        <Link className="auth-back-btn" to="/login">
          {" "}
          <img src={LeftIcon} />
        </Link>
        <h4 className="auth-right-content-title">Forgot Password</h4>
        <p className="auth-right-content-descp">
          Enter the user details and we will send you an email with a password
          reset link
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex flex-column gap-4 mt-5"
        >
          <div className="form-group">
            <label className="form-label">Username</label>
            <Controller
              name="userName"
              control={control}
              rules={{
                required: "Username is required.",
              }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    type="text"
                    className={`form-control ${
                      fieldState.error ? "p-invalid" : ""
                    }`}
                    placeholder="Enter Username"
                    {...field}
                  />
                  <div className="p-error">{errors[field.name]?.message}</div>
                </>
              )}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email ID or Mobile No</label>
            <Controller
              name="emailOrMobile"
              control={control}
              rules={{ required: "Email ID or Mobile No is required." }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    type="text"
                    className={`form-control ${
                      fieldState.error ? "p-invalid" : ""
                    }`}
                    placeholder="Enter Email ID or Mobile No"
                    {...field}
                  />
                  <div className="p-error">{errors[field.name]?.message}</div>
                </>
              )}
            />
          </div>
          <Button
            className="btn btn-primary btn-full-wid"
            label="Send Reset Link"
            type="submit"
            loading={isLoading}
          />
          <Messages className="msg-inside-wrap auth-msg" ref={msgs} />
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
