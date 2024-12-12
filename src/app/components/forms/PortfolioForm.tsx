'use client';

import React, { useEffect } from 'react';
import { Form, Input, Button, Select, Spin, DatePicker, message } from 'antd';
import { useDispatch } from 'react-redux';
import { addPortfolioEntry, updatePortfolioEntry } from '../../features/portfolioSlice';
import { useGetCryptocurrenciesQuery } from '../../features/cryptoApiSlice';

const PortfolioForm = ({ editingEntry }: { editingEntry?: any }) => {
  const dispatch = useDispatch();
  const { data: coins, isLoading, isError } = useGetCryptocurrenciesQuery();
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingEntry) {
      form.setFieldsValue({
        coin: editingEntry.coin,
        units: editingEntry.units,
        purchasePrice: editingEntry.purchasePrice,
        purchaseDate: editingEntry.purchaseDate,
      });
    }
  }, [editingEntry, form]);

  const onFinish = (values: any) => {
    if (editingEntry) {
      dispatch(updatePortfolioEntry({ id: editingEntry.id, ...values }));
      message.success('Portfolio updated successfully');
    } else {
      dispatch(addPortfolioEntry(values));
      message.success('Portfolio entry added successfully');
    }
    form.resetFields();
  };

  if (isLoading) {
    return <Spin size="large" className="mt-20" />;
  }

  if (isError) {
    return <p>Error fetching data.</p>;
  }

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item 
        name="coin" 
        label="Cryptocurrency" 
        rules={[{ required: true, message: 'Please select a cryptocurrency' }]}
        className=''
      >
        <Select>
          {coins?.map((coin: any) => (
            <Select.Option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="units" label="Units Owned" rules={[{ required: true, message: 'Please enter the number of units' }]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item name="purchasePrice" label="Purchase Price (USD)" rules={[{ required: true, message: 'Please enter the purchase price' }]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item name="purchaseDate" label="Purchase Date" rules={[{ required: true, message: 'Please select the purchase date' }]}>
        <DatePicker />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        {editingEntry ? 'Update Entry' : 'Add Entry'}
      </Button>
    </Form>
  );
};

export default PortfolioForm;
