import axios from "axios";

//other services get activity status
export const getActivityStatus = (data) => {
  return axios({
    method: "GET",
    url: "case/otherService/getActivityStatuses",
    params: data,
  });
};

//update status
export const othersStatusUpdate = (data) => {
  return axios({
    method: "POST",
    url: `case/otherService/updateStatus`,
    data: data,
  });
};

//Reimbursement Mapping
export const reimbursementMapping = (data) => {
  return axios({
    method: "POST",
    url: "case/reimbursement/mapping",
    data: data,
  });
};

//Reimbursement Update Details
export const reimbursementDetailsUpdate = (data) => {
  return axios({
    method: "POST",
    url: "case/reimbursement/updateDetails",
    data: data,
  });
};

//Reimbursement Status dropdown
export const getReimbursementStatus = (data) => {
  return axios({
    method: "GET",
    url: "case/reimbursement/getStatusList",
    params: data,
  });
};

//Post Status change
export const reimbursementStatusSave = (data) => {
  return axios({
    method: "POST",
    url: "case/reimbursement/statusChange",
    data: data,
  });
};
//payment method for reimbursement
export const reimbursementPayment = (data) => {
  return axios({
    method: "GET",
    url: "master/paymentMethod?&forReimbursement=true",
    params: data,
  });
};

//Reimbursement Get List
export const reimbursementGetList = (data) => {
  return axios({
    method: "POST",
    url: "case/reimbursement/getList",
    data: data,
  });
};

//Service Details
export const getServiceDetails = (data) => {
  return axios({
    method: "GET",
    url: "case/rsaServiceDetails",
    params: data,
  });
};

//Verify VPA (UPI Linked Mobile Number)
export const verifyVPA = (data) => {
  return axios({
    method: "POST",
    url: "case/reimbursement/verifyVPA",
    data: data,
  });
};

//Agent Productivity Get List
export const getAgentProductivityList = (data) => {
  return axios({
    method: "POST",
    url: "case/getAgentProductivityList",
    data: data,
  });
};

//Reminder Get List
export const reminderGetList = (data) => {
  return axios({
    method: "POST",
    url: "case/reminder/getList",
    data: data,
  });
};
