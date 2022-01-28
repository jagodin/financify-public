import React from 'react';
import { Tag } from 'antd';
import { TTransaction } from '@redux/ducks/transactions';

const Currency = ({ transaction }: { transaction: TTransaction }) => {
    return (
        <Tag className='transaction-row-currency-tag'>
            {transaction.iso_currency_code}
        </Tag>
    );
};

export { Currency };
