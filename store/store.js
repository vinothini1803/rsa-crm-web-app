import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import inventorySlice from "./slices/inventorySlice";
import caseSlice from "./slices/caseSlice";
import searchSlice from "./slices/searchSlice";
import statusSlice from "./slices/statusSlice"; 
import passwordSlice from "./slices/passwordSlice"

const persistConfig = {
  key: "RSA-CRM",
  storage,
  //whitelist: ["LoginApi", "appReducer", "userReducer"],
  // blacklist: ['GeneralApi']
};

const rootReducer = combineReducers({
  userReducer: userSlice,
  activityReducer: inventorySlice,
  caseReducer: caseSlice,
  searchReducer: searchSlice,
  statusReducer: statusSlice, 
  passwordReducer: passwordSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
