'use client';

import React, { useState, useEffect } from 'react';
import { Image, Typography, Table, Button, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useGetCryptocurrenciesQuery } from '../features/cryptoApiSlice';
import { removeFromWatchlist } from '../features/watchlistSlice';

interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

const { Title } = Typography;

export default function WatchlistPage() {
  const dispatch = useDispatch();
  const watchlist = useSelector((state: RootState) => state.watchlist.items);
  const { data: cryptocurrencies, isLoading, isError } = useGetCryptocurrenciesQuery();
  const [filteredCoins, setFilteredCoins] = useState<CryptoCurrency[]>([]); 

  useEffect(() => {
    if (cryptocurrencies) {
      const coins = cryptocurrencies.filter((coin: CryptoCurrency) => watchlist.includes(coin.id));
      setFilteredCoins(coins); 
    }
  }, [cryptocurrencies, watchlist]);

  if (isLoading) {
    return <Spin size="large" className="flex justify-center items-center h-screen" />;
  }
  if (isError) {
    return <p className="text-center text-red-500">Error fetching data.</p>;
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
      className: 'text-center text-sm md:text-base',
    },
    {
      title: 'Coin',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: CryptoCurrency) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          className="flex items-center text-blue-500 hover:underline">
          <Image src={record.image} alt={record.name} width={24} height={24} preview={false} />
          <span className="ml-2 whitespace-nowrap text-sm md:text-base">{record.name}</span>
        </span>
      ),
      className: 'text-left',
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol: string) => symbol.toUpperCase(),
      className: 'text-center text-sm md:text-base',
    },
    {
      title: 'Price',
      dataIndex: 'current_price',
      key: 'current_price',
      render: (price: number) => `$${price.toFixed(2)}`,
      className: 'text-right text-sm md:text-base',
    },
    {
      title: 'Market Cap',
      dataIndex: 'market_cap',
      key: 'market_cap',
      render: (marketCap: number) => `$${marketCap.toLocaleString()}`,
      className: 'text-right text-sm md:text-base',
    },
    {
      title: '24h Change',
      dataIndex: 'price_change_percentage_24h',
      key: 'price_change_percentage_24h',
      render: (change: number) => (
        <span className={`text-sm md:text-base ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change.toFixed(2)}%
        </span>
      ),
      className: 'text-center',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CryptoCurrency) => (
        <Button
          onClick={() => dispatch(removeFromWatchlist(record.id))}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" danger
        >
          Remove from Watchlist
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Title level={2}
      className="text-lg sm:text-2xl lg:text-3xl mb-4 dark:bg-gray-900 dark:text-gray-100"
      >
        My Watchlist
      </Title>
      {filteredCoins.length > 0 ? (
        <Table
          dataSource={filteredCoins}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={isLoading}
          scroll={{ x: true }}
          bordered
          className="overflow-x-auto"
        />
      ) : (
        <p>Your watchlist is empty.</p>
      )}
    </div>
  );
}
