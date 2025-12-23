importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDv86WJsT-Nv6vh9zMLKo-3FQFcIkJuuEE",
  authDomain: "crm-uitoux.firebaseapp.com",
  projectId: "crm-uitoux",
  storageBucket: "crm-uitoux.appspot.com",
  messagingSenderId: "184279784815",
  appId: "1:184279784815:web:d0457b19cc7bab5e1e9c9a",
  measurementId: "G-LHB7BTQ3YB",
});

const messaging = firebase.messaging();

//Its must To receive message while app running in background

messaging.onBackgroundMessage((payload) => {
  console.log("Background Message Received", payload);
  // Handle the background message payload here
});
