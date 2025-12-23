import axios from "axios";

export const noticationList = (data) => {
  return axios({
    method: "POST",
    url: `case/userNotificationList`,
    data: data,
  });
};
