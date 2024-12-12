'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deletePortfolioEntry } from '../features/portfolioSlice';
import { useGetCryptoPriceQuery, useGetHistoricalPricesQuery } from '../features/cryptoApiSlice';
import PortfolioForm from '../components/forms/PortfolioForm';
import HistoricalChart from '../components/historicalchart/HistoricalChart';

interface AggregatedData {
  date: string;
  price: number;
}

const { Title, Text } = Typography;

const PortfolioPage = () => {
  const portfolio = useSelector((state: RootState) => state.portfolio.items);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
  const dispatch = useDispatch();

  const { data: coinsPrices } = useGetCryptoPriceQuery(
    portfolio.map((entry) => entry.coin).join(',')
  );

  const { data: historicalPrices, isLoading } = useGetHistoricalPricesQuery(
    portfolio.map((entry) => entry.id).join(',')
  );

  // Some dummy data for the chart
  // const sampleData = [
  //   { date: '2024-12-01', price: 1000 },
  //   { date: '2024-12-02', price: 1100 },
  //   { date: '2024-12-03', price: 1200 },
  // ];

  useEffect(() => {
    if (!historicalPrices || portfolio.length === 0) return;

    const dailyTotals: { [date: string]: number } = {};

    portfolio.forEach((entry) => {
      const historicalData = historicalPrices[entry.id]?.prices || [];
      console.log(entry.id, historicalPrices[entry.id]);
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

  const calculateTotalPortfolioValue = () => {
    return portfolio.reduce((total, entry) => {
      if (!coinsPrices) return total;
      const currentPrice = coinsPrices[entry.coin]?.usd;
      if (currentPrice === undefined) return total;
      return total + currentPrice * entry.units;
    }, 0);
  };

  const calculateTotalInvestedAmount = () => {
    return portfolio.reduce((total, entry) => total + entry.purchasePrice * entry.units, 0);
  };
  
  const totalPortfolioValue = calculateTotalPortfolioValue();
  const totalInvestedAmount = calculateTotalInvestedAmount();
  const overallProfitLoss = totalPortfolioValue - totalInvestedAmount;

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Coin',
      dataIndex: 'coin',
      key: 'coin',
    },
    {
      title: 'Units Owned',
      dataIndex: 'units',
      key: 'units',
    },
    {
      title: 'Purchase Price (USD)',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      render: (purchaseDate: string) => new Date(purchaseDate).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          onClick={() => dispatch(deletePortfolioEntry(record.id))}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" danger
        >
          Remove Entry
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Accont Overview</Title>
      <div className="mb-4">
        <Text strong>Total Portfolio Value: </Text>
        <Text>{totalPortfolioValue.toFixed(2)} USD</Text>
      </div>
      <div className="mb-4">
        <Text strong>Overall Profit/Loss: </Text>
        <Text style={{ color: overallProfitLoss >= 0 ? 'green' : 'red' }}>
          {overallProfitLoss.toFixed(2)} USD
        </Text>
      </div>

      <PortfolioForm />

      <Table
        dataSource={portfolio}
        columns={columns}
        rowKey="id"
      />
      <div className='pt-4'>
        <HistoricalChart data={aggregatedData} />
      </div>
    </div>
  );
};

export default PortfolioPage;
