'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  Typography,
  Select,
} from 'antd';
import {
  useGetCryptoPriceQuery,
  useFetchExchangeRatesQuery,
  useGetHistoricalPricesQuery,
} from '../features/cryptoApiSlice';
import { setCurrency } from '../features/currencySlice';
import PortfolioTable from '../components/tables/PortfolioTable';
import HistoricalChart from '../components/historicalchart/HistoricalChart';

interface AggregatedData {
  date: string;
  price: number;
}

const { Option } = Select;
const { Title } = Typography;

const PortfolioPage = () => {
  const portfolio = useSelector((state: RootState) => state.portfolio.items);
  const { selectedCurrency } = useSelector((state: RootState) => state.currency);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
  const dispatch = useDispatch();

  const { data: coinsPrices } = useGetCryptoPriceQuery(
    portfolio.map((entry) => entry.coin).join(',')
  );

  const { data: exchangeRates, isLoading, error } = useFetchExchangeRatesQuery();

  const { data: historicalPrices } = useGetHistoricalPricesQuery(
    portfolio.map((entry) => entry.id).join(',')
  );

  // Historical data for the chart
  useEffect(() => {
    if (!historicalPrices || portfolio.length === 0) return;

    const dailyTotals: { [date: string]: number } = {};

    portfolio.forEach((entry) => {
      const historicalData = historicalPrices[entry.id]?.prices || [];
      historicalData.forEach(([timestamp, price]: [number, number]) => {
        const date = new Date(timestamp).toISOString().split('T')[0];
        const value = price * entry.units;
        dailyTotals[date] = (dailyTotals[date] || 0) + value;
      });
    });

    const formattedData = Object.entries(dailyTotals).map(([date, value]) => ({
      date,
      price: value,
    }));

    setAggregatedData(formattedData);
  }, [historicalPrices, portfolio]);

  const handleCurrencyChange = (currency: string) => {
    dispatch(setCurrency(currency));
  };

  const calculateTotalPortfolioValue = () => {
    const totalUSDValue = portfolio.reduce((total, entry) => {
      const currentPrice = coinsPrices?.[entry.coin]?.usd || 0;
      return total + currentPrice * entry.units;
    }, 0);

    const exchangeRate = exchangeRates?.rates[selectedCurrency]?.value || 1;
    return (totalUSDValue * exchangeRate).toFixed(2);
  };

  const calculateTotalInvestedAmount = () => {
    return portfolio.reduce(
      (total, entry) => total + entry.purchasePrice * entry.units,
      0
    );
  };

  const totalPortfolioValue = calculateTotalPortfolioValue();
  const totalInvestedAmount = calculateTotalInvestedAmount();
  const overallProfitLoss = parseFloat(totalPortfolioValue) - totalInvestedAmount;

  return (
    <div>
      <Title
        level={2}
        className="text-lg sm:text-2xl lg:text-3xl mb-4 dark:bg-gray-900 dark:text-gray-100"
      >
        Account Overview
      </Title>

      <div className="border-2 border-blue-500 bg-blue-50 rounded-md p-4 mb-6 flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-gray-700">
            Select Currency:
          </p>
          <Select
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            style={{ width: 80 }}
          >
            {Object.keys(exchangeRates?.rates || {}).map((currency) => (
              <Select.Option key={currency} value={currency}>
                {currency.toUpperCase()}
              </Select.Option>
            ))}
          </Select>
        </div>       
      </div>

      <PortfolioTable />
      <div className="pt-4">
        <HistoricalChart data={aggregatedData} />
      </div>
    </div>
  );
};

export default PortfolioPage;
