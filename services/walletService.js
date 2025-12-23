import axios from "axios";

export const walletlogs = (data) => {
  return axios({
    method: "POST",
    url: `case/dealer/getWalletLogs`,
    data: data,
  });
};

export const checkStatus = (data) => {
  return axios({
    method: "POST",
    url: `case/dealer/walletTopup/razorpay/order/getTransactionStatus`,
    data: data,
  });
};
export const orderCreation = (data) => {
  return axios({
    method: "POST",
    url: `case/dealer/walletTopup/razorpay/orderCreation`,
    data: data,
  });
};

export const paymentSuccess = (data) => {
  return axios({
    method: "POST",
    url: `case/dealer/walletTopup/razorpay/callback/response`,
    data: data,
  });
};

export const exportDealerWalletLogs = (data) => {
  return axios({
    method: "POST",
    url: `case/export/dealerWalletLogs`,
    data: data,
  });
};
