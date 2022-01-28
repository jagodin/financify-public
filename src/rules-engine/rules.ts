import { Rule } from 'json-rules-engine';

const rule: Rule = new Rule({
    conditions: {
        any: [
            {
                fact: 'name',
                operator: 'startsWith',
                value: 'a',
            },
        ],
    },
    event: {
        type: 'multiple',
        params: [
            // Need to overwrite this type and allow only allowed event types (SET_NAME, SET_TAGS, etc)
            {
                type: 'SET_NAME',
                // params: {
                //     value: 'test',
                // },
            },
        ],
    },
});

export { rule };
