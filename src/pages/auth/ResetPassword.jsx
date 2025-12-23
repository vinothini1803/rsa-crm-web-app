import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Link, useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { LeftIcon } from "../../utills/imgConstants";
import { useMutation } from "react-query";
import { resetPassword } from "../../../services/authService";

const ResetPassword = () => {
  useEffect(() => {
    document.title = "Reset Password | RSA CRM";
  }, []);

  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(resetPassword);
  let [searchParams, setSearchParams] = useSearchParams();

  const defaultValues = {
    newPassword: "",
    confirm_password: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
    watch,
  } = useForm({ defaultValues });
  const password = useRef({});
  password.newPassword = watch("newPassword", "");

  const onSubmit = (data) => {
    mutate(
      {
        id: searchParams.get("id"),
        resetToken: searchParams.get("token"),
        newPassword: data?.newPassword,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            navigate("/login");
            reset();
          } else {
            if (res?.data?.error) {
              toast?.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((err) => toast?.error(err));
            }
            if (res?.data?.tokenExpired) {
              navigate("/forgot-password");
            }
          }
        },
      }
    );
  };

  const validateUppercase = (value) => {
    return (
      /[A-Z]/.test(value) ||
      "Password must contain at least one uppercase letter"
    );
  };

  const validateLowercase = (value) => {
    return (
      /[a-z]/.test(value) ||
      "Password must contain at least one lowercase letter"
    );
  };

  const validateSpecialCharacter = (value) => {
    return (
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value) ||
      "Password must contain at least one special character"
    );
  };

  return (
    <>
      <div className="reset-wrap">
        <Link className="auth-back-btn" to="/forgot-password">
          {" "}
          <img src={LeftIcon} />
        </Link>
        <h4 className="auth-right-content-title">Reset Your Password</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex flex-column gap-4 mt-5"
        >
          <div className="form-group">
            <label className="form-label">New Password</label>
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: "New Password is required.",
                minLength: {
                  // value: 8,
                  value: 12,
                  // message: "Password must have at least 8 characters",
                  message: "Password must have at least 12 characters",
                },
                validate: {
                  validateUppercase,
                  validateSpecialCharacter,
                  validateLowercase,
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <Password
                    toggleMask
                    className={`${fieldState.error ? "p-invalid" : ""}`}
                    placeholder="Enter New Password"
                    autoComplete="off"
                    {...field}
                  />
                  <div className="p-error">{errors[field.name]?.message}</div>
                </>
              )}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <Controller
              name="confirm_password"
              control={control}
              rules={{
                required: "Confirm New Password is required.",
                minLength: {
                  // value: 8,
                  value: 12,
                  // message: "Password must have at least 8 characters",
                  message: "Password must have at least 12 characters",
                },
                validate: (value) =>
                  value === password.newPassword ||
                  "The passwords do not match",
                validateUppercase,
                validateSpecialCharacter,
                validateLowercase,
              }}
              render={({ field, fieldState }) => (
                <>
                  <Password
                    toggleMask
                    className={`${fieldState.error ? "p-invalid" : ""}`}
                    feedback={false}
                    placeholder="Enter Confirm New Password"
                    autoComplete="off"
                    {...field}
                  />
                  <div className="p-error">{errors[field.name]?.message}</div>
                </>
              )}
            />
          </div>
          <Button
            className="btn btn-primary btn-full-wid"
            label="Change Password"
            type="submit"
            loading={isLoading}
          />
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
