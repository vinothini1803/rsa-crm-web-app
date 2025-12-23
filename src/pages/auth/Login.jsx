import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { DialogCloseSmallIcon, RequireLocationForLogin } from "../../utills/imgConstants";
import { useMutation } from "react-query";
import { login, authValidate } from "../../../services/authService";
import { setToken } from "../../utills/auth";
import { setUser } from "../../../store/slices/userSlice";
import { setPassword } from "../../../store/slices/passwordSlice";
import { useDispatch } from "react-redux";
import { firebaseToken } from "../../../services/firebaseService";
import FloatingCallButton from "../../components/common/FloatingCallButton";
import { Verify } from "react-puzzle-captcha";
import "react-puzzle-captcha/dist/react-puzzle-captcha.css";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const { mutate, isLoading } = useMutation(login);
  const dispatch = useDispatch();
  //const [password, setPassword] = useState()
  const [showCallButton, setShowCallButton] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(RequireLocationForLogin);

  useEffect(() => {
    document.title = "Login | RSA CRM";
  }, []);

  const navigate = useNavigate();
  const defaultValues = {
    username: "",
    password: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm({ defaultValues });

  const validateAuth = async (token) => {
    try {
      const response = await authValidate(token);
      if (!response?.data?.success) {
        const errorMsg = response?.data?.error || "Invalid Credentials";
        toast.error(errorMsg, { autoClose: 2000 });
        return false;
      } else {
        return true;
      }
    } catch (err) {
      toast.error("Invalid Credentials", { autoClose: 2000 });
      return false;
    }
  };

  const onSubmit = (data) => {
    // console.log("Login Form Values => ", data);
    if (data?.username.trim().length > 0 && data?.password.trim().length > 0) {
      // Check if location is required but not available
      if (RequireLocationForLogin && (!latitude || !longitude)) {
        toast.error("Location is required for login. Please allow location access and try again.", {
          autoClose: 3000,
        });
        return;
      }
      
      data.srcFrom = "web";
      data.latitude = latitude;
      data.longitude = longitude;
      mutate(data, {
        onSuccess: async (res) => {
          if (res?.data.success) {
            // IF TOKEN NOT EXISTS
            if (
              !res?.data?.token ||
              res?.data?.token == null ||
              res?.data?.token == undefined
            ) {
              toast.error("Invalid login credentials", { autoClose: 2000 });
              return;
            }

            // CHECK TOKEN IS VALID
            if (!(await validateAuth(res.data.token))) {
              return;
            }

            if (
              !res?.data?.userObjectToken ||
              res?.data?.userObjectToken == null ||
              res?.data?.userObjectToken == undefined
            ) {
              toast.error("Invalid login credentials", { autoClose: 2000 });
              return;
            }

            //document.cookie = `token=${res?.data?.token};Path=/;`; //To set Token
            setToken(res?.data?.token);
            // dispatch(setUser(res?.data?.user));

            const decodedToken = jwtDecode(res?.data?.userObjectToken);
            dispatch(setUser(decodedToken?.user));
            res.data.user = decodedToken?.user;

            dispatch(setPassword(data?.password));
            //setPassword(data?.password);
            setShowCallButton(true);

            toast.success(
              <div className="login-toast-wrap">
                <span className="login-toast-icon">👋 </span>{" "}
                <span className="login-toast-text">
                  Welcome {res?.data?.user?.name}
                </span>
              </div>,
              { icon: false, autoClose: 2000 }
            );
            if (res?.data?.showPasswordExpiryAlert) {
              setTimeout(() => {
                toast.error(res?.data?.passwordExpiryAlertContent);
              }, 1000);
            }
            reset();

            navigate(
              res?.data?.user?.isNewUser
                ? "/update-password"
                : [3, 8, 22, 23, 16, 21, 24, 25, 26, 27, 14, 32].includes(
                    res?.data?.user?.role?.id
                  )
                ? "/"
                : "/delivery-request"
              // (res?.data?.user?.role?.id == 3|| res?.data?.user?.role?.id == 8)? "/" : "/delivery-request"
            );
          } else {
            toast.error(res?.data?.error, {
              autoClose: 2000,
            });
            if (res?.data?.isPasswordExpired) {
              setTimeout(() => {
                window.open("/password-expired/reset", "_self");
              }, 3000);
            }
          }
        },
      });
    } else {
      if (data?.username.trim().length == 0) {
        toast.error("Username is required.");
      }
      if (data?.password.trim().length == 0) {
        toast.error("Password is required.");
      }
    }
  };
  const handleClose = () => {
    setVisible(false);
  };

  const handleCaptchaChange = () => {
    setCaptchaPassed(true);
  };

  useEffect(() => {
    if (RequireLocationForLogin) {
      getLocation();
    } else {
      setIsLocationLoading(false);
    }
  }, []);

  const getLocation = (showErrorToast = true) => {
    setIsLocationLoading(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by your browser. Please use a modern browser or enable location services.";
      setLocationError(errorMsg);
      setIsLocationLoading(false);
      if (showErrorToast) {
        toast.warning(errorMsg, { autoClose: 3000 });
      }
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds timeout
      maximumAge: 0, // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationError(null);
        setIsLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLocationLoading(false);
        
        let errorMessage = "Unable to get your location. ";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access in your browser settings and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable. Please check your device's location settings or try again.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out. Please try again.";
            break;
          default:
            errorMessage += "An unknown error occurred. Please try again.";
            break;
        }
        
        setLocationError(errorMessage);
        
        if (showErrorToast) {
          toast.error(
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Location Access Required</div>
              <div style={{ fontSize: '12px' }}>{errorMessage}</div>
              <div style={{ fontSize: '12px', marginTop: '4px', color: '#721c24' }}>
                Login is not allowed without location access. Please enable location services to continue.
              </div>
            </div>,
            { autoClose: 5000 }
          );
        }
      },
      options
    );
  };

  return (
    <>
      <div className="login-wrap">
        <h4 className="auth-right-content-title">Welcome Back!</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex flex-column gap-4"
        >
          <div className="form-group">
            <label className="form-label">Username</label>
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Username is required.",
                // validate: {
                //   matchPattern: (v) =>
                //     /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                //     "Email address must be a valid address",
                // },
              }}
              //rules={{ required: "Email ID is required." }}
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
            <label className="form-label">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Password
                    toggleMask
                    className={`${fieldState.error ? "p-invalid" : ""}`}
                    feedback={false}
                    placeholder="Enter Password"
                    autoComplete="on"
                    {...field}
                  />
                  <div className="p-error">{errors[field.name]?.message}</div>
                </>
              )}
            />
            {captchaPassed && (
              <div className="d-flex justify-content-end mt-2">
                <Link className="auth-link" to="/forgot-password">
                  Forgot Password ?
                </Link>
              </div>
            )}
            
            {captchaPassed && RequireLocationForLogin && locationError && (
              <div className="alert alert-danger mt-2" style={{ fontSize: '12px', padding: '8px' }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong>⚠️ Location Required:</strong> {locationError}
                </div>
                <div style={{ fontSize: '11px', marginBottom: '8px', color: '#721c24' }}>
                  You cannot login without location access. Please enable location services and try again.
                </div>
                <button
                  type="button"
                  onClick={() => getLocation(false)}
                  className="btn btn-sm btn-outline-primary"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                  disabled={isLocationLoading}
                >
                  {isLocationLoading ? 'Retrying...' : 'Retry Location'}
                </button>
              </div>
            )}
            
            {captchaPassed && RequireLocationForLogin && isLocationLoading && !locationError && (
              <div className="text-center mt-2" style={{ fontSize: '12px', color: '#666' }}>
                Getting your location...
              </div>
            )}
          </div>
          {/*    <div className="form-group">
            <Controller
              name="termsandconditions"
              control={control}
              render={({ field, fieldState }) => (
                <div className="checkbox-item-group">
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.checked);
                      setVisible(true);
                    }}
                  />
                  <label className="checkbox-label">Terms and Conditions</label>
                </div>
              )}
            />
          </div> */}

          {!captchaPassed && <Verify onSuccess={handleCaptchaChange} />}

          {captchaPassed && (
            <Button
              className="btn btn-primary btn-full-wid"
              label="Login"
              type="submit"
              icon="pi pi-arrow-right"
              iconPos="right"
              loading={isLoading}
              disabled={
                isLoading || 
                (RequireLocationForLogin && (isLocationLoading || !latitude || !longitude))
              }
            />
          )}
        </form>

        {/* {showCallButton && <FloatingCallButton password={password} />} */}
      </div>
    </>
  );
};

export default Login;
