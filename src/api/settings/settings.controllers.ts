import { AuthRequest } from '@src/types';
import { Response, NextFunction } from 'express';
import ErrorResponse from '@src/utils/errorResponse';
import asyncHandler from '@middleware/async';
import { Settings } from './settings.model';

// @route GET /settings
// @desc Get all user settings
// @access Private
export const getSettings = asyncHandler(
    async (req: AuthRequest<{}, {}, {}>, res: Response, next: NextFunction) => {
        const settings = await Settings.query()
            .where('user_id', req.user.id)
            .first();

        res.status(200).json({
            success: true,
            data: settings,
            meta: {
                count: 1,
            },
        });
    }
);

// @route PUT /settings
// @desc Update user settings
// @access Private
export const updateSettings = asyncHandler(
    async (
        req: AuthRequest<{}, {}, Settings>,
        res: Response,
        next: NextFunction
    ) => {
        const setting = req.body;
        const newSetting = {
            user_id: setting.user_id,
            widget_spending_account_even_spending:
                setting.widget_spending_account_even_spending,
            widget_spending_account_sort_by:
                setting.widget_spending_account_sort_by,
            transaction_widget_order: setting.transaction_widget_order,
        };

        const updatedSettings = await Settings.query()
            .patch(newSetting)
            .where('user_id', req.user.id)
            .first()
            .returning('*');

        res.status(200).json({
            success: true,
            data: updatedSettings,
            meta: {
                count: 1,
            },
        });
    }
);
