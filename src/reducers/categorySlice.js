import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    sub_categories: [],
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSubCategories: (state, action) => {
      state.sub_categories = action.payload;
    },
  },
});

export const { setCategories, setSubCategories } = categorySlice.actions;
export const selectCategories = (state) => state.category.categories;
export const selectSubCategories = (state) => state.category.sub_categories;
export default categorySlice.reducer;
