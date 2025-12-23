import axios from "axios";
//Asp List
export const aspData = (data) => {
  return axios({
    method: "POST",
    url: `case/asp/activityData`,
    data: data,
  });
};
//Nearby Service Providers
export const nearASP = (data) => {
  return axios({
    method: "POST",
    url: `case/getNspLocs`,
    data: data,
  });
};
// ASP Send Request
export const acceptRequest = (data) => {
  console.log("data params", data);
  return axios({
    method: "PUT",
    url: `case/asp/activity/accept`,
    data: data,
  });
};
// Assign Asp
export const assginAsp = (data) => {
  return axios({
    method: "POST",
    url: `case/activityRequest`,
    data: data,
  });
};
//Update Vechicle Number
export const updateActivityVehicleNumber = (data) => {
  return axios({
    method: "POST",
    url: `case/updateActivityVehicleNumber`,
    data: data,
  });
};
//Reject Activity
export const rejectActivity = (data) => {
  return axios({
    method: "PUT",
    url: `case/asp/activity/reject`,
    data: data,
  });
};
//Send Approval
export const activitySendForApproval = (data) => {
  return axios({
    method: "PUT",
    url: `case/activitySendForApproval`,
    data: data,
  });
};

//Add Activity charge
export const updateActivityCharge = (data) => {
  return axios({
    method: "POST",
    url: `case/activity/updateAdditionalCharge`,
    data: data,
  });
};
//Add Deviation KM
export const deviationKMSave = (data) => {
  return axios({
    method: "POST",
    url: `case/activityRouteDeviationKmUpdate`,
    data: data,
  });
};
//Get Service Detail
export const serviceDeatils = (data) => {
  return axios({
    method: "POST",
    url: `case/asp/activity/getServiceDetail`,
    data: data,
  });
};

//Map View
export const mapView = (data) => {
  return axios({
    method: "POST",
    url: `case/asp/mapView`,
    data: data,
  });
};

//send request activities
export const asprequestActivities = (data) => {
  return axios({
    method: "POST",
    url: `case/sendRequest/activities`,
    data: data,
  });
};

//assign driver
export const assignDriver = (data) => {
  return axios({
    method: "PUT",
    url: `case/asp/activity/assign`,
    data: data,
  });
};

//Cancel ASP
export const aspCancel = (data) => {
  return axios({
    method: "PUT",
    url: `case/updateActivityCancelled`,
    data: data,
  });
};

// Add Technician
export const addTechnician = (data) => {
  return axios({
    method: "POST",
    url: `case/nsp/newCocoTechnician/create`,
    data: data,
  });
};
