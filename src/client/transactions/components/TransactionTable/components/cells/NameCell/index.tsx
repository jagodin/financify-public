import React, { useState, useEffect, useRef } from 'react';
import { Row, Space, Divider, Input, Form } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { TTransaction } from '@redux/ducks/transactions';
import { OpenDrawerButton } from '../OpenDrawerButton';
import { notification } from 'utils/notification';

import { connect, ConnectedProps } from 'react-redux';
import { TransactionsDuck } from '@redux/ducks/transactions';

const { updateTransactions } = TransactionsDuck.creators;
const mapDispatchToProps = {
    updateTransactions,
};

const connector = connect(null, mapDispatchToProps);
type DispatchProps = typeof mapDispatchToProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
interface OwnProps {
    transaction: TTransaction;
}
type Props = PropsFromRedux & DispatchProps & OwnProps;

const NameCell = connector(({ transaction, updateTransactions }: Props) => {
    const [form] = Form.useForm();
    const [inputValue, setInputValue] = useState<string>(transaction.name);
    const inputRef = useRef<Input>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        form.setFieldsValue({ name: e.target.value });
    };

    const handleBlur = async () => {
        try {
            const validateData = await form.validateFields();
            if (inputValue !== transaction.name) {
                updateTransactions([
                    {
                        transaction_id: transaction.transaction_id,
                        transaction_kind: transaction.transaction_kind,
                        name: inputValue,
                    },
                ]);
            }
        } catch (err: any) {
            const { errorFields } = err;
            for (const errorField of errorFields) {
                const { errors } = errorField;
                for (const error of errors) {
                    notification({
                        notification_type: 'error',
                        message: error,
                    });
                }
            }
            setInputValue(transaction.name);
        }
    };

    const handleOnPressEnter = () => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    useEffect(() => {
        setInputValue(transaction.name);
    }, [transaction]);

    return (
        <React.Fragment>
            <Row>
                <Form
                    style={{ width: '100%' }}
                    form={form}
                    initialValues={transaction}
                >
                    {/* Hidden form component so we render an additional input */}
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message:
                                    'The name of a transaction is required.',
                            },
                            {
                                max: 60,
                                message:
                                    'The name of a transaction cannot exceed the length of 60 characters.',
                            },
                        ]}
                        hidden
                        name='name'
                    >
                        <Input value={inputValue} />
                    </Form.Item>
                    <Input
                        onChange={handleInputChange}
                        className='transaction-table-row-input'
                        value={inputValue}
                        onBlur={handleBlur}
                        onPressEnter={handleOnPressEnter}
                        ref={inputRef}
                    />
                </Form>
            </Row>
            <Row>
                <Space
                    direction='horizontal'
                    size={0}
                    style={{ marginLeft: 6 }}
                >
                    <OpenDrawerButton
                        focusOn='account'
                        transaction={transaction}
                    >
                        <span className='transaction-row-context'>
                            {transaction.account.name}
                        </span>
                    </OpenDrawerButton>
                    <Divider type='vertical' />
                    <OpenDrawerButton transaction={transaction}>
                        <span className='transaction-row-context'>
                            {transaction.account.institution_name}
                        </span>
                    </OpenDrawerButton>
                    <Divider type='vertical' />
                    <OpenDrawerButton transaction={transaction}>
                        <span className='transaction-row-context'>
                            {transaction?.category?.name ? (
                                transaction?.category.name
                            ) : (
                                <Space>
                                    <WarningOutlined
                                        style={{ color: '#fa8c16' }}
                                    />
                                    {'Uncateogorized'}
                                </Space>
                            )}
                        </span>
                    </OpenDrawerButton>
                </Space>
            </Row>
        </React.Fragment>
    );
});

export { NameCell };
