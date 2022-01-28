import { useState, useEffect } from 'react';
import { Stat } from './components/Stat';
import { Row, Col, Divider } from 'antd';
import { TTransaction } from '@redux/ducks/transactions';
import { useGetStats } from '../../hooks/useGetStats';
import { TStatuses } from '@redux/ducks/utils/base-resource';
import { useSpendingByAccount } from '../../hooks/useSpendingByAccount';
import { TAccount } from '@redux/ducks/accounts';

interface StatSectionProps {
    transactions: TTransaction[];
    status: keyof TStatuses;
    accounts: TAccount[];
}

const StatSection = ({ transactions, status, accounts }: StatSectionProps) => {
    const { totalExpense, totalIncome, totalNet } = useGetStats(transactions);
    const spendingByAccount = useSpendingByAccount(transactions, accounts);
    const [loading, setLoading] = useState<boolean>();

    useEffect(() => {
        if (status == 'LOADING') {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [status]);

    return (
        <div style={{ paddingTop: 30 }}>
            <Divider style={{ margin: 0 }} />
            <Row style={{ padding: 20 }} justify='center'>
                <Col
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    span={8}
                >
                    <Stat
                        loading={loading}
                        title='Total Expense'
                        value={totalExpense * -1}
                    />
                </Col>
                <Col
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    span={8}
                >
                    <Stat
                        loading={loading}
                        title='Total Income'
                        value={totalIncome}
                    />
                </Col>
                <Col
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    span={8}
                >
                    <Stat loading={loading} title='Net' value={totalNet} />
                </Col>
            </Row>
            <Divider style={{ margin: 0 }} />
        </div>
    );
};

export { StatSection };
