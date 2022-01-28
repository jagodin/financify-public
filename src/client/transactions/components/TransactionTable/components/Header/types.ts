import { Moment } from 'moment';

export enum FilterType {
    STRING_FILTER = 'STRING_FILTER',
    NUMBER_FILTER = 'NUMBER_FILTER',
    DATE_FILTER = 'DATE_FILTER',
    OBJECT_FILTER = 'OBJECT_FILTER',
}

export interface FilterModel {
    filterId: string;
    type: FilterType;
}

export enum StringComparatorType {
    startsWith = 'starts with',
    contains = 'contains',
    equal = 'is equal to',
    notEqual = 'is not equal to',
    endsWith = 'ends with',
}

export interface StringFilterModel extends FilterModel {
    type: FilterType.STRING_FILTER;
    input: string;
    comparator: StringComparatorType;
    field: string;
}

export enum NumberComparatorType {
    notEqual = 'is not equal to',
    equal = 'is equal to',
    greaterThan = 'is greater than',
    greaterThanOrEqual = 'is greater than or equal to',
    lessThan = 'is less than',
    lessThanOrEqual = 'is less than or equal to',
    between = 'is between',
}

export interface NumberFilterModel extends FilterModel {
    type: FilterType.NUMBER_FILTER;
    input: number;
    input2?: number;
    comparator: NumberComparatorType;
    field: string;
}

export enum DateComparatorType {
    on = 'is on',
    before = 'is before',
    after = 'is after',
    between = 'is between',
}

export interface DateFilterModel extends FilterModel {
    type: FilterType.DATE_FILTER;
    date1: Moment;
    date2?: Moment;
    comparator: DateComparatorType;
    field: string;
}

export enum ObjectComparatorType {
    equal = 'is equal to',
    notEqual = 'is not equal to',
}

export interface ObjectFilterModel extends FilterModel {
    type: FilterType.OBJECT_FILTER;
    field: string;
    comparator: ObjectComparatorType;
    objectValue: string | null;
    objectKey: string;
}

export type Filter =
    | StringFilterModel
    | NumberFilterModel
    | DateFilterModel
    | ObjectFilterModel;
