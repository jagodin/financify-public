import React from 'react';
import { createContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import moment, { Moment } from 'moment';

export interface TransactionPageContextProps {
    date: Moment;
    setDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
}

export const useTransactionPageContextValues =
    (): TransactionPageContextProps => {
        const history = useHistory();
        const location = useLocation();

        const urlSearchParams = new URLSearchParams(location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        const [dates, setDates] = useState<Moment[]>();
        const [indexOffset, setIndexOffset] = useState<number>(0);
        const [date, setDate] = useState<Moment>(() => {
            let dateFromParams: Moment;
            if (!params.month || !params.year) {
                dateFromParams = moment();
                const urlParams = new URLSearchParams();
                urlParams.append('month', moment(dateFromParams).format('MM'));
                urlParams.append('year', moment(dateFromParams).format('YYYY'));

                history.push({ search: urlParams.toString() });
            } else {
                if (params.month.length == 1) params.month = `0${params.month}`;
                dateFromParams = moment(
                    `${params.year}${params.month}01`,
                    'YYYYMMDD'
                );
            }
            return dateFromParams;
        });
        return {
            date,
            setDate,
        };
    };

const transactionPageContextDefaulValues: TransactionPageContextProps = {
    date: moment(),
    setDate: () => null,
};

export const TransactionPageContext =
    createContext<TransactionPageContextProps>(
        transactionPageContextDefaulValues
    );
