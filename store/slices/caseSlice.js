import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createCaseData: null,
  caseSMSId: null,
  existingCaseSMSId: null,
  searchCaseData: null,
};

const caseSlice = createSlice({
  name: "caseSlice",
  initialState,
  reducers: {
    setCaseData: (state, { payload }) => {
      console.log('Slice Case Payload => ', payload);
      state.createCaseData = payload.createCase;
      state.searchCaseData = payload.searchCaseData;
      state.existingCaseSMSId = payload.existingCaseSMSId;
      state.caseSMSId = payload.caseSMSId;
    },
  }
});

export const { setCaseData } = caseSlice.actions;

export default caseSlice.reducer;

export const CreateCaseData = (state) => state.caseReducer.createCaseData;
export const CaseSMSId = (state) => state.caseReducer.caseSMSId;
export const ExistingCaseSMSId = (state) => state.caseReducer.existingCaseSMSId;
export const SearchCaseData = (state) => state.caseReducer.searchCaseData;