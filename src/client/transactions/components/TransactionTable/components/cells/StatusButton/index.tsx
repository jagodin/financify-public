import { useEffect, useState } from 'react';
import { SyncOutlined, CheckCircleFilled } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@redux/store';
import { Tooltip } from 'antd';

import { TransactionsDuck, TTransaction } from '@redux/ducks/transactions';

const { isStatusUpdating, isUpdating } = TransactionsDuck.selectors;
const { updateStatus } = TransactionsDuck.creators;

const mapStateToProps = (state: RootState) => {
    const { transactions } = state.transactions;
    const { statusUpdating, updating } = state.transactions;

    return {
        transactions,
        statusUpdating,
        updating,
        transactionsState: state.transactions,
    };
};

const mapDispatchToProps = {
    updateStatus,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
    transaction: TTransaction;
}

const TransactionStatusButton = connector(
    ({
        updateStatus,
        statusUpdating,
        transactionsState,
        transaction,
        updating,
    }: Props) => {
        const [spinning, setSpinning] = useState(false);
        const { transaction_id, status, transaction_kind } = transaction;

        useEffect(() => {
            if (
                isStatusUpdating(transactionsState, transaction_id) ||
                isUpdating(transactionsState, transaction_id)
            ) {
                setSpinning(true);
            } else {
                setSpinning(false);
            }
        }, [statusUpdating, updating]);

        const handleClick = () => {
            const newStatus = status == 'cleared' ? 'uncleared' : 'cleared';
            updateStatus([
                {
                    transaction_id,
                    transaction_kind,
                    status: newStatus,
                },
            ]);
        };

        if (spinning) {
            return (
                <SyncOutlined
                    spin
                    className={
                        status == 'cleared'
                            ? 'status-btn status-btn-cleared'
                            : 'status-btn status-btn-uncleared'
                    }
                />
            );
        }

        return (
            <Tooltip
                title={status.charAt(0).toUpperCase() + status.slice(1)}
                mouseEnterDelay={0.4}
            >
                <CheckCircleFilled
                    className={
                        status == 'cleared'
                            ? 'status-btn status-btn-cleared'
                            : 'status-btn status-btn-uncleared'
                    }
                    onClick={handleClick}
                />
            </Tooltip>
        );
    }
);

export { TransactionStatusButton };
