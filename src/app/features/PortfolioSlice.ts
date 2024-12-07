// src/app/features/portfolioSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PortfolioEntry {
  id: string;
  coin: string;
  units: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface PortfolioState {
  items: PortfolioEntry[];
}

const initialState: PortfolioState = {
  items: [],
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addPortfolioEntry: (state, action: PayloadAction<PortfolioEntry>) => {
      state.items.push({ ...action.payload, id: Date.now().toString() });
    },
    updatePortfolioEntry: (state, action: PayloadAction<PortfolioEntry>) => {
      const index = state.items.findIndex(entry => entry.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deletePortfolioEntry: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(entry => entry.id !== action.payload);
    },
  },
});

export const { addPortfolioEntry, updatePortfolioEntry, deletePortfolioEntry } = portfolioSlice.actions;
export default portfolioSlice.reducer;
