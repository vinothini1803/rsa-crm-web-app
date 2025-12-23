import axios from "axios";
//role list
export const roleList = (data) => {
  return axios({
    method: "GET",
    url: `user/listRoles`,
    params: data,
  });
};
//All Permission list
export const getAllPermissions = (data) => {
  return axios({
    method: "GET",
    url: `user/role/getFormData`,
    params: data,
  });
};

//save role
export const saveRole = (data) => {
  return axios({
    method: "POST",
    url: `user/role/save`,
    data: data,
  });
};
//delete Role
export const deleteRole = (data) => {
  return axios({
    method: "POST",
    url: `user/role/delete`,
    data: data,
  });
};

//status Update
export const updateStatus = (data) => {
  return axios({
    method: "POST",
    url: `user/role/updateStatus`,
    data: data,
  });
};
