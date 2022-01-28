import { TAccount } from '@redux/ducks/accounts';
import { TTransaction } from '@redux/ducks/transactions';
import { useState, useEffect } from 'react';
import _ from 'lodash';

type SpendingByAccountObject = {
    account: TAccount;
    totalTransactions: number;
    totalAmount: number;
};

export const useSpendingByAccount = (
    transactions: TTransaction[],
    accounts: TAccount[]
): SpendingByAccountObject[] => {
    const [spendingByAccount, setSpendingByAccount] = useState<
        SpendingByAccountObject[]
    >([]);

    useEffect(() => {
        setSpendingByAccount(
            _.orderBy(
                accounts.map((account) => {
                    const filteredTransactions = transactions.filter(
                        (transaction) =>
                            transaction.account_id == account.account_id
                    );

                    let amounts = filteredTransactions.map((t) => t.amount);

                    const totalAmount = amounts.reduce((a, b) => {
                        return a + b;
                    }, 0);

                    return {
                        account,
                        totalTransactions: filteredTransactions.length,
                        totalAmount,
                    };
                }),
                ['totalAmount'],
                ['desc']
            )
        );
    }, [transactions]);

    return spendingByAccount;
};
