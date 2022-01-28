import TagService from '../../../services/TagService';
import { createDuck } from '../utils/base-resource';
import {
    TAction,
    TActionTypes,
    TSagas,
    TTakes,
    TConsts,
} from '../utils/base-resource/index';

export interface TTag {
    name: string;
    color: string;
    tag_id: number;
    user_id: number;
}

type TTagState = {
    tags: Array<TTag>;
};

type TTagActionCreators = {
    fetchTags: () => TAction;
    fetchTag: (id: number) => TAction;
    updateTags: (accounts: Array<Record<string, any>>) => TAction;
    addTags: (accounts: Array<Record<string, any>>) => TAction;
    deleteTags: (ids: Array<number>) => TAction;
    deleteTag: (id: number) => TAction;
};

export interface TTagSelectors
    extends Record<string, (s: TTagState, ...args: any[]) => any> {}

const TagsDuck = createDuck({
    namespace: 'financify',
    store: 'tags',
    id: 'tag_id',
    service: TagService,
    message: {
        singular: 'Tag',
        plural: 'Tags',
    },
    initialState: {
        tags: [],
    },
}).extend<
    TTagState,
    TAction,
    TActionTypes,
    TTagActionCreators,
    TTagSelectors,
    TSagas,
    TTakes,
    TConsts
>({
    creators: (d) => {
        return {
            fetchTags: () => ({ type: d.types.FETCH_ALL }),
            fetchTag: (id: number) => ({
                type: d.types.FETCH_ONE,
                payload: id,
            }),
            addTags: (data: Array<Record<string, any>>) => ({
                type: d.types.CREATE,
                payload: data,
            }),
            updateTags: (data: Array<Record<string, any>>) => ({
                type: d.types.UPDATE,
                payload: data,
            }),
            deleteTag: (id: number) => ({
                type: d.types.DELETE_ONE,
                payload: id,
            }),
            deleteTags: (ids: number[]) => ({
                type: d.types.DELETE_MANY,
                payload: ids,
            }),
        };
    },
});

export { TagsDuck };
