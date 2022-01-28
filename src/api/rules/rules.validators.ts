import * as yup from 'yup';
import asyncHandler from '@middleware/async';
import { Request, Response, NextFunction } from 'express';

export const addRulesValidator = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        yup.array().of(ruleSchema).validateSync(req.body, { abortEarly: true });

        next();
    }
);

export const editRulesValidator = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        yup.array()
            .of(
                yup.object().shape({
                    transaction_rule_id: yup.number().required(),
                    rule: ruleSchema,
                })
            )
            .validateSync(req.body, { abortEarly: true });

        next();
    }
);

export const getPreviewOfAppliedRulesValidator = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        yup.object()
            .shape({
                transaction_ids: yup.array().of(yup.number()).defined(),
                transaction_rule_ids: yup.array().of(yup.number()).defined(),
            })
            .validateSync(req.body, { abortEarly: true });

        next();
    }
);

const ruleSchema = yup.object().shape({
    name: yup.string().required().min(1).max(60),
    conditions: yup
        .object()
        .shape({
            any: yup
                .array()
                .of(
                    yup.object().shape({
                        fact: yup
                            .mixed()
                            .oneOf(['name', 'note', 'amount', 'date'])
                            .required(),
                        operator: yup.string().required(),
                        value: yup.mixed().required(),
                    })
                )
                .optional(),
            all: yup
                .array()
                .of(
                    yup.object().shape({
                        fact: yup
                            .mixed()
                            .oneOf(['name', 'note', 'amount', 'date'])
                            .required(),
                        operator: yup.string().required(),
                        value: yup.mixed().required(),
                    })
                )
                .optional(),
        })
        .required(),
    event: yup
        .object()
        .shape({
            type: yup.mixed().oneOf(['multiple']).required(),
            params: yup
                .array()
                .of(
                    yup.object().shape({
                        type: yup
                            .mixed()
                            .oneOf([
                                'SET_NAME',
                                'SET_NOTE',
                                'SET_CATEGORY',
                                'SET_TAGS',
                                'DELETE',
                                'MARK_CLEARED',
                            ])
                            .required(),
                        params: yup.object().shape({
                            value: yup.mixed(),
                        }),
                    })
                )
                .required(),
        })
        .required(),
    priority: yup.number().optional(),
});
