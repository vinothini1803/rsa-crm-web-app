import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import App from "./App";

/* Import Bootstrap Style File  */
import "bootstrap/dist/css/bootstrap.min.css";
/* Import Primereact Style File  */
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
/* Import Toastify */
import "react-toastify/dist/ReactToastify.css";
/* Import Custom Styles */
import "./index.css";
import "./assets/styles/theme.less";
import { Provider } from "react-redux";
import { persistor, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
const queryClient = new QueryClient();

// Example registration in your main application file
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Error registering Service Worker:", error);
    });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>   //For react-Dnd it should be off
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>

        <ToastContainer
          position="bottom-center"
          theme="colored"
          hideProgressBar={true}
          closeButton={false}
          draggable={false}
        />
      </PersistGate>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
