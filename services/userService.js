import axios from "axios";

// Save Map View Filters
export const saveMapViewFilters = (data) => {
  return axios({
    method: "POST",
    url: "user/mapViewFilters/save",
    data: data,
  });
};

// Get Map View Filters
export const getMapViewFilters = (data) => {
  return axios({
    method: "GET",
    url: "user/mapViewFilters/get",
    params: data,
  });
};

// Delete Map View Filters
export const deleteMapViewFilters = (data) => {
  return axios({
    method: "POST",
    url: "user/mapViewFilters/delete",
    data: data,
  });
};

