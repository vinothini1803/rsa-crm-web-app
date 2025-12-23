import axios from "axios";
// create Delivery Request
export const createRequest = (data) => {
  return axios({ method: "POST", url: "case/createCase", data: data });
};

//upload

export const Upload = (data) => {
  return axios({ method: "POST", url: "case/upload", data: data });
};