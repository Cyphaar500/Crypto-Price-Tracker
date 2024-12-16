'use client';

import React from 'react';
import { Table, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const { Title } = Typography;

const TransactionHistoryPage = () => {
  const transactions = useSelector((state: RootState) => state.portfolio.transactions);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Coin',
      dataIndex: 'coin',
      key: 'coin',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
  ];

  return (
    <div>
      <Title
        level={2}
        className="text-lg sm:text-2xl lg:text-3xl mb-4 dark:bg-gray-900 dark:text-gray-100"
      >
        Transaction History
      </Title>
      <Table
        dataSource={transactions}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default TransactionHistoryPage;
