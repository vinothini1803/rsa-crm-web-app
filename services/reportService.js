import axios from "axios";

//Report Get List
export const getReportList = (data) => {
  return axios({
    method: "POST",
    url: `report/getReportList`,
    params: data,
  });
};

//Get Report Columns
export const getReportColumns = (data) => {
  return axios({
    method: "POST",
    url: "report/getReportColumns",
    data: data,
  });
};

//Export report
export const downloadReport = (data) => {
  return axios({
    method: "POST",
    url: "report/reportExport",
    data: data,
  });
};

//Get Service Summary Report Overall data
export const getServiceSummaryReport = (data) => {
  return axios({
    method: "POST",
    url: "report/serviceSummaryReport/getOverall",
    data: data,
  });
};

//Get Service Summary Report Filter Details
export const getServiceSummaryFilterDetails = () => {
  return axios({
    method: "GET",
    url: "report/serviceSummaryReport/filterDetails",
  });
};

//Export Service Summary Report
export const exportServiceSummaryReport = (data) => {
  return axios({
    method: "POST",
    url: "report/serviceSummaryReport/export",
    data: data,
    responseType: "blob",
  });
};

//Own Patrol Contribution Report - Get Data
export const getOwnPatrolContributionReport = (data) => {
  return axios({
    method: "POST",
    url: "report/ownPatrolContributionReport/getData",
    data: data,
  });
};

//Own Patrol Contribution Report - Get Filter Details
export const getOwnPatrolContributionFilterDetails = () => {
  return axios({
    method: "GET",
    url: "report/ownPatrolContributionReport/filterDetails",
  });
};

//Own Patrol Contribution Report - Export
export const exportOwnPatrolContributionReport = (data) => {
  return axios({
    method: "POST",
    url: "report/ownPatrolContributionReport/export",
    data: data,
    responseType: "blob", // Important: receive binary data as blob
  });
};
