import { PropsWithChildren, useEffect } from 'react';
import { TTransaction } from '@redux/ducks/transactions';
import {
    EditTransactionDrawer,
    FocusableInput,
} from '../../../../EditTransactionDrawer';
import { useState } from 'react';

interface OpenDrawerButtonProps {
    transaction: TTransaction;
    focusOn?: FocusableInput;
}

const OpenDrawerButton = ({
    transaction,
    children,
    focusOn,
}: PropsWithChildren<OpenDrawerButtonProps>) => {
    const [visible, setVisible] = useState<boolean>(false);

    const toggleDrawer = () => {
        setVisible(!visible);
    };

    const openDrawer = () => {
        if (!visible) {
            setVisible(true);
        }
    };

    return (
        <div style={{ cursor: 'pointer' }} onClick={() => openDrawer()}>
            {children}
            <EditTransactionDrawer
                transaction={{ ...transaction }}
                closeDrawer={toggleDrawer}
                visible={visible}
                focusOn={focusOn}
            />
        </div>
    );
};

export { OpenDrawerButton };
