/* eslint-disable no-unused-vars */
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import Cookies from "js-cookie";

const firebaseConfig = {
  apiKey: "AIzaSyDv86WJsT-Nv6vh9zMLKo-3FQFcIkJuuEE",
  authDomain: "crm-uitoux.firebaseapp.com",
  projectId: "crm-uitoux",
  storageBucket: "crm-uitoux.appspot.com",
  messagingSenderId: "184279784815",
  appId: "1:184279784815:web:d0457b19cc7bab5e1e9c9a",
  measurementId: "G-LHB7BTQ3YB",
};
const vapidKey =
  "BLJYuZZDhasdYMY_gDOkydKaewVOnPQTr4XIf93hmvLbs3dwt1x-0a5PoYWZF27CVCTEmhFxzO2xzuAJniC3kOA";
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Retrieve FCM token
// Function to get Firebase token

export const firebaseToken = async () => {
  // console.log("insideee");
  try {
    const currentToken = await getToken(messaging, { vapidKey: vapidKey });
    if (currentToken) {
      // console.log("Current Token => ", currentToken);

      return currentToken;
    } else {
      // console.log(
      //   "No registration token available. Request permission to generate one."
      // );
      return null;
    }
  } catch (err) {
    // console.log("An error occurred while retrieving token. ", err);
    // return await firebaseToken();
  }
};

// Listen for incoming messages
export const onMessageListener = (callback) => {
  return onMessage(messaging, (message) => {
    console.log("message", message);
    // Handle the payload or invoke a callback function
    callback(message);
  });
};

export const checkSupport = async () => {
  const firebasesupport = await isSupported();
  // console.log("firebasesupport", firebasesupport);
  return firebasesupport;
};
