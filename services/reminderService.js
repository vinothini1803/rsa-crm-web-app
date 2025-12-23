import axios from "axios";

// Get Reminder List
export const getReminderList = (data) => {
  return axios({
    method: "Get",
    url: `case/getReminderList`,
    params: data,
  });
};

// Get Reminder Form Data
export const getReminderFormData = (data) => {
  return axios({
    method: "GET",
    url: `master/getReminderFormData`,
    params: data,
  });
};

// Add Reminder
export const addReminder = (data) => {
  return axios({
    method: "POST",
    url: `case/addReminder`,
    data: data,
  });
};

// Update Reminder
export const updateReminder = (data) => {
  return axios({
    method: "PUT",
    url: `case/updateReminder`,
    data: data,
  });
};

// Get Reminder By ID
export const getsinglerReminder = (data) => {
  return axios({
    method: "GET",
    url: `case/getReminderById`,
    params: data,
  });
}