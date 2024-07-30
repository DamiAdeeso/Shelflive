import { createSlice } from "@reduxjs/toolkit";

const expSlice = createSlice({
  name: "exp",
  initialState: {
    experiments: [],
  },
  reducers: {
    setExp: (state, action) => {
      state.experiments = action.payload;
    },
  },
});

export const { setExp } = expSlice.actions;
export const selectExp = (state) => state.exp.experiments;
export default expSlice.reducer;
