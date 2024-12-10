'use client';

import React, { useState } from 'react';
import { Typography } from 'antd';
import CryptoTable from '../tables/CryptoTable';


const { Title } = Typography;

export default function Homepage() {

  return (
    <div className="md:p-4 lg:p-8 space-y-4">
      <Title
        level={2}
        className="text-lg sm:text-2xl lg:text-3xl mb-4 dark:bg-gray-900 dark:text-gray-100"
      >
        Cryptocurrency Price Tracker
      </Title>
      <CryptoTable />
    </div>
  );
}
