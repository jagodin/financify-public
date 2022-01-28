import { Transaction } from '@src/api/transactions/transactions.model';
import { Engine, Rule, Fact, Event } from 'json-rules-engine';
import { customOperators } from './operators';
import { rule } from './rules';
import _ from 'lodash';

/**
 * Types
 */

export enum TransactionEventType {
    SET_NAME = 'SET_NAME',
    SET_TAGS = 'SET_TAGS',
    SET_NOTE = 'SET_NOTE',
    SET_CATEGORY = 'SET_CATEGORY',
    DELETE = 'DELETE',
    MARK_CLEARED = 'MARK_CLEARED',
}

interface TransactionEvent {
    type: TransactionEventType;
    params: Record<string, any>;
}

interface MultipleEvent extends Event {
    type: 'multiple';
    params: Array<TransactionEvent>;
}

interface ApplyRulesToTransactionsOptions {
    dryRun?: boolean;
}

export const applyRulesToTransactions = async (
    transactions: Transaction[],
    rules: Rule[],
    options: ApplyRulesToTransactionsOptions = { dryRun: true }
) => {
    const engine = new Engine();

    customOperators.forEach((operator) => {
        engine.addOperator(operator);
    });

    rules.forEach((rule) => {
        engine.addRule(rule);
    });

    const untouchedTransactions: Transaction[] = [];
    const deletedTransactions: Transaction[] = [];
    const updatedTransactions: Transaction[] = [];

    for (const [index, transaction] of transactions.entries()) {
        try {
            const { events } = await engine.run(transaction);

            // Only one event (event of type 'multiple') in the events array
            const event = events[0] as MultipleEvent;

            if (!event) {
                untouchedTransactions.push(transaction);
                continue;
            }

            const params = event.params;

            // create a copy of the transaction to edit
            const newTransaction = {
                transaction_id: transaction.transaction_id,
                transaction_kind: transaction.transaction_kind,
                user_id: transaction.user_id,
            };

            // flag to determine if transaction has in fact been edited
            let transactionEdited = false;
            let transactionDeleted = false;

            for (const event of params) {
                try {
                    switch (event.type) {
                        case 'SET_NAME':
                            newTransaction['name'] = event.params.value;
                            transactionEdited = true;
                            break;
                        case 'SET_TAGS':
                            newTransaction['tags'] = event.params.value;
                            transactionEdited = true;
                            break;
                        case 'SET_NOTE':
                            newTransaction['note'] = event.params.value;
                            transactionEdited = true;
                            break;

                        case 'SET_CATEGORY':
                            newTransaction['category_id'] =
                                event.params.value.category_id;
                            transactionEdited = true;
                            break;

                        case 'DELETE':
                            transactionDeleted = true;
                            break;
                        case 'MARK_CLEARED':
                            newTransaction['status'] = 'cleared';
                            transactionEdited = true;
                            break;
                        default:
                            console.log(`Event type ${event.type} not found`);
                            break;
                    }
                } catch (err) {
                    console.error(
                        `Unable to process event ${event.type}: ${err}`
                    );
                }
            }

            if (transactionEdited && !transactionDeleted) {
                updatedTransactions.push(newTransaction as Transaction);
            }

            if (transactionDeleted) {
                deletedTransactions.push(transaction);
            }
        } catch (err) {
            console.error(`Unable to run rules engine: ${err}`);
        }
    }

    // Make the updates in the DB if its not a dry run
    if (!options.dryRun) {
        try {
            await Transaction.updateEntities(updatedTransactions);
        } catch (err) {
            console.error(`unable to update transactions: ${err}`);
        }

        try {
            const deletedTransactionIds = deletedTransactions.map(
                (t) => t.transaction_id
            );
            await Transaction.query()
                .delete()
                .whereIn('transaction_id', deletedTransactionIds);
        } catch (err) {
            console.error(`unable to delete transactions: ${err}`);
        }
    }

    return {
        updatedTransactions,
        deletedTransactions,
        untouchedTransactions,
    };
};
