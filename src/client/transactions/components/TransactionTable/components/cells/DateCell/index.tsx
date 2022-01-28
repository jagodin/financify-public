import { TTransaction } from '@redux/ducks/transactions';
import moment from 'moment';
import { OpenDrawerButton } from '../OpenDrawerButton';

const DateCell = ({ transaction }: { transaction: TTransaction }) => {
    const dateObj = moment(transaction.date, 'YYYY-MM-DD');
    const day = dateObj.format('Do');
    const month = dateObj.format('MMM');

    return (
        <OpenDrawerButton focusOn='date' transaction={transaction}>
            <span className='transaction-row-context'>{`${month} ${day}`}</span>
        </OpenDrawerButton>
    );
};

export { DateCell };
