import { createSlice } from "@reduxjs/toolkit";
const historySlice = createSlice({
  name: "history",
  initialState: {
    history: [],
  },
  reducers: {
    setHistory: (state, action) => {
      state.history = action.payload;
    },
  },
});

export const { setHistory } = historySlice.actions;
export const selectHistory = (state) => state.history.history;
export default historySlice.reducer;
