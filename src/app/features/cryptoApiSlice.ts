import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CryptoCurrency {
  id: string;
  name: string;
  image: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coingecko.com/api/v3/' }),
  endpoints: (builder) => ({
    getCryptocurrencies: builder.query<CryptoCurrency[], void>({
      query: () =>
        'coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1',
    }),
    getCryptoDetails: builder.query<any, string>({
      query: (id) => `coins/${id}`,
    }),
    getCryptoPrice: builder.query({
      query: (id: string) => `simple/price?ids=${id}&vs_currencies=usd`,
    }),
    getHistoricalPrices: builder.query({
      query: ({ id, days }) =>
        `coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    }),
  }),
});

export const { 
  useGetCryptocurrenciesQuery, 
  useGetCryptoDetailsQuery,
  useGetCryptoPriceQuery, 
  useGetHistoricalPricesQuery, 
} = cryptoApi;
