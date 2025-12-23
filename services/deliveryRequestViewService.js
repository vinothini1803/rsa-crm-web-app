import axios from "axios";
// Agent dropdown list
export const agent = (data) => {
  return axios({
    method: "GET",
    url: data?.l2AgentOnly ? `user/allUsers?userTypeId=${data?.userTypeId}&limit=${data.limit}&offset=${data.offset}&l2AgentOnly=${data?.l2AgentOnly}${
  data?.callCenterId ? `&callCenterId=${data?.callCenterId}` : ""}` : `user/allUsers?userTypeId=${data?.userTypeId}&limit=${data.limit}&offset=${data.offset}`,
    data: data,
  });
};

// Assign Agent
export const assginAgent = (data) => {
  return axios({
    method: "POST",
    url: `case/updateCase`,
    data: data,
  });
};
//Payment Accept
export const acceptAndPay = (data) => {
  return axios({
    method: "PUT",
    url: `case/dealer/activity/acceptAndPay`,
    data: data,
  });
};
// Case Detail
export const caseDetail = (data) => {
  // console.log("data params", data);
  return axios({
    method: "POST",
    url: `case/getCaseDetail`,
    data: data,
  });
};
//Agent List
export const agentUser = (data) => {
  // console.log("data params", data);
  return axios({
    method: "POST",
    url: `user/getUser`,
    data: data,
  });
};
//wallet Balance
export const walletBalance = (data) => {
  return axios({
    method: "POST",
    url: `case/dealer/getData`,
    data: data,
  });
};

//make wallet payment
export const makePayment = (data) => {
  return axios({
    method: "POST",
    url: `case/dealer/debitWalletTransaction`,
    data: data,
  });
};

//update Actual Km
export const updateActualKM = (data) => {
  return axios({
    method: "POST",
    url: `case/activity/updateActualTotalKm`,
    data: data,
  });
};
export const payBalanceAmount = (data) => {
  return axios({
    method: "PUT",
    url: `case/dealer/activity/payBalanceAmount`,
    data: data,
  });
};
//Live tracking

export const getLiveLocation = (data) => {
  return axios({
    method: "POST",
    url: `case/activity/getAspLiveLocation`,
    data: data,
  });
};
//Close Case
export const updateCaseClose = (data) => {
  return axios({
    method: "PUT",
    url: `case/updateCaseClose`,
    data: data,
  });
};

//cancel Case
export const updateCaseCancel = (data) => {
  return axios({
    method: "PUT",
    url: `case/updateCaseCancelled`,
    data: data,
  });
};

//Addtional charge attachments

export const chargesAttachments = (data) => {
  return axios({
    method: "POST",
    url: `case/listAdditionalChargeAttachments`,
    data: data,
  });
};
//Update Delivery Request Date and time
export const updateDeliveryRequestPickupDateAndTime = (data) => {
  return axios({
    method: "POST",
    url: `case/updateDeliveryRequestPickupDateAndTime`,
    data: data,
  });
};
//Get interaction form data
export const getInteractiondata = (data) => {
  return axios({
    method: "GET",
    url: `case/interaction/getFormData`,
    params: data,
  });
};

//Add Interaction

export const addInteraction = (data) => {
  return axios({
    method: "POST",
    url: `case/addInteraction`,
    data: data,
  });
};

//Asp Activity Status List
export const getAspActivityStatuses = (data) => {
  return axios({
    method: "POST",
    url: `case/getAspActivityStatuses`,
    data: data,
  });
};

//update ASP Activity status
export const updateAspActivityStatus = (data) => {
  return axios({
    method: "PUT",
    url: `case/asp/activity/updateStatus`,
    data: data,
  });
};

export const getLorryReceiptDetail = (data) => {
  return axios({
    method: "POST",
    url: `case/getLorryReceiptDetail`,
    data: data,
  });
};
