'use client';

import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    InputNumber,
    Form,
    notification,
} from 'antd';
import { useGetCryptoPriceQuery } from '@/app/features/cryptoApiSlice';
import { deletePortfolioEntry } from '@/app/features/portfolioSlice';
import { addAlert, removeAlert } from '@/app/features/alertSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store";
import { v4 as uuidv4 } from 'uuid';
import CustomModal from '../forms/CustomModal';

interface PortfolioEntry {
    id: string;
    coin: string;
    units: number;
    purchasePrice: number;
    purchaseDate: string;
    totalValue?: number;
    currentPrice?: number;
}


export default function PortfolioTable() {
    const portfolio = useSelector((state: RootState) => state.portfolio.items);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<PortfolioEntry | null>(null);
    const alerts = useSelector((state: RootState) => state.alerts.alerts);
    const dispatch = useDispatch();

    const { data: coinsPrices } = useGetCryptoPriceQuery(
        portfolio.map((entry) => entry.coin).join(',')
    );

    const openModal = (entry?: PortfolioEntry) => {
        setEditingEntry(entry || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingEntry(null);
        setIsModalOpen(false);
    };

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
            title: 'Current Price (USD)',
            key: 'currentPrice',
            render: (_: any, record: PortfolioEntry) => {
                const currentPrice = coinsPrices?.[record.coin]?.usd;
                return currentPrice !== undefined ? (
                    <span>${currentPrice.toFixed(2)}</span>
                ) : (
                    <span>N/A</span>
                );
            },
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
            title: 'Profit/Loss (USD)',
            key: 'profitLoss',
            render: (_: any, record: any) => {
                const currentPrice = coinsPrices?.[record.coin]?.usd || 0;
                const profitLoss = (currentPrice - record.purchasePrice) * record.units;
                return (
                    <span className={profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {profitLoss.toFixed(2)}
                    </span>
                );
            },
        },
        {
            title: 'Total Value (USD)',
            key: 'totalValue',
            render: (_: any, record: any) => {
                const currentPrice = coinsPrices?.[record.coin]?.usd || 0;
                return (record.units * currentPrice).toFixed(2);
            },
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
            render: (_: any, record: PortfolioEntry) => (
                <div>
                    <Button
                        onClick={() => openModal(record)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => dispatch(deletePortfolioEntry(record.id))}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        danger
                    >
                        Remove
                    </Button>
                </div>
            ),
        },
    ];


    return (
        <div className="overflow-x-auto transition-colors">
            <Button
                type="primary"
                onClick={() => openModal()}
                className="mb-4"
            >
                Add Portfolio Entry
            </Button>

            <CustomModal
                isModalOpen={isModalOpen}
                editingEntry={editingEntry}
                closeModal={closeModal}
            />
            <Table
                dataSource={portfolio}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
                bordered
                className="w-full bg-gray-100 dark:bg-gray-900"
            />
        </div>
    );
}
