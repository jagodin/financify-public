import BaseResourceDuck, {
    BaseResourceDuckReducer,
    BaseResourceDuckSagas,
    BaseResourceDuckOptions,
    BaseResourceDuckInstance,
    TMessage,
} from '../base-resource/types/baseDuck';
import { takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import produce from 'immer';
import {
    TStatuses,
    TAction,
    TTakes,
    TConsts,
    consts,
    TPayload,
} from '../base-resource';
import { call, put } from 'redux-saga/effects';
import { SingularResourceResponse } from 'services/index';
import { notification } from 'utils/notification';
import { DuckTakes, DuckCreators } from 'extensible-duck';

export interface TState {
    status: keyof TStatuses;
    error: string | null;
    [key: string]: any;
}

export interface TActionCreators
    extends Record<string, (...args: any[]) => TAction> {}

export interface TActionTypes {
    FETCH: unknown;
    FETCH_PENDING: unknown;
    FETCH_SUCCESS: unknown;
    FETCH_ERROR: unknown;
    UPDATE: unknown;
    UPDATE_PENDING: unknown;
    UPDATE_SUCCESS: unknown;
    UPDATE_ERROR: unknown;
    CREATE: unknown;
    CREATE_PENDING: unknown;
    CREATE_SUCCESS: unknown;
    CREATE_FAILURE: unknown;
    DELETE: unknown;
    DELETE_SUCCESS: unknown;
    DELETE_PENDING: unknown;
    DELETE_FAILURE: unknown;
}

export interface TSelectors
    extends Record<string, (s: TState, ...args: any[]) => any> {
    isUpdating: (s: TState) => boolean;
    isFetching: (s: TState) => boolean;
}

export interface TSagas extends Record<string, (...args: any[]) => any> {
    fetch: (...args: any[]) => any;
    update: (...args: any[]) => any;
    // create: () => Generator<TAction>;
    // delete: () => Generator<TAction>;
}

const baseInitialState: TState = {
    status: 'READY',
    error: null,
};

const types: Array<keyof TActionTypes> = [
    'FETCH',
    'FETCH_PENDING',
    'FETCH_SUCCESS',
    'FETCH_ERROR',
    'UPDATE',
    'UPDATE_PENDING',
    'UPDATE_SUCCESS',
    'UPDATE_ERROR',
    'CREATE',
    'CREATE_PENDING',
    'CREATE_SUCCESS',
    'CREATE_FAILURE',
    'DELETE',
    'DELETE_SUCCESS',
    'DELETE_PENDING',
    'DELETE_FAILURE',
];

const selectors: TSelectors = {
    isUpdating: (s) => s.status === 'EDITING',
    isFetching: (s) => s.status === 'LOADING',
};

const reducer: BaseResourceDuckReducer<
    TState,
    TAction,
    TActionTypes,
    TActionCreators,
    TSelectors,
    TSagas,
    TTakes,
    TConsts
> = (state, action, duck) => {
    const { types, store, options } = duck;
    return produce(state, (draft) => {
        switch (action.type) {
            case types.FETCH_PENDING:
                draft.status = 'LOADING';
                break;
            case types.FETCH_SUCCESS:
                draft.status = 'READY';
                draft[store] = action.payload;
                break;
            case types.FETCH_ERROR:
                draft.status = 'ERROR';
                break;
            case types.UPDATE_PENDING:
                draft.status = 'EDITING';
                break;
            case types.UPDATE_SUCCESS:
                draft.status = 'READY';
                draft[store] = action.payload;
                break;
            case types.UPDATE_ERROR:
                draft.status = 'ERROR';
                break;
        }
    });
};

export const fetch = ({
    types,
    options,
}: BaseResourceDuckInstance<
    TState,
    TAction,
    TActionTypes,
    TActionCreators,
    TSelectors,
    TSagas,
    TTakes,
    TConsts
>) =>
    function* () {
        const { service, message } =
            options as unknown as BaseResourceDuckOptions<
                TState,
                TAction,
                TActionTypes,
                TActionCreators,
                TSelectors,
                TSagas,
                TTakes,
                TConsts
            >;

        try {
            yield put({ type: types.FETCH_PENDING });

            const response: SingularResourceResponse = yield call(
                service.fetch
            );

            if (response.success) {
                yield put({
                    type: types.FETCH_SUCCESS,
                    payload: response.data,
                });
            } else {
                yield call(notification, {
                    notification_type: 'error',
                    message: `There was an error fetching ${message.singular}.`,
                });
            }
        } catch (err) {
            yield call(notification, {
                notification_type: 'error',
                message: `There was an error fetching ${message.singular}.`,
            });
        }
    };

export const update = ({
    types,
    options,
}: BaseResourceDuckInstance<
    TState,
    TAction,
    TActionTypes,
    TActionCreators,
    TSelectors,
    TSagas,
    TTakes,
    TConsts
>) =>
    function* ({ payload, actionOptions }: TAction) {
        const { service, message } =
            options as unknown as BaseResourceDuckOptions<
                TState,
                TAction,
                TActionTypes,
                TActionCreators,
                TSelectors,
                TSagas,
                TTakes,
                TConsts
            >;

        try {
            yield put({ type: types.UPDATE_PENDING });

            const response: SingularResourceResponse = yield call(
                service.update,
                payload
            );

            if (response.success) {
                yield put({
                    type: types.UPDATE_SUCCESS,
                    payload: response.data,
                });
                if (actionOptions?.showNotification) {
                    yield call(notification, {
                        notification_type: 'info',
                        message: `${message.singular} updated successfully.`,
                    });
                }
            } else {
                yield call(notification, {
                    notification_type: 'error',
                    message: `There was an error updating ${message.singular}.`,
                });
            }
        } catch (err) {
            console.error(err);
            yield call(notification, {
                notification_type: 'error',
                message: `There was an error updating ${message.singular}.`,
            });
        }
    };

const sagas: BaseResourceDuckSagas<
    TState,
    TAction,
    TActionTypes,
    TActionCreators,
    TSelectors,
    TSagas,
    TTakes,
    TConsts
> = (d) => {
    return {
        fetch: fetch(d),
        update: update(d),
    };
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
> = (d) => {
    return {};
};

const takes: DuckTakes<
    TState,
    TAction,
    TActionTypes,
    TActionCreators,
    TSelectors,
    TSagas,
    TTakes,
    TConsts
> = (d) => {
    return [
        takeEvery(d.types.FETCH, d.sagas.fetch),
        takeEvery(d.types.UPDATE, d.sagas.update),
    ];
};

type TCreateDuckOptions = {
    namespace: string;
    store: string;
    id: string;
    service: any;
    message: TMessage;
    initialState?: Record<string, any>;
};

const createDuck = ({
    namespace,
    store,
    initialState = {},
    id,
    service,
    message,
}: TCreateDuckOptions): BaseResourceDuck<
    TState,
    TAction,
    TActionTypes,
    TActionCreators,
    TSelectors,
    TSagas,
    TTakes,
    TConsts
> => {
    return new BaseResourceDuck<
        TState,
        TAction,
        TActionTypes,
        TActionCreators,
        TSelectors,
        TSagas,
        TTakes,
        TConsts
    >({
        initialState: {
            ...baseInitialState,
            ...initialState,
        },
        creators,
        reducer,
        namespace,
        store,
        selectors,
        takes,
        sagas,
        types,
        consts,
        id,
        service,
        message,
    });
};

export { createDuck };
