import { createSlice } from "@reduxjs/toolkit";

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    items: [],
    archives: [],
    informations: null
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setArchives: (state, action) => {
      state.archives = action.payload;
    },
    setInformations: (state, action) => {
      state.informations = action.payload
    }
  },
});

export const { setItems, setArchives, setInformations } = inventorySlice.actions;
export const selectArchives = (state) => state.inventory.archives;
export const selectItems = (state) => state.inventory.items;
export const selectInfo = (state) => state.inventory.informations
export default inventorySlice.reducer;
