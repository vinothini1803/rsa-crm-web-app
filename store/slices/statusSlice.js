import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "Active",
};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    updateStatus(state, action) {
        state.status = action.payload;
      },
  },
});

export const { updateStatus } = statusSlice.actions;
export default statusSlice.reducer;
