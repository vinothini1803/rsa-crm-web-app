import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Passkey: null,
};

const passwordSlice = createSlice({
  name: "passwordSlice",
  initialState: initialState,
  reducers: {
    setPassword: (state, { payload }) => {
      state.Passkey = payload;
    },
  },
});

export const { setPassword } = passwordSlice.actions;

export default passwordSlice.reducer;

export const selectCurrentPassword = (state) => { 
    return state.passwordReducer?.Passkey;
}
