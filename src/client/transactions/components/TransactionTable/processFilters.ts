import React from 'react';
import {
    DateComparatorType,
    Filter,
    FilterType,
    NumberComparatorType,
    ObjectComparatorType,
    StringComparatorType,
} from './components/Header/types';
import { TTransaction } from '@redux/ducks/transactions';
import { Filters, FilterTypes } from 'react-table';
import _ from 'lodash';
import moment from 'moment';

export const processFilters = (
    filters: Filter[],
    setFilter: (columnId: string, updater: any) => void,
    setAllFilters: (
        updater:
            | Filters<TTransaction>
            | ((filters: Filters<TTransaction>) => Filters<TTransaction>)
    ) => void
) => {
    if (filters.length == 0) {
        setAllFilters([]);
    } else {
        setAllFilters([]);
        for (const filter of filters) {
            switch (filter.field) {
                case 'name':
                    setFilter('name', filter);
                    break;
                case 'amount':
                    setFilter('amount', filter);
                    break;
                case 'category':
                    setFilter('category.name', filter);
                    break;
                case 'account':
                    setFilter('account.name', filter);
                    break;
                case 'date':
                    setFilter('date', filter);
                    break;
                case 'status':
                    setFilter('status', filter);
                    break;
                case 'note':
                    setFilter('note', filter);
                    break;
            }
        }
    }
};

export const filterTypes: FilterTypes<TTransaction> = {
    string: (rows, columnIds, filter: Filter) => {
        try {
            switch (filter.type) {
                case FilterType.STRING_FILTER:
                    switch (filter.comparator) {
                        case StringComparatorType.contains:
                            const result = rows.filter((row) =>
                                row.original[filter.field]
                                    .toLowerCase()
                                    .includes(filter.input.toLowerCase())
                            );
                            return result;
                        case StringComparatorType.startsWith:
                            return rows.filter((row) =>
                                row.original[filter.field]
                                    .toLowerCase()
                                    .startsWith(filter.input.toLowerCase())
                            );
                        case StringComparatorType.endsWith:
                            return rows.filter((row) =>
                                row.original[filter.field]
                                    .toLowerCase()
                                    .endsWith(filter.input.toLowerCase())
                            );
                        case StringComparatorType.equal:
                            return rows.filter(
                                (row) =>
                                    row.original[filter.field].toLowerCase() ==
                                    filter.input.toLowerCase()
                            );
                        case StringComparatorType.notEqual:
                            return rows.filter(
                                (row) =>
                                    row.original[filter.field].toLowerCase() !=
                                    filter.input.toLowerCase()
                            );
                        default:
                            console.error(
                                `No string comparator type for filter`
                            );
                            return rows;
                    }
            }
            return rows;
        } catch (err) {
            console.error(`Unable to use string filter: ${err}`);
            return rows;
        }
    },
    number: (rows, columnIds, filter: Filter) => {
        try {
            switch (filter.type) {
                case FilterType.NUMBER_FILTER:
                    switch (filter.comparator) {
                        case NumberComparatorType.equal:
                            return rows.filter(
                                (row) =>
                                    row.original[filter.field] == filter.input
                            );
                        case NumberComparatorType.notEqual:
                            return rows.filter(
                                (row) =>
                                    row.original[filter.field] != filter.input
                            );
                        case NumberComparatorType.greaterThan:
                            return rows.filter(
                                (row) =>
                                    row.original[filter.field] > filter.input
                            );
                        case NumberComparatorType.greaterThanOrEqual:
                            return rows.filter(
                                (row) =>
                                    row.original[filter.field] >= filter.input
                            );
                        case NumberComparatorType.lessThanOrEqual:
                            return rows.filter(
                                (row) =>
                                    row.original[filter.field] <= filter.input
                            );
                        case NumberComparatorType.lessThan:
                            return rows.filter(
                                (row) =>
                                    row.original[filter.field] < filter.input
                            );
                        case NumberComparatorType.between:
                            const input2 = filter.input2 as number;
                            return rows.filter(
                                (row) =>
                                    filter.input < row.original[filter.field] &&
                                    row.original[filter.field] < input2
                            );
                        default:
                            console.error(
                                `No number comparator type for filter`
                            );
                            return rows;
                    }
            }
            return rows;
        } catch (err) {
            console.error(`Unable to use number filter: ${err}`);
            return rows;
        }
    },
    object: (rows, columnIds, filter: Filter) => {
        try {
            switch (filter.type) {
                case FilterType.OBJECT_FILTER:
                    switch (filter.comparator) {
                        case ObjectComparatorType.equal:
                            return rows.filter((row) => {
                                if (
                                    row.original[filter.field] ==
                                    filter.objectValue
                                )
                                    return row;

                                if (_.isNil(row.original[filter.field]))
                                    return false;
                                return (
                                    row.original[filter.field][
                                        filter.objectKey
                                    ] == filter.objectValue
                                );
                            });
                        case ObjectComparatorType.notEqual:
                            return rows.filter((row) => {
                                if (
                                    filter.objectValue == null &&
                                    row.original[filter.field] !=
                                        filter.objectValue
                                )
                                    return row;
                                if (_.isNil(row.original[filter.field]))
                                    return false;
                                return (
                                    row.original[filter.field][
                                        filter.objectKey
                                    ] != filter.objectValue
                                );
                            });
                        default:
                            console.error(
                                `No object comparator type for filter`
                            );
                            return rows;
                    }
            }
            return rows;
        } catch (err) {
            console.error(`Unable to use object filter: ${err}`);
            return rows;
        }
    },
    date: (rows, columnIds, filter: Filter) => {
        try {
            switch (filter.type) {
                case FilterType.DATE_FILTER:
                    switch (filter.comparator) {
                        case DateComparatorType.on:
                            return rows.filter(
                                (row) =>
                                    row.original[filter.field] ==
                                    filter.date1.format('YYYY-MM-DD')
                            );
                        case DateComparatorType.after:
                            return rows.filter((row) =>
                                moment(
                                    row.original[filter.field],
                                    'YYYY-MM-DD'
                                ).isAfter(filter.date1)
                            );
                        case DateComparatorType.before:
                            return rows.filter((row) =>
                                moment(
                                    row.original[filter.field],
                                    'YYYY-MM-DD'
                                ).isBefore(filter.date1)
                            );
                        case DateComparatorType.between:
                            return rows.filter((row) =>
                                moment(
                                    row.original[filter.field],
                                    'YYYY-MM-DD'
                                ).isBetween(filter.date1, filter.date2)
                            );

                        default:
                            console.error(`No date comparator type for filter`);
                            return rows;
                    }
            }
            return rows;
        } catch (err) {
            console.error(`Unable to use date filter: ${err}`);
            return rows;
        }
    },
};
