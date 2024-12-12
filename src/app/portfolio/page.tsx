'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Typography,
  InputNumber,
  Form,
  notification,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deletePortfolioEntry } from '../features/portfolioSlice';
import { useGetCryptoPriceQuery,useGetHistoricalPricesQuery } from '../features/cryptoApiSlice';
import { addAlert, removeAlert } from '../features/alertSlice';
import PortfolioForm from '../components/forms/PortfolioForm';
import HistoricalChart from '../components/historicalchart/HistoricalChart';
import { v4 as uuidv4 } from 'uuid';

interface AggregatedData {
  date: string;
  price: number;
}

const { Title } = Typography;

const PortfolioPage = () => {
  const portfolio = useSelector((state: RootState) => state.portfolio.items);
  const alerts = useSelector((state: RootState) => state.alerts.alerts);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
  const dispatch = useDispatch();

  const { data: coinsPrices } = useGetCryptoPriceQuery(
    portfolio.map((entry) => entry.coin).join(',')
  );

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

  // Monitor alerts and trigger notifications
  useEffect(() => {
    if (!coinsPrices) return;

    alerts.forEach((alert) => {
      const currentPrice = coinsPrices[alert.coin]?.usd;
      if (currentPrice && currentPrice >= alert.threshold) {
        notification.info({
          message: `Price Alert for ${alert.coin}`,
          description: `The price of ${alert.coin} has crossed $${alert.threshold}.`,
        });
        dispatch(removeAlert(alert.id));
      }
    });
  }, [coinsPrices, alerts, dispatch]);

  const handleAddAlert = (coin: string, threshold: number) => {
    const newAlert = {
      id: uuidv4(),
      coin,
      threshold,
    };
    dispatch(addAlert(newAlert));
  };

  const calculateTotalPortfolioValue = () => {
    return portfolio.reduce((total, entry) => {
      const currentPrice = coinsPrices?.[entry.coin]?.usd || 0;
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
      title: 'Set Price Alert',
      key: 'alert',
      render: (_: any, record: any) => (
        <Form onFinish={(values) => handleAddAlert(record.coin, values.threshold)}>
          <Form.Item
            name="threshold"
            rules={[{ required: true, message: 'Enter a threshold price' }]}
          >
            <InputNumber min={0} placeholder="Price (USD)" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Set Alert
          </Button>
        </Form>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          onClick={() => dispatch(deletePortfolioEntry(record.id))}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          danger
        >
          Remove Entry
        </Button>
      ),
    },
  ];

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
          <p className="text-lg font-semibold text-gray-700">Total Portfolio:</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalPortfolioValue.toFixed(2)} USD
          </p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700">Overall Profit/Loss:</p>
          <p
            className={`text-2xl font-bold ${overallProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {overallProfitLoss.toFixed(2)} USD
          </p>
        </div>
      </div>

      <PortfolioForm />
      <Table
        dataSource={portfolio}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{x: true}}
        bordered
        className="w-full bg-gray-100 dark:bg-gray-900"
      />

      <div className="pt-4">
        <HistoricalChart data={aggregatedData} />
      </div>
    </div>
  );
};

export default PortfolioPage;
