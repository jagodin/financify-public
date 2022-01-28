import { AuthRequest, NotificationModel } from '@src/types';
import { ClientManager } from './ClientManager';

export const sendNotificationToClient = (
    req: AuthRequest,
    data: NotificationModel
) => {
    const clientManager = req.app.get('clientManager') as ClientManager;

    if (!req.user) {
        console.error('No user object on request');
    }

    if (clientManager) {
        clientManager.sendToClientByUserId<NotificationModel>(
            req.user.id,
            data
        );
    } else {
        console.error('Could not find client manager');
    }
};
