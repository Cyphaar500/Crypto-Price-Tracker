'use client';

import React from 'react';
import { Typography, Table, Image } from 'antd';

interface CryptoCurrency {
  id: string;
  coin: string;
  image: string;
  details: string;
  date: number;
}

const { Text } = Typography;


const TransactionPage = () => {

  const columns = [
    {
      title: '#', 
      dataIndex: 'index',
      key: 'index',
      render: (__: any, index: number) => index + 1,
      className: 'text-center text-sm md:text-base',
    },

    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (__: any, index: number) => new Date(),
    },

    {
      title: 'Coin',
      dataIndex: 'coin',
      key: 'coin',
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: CryptoCurrency) => (
        <div className="flex space-x-2">
          Add
        </div>
      ),
    }, 
  ];
  return (
    <div>
      <Text>Transaction History</Text>

      <Table 
        dataSource={} 
        columns={columns} 
        rowKey="id" 
      />
    </div>
  )
}

export default TransactionPage;
