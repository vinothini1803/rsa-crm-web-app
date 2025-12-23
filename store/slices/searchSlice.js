import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  search: null,
};

// Create slice
const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    setSearch: (state, { payload }) => {
      state.search = payload; // Update the search state with the payload
    },
  },
});

// Export actions
export const { setSearch } = searchSlice.actions;

// Export reducer
export default searchSlice.reducer;

// Selector to get the search state
export const SearchCall = (state) => {
  return state.searchReducer?.search;
};