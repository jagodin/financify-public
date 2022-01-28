import { useState, useEffect, useContext } from 'react';
import moment, { Moment } from 'moment';
import { Row, Col, Input, Space } from 'antd';
import {
    Header,
    StatSection,
    DateRangeFilter,
    TransactionTable,
    SideBar,
} from './components';
import _ from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import TSwiper from 'swiper';
import { useViewport } from 'src/hooks/useViewport';

// Redux imports
import { RootState } from '@redux/store';
import { TransactionsDuck, TTransaction } from '@redux/ducks/transactions';
import { CategoryDuck } from '@redux/ducks/categories';
import { TagsDuck } from '@redux/ducks/tags';
import { AccountsDuck } from '@redux/ducks/accounts';
import { connect, ConnectedProps } from 'react-redux';
import { SettingsDuck } from '@redux/ducks/settings';

// Contexts
import {
    FilterContext,
    useFilterContextValues,
} from './components/TransactionTable/components/Header/FilterContext';
import {
    TransactionPageContext,
    useTransactionPageContextValues,
} from './TransactionPageContext';

const { fetchTransactionsByParams } = TransactionsDuck.creators;
const { fetchCategories } = CategoryDuck.creators;
const { fetchTags } = TagsDuck.creators;
const { fetchAccountsByParams } = AccountsDuck.creators;
const { fetchSettings, updateSettings } = SettingsDuck.creators;

const mapDispatchToProps = {
    fetchTransactionsByParams,
    fetchCategories,
    fetchTags,
    fetchAccountsByParams,
    fetchSettings,
    updateSettings,
};

const mapStateToProps = (state: RootState) => {
    const { transactions, status } = state.transactions;
    const { accounts } = state.accounts;

    return { transactions, status, accounts };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
interface Props extends PropsFromRedux {}

// Other types
export type DateMode = 'day' | 'week' | 'month';

const TransactionPageInner = connector(
    ({
        transactions,
        fetchTransactionsByParams,
        fetchCategories,
        fetchTags,
        fetchAccountsByParams,
        fetchSettings,
        updateSettings,
        status,
        accounts,
    }: Props) => {
        const history = useHistory();
        const location = useLocation();

        const urlSearchParams = new URLSearchParams(location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        const [dateMode, setDateMode] = useState<DateMode>('month');
        const [dates, setDates] = useState<Moment[]>();
        const [indexOffset, setIndexOffset] = useState<number>(0);

        const { date, setDate } = useContext(TransactionPageContext);
        const [swiper, setSwiper] = useState<TSwiper>();

        const [filteredTransactions, setFilteredTransactions] =
            useState<TTransaction[]>(transactions);

        const fetchTrasnactionsBetweenDates = (
            date: Moment,
            dateMode: DateMode
        ) => {
            switch (dateMode) {
                case 'day':
                    fetchTransactionsByParams(
                        `date=${date.format('YYYY-MM-DD')}&archived=false`
                    );
                    break;
                case 'month':
                    const nextDate = moment(date).add(1, 'months');
                    const paramString = `date:gte=${date.format(
                        'YYYY-MM-01'
                    )}&date:lt=${nextDate.format('YYYY-MM-01')}&archived=false`;
                    fetchTransactionsByParams(paramString);
                    break;
                default:
                    break;
            }
        };

        useEffect(() => {
            fetchTrasnactionsBetweenDates(date, dateMode);
        }, [date, dateMode]);

        // When new transactions come in, we need to filter them according to the date mode
        useEffect(() => {
            switch (dateMode) {
                case 'day':
                    // TODO: Implement or remove support
                    break;
                case 'month':
                    const filtered = transactions.filter((transaction) =>
                        transaction.date.startsWith(date.format('YYYY-MM'))
                    );
                    setFilteredTransactions(filtered);

                    break;
                default:
                    break;
            }
        }, [transactions]);

        useEffect(() => {
            fetchCategories();
            fetchTags();
            fetchAccountsByParams('archived=false');
            fetchSettings();
        }, []);

        const { width } = useViewport();

        const col1Span = width < 1500 ? 24 : 18;
        const col2Span = width < 1500 ? 0 : 6;

        return (
            <div>
                <Row gutter={[20, 20]}>
                    <Col span={col1Span}>
                        <Header
                            swiper={swiper}
                            setDate={setDate}
                            mode={dateMode}
                            dates={dates}
                            date={date}
                            indexOffset={indexOffset}
                        />
                        <DateRangeFilter
                            setDate={setDate}
                            mode={dateMode}
                            date={date}
                            swiper={swiper}
                            setSwiper={setSwiper}
                            setDates={setDates}
                            dates={dates}
                            indexOffset={indexOffset}
                            setIndexOffset={setIndexOffset}
                        />
                        <StatSection
                            status={status}
                            transactions={transactions}
                            accounts={accounts}
                        />
                        <TransactionTable
                            status={status}
                            transactions={filteredTransactions}
                        />
                    </Col>
                    <Col span={col2Span} style={{ paddingRight: 0 }}>
                        <SideBar />
                    </Col>
                </Row>
            </div>
        );
    }
);

const TransactionPage = () => {
    const transactionPageContextValues = useTransactionPageContextValues();
    const filterContextValues = useFilterContextValues();

    return (
        <TransactionPageContext.Provider value={transactionPageContextValues}>
            <FilterContext.Provider value={filterContextValues}>
                <TransactionPageInner />
            </FilterContext.Provider>
        </TransactionPageContext.Provider>
    );
};

export default TransactionPage;
