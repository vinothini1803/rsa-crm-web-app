import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requestId: null,
  caseId: null,
};

const inventorySlice = createSlice({
  name: "inventorySlice",
  initialState: initialState,
  reducers: {
    setInventoryDetails: (state, { payload }) => {
      state.requestId = payload.requestId;
      state.caseId = payload.caseId;
    },
  },
});

export const { setInventoryDetails } = inventorySlice.actions;

export default inventorySlice.reducer;


export const RequestId = (state) => state.activityReducer.requestId;

export const CaseId = (state) => state.activityReducer.caseId;
