'use client';

import 'antd/dist/reset.css';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { Layout } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import HeaderComponent from './components/header/Header';
import ThemeToggle from './components/ThemeToggle';

const { Header, Content } = Layout;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className=''>
        <Provider store={store}>
          <AntdRegistry>
            <Layout>
              <Header>
                <HeaderComponent />
              </Header>
              <ThemeToggle />
              <Content className="p-2 sm:p-1 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-w-screen min-h-screen">
                {children}
              </Content>
            </Layout>
          </AntdRegistry>
        </Provider>
      </body>
    </html>
  );
}
