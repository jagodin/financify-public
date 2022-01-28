import { TTransaction } from '@redux/ducks/transactions';
import { useState, useEffect } from 'react';

export const useGetStats = (transactions: TTransaction[]) => {
    const [totalExpense, setTotalExpense] = useState<number>(0);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalNet, setTotalNet] = useState<number>(0);

    useEffect(() => {
        const amounts = transactions.map((t) => t.amount);

        if (amounts.length > 0) {
            const expense = amounts.reduce((a, b) => {
                if (b > 0) {
                    return a + b;
                } else {
                    return a;
                }
            }, 0);
            setTotalExpense(expense);

            const income = amounts.reduce((a, b) => {
                if (b < 0) {
                    return a + Math.abs(b);
                } else {
                    return a;
                }
            }, 0);

            setTotalIncome(income);

            const net = income - expense;

            setTotalNet(net);
        } else {
            setTotalExpense(0);
            setTotalIncome(0);
            setTotalNet(0);
        }
    }, [transactions]);

    return { totalExpense, totalIncome, totalNet };
};
