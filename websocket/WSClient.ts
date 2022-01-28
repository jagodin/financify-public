import { v4 as uuid } from 'uuid';
import randomColor from 'randomcolor';
import { IncomingMessage } from 'http';

import { Client } from '@src/types';
import { Socket } from 'socket.io';

const acceptForwardedFor =
    process.env.WS_BEHIND_PROXY === 'true' ||
    process.env.WS_BEHIND_PROXY === 'yes';

export class WSClient implements Client {
    readonly clientId = uuid();
    readonly clientColor = randomColor({ luminosity: 'light' });
    readonly firstSeen = new Date();
    lastSeen = new Date();
    readonly remoteAddress: string;
    networkName: string;
    userId: number | null;
    ws: Socket;

    constructor(ws: Socket, req: IncomingMessage) {
        const address =
            acceptForwardedFor && req.headers['x-forwarded-for']
                ? req.headers['x-forwarded-for']
                : req.connection.remoteAddress;
        this.remoteAddress = typeof address === 'string' ? address : '';
        this.networkName = '';
        this.userId = null;
        this.ws = ws;
    }

    setNetworkName(
        networkName: string,
        networkMessage: (name: string) => void
    ) {
        const previousName = this.networkName;
        this.networkName = networkName;

        if (previousName) {
            networkMessage(previousName);
        }

        if (networkName) {
            networkMessage(networkName);
        }
    }

    setUserId(userId: number) {
        this.userId = userId;
    }

    send(data: string) {
        if (this.ws.connected !== true) {
            return;
        }

        this.ws.send(data);
    }

    get readyState() {
        return this.ws.connected;
    }

    close() {
        this.ws.disconnect();
    }
}
