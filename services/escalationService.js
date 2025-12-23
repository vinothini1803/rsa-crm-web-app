import axios from "axios";
export const getEscalationData = (data) => {
    return axios({
      method: "POST",
      url: "case/escalation/template/formData",
      data: data,
    });
  }
  export const getTemplateList = (data) => {
    return axios({
      method: "POST",
      url: "case/escalation/template/list",
      data: data,
    });
  }

  export const sentToData = (data) => {
    return axios({
      method: "POST",
      url: "case/escalation/template/sendToData",
      data: data,
    });
  }
  export const templateDetail = (data) => {
    return axios({
      method: "POST",
      url: "case/escalation/template/detail",
      data: data,
    });
  }
  export const sendNotification = (data) => {
    return axios({
      method: "POST",
      url: "case/template/sendNotification",
      data: data,
    });
  }
  export const preview = (data) => {
    return axios({
      method: "POST",
      url: "case/escalation/template/preview",
      data: data,
    });
  }