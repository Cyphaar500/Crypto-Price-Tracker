import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrencyState {
  selectedCurrency: string;
  exchangeRates: { [key: string]: number };
}

const initialState: CurrencyState = {
  selectedCurrency: 'USD',
  exchangeRates: {},
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.selectedCurrency = action.payload;
    },
    setExchangeRates: (state, action: PayloadAction<{ [key: string]: number }>) => {
      state.exchangeRates = action.payload;
    },
  },
});

export const { setCurrency, setExchangeRates } = currencySlice.actions;
export default currencySlice.reducer;
