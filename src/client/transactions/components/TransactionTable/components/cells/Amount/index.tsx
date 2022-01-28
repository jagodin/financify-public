import { TTransaction } from '@redux/ducks/transactions';
import { Input, Form } from 'antd';
import { connect, ConnectedProps } from 'react-redux';
import { TransactionsDuck } from '@redux/ducks/transactions';
import { useState, useRef } from 'react';
import { notification } from 'utils/notification';
import CurrencyInput from 'react-currency-input-field';
import cc from 'iso-country-currency';

const { updateTransactions } = TransactionsDuck.creators;

const mapDispatchToProps = { updateTransactions };

const connector = connect(null, mapDispatchToProps);
type DispatchProps = typeof mapDispatchToProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
interface OwnProps {
    transaction: TTransaction;
}
type Props = PropsFromRedux & DispatchProps & OwnProps;

const Amount = connector(({ transaction, updateTransactions }: Props) => {
    const [value, setValue] = useState<string>(transaction.amount.toFixed(2));
    const [form] = Form.useForm();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (value: string | undefined) => {
        if (value) {
            setValue(parseFloat(value).toFixed(2));
            form.setFieldsValue({ amount: parseFloat(value) });
        }
    };

    const handleBlur = async () => {
        try {
            const validateData = await form.validateFields();
            if (value !== transaction.amount.toFixed(2)) {
                updateTransactions([
                    {
                        transaction_id: transaction.transaction_id,
                        transaction_kind: transaction.transaction_kind,
                        amount: parseFloat(value),
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
            setValue(transaction.amount.toFixed(2));
            form.setFieldsValue({ amount: transaction.amount });
        }
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }
    };

    const symbol = cc.getParamByParam(
        'currency',
        transaction.iso_currency_code,
        'symbol'
    );

    return (
        <Form form={form} initialValues={transaction}>
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: 'The ammount of a transaction is required.',
                    },
                    {
                        type: 'number',
                        message:
                            'The amount of a transaction must be a number.',
                    },
                    {
                        type: 'number',
                        max: 10000000000,
                        message:
                            'The ammount of a transaction cannot contain more than 11 digits.',
                    },
                    {
                        type: 'number',
                        min: -9999999999,
                        message:
                            'The ammount of a transaction cannot contain more than 11 digits.',
                    },
                    () => ({
                        validator(_, value) {
                            if (/(?<!\.)\b0(?:\.0+)?(?!\.)\b/.test(value)) {
                                return Promise.reject(
                                    new Error(
                                        'The ammount of a transaction cannot be 0.'
                                    )
                                );
                            } else {
                                return Promise.resolve();
                            }
                        },
                    }),
                ]}
                hidden
                name='amount'
            >
                <Input value={value} />
            </Form.Item>
            <CurrencyInput
                ref={inputRef}
                className='transaction-table-row-input'
                value={value}
                decimalsLimit={2}
                onValueChange={handleChange}
                style={{ textAlign: 'right' }}
                prefix={symbol}
                onBlur={handleBlur}
                onKeyDown={handleOnKeyDown}
            />
        </Form>
    );
});

export { Amount };
