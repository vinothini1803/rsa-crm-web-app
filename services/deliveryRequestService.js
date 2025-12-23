import axios from "axios";
//deliveryRequest List
export const deliveryRequestList = (data) => {
  // console.log("deliveryRequest params", data);
  return axios({
    method: "GET",
    url: `case/caseList`,
    params: data,
  });
};

//invoice List

export const invoiceList = (data) => {
  return axios({
    method: "GET",
    url: `case/dealerInvoice/getList`,
    params: data,
  });
};

//invoice View

export const invoiceView = (data) => {
  return axios({
    method: "POST",
    url: `case/dealerInvoice/view`,
    data: data,
  });
};

//Report Column List

export const checkreportColumnsList = (data) => {
  return axios({
    method: "POST",
    url: `case/checkreportColumnsList`,
    data: data,
  });
};

//Save Report

export const checkCaseReport = (data) => {
  return axios({
    method: "POST",
    url: `case/checkCaseReport`,
    data: data,
  });
};

export const updateCaseVehicleNumber = (data) => {
  return axios({
    method: "POST",
    url: `case/updateCaseVehicleNumber`,
    data: data,
  });
};

export const updateCaseVinNumber = (data) => {
  return axios({
    method: "POST",
    url: `case/updateCaseVin`,
    data: data,
  });
};

export const updateCaseVehicleType = (data) => {
  return axios({
    method: "POST",
    url: `case/updateCaseVehicleType`,
    data: data,
  });
};

export const updateCaseVehicleModel = (data) => {
  return axios({
    method: "POST",
    url: `case/updateCaseVehicleModel`,
    data: data,
  });
};

export const updateActivityVehicleNumber = (data) => {
  return axios({
    method: "POST",
    url: `case/updateActivityVehicleNumber`,
    data: data,
  });
};

export const uploadDealerDocument = (data) => {
  return axios({
    method: "POST",
    url: "case/uploadDealerDocument",
    data: data,
  });
};

export const updateDealerDocumentComments = (data) => {
  return axios({
    method: "POST",
    url: "case/updateDealerDocumentComments",
    data: data,
  });
};
