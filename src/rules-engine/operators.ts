import { Operator } from 'json-rules-engine';

const customOperators: Operator[] = [];

customOperators.push(
    new Operator<string, string>('startsWith', (factValue, jsonValue) => {
        if (!factValue.length) return false;
        return factValue.toLowerCase().startsWith(jsonValue.toLowerCase());
    })
);

customOperators.push(
    new Operator<string, string>('endsWith', (factValue, jsonValue) => {
        if (!factValue.length) return false;
        return factValue.toLowerCase().endsWith(jsonValue.toLowerCase());
    })
);

customOperators.push(
    new Operator<string, string>('contains', (factValue, jsonValue) => {
        if (!factValue.length) return false;
        return factValue.includes(jsonValue);
    })
);

customOperators.push(
    new Operator<string, RegExp>('regexMatch', (factValue, jsonValue) => {
        if (!factValue.length) return false;
        return jsonValue.test(factValue);
    })
);

export { customOperators };
