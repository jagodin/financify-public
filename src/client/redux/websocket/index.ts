import Duck, {
    DuckCreators,
    DuckReducer,
    DuckSagas,
    DuckInstance,
} from 'extensible-duck';
import { TTakes } from '../utils/base-resource';
import produce from 'immer';
import { notification } from 'utils/notification';

interface TActionTypes {
    WS_CONNECT: unknown;
    WS_CONNECTING: unknown;
    WS_CONNECTED: unknown;
    WS_DISCONNECT: unknown;
    WS_DISCONNECTED: unknown;
    WS_MESSAGE: unknown;
    WS_SEND_MESSAGE: unknown;
}

export interface MessageModel {
    type: string;
}

interface TState {
    clientId: string | null;
}

interface TConsts extends Record<string, string[]> {}
interface TSelectors
    extends Record<string, (s: TState, ...args: any[]) => any> {}
interface TActionCreators extends Record<string, (...args: any[]) => TAction> {
    wsConnect: () => TAction;
    wsDisconnect: (host: string) => TAction;
    wsDisconnected: (host: string) => TAction;
    wsSendMessage: (data: any) => ISendMessage;
    wsConnected: () => TAction;
}
interface TSagas extends Record<string, any> {
    message: any;
}

export interface ISendMessage extends TAction {
    message: any;
}

export interface TAction {
    type: string;
    host?: string;
    message?: any;
    value?: any;
}

const reducer: DuckReducer<
    TState,
    TAction,
    TActionTypes,
    TActionCreators,
    TSelectors,
    TSagas,
    TTakes,
    TConsts
> = (state, action, duck) => {
    const { types } = duck;
    return produce(state, (draft) => {
        switch (action.type) {
            case types.WS_CONNECT:
                return { ...state, host: action.host };
            case types.WS_MESSAGE:
                switch (action.value.type) {
                    case 'welcome':
                        draft.clientId = action.value.clientId;
                        localStorage.setItem(
                            'Client-ID',
                            action.value.clientId
                        );
                        break;
                    case 'notification':
                        notification(action.value);

                        break;
                }
                break;
            default:
                return state;
        }
    });
};

export const types: Array<keyof TActionTypes> = [
    'WS_CONNECT',
    'WS_CONNECTED',
    'WS_CONNECTING',
    'WS_DISCONNECT',
    'WS_DISCONNECTED',
    'WS_MESSAGE',
    'WS_SEND_MESSAGE',
];

const initialState: TState = {
    clientId: null,
};

const creators: DuckCreators<
    TState,
    TAction,
    TActionTypes,
    TActionCreators,
    TSelectors,
    TSagas,
    TTakes,
    TConsts
> = (duck) => {
    return {
        wsConnect: () => ({ type: duck.types.WS_CONNECT }),
        wsDisconnect: (host: string) => ({
            type: duck.types.WS_DISCONNECT,
            host,
        }),
        wsDisconnected: (host: string) => ({
            type: duck.types.WS_DISCONNECTED,
            host,
        }),
        wsSendMessage: (message: any) => ({
            type: duck.types.WS_SEND_MESSAGE,
            message: message,
        }),
        wsConnected: () => ({
            type: duck.types.WS_CONNECTED,
        }),
    };
};

const selectors: TSelectors = {};

function* message(
    duck: DuckInstance<
        TState,
        TAction,
        TActionTypes,
        TActionCreators,
        TSelectors,
        TSagas,
        TTakes,
        TConsts
    >
) {}

const sagas: DuckSagas<
    TState,
    TAction,
    TActionTypes,
    TActionCreators,
    TSelectors,
    TSagas,
    TTakes,
    TConsts
> = (duck) => {
    return {
        message: message(duck),
    };
};

const wsDuck = new Duck<
    TState,
    TAction,
    TActionTypes,
    TActionCreators,
    TSelectors,
    TSagas,
    TTakes,
    TConsts
>({
    initialState,
    namespace: 'financify',
    store: 'websocket',
    types,
    creators,
    reducer,
    selectors,
});

export { wsDuck };
