import axios from "axios";
//Login
export const login = (data) => {
  return axios({ method: "POST", url: "user/login", data: data });
};

//Update Password
export const updatePassword = (data) => {
  return axios({ method: "POST", url: "user/changePassword", data: data });
};

//Reset Account
export const resetAccount = (data) => {
  return axios({ method: "POST", url: "user/resetAccount", data: data });
};

//forgot password
export const forgotPassword = (data) => {
  return axios({ method: "POST", url: "user/forgotPassword", data: data });
};

//reset password
export const resetPassword = (data) => {
  return axios({ method: "POST", url: "user/resetPassword", data: data });
};

//Update Fcm token
export const updateFcmToken = (data) => {
  return axios({ method: "POST", url: "user/updateFcmToken", data: data });
};

export const logout = (data) => {
  return axios({ method: "POST", url: "user/logout", data: data });
};

//update User Status
export const updateUserStatus = (data) => {
  return axios({ method: "POST", url: "user/updateUserStatus", data: data });
};

//User Status list

export const getUserStatus = (data) => {
  return axios({ method: "GET", url: "master/getUserLoginStatus", data: data });
};

export const trackStatus = (data) => {
  return axios({ method: "POST", url: "user/getUserStatus", data: data });
};

export const deleteAccount = (data) => {
  return axios({ method: "POST", url: "user/appDeleteAccount", data: data });
};

export const authValidate = (data) => {
  return axios({
    method: "GET",
    url: `user/auth/validate`,
    headers: { Authorization: data },
  });
};
