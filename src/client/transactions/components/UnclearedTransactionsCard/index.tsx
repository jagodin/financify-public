import React, { useContext } from 'react';
import { FilterContext } from '../TransactionTable/components/Header/FilterContext';
import { TransactionPageContext } from '../../TransactionPageContext';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@redux/store';
import { Button, Space } from 'antd';
import { MenuOutlined, SettingOutlined } from '@ant-design/icons';
import { DragControls } from 'framer-motion';
import { TransactionsDuck } from '@redux/ducks/transactions';
import { WidgetControls } from '../SideBar/WidgetControls';
import {
    FilterType,
    ObjectComparatorType,
    StringComparatorType,
} from '../TransactionTable/components/Header/types';
import { v4 as uuidv4 } from 'uuid';
import { Autoplay, Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss'; // core Swiper

const { selectUncleared, selectUncategorized } = TransactionsDuck.selectors;

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

const UnclearedTransactionsCard = connector(
    ({ transactions, controls }: Props) => {
        const {
            addFilter,
            openFilterPanel,
            isFilterPresent,
            removeAllFilters,
        } = useContext(FilterContext);
        const { date } = useContext(TransactionPageContext);

        const unclearedTransactions = selectUncleared(
            transactions.transactions
        ).length;

        const uncategorizedTransactions = selectUncategorized(
            transactions.transactions
        ).length;

        const month = date.format('MMMM');

        const applyFilter = () => {
            removeAllFilters();
            addFilter({
                filterId: uuidv4(),
                input: 'uncleared',
                comparator: StringComparatorType.equal,
                type: FilterType.STRING_FILTER,
                field: 'status',
            });
            openFilterPanel();
        };

        const applyUncategorizedFilter = () => {
            removeAllFilters();
            addFilter({
                filterId: uuidv4(),
                objectValue: null,
                objectKey: 'name',
                comparator: ObjectComparatorType.equal,
                type: FilterType.OBJECT_FILTER,
                field: 'category',
            });
            openFilterPanel();
        };

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
                    <h2 style={{ lineHeight: 1 }}>Review Transactions</h2>
                    <WidgetControls
                        widgetName='unclearedTransactions'
                        controls={controls}
                    />
                </div>

                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    centeredSlides
                    slidesPerView={1}
                    autoplay={{ delay: 8000, disableOnInteraction: false }}
                    speed={800}
                    loop={true}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    spaceBetween={20}
                >
                    <SwiperSlide>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <h4>{`You have ${unclearedTransactions} uncleared transactions for the month of ${month}.`}</h4>
                            <Button
                                style={{ borderRadius: 16 }}
                                type='primary'
                                size='small'
                                onClick={applyFilter}
                            >
                                View Now
                            </Button>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <h4>{`You have ${uncategorizedTransactions} uncategorized transactions for the month of ${month}.`}</h4>
                            <Button
                                style={{ borderRadius: 16 }}
                                type='primary'
                                size='small'
                                onClick={applyUncategorizedFilter}
                            >
                                View Now
                            </Button>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </>
        );
    }
);

export { UnclearedTransactionsCard };
