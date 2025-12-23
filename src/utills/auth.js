import Cookies from "js-cookie";

export const setToken = (token, path = "/") => {
  // console.log("token", token);
  // Cookies.set("token", token, { path });
  localStorage.setItem("token", token);
};

export const getToken = () => {
  // const cookieToken = Cookies.get("token");
  // console.log("cookieToken", cookieToken);
  // return cookieToken ? true : false;
  const sessionToken = localStorage.getItem("token");
  return sessionToken ? true : false;
};

export const removeToken = (path = "/") => {
  // Cookies.remove("token", { path });
  // Cookies.remove("firebaseToken", { path });
  localStorage.removeItem("token");
  localStorage.removeItem("firebaseToken");
};
