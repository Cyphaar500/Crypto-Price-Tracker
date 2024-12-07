'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Typography } from 'antd';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deletePortfolioEntry } from '../features/PortfolioSlice';
import { useGetCryptoPriceQuery, useLazyGetHistoricalDataQuery } from '../features/cryptoApiSlice';
import PortfolioForm from '../components/forms/PortfolioForm';

const { Title, Text } = Typography;

const PortfolioPage = () => {
  const portfolio = useSelector((state: RootState) => state.portfolio.items);
  const dispatch = useDispatch();

  const [historicalData, setHistoricalData] = useState<any[]>([]);

  const { data: coinsPrices } = useGetCryptoPriceQuery(
    portfolio.map((entry) => entry.coin).join(',')
  );

  const [triggerHistoricalData, { data: historicalApiData }] = useLazyGetHistoricalDataQuery();

  useEffect(() => {
    portfolio.forEach((entry) => {
      triggerHistoricalData(entry.coin);
    });
  }, [portfolio, triggerHistoricalData]);

  useEffect(() => {
    if (historicalApiData) {
      setHistoricalData((prev) => [...prev, historicalApiData]);
    }
  }, [historicalApiData]);


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
      <Title level={2}>My Crypto Portfolio</Title>
      <PortfolioForm />
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

      <Table 
        dataSource={portfolio} 
        columns={columns} 
        rowKey="id" 
      />

      <div style={{ width: '100%', height: 400 }}>
        <Title level={4}>Historical Performance (7 Days)</Title>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {portfolio.map((entry) => (
              <Line
                key={entry.coin}
                type="monotone"
                dataKey={entry.coin}
                stroke="#8884d8"
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioPage;
