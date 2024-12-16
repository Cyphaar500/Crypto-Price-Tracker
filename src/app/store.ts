import { configureStore } from '@reduxjs/toolkit';
import { cryptoApi } from './features/cryptoApiSlice';
import watchlistReducer from './features/watchlistSlice';
import PortfolioReducer from './features/portfolioSlice';
import alertReducer from './features/alertSlice';
import currencyReducer from './features/currencySlice';

export const store = configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    watchlist: watchlistReducer,
    portfolio: PortfolioReducer,
    alerts: alertReducer,
    currency: currencyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cryptoApi.middleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
