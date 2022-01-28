import { ExpensesCard, SpendingByAccount } from '../index';
import {
    Reorder,
    useDragControls,
    DragControls,
    useMotionValue,
} from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRaisedShadow } from 'src/hooks/useRaisedShadow';
import { useForceUpdate } from 'src/hooks/useForceUpdate';
import StickyBox from 'react-sticky-box';

import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@redux/store';

import { SettingsDuck } from '@redux/ducks/settings';
import { TTransaction } from '@redux/ducks/transactions';
import { UnclearedTransactionsCard } from '../UnclearedTransactionsCard';

const { updateSettings } = SettingsDuck.creators;

const mapDispatchToProps = {
    updateSettings,
};
const mapStateToProps = (state: RootState) => {
    return {
        settings: state.settings.settings,
        transactions: state.transactions.transactions,
    };
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type DispatchProps = typeof mapDispatchToProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
interface OwnProps {}
type Props = PropsFromRedux & DispatchProps & OwnProps;

const renderSideBarItem = ({
    sideBarItem,
    controls,
}: {
    sideBarItem: string;
    controls?: DragControls;
}) => {
    switch (sideBarItem) {
        case 'expenseCard':
            return <ExpensesCard controls={controls} />;
        case 'spendingByAccount':
            return <SpendingByAccount controls={controls} />;
        case 'unclearedTransactions':
            return <UnclearedTransactionsCard controls={controls} />;
        default:
            return <ExpensesCard />;
    }
};

export const Item = ({
    sideBarItem,
    transactions,
}: {
    sideBarItem: string;
    transactions: TTransaction[];
}) => {
    const forceUpdate = useForceUpdate();

    const controls = useDragControls();
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);

    // Rerender Item on transactions change
    useEffect(() => {
        forceUpdate();
    }, [transactions]);

    return (
        <Reorder.Item
            value={sideBarItem}
            id={sideBarItem}
            dragListener={false}
            style={{ boxShadow, y, marginBottom: 20 }}
            dragControls={controls}
            as='div'
            className='expense-card-container'
            layout='position'
        >
            {renderSideBarItem({ sideBarItem, controls })}
        </Reorder.Item>
    );
};

const SideBar = connector(
    ({ settings, updateSettings, transactions }: Props) => {
        const handleReorder = (newOrder: any) => {
            updateSettings({ transaction_widget_order: newOrder });
        };

        return settings.transaction_widget_order != undefined ? (
            <StickyBox offsetTop={80} offsetBottom={40}>
                <Reorder.Group
                    as='div'
                    axis='y'
                    values={settings.transaction_widget_order}
                    onReorder={handleReorder}
                    layout='position'
                >
                    {settings.transaction_widget_order.map((item) => (
                        <Item
                            transactions={transactions}
                            key={item}
                            sideBarItem={item}
                        />
                    ))}
                </Reorder.Group>
            </StickyBox>
        ) : null;
    }
);

export { SideBar };
