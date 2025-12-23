import axios from "axios";
import Cookies from "js-cookie";
import { removeToken } from "../src/utills/auth";
import { store } from "../store/store";
import { setUser } from "../store/slices/userSlice";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
const plainAxios = axios.create();

// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    // Modify the request config here (e.g., add headers, authentication tokens)
    // const accessToken = Cookies.get("token");
    const accessToken = localStorage.getItem("token");
    // config.headers["Access-Control-Allow-Origin"] = "*";
    // console.log("accessToken", accessToken);
    // ** If token is present add it to request's Authorization Header
    if (accessToken) {
      config.headers.Authorization = accessToken;
      config.headers.sourceFrom = "web";
    }
    return config;
  },
  (error) => {
    // Handle request errors here

    return Promise.reject(error);
  }
);

//Response Interceptor
axios.interceptors.response.use(
  (response) => {
    // Modify the response data here (e.g., parse, transform)

    return response;
  },
  async (error) => {
    // Handle response errors here

    if (
      (error.response?.status === 403 &&
        error.response?.data?.error === "Invalid user") ||
      (error.response?.status === 500 &&
        error.response?.data?.error === "jwt expired")
    ) {
      const state = store.getState();
      const userId = state?.userReducer?.user?.id;
      // const fireBaseTokenData = Cookies.get("firebaseToken");
      const fireBaseTokenData = localStorage.getItem("firebaseToken");

      await plainAxios.post("/user/logout", {
        userId: userId,
        fcmToken: fireBaseTokenData ? fireBaseTokenData : null,
        srcFrom: "web",
        userLogId: state?.userReducer?.user?.userLogId
      });

      removeToken();
      store.dispatch(setUser({}));
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
