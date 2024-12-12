import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PortfolioEntry {
  id: string;
  coin: string;
  units: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface Transaction {
  id: string;
  coin: string;
  action: string;
  date: string;
  details: string;
}

interface PortfolioState {
  items: PortfolioEntry[];
  transactions: Transaction[];
}

const initialState: PortfolioState = {
  items: [],
  transactions: [],
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addPortfolioEntry: (state, action: PayloadAction<PortfolioEntry>) => {
      state.items.push(action.payload);
      state.transactions.push({
        id: action.payload.id,
        coin: action.payload.coin,
        action: 'Added',
        date: new Date().toISOString(),
        details: `${action.payload.units} units @ $${action.payload.purchasePrice}`,
      });
    },
    deletePortfolioEntry: (state, action: PayloadAction<string>) => {
      const entryIndex = state.items.findIndex((entry) => entry.id === action.payload);
  
      if (entryIndex !== -1) {
        const entry = state.items[entryIndex];
        
        state.items.splice(entryIndex, 1);
        
        state.transactions.push({
          id: `txn-${new Date().getTime()}`,
          coin: entry.coin,
          action: 'Removed',
          date: new Date().toISOString(),
          details: `${entry.units} units @ $${entry.purchasePrice}`,
        });
      }
    },
    editPortfolioEntry: (
      state,
      action: PayloadAction<PortfolioEntry>
    ) => {
      const index = state.items.findIndex((entry) => entry.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.transactions.push({
          id: action.payload.id,
          coin: action.payload.coin,
          action: 'Edited',
          date: new Date().toISOString(),
          details: `${action.payload.units} units @ $${action.payload.purchasePrice}`,
        });
      }
    },
  },
});

export const { addPortfolioEntry, deletePortfolioEntry, editPortfolioEntry } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;
