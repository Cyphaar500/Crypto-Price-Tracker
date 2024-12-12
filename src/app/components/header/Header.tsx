'use client';

import Link from 'next/link';
import { Menu } from 'antd';

export default function HeaderComponent() {
  return (
    <header>
      <Menu className="md:flex space-x-4" theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item  key="1">
          <Link href="/">Tracker</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link href="/watchlist">Watchlist</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link href="/portfolio">Portfolio</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link href="/transaction">Transactions</Link>
        </Menu.Item>
      </Menu>
    </header>
  );
}
