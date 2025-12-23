//Attachment List

import axios from "axios";

export const attachments = (data) => {
  return axios({
    url: "case/listAttachments",
    method: "POST",
    data: data,
  });
};
