'use client';

import React, { useState } from 'react';
import { Table, Input, Image, Button, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store";
import { useGetCryptocurrenciesQuery } from '../../features/cryptoApiSlice';
import { addToWatchlist, removeFromWatchlist } from "../../features/watchlistSlice";

interface CryptoCurrency {
  id: string;
  name: string;
  image: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export default function CryptoTable() {
  const { data: cryptocurrencies, isLoading, isError } = useGetCryptocurrenciesQuery();
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const watchlist = useSelector((state: RootState) => state.watchlist.items);

  const filteredData = cryptocurrencies?.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const navigateToDetails = (id: string) => {
    router.push(`/coin/${id}`);
  };

  if (isLoading) {
    return <Spin size="large" className="mt-20" />;
  }

  if (isError) {
    return <p>Error fetching data.</p>;
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
          onClick={() => navigateToDetails(record.id)}
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
      title: "Actions",
      key: "actions",
      render: (_: any, record: CryptoCurrency) => (
        <div className="flex space-x-2">
          {watchlist.includes(record.id) ? (
            <Button
              onClick={() => dispatch(removeFromWatchlist(record.id))}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" danger
            >
              Remove from Watchlist
            </Button>
          ) : (
            <Button
              onClick={() => dispatch(addToWatchlist(record.id))}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" 
            >
              Add to Watchlist
            </Button>
          )}
        </div>
      ),
      className: 'text-center',
    },
  ];

  return (
    <>
      <Input
        placeholder="Search by name or symbol"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 lg:w-1/3 mb-4"
      />
      <div className="overflow-x-auto transition-colors">
        <Table
          dataSource={filteredData || []}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={isLoading}
          scroll={{x: true}}
          bordered
          className="w-full bg-gray-100 dark:bg-gray-900"
        />
      </div>
    </>
  );
}
