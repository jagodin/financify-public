import { Input } from 'antd';
import { useState, useContext } from 'react';
import { FilterContext } from './FilterContext';
import { FilterType, StringComparatorType, StringFilterModel } from './types';

interface SearchProps {
    setFilter: (columnId: string, updater: any) => void;
}

const SearchBar = ({ setFilter }: SearchProps) => {
    const { setFilters, globalSearch, setGlobalSearch } =
        useContext(FilterContext);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilter: StringFilterModel = {
            type: FilterType.STRING_FILTER,
            comparator: StringComparatorType.contains,
            field: 'name',
            input: e.target.value,
            filterId: 'not-needed',
        };
        setGlobalSearch(e.target.value);
        setFilters((filters) => {
            const nameFilter = filters.findIndex(
                (filter) => filter.field == 'name'
            );
            if (e.target.value == '') {
                return filters.filter((filter) => filter.field != 'name');
            }
            if (nameFilter > -1) {
                // 1. edit the filter if there is one
                const newFilterArr = [...filters];
                newFilterArr[nameFilter] = newFilter;
                return newFilterArr;
            } else {
                // 2. add the filter if there isn't one
                return [...filters, newFilter];
            }
        });

        // setFilter('name', newFilter);
    };

    return (
        <Input
            onChange={handleOnChange}
            placeholder='Search Transactions'
            value={globalSearch}
        />
    );
};

export { SearchBar };
