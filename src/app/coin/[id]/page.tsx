'use client';

import { usePathname } from 'next/navigation';
import { useGetCryptoDetailsQuery, useGetHistoricalPricesQuery } from '@/app/features/cryptoApiSlice';
import { Typography, Spin } from 'antd';
import HistoricalChart from '@/app/components/historicalchartperformance/HistoricalChart';

const { Title, Text } = Typography;

export default function CoinDetailsPage() {
  const pathName = usePathname();
  const path = pathName?.split('/');
  const id = path[path.length - 1]
  const { 
    data: coinDetails, 
    isLoading: detailsLoading, 
    error: detailsError 
  } = useGetCryptoDetailsQuery(id);
  const {
    data: historicalData,
    isLoading: historicalLoading,
    error: historicalError,
  } = useGetHistoricalPricesQuery({ id, days: 7 });

  if (detailsLoading || historicalLoading) {
    return <Spin size="large" className="mt-20" />;
  }

  if (detailsError || historicalError) {
    return <div>Error fetching data.</div>;
  }

  const chartData =
    historicalData?.prices.map(([timestamp, price]: [number, number]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price,
    })) || [];


  return (
    <div className="p-4">
      <Title level={2}>{coinDetails?.name} ({coinDetails.symbol.toUpperCase()})</Title>
      <Text>
        <strong>Current Price:</strong> ${coinDetails.market_data.current_price.usd.toFixed(2)}
      </Text>
      <br />
      <Text>
        <strong>Market Cap:</strong> ${coinDetails.market_data.market_cap.usd.toLocaleString()}
      </Text>
      <br />
      <Text>
        <strong>24h Change:</strong> {coinDetails.market_data.price_change_percentage_24h.toFixed(2)}%
      </Text>
      <br />
      <div className="mt-4">
        <Text>
          <strong>Description:</strong>
        </Text>
        <p className="text-gray-600">{coinDetails.description.en || 'No description available.'}</p>
      </div>
      <Text>
        <strong>Price Trends (Last 7 days)</strong>
      </Text>
      <HistoricalChart data={chartData} />
    </div>
  );
}
