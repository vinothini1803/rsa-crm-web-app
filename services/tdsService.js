import axios from "axios";

export const tdsList = (data) => {
  return axios({
    method: "POST",
    url: `master/tds/getList`,
    data: data,
  });
};

export const saveTds = (data) => {
  return axios({
    method: "POST",
    url: `master/tds/save`,
    data: data,
  });
};

export const deleteTds = (data) => {
  return axios({
    method: "POST",
    url: `master/tds/delete`,
    data: data,
  });
};

export const viewTds = (data) => {
  return axios({
    method: "POST",
    url: `master/tds/view`,
    data: data,
  });
};

export const exportTds = (data) => {
  return axios({
    method: "POST",
    url: `master/tds/export`,
    data: data,
  });
};

export const getTdsFormData = (data) => {
  return axios({
    method: "POST",
    url: `master/tds/getFormData`,
    data: data,
  });
};

export const getTdsFilterData = () => {
  return axios({
    method: "GET",
    url: `master/tds/getFilterData`,
  });
};
