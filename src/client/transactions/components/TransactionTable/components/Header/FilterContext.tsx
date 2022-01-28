import { createContext, useState } from 'react';
import { Filter } from './types';

export interface FilterContextProps {
    filters: Filter[];
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
    addFilter: (filter: Filter) => void;
    removeFilter: (filterId: string) => void;
    removeAllFilters: () => void;
    globalSearch: string;
    setGlobalSearch: React.Dispatch<React.SetStateAction<string>>;
    isFilterPresent: (field: string) => boolean;
    openFilterPanel: () => void;
    closeFilterPanel: () => void;
    filterPanelOpen: boolean;
    setFilterPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFilterContextValues = (): FilterContextProps => {
    const [filters, setFilters] = useState<Filter[]>([]);
    const [globalSearch, setGlobalSearch] = useState<string>('');
    const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);

    const addFilter = (filter: Filter) => {
        setFilters((filters) => [...filters, filter]);
    };

    const removeFilter = (filter_id: string) => {
        setFilters((filters) => {
            const filter = filters.find(
                (filter) => filter.filterId == filter_id
            );
            if (filter?.field == 'name') {
                setGlobalSearch('');
            }
            const newFilters = filters.filter(
                (filter) => filter.filterId != filter_id
            );

            return newFilters;
        });
    };

    const removeAllFilters = () => {
        setFilters([]);
    };

    const isFilterPresent = (field: string) => {
        return filters.find((filter) => filter.field == field) != undefined;
    };

    const openFilterPanel = () => {
        setFilterPanelOpen(true);
    };

    const closeFilterPanel = () => {
        setFilterPanelOpen(false);
    };

    return {
        filters,
        setFilters,
        addFilter,
        removeFilter,
        removeAllFilters,
        globalSearch,
        setGlobalSearch,
        isFilterPresent,
        closeFilterPanel,
        openFilterPanel,
        filterPanelOpen,
        setFilterPanelOpen,
    };
};

const filterContextDefaulValues: FilterContextProps = {
    filters: [],
    setFilters: () => null,
    addFilter: () => null,
    removeFilter: () => null,
    removeAllFilters: () => null,
    globalSearch: '',
    setGlobalSearch: () => null,
    isFilterPresent: () => false,
    closeFilterPanel: () => null,
    openFilterPanel: () => null,
    filterPanelOpen: false,
    setFilterPanelOpen: () => null,
};

export const FilterContext = createContext<FilterContextProps>(
    filterContextDefaulValues
);
