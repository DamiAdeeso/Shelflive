import { configureStore } from "@reduxjs/toolkit";
import MessageReducer from "../reducers/message/messageSlice";
import UserReducer from "../reducers/userSlice";
import CategorieReducer from "../reducers/categorySlice";
import InventoryReducer from "../reducers/inventorySlice";
import HistoryReducer from "../reducers/historySlice";
import ExpReducer from "../reducers/experimentSlice";

export const store = configureStore({
  reducer: {
    message: MessageReducer,
    user: UserReducer,
    category: CategorieReducer,
    inventory: InventoryReducer,
    history: HistoryReducer,
    exp: ExpReducer
  },
});
