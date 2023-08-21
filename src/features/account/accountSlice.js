import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  purpose: "",
  isLoading: false,
};

export const fetchCurrency = createAsyncThunk(
  "account/deposit",
  async (arg) => {
    const response = await fetch(
      `https://api.frankfurter.app/latest?amount=${arg.deposit}&from=${arg.curr}&to=USD`
    );

    const data = await response.json();
    return data;
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(loan, purpose) {
        return {
          payload: {
            loan,
            purpose,
          },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return;
        state.loan = action.payload.loan;
        state.purpose = action.payload.purpose;
        state.balance += action.payload.loan;
      },
    },
    payLoan(state) {
      if (state.balance - state.loan < 0) return;
      state.balance -= state.loan;
      state.loan = 0;
      state.purpose = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrency.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCurrency.fulfilled, (state, action) => {
      // Add user to the state array
      state.balance += action.payload.rates.USD;
      state.isLoading = false;
    });
  },
});

export const { deposit, withdraw, requestLoan, payLoan } = accountSlice.actions;
export default accountSlice.reducer;
