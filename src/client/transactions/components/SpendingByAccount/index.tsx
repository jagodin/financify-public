import { Button, Row, Col, Space, Skeleton, Popover } from 'antd';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@redux/store';
import { useSpendingByAccount } from '../../hooks/useSpendingByAccount';
import { TAccount } from '@redux/ducks/accounts';
import { formatCurrency } from 'utils/formatCurrency';
import { MenuOutlined, SettingOutlined } from '@ant-design/icons';
import { DragControls } from 'framer-motion';
import { Settings } from './Settings';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { WidgetControls } from '../SideBar/WidgetControls';

const mapDispatchToProps = {};
const mapStateToProps = (state: RootState) => {
    const transactions = state.transactions;
    const accounts = state.accounts;
    return { transactions, accounts, settings: state.settings.settings };
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type DispatchProps = typeof mapDispatchToProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
interface OwnProps {
    controls?: DragControls;
}
type Props = PropsFromRedux & DispatchProps & OwnProps;

const SpendingByAccount = connector(
    ({ transactions, accounts, controls, settings }: Props) => {
        const {
            widget_spending_account_even_spending,
            widget_spending_account_sort_by,
        } = settings;
        const spendingByAccounts = useSpendingByAccount(
            transactions.transactions,
            accounts.accounts
        );

        const [filteredSpendingByAccounts, setFilteredSpendingByAccounts] =
            useState(spendingByAccounts);

        useEffect(() => {
            let filteredObjects = spendingByAccounts;
            if (!widget_spending_account_even_spending) {
                filteredObjects = spendingByAccounts.filter(
                    (obj) => obj.totalAmount != 0
                );
            }
            if (widget_spending_account_sort_by == 'asc_total') {
                filteredObjects = _.orderBy(
                    filteredObjects,
                    ['totalAmount'],
                    'asc'
                );
            }

            setFilteredSpendingByAccounts(filteredObjects);
        }, [
            spendingByAccounts,
            widget_spending_account_even_spending,
            widget_spending_account_sort_by,
        ]);

        return (
            <>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        marginBottom: 20,
                    }}
                >
                    <h2 style={{ lineHeight: 1 }}>Spending by Account</h2>
                    <WidgetControls
                        widgetName='spendingByAccount'
                        controls={controls}
                        settingsPopover={<Settings />}
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Space
                        size={15}
                        direction='vertical'
                        style={{
                            width: '100%',
                            maxHeight: 410,
                        }}
                        className='expense-card-scrollable-content'
                    >
                        {filteredSpendingByAccounts.map((obj) => {
                            return (
                                <AccountRow
                                    loading={transactions.status == 'LOADING'}
                                    {...obj}
                                />
                            );
                        })}
                    </Space>
                    {transactions.status == 'LOADING' ? (
                        <Skeleton.Button size='small' style={{ width: 144 }} />
                    ) : (
                        <Button
                            style={{ borderRadius: 16 }}
                            type='primary'
                            size='small'
                        >
                            View all Accounts
                        </Button>
                    )}
                </div>
            </>
        );
    }
);

const AccountRow = ({
    account,
    totalAmount,
    loading = true,
}: {
    account: TAccount;
    totalAmount: number;
    loading?: boolean;
}) => {
    const totalAmountColor: React.CSSProperties =
        totalAmount > 0
            ? {
                  color: '#21b573',
              }
            : totalAmount == 0
            ? {
                  color: '#b1b1b1',
              }
            : {
                  color: '#df1a1a',
              };

    const accountMax = 140;
    const accountMin = 40;
    const accountNameSkeletonWidth = Math.floor(
        Math.random() * (accountMax - accountMin + 1) + accountMin
    );

    return (
        <Row justify='space-between' align='middle'>
            {loading ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'rgba(190,190,190,.2)',
                            height: 24,
                            width: `${accountNameSkeletonWidth}px`,
                        }}
                    ></div>
                    <div
                        style={{
                            backgroundColor: 'rgba(190,190,190,.2)',
                            height: 24,
                            width: 50,
                        }}
                    ></div>
                </div>
            ) : (
                <>
                    <Col>
                        <span
                            onClick={() =>
                                console.log(`go to account ${account.name}`)
                            }
                            style={{
                                fontSize: 16,
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}
                        >
                            {account.name}
                        </span>
                    </Col>
                    <Col>
                        <span style={{ ...totalAmountColor }}>
                            {formatCurrency({ value: totalAmount })}
                        </span>
                    </Col>
                </>
            )}
        </Row>
    );
};

export { SpendingByAccount };
