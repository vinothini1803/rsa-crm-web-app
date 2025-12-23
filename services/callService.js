import axios from "axios";
//get click to outbound call
export const clickToCall = (data) => {
    return axios({
      method: "POST",
      url: "case/clickToCall",
      data: data,
    })
  }