import { configureStore } from '@reduxjs/toolkit';
import { cryptoApi } from './features/cryptoApiSlice';
import watchlistReducer from './features/watchlistSlice';
import PortfolioReducer from './features/portfolioSlice';

export const store = configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    watchlist: watchlistReducer,
    portfolio: PortfolioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cryptoApi.middleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
