import { AuthRequest } from '@src/types';
import { Response, NextFunction, Request } from 'express';
import ErrorResponse from '@src/utils/errorResponse';
import asyncHandler from '@middleware/async';
import { Rule } from 'json-rules-engine';
import { TransactionRule } from './rules.model';

import { applyRulesToTransactions } from '@src/rules-engine';
import { Transaction } from '../transactions/transactions.model';
import _ from 'lodash';

// @route POST /rules
// @desc Add transaction rules
// @access Private
export const addRules = asyncHandler(
    async (
        req: AuthRequest<{}, {}, Rule[]>,
        res: Response,
        next: NextFunction
    ) => {
        const rules: Rule[] = req.body.map((rule) => {
            return new Rule({
                name: rule.name,
                conditions: rule.conditions,
                event: rule.event,
                priority: rule.priority,
            });
        });

        const transactionRules = rules.map((rule) => {
            return {
                rule: rule.toJSON(),
                user_id: req.user.id,
            };
        });

        const insertedRules = await TransactionRule.query().insertAndFetch(
            transactionRules
        );

        res.status(201).json({
            success: true,
            data: insertedRules,
            meta: {
                count: insertedRules.length,
            },
        });
    }
);

// @route GET /rules
// @desc Get all transaction rules
// @access Private
export const getRules = asyncHandler(
    async (
        req: AuthRequest<{}, {}, TransactionRule[]>,
        res: Response,
        next: NextFunction
    ) => {
        const rules = await TransactionRule.query().where(
            'user_id',
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: rules,
            meta: {
                count: rules.length,
            },
        });
    }
);

type ApplyRulesBody = {
    transaction_ids: number[];
    transaction_rule_ids: number[];
};

export const applyRules = asyncHandler(
    async (
        req: AuthRequest<{}, {}, ApplyRulesBody>,
        res: Response,
        next: NextFunction
    ) => {
        const { transaction_ids, transaction_rule_ids } = req.body;

        const transactions = await getTransactions(
            transaction_ids,
            req.user.id
        );
        const rules = await getUsersRules(transaction_rule_ids, req.user.id);

        const { updatedTransactions, deletedTransactions } =
            await applyRulesToTransactions(transactions, rules, {
                dryRun: false,
            });

        res.status(200).json({
            success: true,
            data: {
                updatedTransactions,
                deletedTransactions,
            },
            meta: {
                updatedTransactionsCount: updatedTransactions.length,
                deletedTransactionsCount: deletedTransactions.length,
            },
        });
    }
);

// @route POST /rules/preview
// @desc Gets preview of applied rules
// @access Private
export const getPreviewOfAppliedRules = asyncHandler(
    async (
        req: AuthRequest<{}, {}, ApplyRulesBody>,
        res: Response,
        next: NextFunction
    ) => {
        const { transaction_ids, transaction_rule_ids } = req.body;

        const transactions = await getTransactions(
            transaction_ids,
            req.user.id
        );
        const rules = await getUsersRules(transaction_rule_ids, req.user.id);

        const { updatedTransactions, deletedTransactions } =
            await applyRulesToTransactions(transactions, rules);

        res.status(200).json({
            success: true,
            data: {
                updatedTransactions,
                deletedTransactions,
            },
            meta: {
                updatedTransactionsCount: updatedTransactions.length,
                deletedTransactionsCount: deletedTransactions.length,
            },
        });
    }
);

// Given array of transaction_ids, it returns the transactions.
// If no transaction_ids given, it will return all of the user's transactions
const getTransactions = async (transaction_ids: number[], user_id: number) => {
    let transactions: Transaction[] = [];
    if (transaction_ids.length == 0) {
        transactions = (await Transaction.fetchChildren()
            .withGraphFetched('tags')
            .withGraphFetched('category')
            .withGraphFetched('account.*')
            .orderBy('date', 'DESC')
            .where(`user_id`, user_id)
            .context({ flatten: true })) as Transaction[];
    } else {
        transactions = (await Transaction.fetchChildren()
            .withGraphFetched('tags')
            .withGraphFetched('category')
            .withGraphFetched('account.*')
            .orderBy('date', 'DESC')
            .where(`user_id`, user_id)
            .whereIn('transaction_id', transaction_ids)
            .context({ flatten: true })) as Transaction[];
    }
    return transactions;
};

const getUsersRules = async (rule_ids: number[], user_id: number) => {
    let rules: TransactionRule[] = [];
    if (rule_ids.length == 0) {
        rules = (await TransactionRule.query()
            .where(`user_id`, user_id)
            .where('enabled', true)) as TransactionRule[];
    } else {
        rules = (await TransactionRule.query()
            .where(`user_id`, user_id)
            .where('enabled', true)
            .whereIn('transaction_rule_id', rule_ids)) as TransactionRule[];
    }
    return rules.map((r) => {
        return new Rule(r.rule);
    });
};

interface DeleteRequestQuery {
    id: number;
}

export const deleteRule = asyncHandler(
    async (
        req: AuthRequest<DeleteRequestQuery, {}, TransactionRule[]>,
        res: Response,
        next: NextFunction
    ) => {
        const deletedRule = await TransactionRule.query()
            .delete()
            .where(`transaction_rule_id`, req.params.id)
            .where(`user_id`, req.user.id)
            .first();

        if (!deletedRule) {
            return next(
                new ErrorResponse(
                    `Transaction rule with id ${req.params.id} not found`,
                    404,
                    null
                )
            );
        }

        res.status(200).json({
            success: true,
            data: {},
            meta: { count: deletedRule },
        });
    }
);

interface EditRuleBody extends Omit<TransactionRule, 'rule'> {
    rule: Rule;
}

// @route PUT /rules
// @desc Update rule, must send a whole new rule as request
// @access Private
export const editRules = asyncHandler(
    async (
        req: AuthRequest<{}, {}, EditRuleBody[]>,
        res: Response,
        next: NextFunction
    ) => {
        let updatedRules: TransactionRule[] = [];
        for (const rule of req.body) {
            try {
                const newRule = new Rule({
                    name: rule.rule.name,
                    conditions: rule.rule.conditions,
                    event: rule.rule.event,
                    priority: rule.rule.priority,
                });

                console.log(newRule);

                updatedRules.push({
                    transaction_rule_id: rule.transaction_rule_id,
                    enabled: rule.enabled,
                    rule: newRule.toJSON(),
                    user_id: req.user.id,
                } as TransactionRule);
            } catch (err) {
                return next(
                    new ErrorResponse(
                        `Unable to create new rule`,
                        422,
                        err as Error
                    )
                );
            }
        }

        updatedRules = await TransactionRule.updateEntities(updatedRules);

        res.status(200).json({
            success: true,
            data: updatedRules,
            meta: { count: updatedRules.length },
        });
    }
);
