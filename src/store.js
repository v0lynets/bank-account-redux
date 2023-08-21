import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./features/account/accountSlice";
import customerReducer from "./features/customer/customerSlice";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    customer: customerReducer,
  },
});
