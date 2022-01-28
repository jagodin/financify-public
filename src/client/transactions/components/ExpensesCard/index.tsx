import { Button, Space, Skeleton } from 'antd';
import { Budget } from './components/Budget';
import { MenuOutlined, SettingOutlined } from '@ant-design/icons';
import { DragControls } from 'framer-motion';
import { WidgetControls } from '../SideBar/WidgetControls';

import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@redux/store';
const mapDispatchToProps = {};
const mapStateToProps = (state: RootState) => {
    return { transactions: state.transactions };
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type DispatchProps = typeof mapDispatchToProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
interface OwnProps {
    controls?: DragControls;
}
type Props = PropsFromRedux & DispatchProps & OwnProps;

export type BudgetType = {
    name: string;
    amount: number;
    budget: number;
    month: number;
    year: number;
    iso_currency_code: string;
    color: string;
};

const expenseData: BudgetType[] = [
    {
        name: 'Food & Groceries',
        amount: 258.86,
        budget: 400.0,
        month: 1,
        year: 2022,
        iso_currency_code: 'CAD',
        color: '#17BCFF',
    },
    {
        name: 'Shopping',
        amount: 151.89,
        budget: 300.0,
        month: 1,
        year: 2022,
        iso_currency_code: 'CAD',
        color: '#21B573',
    },
    {
        name: 'Gas',
        amount: 110.86,
        budget: 120.0,
        month: 1,
        year: 2022,
        iso_currency_code: 'CAD',
        color: '#A461D8',
    },
    {
        name: 'Utilities',
        amount: 86.5,
        budget: 100.0,
        month: 1,
        year: 2022,
        iso_currency_code: 'CAD',
        color: '#DE4436',
    },
    {
        name: 'Rent',
        amount: 1600,
        budget: 1600,
        month: 1,
        year: 2022,
        iso_currency_code: 'CAD',
        color: '#A0D911',
    },
    {
        name: 'Investing',
        amount: 275,
        budget: 550,
        month: 1,
        year: 2022,
        iso_currency_code: 'CAD',
        color: '#00E6D9',
    },
];

const ExpensesCard = connector(({ transactions, controls }: Props) => {
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
                <h2 style={{ lineHeight: 1 }}>Spending by Category</h2>
                <WidgetControls widgetName='expenseCard' controls={controls} />
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <Space
                    size={20}
                    direction='vertical'
                    style={{
                        width: '100%',
                        maxHeight: 410,
                    }}
                    className='expense-card-scrollable-content'
                >
                    {expenseData.map((expense) => {
                        return <Budget {...expense} />;
                    })}
                </Space>
                {transactions.status == 'LOADING' ? (
                    <Skeleton.Button size='small' style={{ width: 136 }} />
                ) : (
                    <Button
                        style={{ borderRadius: 16 }}
                        type='primary'
                        size='small'
                    >
                        View all Budgets
                    </Button>
                )}
            </div>
        </>
    );
});

export { ExpensesCard };
