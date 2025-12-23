import React, { useMemo, useRef, useState } from "react";
import PasswordRules from "./PasswordRules";
import { Controller, useForm } from "react-hook-form";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

import { Dialog } from "primereact/dialog";
import { useMutation } from "react-query";
import { updatePassword } from "../../../services/authService";
import { useSelector } from "react-redux";
import { CurrentUser, setUser } from "../../../store/slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { setToken } from "../../utills/auth";
import { useDispatch } from "react-redux";
import { TermsConditionsData } from "../../utills/termsConditions";
import { jwtDecode } from "jwt-decode";

const UpdatePassword = () => {
  const { userTypeId, id, isNewUser } = useSelector(CurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(
    isNewUser && userTypeId == 140 ? true : false
  );

  const defaultValues = {
    oldPassword: "",
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

  const oldPassword = watch("oldPassword", "");

  const newPassword = watch("newPassword", "");

  const { mutate, isLoading } = useMutation(updatePassword);

  const handleUpdatePassword = (values) => {
    // console.log("form values", values);
    mutate(
      {
        userId: id,
        oldPassword: values?.oldPassword,
        newPassword: values?.newPassword,
        hasTermsAndCondition: userTypeId == 140 ? 1 : 0,
        srcFrom: "web",
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success("Password Updated Successfully");
            setToken(res?.data?.token);
            // dispatch(setUser(res?.data?.user));

            const decodedToken = jwtDecode(res?.data?.userObjectToken);
            dispatch(setUser(decodedToken?.user));
            navigate("/");
          } else {
            toast.error(res?.data?.error);
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

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div className="page-wrap">
      <div className="page-body">
        <div className="update-password-container">
          <div className="header">
            <div>Update password</div>
          </div>
          <div className="body">
            <div className="row">
              <div className="col-lg-8 col-md-12 col-sm-6">
                <PasswordRules />
              </div>
              <div className="col-lg-4 col-md-12 col-sm-6">
                <form
                  onSubmit={handleSubmit(handleUpdatePassword)}
                  className="d-flex flex-column gap-4 mt-5"
                >
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <Controller
                      name="oldPassword"
                      control={control}
                      rules={{
                        required: "Current Password is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <Password
                            toggleMask
                            className={`${fieldState.error ? "p-invalid" : ""}`}
                            feedback={false}
                            placeholder="Enter Current Password"
                            autoComplete="off"
                            {...field}
                          />
                          <div className="p-error">
                            {errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <Controller
                      name="newPassword"
                      control={control}
                      rules={{
                        required: "New Password is required.",
                        minLength: {
                          value: 12,
                          message: "Password must have at least 12 characters",
                        },
                        validate: {
                          currentPasswordValidation: (value) =>
                            value !== oldPassword ||
                            "The password should not be the Current password",
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
                          <div className="p-error">
                            {errors[field.name]?.message}
                          </div>
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
                          value: 12,
                          message: "Password must have at least 12 characters",
                        },
                        validate: {
                          passwordMatch: (value) =>
                            value === newPassword ||
                            "The passwords do not match",
                          currentPasswordValidation: (value) =>
                            value !== oldPassword ||
                            "The password should not be the Current password",
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
                            feedback={false}
                            placeholder="Enter Confirm New Password"
                            autoComplete="off"
                            {...field}
                          />
                          <div className="p-error">
                            {errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                  <Button
                    className="btn btn-primary btn-full-wid"
                    label="Update Password"
                    type="submit"
                    loading={isLoading}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title terms-condition-title">
              Terms and Condition
            </div>
          </div>
        }
        pt={{
          root: {
            className: "terms-condition-dialog",
          },
          footer: {
            className: "terms-condition-footer",
          },
        }}
        closable={false}
        visible={visible}
        position={"center"}
        onHide={handleClose}
        draggable={false}
        resizable={false}
        //footer={<button onClick={handleClose}>Accept and Continue</button>}
      >
        <div className="policy-content">
          <div className="term-description">
            You acknowledge that you have read, understood, and agreed to be
            bound by these Terms and Conditions with respect to the Last mile
            logistics service agreement made and entered into by and between You
            (hereinafter referred to as “Dealer”) and ki Mobility Solutions Pvt
            Ltd (hereinafter designated as “KMS”). Upon clicking the “I Agree”,
            you or the entity whom you represent shall be bound by these Terms
            and Conditions (Agreement).
          </div>

          <div className="term-description">
            Dealer and KMS are referred to herein solely as a “Party,” or
            collectively as the “Parties.”
          </div>

          <div className="term-description">
            WHEREAS Dealer requires last mile logistics assistance services for
            the movement of Cars from one or more Receipt Point(s) to one or
            more Delivery Point(s) by truck transportation, pipeline terminals,
            pipelines, rail transportation and marine movements;
          </div>
          <div className="term-description">
            KMS shall provide logistics support assistance (Services) to the
            Dealer in transferring the cars from the Dealer stockyard to Dealer
            touchpoints through flatbed trucks.
          </div>

          <div className="term-description">
            NOW, THEREFORE, in accordance with the following terms and
            conditions, the Dealer declares and agrees to the following:
          </div>

          <ul className="terms-list">
            {TermsConditionsData?.map((terms, i) => (
              <li key={i} className="terms-content">
                {terms}
              </li>
            ))}
          </ul>

          <div className="term-description">
            I hereby covenant that I am authorized to accept these Terms and
            Conditions on my own behalf or on behalf of the entity whom I
            represent. I further covenant that once agreed, I/my company/firm
            shall be bound by this Agreement.
          </div>
        </div>

        <div className="d-flex">
          <button className="ms-auto" onClick={handleClose}>
            Accept and Continue
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default UpdatePassword;
