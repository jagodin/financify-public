import {
    Client,
    MessageType,
    MessageModel,
    TargetedMessageModel,
    ClientModel,
    NetworkMessageModel,
    NotificationModel,
} from '@src/types';

export const maxSize = parseInt(process.env.WS_MAX_SIZE as string) || 65536;
export const noticeText = process.env.NOTICE_TEXT;
export const noticeUrl = process.env.NOTICE_URL;

export class ClientManager {
    private clients: Client[] = [];

    constructor() {
        this.sendNetworkMessage = this.sendNetworkMessage.bind(this);
    }

    addClient(client: Client) {
        const localClients = this.getLocalClients(client);

        let suggestedName: string | null = null;
        if (localClients.length > 0) {
            suggestedName = localClients[0].networkName;
        }

        this.clients.push(client);

        client.send({
            type: MessageType.WELCOME,
            clientId: client.clientId,
            clientColor: client.clientColor,
            suggestedName: suggestedName,
            maxSize,
            noticeText,
            noticeUrl,
        });
    }

    handleMessage(client: Client, message: MessageModel) {
        client.lastSeen = new Date();
        // client.publicKey = message.publicKey;

        if (message.networkName) {
            client.setNetworkName(
                message.networkName.toUpperCase(),
                this.sendNetworkMessage
            );
        }
    }

    sendMessage(fromClientId: string, message: TargetedMessageModel) {
        if (!message.targetId || message.targetId === fromClientId) {
            return;
        }

        const data = JSON.stringify({
            ...message,
            clientId: fromClientId,
        });

        const targets = this.clients.filter(
            (c) => c.clientId === message.targetId
        );
        targets.forEach((client) => client.send(data));
    }

    sendNetworkMessage(networkName: string) {
        const networkClients = this.clients.filter(
            (client) => client.networkName === networkName
        );

        const network: ClientModel[] = networkClients
            .sort((a, b) => b.firstSeen.getTime() - a.firstSeen.getTime())
            .map((client) => {
                return {
                    clientId: client.clientId,
                    clientColor: client.clientColor,
                    publicKey: client.publicKey,
                };
            });

        const networkMessage = JSON.stringify({
            type: MessageType.NETWORK,
            clients: network,
        } as NetworkMessageModel);

        networkClients.forEach((client) => {
            try {
                client.send(networkMessage);
            } catch {}
        });
    }

    getLocalClients(client: Client) {
        return this.clients
            .filter(
                (c) => c.remoteAddress === client.remoteAddress && c.networkName
            )
            .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
    }

    getAllClients() {
        return this.clients;
    }

    getClientByClientId(clientId: string) {
        return this.clients.find((c) => c.clientId == clientId);
    }

    getClientByUserId(userId: number) {
        return this.clients.find((c) => c.userId == userId);
    }

    sendToClientByUserId<MessageType extends MessageModel>(
        userId: number,
        data: MessageType
    ) {
        const client = this.getClientByUserId(userId);

        if (client && client.readyState == true) {
            client.send(data);
            console.log(
                `Sent data to client ${client.clientId} with userId ${client.userId}`
            );
        } else {
            console.log(`Websocket client not available for userId ${userId}`);
        }
    }

    pingClients() {
        const pingMessage = JSON.stringify({
            type: MessageType.PING,
            timestamp: new Date().getTime(),
        });

        this.clients.forEach((client) => {
            if (client.readyState !== true) return;

            try {
                client.send(pingMessage);
            } catch {
                this.removeClient(client);
                client.close();
            }
        });
    }

    removeClient(client: Client) {
        client.setNetworkName(null, this.sendNetworkMessage);
        this.clients = this.clients.filter((c) => c !== client);
    }

    removeBrokenClients() {
        this.clients = this.clients.filter((client) => {
            if (client.readyState === false) {
                return true;
            } else {
                client.setNetworkName(null, this.sendNetworkMessage);
                return false;
            }
        });
    }

    removeInactiveClients() {
        const minuteAgo = new Date(Date.now() - 1000 * 20);

        this.clients.forEach((client) => {
            if (client.readyState !== true) return;

            if (client.lastSeen < minuteAgo) {
                this.removeClient(client);
                client.close();
            }
        });
    }
}
