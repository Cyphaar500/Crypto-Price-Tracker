import React, { useEffect } from 'react';
import {
    Modal,
    Button,
    InputNumber,
    Select,
    message,
    DatePicker,
    Form,
} from 'antd';
import { useDispatch } from 'react-redux';
import { addPortfolioEntry, editPortfolioEntry } from '@/app/features/portfolioSlice';
import { useGetCryptocurrenciesQuery } from '../../features/cryptoApiSlice';
import { v4 as uuidv4 } from 'uuid';

interface PortfolioEntry {
    id: string;
    coin: string;
    units: number;
    purchasePrice: number;
    purchaseDate: string;
    currentPrice?: number;
}

interface CustomModalProps {
    isModalOpen: boolean;
    editingEntry: PortfolioEntry | null;
    closeModal: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ isModalOpen, editingEntry, closeModal }) => {
    const [form] = Form.useForm();
    const { data: coins, isLoading, isError } = useGetCryptocurrenciesQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        if (editingEntry) {
            form.setFieldsValue(editingEntry);
        } else {
            form.resetFields();
        }
    }, [editingEntry, form, isModalOpen]);

    const onFinish = (values: any) => {
        if (editingEntry) {
            dispatch(editPortfolioEntry({ ...editingEntry, ...values }));
            message.success('Portfolio updated successfully');
        } else {
            dispatch(addPortfolioEntry({ id: uuidv4(), ...values }));
            message.success('Portfolio entry added successfully');
        }
        closeModal();
    };

    return (
        <div>
            <Modal
                title={editingEntry ? "Edit Portfolio Entry" : "Add Portfolio Entry"}
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
            >
                <Form
                    form={form}
                    initialValues={editingEntry || { coin: '', units: 0, purchasePrice: 0 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="coin"
                        label={<span className="text-gray-700 dark:text-gray-400">Select Token</span>}
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
                    <Form.Item
                        name="units"
                        label="Units"
                        rules={[{ required: true, message: 'Please enter units owned' }]}
                    >
                        <InputNumber min={0} placeholder="Enter units owned" />
                    </Form.Item>
                    <Form.Item
                        name="purchasePrice"
                        label="Purchase Price (USD)"
                        rules={[{ required: true, message: 'Please enter purchase price' }]}
                    >
                        <InputNumber min={0} placeholder="Enter purchase price in USD" />
                    </Form.Item>
                    <Form.Item
                        name="purchaseDate"
                        label={<span className="text-gray-700 dark:text-gray-400">Purchase Date</span>}
                        rules={[{ required: true, message: 'Please select the purchase date' }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingEntry ? "Save Changes" : "Add Entry"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default CustomModal;
